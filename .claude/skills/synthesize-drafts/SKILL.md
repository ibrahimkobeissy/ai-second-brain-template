---
name: synthesize-drafts
description: >-
  Synthesize multiple research notes from an Area's draft/ and scout/ folders into 
  a strategic global plan using a scientific thematic synthesis method. Use when you 
  have collected multiple curated drafts and/or scout sweeps and need to analyze them 
  against each other and the parent Area context to decide what to build and 
  what to discard. Both a curated draft and a scout are synthesis inputs.
---

# Synthesize Drafts

Analyze a collection of research notes — curated **drafts** (`draft/`) and broad 
**scouts** (`scout/`) alike — against a parent Area context to produce a unified, 
strategic "Global Plan." This uses a scientific approach called **Strategic Thematic 
Synthesis** to identify convergence, divergence, and strategic gaps. A scout's 
`## Impact` analysis is as much a synthesis input as a draft's "what we can steal"; 
treat both folders as the same kind of source. (The name says "drafts" for history; 
the skill consumes both.)

## Method: Strategic Thematic Synthesis

1.  **Deconstruction:** Extract the core claims, facts, and ideas from each source, 
    tracking *which source* each came from — traceability is mandatory.
2.  **Synthesis Matrix:** For each recurring theme, record *which* sources support it 
    (by name), not just a count. Every selected source must appear against ≥1 theme.
3.  **Weigh the evidence, don't just tally it:** Convergence ≠ truth. Before calling a 
    theme "Convergent," check whether the sources are *independent* or merely echoing 
    each other (the same blog post cited five times is one signal, not five). Weight by 
    source authority and independence; flag echo-chamber agreement.
