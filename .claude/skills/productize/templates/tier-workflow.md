<!-- Skeleton for a WORKFLOW-tier phase orchestrator. Lives as a SKILL at .claude/skills/productize-<cmd>/SKILL.md. -->
---
name: productize-<cmd>
description: <one line — the phase this orchestrates; name the prereq + next phase to aid triggering>.
---
# Productize · <Cmd> — Phase <n>

Orchestrates the phase end-to-end: chains Interactive + Component skills, writes artifacts, updates `productization_plan.md`. Invoked `/productize-<cmd>` (Claude) or `$productize-<cmd>` (Codex).

## Flow
1. <call Interactive skill>
2. <call Component skill(s)>
3. update `productization_plan.md`

## Guarantees
- Prereqs checked before running (see conventions → scaffold).
- Never invokes Components the user shouldn't call directly.
