---
name: productize-analysis-slip
description: Phase-2 analysis selection for the productize toolkit — read a product's PRD and recommend which analyses to run, then let the user check/uncheck. Interactive tier; invoked by productize-analyze, not run standalone.
---
# Analysis Slip (Interactive)

Recommend which analyses to run for a product, then let the user choose. Invoked by `productize-analyze`.

## How to run
1. Read the product's `02-prd.md` (note its `depth`) and the catalog `.claude/skills/productize/analyses/catalog.md` (all 19 analyses).
2. For each catalog analysis, judge relevance from the PRD using its `relevant_when` — e.g. skip Location/Site for pure software; include the Legal Scan if PRD 1.6 flags regulation; weight Market/Competitive/Feasibility as the always-on core.
3. **Apply the depth dial** to set *how much* is pre-checked (the user still decides — depth only sets the default breadth; see `depth-levels.md`):
   - **depth 1 (Sketch):** pre-check only the **core essential** (typically `feasibility`, `market-study`, `competitive-landscape`, + any the PRD makes unavoidable like `legal-scan`).
   - **depth 2 (Standard):** pre-check the **full relevant** set for the product type.
   - **depth 3 (Investment-grade):** pre-check relevant **+ secondary** analyses (e.g. `swot`, `benchmarking`, `value-proposition`, `usp`, `industry-analysis`) — broad coverage.
4. Present a checklist: **Suggested** (pre-checked, each with a one-line *why* tied to a specific PRD fact) and **Available** (unchecked, incl. the ones judged N/A so the user can still add them). The user checks/unchecks freely.
5. Return the final selected set of analysis ids to `productize-analyze` — which renders it as an **ASCII dependency map** (the `## Analysis plan`) in `00-productization-plan.md` before running.

## Principles
- **Suggest, don't impose** — the user owns the final set; show all 19 as available, even the N/A ones.
- Justify each suggestion from a **specific PRD fact**, never generically ("you have EU users (1.6) → Legal Scan").
- **Dependencies:** if the user selects an analysis, auto-include its `depends_on` and tell them (e.g. selecting `feasibility` pulls in `market-study` + `competitive-landscape`).
