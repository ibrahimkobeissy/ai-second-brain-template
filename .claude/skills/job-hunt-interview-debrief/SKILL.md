---
name: job-hunt-interview-debrief
description: Post-interview retro — capture how a real interview went and what to learn, into the scouted company's folder, and feed strong moments back into your story bank. Use after an interview to debrief, record what was asked, capture learnings, log how it went, or note what to do better next time.
---

# job-hunt-interview-debrief — learn from every interview

After a real interview, capture **how it went and what to learn** before the memory fades. Writes a dated debrief into `hunter/scouted-companies/<company>/debrief.md` (the company you scouted with `job-hunt-scout-company`), and **actively mines the debrief for reusable stories** — routing every story-worthy moment into the bank via `job-hunt-capture-story` — closing the continuous-improvement loop. (The debrief never writes to `my-stories.md` itself; `job-hunt-capture-story` owns the STAR format and the bank, so there's one source of truth.)

## Hard rules
- **Capture failures honestly.** The flubbed answer and the question you didn't see coming are the most valuable things here — don't sugarcoat them.
- **Only what happened.** Record the real exchange; don't reconstruct a flattering version.
- **One question at a time.**
- **Private output** (`hunter/scouted-companies/`, tracked to the private remote, excluded from JH-06 public sync). Don't stage or commit.

## Steps
1. **Identify the company.** Match an existing `hunter/scouted-companies/<company>/` folder; if none, ask (ideally the company was scouted first via `job-hunt-scout-company`) and create the folder.
2. **Debrief, one question at a time:** which round/stage · who you met · the questions asked · what landed · what flopped · any surprises · your read on it · the next step · your verdict/confidence.
3. **Write** a dated entry appended to `hunter/scouted-companies/<company>/debrief.md`.
4. **Mine for stories (proactive).** Scan the debrief for anything reusable later — a question you answered well, a hard moment you handled, a lesson worth keeping. **Name each candidate explicitly** ("This sounds like a good story — want to bank it?") and, for each one the user confirms, **run it through `job-hunt-capture-story`** so it lands as a proper STAR entry. Don't just mention the option once; surface every candidate.
5. **Surface a learning:** end with the one concrete thing to do differently next time (and which `interview-prep.md` answer to strengthen).

## Done when
A dated, honest debrief exists for the interview, with concrete learnings, and any strong moments have been offered to the story bank.
