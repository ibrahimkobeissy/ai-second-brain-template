---
analysis: market-study
title: Market Study / Market Assessment
product: "StandupZero"
status: complete
verdict: moderate
confidence: medium
depends_on: []
key_findings:
  - "TAM ≈ $0.3–0.5B/yr (async status tooling); SAM ≈ $80–120M; solo-founder 3-yr SOM is small (~$50–150K ARR)."
  - "Strongest segment pull: remote / async-first engineering teams — the only segment where the standup pain is acute daily."
  - "Biggest demand risk: demand is for the *category*, which is already served by cheap/free incumbents — willingness to pay a *premium* for auto-draft is unproven."
created: 2026-06-22
---
# Market Study — StandupZero

> Reads `02-prd.md`. Scaled to depth 3 (scenarios, sensitivity, what-would-change, sources plan, active research).

## Summary
Real, proven demand for async-status tooling exists — multiple vendors sustain paid businesses — but it is a mature, low-priced category, not a greenfield. Demand specifically for *auto-drafted* standups is plausible and growing on the back of remote work + cheap LLMs, yet unproven as a premium people will pay extra for. **Verdict: moderate** — the market is real but neither large-per-seat nor unserved.

## Analysis

### Sizing (top-down TAM)
- Population: ~28.7M professional developers worldwide (SlashData/Statista cluster; estimates span 20–47M by definition). Use 28.7M as a conservative base.
- Addressable: assume ~30% sit in teams that would tool async status (distributed / process-mature / >5 eng) → ~8.6M seats.
- Price: blended ~$4/seat/mo (incumbent band $2.50–5).
- **TAM ≈ 8.6M × $4 × 12 ≈ $0.41B/yr.** Sensitivity: the 30% adoption assumption swings this from ~$0.27B (20%) to ~$0.55B (40%). A real but mid-sized category, not a $B+ one.

### Sizing (bottom-up SAM / SOM)
- **SAM** — English-first, reachable via Slack/GitHub/Atlassian marketplaces, in the remote/async + mid-market segments: ~20–30% of TAM → **~$80–120M/yr**.
- **SOM** — solo founder, part-time, no funding, no distribution, 3-yr horizon: capturing even 0.1% of SAM ≈ **$80–120K ARR**, and that is an *optimistic* read against free-tier incumbents. Base case is lower (~$30–60K). **The obtainable market, not the total market, is the binding number — and it is small.**
- The two methods don't conflict: top-down says "real category," bottom-up says "tiny obtainable slice for this founder profile." I trust the bottom-up SOM for the decision.

### Demand drivers & trend
- **Growing:** remote/distributed-work normalization; developer-experience / "protect flow" focus; meeting fatigue; LLMs making auto-draft cheap.
- **Headwind:** developer-population growth decelerating (~10%/yr, from ~20–30%); tightening tooling budgets; the category is commoditizing toward free tiers.
- Net trend: **growing but maturing** — demand is rising while per-seat value is being competed down.

### Segments (strongest pull)
1. **Remote / async-first teams (beachhead)** — only segment feeling the pain *daily*; already pay for async tools. Highest pull.
2. **Mid-market eng orgs (30–250)** — budget exists, but pain is milder and sales friction higher.
3. **Startups/small teams** — low pain (everyone already knows what everyone does); freemium funnel, not revenue.

## Evidence & assumptions
- **Grounded in:** developer-population figures (SlashData/Statista, 2025); incumbent pricing $2.50–5 (Geekbot, DailyBot, Range, Jell, Standuply); a sustained multi-vendor market = demand is real; PRD 1.2 segments.
- **Assumed / needs primary research:** the 30% "would-tool-async-status" share is an estimate, not measured; per-seat WTP for *auto-draft specifically* is unverified; SOM assumes a distribution channel the founder does not yet have.

## What would change this verdict
- **Up (→ strong-demand):** evidence that auto-draft commands a real price premium (e.g. teams paying $8–12/seat for it), or a reachable distribution channel that lifts SOM by 5–10×.
- **Down (→ weak):** confirmation that free tiers absorb most demand and paid conversion for a single-feature tool is < 2%.

## Sources to gather (primary)
- Marketplace install/review counts for async-standup apps (Slack/Atlassian) → real paid-seat density.
- 5–8 discovery interviews on WTP for auto-draft vs. existing free check-ins.

## Conclusion
**Moderate demand, medium confidence.** The category is real and proven but mature, cheap, and crowded; the founder-obtainable slice (SOM) is small. This feeds `06-feasibility` (demand side) and `07-financial-model` (SOM as revenue ceiling): demand alone does not justify the build — the differentiation and distribution questions decide it.

*Sources: [SlashData](https://www.slashdata.co/post/global-developer-population-trends-2025-how-many-developers-are-there) · [Statista](https://www.statista.com/statistics/627312/worldwide-developer-population/) · [Steady "Best Async Standup Tools 2025"](https://runsteady.com/best-async-standup-tools/) · [Geekbot pricing](https://geekbot.com/pricing/).*
