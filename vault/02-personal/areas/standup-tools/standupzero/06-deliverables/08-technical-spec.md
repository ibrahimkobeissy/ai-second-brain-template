---
deliverable: technical-spec
title: Technical Specification & System Design
track: technical
catalog: "6B.2"
product: "StandupZero"
status: draft
reads: [functional-spec, adr]
created: 2026-06-22
---
# Technical Specification & System Design — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[02-functional-spec]], [[06-adr]]. Depth 3: components, data flows, API surface, the riskiest integration, edge cases.

## Summary
A serverless, event-driven pipeline: webhook ingestion → compact activity store → per-timezone scheduled drafting via an LLM gateway → Slack interactive review/post. The riskiest integration is **the drafting step's quality under sparse activity** (S2.2) — not any single API — so the design isolates prompt/model behind a gateway to iterate fast.

## Components & responsibilities
- **Ingestion service** (webhook handlers: GitHub, Jira/Linear, calendar) — verify signatures, normalize events to `ActivityEvent` metadata rows, enqueue. Handles backfill on first connect (pull recent history once).
- **Activity store** (managed Postgres) — compact metadata only (no code); short retention for raw events, longer for derived drafts/metrics ([[06-adr]] ADR-002).
- **Scheduler** — per-user/timezone cron; assembles the draft window (yesterday/today/blockers source events) and enqueues a generation job.
- **Drafting service** — builds the prompt from the window, calls the **LLM gateway**, parses the structured draft (yesterday/today/blockers + confidence), persists it + token/cost metrics.
- **LLM gateway** — provider-abstracted; tier-aware model selection; versioned prompt templates ([[06-adr]] ADR-003).
- **Delivery service** — posts a Slack interactive message (accept/edit/skip); captures the edit → computes edit-distance → emits DAR metric ([[05-kpi-framework]]).
- **Web app / admin** — OAuth connect, team/seat/schedule config, history, billing.
- **Billing** — Stripe/Paddle (merchant-of-record for global VAT, [[05-legal-scan]]); active-seat metering ([[04-pricing-strategy]]).

## Primary data flow
```
GitHub/Tracker webhook → Ingestion (verify, normalize) → Activity store (metadata)
                                                              │
Scheduler (per tz) ──► assemble window ──► Drafting ──► LLM gateway ──► draft+confidence
                                                              │
                                              Delivery ──► Slack interactive msg
                                                              │ (accept/edit/skip)
                                              edit-distance ──► DAR / metrics
```

## API surface (internal + integration)
- `POST /webhooks/github` · `/webhooks/jira` · `/webhooks/linear` — signed event intake.
- `POST /oauth/{provider}/callback` — connect flow.
- `POST /internal/generate {userId, date}` — idempotent draft generation (also manual re-gen, paid only).
- Slack interactivity endpoint — handle accept/edit/skip actions.
- `GET /api/teams/{id}/drafts` — history/admin.
- Billing webhooks (Stripe/Paddle) — seat/subscription sync.

## The riskiest integration
**Not an API — it's draft quality on sparse-activity days (S2.2).** *Because* past activity underdetermines "today", the gateway must (a) compute a confidence score, (b) degrade to an honest "light activity yesterday; no clear plan inferred" rather than hallucinate, and (c) be A/B-tunable on prompt+model without redeploying core. This is where the [[13-idea-validation]] spike feeds back directly.

## Edge cases (depth 3)
- Zero-activity day → honest empty-state draft, never invented.
- Webhook outage → reconcile via a bounded backfill poll; idempotent generation prevents dupes.
- Revoked OAuth / expired token → pause user, notify, don't crash the team's run.
- Timezone/DST correctness for scheduling.
- Identity mapping (same dev across GitHub + tracker + Slack).
- LLM provider 5xx/timeouts → retry with fallback model via gateway; skip with notice if exhausted.
- Free-tier draft cap enforcement at generation time ([[04-pricing-strategy]]).

## Trade-offs & alternatives
- **Webhooks (chosen)** vs **polling** — webhooks give freshness and avoid rate limits; cost is reliability handling (backfill/reconcile). Polling rejected per [[06-adr]] ADR-004.
- **Structured LLM output (chosen)** vs **freeform** — structured (JSON sections + confidence) enables parsing, DAR, and honest low-confidence handling; freeform is simpler but unmeasurable.
- **Managed Postgres (chosen)** vs **NoSQL** — relational fits teams/seats/events/billing; no scale driver for NoSQL at this size.

## Open questions & dependencies
- Prompt/model selection + confidence calibration → [[13-idea-validation]].
- Concrete schema → [[12-data-model]]; deployment/ops → [[13-devops]]; exportable spec → [[11-spec-generation]].
- Backfill depth on first connect (how much history for a good first draft).
