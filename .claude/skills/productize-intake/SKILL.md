---
name: productize-intake
description: Phase-1 product intake for the productize toolkit — gather the 13 intake fields (incl. thoroughness level + final-HTML-report opt-in) for a new product and write 01-product-intake.md. Interactive tier; invoked by productize-new, not run standalone.
---
# Product Intake (Interactive)

Gather the 13 intake fields for a new product and write `01-product-intake.md`. Invoked by `productize-new` once it has created the product folder `areas/<area>/<product>/`.

## How to run
Ask the fields **adaptively** — a short batch at a time, never a wall of questions. Narrow or skip questions the context already answers (field 4 *SaaS model* only if field 3 is **Software**; field 6 *segments* follows from field 5). Confirm inferred values instead of re-asking. One decision per question; keep it conversational.

Fields 1–11 (schema in `.claude/skills/productize/templates/product_intake.md`):
1. Idea / context / summary · 2. Business scope · 3. Product type · 4. SaaS model (if software) · 5. Customer type · 6. Customer segments · 7. Revenue model · 8. Stage & maturity · 9. Team & resources · 10. Competitive awareness · 11. Regulatory sensitivity

### Field 12 — Thoroughness level (ask this explicitly, with the explanation)
Ask the user how deep every artifact should go, and briefly explain the three levels (full spec: `.claude/skills/productize/depth-levels.md`):
- **1 · Sketch** — fast gut-check; summary + verdict + key findings, qualitative; runs only the core essential analyses.
- **2 · Standard** *(default)* — a real go/no-go; structured analysis with quantified derivations + evidence/assumption splits; runs the full relevant analysis set.
- **3 · Investment-grade** — board/investor-grade; adds scenarios, sensitivity, alternatives, a research plan, and active web research; runs relevant + secondary analyses.

If the user is unsure, recommend **2** and say it can be raised later. Store the choice as `depth: <1|2|3>` in the frontmatter and in row 12.

### Field 13 — Final HTML report (ask explicitly — it's the expensive capstone)
Ask whether to generate the **final HTML summary report** at the end of the flow (`productize-report` → `07-summary.html`): a rich, self-contained webpage that revisits *every* artifact with visualizations (SWOT quadrant, roadmap Gantt, scorecard radar, dependency graph, financial scenarios, animated hero, …) — the "show someone the whole bet on one page" deliverable.
- It is **token-expensive** (it re-reads and re-renders all artifacts), so it's opt-in.
- Recommend **yes** for depth 3 (investment-grade) runs; otherwise ask. It can be generated later by running `productize-report` regardless.
- Store as `html_report: <yes|no>` in the frontmatter **and** row 13.

## Output
Fill the `product_intake.md` template into `areas/<area>/<product>/01-product-intake.md`:
- replace every `{{placeholder}}` with the user's answer (`—` only if genuinely N/A, e.g. SaaS model for a service);
- set `depth:` (frontmatter + row 12) and `html_report:` (frontmatter + row 13) from fields 12–13;
- `{{today}}` = today `YYYY-MM-DD`; `{{area-slug}}` / `{{product-name}}` come from the orchestrator;
- keep the table structure; **never invent values the user didn't give — ask.**

## Done when
`01-product-intake.md` exists with all 13 rows filled (or explicitly `—`), `depth` + `html_report` set, and the user has confirmed the summary. Hand back to `productize-new` for the PRD step.
