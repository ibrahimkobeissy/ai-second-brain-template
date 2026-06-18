---
name: curate-bookmarks
description: >-
  Curate Obsidian Web Clipper bookmarks from the inbox into per-area "what can we
  steal" draft notes. Use when the user wants to process/sweep the inbox, triage
  saved clippings, or turn a bookmark into a curated note filed under a Work or
  Personal Area. Two modes: a headless global sweep (run with `--headless`, alias
  `sweep`) that processes every inbox bookmark with no questions, and an
  interactive single-file mode (run with no arguments) that asks which bookmark
  and which area to use.
---

# Curate Bookmarks

Turn raw web-clipper bookmarks sitting in the inbox into structured, curated draft
notes filed under the relevant Area — extracting "what we can use, what we can
steal" for that area. Output always lands in a `draft/` folder for the user to
review and merge; it is never written directly into the Area.

## Vault paths

- Inbox (bookmarks to process): `vault/00-inbox/`
- Work areas (each subfolder = one Area): `vault/01-work/areas/`
- Personal areas (each subfolder = one Area): `vault/02-personal/areas/`
- Output drafts: `vault/<part>/areas/<area-slug>/draft/<kebab-title>.md`
- Output template: `templates/draft.md` (in this skill folder)

## Area discovery

The set of valid Areas is **dynamic** — discover it at runtime, never hardcode it.
List the immediate subdirectories of `vault/01-work/areas/` and
`vault/02-personal/areas/`. Each subdirectory is one Area; its folder name is the
`area-slug`. Ignore the areas-index `README.md`, any `draft/` folder, and dotfiles.
Read the Area's hub note (the `<area-slug>.md` MOC) and any other notes inside to
understand what the Area is about before matching.

## Choosing the mode

Look at the arguments the skill was invoked with:

- Contains `--headless` (or the word `sweep`) → **Headless sweep** (no questions).
- Anything else / no arguments → **Interactive single-file** (ask questions).

## A bookmark file

Inbox files are Markdown from Obsidian Web Clipper. They have frontmatter with
`title`, `source` (the URL), `author`, `description`, and `tags: [clippings]`,
followed by the clipped article body. Use `source` as the link, `title` as the
source title, and the body to judge relevance and mine ideas. Skip `README.md` and
any non-`.md` file in the inbox.

## Matching a bookmark to an Area

Read the bookmark (at least frontmatter + skim the body), then pick the single
**best-fit** Area by comparing the bookmark's subject to each Area's name and
description. Judge real topical overlap, not surface keywords.

- Confident match → produce a draft for that Area.
- No Area is a genuine fit → **do not** force it. In headless mode, leave the
  bookmark in the inbox untouched and record it as "no match" in the report. In
  interactive mode, the user names the Area, so this does not apply.

## De-duplication (processed-sources ledger)

A persistent ledger at `vault/99-system/maintenance/processed-sources.md` records every source already processed, so a re-bookmark of the same link is caught even after the bookmark/draft notes are deleted (the vault is kept lite — CLAUDE.md §2).

- **Normalize the URL first:** scheme + lowercased host + path, with tracking query params and `#fragments` stripped (drop `?s=…&t=…` on X links).
- **Before drafting:** look up that normalized URL in the ledger. If present, it's a **possible duplicate** — interactive mode: surface it and ask whether to proceed or skip; headless mode: **skip** the bookmark, record it as "duplicate" in the report, don't redraft.
- **After drafting** (and deleting the inbox bookmark): **append a row** — `| date | normalized-url | title | stage | landed-in |` with `stage: curated` and `landed-in` = the draft. (`synthesize-drafts` later bumps the row to `synthesized`.)

## Output: writing the draft

1. Copy `templates/draft.md` and fill every `{{placeholder}}`. Keep the section
   structure identical for every file so the format is consistent.
2. `curated_title`: a clear human title (not the raw clipping filename).
3. Filename: kebab-case of the curated title — lowercase, spaces and punctuation
   → single hyphens, collapse repeats, trim leading/trailing hyphens
   (e.g. `How I use Obsidian` → `how-i-use-obsidian.md`).
4. `today`: the current date, `YYYY-MM-DD`.
5. `area_display_name`: a readable form of the area slug for the `[[wikilink]]`.
6. Ensure the destination `draft/` folder exists (`mkdir -p`) before writing.
7. Content quality bar: the "What we can steal" section must be concrete and
   actionable for *this* Area — specific tactics/structures/ideas to adopt, not a
   generic summary. Be honest in "What probably doesn't apply." This is a
   reasoning workspace; favor traceable, useful insight over filler.
8. Keep it tight — the draft is a decision aid, not an essay. TL;DR in 1–2
   sentences; 3–5 bullets in "What we can steal" and 2–3 in "What probably
   doesn't apply"; each bullet one or two sentences. When in doubt, cut.

## Mode 1 — Headless sweep (`--headless` / `sweep`)

Run the full sweep with **no questions**:

1. Discover Areas (see above).
2. List every bookmark in `vault/00-inbox/` (skip `README.md` / non-`.md`).
3. For each bookmark:
   a. Read it and pick the best-fit Area (or "no match").
   b. **De-dup check:** normalize its source URL and look it up in the ledger; if
      present, skip it and record it as "duplicate" in the report (don't redraft).
   c. If matched: write the draft to that Area's `draft/` folder, **delete the
      original inbox bookmark**, then **append a `curated` row to the ledger**. The
      draft preserves the original via the `source` URL and `captured_from` field;
      deletions are recoverable from git.
   d. If no match: leave the bookmark in the inbox, untouched.
4. Print a summary report: a table of `bookmark → area → draft path`, plus a list
   of any "no match" bookmarks left in the inbox.

## Mode 2 — Interactive single-file (no arguments)

Ask, then act:

1. Ask **which bookmark** to curate. Offer the current inbox `.md` files
   (excluding `README.md`) as choices so the user can pick one.
2. Ask **which Area** to curate it against. Offer the discovered Areas as choices.
3. Read the chosen bookmark. **De-dup check:** normalize its source URL and look it
   up in the ledger; if present, tell the user it's a possible duplicate and ask
   whether to proceed or skip.
4. Write the draft into that Area's `draft/` folder, **delete the original** inbox
   bookmark, then **append a `curated` row to the ledger**. The draft preserves the
   source via the `source` URL and `captured_from` field; deletions are recoverable
   from git.
5. Report the draft path.

## Notes

- Never write directly into an Area folder — always into its `draft/` subfolder.
- One bookmark → one primary Area draft. If a bookmark is strongly relevant to a
  second Area, mention it under "Related" rather than creating duplicates.
- Don't invent areas or build/lint/test steps — this is an Obsidian vault of notes.
