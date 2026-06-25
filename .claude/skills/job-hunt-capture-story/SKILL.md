---
name: job-hunt-capture-story
description: Capture one real work story / challenge / win as a STAR entry in your career diary. Interviews you to flesh out Situation-Task-Action-Result, classifies it (technical / human / management) and tags it, then appends to hunter/career/my-stories.md — the bank that feeds interview prep, mock drills, and company fit. Use when the user wants to log a work story, record something that happened at work, capture a win/challenge/conflict/failure for later interview use, or "add to my stories".
---

# job-hunt-capture-story — your work-story diary (STAR bank)

Capture ONE real thing that happened at work — a win, a challenge, a conflict, a failure, a project you're proud of — as a structured **STAR** entry in `hunter/career/my-stories.md`. Over time this bank becomes the raw material for `job-hunt-interview-prep`, `job-hunt-mock-interview`, and `job-hunt-scout-company`. This **is** the "continuous improvement from daily stories" loop: the more you feed it, the sharper every downstream answer gets.

## Hard rules
- **Only what actually happened.** No embellishment, no invented metrics. The story is evidence you'll defend in an interview — keep it true.
- **One question at a time.** Never a wall of questions.
- **The Result is the point.** Push for the real number/outcome; accept "no number" honestly rather than inventing one.
- **Private output.** `hunter/career/my-stories.md` is tracked to the user's private remote, excluded from the JH-06 public sync. Don't stage or commit.

## Steps
1. **Seed.** Invoke with a one-line story, or ask "what happened?"
2. **Interview to STAR**, one question at a time: **Situation** (context + stakes) → **Task** (your responsibility) → **Action** (what *you* specifically did, not "the team") → **Result** (outcome, quantified if possible, + what you learned).
3. **Classify:** `technical` / `human` / `management` (one or more), plus theme tags (leadership, conflict, failure, ambiguity, proud-project, cross-team, …) for later retrieval.
4. **Note "good for":** which interview questions this story is ammo for (e.g. "biggest challenge", "conflict with a manager", "proudest achievement").
5. **Append** a dated entry to `hunter/career/my-stories.md` (create from `template.md` if absent). If a near-duplicate exists, offer to **update** it instead of adding a second.
6. **Confirm** the entry back; if an obvious category is thin (e.g. no failure stories), suggest capturing one next.

## Done when
A dated, classified, STAR-structured, tagged entry is appended, faithful to what the user told you, with no invented detail.
