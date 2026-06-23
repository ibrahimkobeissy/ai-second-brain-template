---
name: productize-decide
description: Phase-5 productize orchestrator — synthesize a product's analyses into a Go / No-Go recommendation. Use to run the decision gate (scorecard across the five dimensions → GO / CONDITIONAL GO / PIVOT / NO-GO) once the analyses exist. Prereq productize-analyze; next is productize-build.
---
# Productize · Decide (Phase 5) — Go / No-Go

The gate between analysis and execution. **Read `.claude/skills/productize/conventions.md` first.** Prereq: Phase 2–4 analyses exist in the product's `03-analyses/`.

## Steps
1. **Resolve product.** From the invocation argument or ask. Confirm `03-analyses/` has artifacts — else stop and say to run the **`productize-analyze`** skill first.
2. **Scorecard.** Run `decisions/go-no-go-scorecard.md`: read every analysis artifact's `verdict` + `key_findings` (from `03-analyses/*.md`), score the five dimensions, and write `05-go-no-go.md` per `templates/decision.md`. Output one of **GO / CONDITIONAL GO / PIVOT / NO-GO**. **Scale to the PRD's `depth`** (`depth-levels.md`): L1 — scorecard + recommendation; L2 — + per-dimension rationale citing verdicts; L3 — + a weighted-sensitivity read (which dimension flip changes the call) and the conditions/milestones for a CONDITIONAL GO.
3. **Branch.** If CONDITIONAL GO or mixed signals, offer `decisions/investment-readiness.md` and/or `decisions/pivot-or-proceed.md`; run if the user wants.
4. **Update the plan.** Mark the Phase-5 row in `00-productization-plan.md` and link `05-go-no-go.md`.

## Guarantees
- **Every verdict cites its source** — no recommendation without the analysis findings behind it.
- A **hard blocker** (legal blockers, not-viable feasibility) caps the outcome regardless of score.
- Honest over optimistic — a weak case earns NO-GO or PIVOT, not a comfortable hedge.
- Writes only inside `areas/<area>/<product>/`.
