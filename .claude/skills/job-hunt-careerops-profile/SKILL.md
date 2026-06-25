---
name: job-hunt-careerops-profile
description: Generate career-ops' user config — config/profile.yml (+ its companion modes/_profile.md) — from your cv.md. Auto-fills identity/narrative/proof-points from the CV, interviews you for the rest (target archetypes, comp, exit story, notice), and never fabricates the personal bits. Use when setting up or refreshing career-ops, bridging your CV into career-ops, or generating/updating career-ops profile.yml.
---

# job-hunt-careerops-profile — bridge `cv.md` → career-ops config

career-ops needs two "your identity" files that aren't obvious to fill by hand: **`config/profile.yml`** (identity, target roles, comp) and **`modes/_profile.md`** (archetypes, adaptive framing, negotiation, location policy). This skill generates both from your `cv.md` + a short interview, so career-ops scores and tailors against the real you. It writes into **your career-ops install** (outside the vault) — the user names the path.

## Hard rules (non-negotiable)
- **Never fabricate the personal bits.** Compensation, exit story, and notice period are yours — ask, or leave a clear `TODO` placeholder. Proof points use **real** `cv.md` facts; keep the CV's real numbers and invent none.
- **career-ops lives outside the vault.** Ask the user for their career-ops directory and confirm it's a real install (it has `config/profile.example.yml`). Write there only with the user's OK — this is outside the project dir.
- **Don't clobber.** If `config/profile.yml` already exists, show what would change and confirm (or back it up `*.bak`) before overwriting.
- **Match career-ops' schema, don't hardcode it.** Read career-ops' own `config/profile.example.yml` and `modes/_profile.template.md` as the canonical shapes and fill those, so this stays in sync with career-ops' version.

## Steps
1. **Inputs.** Read `vault/02-personal/areas/job-hunt/hunter/personal-profile/cv.md` (or a given path). Ask for the **career-ops install path**; verify `config/profile.example.yml` exists there. If `cv.md` is missing, run `job-hunt-cv-from-doc` first.
2. **Auto-extract from `cv.md`:** name, email, phone, location, links, languages, work authorization; a one-line headline; 3–5 superpowers (from the skills/experience); proof points (real achievements — keep the CV's numbers, invent none); the primary domain.
3. **Interview for what the CV can't give** — one question at a time:
   - **Target archetypes** + fit (`primary` / `secondary` / `adjacent`) — what roles are you optimizing for?
   - **Target market / location flexibility.**
   - **Compensation** — target range, walk-away, currency. *(Sensitive: the user may give real numbers or ask to leave `TODO`.)*
   - **Exit story** (why now) and **notice period.** *(Optional → `TODO` if skipped.)*
4. **Write `config/profile.yml`** by filling career-ops' example shape with the auto + interviewed fields; leave explicit `TODO` placeholders for anything declined (never a guessed comp/exit).
5. **Write `modes/_profile.md`** from career-ops' template: the archetype table, adaptive framing (archetype → what to emphasize → `cv.md`), negotiation scripts, and location policy — all derived from the same archetypes + `cv.md`.
6. **Verify & report.** Run career-ops' `node doctor.mjs` from its dir; confirm `config/profile.yml` + `modes/_profile.md` are now found. Report what's filled vs. left as `TODO`, and remind the user that **`portals.yml`** (target companies) is a separate curation step.

## Done when
career-ops' `config/profile.yml` and `modes/_profile.md` exist, filled from the real `cv.md` + the user's answers (no fabricated comp / exit / metrics), `doctor` recognizes them, and the user knows which `TODO`s remain. Per `CLAUDE.md` §8, logged for cross-agent review and synced to the operating-system doc.
