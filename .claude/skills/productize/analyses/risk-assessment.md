---
analysis: risk-assessment
title: Risk Assessment
catalog: "2.10"
depends_on: [feasibility]
reference_skills: []
relevant_when: "always"
---
# Risk Assessment — analysis spec

**Evaluates:** market, operational, financial and regulatory risks, with mitigations.
**Reads:** PRD 1.9 (assumptions/unknowns) + `feasibility` (binding constraint) + any other completed artifacts.
**Method:**
- Turn PRD 1.9's least-confident assumptions into named risks.
- Rate each **likelihood × impact**; for the top risks, give a concrete mitigation or kill-criterion.
**Writes:** artifact per template. `verdict` ∈ {low, moderate, high}. `key_findings`: the top 1–3 risks + whether any is a dealbreaker.

*Re-authored from Dean Peters' Product-Manager-Skills, CC BY-NC-SA 4.0 — attribution per Build Stance.*
