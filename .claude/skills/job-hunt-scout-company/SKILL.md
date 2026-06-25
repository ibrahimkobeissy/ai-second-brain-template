---
name: job-hunt-scout-company
description: Scout a specific company you're interviewing with — research it everywhere (site, news, Glassdoor/Blind reviews, levels.fyi), score your fit against the job description, and produce a sexy HTML dossier + a me-vs-company markdown. Use when the user is preparing for a specific company/role, wants to research a company before an interview, score themselves against a job, or build a company dossier.
---

# job-hunt-scout-company — the company dossier (Section 2)

Given a company you're interviewing with, produce a **sexy HTML dossier** + `me-vs-<company>.md` under `hunter/scouted-companies/<company>/`. This is the **delta over career-ops `deep`**: career-ops already does candidate-framed company research, so this skill adds what it doesn't — the **employee voice** (Glassdoor/Blind), the **me-vs-the-JD match matrix**, and a **gorgeous, shareable dossier** you actually read before the interview. Reuses the `job-hunt-craft-profile` "Operator's Dossier" aesthetic (`template.html`).

## Hard rules
- **Cite everything.** Every claim about the company traces to a source (link it). Mark anything unverified as such — never present rumor or a guess as fact.
- **No fabricated fit.** The me-vs matrix maps real JD requirements to real evidence from `cv.md`/`my-stories.md`. A gap is a gap — say so; that's what you prep for. Don't inflate the grade to feel good.
- **Disambiguate the company.** Given a name (not a URL), confirm the exact entity before researching (ask which one — wrong-company research is worse than none).
- **Private output** (`hunter/scouted-companies/`, tracked to the private remote, excluded from JH-06 public sync). Don't stage/commit; don't auto-submit anything.

## Steps
1. **Identify the company.** URL → certain. Name → ask until you're sure which entity. Kebab-case the folder: `hunter/scouted-companies/<company>/`.
2. **Get the JD + role.** Ask for the job description (paste or URL) and the role being applied for.
3. **Research everywhere, cite each:** official site/careers, recent news (funding, launches, layoffs), **employee voice** (Glassdoor/Blind themes + ratings), comp (levels.fyi), product & competitors. Steal the PM company-research discipline — prefer *dated primary sources*, reject PR fluff; flag thin spots as "to verify".
4. **Score fit.** Read `cv.md` + `my-stories.md` against the JD → an honest **A–F-style fit grade** (you may hand CV+JD to career-ops' eval for the score; the dossier renders the reasoning). Build the **me-vs matrix**: each JD requirement → your evidence → `strong` / `partial` / `gap`.
5. **Write outputs** to `hunter/scouted-companies/<company>/`:
   - `me-vs-<company>.md` — the match matrix + strong points + weak points + the grade, in Markdown.
   - `dossier.html` — copy `template.html`, fill the 9 sections, leave no `{{slots}}`.
6. **Verify & report:** sources present, no placeholders, grade + gaps honest. Point to the dossier; mention `job-hunt-interview-debrief` for after the interview.

## Dossier sections (fixed — match `template.html`)
1. **Verdict hero** — company · one-line "what they do" · **fit-grade badge**.
2. **The company** — what they sell, model, size/stage, recent moves (dated).
3. **Voice of the employees** — Glassdoor/Blind themes: culture, pay signal, red flags, ratings (quoted, sourced; "what to verify" on thin spots).
4. **The role** — JD digest: must-haves, nice-to-haves, the real job behind the buzzwords.
5. **Me vs. them** — match matrix: requirement → your evidence → strong / partial / gap.
6. **Strong points to lead with** — your 3–5 best-fit stories for this role.
7. **Weak points & how to defend** — the gaps they'll probe + your honest framing.
8. **Questions to ask them** — sharp, company-specific.
9. **Provenance** — every source linked.

## Done when
`hunter/scouted-companies/<company>/` holds a sourced `dossier.html` (all 9 sections, no placeholders) + `me-vs-<company>.md`, with an honest fit grade and a real gap list.
