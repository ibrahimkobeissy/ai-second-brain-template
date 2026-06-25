---
name: job-hunt-cv-from-doc
description: Turn an existing CV (a PDF or Word doc) into a structured `cv.md` — the single source of truth the job-hunt toolset reads. Reads the document, extracts it into JSON-Resume sections as clean Markdown, asks the user to resolve anything ambiguous, and never invents content. Use when the user wants to create/import/structure their CV, build cv.md from a resume PDF/Word file, or set up the job-hunt "spine". Writes job-hunt/hunter/personal-profile/cv.md.
---

# job-hunt-cv-from-doc — CV document → structured `cv.md`

Turn the user's **real CV** (PDF or Word) into `vault/02-personal/areas/job-hunt/hunter/personal-profile/cv.md`: one clean Markdown file, organized along the **JSON-Resume sections** (contact · summary · experience · skills · education · projects · certifications). This is the **spine** every other skill — `job-hunt-craft-profile`, `job-hunt-scout-company` — and **career-ops** reads. Get this right and the rest compose; get it wrong and they all inherit the error.

> **This is structuring, not writing.** You are transcribing an existing CV into a consistent shape. You do not improve, embellish, or invent — a CV with a fabricated line is worse than useless, it's dangerous in an interview.

## Hard rules (non-negotiable)
- **Never fabricate.** Every line traces to the source document or to an answer the user gave. No invented dates, titles, employers, metrics, or skills. If the source doesn't say it, leave it out — or ask.
- **Don't embellish.** Keep the user's real numbers and scope; don't round up, don't add adjectives they didn't earn. Preserve their wording where it matters.
- **Ask, don't guess.** When something is ambiguous (overlapping dates, an unexplained acronym, a gap, an unclear title), ask **one question at a time** and wait.
- **PII is private.** `cv.md` holds real personal data; it lives in `hunter/personal-profile/` (tracked to the user's private remote, excluded from the JH-06 public sync). Never send the full CV to a third-party web service. Don't stage or commit — git is the user's job.

## Steps

1. **Locate the source.** Look in `vault/02-personal/areas/job-hunt/hunter/personal-profile/` for a `.pdf` (or a path the user gives). If none, ask the user to drop their CV there and stop until it's present — don't ask them to paste the whole CV into chat.

2. **Read it — handle the format:**
   - **PDF** → read it directly (native capability; no tooling needed).
   - **`.docx` / `.doc`** → not directly readable. Convert first, trying in order: `libreoffice --headless --convert-to pdf <file>` (then read the PDF), or `pandoc <file> -t markdown`. If neither tool is available, ask the user to **export to PDF** and restart. Never guess a Word file's contents.

3. **Extract into the model.** Pull the CV into the JSON-Resume sections: **basics** (name, headline/label, email, phone, location, links, languages), **summary**, **experience[]** (title, employer, dates, location, bullets, stack), **skills[]** (grouped), **education[]**, **projects[]**, **certifications[]**. Note anything missing or unclear.

4. **Resolve ambiguity (one question at a time).** Walk the unclear items — date overlaps, acronyms/tools without context, a title that doesn't match the work described, unquantified claims you suspect have a number, employment gaps. Ask, wait, incorporate. Stop when the model is faithful and complete; **don't pad** thin sections.

5. **Write `cv.md`.** Copy `template.md` → `hunter/personal-profile/cv.md` and fill every section from the model. Clean Markdown, consistent headings, newest-first experience. **Delete sections the source genuinely doesn't have** (e.g. no projects) rather than leaving empty placeholders. Keep the provenance comment at the top (source file + date).

6. **Hand off to career-ops.** career-ops reads `cv.md` from **its own repo directory** (it runs outside the vault). Tell the user to point it at this file with a one-line symlink or copy, e.g. `ln -s <vault>/hunter/personal-profile/cv.md <career-ops>/cv.md`, so there's a **single source**, not two diverging CVs.

7. **Verify & report.** Confirm: no `{{placeholders}}` remain, every populated section traces to the source/answers, nothing invented. Tell the user the path, that `job-hunt-craft-profile` / `job-hunt-scout-company` / career-ops all read it, and the hand-off step.

## Schema note
One **Markdown** `cv.md` along JSON-Resume sections — deliberately **not** a separate `resume.json`. An LLM reads structured Markdown reliably for the downstream skills; a second format would be overbuild. The shape is fixed in `template.md`.

## Done when
`hunter/personal-profile/cv.md` exists, is faithful Markdown across the JSON-Resume sections, carries **no** placeholders or invented content, traces to the source document (+ the user's answers), and the user has the career-ops hand-off step. Per `CLAUDE.md` §8, this skill's creation is logged for cross-agent review and synced to the operating-system doc.
