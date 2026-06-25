---
name: job-hunt-starter
description: Generate a sexy starter.html dashboard that scans your job-hunt toolset state on disk and guides/nudges you through the workflow as a motivating checklist. Use when the user wants a status page, a guided overview of where they are in the job hunt, a "what do I do next" dashboard, or to see how much of the toolset they're actually using.
---

# job-hunt-starter — the command center (`starter.html`)

Scan the toolset's **real state on disk**, then render a **sexy `starter.html`** that shows the user exactly where they are and **pushes them to the next step**. HTML can't read the disk, so this skill does the checks itself and fills the template's placeholders — the page is a snapshot, regenerated on demand.

> **Tone: a coach who won't let you coast.** The whole point (the user's ask) is to *nudge*. Be honest and a little pushy — a step that's been skipped should feel uncomfortable on the page, a step done well should feel earned. Never fake a green check.

## What to check (read from disk)
- **cv.md** — `hunter/personal-profile/cv.md` present? (the spine — blocking if missing)
- **Portfolio** — `hunter/personal-profile/my-profile.html` present?
- **Story bank** — `hunter/career/my-stories.md`: present? **count entries**, **most-recent date** (stale if old → the "used rarely" nudge).
- **Interview prep** — `hunter/career/interview-prep.md` present?
- **Companies scouted** — `hunter/scouted-companies/`: **count** sub-folders; **count** `debrief.md` files (interviews debriefed).
- **career-ops hub** — ask the user for its install path (or reuse a known one), then check three things so the user knows career-ops is set up *and being used right*:
  1. **installed** — the dir exists and `cv.md` is symlinked in.
  2. **`config/profile.yml` generated & logical** — it exists **and** is filled for real: not career-ops' `Jane Smith` example, has target `archetypes`, and `candidate`/`location`/`narrative` are populated. *Missing or still the example* → wake-up (run `job-hunt-careerops-profile`). *Exists but still has critical `TODO`s* (comp, exit_story) → amber "config half-filled".
  3. **`data/applications.md` generated** — it exists (career-ops creates it once the **pipeline/eval** runs). *Missing* → wake-up: nothing has been evaluated yet, and the career-ops dashboard won't even open (`could not find applications.md`) → run `/career-ops scan` then `/career-ops pipeline`.

## Status language (honest)
- **done / fresh** → green check (teal).
- **stale / rarely used** → amber nudge ("getting dusty — feed me").
- **missing / never used** → loud rose call-to-action ("do this next — I can't help you without it"). Blocking items (no cv.md) shout loudest.

## Steps
1. **Scan** all of the above; compute a per-step status and an overall readiness %.
2. **Fill** `template.html` → `hunter/personal-profile/starter.html`: the workflow as a checklist with status chips + a one-line coach nudge per step, a stats strip (stories · companies · debriefs · last activity), the career-ops hub status, and a single **"next best action"** callout.
3. **Honesty:** every status reflects the actual disk read — never claim a step is done if the file is absent. Empty state is fine; say "not started" and point the way.
4. **Report** the path; the user opens it in a browser. Suggest re-running it whenever they want a fresh pulse.

## Output
`hunter/personal-profile/starter.html` (private — tracked to the user's private remote, excluded from the JH-06 public sync). Don't stage or commit.

## Done when
`starter.html` reflects the true on-disk state of every step, with honest status chips, and names the single next best action.
