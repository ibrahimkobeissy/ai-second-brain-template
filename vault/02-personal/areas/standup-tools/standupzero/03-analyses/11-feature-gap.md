---
analysis: feature-gap
title: Feature Gap Analysis
product: "StandupZero"
status: complete
verdict: behind
confidence: high
depends_on: [competitive-landscape]
key_findings:
  - "Must-close table-stakes gaps: Slack/Teams posting + multi-tracker (Jira/Linear) integration + a free tier — incumbents have all three; StandupZero v1 has none beyond GitHub→Slack."
  - "The intended wedge feature (auto-draft) is already neutralized — present in Kollabe/ZeroStandup — so it can't carry the entry."
  - "StandupZero would launch BEHIND on breadth and distribution, with no feature lead to compensate."
created: 2026-06-22
---
# Feature Gap Analysis — StandupZero

> Reads `02-prd.md` (1.3) + `competitive-landscape`. Depth 3: feature × competitor matrix (have/partial/missing), table-stakes vs wedge split.

## Summary
Against the incumbent set, StandupZero's planned v1 is a subset, and its intended wedge (auto-draft) is no longer a lead. It launches behind on table-stakes breadth and distribution with nothing to offset it. **Verdict: behind, high confidence.**

## Analysis

### Feature × competitor matrix
(✓ have · ~ partial · ✗ missing)

| Feature | Geekbot | Kollabe | ZeroStandup | Standuply | StandupZero v1 |
|---|---|---|---|---|---|
| Async check-in / scheduling | ✓ | ✓ | ✓ | ✓ | ~ |
| **Auto-draft from activity** | ✗ | ✓ | ✓ | ✗ | ✓ |
| Slack post | ✓ | ✓ | ✓ | ✓ | ✓ |
| Teams post | ✓ | ~ | ? | ✓ | ✗ |
| Multi-tracker (Jira/Linear/Asana) | ✓ | ✓ | ✓ | ✓✓ | ✗ (GitHub only) |
| Manager rollup / digest | ✓ | ✓ | ✓ | ✓ | ✗ (later) |
| Analytics / insights | ✓ | ~ | ✓ | ✓ | ✗ |
| Free tier | ✓ (<10) | ~ | ? | ~ | ✗ |
| Retros / polls / OKRs | ✓ | ✓ | ~ | ✓ | ✗ |

### Table-stakes gaps (must close to compete)
1. **Slack/Teams + multi-tracker** — without Jira/Linear and Teams, StandupZero excludes most target teams on day one.
2. **A free tier** — the category's primary acquisition mechanism (Geekbot, Range). Absent = no bottom-up funnel.
3. **Manager rollup** — the half of the value (the "where are we?" consumer) the PRD defers.

### Wedge feature
- Intended wedge = **auto-draft**. Per `competitive-landscape`, it's **already present in Kollabe/ZeroStandup** → it closes a gap *to them*, it doesn't open one. There is no feature on which StandupZero v1 leads.

### Reading
StandupZero competes from behind on breadth and distribution, with a wedge that's now table-stakes among the specialist rivals. The feature roadmap to reach parity is long for a solo part-timer (`06-feasibility`).

**Counter-argument (weighed):** a narrow v1 can still win a beachhead if it's *best* at the one thing for one segment. Valid in principle — but `10-competitive-differentiation` shows it isn't best at the one thing (parity), so "narrow but excellent" doesn't currently hold.

## Evidence & assumptions
- **Grounded in:** `competitive-landscape` sources (feature claims from vendor pages/roundups); PRD 1.3 v1 scope.
- **Assumed / needs primary research:** exact current feature sets of Kollabe/ZeroStandup (early products; some cells marked ?/~); whether a free tier is financially survivable given `07-financial-model`.

## What would change this verdict
- **→ at-par:** StandupZero ships multi-tracker + Slack/Teams + free tier *and* demonstrably best-in-class draft quality on a focused segment.
- **→ ahead:** only via a feature axis rivals lack (e.g. self-hosted/privacy-first — `12-blue-ocean`).

## Sources to gather
- Hands-on feature audit of Kollabe + ZeroStandup to firm up the ?/~ cells.

## Conclusion
**Behind, high confidence.** A subset product entering a mature feature set with a neutralized wedge. Feeds `14-swot` and `15-risk-assessment`; reinforces that any viable path requires a *different* axis, not feature catch-up.
