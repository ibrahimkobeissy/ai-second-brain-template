---
name: audit-maintenance
description: >-
  Headlessly peer-review pending maintenance tasks. Challenges and hardens the
  tools other agents build — judged on output quality, not format.
---

# Audit Maintenance

A headless peer-review skill. Its job is **not** to rubber-stamp format compliance.
It is to challenge whether a new tool, skill, or structural change is the *best
solution available*, and to make it more robust. Be blunt and objective: if the
other agent built something weak, say so plainly and fail it. Don't soften findings
to be polite, and don't pass something to avoid conflict — a pass is earned, not
granted by default.

## Vault paths
- Agent Kanban: `vault/99-system/maintenance/agent-kanban.md` — an Obsidian Kanban board (`kanban-plugin: board`) with swimlanes **## Todo / ## In Progress / ## Done / ## Archived**. Each review is a card: `- [ ] **Title** | Creator: X | Reviewer: Y — note`.

## The Workflow

### 1. Identify Tasks
- Read `vault/99-system/maintenance/agent-kanban.md`.
- Pick the unchecked cards (`- [ ]`) in **## Todo** where the **Reviewer** matches the current agent (e.g., if I am Antigravity, I review cards assigned to Antigravity). Ignore cards in In Progress / Done / Archived.

### 2. Execution (Peer Review)
For each identified task:
1. **Research**: Read the files mentioned in the task description (e.g., `SKILL.md`, templates). If the skill has already produced output in the vault, read that output too — it is the real evidence.
2. **Analysis**: Format is necessary but **not** sufficient. The job is to judge whether the skill produces the *best-quality output*, so lead with substance:

   **a. Output quality (primary) — challenge the logic, adversarially:**
   - Will it actually deliver its promise? Trace the workflow on a concrete example; if output already exists, read it and judge whether it is genuinely good, not just well-formatted.
   - Does it mandate the tools it needs (e.g. real web search for a link-scouting skill; reading every source + the Area context for a synthesis skill)? Or will it silently fall back to the model's memory and fabricate / skim?
   - Is there a quality bar and a real stop condition? "Done" must mean *verified output*, not "template filled." Can the agent do the lazy minimum and still pass?
   - Name the failure mode: where will this produce a confident-but-wrong, shallow, unverifiable, or untraceable result? A skill that can't survive that question fails the review.

   **b. Structure (secondary):**
   - ARA (Areas-only) structure; writes to a sub-folder, never an Area root.
   - Correct placeholders; dynamic discovery over hardcoded paths.
   - Clarity, conciseness, and consistency with the `Global Thinking Process`.

### 3. Resolution
A review is not a gate you open or close — it is an act of making the tool better. Resolve each card by **moving it to the right swimlane** (cut the `- [ ]` line from under one `##` heading and paste it under another):
- While actively reviewing or reworking a card, move it to **## In Progress**.
- If it **passes**: check the box (`- [x]`) and move the card to **## Done**. On the card, record what you challenged and any hardening still worth doing. Never a hollow "looks good" — if you cannot point to what you stress-tested, you have not reviewed it.
- If it **fails**: move the card back to **## Todo**, leave it unchecked (`- [ ]`), and append the failure mode + the concrete improvements required to pass.
- If *you* change the tool, that change needs the **other** agent's review: add a new **## Todo** card (`Creator: <you> | Reviewer: <other agent>`). Apply surgical, unambiguous fixes directly; propose design changes for the user/creator to weigh rather than silently rewriting.
- **## Archived** is only for housekeeping old **Done** cards — never move active work there.

## Output: Report
Print a summary of the audit:
- Tasks reviewed.
- For each: outcome (Pass/Fail), the weakness found, and how it was hardened or must be.
- Fixes applied vs. improvements proposed.
