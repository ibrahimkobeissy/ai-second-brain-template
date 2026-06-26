---
name: diary
description: Add a diary / journal entry into the second-brain area. Resolves the target date (today by default, or a date named in the prompt), then either creates a new dated note or appends a timestamped entry to that day's existing note. Writes to vault/02-personal/areas/second-brain/diaries/<YYYY-MM-DD>.md. Use when the user wants to journal, write a diary/journal entry, log how their day went, or record thoughts for today or a specific date.
---

# diary — capture a dated journal entry

Record a diary entry into the second-brain area's `diaries/` folder. One note per day (`YYYY-MM-DD.md`); multiple entries on the same day stack as timestamped sections. This skill writes **only** under `diaries/` — never the Area core (`second-brain.md`, `todo-kanban.md`, `to-check.md`).

## Where
`vault/02-personal/areas/second-brain/diaries/<YYYY-MM-DD>.md` — created on first use. The folder lives inside the Obsidian vault, so entries are visible, searchable, and linkable.

## Steps
1. **Resolve the date.**
   - Default = **today** — read the real current date (`date +%F`); never assume one.
   - If the prompt names a date, use it: ISO (`2026-06-20`), natural ("yesterday", "last Friday"), or worded ("June 20"). Resolve to `YYYY-MM-DD`.
   - **Ambiguous numeric dates** (e.g. `06/07`): the user writes dates **DD/MM** (French) — confirm before committing rather than guessing silently.
2. **Get the entry content** from the prompt. If the skill was invoked with no text, ask once what they want to log. **Record only what the user says — never invent events, feelings, or detail** (the vault's honesty mantra).
3. **Evaluate: insert vs. create** — check whether `diaries/<date>.md` already exists.
   - **Exists → append** a new `## HH:MM` section (current local time, `date +%H:%M`) with the entry. Preserve everything already in the note.
   - **Missing → create** it from the template below, with the first `## HH:MM` entry.
4. **Report** the path and whether you created the note or appended to it.

## New-note template
```
---
type: daily
status: active
created: <YYYY-MM-DD>
area: second-brain
tags:
  - diaries
---

# Diary — <YYYY-MM-DD>

Part of [[second-brain]]

## <HH:MM>
<the entry — one paragraph per line, no hard-wrapping>
```
- `created` = the entry's own date (the note's date), even when back-dated.
- The `[[second-brain]]` link satisfies link-before-close and keeps the note out of the orphan list.

## Conventions
Filename = ISO date, lowercase. Frontmatter per `99-system/documentation/conventions.md` (`type: daily`). One paragraph = one continuous line (no hard wrap). Edit the user's words only lightly for clarity — keep their voice.

## Privacy
The **skill ships in the public template** (it's a generic journaling tool), but the **diary content stays private**: the `diaries/` folder is not in `sync.py`'s `COPY_PATHS`, and `verify.py` lists `diaries` among the forbidden sub-folders of the public sample area — so journal entries can never leak into the public repo.

## Done when
The entry is saved to `diaries/<date>.md` — created fresh or appended as a new `## HH:MM` section — preserving any prior entries, with the note linking to `[[second-brain]]`.
