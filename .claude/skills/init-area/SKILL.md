---
name: init-area
description: >-
  Interactive skill to initialize a new Area. Asks for the idea, challenges it to ensure it's not just a project, and sets up the standard folder structure, kanban board, and context hub note.
---

# Initialize Area

Initialize a new Area (either Work or Personal) by challenging the idea, defining its goals, and scaffolding the required standard folders and hub notes.

## Vault Paths
- Work areas: `vault/01-work/areas/`
- Personal areas: `vault/02-personal/areas/`
- Output Folder: `vault/<part>/areas/<area-slug>/`
- Output Hub Note: `vault/<part>/areas/<area-slug>/<area-slug>.md`
- Output Kanban: `vault/<part>/areas/<area-slug>/todo-kanban.md`
- Output To-Check: `vault/<part>/areas/<area-slug>/to-check.md`
- Output Dashboard: `vault/<part>/areas/<area-slug>/<area-slug>-dashboard.md`
- Area Template: `templates/area-description.md`
- Kanban Template: `templates/kanban.md`
- To-Check Template: `templates/to-check.md`
- Dashboard Template: `templates/area-dashboard.md`

## The Workflow

### 1. Discovery & Challenge
1. **Type:** Ask the user if this new area belongs in Work (`01-work`) or Personal (`02-personal`).
2. **Name:** Ask for the name of the Area (this will be converted to `area-slug`).
3. **The Idea:** Ask the user to describe the core idea or purpose of this area.
4. **The Challenge:** Evaluate the idea objectively. Is this truly a long-term Area of responsibility or interest? Or is it a short-term project/single topic that belongs as a note inside an existing area? Challenge the user if it seems too narrow. If the user insists or it's a valid Area, proceed.

### 2. Gathering Context
Ask the user to explicitly define the following to fill out the Area Hub template:
- **The Goal:** What does success look like for this area?
- **Scope:** What is explicitly IN scope and OUT of scope?
- **How (Pipeline/Strategy):** What is the standard operating procedure or workflow for work done in this area?

### 3. Folder Scaffolding
Create the directory structure for the new Area:
- `vault/<part>/areas/<area-slug>/`
- `vault/<part>/areas/<area-slug>/draft/`
- `vault/<part>/areas/<area-slug>/scout/`
- `vault/<part>/areas/<area-slug>/synthesis/`

### 4. File Generation
1. **Kanban Board:** Copy `templates/kanban.md` to `vault/<part>/areas/<area-slug>/todo-kanban.md`.
2. **Hub Note:** Copy `templates/area-description.md` to `vault/<part>/areas/<area-slug>/<area-slug>.md`.
   - Replace all placeholders (`{{area_title}}`, `{{area_slug}}`, `{{today}}`, `{{area_goal}}`, `{{area_idea}}`, `{{in_scope}}`, `{{out_of_scope}}`, `{{area_how}}`) with the validated answers from the context gathering phase.
3. **To-Check Queue:** Copy `templates/to-check.md` to `vault/<part>/areas/<area-slug>/to-check.md`, replacing `{{area_title}}` and `{{area_slug}}`. This is the Area's triage queue and feeds the root [[dashboard]]; leave it with no `- [ ]` items (the user/agents add links over time).
4. **Area Dashboard:** Copy `templates/area-dashboard.md` to `vault/<part>/areas/<area-slug>/<area-slug>-dashboard.md`, replacing `{{today}}` and `{{area_slug}}`. This is the Area's focused live dashboard — a thin DataviewJS loader for the shared `99-system/views/area-dashboard` view, which auto-detects the Area from its own path and reuses the global dashboard's design/CSS. **Do not edit the loader body**; the view reads everything from the Area's files. (Every Area gets one by default.)

### 5. Review
Report back to the user that the Area has been successfully initialized, listing the paths of the created files and folders.

## Constraints
- Never skip the challenge phase. An Area is a heavy structure; it must be justified.
- Ensure the folder names are strictly lowercase kebab-case.
