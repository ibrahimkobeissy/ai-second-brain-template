---
name: diary
description: Add a diary / journal entry into the second-brain area. Resolves the target date (today by default, or a date named in the prompt), classifies the entry under a category (Work, Personal / Family, Freelance, Life & Entourage, …), then creates or updates that day's note. Writes to vault/02-personal/areas/second-brain/diaries/<YYYY>/<MM-Month>/<YYYY-MM-DD>.md. Use when the user wants to journal, write a diary/journal entry, log how their day went, or record thoughts for today or a specific date.
---

# diary — capture a dated, categorised journal entry

Record a diary entry into the second-brain area's `diaries/` folder. One note per day (`YYYY-MM-DD.md`), filed under a **year / month** folder so the diary stays tidy as it grows. Within a day note, entries are grouped under a **category** H2 (`## Work`, `## Personal / Family`, …) and timestamped with an `### HH:MM` sub-heading. This skill writes **only** under `diaries/` — never the Area core (`second-brain.md`, `todo-kanban.md`, `to-check.md`).

## Where
`vault/02-personal/areas/second-brain/diaries/<YYYY>/<MM-Month>/<YYYY-MM-DD>.md` — folders are created on first use for that month. Example: an entry for 2026-06-27 lives at `diaries/2026/06-June/2026-06-27.md`. The `MM-Month` prefix (e.g. `06-June`) keeps month folders in chronological order in Obsidian's file explorer; the ISO filename keeps days sorted within the month. The folders live inside the Obsidian vault, so entries stay visible, searchable, and linkable.

## Categories
Group each entry under a **category H2**. Default canonical categories (reuse the *exact* spelling so the same category reads identically across days, which lets you later collect "all Work entries"):
- `## Work`
- `## Personal / Family`
- `## Freelance`
- `## Life & Entourage`

The list is extensible: if an entry clearly fits none of these and the user names a category, use theirs (Title Case). **Infer the category from the entry's content**; only if it's genuinely ambiguous, ask once rather than guessing. If a single entry spans distinct areas of life, split it under the matching category headings.

## Steps
1. **Resolve the date.**
   - Default = **today** — read the real current date (`date +%F`); never assume one.
   - If the prompt names a date, use it: ISO (`2026-06-20`), natural ("yesterday", "last Friday"), or worded ("June 20"). Resolve to `YYYY-MM-DD`.
   - **Ambiguous numeric dates** (e.g. `06/07`): the user writes dates **DD/MM** (French) — confirm before committing rather than guessing silently.
   - Derive the folder from the **resolved** date (not today): `<YYYY>` = `date -d <date> +%Y`, `<MM-Month>` = `date -d <date> +%m-%B` (e.g. `06-June`).
2. **Get the entry content** from the prompt. If the skill was invoked with no text, ask once what they want to log. **Record only what the user says — never invent events, feelings, or detail** (the vault's honesty mantra).
3. **Classify** the entry into a category (see *Categories*) — infer from content; ask once only if genuinely ambiguous.
4. **Evaluate: insert vs. create** — check whether `diaries/<YYYY>/<MM-Month>/<date>.md` already exists.
   - **Missing → create** the year/month folders as needed, then the note from the template below, with the category H2 and the first `### HH:MM` entry.
   - **Exists → update**, preserving everything already in the note: if the entry's **category H2 already exists**, append a new `### HH:MM` section (current local time, `date +%H:%M`) under it; if the category is **new** for that day, add the category H2 then the first `### HH:MM` under it.
5. **Report** the path, the category used, and whether you created the note or appended to it.

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

## <Category>
### <HH:MM>
<the entry — one paragraph per line, no hard-wrapping>
```
- `created` = the entry's own date (the note's date), even when back-dated.
- The `[[second-brain]]` link satisfies link-before-close and keeps the note out of the orphan list.

## Conventions
Filename = ISO date, lowercase. Folder = `<YYYY>/<MM-Month>`. Frontmatter per `99-system/documentation/conventions.md` (`type: daily`). Category = `## ` H2; timestamp = `### HH:MM` H3. One paragraph = one continuous line (no hard wrap). Edit the user's words only lightly for clarity — keep their voice.

## Privacy
The **skill ships in the public template** (it's a generic journaling tool), but the **diary content stays private**: the `diaries/` folder — and everything nested under it (year/month folders included) — is not in `sync.py`'s `COPY_PATHS`, and `verify.py` lists `diaries` among the forbidden sub-folders of the public sample area — so journal entries can never leak into the public repo.

## Done when
The entry is saved to `diaries/<YYYY>/<MM-Month>/<date>.md` — created fresh or appended as a new `### HH:MM` section under the right category H2 — preserving any prior entries, with the note linking to `[[second-brain]]`.
