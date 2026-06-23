# productize/ — toolkit asset home (developer index)

Shared assets for the `productize` toolkit. **Not a skill** (no `SKILL.md`), so it doesn't register — it just holds the catalogs, templates, methods, and conventions the `productize-*` skills consume.

## What's where
| Path | Role |
| --- | --- |
| `conventions.md` | **Build-time contract:** layout, tiers, the knowledge-graph contract, execution planning, control-file rules. Read before editing anything. |
| `methods/` | Re-authored PM methods feeding PRD sections (Phase 1). |
| `analyses/` | Phase 2–4 analysis **catalog** (`catalog.md` + one `<id>.md` per analysis). |
| `decisions/` | Phase 5 decision catalog (Go/No-Go, investment-readiness, pivot-or-proceed). |
| `deliverables/` | Phase 6 catalog (`catalog.md` + 6A product + 6B technical specs). |
| `templates/` | `product_intake`, `prd`, `productization_plan`, `analysis`, `decision`, `deliverable`, + tier skeletons. |

> **User guide** is the canonical, public how-to at `vault/99-system/documentation/productize.md` (the worked example is `productize-showcase.md`). This README is just the developer index for the asset folder.

The ten registered skills live as sibling folders `.claude/skills/productize-*/`: six phase orchestrators (`productize-new`, `productize-analyze`, `productize-decide`, `productize-build`, `productize-report`, `productize-plan`), three components they invoke (`productize-intake`, `productize-prd`, `productize-analysis-slip`), and `productize-linter`. This `productize/` folder is the shared asset home they all read from.

## To extend
- **New analysis:** add `analyses/<id>.md` (frontmatter + Evaluates/Reads/Method/Writes) and a row in `analyses/catalog.md`. No new skill needed.
- **New deliverable:** add `deliverables/<id>.md` + a row in `deliverables/catalog.md`.
- Keep ids kebab + stable; declare `depends_on`/`reads` so the planner orders correctly; attribute Dean Peters in `References`.
