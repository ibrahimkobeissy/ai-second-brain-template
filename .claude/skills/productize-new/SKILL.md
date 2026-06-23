---
name: productize-new
description: Phase-1 productize orchestrator — scaffold a product under an Area, run intake, generate the PRD, and initialize the control plan. Use to productize/start a new product from an Area idea (intake → PRD → plan). Invoke this first; later phases are productize-analyze / -decide / -build / -report.
---
# Productize · New (Phase 1) — intake → PRD → plan

Orchestrate Phase 1 for a new product. **Read `.claude/skills/productize/conventions.md` first** (layout, scaffold, KG contract).

## Steps
1. **Resolve area + product.**
   - Product name: from the invocation argument if given, else ask.
   - Area: list the Areas under `vault/01-work/areas/` and `vault/02-personal/areas/` and ask which one this product belongs to — **don't guess.**
   - Derive a kebab `<product>` slug.
2. **Scaffold** `areas/<area>/<product>/` with a `03-analyses/` subfolder (per conventions → numbered scaffold). **If the folder already exists, stop and ask** — never overwrite. Also create the **product MOC** `<product>.md` from `.claude/skills/productize/templates/product-moc.md` — the uniquely-named, stable graph node. Then link the Area hub (`<area>.md`) to `[[<product>]]` (the MOC), **not** to a numbered artifact.
3. **Intake** — invoke the **`productize-intake`** skill → writes `01-product-intake.md`. This is where the **thoroughness level** is set (intake Q12: 1 Sketch / 2 Standard / 3 Investment-grade; see `.claude/skills/productize/depth-levels.md`) and the **final-HTML-report opt-in** (intake Q13: `html_report` yes/no — the capstone `productize-report` webpage; see `.claude/skills/productize-report/SKILL.md`) — both flow into the PRD and govern later phases.
4. **PRD** — invoke the **`productize-prd`** skill → writes `02-prd.md` (runs its own edit-then-confirm loop; the user must confirm).
5. **Initialize the plan** — copy `.claude/skills/productize/templates/productization_plan.md` into the product folder as `00-productization-plan.md`, fill `{{product-name}}` / `{{area-slug}}` / `{{today}}`, set `{{phase}}` = "2 — Analysis", and mark the Phase-1 row done (`☑`).
6. **Report** — show the created files (the `<product>.md` MOC + `00-`/`01-`/`02-`) and the next step: run the **`productize-analyze`** skill.

## Guarantees
- Never overwrite an existing product folder without asking.
- The user **confirms the PRD** before the plan marks Phase 1 done (the Phase-1 gate).
- Writes only inside `areas/<area>/<product>/` — no other Area files are touched.
