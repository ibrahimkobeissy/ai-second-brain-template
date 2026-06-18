---
name: plan-to-kanban
description: >-
  Reads a strategic synthesis document and extracts its action items into the Area's Kanban board. 
  Copies the planned tasks into actionable tracking on the board; the synthesis doc stays the rationale of record.
---

# Plan to Kanban

Extract action items (checkboxes) from a synthesis document's "Global Plan" sections and inject them into the Area's Kanban board.

## Vault paths

- Work areas: `vault/01-work/areas/`
- Personal areas: `vault/02-personal/areas/`
- Area Kanban: `vault/<part>/areas/<area-slug>/todo-kanban.md`
- Synthesis Docs: `vault/<part>/areas/<area-slug>/synthesis/strategic-plan-*.md`
- Kanban Template: `templates/kanban.md` (in this skill folder)

## The Workflow

### 1. Area Discovery
The set of valid Areas is **dynamic** — discover it at runtime. List the immediate subdirectories of `vault/01-work/areas/` and `vault/02-personal/areas/`. 
- If the user specified an Area in their prompt, verify it against the discovered list.
- If no Area was specified, prompt the user to choose one from the discovered Areas.

### 2. Document Selection
List the available synthesis documents in the chosen Area's `synthesis/` folder (e.g., `strategic-plan-*.md`). 
- If there is only one, proceed with it.
- If there are multiple, ask the user which synthesis document to process.

### 3. Task Extraction
Read the selected synthesis document. 
- Locate the action items (Markdown checkboxes `- [ ]` and `- [x]`) under the "Phase 1: The Core" and "Phase 2: Speculative" sections.
- Extract the task descriptions. Keep the exact text and links so the context remains intact.

### 4. Kanban Creation / Update
Check if a `todo-kanban.md` exists in the root of the chosen Area (`vault/<part>/areas/<area-slug>/todo-kanban.md`).
- **If it does not exist:** Create it by copying `templates/kanban.md` from this skill's directory.
- **If it exists:** Read it first.
- **Deduplication:** Check the existing tasks in the Kanban board. Do not add a task if a very similar or identical task already exists in any column (Todo, In Progress, Done, Archived).
- **Append Tasks:** Add the new, non-duplicate extracted tasks to the top of the Todo column — match the `## Todo` heading **case-insensitively** (some older boards use `## TODO`) so tasks are never mis-placed or duplicated. Make sure to maintain valid Markdown format.

### 5. Feedback
Provide a clear, brief confirmation to the user listing how many tasks were extracted and successfully added to the Kanban board, and note any duplicates that were skipped.
