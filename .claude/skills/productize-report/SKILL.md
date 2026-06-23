---
name: productize-report
description: Capstone productize skill — revisit every artifact a product produced (PRD, all analyses, decision, all deliverables, roadmap) and render one self-contained, visualization-rich, animated single-page HTML summary (07-summary.html). Run standalone anytime after analyses exist, or auto-fired by productize-build when intake opted in.
---
# Productize · Report — the capstone HTML summary

Turn a product's **entire artifact set** into `07-summary.html`: a single, self-contained, gorgeous webpage that an exec, an investor, or the founder can read top-to-bottom and *get the whole bet* — every verdict, every number, every risk, every spec — with a real visualization wherever one helps. This is the toolkit's showpiece; treat it as a design deliverable, not a dump.

> **North star:** "as thorough as re-visiting all the artifacts, but in 5 scrolling minutes and unmissably clear." Sexy **and** honest. Never trade truth for polish.

## Steps (orchestration)
1. **Read `.claude/skills/productize/conventions.md` (the KG contract) first.**
2. **Resolve product.** From the invocation argument or ask; locate `areas/<area>/<product>/`.
3. **Prereq.** Requires at least `02-prd.md` (`status: active`) + `03-analyses/` with artifacts; the decision + deliverables are included if present. If only the PRD exists, say to run the **`productize-analyze`** skill first. **Outcome-agnostic:** works for GO, PIVOT, *and* NO-GO — a No-Go report is just as valuable (it shows *why*).
4. **Read EVERYTHING from disk** (truth = filesystem, never assumed) — see *Inputs* below. **Miss nothing** — the promise is "as thorough as re-visiting all the artifacts."
5. **Generate** `07-summary.html` per the spec below: a single self-contained file (CDN libs allowed), every section backed by a visualization where one fits, honest to the artifacts (never invent a number not in them).
6. **Update the plan.** Add `07-summary.html` to the artifact list in `00-productization-plan.md`; bump `updated`. (No new phase row — the report is a cross-phase capstone, not a phase.)
7. **Reconcile coverage.** Before finishing, compare the report's artifact index against the actual file list on disk — the index must include a clickable relative link for every source artifact read (product MOC, plan, intake, PRD, every analysis, `04-report.md`, decision, every deliverable/roadmap, and `07-summary.html` itself). Then report the path and tell the user to open it in a browser.

## Inputs (read ALL of these, from disk)
- `01-product-intake.md` — the 13 fields (depth, html_report, segments, team, …).
- `02-prd.md` — **single source of truth**; note `depth`. Pull the problem, positioning, segments, revenue model, vision, the 1.9 assumptions/★ risks.
- every `03-analyses/*.md` — frontmatter (`analysis`, `verdict`, `confidence`, `depends_on`, `key_findings`) **and** body specifics (TAM math, competitor tables, risk registers, scenarios).
- `04-report.md` — the synthesis + the verdict table.
- `05-go-no-go.md` — `recommendation`, the scorecard table + weights, and any `analytical_recommendation` / `override` / accepted-risks.
- every `06-deliverables/*.md` — track, what each specifies; the roadmap's phases + gates.
- `00-productization-plan.md` — phase status, the analysis dependency map.

**Coverage is the contract:** every artifact present on disk must appear somewhere in the report. Build an internal checklist of files and tick each off. A dropped analysis is a defect.

## Output
One file: `areas/<area>/<product>/07-summary.html`. Self-contained (single `.html`; CDN `<script>`/`<link>` allowed for libraries). Opens offline-first where possible (the page must still be readable if a CDN fails — see Resilience).

## Report structure (sections, in order)
Scale richness to `depth` (L1 = the core sections, lighter; L2 = all sections; L3 = all sections + scenario/sensitivity visuals + the research plan). Every section is **anchored in the nav** and **scroll-revealed**.

