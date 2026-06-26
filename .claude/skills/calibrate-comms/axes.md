# The 9 Axes — Model & Compiler

The communication profile is a vector over **9 axes**: 6 output dials (how the agent writes back), 2 added output dials (jargon, tone), and 1 input dial (how the user briefs the agent). Each axis below gives: what it measures, its poles, the **validated prior instrument** (the cold-start guess — a *prior*, never a verdict), the **L1 item** (★ = the one asked in Quick mode), and the **directive bands** (the band the user lands in → the exact line emitted into the HOUSE STYLE block). The compiler is trivial and deterministic: *for each axis, take the final band, emit its line.*

> **Calibration, not classification.** Every instrument here is a short, peer-reviewed scale used only to seed a prior. The sample-reaction test (`samples.md`) and live corrections override it. We never assign a "type". See [[communication-calibration-instruments-landscape]].

## Quick vs Deep — instrument honesty (read before administering)
The ★ items below are **bespoke forced-choice proxies** the skill author wrote, each mapped to its axis's construct. They are honest, fast stand-ins for a prior — they are **not** the validated scales themselves.
- **Quick (default):** ask the ★ proxy per axis. Fine for a fast prior; make **no** validation claim.
- **Deep:** administer the *actual* validated instrument. **Fetch its exact items from the open-access source first — never reproduce a scale from memory, never paraphrase items and call them validated.** If you can't obtain the exact items, stay in Quick. Sources:
  - `density` → **NCS-6** (Need for Cognition), open access CC-BY: `pmc.ncbi.nlm.nih.gov/articles/PMC7545655`
  - `abstraction`, `detail` → **TIPI** (Big Five), free: `gosling.psy.utexas.edu` (Ten-Item Personality Measure)
  - `tradeoff` → **Maximization-6** (Nenkov et al. 2008) — may be paywalled; use a licensed copy or fall back to Quick
  - `sequence` → **Need for Closure** brief (Roets & Van Hiel 2011) — paywalled; same caveat
  - `modality` → **Subjective Graph Literacy** (Garcia-Retamero et al. 2016)
  - `jargon`, `tone`, `context-giving` → no psychometric exists; the ★ item *is* the instrument

---

## Output dials

### 1. `density` — how much text per point
*Prior:* Need for Cognition (NCS-6; Coelho, Hanel & Wolf 2018). High NfC → tolerates/wants depth.
**★ L1 item:** "Which frustrates you more in an answer? **(a)** It's too long / eats my time → `LOW` · **(b)** It's too short and leaves me with questions → `HIGH` · **(c)** Depends → `MID`"
**Bands → directive:**
- `LOW` → "Keep sections tight (~150 words max); lead with a one-line takeaway; cut hedging and preamble."
- `MID` → "Moderate length; takeaway first, then the key support."
- `HIGH` → "Full reasoning is welcome — show the why, the caveats, and the chain of thought."

### 2. `sequence` — the order ideas arrive
*Prior:* Need for Closure (weak signal — high NfClosure leans answer-first); mostly stated/observed.
**★ L1 item:** "Do you prefer the **answer first** or the **build-up first**? **(a)** Build-up, conclusion last → `CHRONO` · **(b)** Answer first, then why → `BLUF` · **(c)** A short gist, then the build → `MIX`"
**Bands → directive:**
- `CHRONO` → "Build step-by-step; each section stands on the previous; no forward references; conclusion last."
- `MIX` → "Open with a one-line gist, then build the reasoning chronologically."
- `BLUF` → "Bottom line up front: answer in sentence one, justification after."

### 3. `modality` — words vs pictures
*Prior:* Subjective Graph Literacy (Garcia-Retamero et al. 2016).
**★ L1 item:** "A 4-step process — how would you rather see it? **(a)** Numbered sentences → `PROSE` · **(b)** A diagram / flowchart → `VISUAL` · **(c)** Either works → `MIX`"
**Bands → directive:**
- `PROSE` → "Prose-first; use visuals sparingly and always caption them in words."
- `MIX` → "Use a table or diagram when content is structural/relational; prose otherwise."
- `VISUAL` → "Default to a diagram/table for any relational or multi-part content (aim ≥1 visual per major section)."

