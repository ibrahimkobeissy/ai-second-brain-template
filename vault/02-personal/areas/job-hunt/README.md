# Job Hunt — a career-ops toolset

A personal job-hunt toolset built as Claude/Codex skills (`job-hunt-*`) on top of **[career-ops](https://github.com/santifer/career-ops)** as the execution hub.

**The model:** *build the bespoke, adopt the commodity.* career-ops does the heavy lifting — deep evaluation, ATS CV PDF, cover letters, company research, outreach, scanning, application tracking. The `job-hunt-*` skills **feed** it (produce its inputs) and **beautify** what it can't (gorgeous shareable HTML).

## The skills
- `job-hunt-cv-from-doc` — a CV (PDF/Word) → a structured `cv.md` (the spine everything reads).
- `job-hunt-craft-profile` — `cv.md` → a distinctive HTML portfolio.
- `job-hunt-capture-story` — a STAR story diary you grow over time.
- `job-hunt-interview-prep` — story-backed answers to the common questions.
- `job-hunt-mock-interview` — a live, scored mock-interview drill.
- `job-hunt-scout-company` — a company dossier (HTML) + a me-vs-the-job match matrix.
- `job-hunt-interview-debrief` — a post-interview retro that feeds the story bank.
- `job-hunt-starter` — a `starter.html` dashboard that scans your progress and nudges you.

## The Area (this folder)
- **`job-hunt.md`** — the Area hub (MOC); start here.
- **`todo-kanban.md`** — the task board · **`to-check.md`** — the triage queue.
- **`draft/` · `scout/` · `synthesis/`** — the thinking layer (research → discovery → strategy).
- **`hunter/`** — your operational data (fill locally, keep private):
  - `personal-profile/` — your CV + generated portfolio.
  - `career/` — your story bank + interview prep.
  - `scouted-companies/` — one folder per company you scout, with its dossier + debriefs.

Full usage guide: **`vault/99-system/documentation/job-hunt-toolset.md`**.

> **Privacy:** everything under `hunter/` holds real personal data. In your own copy, keep it in a **private** remote. This public template ships only the empty structure + these READMEs — never anyone's CV, stories, or company notes.
