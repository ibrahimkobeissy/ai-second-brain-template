---
name: productize-analyze
description: Phase-2–4 productize orchestrator — select, run, and report a product's intelligence analyses. Use to run the analysis engine on a product's PRD (market, competitive, feasibility, legal, SWOT, financials, …), write the analysis artifacts, and produce the global report. Prereq productize-new; next is productize-decide.
---
# Productize · Analyze (Phases 2–4) — select → run → report

Run the analysis engine for a product. **Read `.claude/skills/productize/conventions.md` (the knowledge-graph contract) first.**

## Steps
1. **Resolve product.** From the invocation argument or ask. Confirm `02-prd.md` exists with `status: active` — else stop and say to run the **`productize-new`** skill first (Phase-2 prereq). **Read its `depth`** (1/2/3; default 2) — it governs both how many analyses the slip pre-checks and how deep each artifact goes (see `.claude/skills/productize/depth-levels.md`).
2. **Select.** Invoke the **`productize-analysis-slip`** skill (it reads `depth` for breadth) → the set of analysis ids to run (it auto-includes `depends_on`).
3. **Plan + persist the analysis plan.** Expand the set with transitive `depends_on`, then layer into levels from `depends_on` per the **one rendering algorithm** in `conventions.md` → *The `## Analysis plan` map* (level = `0` if no deps else `1 + max(dep levels)`; **abort on a cycle**). Levels come from `depends_on`, **not** from the `NN` numbering; `NN` (assigned in the next step) is the run-order label only. **Before running anything, write the plan into `00-productization-plan.md`** under an `## Analysis plan` section, rendered as an **ASCII dependency map inside a fenced code block** (a diagram, *not* prose):
   - a header/legend line: `◄── = depends on · run order = NN (top → bottom)`;
   - one **level band** per level (`LEVEL 0 · run NN–NN`, `LEVEL 1 · …`, …) top-to-bottom = run order, with a `▼` between bands to show the flow;
   - under each band, one line per analysis: `NN  <id>   ◄── <upstream NNs>` (use `no upstream` for a Level-0 node that *is* depended upon; tag `(standalone)` **inline, right after the `id`**, when it has neither deps nor dependents);
   - a final `execution:` line (sequential · level-ordered · single-agent — parallelize a level only if it holds many independent analyses).
   This records *how the run will go* before any artifact exists, so the plan is legible at a glance. Then run the levels in order (a level's analyses are independent).
4. **Run each.** Walking the levels in order, assign each a sequential `NN` (`01`, `02`, …) = its run position. For each id:
   - read its catalog entry `.claude/skills/productize/analyses/<id>.md`;
   - read `02-prd.md` and, for each `depends_on`, find the already-written artifact by **scanning `03-analyses/*.md` for `analysis: <id>` in frontmatter** (not by filename) and read its `verdict` + `key_findings`;
   - perform the analysis per the entry's Method;
   - write `03-analyses/NN-<id>.md` using `.claude/skills/productize/templates/analysis.md`, filling the KG frontmatter **honestly** (real `verdict` / `confidence` / `key_findings`).
5. **Report.** Generate `04-report.md`: a table (one row per analysis: verdict · confidence · `[[NN-<id>]]` link) + a 2–3 sentence synthesis. Keep it short — artifacts hold the detail.
6. **Update the plan.** In `00-productization-plan.md`: mark the Phase 2–4 row done, set the report/analyses artifact links, bump `updated`.

## Guarantees
- **Depth bar — scale every artifact to the PRD's `depth`** (`depth-levels.md`): **L1** summary + verdict + findings (qualitative); **L2** structured `Summary / Analysis / Evidence & assumptions / Conclusion` with quantified derivations, named specifics, fact-vs-assumption split, a counter-argument; **L3** adds scenarios, sensitivity, alternatives, a "what would change this verdict" section, a sources-to-gather plan, sub-analysis breakouts, and active web research. At L2+, **a 3-sentence "findings" paragraph is a fail.** Depth ≠ padding — make the *thinking* visible, don't inflate word count.
- **Never fabricate findings.** Thin evidence → `status: partial` / `confidence: low`, stated plainly in the artifact. (This is a second brain — honest over impressive.) Honest depth means real numbers where derivable and honest "unknown — needs research" elsewhere, never fake precision.
- Dependencies are resolved by the `analysis:` frontmatter id (scan, not filename), so the `NN-` prefixes never break the graph.
- **`depends_on` must match the body both ways:** every analysis your body cites must be in `depends_on` (no *undeclared-but-used* edge), and every declared dep must actually be used (no *decorative* edge). Before finishing an artifact, reconcile the two.
- Writes only inside `areas/<area>/<product>/`.
