---
name: calibrate-comms
description: >-
  Calibrate how the vault's agents write to you. A multi-phase skill that profiles your communication preferences across nine axes (density, sequence, modality, abstraction, tradeoff appetite, detail, jargon, tone, and how you brief the agent), grounds them in validated psychometrics as priors, confirms them with sample-reaction tests, and compiles them into operational writing directives persisted to CLAUDE.md so every agent (Claude + Codex) obeys them. Re-runnable. Use when the user wants the agent to match their communication style, fix recurring "too long" / "too terse" / "WTF does this mean" feedback systemically, set up or re-run their communication profile, or asks how you should be writing to them.
---

# Calibrate Communication

Profile how *this* user wants the vault's agents to communicate — both how they brief the agent (input) and how the agent should write back (output) — and compile it into operational writing directives persisted to `CLAUDE.md` so every agent obeys them. Re-runnable; real-work corrections feed back in.

**Grounding:** [[communication-calibration-design]] (the design) + [[communication-calibration-instruments-landscape]] (the verified instruments). The governing principle is **calibration, not classification** — psychometric scores are *priors*; the sample-reaction test and live corrections are the empirical override. **Never** use pop-psych typing (DISC / MBTI / VARK) — see the scout for why.

## Key files
- `axes.md` — the 9-axis model: each axis's poles, its validated prior instrument, the L1 elicitation item, and the **directive bands** it emits. This is both the measurement model and the compiler.
- `samples.md` — the L2 sample-reaction pairs (the same content rendered to opposite poles; the user picks which lands).
- `templates/comms-profile-ledger.md` — the re-runnable record (answers, bands, overrides, history).
- `templates/house-style-block.md` — the format of the compiled HOUSE STYLE directive block.

## Output locations
- **Ledger** (full record, re-runnable): `vault/99-system/communication-profile/<user>.md`.
- **Enforcement** (what agents load): the block between `<!-- COMMS-PROFILE:START -->` and `<!-- COMMS-PROFILE:END -->` in `CLAUDE.md` §12 — loaded every session, so every agent obeys it.

## The Workflow

### Phase 0 — Depth & scope
1. Ask **depth**: **Quick** (~5 min — the one ★ proxy item per axis + the sample reactions; the default) or **Deep** (administer the *actual* validated instruments — you **must fetch their exact items from the cited open-access sources first**, per `axes.md` → "Quick vs Deep" — plus every sample pair).
2. Confirm whose profile this is (default: the primary user). One ledger per user.

### Phase 1 — PRIOR (the cold-start guess)
- Walk the 9 axes in `axes.md`. For each, ask its L1 item (Quick: the ★ bespoke proxy only; Deep: the exact validated-instrument items you **fetched** — never reproduced from memory). Batch the forced-choice items with `AskUserQuestion` so it's a few taps, not an interrogation.
- Score each axis into its **band** (the labels are axis-specific, e.g. CHRONO / MIX / BLUF). Record these as **priors** — never final.

### Phase 2 — CALIBRATE (revealed preference overrides the prior)
- From `samples.md`, show the contrast pairs — **prioritise** axes whose prior is mid/uncertain, plus `jargon` and `tone` (weak priors). Ask pairwise: *"which one lands?"* (revealed preference beats self-report — see scout).
- Where the chosen sample **contradicts** the L1 prior, the **sample wins**: update the band and log the override in the ledger.
- `context-giving` (axis 9) is behavioural, not sample-able — set it from the L1 item and refine it over time via corrections.

### Phase 3 — COMPILE & CONFIRM
- For each axis, read its final band → emit that band's **directive line** from `axes.md`. Concatenate into the HOUSE STYLE block (`templates/house-style-block.md`).
- **Resolve interactions** (see `axes.md` "Interactions"): density × detail → "thorough but layered"; tradeoff × sequence → don't both demand a menu and an answer-first.
- **Show the user the assembled block verbatim** and ask: *"this is how I'll write to you now — change anything?"* Apply their edits directly (their explicit word beats the computed band).

### Phase 4 — PERSIST
1. Write/refresh the **ledger** from `templates/comms-profile-ledger.md` (answers, bands, overrides, date). A re-run **appends a dated entry** — history is kept, not overwritten.
2. Write the confirmed block into the `COMMS-PROFILE` markers in `CLAUDE.md`, **replacing only what's between the markers** — never touch anything else in the file.
3. Tell the user it takes effect next session (or immediately for the live session).

### Re-run & correct (L3 — keep it alive)
- **Re-run:** invoking the skill again repeats Phases 0–4 and appends to the ledger.
- **Light correction:** when the user says "too long" / "more diagrams" / "just the answer" during normal work, nudge that single axis's band and recompile the block — a targeted edit, not a full re-run.

## Constraints
- **Calibration, not classification.** Scores are priors; samples + corrections override. No DISC / MBTI / VARK.
- **Idempotent CLAUDE.md write.** Only ever replace content *between* the `COMMS-PROFILE` markers. Never edit the rest of `CLAUDE.md`.
- **Instrument honesty.** The ★ items are **bespoke proxies** (the skill author's), honest stand-ins for a quick prior — **not** the validated scales. **Deep mode** must **fetch** the exact items from the cited open-access source (`axes.md` → "Quick vs Deep") and administer them verbatim; **never reproduce a scale from memory, never paraphrase and call it validated.** If the exact items can't be obtained, stay in Quick and make no validation claim.
- **Jargon is per-domain.** The block sets a global default; a per-area override may live in an Area's hub note (a documented extension, not auto-managed in v1).
- **Privacy.** A filled profile is personal data. The public sync must ship the **empty placeholder** block, never the user's directives — see `sync-to-public-github`.
