---
deliverable: adr
title: Architecture Decision Record
track: technical
catalog: "6B.1"
product: "StandupZero"
status: draft
reads: [prd, functional-spec]
created: 2026-06-22
---
# Architecture Decision Record — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[02-functional-spec]]. Depth 3: numbered decisions, each context → decision → consequences → alternatives. Constraints: solo founder, metadata-only (PRD 1.6), low COGS ([[07-financial-model]]).

## Summary
The architecture optimizes for **one developer shipping and operating it cheaply** while honoring the metadata-only privacy constraint. The defining decision is a **stateless event-ingestion + scheduled drafting pipeline on serverless**, with a hard rule: store derived metadata, never source code, and keep raw activity ephemeral.

## ADR-001 — Cloud-hosted SaaS, serverless-first
- **Context:** solo founder, spiky daily-scheduled load (drafts fire around team standup times), near-zero ops budget.
- **Decision:** managed serverless (functions + managed Postgres + a queue) on one cloud; no Kubernetes.
- **Consequences:** minimal ops; scales to zero between standup windows (cost-efficient); cold-start latency acceptable for async drafting. Vendor lock-in accepted for solo simplicity.
- **Alternatives:** self-hosted/k8s (rejected — ops burden); pure edge (rejected — needs stateful DB + scheduled jobs).

## ADR-002 — Metadata-only ingestion; raw activity ephemeral
- **Context:** source-code sensitivity is the top objection (PRD 1.6, [[05-legal-scan]]).
- **Decision:** ingest only commit messages, PR titles/state, ticket transitions, calendar titles. **Never** fetch file contents/diffs. Raw fetched activity lives only in-memory/short-TTL cache during drafting; persist only the derived draft + metrics.
- **Consequences:** smaller attack surface, easier GDPR posture, lower storage; *trade-off:* drafts can't reason over code detail (a quality ceiling on S2.2 — accepted per [[02-functional-spec]]).
- **Alternatives:** full-content ingestion (rejected — breaks the privacy constraint and raises COGS).

## ADR-003 — LLM as a swappable provider behind an abstraction
- **Context:** COGS and quality both hinge on model choice ([[07-financial-model]] sensitivity); provider terms are a supplier risk ([[04-industry-analysis]]).
- **Decision:** a thin LLM-gateway interface; cheap model for Free, stronger model for paid; prompt templates versioned. No provider-specific lock-in in core logic.
- **Consequences:** can tune cost/quality per tier ([[04-pricing-strategy]]); can switch providers if terms change; enables a future BYO-model/self-host path (the latent pivot, [[12-blue-ocean]]) without re-architecting.
- **Alternatives:** hard-wire one provider (rejected — concentrates supplier risk).

## ADR-004 — Event ingestion via webhooks + a scheduled drafting job
- **Context:** activity arrives continuously; drafts are needed once/day per user timezone ([[02-functional-spec]] S3.2).
- **Decision:** subscribe to GitHub/tracker webhooks → normalize → store compact activity-metadata rows; a per-timezone scheduled job assembles each user's window and calls the LLM gateway.
- **Consequences:** decouples ingestion from generation; resilient to provider hiccups; idempotent generation. Webhook reliability + replay needed.
- **Alternatives:** poll APIs on a cron (rejected — rate limits, staleness); generate on-demand only (rejected — loses the "it's already drafted" magic).

## ADR-005 — Post to Slack as the user with explicit review (v1)
- **Context:** trust in machine-written status is unproven (★A1, [[13-idea-validation]]).
- **Decision:** human-in-the-loop posting via Slack interactive message (accept/edit/skip); no silent auto-post in v1.
- **Consequences:** preserves trust; gives the edit signal that powers DAR ([[05-kpi-framework]]). Revisit auto-post once DAR is high.
- **Alternatives:** auto-post (rejected for v1 — trust + quality risk).

## Trade-offs & alternatives (cross-cutting)
- **Managed simplicity over control** throughout — correct for a solo founder; would revisit at scale or for the self-host pivot (which inverts ADR-001/003).
- **Privacy constraint over draft richness** (ADR-002) — a deliberate quality ceiling accepted to keep the addressable market and trust.

## Open questions & dependencies
- Model selection per tier pending the [[13-idea-validation]] quality/cost spike.
- Webhook backfill on initial connect (first-draft needs history) — design in [[08-technical-spec]].
- Self-host variant (ADR-001/003 inverted) kept architecturally open but out of v1 scope.
