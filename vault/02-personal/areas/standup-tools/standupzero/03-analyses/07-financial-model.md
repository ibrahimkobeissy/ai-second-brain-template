---
analysis: financial-model
title: Financial Modeling & Valuation
product: "StandupZero"
status: complete
verdict: fragile
confidence: medium
depends_on: [market-study]
key_findings:
  - "Break-even is trivial (near-zero fixed costs; ~150–300 paid seats covers infra/tooling) — the model is fragile on REVENUE CEILING, not costs."
  - "The PRD's COGS worry is OVERSTATED: a cheap model on metadata is ~$0.10–0.20/seat/mo ≈ 3–5% of a $4 price; COGS only bites if you over-engineer context (premium model + whole-repo)."
  - "Most sensitive assumption: obtainable paid seats (customer acquisition). `market-study` SOM caps revenue at ~$50–150K ARR — a side-income, not a fundable business."
created: 2026-06-22
---
# Financial Modeling & Valuation — StandupZero

> Reads `02-prd.md` (1.4 revenue, 1.7 resources) + `market-study` (SOM as revenue ceiling). Depth 3: 3 scenarios with stated assumptions, SaaS unit economics, sensitivity.

## Summary
With near-zero fixed costs and a high gross margin, StandupZero breaks even on a few hundred seats — but `market-study`'s SOM caps the upside at side-income levels for a solo founder with no distribution. **The model is fragile not because of cost but because of the revenue ceiling and customer acquisition.** **Verdict: fragile, medium confidence.** A useful side note: it corrects the PRD's COGS fear.

## Analysis

### Unit economics (per seat, base assumptions)
- **Price:** $4/seat/mo (mid of $2.50–5 band; `market-study`).
- **COGS:** 1 draft/working-day ≈ 22/mo. A cheap/mid LLM on *metadata only* ≈ $0.005–0.01/draft → **$0.11–0.22/seat/mo (~3–5%)**. Gross margin ~95%. *Correction to PRD 1.4:* COGS is not the threat. It *becomes* one only under a premium model + large context (whole-repo summarization): $0.05–0.20/draft × 22 = $1.1–4.4/seat/mo → margin collapses. **Sensitivity: tokens-per-draft × model price is the COGS lever — controllable by design (stay metadata-only, cheap model).**
- **CAC:** low cash / high founder-time (content, marketplace SEO, community). The constraint is *time and reach*, not ad spend.
- **LTV:** at ~$48/seat/yr and uncertain retention in a low-switching-cost category, LTV is modest; LTV:CAC is plausible *only* if CAC stays near-zero (organic) — paid acquisition would not pencil.

### Scenarios (3-yr, solo + part-time)
| | Paid seats | ARR | Hinges on |
|---|---|---|---|
| **Conservative** | ~150 | ~$7K | No distribution; churn high in a free-tier market |
| **Base** | ~600 | ~$29K | Modest organic traction in async-first niche |
| **Optimistic** | ~2,500 | ~$120K | A real distribution channel + a defensible niche (pivot) |

All three sit inside `market-study`'s SOM (~$50–150K) — the optimistic case *is* the SOM ceiling. None funds a full-time salary; the realistic outcome is **profitable side-income, not a venture.**

### Sanity check vs SOM
Revenue model is *not* fiction — it sits below the obtainable market. The problem is the opposite of over-projection: even the ceiling is small.

## Evidence & assumptions
- **Grounded in:** incumbent pricing (`market-study`); LLM token-cost arithmetic; PRD 1.7 (no funding, part-time).
- **Assumed / needs primary research:** retention/churn (no data — biggest unknown after acquisition); CAC achievable organically; the seat counts (illustrative, not measured).

## What would change this verdict
- **→ unviable:** retention proves poor (monthly churn >5–7%) in a free-tier-dominated market, so seats leak as fast as they're won.
- **→ sound:** a repeatable low-cost acquisition channel emerges (e.g. a viral OSS CLI funnel) lifting base-case seats 5–10×.

## Sources to gather
- Benchmark churn for low-priced Slack-app SaaS (`09-benchmarking` overlaps).
- Actual LLM cost per representative draft on real repos (ties to the `13-idea-validation` spike).

## Conclusion
**Fragile, medium confidence.** Costs are not the risk (and the PRD's COGS worry is overstated); the binding sensitivity is **obtainable paid seats / acquisition**, which `market-study` caps low. Economically a side-income at best. Feeds `15-risk-assessment` and the Go/No-Go.
