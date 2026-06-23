#!/usr/bin/env python3
"""safe-delete-file — delete a vault file without leaving dangling [[wikilinks]].

Deleting a note silently orphans every link that pointed to it — exactly the
broken links `vault-linter` later flags. This script finds those inbound links
first, corrects them, and only then removes the file. It is the inverse query of
`vault-linter`: "what links resolve TO this file?". The link-parsing rules below
deliberately mirror `vault-linter/lint.py` so both agree on what a link is.

  python3 .claude/skills/safe-delete-file/safe_delete.py <target>                 # DRY RUN (plan only)
  python3 .claude/skills/safe-delete-file/safe_delete.py <target> --apply         # fix links, then delete
  python3 .claude/skills/safe-delete-file/safe_delete.py <target> --redirect <new># repoint links to <new> instead of unlinking
  python3 .claude/skills/safe-delete-file/safe_delete.py <target> --apply --unlink-embeds  # also strip ![[embeds]]
  python3 .claude/skills/safe-delete-file/safe_delete.py <target> --apply --force  # delete despite context-loss risk

Default correction (a delete) is UNLINK: [[foo|Display]] -> Display, [[foo]] -> foo
(preserve the prose, drop the dead link). --redirect <new> repoints to <new> instead.

Three reference kinds are BLOCKERS — --apply refuses and lists them rather than guess:
  - embeds   ![[foo]]  — transclude content; no sensible text replacement (clear with
             --redirect, or --unlink-embeds to strip the embed token).
  - ambiguous bare links [[foo]] when another note also has basename `foo` — the link
             may point elsewhere; resolve by hand or path-qualify it.
  - context-loss risk — a file defers to the target for CONTENT ("see [[foo]]", "more in
             [[foo|the analysis]]"); deleting it drops that context. Choose: (a) --force to
             delete anyway, (b) MERGE the needed content into the referencing file(s) first
             (recommended), then --apply --force, or (c) abort. (Also cleared by --redirect.)

This script NEVER touches git (CLAUDE.md §5): it edits/removes files on disk only.
Staging and committing the deletion is the user's job. Run `vault-linter` after.

Exit codes: 0 ok (dry run or applied) · 2 usage/resolution error · 3 --apply refused (blockers).
"""
import argparse
import os
import re
import sys
from pathlib import Path

SKIP_DIRS = {".git", ".obsidian", ".trash"}
WIKILINK_RE = re.compile(r"!?\[\[([^\[\]]+?)\]\]")        # mirrors lint.py
INLINE_CODE_RE = re.compile(r"`[^`]*`")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
MDLINK_RE = re.compile(r"\]\(([^)]+)\)")                  # [text](url) — report-only

# Cue phrases that signal a file defers to the link for CONTENT (so deleting it loses context).
CONTEXT_CUE = re.compile(
    r"\b(see|read more|more (in|on|at|about)|details?( in| on)?|detailed|refer(s| to)?|"
    r"describ\w+|explain\w+|explanation|context|background|breakdown|deep[- ]?dive|"
    r"write-?up|elaborat\w+|continu\w+ in|cf\.?|in[- ]depth|further (detail|read)|"
    r"full(er)? (detail|analysis|breakdown|write-?up|version|story))\b", re.I)


def norm_path(linkpath: str) -> str:
    """Normalise a link's path part to a lowercased lookup key (drop .md, backslashes)."""
    p = linkpath.replace("\\", "").strip().lower()
    return p[:-3] if p.endswith(".md") else p


def code_spans(line: str):
    return [(m.start(), m.end()) for m in INLINE_CODE_RE.finditer(line)]


def walk_files(vault: Path):
    """Yield (relposix, abspath) for every file under vault, skipping VCS/Obsidian dirs."""
    for root, dirs, files in os.walk(vault):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            ab = Path(root) / f
            yield ab.relative_to(vault).as_posix(), ab


def bare_key(rel: str) -> str:
    """How a bare wikilink names a file: stem for notes, full name for attachments."""
    p = Path(rel)
    return (p.stem if p.suffix.lower() == ".md" else p.name).lower()


