---
analysis: feasibility
title: Feasibility Study
product: "StandupZero"
status: complete
verdict: risky
confidence: high
depends_on: [market-study, competitive-landscape]
key_findings:
  - "Binding constraint is 'viable to WIN', not 'viable to build': it's trivially buildable but the differentiating wedge is already taken (`competitive-landscape` = crowded) and the founder has no distribution."
  - "Demand × gap does NOT justify the differentiated build: `market-study` demand is only moderate and the gap is absent — the two upstream verdicts compound negatively."
  - "Technically and operationally feasible for a solo founder; the risk is strategic (winnability), not technical."
created: 2026-06-22
---
# Feasibility Study — StandupZero

> Reads `02-prd.md` (1.3/1.4/1.7) + upstream `market-study` and `competitive-landscape` (frontmatter verdicts). Depth 3: technical/financial/operational/winnability, scenarios, what-would-change.

## Summary
StandupZero is easy to build and cheap to run, but that is exactly the problem: low barriers mean it's already been built by others. With `market-study` = **moderate** demand and `competitive-landscape` = **crowded** (wedge already shipping), the idea is **buildable but not clearly winnable**. **Verdict: risky, high confidence** — the binding constraint is strategic, not technical.

## Analysis

### Technical — FEASIBLE (not the constraint)
A solo developer can build v1 (GitHub activity → LLM draft → Slack post) using existing APIs/MCP. The PRD 1.7 resources are sufficient for an MVP. *This very ease is the structural weakness* — see `competitive-landscape` and `04-industry-analysis`: trivial to build = trivial for others, and 3+ already have.

### Financial — FRAGILE (detailed in `07-financial-model`)
Per-seat $3–6 against low fixed costs means break-even is easy, but the obtainable market (`market-study` SOM ≈ $50–150K ARR, optimistic) can't fund a salary. COGS is *not* the killer (cheap model on metadata ≈ 3–5% of revenue); **customer acquisition is.** Financially survivable as a side project, not as a business.

### Operational — FEASIBLE with single points of failure
- Solo + part-time = the founder is the only SPOF (bus factor 1, slow iteration vs funded rivals).
- Hard dependencies on Slack/GitHub/Atlassian APIs and an LLM provider (`04-industry-analysis`: supplier power) — any can change terms or ship the feature natively.

### Viable to WIN — THE BINDING CONSTRAINT
Per the method, buildable ≠ winnable, and feasibility is capped when the market is weak *or* the space is contested:
- `market-study` = **moderate** demand → mild positive.
- `competitive-landscape` = **crowded**, defensible gap **absent** (Kollabe + ZeroStandup already ship the exact wedge; Geekbot can add it) → strong negative.
- A solo, unfunded, no-distribution founder entering *after* the wedge is built, against players with brand and free tiers, has no identified path to win the differentiated bet. The cap binds here.

**Counter-argument (weighed):** early competitors may have weak draft quality / poor distribution, leaving room for a better execution — and a *narrowed* bet (privacy-first/self-host niche, `12-blue-ocean`) could be winnable. That's a real but unvalidated escape hatch, not the current PRD's plan, so it lowers — not removes — the risk.

## Scenarios
- **Conservative:** indistinguishable from Kollabe/ZeroStandup; no distribution → ~no adoption → side-project that fades.
- **Base:** a small loyal niche (async-first teams) via founder content/marketplace; modest revenue, never escapes the feature-not-company trap.
- **Optimistic:** a sharp niche wedge (privacy-first/self-host) + a real distribution channel → defensible small business; requires a pivot from the current PRD.

## Evidence & assumptions
- **Grounded in:** upstream verdicts `market-study` (moderate) and `competitive-landscape` (crowded); PRD 1.7 resources; observed low build barriers.
- **Assumed / needs primary research:** that incumbents/early rivals execute *well* (assumed; if they're weak, winnability rises); that the founder cannot acquire a distribution edge (assumed absent — could be disproven by a content/community advantage).

## What would change this verdict
- **→ viable:** evidence the existing auto-draft rivals are poor *and* a concrete distribution channel exists, OR a committed pivot to a defensible niche with validated demand.
- **→ not-viable:** Geekbot (or a platform) ships native auto-draft, or validation shows teams won't trust machine-written status (`13-idea-validation`).

## Conclusion
**Risky, high confidence.** Technically and operationally feasible; financially survivable only as a side project; **strategically hard to win as currently framed.** This is the central input to `15-risk-assessment` (downstream) and the Go/No-Go: absent a pivot, this leans No-Go.
