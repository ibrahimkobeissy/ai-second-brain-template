---
deliverable: data-model
title: Data Model & Database Design
track: technical
catalog: "6B.5"
product: "StandupZero"
status: draft
reads: [technical-spec, functional-spec]
created: 2026-06-22
---
# Data Model & Database Design — StandupZero

> Phase-6 deliverable. Draws from [[08-technical-spec]] + [[02-functional-spec]]. Depth 3: entities, key fields, relationships, retention, the privacy-driven design rules.

## Summary
A relational model (managed Postgres) centered on teams → members → activity-events → drafts, with **two privacy rules hard-wired into the schema**: store activity *metadata only* (no code), and give raw activity a short retention TTL while keeping derived drafts/metrics ([[06-adr]] ADR-002). The schema *is* the privacy guarantee, not just policy.

## Entities (key fields)

**team** — `id, name, plan(free|team|business), slack_workspace_id, standup_channel, schedule_time, timezone, created_at`

**member** — `id, team_id→team, email, github_login, tracker_user_id, slack_user_id, role(member|admin), active(bool), seat_billable(bool)`
- `active`/`seat_billable` drive active-seat billing ([[04-pricing-strategy]]).

**integration** — `id, team_id→team, provider(github|jira|linear|slack|calendar), oauth_token_ref(vault/secret-store ref, NOT raw token), scopes, status, connected_at`
- Tokens live in a secret store; the table holds a reference only.

**activity_event** — `id, member_id→member, provider, type(commit|pr_open|pr_merge|pr_review|ticket_transition|meeting), ref(url/key), title_text, occurred_at, ingested_at, expires_at`
- **Privacy rule:** `title_text` only (commit message / PR title / ticket summary) — **never diffs or file contents** ([[06-adr]] ADR-002). `expires_at` enforces short TTL.

**draft** — `id, member_id→member, standup_date, yesterday_json, today_json, blockers_json, today_confidence(low|med|high), model_used, prompt_version, tokens_in, tokens_out, cost_cents, status(generated|posted|skipped|failed), generated_at`
- Carries the cost + confidence fields the [[05-kpi-framework]] needs.

**draft_edit** — `id, draft_id→draft, edit_distance, posted_at, edited_text_retained(bool, default false)`
- Stores the *metric* (edit_distance → DAR), not necessarily the edited content; retention is opt-in.

**subscription** — `id, team_id→team, provider(stripe|paddle), plan, active_seats, period_start, period_end, status`

## Relationships
```
team 1─* member 1─* activity_event
team 1─* integration
member 1─* draft 1─0..1 draft_edit
team 1─1 subscription
```

## Retention & privacy design (depth 3)
- `activity_event.expires_at`: purge raw metadata after the draft window closes (e.g. 7–14 days) — minimizes the data held ([[05-legal-scan]] GDPR data-minimisation).
- `draft`: keep the generated draft + metrics for history/analytics; **edited content retained only if the team opts in** (`edited_text_retained`).
- No source code anywhere in the schema — enforced by having no field that could hold it.
- `oauth_token_ref` indirection keeps secrets out of the primary DB.

## Indexing & scale
- `activity_event (member_id, occurred_at)` — window assembly is the hot path ([[08-technical-spec]] scheduler).
- `draft (member_id, standup_date)` unique — idempotent generation.
- `member (team_id, active)` — billing/seat queries.
- Volume is modest (events/dev/day × seats); Postgres is comfortably sufficient ([[06-adr]] ADR-005 rationale).

## Trade-offs & alternatives
- **Relational (chosen)** vs **document store** — teams/seats/billing/events are relational with clear joins; no scale driver for NoSQL.
- **Metric-only edit capture (chosen)** vs **store all edited drafts** — storing edits would aid prompt tuning but raises privacy/retention cost; default to metric-only, opt-in for content.
- **Short TTL on raw activity (chosen)** vs **keep everything** — TTL shrinks GDPR surface at the cost of long-range history (acceptable; drafts retain the summary).

## Open questions & dependencies
- Exact TTL window vs first-connect backfill depth ([[08-technical-spec]] open question).
- Whether prompt-tuning needs retained edited text (would change `draft_edit` default) — decide in [[13-idea-validation]].
- Multi-identity mapping (one human across github/tracker/slack) — `member` assumes resolved identities.
