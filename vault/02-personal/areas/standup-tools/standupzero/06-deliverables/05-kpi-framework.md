---
deliverable: kpi-framework
title: KPI & Metrics Framework
track: product
catalog: "6A.7"
product: "StandupZero"
status: draft
reads: [prd, financial-model, business-model-design]
created: 2026-06-22
---
# KPI & Metrics Framework — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` (1.8 success metrics) + [[07-financial-model]], [[01-business-model-design]]. Depth 3: North Star, AARRR funnel, targets, the one metric that kills the project.

## Summary
The North Star is **Draft-Acceptance Rate** — the % of generated drafts posted with only minor edits — because it is simultaneously the value proxy, the activation gate, and the kill-switch ([[13-idea-validation]]). Everything else (funnel, revenue) is downstream of it. If DAR doesn't clear the bar, no amount of growth tuning matters.

## North Star metric
**Draft-Acceptance Rate (DAR)** = drafts posted with edit-distance below a "minor edit" threshold ÷ total drafts generated.
- *Why:* it measures whether the product actually does its one job ([[08-value-proposition]]); it predicts retention (a bad draft = churn, [[03-customer-journey]]); and it's the pre-committed kill metric.
- **Kill threshold:** sustained DAR <50% over a cohort's first 2 weeks ⇒ stop/redirect ([[13-idea-validation]]). Target ≥70%.

## AARRR funnel metrics

| Stage | Metric | Why it matters | Early target (hypothesis) |
|---|---|---|---|
| **Acquisition** | Marketplace installs; OSS-CLI → signup rate | Tests the funnel that [[01-business-model-design]] depends on | n/a — establish baseline |
| **Activation** | % teams reaching first posted draft within 24h; **time-to-first-good-draft** | The decisive journey moment | ≥60% activate |
| **Retention** | Weekly-active teams at 4 / 12 weeks | [[07-financial-model]]'s top unknown (churn) | ≥40% W12 (low-switching market) |
| **Revenue** | Free→paid conversion; net revenue retention (seat expansion) | Sensitivity driver, not price | Conversion ≥3–5% |
| **Referral** | Teams inviting other teams; advocacy | The only cheap growth loop for a solo founder | establish baseline |

## Counter-metrics (guardrails)
- **LLM COGS / paid seat** — keep <5% of revenue ([[07-financial-model]]); alert if free-tier usage spikes COGS ([[04-pricing-strategy]] cap).
- **Edit-abandon rate** — drafts opened then discarded (a quality signal DAR alone hides).
- **Notification opt-out rate** — proxy for fatigue.

## Instrumentation plan (depth 3)
- Log per-draft: generated tokens, edit-distance pre-post, posted/skipped, time-to-action. *This is the DAR pipeline — build it into the MVP ([[02-functional-spec]] E2/E3), not later.*
- Cohort by signup week; segment DAR by activity-density (sparse-activity users are the predicted weak cohort — S2.2).
- Privacy: metrics are aggregate; no draft *content* stored beyond the retention window ([[05-legal-scan]]).

## Trade-offs & alternatives
- **DAR as North Star (chosen)** vs **revenue/MAU** — revenue/MAU are lagging and, for an idea-stage product, vanity until quality is proven; DAR is the leading, falsifiable metric. Chosen for honesty over optimism.
- **Edit-distance threshold** for "minor edit" is a modeling choice — start with a heuristic (e.g. <20% characters changed), calibrate against human "was this good?" labels in the spike.

## Open questions & dependencies
- The "minor edit" threshold needs calibration in [[13-idea-validation]] before targets are meaningful.
- Retention target is a guess in a low-switching-cost market — set the real bar after first cohorts.
- Depends on instrumentation shipping inside the MVP ([[02-functional-spec]]).
