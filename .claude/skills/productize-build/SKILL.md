---
name: productize-build
description: Phase-6 productize orchestrator — generate implementation deliverables (product + technical tracks) and the roadmap once a product is a GO. Use to produce the specs/designs that hand off to the separate build project. Prereq a GO / CONDITIONAL GO from productize-decide; optionally fires productize-report.
---
# Productize · Build (Phase 6) — implementation deliverables

Once the decision is GO, produce the deliverables that hand off to the (separate) build project. **Read `.claude/skills/productize/conventions.md` first.** Prereq: a GO / CONDITIONAL GO in `05-go-no-go.md`.

## Steps
1. **Resolve product.** From the invocation argument or ask. Confirm `05-go-no-go.md` recommends GO / CONDITIONAL GO — else stop and say to run the **`productize-decide`** skill (proceed only on explicit user override).
2. **Select.** Present the `deliverables/catalog.md` (6A Product + 6B Technical); the user picks. Auto-include `reads` dependencies (e.g. `technical-spec` pulls `functional-spec`; `data-model` pulls `technical-spec`).
3. **Plan + generate.** Topologically order by `reads` (same algorithm as analyze; abort on a cycle); the order = the `NN` numbering. Generate each per its spec, reading `02-prd.md` (note its `depth`) + upstream artifacts (resolve by frontmatter id, scanning `03-analyses/` + `06-deliverables/`), into `06-deliverables/NN-<id>.md` using `templates/deliverable.md`. **Scale to `depth`** (`depth-levels.md`): L1 — outline-level deliverable; L2 — decision-grade (e.g. functional-spec = epics → stories → acceptance criteria; tech-spec = components, data flows, riskiest integration named); L3 — + data models, API contracts, edge cases, scenarios, and a sequenced rollout. A deliverable that's just bullet points fails at L2+.
4. **Roadmap.** Synthesize the roadmap as the final deliverable (`06-deliverables/NN-roadmap.md`) — sequence the deliverables/epics into phased releases with clear trade-offs (re-authored from Dean Peters' `roadmap-planning`; attribute).
5. **Update the plan.** Mark the Phase-6 row in `00-productization-plan.md` and link the deliverables + roadmap.
6. **Capstone report (if explicitly opted in).** Read `html_report` from `02-prd.md`. Only `html_report: yes` auto-invokes the **`productize-report`** skill as the final step → `07-summary.html` (the visual summary of the whole bet). If `html_report: no`, skip it and tell the user they can run the **`productize-report`** skill anytime. If the key is missing or blank, treat it as **no**, warn that the product predates the opt-in field, and do not auto-generate the report without explicit user confirmation.

## Guarantees
- **Don't build before deciding** — a GO is the prerequisite.
- Deliverables draw from PRD + analyses + decision via the knowledge graph (read by path).
- **Code is built elsewhere** (CLAUDE.md §7) — these are the specs/designs the external project consumes, not source.
- Writes only inside `areas/<area>/<product>/`.