### 4. `abstraction` — principle-first vs example-first
*Prior:* TIPI — Openness (Gosling et al. 2003). High O → comfortable starting abstract.
**★ L1 item:** "To grasp a new concept you'd rather start from… **(a)** A concrete example → `CONCRETE` · **(b)** The general principle → `ABSTRACT` · **(c)** Either → `MIX`"
**Bands → directive:**
- `CONCRETE` → "Give a concrete example before stating the principle — every time."
- `MIX` → "State the principle with a quick concrete example attached."
- `ABSTRACT` → "Principle-first; examples optional / on request."

### 5. `tradeoff` — one answer vs the menu
*Prior:* Maximization-6 (Nenkov et al. 2008) + Need for Closure. Maximizers want all options.
**★ L1 item:** "Faced with a decision you want… **(a)** My single recommendation → `DECISIVE` · **(b)** The options + tradeoffs to weigh myself → `OPTIONEER` · **(c)** A lean plus the main alternative → `BALANCED`"
**Bands → directive:**
- `DECISIVE` → "Lead with one clear recommendation; keep alternatives to a footnote."
- `BALANCED` → "Recommend one option, and name the top alternative with its key tradeoff."
- `OPTIONEER` → "Lay out 2–3 options with tradeoffs before recommending."

### 6. `detail` — how much gets covered (≠ density)
*Prior:* TIPI — Conscientiousness. High C → wants completeness.
**★ L1 item:** "By default, would you rather I… **(a)** Cover the main path and stop → `GIST` · **(b)** Cover edge cases & exceptions too → `COMPLETE` · **(c)** In between → `MID`"
**Bands → directive:**
- `GIST` → "Cover the main path; link to depth rather than inlining edge cases."
- `MID` → "Main path plus the most important caveats."
- `COMPLETE` → "Cover edge cases, exceptions, and failure modes — rigor over brevity (but layer it, per `density`)."

### 7. `jargon` — expertise assumed *(per-domain default)*
*Prior:* none psychometric — set from self-report + domain. **This dial is per-domain**; the block stores a global default, an Area may override it in its hub note.
**★ L1 item:** "By default assume you… **(a)** Want terms & acronyms defined → `PLAIN` · **(b)** Know the domain, skip definitions → `EXPERT` · **(c)** Define only the unusual ones → `MID`"
**Bands → directive:**
- `PLAIN` → "Define terms and expand acronyms on first use; avoid unexplained jargon."
- `MID` → "Assume working fluency; define only non-obvious or newly-introduced terms."
- `EXPERT` → "Assume domain mastery; use precise jargon without expansion."

### 8. `tone` — register
*Prior:* none psychometric — stated preference.
**★ L1 item:** "The register you prefer… **(a)** Casual, direct, plain → `CASUAL` · **(b)** Neutral-professional → `NEUTRAL` · **(c)** Polished/formal → `FORMAL`"
**Bands → directive:**
- `CASUAL` → "Plain, direct, conversational; contractions fine; skip ceremony."
- `NEUTRAL` → "Professional but unstuffy; clarity over formality."
- `FORMAL` → "Polished, precise register; no slang."

## Input dial

### 9. `context-giving` — how the user briefs the agent
*Prior:* observed + self-report (no clean instrument). **Behavioural — refine over time via corrections, not samples.** This dial tells the agent how to handle *the user's* messages.
**★ L1 item:** "When you brief me, you tend to… **(a)** Give a short line and expect me to figure it out → `SPARSE` · **(b)** Send a lot at once, sometimes several topics → `FLOODING` · **(c)** Give roughly the right amount → `BALANCED`"
**Bands → directive:**
- `SPARSE` → "When the user's context is thin, EXTRACT before acting — ask targeted questions; don't assume or guess."
- `FLOODING` → "When the user sends a lot or mixes subjects, SPLIT into separate threads and confirm the decomposition before working each."
- `BALANCED` → "Proceed directly; extract or split only when the request is genuinely ambiguous."

---

## Interactions (resolve in Phase 3 before emitting)
- **`density` × `detail`:** low density + complete detail is *not* a contradiction — it resolves to **"thorough but layered"**: cover everything, gist-first with depth underneath (progressive disclosure). Emit both lines and add the layering clause.
- **`tradeoff` × `sequence`:** `OPTIONEER` + `BLUF` can clash ("answer first" vs "show options first"). Prefer: a one-line lean up front, then the option breakdown.
- **`modality` = VISUAL × `density` = LOW:** a diagram *replaces* prose here — use the visual instead of, not in addition to, a long paragraph.
- **User's explicit edit in Phase 3 always wins** over any computed band.
