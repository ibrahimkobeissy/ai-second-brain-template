---
title: "Diary"
type: reference
status: active
created: 2026-06-26
tags:
  - documentation
  - workflow
---

# Diary

How diary writing works in this vault: capture a dated journal entry with the **`diary`** skill, and — for the entries that carry a real *rapport de force* — turn one into a Power Map with **`analyse-diary`**. Everything lives in the **second-brain** area and stays **private** (never synced to the public template). Frontmatter/naming rules: [[conventions]].

## Writing an entry — `diary`
Ask to journal (or run `/diary <what happened>`). The skill:
- **Resolves the date.** Defaults to **today** (it reads the real system date, never a guess). Name another date if you like — ISO (`2026-06-20`), natural ("yesterday", "last Friday"), or worded ("June 20"). A bare numeric date like `06/07` is read **DD/MM (French)** and **confirmed** with you before saving, never guessed.
- **Files one note per day**, tidied into year/month folders, at `vault/02-personal/areas/second-brain/diaries/<YYYY>/<MM-Month>/<YYYY-MM-DD>.md` (e.g. `diaries/2026/06-June/2026-06-27.md`). The `MM-Month` prefix keeps the month folders in chronological order in Obsidian.
- **Classifies the entry under a category H2** — `## Work`, `## Personal / Family`, `## Freelance`, `## Life & Entourage` (the list is extensible; name your own and it'll use it). The category is inferred from what you wrote; a genuinely ambiguous one prompts a one-time ask. A second entry on the same day **appends** a new `### HH:MM` section under the right category — reusing the category heading if it's already there, adding it if not — and never overwrites what's already there. A new day creates the note from the template (`type: daily`, linked to `[[second-brain]]` so it's in the graph).
- **Records only what you actually say.** It won't invent events, feelings, or detail; it edits your words only lightly for clarity and keeps your voice.

If you invoke it with no text, it asks once what you want to log.

## Analysing an entry — `analyse-diary`
A day's entry about a **1:1, a decision, a negotiation, a conflict, or an org move** can be read for power dynamics. Run `/analyse-diary` (optionally with a date). It:
- **Classifies each entry first.** Power-laden work situations get mapped; purely social or routine entries ("coffee with a friend", errands) are **skipped**; genuinely borderline ones prompt a one-time ask — it never force-maps an ordinary day.
- **Writes a Power Map** for each relevant entry to `diaries/power-maps/<date>-<slug>.md`, backlinked from the diary entry. Five outputs: the *real* decision-maker, hidden threats, unlikely allies, two-or-three power moves, and the single highest-leverage thing to do first.
- **Stays honest.** Claims are grounded in what the entry records; guesses about people's motives are listed as *assumptions*, not asserted; and it's framed as **strategy, not manipulation**. Thin detail yields a short map with the gaps named, not invented certainty.

## Privacy
Both skills **ship in the public template** (they're generic tools), but **your diary content never does.** `diaries/` and `diaries/power-maps/` are excluded from the sync (not in `sync.py`'s `COPY_PATHS`), and `verify.py` forbids either folder from appearing in the public sample area — so a journal entry or a power read of a real 1:1 cannot leak.

## Quick reference
| Action | Invoke | Writes |
| --- | --- | --- |
| Log today (or a named day) | `/diary <text>` | `diaries/<YYYY>/<MM-Month>/<date>.md` |
| Power-Map a day's charged entries | `/analyse-diary [date]` | `diaries/power-maps/<date>-<slug>.md` |
