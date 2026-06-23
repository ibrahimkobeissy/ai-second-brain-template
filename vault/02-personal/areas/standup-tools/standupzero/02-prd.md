---
type: prd
product: "StandupZero"
area: "standup-tools"
status: active
depth: 3
html_report: yes
created: 2026-06-22
---
# PRD — StandupZero

Part of [[standup-tools]]. The **single source of truth** for this product; every later phase reads it — including `depth` (the thoroughness level set at intake; see `depth-levels.md`) and `html_report` (the capstone opt-in).

## 1.1 Project Overview

**Who.** Software engineering teams — most acutely remote / async-first and time-zone-distributed teams — and the engineering managers who consume their status.

**Problem.** Daily status reporting is paid for twice. (1) The synchronous standup taxes every engineer: a 15-minute meeting × N people, plus context-switch cost, often at a time-zone-hostile hour. (2) The output is low-trust: verbal updates are vague ("still working on the API"), unsearchable, and disconnected from what actually happened in the code. Async check-in bots (Geekbot et al.) remove the meeting but shift the cost onto the engineer, who must *write* the update from memory — so updates get skipped, rushed, or copy-pasted, and managers still can't trust them. The pain recurs **every working day, per engineer**, and scales linearly with team size.

**Proposed solution.** StandupZero composes each engineer's daily standup *for* them by reading what they actually did — commits, merged/open PRs, ticket transitions (Jira/Linear), and calendar — and producing a draft "yesterday / today / blockers" update the engineer reviews, edits, and posts (to Slack/Teams) in seconds. The smallest valuable version: ingest GitHub activity + one issue tracker, generate a per-person draft on a schedule, post to Slack after a one-tap confirm.

**Headline test.** *"My standup wrote itself this morning — I just hit send."* A target engineer would click that; a manager's variant: *"I finally trust the standup, because it's built from the commits."* The problem is sharp: it exists with or without StandupZero, and today's tools address the *meeting*, not the *writing*.

## 1.2 Target Market & Customer Profile

Global, English-first. B2B; the buyer is an engineering manager / team lead, the user is the individual engineer. Three candidate segments from intake — narrowed to **two primary** to avoid spreading thin; the third is a cross-cutting beachhead.

**Primary A — Remote / async-first teams (the beachhead).** *Hypothesis.* Distributed teams across ≥3 time zones where a synchronous standup is genuinely impossible, so they already run async check-ins and feel the "writing tax" daily.
- **Job-to-be-done:** "Keep the team aligned on progress and blockers without forcing anyone onto a call — and without making me write a report every morning."
- **Top pains:** time-zone-hostile meetings; status that's stale by the time it's read; the daily writing chore.
- Cross-cuts company size; highest pain density → best wedge.

**Primary B — Mid-market engineering orgs (30–250 engineers).** *Hypothesis.* Multiple squads; managers and PMs need a trustworthy cross-squad rollup, and per-seat budget exists.
- **Job-to-be-done (manager):** "Answer 'where are we?' across squads without chasing people or sitting through standups."
- **Top pains:** rollup is manual; updates are inconsistent across squads; low signal-to-noise.
- Willingness-to-pay per seat is plausible here; sales friction higher than A.

