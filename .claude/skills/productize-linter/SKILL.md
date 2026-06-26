---
name: productize-linter
description: >-
  Read-only deterministic health check for the productize toolkit — verifies the mechanical
  guarantees the productize-* skills promise (unique catalog ids, acyclic dependency graphs,
  resolving depends_on/reads, valid artifact frontmatter, depends_on↔body parity, no phantom
  plan links, build gate honored). Use to validate the productize catalogs or a generated
  product before relying on it, or after editing analyses/deliverables. Never modifies anything.
---

# Productize Linter

The productize skills promise mechanical guarantees in Markdown prose (unique ids, acyclic
graphs, matching dependencies, no phantom links, build gate). Trusting an LLM to re-check all
of that every run is weaker than the rest of this system. This script makes those checks
**deterministic** — the same role `vault-linter` plays for the vault. **Read-only.**

## Run it

```
python3 .claude/skills/productize-linter/productize_lint.py            # CATALOG health
python3 .claude/skills/productize-linter/productize_lint.py <product>  # PRODUCT health
```
e.g. `… productize_lint.py vault/02-personal/areas/standup-tools/standupzero`. Exits non-zero on any ERROR.

## What it checks
**Catalog** (`.claude/skills/productize/{analyses,decisions,deliverables}/`):
- **C1** unique ids per catalog · **C2** analysis `depends_on` resolve · **C3** decision `reads` resolve · **C4** deliverable `reads` resolve · **C5** analysis + deliverable graphs acyclic.

**Product** (a generated `areas/<area>/<product>/`):
- **P1** required frontmatter on each artifact · **P2** each analysis's `depends_on` equals the backtick analysis-ids its body consumes (no decorative or undeclared-but-used edge) · **P3** product analysis graph acyclic + deps resolve to present artifacts · **P4** `00-productization-plan.md` links resolve (no phantom links) · **P5** build gate — non-illustrative Phase-6 deliverables require a GO / CONDITIONAL GO in `05-go-no-go.md` · **P6** the rendered `## Analysis plan` map matches the artifacts — same id set, each id's level band == its `depends_on`-derived level, and the `(standalone)` set == nodes with no deps and no dependents (skipped when no map is rendered yet).

## Using the output
Run it after editing the catalogs, after a `productize-analyze` or `productize-build` run, or before trusting a product's graph. ERROR = fix before relying on the toolkit; the messages name the file and the exact violation. It diagnoses only — it never edits.

## Tuning
Required-frontmatter sets and the GO-gate values are constants at the top of `productize_lint.py` (`REQUIRED_FM`, `GO_OK`). Frontmatter parsing is stdlib-only (no YAML dep), matching `vault-linter`.
