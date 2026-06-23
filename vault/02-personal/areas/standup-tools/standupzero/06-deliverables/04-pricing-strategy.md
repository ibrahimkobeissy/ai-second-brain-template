---
deliverable: pricing-strategy
title: Revenue Model & Pricing Strategy
track: product
catalog: "6A.2"
product: "StandupZero"
status: draft
reads: [business-model-design, financial-model, market-study]
created: 2026-06-22
---
# Revenue Model & Pricing Strategy — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[01-business-model-design]], [[07-financial-model]], [[01-market-study]]. Depth 3: tiers, price points with derivation, packaging, sensitivity.

## Summary
Three tiers — **Free (≤10 seats), Team ($4/seat/mo), Business ($7/seat/mo)** — per active engineer, annual discount ~20%. The defining call: price *at* the incumbent band, not above it, because [[10-competitive-differentiation]] is parity — there is no premium to charge. Revenue grows by seat expansion and the Business-tier rollup, not by out-pricing rivals.

## Tiers & packaging

| Tier | Price (mo, billed annually) | Seat cap | Includes | Rationale |
|---|---|---|---|---|
| **Free** | $0 | ≤10 active | GitHub + 1 tracker, auto-draft, Slack post, daily cap on drafts | The CAC engine ([[01-business-model-design]]); matches Geekbot/Range free<10 |
| **Team** | $4 / active seat ($3.20 annual) | unlimited | + multi-tracker, no draft cap, schedules, history | Mid of the $2.50–5 band ([[01-market-study]]); the volume tier |
| **Business** | $7 / active seat ($5.60 annual) | unlimited | + manager rollup, analytics, SSO, priority support | Captures the rollup buyer (mid-market); the expansion/upsell path |

**Billing unit — "active seat":** charged only for engineers who actually receive drafts in a month (mirrors Geekbot's participant-based billing) — lowers buyer friction and aligns price to value.

## Price-point derivation
- **Anchor:** incumbents at $2.50 (DailyBot) → $3 (Geekbot, Range) → $4 (Jell) → $5 (Standuply) ([[01-market-study]]). Buyers have a strong reference price.
- **Position Team at $4:** *because* differentiation is parity, pricing above Geekbot's $3 risks losing on price; *but* slightly above the floor signals the auto-draft value and protects the ~95% gross margin ([[07-financial-model]]) with room for COGS.
- **Business at $7:** the rollup/analytics/SSO bundle targets a buyer with budget; *therefore* the per-seat uplift is justified by a different buyer (manager), not a feature tax on the same user.
- **COGS check:** at $4 with ~$0.15/seat COGS, gross margin ≈ 96% ([[07-financial-model]]); even the Business tier's heavier usage stays >90%.

## Free-tier economics (the risk to manage)
Free users incur real LLM COGS. *Mitigation:* a **daily draft cap on Free** (e.g. 1 scheduled draft/user/day, no ad-hoc regeneration) caps COGS leakage; cheap model on Free, better model on paid. Without the cap, a large free base could erode the thin absolute margins.

## Sensitivity
- **The model is insensitive to price, sensitive to conversion + retention** ([[07-financial-model]]): moving Team $3↔$5 changes ARR less than a 2pp change in free→paid conversion. *Therefore* optimize the funnel ([[07-gtm-strategy]]), not the price.
- Discounting below $3 to beat Geekbot would trade away margin for a price war you can't win on brand — explicitly rejected.

## Trade-offs & alternatives
- **Per-seat (chosen)** vs **flat per-team** — per-seat enables expansion revenue and matches the category's mental model; flat is simpler but caps upside and is unusual here.
- **Freemium (chosen)** vs **free trial only** — freemium is the category's proven acquisition norm; a time-limited trial would cut the funnel that [[01-business-model-design]] depends on.
- **Three tiers (chosen)** vs **two** — the third (Business) exists to monetize the manager/rollup buyer separately; without it, there's no upsell path.

## Open questions & dependencies
- Real free→paid conversion is unknown (no data) — the single most important number; instrument via [[05-kpi-framework]].
- Will the Free draft-cap frustrate enough to convert, or to churn? A/B the cap level.
- Annual-discount depth vs cash-flow for a bootstrapped founder.
