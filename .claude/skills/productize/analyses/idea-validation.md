---
analysis: idea-validation
title: Idea Validation Study
catalog: "2.17"
depends_on: [market-study]
reference_skills: [discovery-interview-prep, pol-probe, pol-probe-advisor, lean-ux-canvas]
relevant_when: "early-stage / unvalidated ideas (PRD 1.8 stage = idea/validated)"
---
# Idea Validation Study — analysis spec

**Evaluates:** real demand via the cheapest experiment that could disprove the idea.
**Reads:** PRD 1.1 (problem), 1.9 (riskiest assumption) + `market-study`.
**Method:**
- Name the **riskiest assumption** (from 1.9); design the lightest test that could kill it (interview, landing page, pre-sale, concierge).
- Define the **pass/fail signal in advance** — what result means go, what means stop.
- This spec *plans* validation; running it with real users is an execution step outside the analysis.
**Writes:** artifact per template. `verdict` ∈ {validated, signal-positive, untested, invalidated}. `key_findings`: the assumption tested + the pre-committed success metric.

*Re-authored from Dean Peters' Product-Manager-Skills (`discovery-interview-prep`, `pol-probe`, `pol-probe-advisor`, `lean-ux-canvas`), CC BY-NC-SA 4.0 — attribution per Build Stance.*
