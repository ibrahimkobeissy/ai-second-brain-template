# Productize — Thoroughness Levels (the depth dial)

A single setting, chosen at intake (Q12), that scales **every generated artifact** (PRD, analyses, decision, deliverables) and **how many analyses run**. Stored as `depth: 1|2|3` in the product's `02-prd.md` frontmatter (the source of truth); every skill reads it from there. Default **2**.

The levels differ by **analytical rigor — the operations performed — not word count.** Each level strictly *adds* to the one below.

---

## Level 1 — Sketch
*Use when: gut-check, early triage, "is this even worth deeper work?"*

- **Every artifact:** a `## Summary`, a verdict + confidence, 3–5 `key_findings`, a 1–2 sentence `## Conclusion`. Qualitative is fine; **no required quantification, no sub-section breakdown.**
- **Analyses run:** the **core essential** set only — the slip pre-checks the always-on minimum (typically `feasibility`, `market-study`, `competitive-landscape`, + any the PRD makes unavoidable, e.g. `legal-scan` if regulated).
- **Research:** none — reason from the PRD + already-curated area evidence.
- **Decision / deliverables:** headline recommendation; deliverables are outline-level.
- **≈ 10–15 lines/artifact.**

## Level 2 — Standard  *(default)*
*Use when: making the actual Go/No-Go for a normal project.*

Everything in L1, **plus**:
- **Structured `## Analysis`** with the sub-sections the catalog entry's Method names (e.g. a market study: Sizing / Demand drivers / Segments / WTP).
- **Quantification with the derivation shown** wherever numbers exist (a TAM with no math is a fail).
- An explicit **`## Evidence & assumptions`** split — verified fact vs. inference, with the gaps named.
- Reasoning chains (claim → because → therefore) and at least one **counter-argument** weighed.
- **Analyses run:** the **full relevant** set for the product type (the slip's suggested-checked set).
- **Research:** light — leans on scout/curated evidence already in the Area; flags what needs primary research.
- **Deliverables:** decision-grade — e.g. a functional spec with epics → stories → acceptance criteria; a tech spec with components, data flows, the riskiest integration named.
- **≈ 40–70 lines/artifact.**

## Level 3 — Investment-grade
*Use when: real capital allocation, external stakeholders, board/investor decisions.*

Everything in L2, **plus**:
- **Scenario modelling** — conservative / base / optimistic, quantified, with the assumptions each hinges on.
- **Sensitivity analysis** — which 1–2 assumptions actually move the verdict, and the break-point value.
- **Alternatives & counterfactuals** explicitly weighed (not just the chosen path).
- A **`## What would change this verdict`** section (the falsifier).
- A **sources-to-gather / primary-research plan** — what evidence to collect to raise confidence, and how.
- **Sub-analysis breakouts** — e.g. `legal-scan` fully expands all 7 sub-areas; `financial-model` builds a multi-line projection; deliverables include data models, API contracts, edge cases.
- **Analyses run:** the full relevant set **+ secondary/optional** analyses (slip pre-checks broadly).
- **Research:** **active web research** per analysis where the catalog entry lists external `reference_skills`/sources.
- **≈ 100–200+ lines/artifact; may split into sub-files** under the artifact's folder.

---

## How each skill uses this
- **`productize-intake`** asks Q12 and stores `depth`.
- **`productize-prd`** carries `depth` into `02-prd.md` frontmatter and scales PRD section depth.
- **`productize-analysis-slip`** uses `depth` to set how many analyses are pre-checked (L1 core → L3 relevant+secondary). **The user always makes the final choice** — depth only sets the default breadth.
- **`productize-analyze` · `decide` · `build`** read `depth` from the PRD and scale each artifact to the level above. Honesty rule is unchanged at every level: real numbers where derivable, honest "unknown — needs research" elsewhere; never fake precision to hit a level.
