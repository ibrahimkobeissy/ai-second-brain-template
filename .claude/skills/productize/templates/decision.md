---
decision: {{decision-id}}
title: {{title}}
product: "{{product-name}}"
recommendation: {{GO | CONDITIONAL GO | PIVOT | NO-GO}}
confidence: {{low | medium | high}}
reads: [{{analysis ids consulted}}]
created: {{today}}
---
# {{title}} — {{product-name}}

> Synthesizes the Phase 2–4 analysis artifacts (resolved by frontmatter id). Every line of the recommendation must trace to a specific finding. Scaled to the PRD's `depth` (`depth-levels.md`): L1 — scorecard + call; L2 — + per-dimension rationale citing verdicts; L3 — + sensitivity (which dimension flip changes the call) and the conditions/milestones for a CONDITIONAL GO.

## Scorecard
| Dimension | Source analyses | Score (1–5) | Weight | Notes |
| --- | --- | --- | --- | --- |
| Market demand | market-study, value-proposition | | | |
| Competition / differentiation | competitive-landscape, competitive-differentiation, usp | | | |
| Financial viability | financial-model | | | |
| Legal / regulatory | legal-scan, regulatory-legal-assessment | | | |
| Team / feasibility | feasibility, risk-assessment | | | |

**Weighted score:** {{x}} / 5 · **Hard blockers:** {{none | …}}

## Recommendation: {{GO | CONDITIONAL GO | PIVOT | NO-GO}}
{{rationale citing the analysis verdicts that drove it; if CONDITIONAL, the conditions to clear; if PIVOT, the alternative direction}}
