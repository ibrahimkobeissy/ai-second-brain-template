---
name: safe-delete-file
description: >-
  Delete a note/file from the vault without leaving dangling [[wikilinks]] or silently
  losing context. Finds every inbound link to the target, corrects it (unlink, or
  --redirect to a replacement), and flags references where another note defers to the
  target for CONTENT so you can merge it first. Use when the user wants to delete/remove
  a note safely, prune a spent file, delete and fix backlinks, or "delete X and update
  what links to it." Deterministic (a Python script); the file is removed only after the
  links are corrected. Never touches git.
---

# Safe Delete File

Deleting a note silently orphans every `[[wikilink]]` that pointed to it — exactly the
broken links `vault-linter` later flags — and can quietly destroy knowledge when another
note said "read more in [[X]]". This skill is the **inverse of `vault-linter`**: it asks
"what links resolve TO this file?", corrects them, and only then removes the file. The
mechanical work is a **deterministic script**, not eyeballing — so it is exhaustive.

The script **never touches git** (CLAUDE.md §5) and never deletes outside the vault.

## Run it (always dry-run first)

```
python3 .claude/skills/safe-delete-file/safe_delete.py <target>            # DRY RUN — plan only, no changes
python3 .claude/skills/safe-delete-file/safe_delete.py <target> --apply    # correct links, then delete
```
`<target>` is a path or basename inside the vault (e.g. `notes/old.md`, `old`, or a full path).
The default correction is **unlink** (this is a delete): `[[foo|Display]]` → `Display`,
`[[foo]]` → `foo` — the prose survives, the dead link goes.

## Workflow (the agent must follow this)

1. **Dry-run and show the user the plan.** Never `--apply` blind. The report lists, per
   `file:line`: correctable references, embeds, ambiguous links, **context-loss risk**, and
   possible Markdown-style links. It also prints the target's size (lines/words) — a small
   file losing a backlink is minor; a 200-line note is not.

2. **Context-loss risk → STOP and ask the user (this is mandatory).** When a file defers to
   the target for *content* ("see [[X]]", "more in [[X|the analysis]]"), deleting it drops
   that knowledge. Surface the references and ask which of three to do:
   - **(b) Merge into the referencing file(s) — recommended.** Read the target, fold the
     context those files rely on into them at the link site (your judgment — this is the
     part a script can't do), then run `--apply --force` to unlink the now-redundant links
     and delete the target.
   - **(a) Force delete.** Run `--apply --force` — the links are unlinked and that context
     is dropped. Use when the target is spent/redundant.
   - **(c) Abort.** Don't run `--apply`. Nothing changes.

   `--apply` **refuses** (exit 3) while context-loss references are unresolved unless
   `--force` is given (or `--redirect`, which preserves the link). That guard is the
   "notify and ask" guarantee — don't bypass it without the user's answer.

3. **Embeds `![[target]]` → decide with the user.** An embed transcludes content; there is
   no sensible text replacement. Either `--redirect <new>` (repoint the embed to a
   replacement) or `--unlink-embeds` (strip the embed token). `--apply` refuses otherwise.

4. **Ambiguous bare links → resolve by hand.** If another note shares the target's basename,
   a bare `[[foo]]` might point elsewhere, so the script will **not** auto-edit it (it is a
   blocker). Path-qualified links (`[[notes/foo]]`) are still corrected. Fix the ambiguous
   ones manually or path-qualify them, then re-run.

5. **Markdown-style links `[text](path)` are report-only.** The vault's link model is
   wikilinks (CLAUDE.md §7), so these are flagged for manual review, never auto-edited.

6. **Renames/merges → `--redirect <new>`.** When the file isn't truly going away but is
   being replaced/merged into another note, `--redirect <new>` repoints every inbound link
   (aliases and `#headings` preserved) instead of unlinking — and clears the embed and
   context-loss blockers, since the links still resolve to content.

7. **After `--apply`.** The script edited and deleted files but did **not** stage or commit
   anything — that's the user's job. Tell them to review/commit, then run
   `vault-linter` to confirm **0 new broken links**.

## Flags

| flag | effect |
| :-- | :-- |
| *(none)* | dry run — print the plan, change nothing |
| `--apply` | perform the corrections, then delete the target |
| `--redirect <new>` | repoint inbound links to `<new>` instead of unlinking (rename/merge) |
| `--force` | proceed despite context-loss-risk references (option a, or after you merged) |
| `--unlink-embeds` | let `--apply` strip `![[target]]` embeds |
| `--vault <path>` | vault root (default: the repo's `vault/`) |

Exit codes: `0` ok (dry run or applied) · `2` usage/resolution error · `3` `--apply` refused (blockers).

## Tuning

The context-loss cue phrases (`CONTEXT_CUE`) and skip-dirs are constants at the top of
`safe_delete.py`. The link-parsing rules deliberately mirror `vault-linter/lint.py` so both
agree on what a link is; if link semantics change, update both.
