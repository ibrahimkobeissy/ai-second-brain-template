---
analysis: feasibility
title: Feasibility Study
catalog: "2.1"
depends_on: [market-study, competitive-landscape]
reference_skills: []
relevant_when: "always — the core viability gate"
---
# Feasibility Study — analysis spec

**Evaluates:** whether the idea is viable technically, financially, and operationally — and whether it's viable to *win*, not just to build.

**Reads:** PRD 1.3 / 1.4 / 1.7, plus the upstream artifacts `market-study` (is there demand?) and `competitive-landscape` (is there room?). Read their `verdict` + `key_findings` from frontmatter.

**Method:**
- **Technical:** can the team build it with the resources stated in PRD 1.7?
- **Financial:** does the revenue model (1.4) plausibly cover costs at the market size from `market-study`?
- **Operational:** dependencies, single points of failure.
- **Viable to win:** weigh against `competitive-landscape` — buildable ≠ winnable. If the market is weak *or* the space is dominated, feasibility is capped regardless of technical ease.

**Writes:** an artifact per `templates/analysis.md`. `verdict` ∈ {viable, risky, not-viable}. `key_findings`: the binding constraint · whether demand × gap justify the build. Cite the two upstream verdicts explicitly.

*Re-authored from Dean Peters' Product-Manager-Skills, CC BY-NC-SA 4.0 — attribution per Build Stance.*
