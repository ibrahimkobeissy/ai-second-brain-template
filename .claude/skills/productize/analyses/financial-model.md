---
analysis: financial-model
title: Financial Modeling & Valuation
catalog: "2.5"
depends_on: [market-study]
reference_skills: [finance-metrics-quickref, saas-economics-efficiency-metrics, saas-revenue-growth-metrics, business-health-diagnostic]
relevant_when: "always once a revenue model exists (PRD 1.4)"
---
# Financial Modeling & Valuation — analysis spec

**Evaluates:** revenue, cost, cash-flow and ROI under a few scenarios.
**Reads:** PRD 1.4 (revenue model), 1.7 (resources) + `market-study` (SOM as the revenue ceiling).
**Method:**
- Build conservative / base / optimistic scenarios — state the 2–3 assumptions each hinges on.
- For SaaS: unit economics (CAC, LTV, payback, gross margin); flag if LTV:CAC is implausible.
- Sanity-check revenue against `market-study`'s SOM — a model above the obtainable market is fiction.
**Writes:** artifact per template. `verdict` ∈ {sound, fragile, unviable}. `key_findings`: break-even point · the assumption the model is most sensitive to.

*Re-authored from Dean Peters' Product-Manager-Skills (`finance-metrics-quickref`, `saas-economics-efficiency-metrics`, `saas-revenue-growth-metrics`, `business-health-diagnostic`), CC BY-NC-SA 4.0 — attribution per Build Stance.*
