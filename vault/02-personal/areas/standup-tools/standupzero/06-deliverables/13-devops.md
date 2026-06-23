---
deliverable: devops
title: DevOps & Deployment Strategy
track: technical
catalog: "6B.6"
product: "StandupZero"
status: draft
reads: [technical-spec, adr]
created: 2026-06-22
---
# DevOps & Deployment Strategy — StandupZero

> Phase-6 deliverable. Draws from [[08-technical-spec]] + [[06-adr]]. Depth 3: environments, CI/CD, observability, security/compliance ops, cost guardrails — sized for a solo operator.

## Summary
Operations are optimized for **one person, near-zero idle cost, and the compliance posture mid-market expects**. The defining choice: fully managed serverless with infrastructure-as-code so the founder never hand-operates servers, plus day-one secrets discipline and cost alerts ([[06-adr]] ADR-001).

## Environments
- **dev / staging / prod**, identical via IaC (Terraform/CDK). Staging mirrors prod for integration testing (webhooks, Slack, LLM gateway).
- Per-env isolated secrets and databases.

## CI/CD
- Git-based: PR → CI (lint, test, type-check) → deploy to staging on merge → manual promote to prod.
- DB migrations versioned and run in the pipeline (the [[12-data-model]] schema).
- Prompt-template versions deployed as config, not code, so [[08-technical-spec]]'s LLM gateway can A/B without a full release (supports the [[13-idea-validation]] tuning loop).

## Observability
- **Metrics:** the DAR pipeline + COGS/seat ([[05-kpi-framework]]) as first-class dashboards; per-draft cost and token telemetry.
- **Logs/traces:** structured logs across ingestion → drafting → delivery; trace a draft end-to-end.
- **Alerts:** webhook failure rate, LLM error/latency, **COGS spike** (free-tier abuse guard, [[04-pricing-strategy]]), failed scheduled runs.

## Security & compliance ops (the mid-market gate)
- **Secrets:** managed secret store; OAuth tokens referenced, never in the DB ([[12-data-model]]).
- **Data:** encryption at rest + in transit; metadata-only enforced ([[06-adr]] ADR-002); retention TTL jobs ([[12-data-model]]).
- **GDPR/DPA ops:** sub-processor list (LLM provider) published; data-deletion + export endpoints; region awareness for EU data ([[05-legal-scan]]).
- **SOC 2 path:** adopt audit-friendly practices from day one (access logging, change management, least privilege) so a future SOC 2 Type II is a documentation exercise, not a re-architecture — but **defer the audit itself** until revenue justifies it (cost gate for a solo founder, [[06-feasibility]]).

## Cost guardrails
- Scale-to-zero serverless between standup windows ([[06-adr]] ADR-001).
- Hard budget alerts; per-tier model selection caps LLM spend ([[04-pricing-strategy]]); free-tier draft cap enforced in-app.

## Trade-offs & alternatives
- **Managed serverless + IaC (chosen)** vs **a VPS/container the founder operates** — managed minimizes ops time (the scarce resource); higher per-unit cost is irrelevant at this scale. VPS rejected (ops burden, bus-factor-1 risk).
- **Defer SOC 2 audit, adopt practices now (chosen)** vs **certify early / ignore entirely** — early certification is too costly pre-revenue; ignoring blocks mid-market. Middle path: be audit-ready, certify on demand.
- **Manual prod promotion (chosen)** vs **full CD** — a human gate suits a solo operator and low deploy frequency; revisit with a team.

## Open questions & dependencies
- Which cloud (ties to [[06-adr]] ADR-001 lock-in) — pick for best managed serverless + Postgres + secrets.
- When does mid-market demand force the SOC 2 spend? (Revenue-gated, [[06-feasibility]].)
- Self-host deployment variant if the [[12-blue-ocean]] pivot is triggered (inverts the managed-cloud model).
