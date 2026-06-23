---
analysis: idea-validation
title: Idea Validation Study
product: "StandupZero"
status: complete
verdict: untested
depends_on: [market-study]
confidence: medium
key_findings:
  - "Riskiest assumption to test FIRST: draft quality (★A2) — can activity produce a 'today + blockers' update good enough to post with minimal edits? Everything else is moot if this fails."
  - "Cheapest killer-test: a 2-week concierge spike on 2–3 real repos measuring edit-distance; pre-committed signal ≥70% of drafts posted with minor edits = proceed, <50% = stop."
  - "Independent headwind: the market (`market-study`) + rivals already shipping suggests the TECH works but the DIFFERENTIATED market is being taken — validate the niche, not just the feature."
created: 2026-06-22
---
# Idea Validation Study — StandupZero

> Reads `02-prd.md` (1.1 problem, 1.9 riskiest assumption) + `market-study`. Depth 3: riskiest-assumption test design with pre-committed pass/fail. **Plans validation; running it with users is an execution step.**

## Summary
The idea is unvalidated — no primary signal yet — so the honest verdict is **untested**. But the two riskiest assumptions are testable cheaply, and the order matters: test *draft quality* before anything else, because the product is a changelog (not a standup) if it can't infer "today + blockers." **Verdict: untested, medium confidence in the test design.**

## Analysis

### Riskiest assumptions (from PRD 1.9)
- **★ A2 — draft quality:** past activity poorly predicts *intent* ("today") and *blockers*. This is the technical+value crux.
- **★ A1 — acceptance:** will engineers/managers trust and post machine-written status, or reject it as surveillance / low-effort?
- (A5 differentiation is already answered negatively by `02-competitive-landscape`; A3/A4 by `05-legal-scan`/`07-financial-model`.)

### Test 1 — Draft-quality spike (do this first; kills fastest, costs least)
- **Method (concierge/Wizard-of-Oz):** on the founder's repo + 1–2 design-partner repos, generate daily drafts from real GitHub+tracker activity for 2 weeks; participants edit and post as normal.
- **Measure:** edit distance / % of drafts posted with only minor edits; qualitative "was 'today' and 'blockers' right?"
- **Pre-committed signal:** **≥70% of drafts posted with minor edits across ≥3 people/2 weeks → proceed (A2 holds). 50–70% → iterate. <50% → stop (A2 fails).**

### Test 2 — Acceptance / demand (parallel, cheap)
- **Method:** 5–8 Mom-Test interviews (`03-customer-discovery` guide) + a landing page ("your standup, written from your commits") measuring email-capture / waitlist conversion from a targeted async-dev audience.
- **Pre-committed signal:** a clear pattern of *current* dissatisfaction with manual entry + non-trivial waitlist conversion → A1 plausibly holds. Indifference or "I like writing my own" → A1 weak.

### Sequencing & the competitive frame
Run Test 1 before building anything beyond the spike. Note the meta-signal: that Kollabe/ZeroStandup already shipped *raises* confidence the tech is feasible but *lowers* confidence the differentiated market is open — so a third validation question is "is the privacy-first/async-first **niche** (`12-blue-ocean`) real?", not just "does auto-draft work?"

## Evidence & assumptions
- **Grounded in:** PRD 1.9 assumptions; `market-study` (who/where to test); standard lean-validation method.
- **Assumed / needs primary research:** *everything the tests measure* — by definition unvalidated. The pass thresholds are reasoned defaults, not empirical.

## What would change this verdict
- **→ signal-positive / validated:** Test 1 clears ≥70% and interviews show real pull → the idea earns a build (likely as a niche).
- **→ invalidated:** Test 1 <50% (drafts aren't postable) or interviews show teams value writing their own → stop.

## Sources to gather
- The spike's own edit-distance data; landing-page conversion; interview notes.

## Conclusion
**Untested, medium confidence (in the plan).** No signal exists yet; the cheapest disconfirming test is the draft-quality spike, with a pre-committed kill threshold. Feeds the Go/No-Go: a GO should be *conditional* on running Test 1 first. Honest status: a well-formed experiment, not a result.