def parse_inner(raw: str):
    """Split a wikilink inner `path#heading|alias` into its parts."""
    path_part, alias = (raw.split("|", 1) + [None])[:2] if "|" in raw else (raw, None)
    link_path, heading = (path_part.split("#", 1)) if "#" in path_part else (path_part, None)
    return link_path.strip(), heading, (alias.strip() if alias is not None else None)


def is_context_bearing(line: str, alias) -> bool:
    """True if the line defers to the link for content (a cue phrase, or a multi-word alias)."""
    return bool(CONTEXT_CUE.search(line)) or (alias is not None and len(alias.split()) >= 2)


def link_form(rel: str, ambiguous: bool) -> str:
    """Preferred wikilink text for a target: bare basename if unique, else path (no .md)."""
    p = Path(rel)
    if ambiguous:
        return rel[:-3] if rel.lower().endswith(".md") else rel
    return p.stem if p.suffix.lower() == ".md" else p.name


def resolve_input(arg: str, vault: Path, all_files):
    """Resolve a CLI target/redirect to one rel path inside the vault, or raise SystemExit."""
    # Direct path (absolute or relative to cwd) that lands inside the vault.
    for cand in (Path(arg), Path(arg + ".md")):
        try:
            ab = cand.resolve()
            if ab.is_file() and vault in ab.parents:
                return ab.relative_to(vault).as_posix()
        except OSError:
            pass
    # Relative to the vault root.
    for cand in (vault / arg, Path(str(vault / arg) + ".md")):
        if cand.is_file():
            return cand.relative_to(vault).as_posix()
    # Basename match across the vault.
    key = Path(arg).name.lower()
    hits = [r for r in all_files if Path(r).name.lower() == key or Path(r).stem.lower() == key]
    if len(hits) == 1:
        return hits[0]
    if not hits:
        sys.exit(f"safe-delete: no file in the vault matches '{arg}'.")
    sys.exit("safe-delete: '%s' is ambiguous — pass a path. Matches:\n  %s"
             % (arg, "\n  ".join(sorted(hits))))


def find_references(notes, vault, target_rel, target_keys, ambiguous):
    """Scan notes for inbound links to target. Return (edits, ambig, context, md_warns).

    `edits` maps rel -> [(lineno, start, end, parts, ctx)] for every correctable ref,
    embeds included (parts[3] flags them); ambiguous bare links are held out for manual
    review. `ambig`/`context`/`md_warns` are (rel, lineno, ctx) display lists.
    """
    t_noext, t_bare = target_keys
    edits = {}
    ambig, context, md_warns = [], [], []

    for rel in notes:
        if rel == target_rel:
            continue
        try:
            text = (vault / rel).read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        in_fence = False
        for lineno, line in enumerate(text.splitlines(), 1):
            if FENCE_RE.match(line):
                in_fence = not in_fence
                continue
            if in_fence:
                continue
            spans = code_spans(line)
            for m in WIKILINK_RE.finditer(line):
                if any(s <= m.start() < e for s, e in spans):
                    continue                      # inside `inline code`
                link_path, heading, alias = parse_inner(m.group(1))
                if "{{" in link_path:             # template placeholder
                    continue
                np = norm_path(link_path)
                # Path-qualified (has a slash) -> match the full path; else bare basename.
                if "/" in np:
                    kind = "exact" if np == t_noext else None
                else:
                    kind = "basename" if np == t_bare else None
                if kind is None:
                    continue
                is_embed = m.group(0).startswith("!")
                ref = (rel, lineno, line.strip())
                if kind == "basename" and ambiguous:      # don't know which file it points to
                    ambig.append(ref)
                    continue
                edits.setdefault(rel, []).append(
                    (lineno, m.start(), m.end(), (link_path, heading, alias, is_embed), line.strip()))
                if not is_embed and is_context_bearing(line, alias):
                    context.append(ref)
            for m in MDLINK_RE.finditer(line):
                raw = m.group(1).split("#", 1)[0].strip().split(" ", 1)[0]
                url = norm_path(raw)
                if url and "://" not in url and (url == t_noext or url.split("/")[-1] == t_bare):
                    md_warns.append((rel, lineno, line.strip()))
    return edits, ambig, context, md_warns


