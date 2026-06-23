---
analysis: location-analysis
title: Location / Site Analysis
catalog: "2.8"
depends_on: []
reference_skills: []
relevant_when: "physical/retail/logistics only — SKIP for pure software"
---
# Location / Site Analysis — analysis spec

**Evaluates:** optimal physical location(s) by foot traffic, demographics and logistics.
**Reads:** PRD 1.2 (customer geography), 1.3 (delivery model).
**Method:**
- Only run if the product has a physical footprint; otherwise the slip should not have suggested it.
- Weigh catchment demographics, accessibility/logistics, cost, and proximity to demand.
**Writes:** artifact per template. `verdict` ∈ {strong-site, trade-offs, poor-fit}. `key_findings`: the best option + its main constraint.

*Re-authored from Dean Peters' Product-Manager-Skills, CC BY-NC-SA 4.0 — attribution per Build Stance.*
