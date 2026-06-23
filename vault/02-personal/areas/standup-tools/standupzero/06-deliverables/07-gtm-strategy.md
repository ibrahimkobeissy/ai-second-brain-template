---
deliverable: gtm-strategy
title: Go-to-Market Strategy
track: product
catalog: "6A.4"
product: "StandupZero"
status: draft
reads: [customer-discovery, market-study, pricing-strategy, usp]
created: 2026-06-22
---
# Go-to-Market Strategy — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[03-customer-discovery]], [[01-market-study]], [[04-pricing-strategy]], [[16-usp]]. Depth 3: beachhead, channels, the distribution problem confronted head-on, launch sequence.

## Summary
GTM is the project's hardest problem and its biggest risk ([[15-risk-assessment]] R2): a solo founder with no distribution entering a market won on distribution ([[09-benchmarking]]). This strategy doesn't pretend otherwise — it bets everything on **one cheap, compounding loop (an open-source standup CLI) feeding a marketplace-listed SaaS**, aimed at a single beachhead. If that loop doesn't compound, the economics never close.

## Beachhead (narrow on purpose)
**Remote / async-first engineering teams of 10–50 already running a check-in bot** ([[03-customer-discovery]] ICP). *Because* they've admitted the problem and pay for it, *therefore* they're the cheapest to convert — "switch from typing your Geekbot update to having it drafted."

## The distribution problem, stated plainly
[[16-usp]] is *vague* and [[10-competitive-differentiation]] is *parity* — so StandupZero **cannot win on message differentiation**. It must win on (a) being present at the buying trigger and (b) a near-zero-CAC loop. Paid acquisition is uneconomic at $4/seat. This is the override's central liability; the plan below is the only honest path, and it is unproven.

## Channels (in priority order)
1. **Open-source standup CLI (the wedge loop).** A free CLI that generates a standup from local git + a tracker, posts to terminal/Slack. *Mechanism:* developers find it on GitHub/HN, use it, hit its limits (no team view, no scheduling, no hosted history) → upsell to the hosted SaaS. It doubles as: distribution, a credibility signal, and a partial answer to the privacy objection (runs locally). This is the compounding loop the whole model rests on ([[01-business-model-design]]).
2. **Marketplaces** — Slack App Directory, GitHub Marketplace, Atlassian Marketplace. Be present where the buying trigger lands; optimize "Geekbot/Standuply alternative" discovery.
3. **Founder content / community** — comparison content, "how we draft standups from commits" technical posts, presence in EM/async-work communities ([[03-customer-discovery]] watering holes: Rands, r/ExperiencedDevs, HN, LeadDev).
4. **Design partners** — 3–5 hand-recruited teams for the [[13-idea-validation]] spike → case studies → referral.

## Launch sequence
- **Phase 0 — Validate (pre-launch):** ship the OSS CLI + run the draft-quality spike with design partners ([[13-idea-validation]]). Gate: DAR ≥70%.
- **Phase 1 — Soft launch:** hosted SaaS Free tier to the CLI's users + marketplaces; instrument the funnel ([[05-kpi-framework]]).
- **Phase 2 — Expand:** convert Free→Team, add multi-tracker, recruit referrals; introduce Business/rollup for mid-market.

## Trade-offs & alternatives
- **OSS-CLI loop (chosen)** vs **paid ads / outbound** — ads/outbound don't pencil at this ACV; the OSS loop is the only near-zero-CAC option, but its conversion is unproven (the key risk). Chosen as the least-bad bet, explicitly flagged as load-bearing.
- **Single beachhead (chosen)** vs **broad launch** — broad launch spreads a solo founder thin against funded incumbents; narrow focus is the only way to get a foothold.
- **Lead with privacy/local (considered)** — the CLI's local-first nature lets us *test* the privacy angle ([[12-blue-ocean]]) cheaply even under the head-on plan; a built-in option to pivot if the mainstream loop stalls.

## Open questions & dependencies
- **Does the OSS CLI convert to paid?** Unknown and decisive — measure CLI→signup→paid early ([[05-kpi-framework]]).
- Marketplace approval timelines + the "ZeroStandup" name collision affecting listing/SEO ([[05-legal-scan]]).
- Depends on the quality gate ([[13-idea-validation]]) clearing before spend on launch.
