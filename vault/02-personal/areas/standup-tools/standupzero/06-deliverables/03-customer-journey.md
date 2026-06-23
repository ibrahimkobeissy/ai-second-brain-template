---
deliverable: customer-journey
title: Customer Journey Mapping
track: product
catalog: "6A.6"
product: "StandupZero"
status: draft
reads: [customer-discovery, value-proposition]
created: 2026-06-22
---
# Customer Journey Mapping — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[03-customer-discovery]], [[08-value-proposition]]. Depth 3: stages with touchpoints, emotions, friction, and the opportunity at each.

## Summary
The journey is bottom-up and PLG: an individual eng lead discovers StandupZero at a status-process trigger, self-serves a free trial with their own team, and the make-or-break moment is the **first week of drafts** — if quality holds, they keep it; if not, they churn silently. The single highest-leverage moment is **time-to-first-good-draft**, not signup.

## Journey stages (ICP: distributed-team lead already paying for a check-in bot — [[03-customer-discovery]])

| Stage | Touchpoint | Goal / JTBD | Emotion | Friction | Opportunity |
|---|---|---|---|---|---|
| **Trigger** | Team goes remote / grows past ~10 / standup "feels useless" | Find a better status process | Frustrated | Doesn't know category | Be present at the trigger: marketplace + "Geekbot alternative" content ([[07-gtm-strategy]]) |
| **Discover** | Marketplace, HN/Reddit, OSS CLI, peer referral | Evaluate options fast | Skeptical (seen bots before) | "How is this different?" — and it's *not*, much ([[10-competitive-differentiation]]) | Lead with the one concrete hook: "drafts from your commits" demo |
| **Activate** | OAuth GitHub+tracker, set schedule/channel | Get value with minimal setup | Hopeful but impatient | Integration scopes feel invasive (source-code fear, PRD 1.6) | Make "metadata-only, no code stored" explicit at the OAuth step |
| **First draft** ★ | The first auto-drafted standup | "Is this actually good?" | **Make-or-break** | A bad first draft = silent churn | Instrument edit-distance; tune hard for first-week quality ([[05-kpi-framework]]) |
| **Habit** | Daily review-and-post | Save time, trust the status | Relieved / indifferent | Draft drift, notification fatigue | One-tap post; respect timezone/OOO |
| **Expand** | More teammates, more squads | Standardize across team | Satisfied | Per-seat cost scrutiny | In-product invite; seat-based expansion ([[04-pricing-strategy]]) |
| **Advocate / Manager** | Rollup digest (post-MVP) | "Where are we?" answered | Trusting | Rollup deferred in MVP ([[02-functional-spec]]) | The rollup is the retention + upsell hook — prioritize after quality |

## The decisive moment
**Time-to-first-good-draft** dominates the whole journey. Because the value is non-exclusive ([[08-value-proposition]]) and switching cost is near-zero, *therefore* there is no second chance — a weak first-week draft loses the user to the free incumbent they already had. This is why [[13-idea-validation]]'s quality gate precedes scale.

## Trade-offs & alternatives
- **Self-serve activation (chosen)** vs **guided/concierge onboarding** — concierge would lift first-draft quality but doesn't scale for a solo founder at $4/seat; self-serve chosen, with concierge reserved for early design partners only.
- **Surface the privacy stance early (chosen)** vs **keep onboarding frictionless** — naming "metadata-only" adds a beat to OAuth but pre-empts the top objection; chosen because the source-code fear is the biggest activation drop-off risk.

## Open questions & dependencies
- Real drop-off points are unmeasured (no users yet) — instrument from day one ([[05-kpi-framework]]).
- Does surfacing the privacy stance help or scare at OAuth? A/B once live.
- Feeds [[09-uiux-mockup]] (the screens for each stage) and [[07-gtm-strategy]] (trigger/discover tactics).
