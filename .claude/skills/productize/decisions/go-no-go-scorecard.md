---
decision: go-no-go-scorecard
title: Go / No-Go Scorecard
catalog: "5.1"
reads: [feasibility, market-study, competitive-landscape, financial-model, legal-scan, risk-assessment, value-proposition, usp]
reference_skills: [feature-investment-advisor]
---
# Go / No-Go Scorecard — decision spec

**Evaluates:** whether to proceed — a weighted matrix over market, competition, finance, legal, team.
**Reads:** every completed analysis artifact's `verdict` + `key_findings` (by path).
**Method:**
- Score each dimension 1–5 from the relevant analyses' verdicts; **weight by what matters for this product** (legal heavy if regulated, finance heavy if capital-intensive).
- **A hard blocker caps the outcome** regardless of score — e.g. `legal-scan: blockers` or `feasibility: not-viable` ⇒ at most PIVOT.
- Map weighted score + blockers → **GO / CONDITIONAL GO / PIVOT / NO-GO**.
**Writes:** `go-no-go.md` per `templates/decision.md`; the recommendation cites the driving verdicts.

*Re-authored from Dean Peters' Product-Manager-Skills (`feature-investment-advisor`), CC BY-NC-SA 4.0 — attribution per Build Stance.*
