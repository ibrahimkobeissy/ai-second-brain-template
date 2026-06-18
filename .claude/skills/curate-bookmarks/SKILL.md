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

## Matching a bookmark to its Area(s)

Evaluate **each bookmark on its own merits** — independently and mechanically.
Judge it only against its own content, frontmatter, and context; never let a
sibling bookmark, the batch order, or where earlier bookmarks landed bias the
call. Two bookmarks in the same sweep are unrelated decisions.

Read the bookmark (at least frontmatter + skim the body), then **test it against
every Area independently**, comparing its subject to each Area's name and hub
description. Judge real topical overlap, not surface keywords. A bookmark can be
relevant to **one, several, or no** Areas:

- **Genuinely relevant to one Area** → one draft for that Area.
- **Genuinely relevant to multiple Areas** → a **separate, area-specific draft in
  each** (see "Multi-area bookmarks"). Assign an Area only on real relevance, not
  faint association — don't spray a bookmark across Areas.
- **No Area is a genuine fit** → **do not** force it. Headless mode: leave the
  bookmark in the inbox untouched, record it as "no match" in the report.
  Interactive mode: the user names the Area(s), so this does not apply.

## Multi-area bookmarks

A single source often pays off differently in different Areas — the same article
yields a different "what can we steal" for each. When a bookmark is genuinely
relevant to more than one Area:

- Write a **separate draft per Area**, each in that Area's own `draft/` folder,
  with its **own** area-specific "Why it's relevant" and "What we can steal." These
  are not duplicates — each is a distinct, area-framed extraction of one source.
- **Cross-link the siblings:** list the other Areas' drafts under `## Related` (via
  `[[wikilink]]`) in each one, so the source stays retrievable from any of its
  Areas and the graph is preserved.
- All drafts share the same `source` URL and `captured_from`; the de-dup ledger is
  **keyed per (URL, Area)** (see below), so each Area is curated exactly once.
- **Anti-redundancy guard:** if one Area's take would be *identical* to another's
  (no distinct steal), don't make a second copy — keep one draft and link to it
  from the other Area instead (CLAUDE.md §2: prefer linking over duplicating).

## De-duplication (processed-sources ledger)

A persistent ledger at `vault/99-system/maintenance/processed-sources.md` records every source already processed, so a re-bookmark of the same link is caught even after the bookmark/draft notes are deleted (the vault is kept lite — CLAUDE.md §2).

- **Normalize the URL first:** scheme + lowercased host + path, with tracking query params and `#fragments` stripped (drop `?s=…&t=…` on X links).
- **De-dup is keyed per (normalized URL, Area).** One source may legitimately land in several Areas, so it can have several rows — one per Area. A row's `landed-in` draft path carries the Area, so the Area is derived from the row (no format change).
- **Before drafting into an Area:** look up that (normalized URL, Area) pair in the ledger. If present, it's a **possible duplicate for that Area** — interactive mode: surface it and ask whether to proceed or skip; headless mode: **skip that Area** for this bookmark and record it as "duplicate (Area)". A URL already curated for Area A does **not** block curating it for a genuinely-relevant new Area B.
- **After drafting** (and once all the bookmark's relevant Areas are handled, deleting the inbox bookmark): **append one row per draft** — `| date | normalized-url | title | stage | landed-in |` with `stage: curated` and `landed-in` = that Area's draft. (`synthesize-drafts` later bumps each row to `synthesized`.)

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
3. For each bookmark (each judged **independently** — see "Matching"):
   a. Read it and determine **every** genuinely-relevant Area (one, several, or
      "no match").
   b. **De-dup check, per Area:** normalize its source URL; for each relevant Area,
      look up the (URL, Area) pair in the ledger. Skip any Area already curated for
      this URL (record it "duplicate (Area)"); keep the Areas that are new.
   c. For each remaining relevant Area: write an **area-specific draft** to that
      Area's `draft/` folder and **append a `curated` row** (per (URL, Area)) to the
      ledger. When the bookmark lands in 2+ Areas, **cross-link the sibling drafts**
      under `## Related`.
   d. Once all relevant Areas are handled, **delete the original inbox bookmark**
      (its `source` / `captured_from` live on in each draft; deletions are
      recoverable from git). If **no** Area matched (or every relevant Area was a
      duplicate), leave the bookmark in the inbox, untouched.
4. Print a summary report: a table of `bookmark → area(s) → draft path(s)`, plus
   lists of any "no match" and "duplicate" bookmarks.

## Mode 2 — Interactive single-file (no arguments)

Ask, then act:

1. Ask **which bookmark** to curate. Offer the current inbox `.md` files
   (excluding `README.md`) as choices so the user can pick one.
2. Ask **which Area(s)** to curate it against — allow **selecting more than one**.
   Offer the discovered Areas as choices.
3. Read the chosen bookmark. **De-dup check (per Area):** normalize its source URL
   and, for each chosen Area, look up the (URL, Area) pair; if present, tell the
   user it's a possible duplicate for that Area and ask whether to proceed or skip.
4. For each chosen Area, write an area-specific draft into that Area's `draft/`
   folder and **append a `curated` row to the ledger**. When 2+ Areas are chosen,
   cross-link the sibling drafts under `## Related`. Then **delete the original**
   inbox bookmark (source preserved via `source` / `captured_from`; recoverable
   from git).
5. Report the draft path(s).

## Notes

- Never write directly into an Area folder — always into its `draft/` subfolder.
- Each bookmark is judged **independently**; it can land in one Area, several (one
  area-specific draft each, cross-linked), or none. See "Multi-area bookmarks."
- Don't invent areas or build/lint/test steps — this is an Obsidian vault of notes.
