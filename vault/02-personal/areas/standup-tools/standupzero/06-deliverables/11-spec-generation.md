---
deliverable: spec-generation
title: Spec Generation (exportable)
track: technical
catalog: "6B.3"
product: "StandupZero"
status: draft
reads: [functional-spec, technical-spec]
created: 2026-06-22
---
# Spec Generation (Exportable) — StandupZero

> Phase-6 deliverable. Consolidates [[02-functional-spec]] + [[08-technical-spec]] into a single hand-off the **external build project** (CLAUDE.md §7) consumes. Depth 3: build-ready scope, sequenced tickets, acceptance gates. No source code here.

## Summary
This is the bridge from vault → code repo: a consolidated, build-ready spec for MVP v1. The one rule it enforces: **nothing ships until the instrumentation that measures DAR ships with it** ([[05-kpi-framework]]) — the project's success is unmeasurable otherwise.

## Build-ready MVP scope (the cut line, from [[02-functional-spec]])
**In v1:** GitHub + one tracker ingestion · draft generation (yesterday/today/blockers + confidence) · Slack interactive review/post · team/seat/schedule admin · free-tier draft cap · DAR instrumentation.
**Out:** Teams, Asana, calendar-optional, manager rollup, analytics, auto-post, web mobile.

## Epic → ticket breakdown (sequenced for a solo builder)
1. **Foundations** — repo, serverless skeleton, managed Postgres, auth, CI ([[13-devops]]).
2. **Connect flows** — GitHub OAuth + webhook intake + signature verify + first-connect backfill.
3. **Activity store** — `ActivityEvent` schema + normalization ([[12-data-model]]).
4. **LLM gateway** — provider abstraction, tier model selection, versioned prompt, structured output + confidence.
5. **Drafting** — window assembly + generation + persist draft/metrics (idempotent).
6. **Scheduler** — per-timezone trigger.
7. **Slack delivery** — interactive card (accept/edit/skip) + edit-distance capture → **DAR metric**.
8. **Tracker integration** — Jira or Linear (beachhead-driven).
9. **Admin web** — team/seat/schedule/history + privacy copy.
10. **Billing** — Stripe/Paddle, active-seat metering, free-tier cap.

## Acceptance gates (per [[02-functional-spec]] ACs)
- Drafts are generated from metadata only — verified no file contents are fetched/stored ([[06-adr]] ADR-002).
- Zero-activity and low-confidence states render honestly (no hallucinated "today").
- Every generated draft logs tokens, cost, edit-distance, posted/skipped (DAR pipeline live).
- Free-tier draft cap enforced at generation.

## Export format
Deliver as a Markdown spec pack + a ticket list (epics 1–10 above) importable to the external repo's tracker. Frontmatter carries `source: standupzero PRD + 02/08 specs` for traceability back to this vault.

## Trade-offs & alternatives
- **Consolidated hand-off (chosen)** vs **pointing the builder at scattered artifacts** — a single build-ready pack reduces context loss across the vault→repo boundary; the cost is one more document to keep in sync (regenerate from [[02-functional-spec]]/[[08-technical-spec]] if they change).
- **DAR-instrumentation as a v1 gate (chosen)** vs **add metrics later** — later means flying blind through the only phase that decides the project; non-negotiable.

## Open questions & dependencies
- Tracker choice (Jira vs Linear) gates ticket 8.
- Prompt/model spec finalized post-[[13-idea-validation]].
- Depends on [[12-data-model]] and [[13-devops]] for tickets 1/3.