1. **Hero** — product name, the one-line positioning, the **headline verdict badge** (GO / CONDITIONAL GO / PIVOT / NO-GO, color-coded), depth, date. Animated gradient/particles; an at-a-glance "vital signs" strip (market verdict · competition · feasibility · decision · confidence). **If there's a founder override, the hero shows BOTH** the decision and the analytical recommendation — honestly, side by side.
2. **Executive summary** — 3–5 sentence synthesis (from `04-report.md`) + a "key findings" highlight reel pulled from the top analyses' `key_findings`.
3. **The product (PRD digest)** — problem → solution → positioning; target segments as cards; revenue model; the vision/scenarios.
4. **Market & opportunity** — TAM/SAM/SOM (funnel or nested-circles viz with the real derived numbers), demand drivers, segment pull.
5. **Competitive landscape** — competitor comparison table + a **positioning map** (2-axis scatter) if the axes exist; name the gap honestly.
6. **The analysis engine** — a **full-width verdict matrix**: every analysis as a row (# · id · verdict chip · confidence meter · **one-line key finding**). This is the "we did the work" section. *(A node-link dependency graph was tried and dropped — auto-laid-out graphs render cramped/unreadable at this node count; the full-width matrix + findings communicates more, more clearly. Add a graph back only if it renders legibly.)*
7. **SWOT** — the classic **four-quadrant** grid (S/W/O/T), populated from the swot artifact; color-coded, icons.
8. **Financials** — scenario chart (conservative/base/optimistic bars or lines), unit-economics callouts, break-even — real numbers from `financial-model`.
9. **Risk register** — a **likelihood × impact matrix** (bubble/heat grid) from `risk-assessment`; dealbreakers flagged.
10. **The decision** — the **scorecard radar/bar** (the 5 dimensions × weights), the weighted total as an animated gauge, the recommendation rationale, and (if present) the override block with accepted risks.
11. **Build plan (if deliverables exist)** — the deliverables as product/technical track cards; **the roadmap as a Gantt/timeline** with phase gates.
12. **Appendix / artifact index** — a clickable linked list of every source artifact (relative paths) so the report is traceable back to the vault. Include the product MOC, plan, intake, PRD, every analysis, `04-report.md`, decision, every deliverable/roadmap, and `07-summary.html` itself. **No external attribution in the artifact** (see the attribution rule below).

*(Skip a section only if its artifact genuinely doesn't exist — e.g. no deliverables on a NO-GO. Note the skip honestly rather than fabricating.)*

## Visualization playbook (use the right viz per artifact)
| Artifact / data | Visualization | Tech |
| --- | --- | --- |
| Go/No-Go scorecard (5 dims × weight) | **Radar** + an animated **gauge** for the weighted score | Chart.js |
| SWOT | **4-quadrant** CSS grid, color per quadrant | CSS/HTML |
| Roadmap phases + gates | a **hand-built CSS/HTML horizontal timeline** (month axis, one labeled bar per phase, gate pills at boundaries, legend). **Prefer this over Mermaid `gantt`** — Mermaid's gantt renders cramped/overlapping and is hard to control | CSS/HTML |
| Analysis verdicts | **full-width verdict matrix** (row per analysis: verdict chip · confidence meter · key finding) | HTML table |
| TAM/SAM/SOM | nested circles or **funnel** | SVG / Chart.js |
| Financial scenarios | grouped **bars** or **lines** (cons/base/opt) | Chart.js |
| Risk register | **likelihood × impact** bubble/heat grid | Chart.js scatter / CSS grid |
| Competitor comparison | feature/positioning **matrix** + 2-axis **scatter** | HTML table + Chart.js |
| Verdict distribution | small **donut** (how many viable/risky/…) | Chart.js |
| Confidence levels | inline **chips/meters** | CSS |

**Rule:** a viz must encode *real data from the artifacts*. Never draw a chart with invented numbers to look impressive — if the artifact has no number (e.g. `partial`/unknown), show the qualitative state honestly (a "needs research" tag), not a fake bar.

## Design system (make it sexy)
- **One self-contained file.** All CSS in a `<style>` block, all JS in `<script>`. CDN libs via `<script src>`/`<link>` (pin a major version).
- **Suggested libs (CDN):** Chart.js (charts), Mermaid (graph + gantt), AOS or a tiny inline IntersectionObserver (scroll-reveal), Google Fonts (a strong display + clean body pairing). Keep the set tight; don't load five overlapping libs.
- **Verdict color language (consistent everywhere):** GO/strong/viable = emerald; CONDITIONAL/moderate/mixed = amber; PIVOT = violet; NO-GO/not-viable/high-risk = rose; neutral = slate.
- **Confidence is a *neutral* level meter, not a verdict.** Render high/med/low as a 3-bar meter where the **count** encodes the level and **all filled bars share one neutral colour** (e.g. slate-blue). **Never colour confidence bars green/amber/red** — a "high confidence" green meter next to a *bad* verdict (e.g. `exposed`, `high risk`) reads as a contradiction. Colour carries the *verdict*; the meter carries only *how sure*.
- **Motion:** animated hero (gradient or particle/canvas), **count-up** numbers, scroll-reveal on every section, hover lifts on cards, a sticky top nav with section anchors and a scroll-progress bar. Tasteful, not seizure-inducing; respect `prefers-reduced-motion` (gate animations behind it).
- **Layout:** responsive (mobile → desktop), generous whitespace, dark-mode-friendly palette, big confident type. Print-friendly enough to export to PDF.

## Resilience & honesty (non-negotiable)
- **CDN fallback:** if a chart lib fails to load, the section still shows its data as a styled table/list (progressive enhancement — render the data in the DOM, enhance into a chart on load). Never a blank box.
- **No fabrication:** every number, verdict, quote traces to an artifact. Cross-check against frontmatter. If the decision is PIVOT/NO-GO or a founder override, the report **leads with that truth** — it summarizes the real conclusion, it is not a pitch deck that hides the verdict.
- **Total coverage:** reconcile against the file list before finishing; if an artifact isn't represented, add it.

## Attribution
**No external source credit appears in generated artifacts** — not in `07-summary.html`, the analyses, the decision, or the deliverables. The single home for the Product-Manager-Skills (Dean Peters) credit is the **public template repo's README**. Don't add "re-authored from…" footers or banners to anything the toolkit *generates*.

## Done when
`07-summary.html` exists, opens in a browser, renders every section with its visualization (and degrades gracefully without CDNs), represents **every** artifact on disk, carries the honest verdict (incl. overrides), carries **no** external attribution, and the plan links it (step 6 above, or hand back to **`productize-build`** when it auto-fired this skill).
