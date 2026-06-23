---
name: vault-linter
description: >-
  Read-only knowledge-graph integrity check for the vault. Reports broken
  [[wikilinks]], orphaned notes (no links in or out), and capture notes missing
  source/captured_from frontmatter. Use when the user wants to check vault health,
  find broken/dead links, find orphan or disconnected notes, audit the linking
  graph, or verify traceability. Never modifies anything.
---

# Vault Linter

Protects the linking graph CLAUDE.md §7 calls "the value of the vault." The check is
**deterministic** — the work is done by `lint.py`, not by eyeballing notes — so it is
exhaustive and repeatable. **Read-only: it never edits the vault, only prints a report.**

## Run it

```
python3 .claude/skills/vault-linter/lint.py
```

Both Claude and Codex run the same script via the shared skills folder. Optionally pass
a vault path as the first argument to lint a different vault.

## What it checks

- **Broken wikilinks (ERROR)** — every `[[link]]` / `![[embed]]` resolving to no note or
  attachment. Resolution is Obsidian-style: by basename (case-insensitive) or relative
  path; aliases (`|`) and headings/blocks (`#`) are stripped first. Links inside code
  fences / inline `code` and `{{placeholder}}` targets are ignored.
- **Orphaned notes (WARN)** — knowledge notes with no inbound *and* no outbound links.
  Structural files are excluded (`99-system/**`, `daily-notes/**`, `README.md`, `TODO.md`).
- **Missing traceability (WARN)** — *captured* notes (`00-inbox/**` and any `draft/`
  folder) lacking `source` or `captured_from` frontmatter, per CLAUDE.md §6. Generated
  outputs (`scout/`, `synthesis/`) and other notes are exempt — they have no single source.

## Using the output

1. Run the script; read the report (counts + `file:line` per issue).
2. **Report, don't auto-fix.** This skill only diagnoses. Surface findings to the user.
   Many copies of the *same* broken target (e.g. `[[second-brain]]`) usually means an Area
   hub note doesn't exist yet — not 20 separate typos.
3. If asked to fix, do it as a separate, explicit step. The linter itself stays read-only.

## Tuning

Exclusions and capture-folder names are constants at the top of `lint.py` (`SKIP_DIRS`,
`CAPTURE_SEGMENTS`, …). Adjust there if the vault's conventions change.
