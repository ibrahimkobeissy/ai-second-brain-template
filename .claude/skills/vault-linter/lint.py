#!/usr/bin/env python3
"""vault-linter — read-only knowledge-graph integrity check for the Obsidian vault.

Checks:
  ERROR  broken [[wikilinks]] / ![[embeds]] that resolve to no note or attachment
  WARN   orphaned knowledge notes (no inbound and no outbound links)
  WARN   capture notes missing `source` / `captured_from` frontmatter

This script is READ-ONLY: it never modifies the vault. It only prints a report.

  python3 .claude/skills/vault-linter/lint.py [vault_path]

Scope decisions (documented so they are tunable, not magic):
  - Skipped entirely: .obsidian/, .trash/, 99-system/templates/ (scaffolding).
  - Links inside code fences / inline `code` are ignored (they are illustrative,
    e.g. `[[wikilinks]]`), as are `{{placeholder}}` targets.
  - Orphan check covers *knowledge notes* only: excludes 99-system/**, any
    daily-notes/** and README.md / TODO.md (structural, legitimately standalone).
  - Traceability check covers *captured* notes only: 00-inbox/** and any draft/ folder.
    Generated outputs (scout/, synthesis/) aggregate other notes and are exempt — they
    have no single source.
"""
import os
import re
import sys
from pathlib import Path

SKIP_DIRS = {".obsidian", ".trash"}
SKIP_PREFIXES = ("99-system/templates/",)
CAPTURE_TOP = ("00-inbox/",)
CAPTURE_SEGMENTS = {"draft"}
ATTACH_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".pdf", ".canvas", ".md"}

WIKILINK_RE = re.compile(r"!?\[\[([^\[\]]+?)\]\]")
INLINE_CODE_RE = re.compile(r"`[^`]*`")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
TRACE_RE = re.compile(r"^(source|captured_from)\s*:", re.IGNORECASE)


def find_vault() -> Path:
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).resolve()
    # .claude/skills/vault-linter/lint.py -> repo root is parents[3]
    return Path(__file__).resolve().parents[3] / "vault"


def is_skipped(rel: str) -> bool:
    if rel.split("/", 1)[0] in SKIP_DIRS:
        return True
    return any(rel.startswith(p) for p in SKIP_PREFIXES)


def is_capture(rel: str) -> bool:
    name = rel.rsplit("/", 1)[-1]
    if name == "README.md":
        return False
    if any(rel.startswith(t) for t in CAPTURE_TOP):
        return True
    return any(seg in CAPTURE_SEGMENTS for seg in rel.split("/")[:-1])


def is_knowledge_note(rel: str) -> bool:
    if rel.startswith("99-system/"):
        return False
    if "daily-notes/" in rel:
        return False
    return rel.rsplit("/", 1)[-1] not in {"README.md", "TODO.md"}


def clean_target(raw: str):
    """Normalise a raw wikilink target to a lookup key, or None to skip."""
    t = raw.replace("\\", "").strip()
    t = t.split("|", 1)[0].split("#", 1)[0].strip()  # drop alias + heading/block
    if not t or "{{" in t:
        return None
    return t


def extract_links(text: str):
    """Yield (lineno, target_key) skipping code fences and inline code."""
    in_fence = False
    for i, line in enumerate(text.splitlines(), 1):
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        for m in WIKILINK_RE.finditer(INLINE_CODE_RE.sub("", line)):
            key = clean_target(m.group(1))
            if key is not None:
                yield i, key


def has_traceability(text: str) -> bool:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return False
    for line in lines[1:]:
        if line.strip() == "---":
            return False
        if TRACE_RE.match(line):
            return True
    return False


def main() -> int:
    vault = find_vault()
    if not vault.is_dir():
        print(f"vault-linter: vault not found at {vault}", file=sys.stderr)
        return 2

    notes, all_files = [], []
    for root, dirs, files in os.walk(vault):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            rel = (Path(root) / f).relative_to(vault).as_posix()
            if is_skipped(rel):
                continue
            all_files.append(rel)
            if f.endswith(".md"):
                notes.append(rel)

    files_set = {r.lower() for r in all_files}
    name_set = {Path(r).name.lower() for r in all_files}
    note_lookup = {}  # basename / path keys -> rel (first match wins)
    for r in notes:
        rl = r.lower()
        note_lookup.setdefault(rl[:-3], r)        # full path, no .md
        note_lookup.setdefault(Path(r).stem.lower(), r)  # basename

    def resolve_note(target: str):
        low = target.lower()
        if Path(target).suffix.lower() in ATTACH_EXTS - {".md"}:
            return None
        return note_lookup.get(low) or note_lookup.get(low.removesuffix(".md"))

    def resolve_any(target: str) -> bool:
        low = target.lower()
        if Path(target).name.lower() in name_set or low in files_set:
            return True
        if (low + ".md") in files_set:
            return True
        return resolve_note(target) is not None

    broken = []                       # (note, lineno, target)
    outbound_any = {}                 # note -> bool (has any wikilink)
    inbound = {r: set() for r in notes}
    missing_trace = []

    for r in notes:
        try:
            text = (vault / r).read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            print(f"vault-linter: cannot read {r}: {e}", file=sys.stderr)
            continue

        seen_link = False
        for lineno, target in extract_links(text):
            seen_link = True
            if not resolve_any(target):
                broken.append((r, lineno, target))
            tgt_note = resolve_note(target)
            if tgt_note and tgt_note != r:
                inbound[tgt_note].add(r)
        outbound_any[r] = seen_link

        if is_capture(r) and not has_traceability(text):
            missing_trace.append(r)

    orphans = [
        r for r in notes
        if is_knowledge_note(r) and not outbound_any.get(r) and not inbound[r]
    ]

    # ---- report ----
    out = []
    out.append(f"vault-linter — knowledge-graph integrity")
    out.append(f"scanned {len(notes)} notes in {vault}")
    out.append("")

    out.append(f"ERRORS")
    if broken:
        out.append(f"  broken wikilinks ({len(broken)}):")
        for note, lineno, target in sorted(broken):
            out.append(f"    {note}:{lineno}  [[{target}]]")
    else:
        out.append("  broken wikilinks (0): none")
    out.append("")

    out.append(f"WARNINGS")
    if orphans:
        out.append(f"  orphaned notes ({len(orphans)}) — no inbound or outbound links:")
        for r in sorted(orphans):
            out.append(f"    {r}")
    else:
        out.append("  orphaned notes (0): none")
    if missing_trace:
        out.append(f"  capture notes missing source/captured_from ({len(missing_trace)}):")
        for r in sorted(missing_trace):
            out.append(f"    {r}")
    else:
        out.append("  capture notes missing source/captured_from (0): none")
    out.append("")

    out.append(
        f"summary: {len(broken)} broken link(s), {len(orphans)} orphan(s), "
        f"{len(missing_trace)} missing-traceability across {len(notes)} notes."
    )
    print("\n".join(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
