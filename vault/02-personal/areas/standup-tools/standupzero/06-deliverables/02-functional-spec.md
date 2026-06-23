---
deliverable: functional-spec
title: Functional Specification
track: product
catalog: "6A.3"
product: "StandupZero"
status: draft
reads: [prd, feature-gap, value-proposition]
created: 2026-06-22
---
# Functional Specification — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[11-feature-gap]], [[08-value-proposition]]. Depth 3: epics → stories → acceptance criteria, MVP cut line, edge cases.

## Summary
StandupZero ingests a developer's daily activity, drafts a "yesterday / today / blockers" update with an LLM, lets the engineer edit it, and posts it to Slack on schedule. The MVP cut line is deliberately narrow — **GitHub + one tracker → draft → Slack, one-tap post** — because the founder is solo ([[06-feasibility]]); breadth comes later. The make-or-break feature is draft quality (instrumented as the activation metric).

## Epics → stories → acceptance criteria

### E1 — Integrations & activity ingestion
- **S1.1** Connect GitHub (OAuth). *AC:* user authorizes; we read commits, PR open/merge/review events for their identity; **metadata only — no file contents** (PRD 1.6).
- **S1.2** Connect one issue tracker (Jira or Linear). *AC:* ticket transitions (status changes, assignments) for the user are read.
- **S1.3** Connect calendar (optional). *AC:* today's meetings inform the "today" section.
- *Edge cases:* revoked token (degrade gracefully, notify); a day with zero activity (draft says so honestly, doesn't hallucinate); multi-account identity mapping.

### E2 — Draft generation (the core)
- **S2.1** Generate "yesterday" from completed activity. *AC:* summarizes merged PRs/commits/closed tickets into ≤5 concise lines; cites the artifacts.
- **S2.2** Infer "today" from open PRs, in-progress tickets, calendar. *AC:* states a plausible plan; **flags low confidence rather than inventing** when signal is thin (addresses ★A2, [[13-idea-validation]]).
- **S2.3** Detect blockers from stale PRs (>N days), review-waiting, blocked-status tickets. *AC:* surfaces candidates, never asserts a blocker without a signal.
- *Edge cases:* sparse activity → "today" is the hardest inference (the known weak point); sensitive commit messages → redaction option.

### E3 — Review & post
- **S3.1** Present the draft for edit before posting. *AC:* one-tap accept, inline edit, or skip; nothing posts without user action in v1 (trust).
- **S3.2** Post to Slack channel/thread on schedule. *AC:* scheduled per user timezone; posts as the user with an attribution footer.
- **S3.3** Snooze / opt-out for a day. *AC:* respects OOO/no-activity.

### E4 — Team & admin
- **S4.1** Create a team, invite members, set the standup schedule/channel.
- **S4.2** Free-tier seat cap + draft usage cap (COGS guard, [[01-business-model-design]]).
- **S4.3** (post-MVP) Manager rollup digest — deferred; the deferred half of the value ([[11-feature-gap]]).

## MVP cut line
**In:** E1 (GitHub + 1 tracker), E2 (all three sections, with honest low-confidence handling), E3 (review + Slack post), E4.1–E4.2.
**Out (v2+):** Teams/Asana, calendar (S1.3 optional), rollup (S4.3), analytics, retros, auto-post-without-review.
*Rationale:* the narrowest slice that tests the load-bearing assumption (draft quality) with a real team — per [[13-idea-validation]], quality must clear ≥70% posted-with-minor-edits before breadth is worth building.

## Trade-offs & alternatives
- **Review-before-post (chosen)** vs **auto-post** — auto-post is the bigger time-save but a trust risk for machine-written status (★A1); v1 keeps a human in the loop, revisit once quality is proven.
- **Metadata-only ingestion (chosen)** vs **full-content (richer drafts)** — full content would improve quality but breaks the source-code-sensitivity constraint (PRD 1.6, [[05-legal-scan]]) and raises COGS; metadata-only is the deliberate constraint.

## Open questions & dependencies
- The "today" inference quality (S2.2) is unproven — gate the build on the [[13-idea-validation]] spike.
- Which tracker first — Jira (mid-market) or Linear (async-first startups)? Decide from the target beachhead.
- Feeds [[06-adr]], [[09-uiux-mockup]], and (via technical-spec) the data model.
