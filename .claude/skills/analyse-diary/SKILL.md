---
name: analyse-diary
description: Analyse a day's diary entries for power dynamics and produce a "Power Map" for the situations that warrant one. Reads vault/02-personal/areas/second-brain/diaries/<YYYY>/<MM-Month>/<date>.md, classifies each entry as power-relevant or not (a 1:1, a decision, a negotiation, a conflict, a reorg → yes; a coffee with a friend, errands, routine status → no), and for the relevant ones writes a grounded Power Map (real decision-maker, hidden threats, unlikely allies, power moves, the one thing) as a private linked note. Use when the user wants to analyse a diary entry, map the "rapport de force" / power dynamics of a meeting or decision, or prep a high-stakes work situation they journaled.
---

# analyse-diary — a power-dynamics lens over diary entries

Read a day's diary and, **only for entries that carry a real *rapport de force*** (a decision, a negotiation, a 1:1, a conflict, an org move), produce a **Power Map** — a structured read of who actually holds power in that situation and the highest-leverage move. Trivial or purely social entries are left alone. This is an analysis lens over the output of the `diary` skill; it never invents events and never speaks for people it has no evidence about.

## Where
- **Reads:** `vault/02-personal/areas/second-brain/diaries/<YYYY>/<MM-Month>/<YYYY-MM-DD>.md` (a day note written by `diary`; e.g. `diaries/2026/06-June/2026-06-27.md`).
- **Writes:** `vault/02-personal/areas/second-brain/diaries/power-maps/<YYYY-MM-DD>-<HHMM>-<slug>.md` — power maps stay in one flat `power-maps/` folder (not nested by month); the dated filename keeps them self-describing and the `[[…]]` backlink resolves by basename regardless of folder. One Power Map per analysed entry, keyed by the entry's `HH:MM` (colon dropped) so two same-subject entries on one day never collide; a single-section note with no time heading falls back to `<YYYY-MM-DD>-<slug>`. **Writes only under `diaries/`** — never the Area core.

## Steps
1. **Resolve the date.** Default = **today** (`date +%F`; never assume). Honour an explicit/natural date in the prompt ("yesterday", "June 20"); **confirm ambiguous numeric dates as DD/MM (French)** rather than guessing. Derive the folder from the resolved date: `<YYYY>` = `date -d <date> +%Y`, `<MM-Month>` = `date -d <date> +%m-%B`. Then open `diaries/<YYYY>/<MM-Month>/<date>.md`. **Missing → stop** (never fabricate): before reporting "no entry", check for a **legacy flat note** for the *same* day at the `diaries/` root (`diaries/<YYYY-MM-DD>.md` or the older `diaries/<DD-MM-YYYY>.md`) — if one exists, stop with a **migration message** ("found `<file>` at the diaries root; the toolset now files day notes under `diaries/<YYYY>/<MM-Month>/<YYYY-MM-DD>.md` — move/rename it there, then re-run") rather than silently claiming the day is empty; only if no legacy candidate exists do you say there's no entry and offer to pick another date.
2. **Split into entries.** Treat each timestamp heading as one entry: `### HH:MM` in the current category-grouped format (the parent `## <Category>` heading is *context* for the analysis), or `## HH:MM` in legacy flat notes. A note with no timestamp heading = one entry. If the prompt names a specific situation, scope to that entry.
3. **Classify each entry for power-relevance** — the trigger that decides whether a map is even warranted. The entry's **category H2 is a useful prior** (`Work`/`Freelance` lean power-relevant; `Personal / Family`/`Life & Entourage` lean skip) but the *content* decides — a family inheritance negotiation is power-relevant; a Work entry that's just "shipped the build, went home" is not:
   - **Map it** when the entry involves *other people in a work/authority relationship* **and** a stake: a manager/report/peer/client/stakeholder/exec interaction, a decision being made/contested/influenced, a negotiation, a conflict or tension, positioning/alignment/politics, a performance review, or an org change (reorg, hiring, promotion).
   - **Skip it** when it's purely social (friends, family, logistics), routine status/errands, or solo reflection with no other actor and no stake.
   - **Borderline → ask once** whether to map it; if no steer, **skip** (a forced map is worse than none).
4. **Build the Power Map** for each relevant entry, **grounded in what the entry actually records** (see template). Fill the five outputs; where the diary doesn't give you enough, say so — an honest "unknown — would need to test" beats a confident misread.
5. **Write** each map to `diaries/power-maps/<date>-<HHMM>-<slug>.md` (`<HHMM>` = the entry's `HH:MM` with the colon dropped; `<slug>` = kebab of the situation, e.g. `one-on-one-with-manager`). **Reuse, don't clobber:** if a map for *this* entry already exists, open and update it in place — never overwrite a different situation or write a duplicate. Then **backlink from the diary**: under the analysed timestamp entry (`### HH:MM`, or `## HH:MM` in legacy notes) in `diaries/<YYYY>/<MM-Month>/<date>.md`, add the line `> 🗺️ Power Map: [[<date>-<HHMM>-<slug>]]` **only if that exact line is not already present** (a re-run must never add a second backlink), preserving everything else in the note.
6. **Report**: which entries were mapped (with output paths), which were skipped and **why**. If **no** entry was power-relevant, say so plainly and write nothing.

## Power-Map note template
```
---
type: power-map
status: active
created: <YYYY-MM-DD>
area: second-brain
source_entry: "[[<YYYY-MM-DD>]] · <Category> · <HH:MM>"
tags:
  - power-map
  - private
---

# Power Map — <situation> (<YYYY-MM-DD>)

From [[<YYYY-MM-DD>]] (the diary entry). **Strategy, not manipulation.** Claims are grounded in what the entry records; guesses about people are marked as assumptions, not asserted.

## 1 · The real decision-maker
Who actually changes the outcome (not the title-holder) — and how to reach them.

## 2 · Hidden threats
Who loses if you succeed, and how they'd likely block you (directly or indirectly).

## 3 · Unlikely allies
Who quietly wants the same thing, and how to activate them without exposing them.

## 4 · Power moves
Two or three concrete things to say or do that shift the dynamic in your favour. Strategy, not manipulation.

## 5 · The one thing
If you could do only one thing before walking in, what maximises your position?

## Assumptions & unknowns
- Assumption (not stated in the entry): …
- Unknown — would need to test: …
```

## Honesty guardrails
- **Ground every claim in the entry.** If the diary names people, roles, and behaviour, use them. If it doesn't, do **not** invent motives or allies — list them under *Assumptions & unknowns* and mark them as such.
- **Strategy, not manipulation.** Power moves are about preparation and clarity, not deceiving people. Keep that framing explicit.
- **No fabrication.** Never add people, events, or feelings that aren't in the entry (the vault's honesty mantra). Thin evidence → a short, honest map with the gaps named, not padding.

## Privacy
The **skill ships in the public template** (a generic analysis tool), but every **Power Map stays private**: outputs live under `diaries/power-maps/`, and `diaries/` is **not** in `sync.py`'s `COPY_PATHS`; `verify.py` lists both `diaries` and `power-maps` among the forbidden sub-folders of the public sample area — so a power-dynamics read of a real 1:1 can never leak into the public repo.

## Done when
Every power-relevant entry for the date has a grounded Power Map under `diaries/power-maps/`, each backlinked from its diary entry; trivial entries are left untouched and reported as skipped; nothing was fabricated. Re-running on the same day updates existing maps in place — no overwritten situations, no duplicate files, no duplicate backlinks.
