---
name: job-hunt-craft-profile
description: Turn a real CV into a "sexy", self-contained HTML portfolio profile (job-hunt/hunter/personal-profile/my-profile.html). NOT a CV writer — it ingests an existing CV, interviews the user one question at a time until it genuinely understands every line (context, impact, proof), then renders a distinctive single-page dossier that showcases the experience AND maps where each capability applies. Use when the user wants to build/refresh their personal profile, portfolio, or "my-profile" page from their CV.
---

# craft-profile — CV → portfolio dossier

Take the user's **actual CV** and turn it into `my-profile.html`: a single, self-contained, distinctive webpage that makes a recruiter *get* this person in two minutes and remembers them — and that the user can use as a positioning tool. The aesthetic is **"The Operator's Dossier"** (petrol-black + brass + ivory; Bricolage Grotesque / Hanken Grotesk / Space Mono); the proven shell is `template.html` in this skill folder.

> **This is not a CV generator.** It does not write a CV or invent achievements. It *understands* an existing CV — interrogating the user until every line is clear — and then *showcases* it honestly. The signature section is the **Deployment Map**: where each cluster of experience is the strongest evidence, and why.

## Hard rules (non-negotiable)
- **Never fabricate.** No invented metric, employer, date, title, or skill. If the CV and the interview didn't establish it, it doesn't go on the page — omit the element rather than pad the layout. Better a shorter honest profile than an impressive fictional one.
- **PII is private, not public.** The CV and generated profile hold real personal data. They live in `vault/02-personal/areas/job-hunt/hunter/personal-profile/` and are **tracked to the user's private remote** — that's intended. Two rules still hold: never send the full CV to a third-party web/external service (no exfiltration), and the public open-source sync (JH-06) must **exclude** this folder.
- **One question at a time.** During the interview, ask a single focused question and wait. Never wall-of-questions.
- **Confirm before asserting.** Positioning, the thesis, and the deployment map are interpretations — reflect them back and let the user correct before they land in the file.

## Steps

1. **Locate the CV.** Default input: `vault/02-personal/areas/job-hunt/hunter/personal-profile/cv.md` (or `.pdf`/`.txt`, or a path the user gives). If none exists, tell the user to drop their CV into that folder (it's tracked only to their private remote, never sent to an external service) and stop until it's there — don't ask them to paste a full CV into chat unless they choose to.

2. **Parse into a model.** Read the whole CV and build a structured internal understanding: roles (title, employer, dates, scope), claims, metrics, skills, projects, education. Note acronyms/tools used without context.

3. **Gap analysis.** For every item, find what a stranger couldn't understand from the CV alone:
   - responsibilities with no *outcome* ("managed X" → what changed?),
   - achievements with no number (probe for one; accept "no number" honestly),
   - tools/acronyms with no context, ambiguous scope, unexplained gaps,
   - skills with no proof, and the missing through-line between roles.

4. **Interview (the core).** Walk the gaps **one question at a time**, grouped by role/section. The goal is to be able to write each section richly *and truthfully*. Cover, at minimum:
   - **Impact** — "what measurably changed because of you?" for each role/project.
   - **Context & scope** — team size, stakes, who they worked with.
   - **Proof** — which work proves each headline skill.
   - **Thesis** — the through-line: what kind of problem is this person built to solve?
   - **Deployment** — for each capability cluster, *which role types / industries / problem-classes is it the strongest evidence for, and why?* (This feeds the signature section; it's also the most valuable output.)
   Stop when understanding is complete, not when a checklist is exhausted. Scale to the CV — a junior CV has fewer roles; don't pad.

5. **Reflect & confirm.** Summarize back: the thesis, the impact numbers you'll show, and the deployment map. Let the user correct. Only confirmed material proceeds.

6. **Generate.** Build the file (do **not** stage or commit anything — git is the user's job):
   - Copy `template.html` → `vault/02-personal/areas/job-hunt/hunter/personal-profile/my-profile.html`.
   - Fill every `{{SLOT}}` from confirmed data; clone each `<!-- REPEAT:x -->…<!-- /REPEAT:x -->` block once per item; **delete unused repeat blocks and any leftover demo ("Rivera") content**. Keep `<style>`/`<script>` intact.
   - Count-up stats: set `data-target` to the real number **and** make the span's visible text that same number (so it survives with JS off); the unit/prefix goes in a `.suf` span. The script resets to 0 and animates up on scroll.

7. **Verify.** Scan the output: no `{{` left, no `REPEAT` comments or demo persona text remaining, no number that wasn't confirmed, valid HTML. Confirm it degrades without JS (content is all in the DOM; motion is enhancement). Then tell the user the path and to open it in a browser. Note it lives in the private `hunter/personal-profile/` folder — tracked to the user's private remote, and excluded from the JH-06 public sync (never published).

## Design (already decided — don't redesign per run)
The look is fixed in `template.html` so every run is consistently strong: petrol-black base, **brass** as the single bold accent, ivory for emphasis; Bricolage Grotesque (display) / Hanken Grotesk (body) / Space Mono (field-code labels & data); animated hero field, scroll-reveal, count-up impact stats, hover lifts, slim progress bar, sticky nav; responsive to mobile; `prefers-reduced-motion` respected. Only change the design if the user explicitly asks for a different direction.

## Done when
`my-profile.html` exists in the `hunter/personal-profile/` folder, opens in a browser, renders every section with the user's **confirmed** data, contains no `{{slots}}`/demo text/fabricated numbers, degrades gracefully without JS, and the user has been told the path. Per `CLAUDE.md` §8, also log a review card for the other agent and update the operating-system doc (done when this skill was created).
