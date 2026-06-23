---
name: productize-plan
description: Productize control-file refresher — (re)generate a product's 00-productization-plan.md from its actual files on disk (phase status, prereqs, artifact links, the analysis dependency map). Use as the manual fallback when the plan drifted from reality (e.g. files were hand-edited); the phase skills update it automatically.
---
# Productize · Plan — refresh the control file

(Re)generate `00-productization-plan.md` from a product's **actual files on disk**. The phase skills update it automatically; this is the manual fallback when something drifted (e.g. files were hand-edited).

## Steps
1. **Resolve product.** From the invocation argument or ask; locate `areas/<area>/<product>/`.
2. **Scan the truth on disk** — derive state from files, not memory (match by suffix, ignore the `NN-` prefix):
   - `01-product-intake.md` + `02-prd.md` (`status: active`?) → Phase 1.
   - `03-analyses/*.md` + `04-report.md` → Phase 2–4 (list each artifact + its `verdict`; **reconstruct the `## Analysis plan` ASCII dependency map** from the artifacts present — level bands from the `NN` numbering, `◄── NN` edges from each artifact's `depends_on`).
   - `05-go-no-go.md` → Phase 5 (capture the recommendation).
   - `06-deliverables/*.md` → Phase 6.
   - `07-summary.html` → the capstone HTML report (list it under Artifacts if present; it's a cross-phase capstone, not a phase row).
3. **Rewrite the plan** from `.claude/skills/productize/templates/productization_plan.md`: set each phase row's status (☑ done / ▶ current / ☐ todo) from what exists, refresh the **artifact-link table** to only files that exist (numbered basenames), **regenerate the `## Analysis plan` ASCII dependency map** (level bands + `◄── NN` edges) from `03-analyses/`, surface the product's **`depth`** (read from `02-prd.md`) in the Status block, set `Current phase` to the first incomplete one, bump `updated`. *(Plan never generates analytical content, so it doesn't scale to depth — it only reports it.)*
4. **Report** what changed (phases re-marked, links added/removed).

## Guarantees
- **Truth = the filesystem.** Never mark a phase done without its artifact present.
- Links only to files that exist (no phantom links — the bug caught in PA-13).
- Touches only `productization_plan.md`; never edits artifacts.
