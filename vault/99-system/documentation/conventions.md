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

| field | values | notes |
| :-- | :-- | :-- |
| `type` | evergreen · literature · source · reference · moc · daily · draft · scout · synthesis | what *kind* of note it is (use `literature` for short sources like articles/tweets, and `source` for deep, structured breakdowns of books/papers) |
| `status` | inbox · draft · active · synthesized · archived | lifecycle state — the key retrieval dimension |
| `created` | `YYYY-MM-DD` | always this format, everywhere |
| `tags` | list | see Tags below |

Contextual fields when they apply: `area` (owning Area), `source` + `captured_from` (captured notes), `synthesized_into` (a draft folded into a synthesis).

## Note Types
Definitions for the `type` frontmatter field to ensure consistent cross-domain querying:

- **`evergreen`**: A durable, atomic note containing a single concept or claim written in your own words. The title is usually a full sentence.
- **`literature`**: A summary or extraction of key ideas from a short external source (article, tweet, video) in your own words, plus your reaction.
- **`source`**: A deep, structured, analytical breakdown of a long or dense external source (book, academic paper, long report).
- **`reference`**: Factual information, data, or system documentation (like this note) that you store for retrieval rather than deep thought.
- **`moc`**: Map of Content. A hub or index note that organizes, categorizes, and serves as an entry point for an Area.
- **`daily`**: A chronological daily journal or log note.
- **`draft`**: A curated, actionable note extracted from an inbox capture, waiting to be integrated or synthesized.
- **`scout`**: A lightweight, agent-generated discovery note containing a ranked list of verified external links to evaluate a new idea.
- **`synthesis`**: An agent-generated strategic plan created by analyzing and weighing multiple drafts against an Area's context.

## Tags
- lowercase, kebab-case, **plural** for topics (`agents`, not `Agent` or `agent`).
- `type` and `status` live in frontmatter, **not** as tags.
- Only create a tag you expect to use on ~5+ notes.

## Titles
- **Evergreen notes:** the title is a full-sentence claim (e.g. "Frictionless capture beats organized capture") so the `[[link]]` reads as an idea.
- **Captures / dated notes:** kebab-case filename.

## Links
- **Link-before-close:** every note links to ≥1 other note before you finish writing it.
- Navigate by links and backlinks, not deep folders.

## Templates
Evergreen / Literature / Source templates live in `99-system/templates/`. Point Obsidian's Templates plugin there.
