# Productize Toolkit — Conventions

Build-time conventions for the `productize` toolkit. **Agent-facing:** read this before building or changing any productize skill. The user-facing guide is `vault/99-system/documentation/productize.md`.

## Layout & namespace
- **Skill folders** → `.claude/skills/productize-<name>/SKILL.md`, invoked `/productize-<name>` (Claude) or `$productize-<name>` (Codex). This covers the six Workflow-tier phase orchestrators (`new`, `analyze`, `decide`, `build`, `plan`, and `report` — the capstone HTML summary, outcome-agnostic, re-runnable, auto-fired by `build` when intake opted in) and the Interactive-tier helpers (`intake`, `prd`, `analysis-slip`). Prefix every folder with `productize-` so the toolkit stays grouped and `.claude/` readable. (Both agents discover everything under `.claude/skills/`; there is no `.claude/commands/` surface.)
- **Shared assets** (this folder, `.claude/skills/productize/`) → catalogs, methods, templates + these conventions. It has **no `SKILL.md`**, so it is not itself a registered skill — just the toolkit's asset home.
- **Attribution:** external source credit (Dean Peters' Product-Manager-Skills) lives in **exactly one place — the public template repo's README**. **Generated product artifacts carry none** — never stamp "re-authored from…" footers/banners into `02-prd.md`, the analyses, `05-go-no-go.md`, the deliverables, or `07-summary.html`. *(Toolkit catalog/method/skill source files may keep a one-line maintainer provenance note; the rule above is about what the skills **generate**, which is what a user sees.)*

## Thoroughness levels (the depth dial)
Every product carries a `depth` of **1 (Sketch) / 2 (Standard, default) / 3 (Investment-grade)**, chosen at intake (Q12), stored in `02-prd.md` frontmatter, and read by every Phase 2+ skill. It scales **both** how deep each artifact goes **and** how many analyses the slip pre-checks. Full spec + per-artifact criteria: **`depth-levels.md`**. Depth scales *rigor* (quantification, scenarios, sourcing), never invented certainty — the honesty rules hold at every level.

## The three tiers (what gets its own skill folder)
- **Workflow** — the six phase orchestrator skills above; the user-facing entry points.
- **Interactive** — guided 3–5-question skills (intake, analysis slip, advisors). Invoked *by* a Workflow skill, not directly.
- **Component** — single-deliverable generators (analyses, specs, scorecards). **Catalog entries, not skills** — run by a Workflow skill, never invoked directly.

Tier skeletons: `templates/tier-workflow.md`, `tier-interactive.md`, `tier-component.md`.

> **Component-tier packaging (settled):** Component generators are **catalog entries** (one spec file each), not skill folders — kept lean and run by the relevant Workflow skill, not a separate runner skill. The catalogs: **19 analyses** (`analyses/`, the Legal Scan's 7 sub-areas live as sections *inside* `legal-scan.md`, not as separate files), **3 decisions** (`decisions/`), **13 deliverables** (`deliverables/`). `productize-analyze` runs the analyses; `productize-decide` the decisions; `productize-build` the deliverables.

## Product folder scaffold
A product is a **direct subfolder of its Area** (multiple → `product1`, `product2`). Output artifacts carry a **two-digit `NN-` chronological prefix** so a newcomer reads them top-to-bottom in phase order without expertise (filenames are hyphen-case):

```
areas/<area>/<product>/
├── <product>.md                # product MOC — the stable, uniquely-named graph node (Areas link to [[<product>]])
├── 00-productization-plan.md   # the MAP / start-here — control file (phases, prereqs, links, status)
├── 01-product-intake.md        # Phase 1 — the 13 intake fields incl. depth + html_report (Interactive output)
├── 02-prd.md                   # Phase 1 — standardized PRD 1.1–1.9 (single source of truth)
├── 03-analyses/                # Phase 2–4 — one artifact per analysis, numbered by run order
│   ├── 01-<analysis-id>.md     #   (01,02,… = topological/execution order, deps before dependents)
│   └── …
├── 04-report.md                # Phase 2–4 — concise global report (verdict + link per analysis)
├── 05-go-no-go.md              # Phase 5 — the decision
├── 06-deliverables/            # Phase 6 — numbered by generation order (only if decision = GO)
│   └── 01-<deliverable-id>.md
└── 07-summary.html             # capstone — visual HTML summary of every artifact (opt-in; productize-report)
```

**The `NN-` prefix is presentation only.** The knowledge graph resolves dependencies by the **`analysis:` / `deliverable:` id in frontmatter, never by filename** (see below), so a prefix like `05-feasibility.md` still satisfies a `depends_on: [feasibility]` edge. The number encodes *read order*; the frontmatter id is the stable identity.

> Numbering applies to **product output** artifacts only. The `.claude/skills/productize/analyses/` **catalog** stays un-numbered (it's a library indexed by `catalog.md`, not a chronological narrative).

**The product MOC (`<product>.md`) is the stable graph node.** Product artifacts use generic numbered basenames (`02-prd.md`, `05-go-no-go.md`) that **collide across products** in Obsidian (basename resolution), so a link `[[02-prd]]` is ambiguous once two products exist. The fix: every product has a **uniquely-named** `<product>.md` MOC (e.g. `standupzero.md`) created by `productize-new`. **Areas link to `[[<product>]]`, never to `[[00-productization-plan]]`.** This mirrors the Area pattern (`<area>.md` hub + `todo-kanban.md` status): here, `<product>.md` is the hub, `00-productization-plan.md` is the status. *(Intra-product links between numbered artifacts stay as-is — they're unambiguous **within** one folder; only cross-product / Area→product links must route through the MOC.)*

## Cross-Analysis Intelligence Engine — the knowledge-graph contract  ← resolves open decision #3
**Storage = per-artifact frontmatter** (co-located, Obsidian/Dataview-queryable), **not** a shared mutable file. A *generated* index gives the "single read" convenience without write-contention.

Every analysis artifact (`analyses/<analysis-id>.md`) carries:

```yaml
---
analysis: <analysis-id>        # stable id, matches the catalog (e.g. feasibility, market-study)
title: <human title>
status: complete | partial | blocked
verdict: <short machine-readable verdict>     # e.g. viable / risky / not-viable
confidence: low | medium | high
depends_on: [<analysis-id>, ...]              # analyses this one read
key_findings:                                  # 1–5 structured bullets for downstream consumers
  - "<finding>"
created: YYYY-MM-DD
---
# <title>
... full prose, ending in a ## Conclusion ...
```

- **Write:** an analysis writes its own artifact with the frontmatter above.
- **Read:** a downstream analysis reads the `verdict` + `confidence` + `key_findings` of the artifacts it lists in `depends_on`.
- **Aggregate:** `report.md` (and any `knowledge` index) is **generated** from these frontmatter blocks — never hand-edited.

## The control file (`productization_plan.md`)
Every phase skill, as its **final step**, updates the product's `productization_plan.md` (mark the phase row, refresh the artifact-link table, bump `updated`). `productize-analyze` additionally writes an **`## Analysis plan`** — an **ASCII dependency map** (level bands = run order, `◄── NN` = depends-on edges) — into the control file *before* it runs, so the planned run is legible up front rather than left implicit. `productize-plan` is the **manual fallback** — it regenerates the file purely from the files present on disk (including reconstructing the `## Analysis plan` from `03-analyses/` `depends_on` + `NN` order), so a drifted or hand-edited product can always be re-synced. **Truth is the filesystem**, never assumed state; links only ever point at files that exist.

## Naming
- Skills: `productize-<kebab-name>` (phase orchestrators use short verbs — `productize-new`, `productize-analyze`, …). Analysis ids: kebab, stable, matching the catalog numbering in the draft.

## Analysis catalog (Phase 2–4)
Analyses are **catalog entries**, not skills (decided Stage 2). Each is one spec file at `.claude/skills/productize/analyses/<analysis-id>.md`; `analyses/catalog.md` indexes them for the slip. `productize-analyze` reads an entry, runs it against the product, and writes an artifact.

**Catalog entry** = frontmatter (`analysis`, `title`, `catalog` number, `depends_on`, `reference_skills`, `relevant_when`) + a short spec body (**Evaluates / Reads / Method / Writes**). Re-author each from Dean Peters' Product-Manager-Skills with attribution.

**Artifact** = the output written to `<product>/03-analyses/NN-<analysis-id>.md`, following `templates/analysis.md` (the KG frontmatter contract).

**Dependencies resolve by frontmatter id, not by filename or link** — to read a `depends_on: [feasibility]` edge, `productize-analyze` scans `03-analyses/*.md` and matches the artifact whose frontmatter is `analysis: feasibility` (the `NN-` prefix and any `[[wikilink]]` are irrelevant to resolution). This is why chronological prefixes are safe: the id is the identity. Wikilinks in artifacts/reports are navigation only and should point at the numbered basename (e.g. `[[05-feasibility]]`).

**`depends_on` ↔ body parity (both directions):** an artifact's `depends_on` must list *exactly* the upstream analyses its body actually consumes — no **decorative** edge (declared but unused) and no **undeclared-but-used** edge (cited as consumed but missing from frontmatter). The runner reconciles both before writing. **Convention:** a **backtick `analysis-id`** in the body means "I consumed this analysis's verdict/finding" → it **must** be in `depends_on`. To merely *mention* a sibling or a later analysis (a forward-pointer like "tested later in validation"), use **plain prose** without the backtick-id — only consumed upstreams get backticks. This keeps backtick = dependency, so the parity check stays meaningful. Keep frontmatter key order consistent across artifacts (`analysis, title, product, status, verdict, confidence, depends_on, key_findings`).

## Execution planning & concurrency (Phase 3)
`productize-analyze` plans before it runs:
1. **Resolve deps** — expand the selected set with every transitive `depends_on`.
2. **Topological sort into levels** — level 0 = analyses with no unmet deps; each next level = analyses whose deps all sit in earlier levels. **Abort on a cycle.**
3. Analyses within a level are independent and may run concurrently.

**Concurrency decision (Stage-4 spike):** default is **sequential, level-ordered, single-agent** — simplest, fully traceable, and the selected count is usually small. **Fan a level out to parallel sub-agents only when it holds many (>~5) independent analyses**, with the main agent as orchestrator collecting each artifact. Rationale: sub-agents add orchestration + context-passing overhead and weaken traceability; that cost only pays off at volume. **Custom per-analysis specialist agents were rejected** — the catalog entry already carries the specialism, so a generic runner + the entry suffices.
