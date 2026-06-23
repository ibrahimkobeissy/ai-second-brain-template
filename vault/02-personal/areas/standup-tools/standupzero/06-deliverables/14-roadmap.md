---
deliverable: roadmap
title: Product Roadmap
track: product
catalog: "6.R"
product: "StandupZero"
status: draft
reads: [prd, functional-spec, spec-generation, technical-spec, gtm-strategy, pricing-strategy, kpi-framework, idea-validation]
created: 2026-06-22
---
# Product Roadmap — StandupZero

> Phase-6 synthesis. Sequences the Phase-6 deliverables + epics into phased releases with a hard gate between each. Depth 3: phases, gates, trade-offs. **Context:** GO is a founder override of an analytical PIVOT ([[05-go-no-go]]); the roadmap is therefore **validation-gated** — the cheap kill-tests come *first*, by design, so the override fails fast and cheap if the analysis was right.

## Summary
Four phases, each with a go/no-go gate. The roadmap front-loads the two things most likely to kill the project — **draft quality** and **the distribution loop** — before any significant build, because [[15-risk-assessment]] flagged exactly those as the dealbreakers. The sequence is deliberately the opposite of "build the whole product, then see": prove the risky assumptions, then scale.

## Phase R0 — Validate (weeks 0–6) · *cheapest, kills fastest*
- **Build:** the open-source standup CLI ([[07-gtm-strategy]] wedge) + the drafting pipeline core ([[08-technical-spec]] LLM gateway + draft generation), enough to run the spike.
- **Do:** the [[13-idea-validation]] draft-quality spike on the founder's + 2–3 design-partner repos; 5–8 discovery interviews; trademark clearance on the name ([[05-legal-scan]]).
- **🚦 Gate G0:** DAR ≥70% over 2 weeks **and** interviews show real pull. <50% or "we like writing our own" → **STOP / pivot** (honors [[05-go-no-go]] analytical recommendation). Name cleared or chosen.

## Phase R1 — MVP & soft launch (weeks 6–16)
- **Build:** MVP cut line ([[02-functional-spec]] / [[11-spec-generation]]) — GitHub + one tracker → draft → Slack review/post; team/seat admin; free-tier cap; **DAR instrumentation live** ([[05-kpi-framework]]); foundations/CI ([[13-devops]]), schema ([[12-data-model]]).
- **Do:** soft launch Free tier to CLI users + marketplaces ([[07-gtm-strategy]] Phase 1); instrument the funnel.
- **🚦 Gate G1:** activation ≥60%, early retention signal positive, **OSS-CLI → signup conversion proves the loop works**. If the loop doesn't convert, the economics never close ([[07-financial-model]]) → reassess.

## Phase R2 — Expand & monetize (months 4–8)
- **Build:** Team tier billing ([[04-pricing-strategy]]), multi-tracker, history/admin polish, referral loop.
- **Do:** convert Free→Team; content engine ([[10-marketing-strategy]]); recruit case studies.
- **🚦 Gate G2:** free→paid conversion ≥3–5%, retention holds (W12), COGS/seat <5%. Sustainable unit economics or stop scaling spend.

## Phase R3 — Mid-market & rollup (months 8+)
- **Build:** Business tier — manager rollup digest ([[02-functional-spec]] S4.3, [[09-uiux-mockup]] Screen 4), analytics, SSO; SOC 2 readiness → certify if demand justifies ([[13-devops]]).
- **Do:** target mid-market eng orgs; the rollup is the retention + upsell hook.
- **🚦 Gate G3:** mid-market willingness to pay for rollup + the SOC 2 cost is justified by pipeline.

## Phasing trade-offs & alternatives
- **Validation-first (chosen)** vs **build-MVP-first** — given the override, front-loading the kill-tests is the only responsible sequence; it makes the contrarian bet cheap to be wrong about. Build-first risks months of solo effort on an already-commoditized wedge.
- **OSS-CLI before hosted (chosen)** vs **hosted-first** — the CLI is both the validation vehicle (R0) and the distribution loop (R1); hosted-first would skip the cheapest test and the only viable channel.
- **Latent pivot kept warm:** the architecture ([[06-adr]] ADR-003 gateway, [[13-devops]] self-host variant) and messaging ([[10-marketing-strategy]] privacy line) keep the [[12-blue-ocean]] privacy-first pivot one decision away, should G0/G1 expose the mainstream path as unwinnable.

## Open questions & dependencies
- Every phase past R0 is contingent on G0 (draft quality) — there is no roadmap if the drafts aren't good enough.
- Tracker choice (Jira vs Linear) at R1 depends on the confirmed beachhead.
- The distribution-loop conversion (G1) is the second existential unknown ([[07-gtm-strategy]]).