def replacement_text(parts, redirect_form):
    """Compute the replacement string for one matched link."""
    link_path, heading, alias, is_embed = parts
    if redirect_form is not None:
        inner = redirect_form + (f"#{heading}" if heading else "") + (f"|{alias}" if alias is not None else "")
        return ("!" if is_embed else "") + f"[[{inner}]]"
    if is_embed:
        return ""                                  # strip embed token (--unlink-embeds)
    return alias if alias else (link_path.replace("\\", "").rstrip("/").split("/")[-1]).removesuffix(".md")


def apply_edits(edits, vault, redirect_form, drop_embeds):
    """Rewrite each referencing file in place. Return (references_fixed, files_changed).

    Embeds are corrected only when cleared (--redirect or --unlink-embeds); otherwise they
    are left untouched (and would have been blockers upstream). Only files whose content
    actually changes are written. Replacements run right-to-left so spans never drift.
    """
    fixed = changed = 0
    for rel, items in edits.items():
        original = (vault / rel).read_text(encoding="utf-8")
        lines = original.splitlines(keepends=True)
        by_line = {}
        for lineno, start, end, parts, _ctx in items:
            by_line.setdefault(lineno, []).append((start, end, parts))
        for lineno, spans in by_line.items():
            raw = lines[lineno - 1]
            nl = "\n" if raw.endswith("\n") else ""
            body = raw[:-1] if nl else raw
            for start, end, parts in sorted(spans, reverse=True):
                if parts[3] and not (drop_embeds or redirect_form is not None):
                    continue
                body = body[:start] + replacement_text(parts, redirect_form) + body[end:]
                fixed += 1
            lines[lineno - 1] = body + nl
        new = "".join(lines)
        if new != original:
            (vault / rel).write_text(new, encoding="utf-8")
            changed += 1
    return fixed, changed


