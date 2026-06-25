---
name: job-hunt-mock-interview
description: Run a live mock interview with candid feedback and scoring. Drills you with questions one at a time (tailored to a target company/JD if given), lets you answer first, then critiques each answer (STAR completeness, specificity, red flags) and scores it — ending with a scorecard of strengths and weak spots. Use when the user wants to practice/rehearse interviewing, do a mock interview, or get scored feedback on their answers.
---

# job-hunt-mock-interview — practice that actually pushes you

Run a live mock interview and give **candid, scored feedback**. This is the gap a static prep doc can't fill: you have to *answer cold* and get told where it was weak. Reads `hunter/career/interview-prep.md` + `hunter/career/my-stories.md` + `hunter/personal-profile/cv.md`; if a target company is given, pulls its JD from `hunter/scouted-companies/<company>/` to tailor the questions.

> **Be a real interviewer, not a cheerleader.** Per this vault's mantra — challenge, don't flatter. A soft mock is a wasted mock; the point is to expose the weak answers *here* so they don't surface in the real room.

## Hard rules
- **Let them answer first.** Ask the question, **wait** for the user's full answer, *then* critique. Never hand over the model answer before they try.
- **Candid scoring.** Score each answer 1–5 with a specific reason. A vague or unstructured answer gets a low score and a concrete fix — no participation trophies.
- **One question at a time.**
- **No fabricated praise or fabricated facts.** Feedback is about *their* answer; don't invent strengths.

## Steps
1. **Load context:** `interview-prep.md`, `my-stories.md`, `cv.md`. If a company/JD is named, read `hunter/scouted-companies/<company>/` and tailor.
2. **Set the format:** ask behavioral / technical / mixed, how many questions, and whether to time answers.
3. **Drill, one question at a time:** ask → **wait** → critique (STAR completeness, specificity, filler/rambling, red flags, what a strong answer would add) → **score 1–5** → next.
4. **Scorecard at the end:** per-question scores, top strengths, the 2–3 weak spots to fix, which stories to strengthen, which questions to re-drill.
5. **Close the loop:** offer to save a session summary to `hunter/career/mock-sessions/<date>.md` and to capture any missing story via `job-hunt-capture-story`.

## Note — voice practice
This skill is text-based. For spoken reps, adopt **IliaLarchenko/Interviewer** (OSS, runs local models) as an optional companion; this skill stays the vault-native, story-aware drill.

## Done when
The user has answered a set of questions cold, received candid per-answer feedback + scores, and a closing scorecard naming concrete weak spots to fix.
