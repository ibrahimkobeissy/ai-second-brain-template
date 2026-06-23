---
deliverable: business-model-design
title: Business Model Design
track: product
catalog: "6A.1"
product: "StandupZero"
status: draft
reads: [financial-model, value-proposition, market-study]
created: 2026-06-22
---
# Business Model Design — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[07-financial-model]], [[08-value-proposition]], [[01-market-study]]. Depth 3. **Context:** GO is a founder override of an analytical PIVOT ([[05-go-no-go]]) — this model is built for the head-on PRD, with the distribution/differentiation risks carried explicitly, not assumed away.

## Summary
StandupZero is a bottom-up, product-led, per-seat SaaS: free for small teams, paid per active engineer, sold through the Slack/GitHub/Atlassian marketplaces. The single most important design call is **product-led + free-tier-led distribution** — because [[09-benchmarking]] shows the category's winners won on distribution, and it's the founder's weakest axis.

## Business Model Canvas

**Value proposition** (from [[08-value-proposition]], *moderate / non-exclusive*): "Your standup writes itself from your real work." Honest caveat baked into the model: this is *not* a unique value, so the model cannot rely on differentiation — it must win on funnel efficiency and retention.

**Customer segments:** primary = remote/async-first eng teams; expansion = mid-market eng orgs (rollup buyer). Startups = free-tier funnel.

**Channels (the crux):**
- Product-led self-serve via **Slack App Directory + GitHub Marketplace + Atlassian Marketplace** (where the category's buying trigger lands).
- Founder-led content / OSS funnel (an open-source standup CLI as top-of-funnel — see [[07-gtm-strategy]]).
- *Rejected:* outbound sales (uneconomic for a $4/seat ACV solo).

**Customer relationships:** self-serve onboarding, in-product activation, automated lifecycle email; community support (no human-touch sales at this price).

**Revenue streams:** per-seat subscription (detail in [[04-pricing-strategy]]); future rollup/analytics tier as upsell.

**Key resources:** the founder's time (scarcest), the LLM API, the marketplace listings, the activity-ingestion + drafting pipeline.

**Key activities:** draft-quality tuning (the make-or-break per [[13-idea-validation]]), integration maintenance, funnel/content.

**Key partners:** LLM provider (Anthropic/OpenAI — also a cost dependency), Slack/GitHub/Atlassian (distribution + platform risk per [[04-industry-analysis]]).

**Cost structure:** near-zero fixed; variable LLM COGS ~3–5% of revenue ([[07-financial-model]]); founder opportunity cost is the real cost.

## Model mechanics
- **Type:** product-led growth (PLG), bottom-up land-and-expand. *Because* the buyer is the team lead and ACV is low, *therefore* acquisition must be self-serve and viral, not sales-led.
- **Free tier as CAC engine:** mirrors Geekbot/Range (free <10 users). The free tier *is* the acquisition channel, not a cost center.
- **Expansion path:** seat growth within a team → workspace → org rollup tier.

## Trade-offs & alternatives
- **PLG + free tier (chosen)** vs **sales-led** — sales-led is impossible at $4/seat solo; PLG is the only viable motion but depends on a working funnel the founder hasn't proven (the live risk).
- **Open-core (OSS CLI + hosted paid)** vs **closed SaaS** — open-core doubles as distribution (top-of-funnel) *and* a partial answer to the privacy objection; chosen as the funnel wedge, with closed hosted tiers for revenue. Rejected pure-closed because the founder has no other channel.
- **Per-seat** vs **flat per-team** — per-seat aligns price to value and enables expansion revenue; flat is simpler but caps upside. Per-seat chosen (see [[04-pricing-strategy]]).

## Open questions & dependencies
- Does the OSS-CLI-as-funnel actually convert? (Unproven — the model's load-bearing assumption; [[07-gtm-strategy]].)
- Retention in a low-switching-cost market ([[07-financial-model]] flagged churn as the top unknown).
- Free-tier abuse / COGS leakage if free users generate unlimited drafts — needs a usage cap (→ [[04-pricing-strategy]]).
