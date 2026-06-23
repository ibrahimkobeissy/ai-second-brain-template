---
analysis: feature-gap
title: Feature Gap Analysis
catalog: "2.14"
depends_on: [competitive-landscape]
reference_skills: []
relevant_when: "software/products competing on features"
---
# Feature Gap Analysis — analysis spec

**Evaluates:** a side-by-side feature comparison vs. competitors to spot gaps and table-stakes.
**Reads:** PRD 1.3 + `competitive-landscape`.
**Method:**
- Build a feature × competitor matrix; mark have / partial / missing.
- Split findings into **table-stakes gaps** (must-close to compete) vs. **wedge features** (where to lead).
**Writes:** artifact per template. `verdict` ∈ {ahead, at-par, behind}. `key_findings`: the must-close gap + the wedge feature.

*Re-authored from Dean Peters' Product-Manager-Skills, CC BY-NC-SA 4.0 — attribution per Build Stance.*
