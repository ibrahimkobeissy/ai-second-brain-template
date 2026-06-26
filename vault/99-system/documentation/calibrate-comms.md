---
title: "Calibrate Comms — How the Agents Learn to Write to You"
type: documentation
status: active
created: 2026-06-26
tags:
  - documentation
  - second-brain
---

# Calibrate Comms

> **Run this first when you set up the vault.** `/calibrate-comms` teaches every agent how *you* want to be written to — so everything you read afterward stops landing as "too long", "too terse", or "WTF does this mean".

## What it is
A short, re-runnable interview that profiles your communication preferences and writes them as plain directives into the `COMMS-PROFILE` block in `CLAUDE.md` §12 — where Claude **and** Codex read them every session. One calibration → every doc, synthesis, scout, and answer afterward is shaped to your brain.

## Why it exists
The user↔agent channel loses signal both ways: you may brief the agent with too little context (it guesses) or too much at once (it tangles subjects), and the agent may write back too densely, too sparsely, or in the wrong form (prose when you wanted a diagram). Rather than re-explaining your style every session, you calibrate once and persist it.

## How it works — three layers
```
 L1  PRIOR      a few quick questions, each seeded by a validated psychometric → a first guess
 L2  CALIBRATE  you pick which of two real samples "lands" → revealed preference overrides the guess
 L3  CORRECT    during real work, "too long" / "more diagrams" nudges the profile and keeps it current
        ▼ all three compile to ▼
 plain writing directives in CLAUDE.md §12 that every agent obeys
```

## The nine axes
Six about how the agent writes back — **density** (length), **sequence** (chronological vs answer-first), **modality** (prose vs diagrams), **abstraction** (example-first vs principle-first), **tradeoff** (one answer vs the menu of options), **detail** (gist vs exhaustive) — plus **jargon** (define terms vs assume expertise; *per-domain*), **tone** (casual vs formal), and one about how *you* brief the agent — **context-giving** (so it knows when to extract from you vs split your message into subjects).

## Quick vs Deep
- **Quick** (default, ~5 min): one fast question per axis + the sample picks. Enough for a solid profile.
- **Deep**: administers the *actual* validated instruments (Need for Cognition, TIPI, Maximization, …) by fetching their exact items first. Use only if you want investment-grade precision.

## Where your profile lives
- **The directives** agents obey: the `COMMS-PROFILE` block in `CLAUDE.md` §12 (empty until you run it).
- **The full record** (answers, history, re-runs): `vault/99-system/communication-profile/<user>.md`.

## Calibration, not classification
This is **not** a personality test. The psychometrics only seed a *prior* — your sample picks and live corrections override them. There is deliberately **no** DISC / MBTI / "learning-styles" typing here: matching content to a fixed "type" has no reliable evidence, so we calibrate to your behaviour instead. Background: [[communication-calibration-instruments-landscape]] · design: [[communication-calibration-design]].

## Privacy
A *filled* profile is personal data — it describes you. It stays in your private vault and is **not** meant for the public template (the published repo ships the empty placeholder block). Keep it out of anything you publish.

## Run it
Type `/calibrate-comms` (or ask the agent to "calibrate how you write to me"). Re-run it anytime your preferences shift; each run appends to the ledger so you keep the history.
