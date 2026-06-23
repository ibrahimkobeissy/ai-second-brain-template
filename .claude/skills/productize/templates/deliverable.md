---
deliverable: {{deliverable-id}}
title: {{title}}
track: {{product | technical}}
catalog: "{{6A.x | 6B.x}}"
product: "{{product-name}}"
status: draft
reads: [{{prd + analysis/decision/deliverable ids}}]
created: {{today}}
---
# {{title}} — {{product-name}}

> Phase-6 deliverable. Draws from `02-prd.md` + the named upstream artifacts (resolved by frontmatter id). Scaled to the product's `depth` (see `depth-levels.md`).

## Summary
{{2–3 sentences: what this deliverable decides/specifies and the single most important call in it.}}

## {{Specification — substantive sub-sections per the catalog Method}}
{{The real content. Show structure and decisions, not bullet fragments. Tie each choice to a PRD fact or upstream verdict (claim → because → therefore). For a functional spec: epics → user stories → acceptance criteria + the MVP cut line. For a technical spec: components + responsibilities, data flows, API surface, the riskiest integration. For a roadmap: sequenced phases with the gate between each.
L1 = outline · L2 = decision-grade detail · L3 = + data models / API contracts / edge cases / scenarios / sequenced rollout.}}

## Trade-offs & alternatives
{{What was chosen, what was rejected, and why — the reasoning a stakeholder needs to trust the call. (L2+; at L3, weigh ≥2 alternatives explicitly.)}}

## Open questions & dependencies
{{what's unresolved, what must be true, what to validate before/while building}}