**Secondary — Startups / small eng teams (5–30).** Fast adoption, low procurement friction, but standup pain is milder (everyone already knows what everyone's doing) and budgets are tight. Likely freemium top-of-funnel, not the revenue core.

*All three are hypotheses to validate in Phase 2 (customer discovery / idea validation).*

## 1.3 Product & Service Description

**Type / delivery.** Cloud-hosted SaaS. Integrations: GitHub (v1), Jira/Linear, Slack/Teams, Google/Microsoft calendar. No code is stored — metadata only (see 1.6).

**Positioning (Moore frame).** *For* remote and mid-market software teams *who* need trustworthy daily status without the standup tax, *StandupZero* *is an* async standup tool *that* writes each person's update from their real dev activity. *Unlike* check-in bots (Geekbot, DailyBot, Standuply) that only *ask* engineers to type an update, *it* drafts the update from the work itself, so it gets done and it's grounded in what actually happened.

**Core features (deliver the key benefit):**
1. Activity ingestion — GitHub commits/PRs + one issue tracker, per engineer.
2. Draft generation — an LLM composes a concise "yesterday / today / blockers" from that activity.
3. Review-and-post — engineer edits the draft and posts to Slack/Teams in one tap.
4. Blocker/stale-PR detection — surfaces stuck PRs and idle tickets as candidate blockers.

**Secondary (later):** manager rollup digest, trend/velocity views, retro summaries, standup analytics.

**Differentiator (the gap we own):** *draft-from-activity*, not *prompt-to-type*. The riskiest part of the claim — that an auto-draft is good enough to post with minimal editing — is an open question (1.9), not an established fact.

## 1.4 Revenue & Business Model Hypothesis

- **Model:** per-seat subscription (per active engineer / month), billed monthly or annually.
- **Price band (hypothesis):** ~$3–6 / engineer / month. Anchored to known async-standup tools, which sit roughly in the low-single-digit $/user/month range — **these figures are approximate and must be verified in Phase 2 (`competitive-landscape` / `pricing`).** StandupZero may justify the upper end via the "it writes itself" value, or be undercut by incumbents' brand and free tiers.
- **Free tier:** small teams (e.g. ≤ N seats) free, to seed the startup segment and bottom-up adoption — converts to paid at team-size or feature thresholds.
- **Upsell:** manager rollup / analytics as a higher tier; per-integration or per-seat expansion as teams grow.
- **Unit-economics flag:** every generated draft costs LLM inference (a recurring per-seat-per-day COGS most competitors don't carry). Gross margin at low price points is a **real open question** for `financial-model` in Phase 2.

## 1.5 Competitive Landscape (what we already know)

*Known players (from intake; not exhaustive — `competitive-landscape` in Phase 2 will map the full market):*

| Competitor | Approach | Known strength | Known weakness (our wedge) |
|---|---|---|---|
| Geekbot | Scheduled async check-in bot in Slack | Category leader, simple, large install base, free tier | Engineer must **write** the update from memory |
| Standuply | Async standups + agile reporting bot | Broad agile feature set, integrations | Same write-it-yourself model; heavier |
| DailyBot | Async check-ins + chat workflows | Friendly UX, multi-use | Prompt-to-type, not activity-derived |
| Status Hero / Steady | Check-ins + goal/activity context | Pulls some activity signals already | Activity is *context*, not the generated draft (verify) |

**How we're different:** every incumbent removes the *meeting* but keeps the *writing*. StandupZero removes the writing by drafting from real activity. **Honest caveat:** some tools already pull activity feeds, so the differentiation is *degree* (auto-*authored* vs. activity-*annotated*) — Phase 2 must confirm no incumbent already auto-drafts well, or the wedge narrows.

## 1.6 Target Geography & Regulatory Context

- **Geography / language / currency:** Global launch, English-first, USD billing.
- **Entity status:** none yet — solo founder, idea stage; no incorporation.
- **Data privacy (GDPR / CCPA):** the product processes engineer identifiers and work activity = personal data → DPA, lawful basis, data-residency questions for EU customers.
- **Source-code sensitivity (central risk):** customers will resist any tool that stores source. Design constraint → **ingest metadata only** (commit messages, PR titles/status, ticket transitions), never code bodies; make this explicit in positioning. Sending commit messages to a third-party LLM is itself a customer objection to pre-empt.
- **Security expectations:** mid-market/enterprise buyers will expect SOC 2 (Type II) and SSO — a real cost/time gate for a solo founder; flagged for `legal-scan` / `risk-assessment`.

## 1.7 Team & Resources

- **Team:** one technical founder.
- **Capacity:** nights/weekends (part-time) — timeline measured in months to a usable MVP, not weeks.
- **Funding:** none (bootstrapped).
- **Implication:** scope discipline is existential. v1 must be one integration path (GitHub → LLM draft → Slack) shippable solo. SOC 2, multi-tracker support, and the manager-rollup tier are explicitly *post-validation*. Solo + part-time vs. funded incumbents is itself a strategic risk for Phase 2.

## 1.8 Vision & Success Criteria

**12-month goal.** Validate that auto-drafted standups are good enough that teams adopt and keep using them: a working MVP with paying or actively-retaining design-partner teams, and an answer to "is the draft quality high enough?"

**3-year vision.** The default async-status layer for engineering teams — the trustworthy "where are we?" built from real work, expanding from standups into rollups, retros, and velocity insight.

**Success metrics (hypotheses):**
- *Activation:* % of drafts posted with minimal edits (proxy for draft quality — the make-or-break metric).
- *Retention:* weekly active teams at 4 / 12 weeks.
- *Value:* self-reported time saved vs. prior standup; manager trust in the rollup.

**Scenario framing (depth 3):**
- **Conservative:** draft quality is mediocre; engineers edit heavily → no better than Geekbot → niche async-first adoption only.
- **Base:** drafts are good for routine days, weak on "why"/blockers; solid wedge in remote/async-first teams; modest per-seat revenue.
- **Optimistic:** drafts are trusted with one-tap posting; manager rollup becomes the hook; expands up-market and displaces check-in bots.

**Exit / ambition:** lifestyle/bootstrapped SaaS or acqui-hire by a dev-tools/Slack-ecosystem player; not a venture-scale assumption at this stage.

## 1.9 Assumptions & Open Questions

*Problem-framing canvas — honest unknowns before committing. These seed Phase-2 Risk Assessment + Idea Validation.*

**Key assumptions (must be true):**
- A1. Engineers will *trust and post* an auto-drafted update (vs. distrust/heavy-edit it).
- A2. GitHub + ticket activity contains enough signal to produce a *useful* "today / blockers" — not just a restated changelog of "yesterday."
- A3. Teams will let a tool read their dev activity and send commit/PR metadata to an LLM.
- A4. Per-seat price covers per-draft LLM COGS at a viable margin.
- A5. The "draft-from-activity" wedge is real — no incumbent already does this well.

**Unknowns (★ = least confident):**
- ★ **A2 — draft quality / "today & blockers" inference.** Past activity poorly predicts *intent*; this is the technical and value crux. If drafts can't credibly state today's plan and blockers, the product is a changelog, not a standup.
- ★ **A1 — adoption of machine-written status.** Cultural: will engineers and managers accept it, or see it as surveillance / low-effort?
- A3 — security/privacy objection to activity + LLM access (gating mid-market).
- A4 — gross margin under per-draft inference cost.

**Specific questions for Phase 2:**
- Q1 (validation/feasibility): On real repos, how editable are generated drafts — % posted with < X edits? *(Answers A2.)*
- Q2 (discovery): Do target engineers *want* their standup written for them, or value the reflection of writing it? *(A1.)*
- Q3 (competitive): Does any incumbent already auto-draft from activity, and how well? *(A5.)*
- Q4 (financial): LLM COGS per seat/day vs. price band → gross margin? *(A4.)*
- Q5 (legal/security): What's the minimum trust bar (data handling, no-code-storage, SOC 2 timing) to sell to mid-market? *(A3.)*

**Research plan (depth 3):**
- *Desk:* full competitor teardown + current pricing (Q3, price band); LLM cost modelling on representative draft volume (Q4); GDPR/DPA + SOC 2 baseline scan (Q5).
- *Primary:* 5–8 discovery interviews with remote/async-first eng leads (Q2, A1); a draft-quality spike on the founder's own repos and 1–2 design-partner repos, measuring edit distance (Q1, A2) — the highest-priority experiment.
