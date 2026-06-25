---
name: job-hunt-interview-prep
description: Build your general interview-prep doc — walk the top known interview questions (HR/behavioral, technical, management), co-write answers drawn from your story bank, and save to hunter/career/interview-prep.md. Flags questions you have no story for yet (don't fabricate). Use when the user wants to prepare for interviews generally, write/rehearse answers to common questions, or build their Q&A prep.
---

# job-hunt-interview-prep — answers to the questions you'll actually get

Walk the **canonical interview questions** (HR/behavioral, technical, management) and co-write **your** answers, drawn from your real story bank — output to `hunter/career/interview-prep.md`. This is the *general* prep (not company-specific — that's `job-hunt-scout-company`). Answers come from `hunter/career/my-stories.md`; where there's no story for a question, **flag the gap** instead of inventing one.

## Hard rules
- **Answers trace to real stories.** Pull from `my-stories.md`; never fabricate an achievement to answer a question.
- **Flag gaps, don't fill them.** A question with no backing story → mark it and suggest running `job-hunt-capture-story`.
- **One question at a time** when co-writing.
- **Private output** (`hunter/career/`, tracked to the private remote, excluded from JH-06 public sync). Don't stage or commit.

## Steps
1. **Read context:** `hunter/personal-profile/cv.md` + `hunter/career/my-stories.md`.
2. **Adapt the bank:** use the canonical question set in `template.md`; tailor the **technical** block to the domain in `cv.md` (don't ask backend questions of a designer).
3. **Per question:** find the best-fit story → draft a concise answer **co-written with the user** (propose, ask, refine). For behavioral, keep STAR shape. Record **which story** each answer draws on.
4. **Gaps:** list questions with no backing story; suggest capturing them via `job-hunt-capture-story`.
5. **Write** `hunter/career/interview-prep.md` from `template.md`: each Q → your answer → source story (→ STAR for behavioral). Re-running updates it, doesn't duplicate.

## Done when
`hunter/career/interview-prep.md` has a real, story-backed answer per answered question, gaps flagged honestly, nothing invented.