4.  **Strategic Appraisal:** Judge the weighted themes against the **Area Context** 
    (the goals in the Area's hub note/notes). If there is no hub note, infer context from 
    the folder and notes — and say so explicitly in the output.
5.  **Actionable Output:** Categorize into "The Core" (Build), "The Speculative" 
    (Validate), and "The Noise" (Discard), with reasoning tied back to the appraisal.

## Vault Paths

- Work areas: `vault/01-work/areas/`
- Personal areas: `vault/02-personal/areas/`
- Area Context: `vault/<part>/areas/<area-slug>/<area-slug>.md` (the `type: moc` hub note)
- Draft Folder: `vault/<part>/areas/<area-slug>/draft/` (curated "what we can steal" notes)
- Scout Folder: `vault/<part>/areas/<area-slug>/scout/` (broad discovery sweeps — same source class as drafts)
- Output Plan: `vault/<part>/areas/<area-slug>/synthesis/strategic-plan-{{kebab-topic}}.md`
- Output Template: `assets/templates/strategy-draft.md` (in this skill folder)

## Interactive Workflow

1.  **Discover Areas:** List subdirectories of `vault/01-work/areas/` and 
    `vault/02-personal/areas/`.
2.  **Ask User for Area:** Present the list of Areas and ask which one to work in.
3.  **List Sources:** List the `.md` files in **both** the chosen Area's `draft/` and 
    `scout/` folders (either may be empty or absent — skip a missing folder), 
    **excluding any whose frontmatter is already `status: synthesized`** (those were 
    processed in a prior run) and any `strategic-plan-*.md`. Only un-synthesized sources 
    are candidates. Label each candidate with its folder (e.g. `[draft] foo`, `[scout] bar`) 
    so the user can tell them apart. (If the user explicitly asks to re-process a synthesized 
    source, they can override; otherwise it stays skipped.)
4.  **Ask User for Files:** Present the combined list of drafts and scouts and ask which 
    ones to include in the synthesis (multi-select). A synthesis can mix both freely.
5.  **Read Context & Sources:**
    - Read the Area's hub note (`<area-slug>.md`, `type: moc`) for the strategic baseline. 
      If it is missing, fall back to a `README.md`; if neither exists, infer context from the 
      folder name and other notes, and record that the appraisal ran without an explicit hub note.
    - Read every selected source (draft or scout) **in full** — skimming breaks 
      traceability and weighting. For a scout, the `## Impact` section carries its analytical 
      read; mine it the same way you mine a draft's "what we can steal." **A scout's Tier-2 
      "More candidates (unverified)" links are leads, not evidence** — they can suggest a theme 
      worth a row, but must not *support* a matrix claim or raise its weight unless you fetch 
      and verify them first. Only the scout's verified picks + its `## Impact` analysis count 
      as evidence.
6.  **Analyze & Generate:**
    - **Determine the mode by source count first.** *Multi-source* (≥2 selected): run the 
      full convergence analysis. *Single-source* (exactly 1 selected — e.g. one rich scout): 
      cross-source convergence is **impossible**, so every matrix row is `Unique` by 
      definition and you run a **single-source appraisal** (see Output Standards). Never 
      claim "Convergent", "independently-convergent", or "echoed" from a single source.
    - Use the Strategic Thematic Synthesis method.
    - Fill `assets/templates/strategy-draft.md`.
    - `topic_name`: A descriptive name for the synthesis (ask the user or derive 
      from context).
    - `today`: `YYYY-MM-DD`.
7.  **Write Output:** 
    - Ensure the `synthesis/` folder exists (`mkdir -p`).
    - Save the plan to the Area's `synthesis/` folder with a descriptive kebab-case filename.
8.  **Stamp the sources:** In each source (draft **or** scout) included in this synthesis, 
    edit **only the frontmatter** — set `status: synthesized` (overwriting `draft`/`active`) 
    and add `synthesized_into: "[[<plan-filename-without-ext>]]"`. Never touch the body. 
    This is what makes step 3 skip them next time and lets the user see at a glance which 
    sources are done and where they went.

## Output Standards

- **The Matrix (traceable at any scale):** One row per theme; columns are 
  `Theme | Supporting Sources | Weight | Status`, where **Supporting Sources names the 
  actual sources** (e.g. `[[a]], [[c]]`) so any claim can be traced back. Do **not** use 
  one column per source — that breaks past a handful of drafts. A *complete* matrix covers 
  every non-trivial theme and lists every selected source against at least one theme.
- **Link disambiguation:** A bare `[[basename]]` resolves to the wrong note when that basename 
  is not unique vault-wide (draft/scout filenames *do* collide across Areas). Before emitting 
  any source link — in the matrix, the `Sources:` header, anywhere — check whether its basename 
  is unique; if not, **path-qualify** it as 
  `[[vault/<part>/areas/<area>/<draft|scout>/<name>|<name>]]`. Unique basenames may stay bare.
- **Status & Weight:** Status ∈ Convergent (independent) / Convergent (echoed) / Divergent 
  / Unique. Weight (High/Med/Low) reflects source authority and independence, not raw count. 
  In **single-source** mode every row is `Unique`, and "High" weight means the *one* source 
  traces the claim to multiple authoritative, substantially independent references **inside 
  itself** — it does **not** mean vault notes converged.
- **Decision Logic:** Explain *why* something is Core vs Noise, tied to the Area Context 
  and the weighted evidence — not to popularity alone.
- **The Core:**
  - *Multi-source:* actionable tasks derived from high-weight, **independently-convergent** points.
  - *Single-source appraisal:* actionable tasks derived from high-weight points in the one 
    source; **label the section a "single-source appraisal"** and state plainly that confidence 
    comes from within-source authority, **not** cross-source convergence. Do not call the Core 
    "high-confidence" on convergence grounds when only one source was read.
- **Anti-Backlog:** Be ruthless. If an idea doesn't fit the Area's strategic goals, list 
  it here explicitly so it doesn't clutter future work.

## Constraints

- Never modify a source's **body/content** (draft or scout). The *only* permitted change 
  is the frontmatter stamp from step 8 (`status: synthesized` + `synthesized_into`).
- Never write directly into the root of an Area folder — always use `draft/`/`scout/` for 
  raw inputs or `synthesis/` for strategic plans.
- If the Area has no hub note (or `README.md`), infer the context from the folder name and 
  other notes in the root of the Area.

## Done When

Do not report the synthesis complete until **all** of these hold — fix and re-check, don't stop early:

- [ ] **Coverage:** every selected source appears in ≥1 matrix row; nothing was silently dropped.
- [ ] **No placeholders:** no `{{...}}` template tokens remain in the output plan.
- [ ] **Links resolve:** every `[[wikilink]]` (matrix, `Sources:` header, `synthesized_into`) 
  points to a real note; non-unique basenames are path-qualified.
- [ ] **Mode honored:** one source → single-source appraisal with **no** convergence claim; 
  ≥2 sources → `Convergent` status reflects real independence, not a tally.
- [ ] **Evidence discipline:** no matrix claim rests on an unverified Tier-2 scout candidate.
- [ ] **Source diffs are frontmatter-only:** the sole change to each source is the step-8 stamp; 
  no body was touched.
- [ ] **Next-run exclusion:** each synthesized source now carries `status: synthesized`, so 
  step 3 will skip it next time.
