---
name: synthesize-drafts
description: >-
  Synthesize multiple research files from an Area's draft folder into a strategic 
  global plan using a scientific thematic synthesis method. Use when you have 
  collected multiple resources/notes in a draft folder and need to analyze them 
  against each other and the parent Area context to decide what to build and 
  what to discard.
---

# Synthesize Drafts

Analyze a collection of draft notes against a parent Area context to produce a 
unified, strategic "Global Plan." This uses a scientific approach called 
**Strategic Thematic Synthesis** to identify convergence, divergence, and 
strategic gaps.

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
- Draft Folder: `vault/<part>/areas/<area-slug>/draft/`
- Output Plan: `vault/<part>/areas/<area-slug>/synthesis/strategic-plan-{{kebab-topic}}.md`
- Output Template: `assets/templates/strategy-draft.md` (in this skill folder)

## Interactive Workflow

1.  **Discover Areas:** List subdirectories of `vault/01-work/areas/` and 
    `vault/02-personal/areas/`.
2.  **Ask User for Area:** Present the list of Areas and ask which one to work in.
3.  **List Drafts:** List the `.md` files in the chosen Area's `draft/` folder, 
    **excluding any whose frontmatter is already `status: synthesized`** (those were 
    processed in a prior run) and any `strategic-plan-*.md`. Only un-synthesized drafts 
    are candidates. (If the user explicitly asks to re-process a synthesized draft, they 
    can override; otherwise it stays skipped.)
4.  **Ask User for Files:** Present the list of drafts and ask which ones to 
    include in the synthesis (multi-select).
5.  **Read Context & Sources:**
    - Read the Area's hub note (`<area-slug>.md`, `type: moc`) for the strategic baseline. 
      If it is missing, fall back to a `README.md`; if neither exists, infer context from the 
      folder name and other notes, and record that the appraisal ran without an explicit hub note.
    - Read every selected draft **in full** — skimming breaks traceability and weighting.
6.  **Analyze & Generate:**
    - Use the Strategic Thematic Synthesis method.
    - Fill `assets/templates/strategy-draft.md`.
    - `topic_name`: A descriptive name for the synthesis (ask the user or derive 
      from context).
    - `today`: `YYYY-MM-DD`.
7.  **Write Output:** 
    - Ensure the `synthesis/` folder exists (`mkdir -p`).
    - Save the plan to the Area's `synthesis/` folder with a descriptive kebab-case filename.
8.  **Stamp the sources:** In each draft included in this synthesis, edit **only the 
    frontmatter** — set `status: synthesized` and add 
    `synthesized_into: "[[<plan-filename-without-ext>]]"`. Never touch the draft body. 
    This is what makes step 3 skip them next time and lets the user see at a glance which 
    drafts are done and where they went.

## Output Standards

- **The Matrix (traceable at any scale):** One row per theme; columns are 
  `Theme | Supporting Sources | Weight | Status`, where **Supporting Sources names the 
  actual sources** (e.g. `[[a]], [[c]]`) so any claim can be traced back. Do **not** use 
  one column per source — that breaks past a handful of drafts. A *complete* matrix covers 
  every non-trivial theme and lists every selected source against at least one theme.
- **Status & Weight:** Status ∈ Convergent (independent) / Convergent (echoed) / Divergent 
  / Unique. Weight (High/Med/Low) reflects source authority and independence, not raw count.
- **Decision Logic:** Explain *why* something is Core vs Noise, tied to the Area Context 
  and the weighted evidence — not to popularity alone.
- **The Core:** Actionable tasks derived from high-weight, independently-convergent points.
- **Anti-Backlog:** Be ruthless. If an idea doesn't fit the Area's strategic goals, list 
  it here explicitly so it doesn't clutter future work.

## Constraints

- Never modify a source draft's **body/content**. The *only* permitted change is the
  frontmatter stamp from step 8 (`status: synthesized` + `synthesized_into`).
- Never write directly into the root of an Area folder — always use `draft/` for 
  raw clippings or `synthesis/` for strategic plans.
- If the Area has no hub note (or `README.md`), infer the context from the folder name and 
  other notes in the root of the Area.
