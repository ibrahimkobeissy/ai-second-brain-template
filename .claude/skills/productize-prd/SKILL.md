---
name: productize-prd
description: Phase-1 PRD generator for the productize toolkit — turn 01-product-intake.md into a standardized PRD (02-prd.md, sections 1.1–1.9). Component tier; invoked by productize-new, not run standalone.
---
# PRD Generator (Component)

Turn `01-product-intake.md` into a standardized PRD at `areas/<area>/<product>/02-prd.md`. Invoked by `productize-new` after intake.

## Input / Output
- **Reads:** `01-product-intake.md` (the 13 fields, incl. `depth` + `html_report`).
- **Writes:** `02-prd.md` from `.claude/skills/productize/templates/prd.md`, filling sections 1.1–1.9.
- **Carry `depth` + `html_report` forward:** copy both from the intake frontmatter into the PRD frontmatter — `depth` becomes the canonical thoroughness setting every Phase 2+ skill reads; `html_report` is the opt-in that `productize-build` checks to decide whether to auto-run `productize-report` at the end.

## How to write each section
Draw content from intake; where a section has an established method (re-authored under `.claude/skills/productize/methods/`), apply it:
- **1.1 Project Overview** → `methods/problem-statement.md` — a sharp problem before any solution.
- **1.2 Target Market** → `methods/proto-persona.md` — segment → persona + job-to-be-done.
- **1.3 Product & Service** → `methods/positioning-statement.md` — differentiated positioning.
- **1.9 Assumptions & Open Questions** → `methods/problem-framing-canvas.md` — surface unknowns honestly.
- **1.4–1.8:** synthesize directly from intake.

**Don't pad.** Where intake is thin, mark a genuine unknown as an open question in 1.9 rather than inventing detail.

**Scale to `depth`** (per `.claude/skills/productize/depth-levels.md`): L1 — each section a tight paragraph; L2 — each section substantive with the method applied + specifics; L3 — add scenario framing, explicit alternatives, and a research plan in 1.8/1.9. Depth scales rigor, never invented certainty.

## Edit-then-confirm (required)
1. Generate the full draft PRD.
2. Show it to the user; invite edits **section by section**.
3. Apply edits, then ask for explicit confirmation.
4. On confirm, set `status: active` in the PRD frontmatter — the confirmed PRD is the **single source of truth**; every later phase reads it.

## Done when
`02-prd.md` exists, all 9 sections filled (unknowns honestly flagged in 1.9), user-confirmed, `status: active`. Hand back to `productize-new` for plan init.
