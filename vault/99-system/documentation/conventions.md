---
type: reference
status: active
created: 2026-06-18
tags:
  - conventions
---

# Vault Conventions

The small set of rules that keep the vault consistent and retrievable. Keep it lite — one consistent choice collapses a hundred future decisions into one.

## Frontmatter (universal)
Every note carries:

| field     | values                                                                                | notes                                                                                                                                             |
| :-------- | :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`    | evergreen · literature · source · reference · moc · daily · power-map · draft · scout · synthesis | what *kind* of note it is (use `literature` for short sources like articles/tweets, and `source` for deep, structured breakdowns of books/papers) |
| `status`  | inbox · draft · active · synthesized · archived                                       | lifecycle state — the key retrieval dimension                                                                                                     |
| `created` | `YYYY-MM-DD`                                                                          | always this format, everywhere                                                                                                                    |
| `tags`    | list                                                                                  | see Tags below                                                                                                                                    |

Contextual fields when they apply: `area` (owning Area), `source` + `captured_from` (captured notes), `synthesized_into` (a draft folded into a synthesis).

## Note Types
Definitions for the `type` frontmatter field to ensure consistent cross-domain querying:

- **`evergreen`**: A durable, atomic note containing a single concept or claim written in your own words. The title is usually a full sentence.
- **`literature`**: A summary or extraction of key ideas from a short external source (article, tweet, video) in your own words, plus your reaction.
- **`source`**: A deep, structured, analytical breakdown of a long or dense external source (book, academic paper, long report).
- **`reference`**: Factual information, data, or system documentation (like this note) that you store for retrieval rather than deep thought.
- **`moc`**: Map of Content. A hub or index note that organizes, categorizes, and serves as an entry point for an Area. Each Area's `<area-slug>.md` is its MOC and **canonical context** — skills (`scout-idea`, `synthesize-drafts`, `curate-bookmarks`) read it as the Area's strategic baseline (no separate `README.md`).
- **`daily`**: A chronological daily journal or log note.
- **`power-map`**: An agent-generated power-dynamics read of a diary entry (real decision-maker, threats, allies, moves), produced by `analyse-diary`. Private — lives under `diaries/power-maps/`, never synced.
- **`draft`**: A curated, actionable note extracted from an inbox capture, waiting to be integrated or synthesized.
- **`scout`**: A lightweight, agent-generated discovery note containing a ranked list of verified external links to evaluate a new idea.
- **`synthesis`**: An agent-generated strategic plan created by analyzing and weighing multiple drafts against an Area's context.

## Special (non-note) Files
Two per-Area files are checklists, not notes — they carry **no standard frontmatter** and are driven by Obsidian plugins. Both feed the root [[dashboard]].

- **`todo-kanban.md`** — the Area's Kanban board (`kanban-plugin: board`). Open cards are `- [ ]` lines under `## Todo` / `## In Progress`.
- **`to-check.md`** — the Area's **triage queue**: raw links/items captured fast, waiting to be curated into `draft/` (via `curate-bookmarks`) or verified (via `scout-idea`). Format: a `# To Check — <Area>` heading, a one-line purpose, `Part of [[area]]`, then **one `- [ ]` per item** (URL + short `—` note, optionally grouped under `##` sub-headings). Once an item is acted on, **delete its line** (git keeps history). Never leave an empty `- [ ]` — it shows as a blank task on the dashboard. Created automatically by `init-area`.

## Tags
- lowercase, kebab-case, **plural** for topics (`agents`, not `Agent` or `agent`).
- `type` and `status` live in frontmatter, **not** as tags.
- Only create a tag you expect to use on ~5+ notes.

## Titles
- **Evergreen notes:** the title is a full-sentence claim (e.g. "Frictionless capture beats organized capture") so the `[[link]]` reads as an idea.
- **Captures / dated notes:** kebab-case filename.

## Formatting (line wrapping)
- **One paragraph = one line.** Never hard-wrap prose at a fixed column (~80). Write each paragraph as a single continuous line and let Obsidian soft-wrap it to the window width.
- **Why:** this vault runs with *Readable line length* **off** (and keeps it off). A single newline mid-paragraph stays a visual line break in Live Preview, so hard-wrapped text freezes at ~80 columns instead of filling the editor. (In Reading mode soft newlines collapse to spaces, masking the problem — but Live Preview, where editing happens, shows the stunted lines.)
- **Where hard breaks are still required:** between list items, between table rows, and inside fenced ``` code blocks ```. A blank line separates blocks (paragraph ↔ heading ↔ list).
- Applies to **every `.md` file any agent (Claude or Codex) writes or edits.** Mirrored in `CLAUDE.md` §7 so both agents load it.

## Links
- **Link-before-close:** every note links to ≥1 other note before you finish writing it.
- Navigate by links and backlinks, not deep folders.

## Templates
Evergreen / Literature / Source templates live in `99-system/templates/`. Point Obsidian's Templates plugin there.