def main() -> int:
    ap = argparse.ArgumentParser(description="Delete a vault file and correct inbound [[wikilinks]].")
    ap.add_argument("target", help="file to delete (path or basename, inside the vault)")
    ap.add_argument("--apply", action="store_true", help="perform the corrections and delete (default: dry run)")
    ap.add_argument("--redirect", metavar="NEW", help="repoint inbound links to NEW instead of unlinking")
    ap.add_argument("--unlink-embeds", action="store_true", help="allow --apply to strip ![[embeds]] of the target")
    ap.add_argument("--force", action="store_true",
                    help="proceed despite context-loss-risk references (option a, or after you have merged)")
    ap.add_argument("--vault", metavar="PATH", help="vault root (default: ../../../vault from this script)")
    args = ap.parse_args()

    vault = Path(args.vault).resolve() if args.vault else Path(__file__).resolve().parents[3] / "vault"
    if not vault.is_dir():
        return _die(f"vault not found at {vault}")

    all_files = [rel for rel, _ in walk_files(vault)]
    notes = [r for r in all_files if r.endswith(".md")]
    target_rel = resolve_input(args.target, vault, all_files)

    key_counts = {}
    for r in all_files:
        key_counts[bare_key(r)] = key_counts.get(bare_key(r), 0) + 1
    t_bare = bare_key(target_rel)
    ambiguous = key_counts.get(t_bare, 0) > 1
    t_noext = target_rel[:-3] if target_rel.lower().endswith(".md") else target_rel
    target_keys = (t_noext.lower(), t_bare)

    redirect_form = None
    if args.redirect:
        new_rel = resolve_input(args.redirect, vault, all_files)
        if new_rel == target_rel:
            return _die("--redirect target is the same file you are deleting.")
        redirect_form = link_form(new_rel, key_counts.get(bare_key(new_rel), 0) > 1)

    edits, ambig, context, md_warns = find_references(notes, vault, target_rel, target_keys, ambiguous)
    embeds = [(rel, ln, ctx) for rel, items in edits.items()
              for (ln, _s, _e, parts, ctx) in items if parts[3]]
    n_refs = sum(1 for items in edits.values() for (_l, _s, _e, parts, _c) in items if not parts[3])

    # ---- report ----
    if target_rel.endswith(".md"):
        ttext = (vault / target_rel).read_text(encoding="utf-8", errors="replace")
        size = f"  ({len(ttext.splitlines())} lines, {len(ttext.split())} words)"
    else:
        size = ""
    print(f"safe-delete-file — {'REDIRECT to ' + args.redirect if redirect_form else 'UNLINK'} plan")
    print(f"target: {target_rel}{size}")
    if ambiguous:
        print(f"  ! basename '{t_bare}' is NOT unique in the vault ({key_counts[t_bare]} files) — "
              "bare [[links]] to it are ambiguous.")
    print("")

    if n_refs:
        verb = "redirect" if redirect_form else "unlink"
        print(f"correctable references ({n_refs}) — will {verb} on --apply:")
        for rel in sorted(edits):
            for ln, _s, _e, parts, _c in sorted(edits[rel]):
                if parts[3]:
                    continue                       # embeds are listed in their own section
                before = parts[0] if not parts[1] else f"{parts[0]}#{parts[1]}"
                shown = replacement_text(parts, redirect_form)
                print(f"  {rel}:{ln}  [[{before}{('|' + parts[2]) if parts[2] else ''}]]  ->  "
                      f"{shown if shown else '(removed)'}")
    else:
        print("correctable references (0): none")
    print("")

    blockers = []
    if embeds:
        ok = redirect_form is not None or args.unlink_embeds
        if not ok:
            blockers += embeds
        tag = "will repoint" if redirect_form else ("will strip" if args.unlink_embeds else "BLOCKER")
        print(f"embeds ![[...]] ({len(embeds)}) — {tag}:")
        for rel, ln, ctx in embeds:
            print(f"  {rel}:{ln}  {ctx}")
        if not ok:
            print("    -> pass --redirect <new> to repoint, or --unlink-embeds to strip them.")
        print("")
    if ambig:
        blockers += ambig
        print(f"ambiguous bare links ({len(ambig)}) — BLOCKER (may point elsewhere; fix by hand or path-qualify):")
        for rel, lineno, ctx in ambig:
            print(f"  {rel}:{lineno}  {ctx}")
        print("")
    if context:
        cleared = args.force or redirect_form is not None
        if not cleared:
            blockers += context
        print(f"context-loss risk ({len(context)}) — these file(s) read CONTENT from the target{size}:")
        for rel, lineno, ctx in context:
            print(f"  {rel}:{lineno}  {ctx}")
        if redirect_form:
            print(f"    -> links repoint to {args.redirect}; make sure it carries the context they rely on.")
        elif args.force:
            print("    -> --force: the link(s) will be unlinked and that context dropped.")
        else:
            print("    -> choose:  (a) --force to delete anyway  |  (b) MERGE the needed content into the file(s)")
            print("       above first, then re-run with --apply --force (recommended)  |  (c) abort: do nothing.")
        print("")
    if md_warns:
        print(f"possible Markdown-style links ({len(md_warns)}) — REVIEW MANUALLY (never auto-edited):")
        for rel, lineno, ctx in md_warns:
            print(f"  {rel}:{lineno}  {ctx}")
        print("")

    # ---- act ----
    if not args.apply:
        if blockers:
            print(f"DRY RUN — {len(blockers)} blocker(s). --apply would REFUSE until they are resolved.")
        else:
            print(f"DRY RUN — no changes. Re-run with --apply to correct {n_refs} reference(s) "
                  f"and delete {target_rel}.")
        return 0

    if blockers:
        print(f"REFUSED — {len(blockers)} unresolved blocker(s) above. Nothing was changed; "
              f"{target_rel} was NOT deleted.")
        return 3

    fixed, changed = apply_edits(edits, vault, redirect_form, args.unlink_embeds)
    (vault / target_rel).unlink()
    print(f"APPLIED — corrected {fixed} reference(s) in {changed} file(s); deleted {target_rel}.")
    print("Next: review/commit the changes yourself (agents don't touch git), then run vault-linter "
          "to confirm 0 new broken links.")
    return 0


def _die(msg: str) -> int:
    print(f"safe-delete: {msg}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
