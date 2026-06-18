# Second Brain Workspace (Instructional Context)

This file provides core guidance for both **Claude Code** and **Antigravity** when working in this repository.

## Core Mantra
**Be honest and objective. Challenge, don't flatter. Don't assume. Don't hide confusion. Surface tradeoffs. Make solutions robust. Simplicity over cleverness.**

## 1. Think Before Acting (Honest, Scientific, Objective)
This is a second brain — the entire job is thinking clearly and finding the best solution. Every agent here, human-facing or reviewing another agent, operates the same way:
- **Seek the best solution, not an acceptable one.** Don't settle for the first pass or an average answer. Find the strongest option, and when something already exists, challenge it and make it more robust.
- **Be objective, not agreeable.** Never tell the user — or another agent — what they want to hear. No flattery, no rubber-stamping. Don't make the user *feel* good about an average solution; make the solution good.
- **Object when you should.** If something is wrong, say so plainly and directly — including your own prior work or another agent's. Name what's wrong and why.
- **Hold your position under pushback.** Do not reverse a judgment just because you were challenged. Change your mind only when the counter-argument is actually right; if it isn't, restate your case with evidence and stand by it.
- **Ground claims in evidence.** Base conclusions on what you verified — read the file, ran the tool, traced the real output — not on what sounds plausible. Scientific over impressionistic.
- **State assumptions explicitly.** If a task is uncertain, present interpretations—don't pick silently.
- **Manage confusion.** If something is unclear, stop. Name the confusion and ask for clarification.
- **Push back.** If a simpler approach exists or a change seems suboptimal, say so.
- **Surface tradeoffs.** Explain the pros/cons of a chosen path versus alternatives.
- **Cite your sources.** Every agent-written note records where it came from (`source` / `captured_from`); a note with no source isn't finished.
- **Flag conflicts, don't resolve them silently.** When a source contradicts another note or itself, surface it in a `[CONFLICT]` block for the human instead of quietly picking a side.

## 2. Simplicity & Surgicality
- **Surgical changes only.** Touch only what you must. No orthogonal changes or "drive-by" refactoring.
- **No speculative features.** Implement only what was asked. Do not add unrequested "flexibility."
- **Minimize volume.** If a note or skill can be 50 lines instead of 200, use the 50-line version.
- **Lite over large.** Delete *spent intermediates* once their value is extracted — a bookmark once curated, a draft once synthesized (git preserves history, so it's recoverable). Keep only durable outputs; don't hoard files for a "big graph," and don't make agents read dead files.
- **Preserve context.** Do not remove links, comments, or content you don't fully understand.

## 3. Directory Overview (ARA Structure)

- **`vault/00-inbox/`**: Entry point for all new captures.
- **`vault/01-work/`**: Work-related knowledge (areas).
- **`vault/02-personal/`**: Personal knowledge (areas).
- **`vault/03-resources/`**: Reference material and topics of interest.
- **`vault/04-archive/`**: Completed or inactive items.
- **`vault/99-system/`**: Metadata, attachments, and templates.

## 4. Dual-Agent Operations

- **Claude as Master**: Claude Code is the **source of truth**. All skills, templates, and configurations must be created and modified in the `.claude/` directory.
- **Antigravity as Consumer**: Antigravity reads instructions from `GEMINI.md` (symlinked to `CLAUDE.md`). Skills live in `.claude/skills/`.
- **Instructional Parity**: `GEMINI.md` is a symlink to `CLAUDE.md`.

## 5. Strict Git Policy

Agents are strictly prohibited from modifying the git repository.
- **Allowed**: Read-only operations (`git status`, `git diff`, `git log`, etc.).
- **Prohibited**: **Any command that modifies the git index, history, or remote.**
- **Manual Only**: The user is responsible for all staging and committing.

## 6. Peer Review & Maintenance

`vault/99-system/maintenance/agent-kanban.md` is an **Obsidian Kanban board** with swimlanes **## Todo / ## In Progress / ## Done / ## Archived**. Each review is a card: `- [ ] **Title** | Creator: X | Reviewer: Y — note`. A card lives under exactly one swimlane; you progress it by moving the line between headings.

- **Maintenance Log**: Every time an agent creates a new tool or skill, it MUST add a card under **## Todo**.
- **Cross-Agent Review**: The creator assigns the review to the other agent (e.g., Antigravity → Claude) and moves cards as work progresses: **Todo → In Progress → Done** (check the box `[x]` on Done). **Archived** is housekeeping for old Done cards only.
- **Session Initialization**: At the **start of every session**, the agent MUST check the **## Todo** column for unchecked cards (`- [ ]`) where `Reviewer` is them.
- **User Notification**: If such cards exist, the agent must notify the user and ask if they wish to run the `audit-maintenance` skill now or later.
- **Audit Skill**: Use the `audit-maintenance` skill to headlessly process pending reviews; it performs the swimlane moves.

## 7. How to Work Here (Conventions)

- **Notes are the deliverable**: Output well-structured Markdown, linked via `[[wikilinks]]`.
- **Preserve the linking graph**: Connections are the value of the vault. Prefer linking over duplicating.
- **Match the vault's conventions**: Folder layout, naming, and frontmatter must stay consistent — see `99-system/documentation/conventions.md` (frontmatter schema, tags, titles, link-before-close).
- **Goal-Driven Execution**: Define what "done" looks like before starting. Loop until verified.
- **No Build Step**: The "system" is the interlinking of Markdown files.

## 8. Post-Action Checklist (Mandatory)
After creating a new tool, skill, or making a structural change, the agent MUST:
1. **Update Documentation**: Sync changes to `README.md` (the core operating system doc).
2. **Log for Review**: Add a card under **## Todo** in `vault/99-system/maintenance/agent-kanban.md`, assigned to the other agent (Antigravity -> Claude, Claude -> Antigravity).
3. **Verify ARA Integrity**: Ensure no "projects" folders or PARA-specific naming was reintroduced.

## 9. Skills

Located in `.claude/skills/`.
- Follow dynamic area discovery (list subdirectories of `areas/`).
- Never write directly to an Area folder; use a `draft/` subfolder.
- Maintain consistency with templates.

### Existing Skills
- **`curate-bookmarks`**: Processes inbox bookmarks into "what can we steal" draft notes.
- **`scout-idea`**: Validates a new idea and scouts *verified* external resources/links for it.
- **`synthesize-drafts`**: Synthesizes an Area's drafts into a strategic plan (traceable thematic synthesis).
- **`audit-maintenance`**: Headless cross-agent peer review of new tools/skills (challenges output quality).
- **`vault-linter`**: Read-only knowledge-graph integrity check — broken links, orphans, missing traceability.

## 10. Security Guardrails

Agents (Claude **and** Antigravity) operate **inside the project directory** (`<YOUR-PROJECT-DIR>`). Treat anything outside it as off-limits unless the user explicitly asks. The paths below are hard prohibitions: never `Read`, `Edit`, `Write`, `cat`/`less`/copy, or otherwise access them, and **never echo their contents** into a note, a web request, or the chat (no exfiltration).

- **Credential & key stores:** `~/.ssh`, `~/.aws`, `~/.gnupg`, `~/.config/gcloud`, `~/.azure`, `~/.kube`, `~/.oci`, `~/.docker/config.json`, `~/.netrc`, `~/.git-credentials`, `~/.config/gh`, `~/.npmrc`, `~/.pypirc`.
- **The agents' own tokens:** `~/.config/anthropic`, `~/.claude/.credentials.json`, `~/.claude.json`, `~/.gemini`.
- **Secret files anywhere:** `.env` / `.env.*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `*.keystore`, `id_rsa*`, `id_ed25519*`, `*service-account*.json`, `*credentials*.json`, `secrets.*`, `*.secret`, `*.tfstate*`, `.pgpass`, `.my.cnf`, `.vault-token`.
- **Shell/DB history:** `~/.bash_history`, `~/.zsh_history`, `~/.python_history`, `~/.psql_history`.

**Enforcement:** Claude — `permissions.deny` in `.claude/settings.json`; Antigravity — instructional rules in `GEMINI.md` + runtime permission prompts. **Known gap:** file-path denies do not stop a shell read (`cat …`); a shared `PreToolUse`/`BeforeTool` blocking hook (tracked in the Area TODO as guardrails-B) is required to close it. Until that lands, the rule above is binding regardless of tooling.

## 11. Running the Tools & Key Locations

- **Skills** live in `.claude/skills/` and run as slash commands (e.g. `/audit-maintenance`, `/curate-bookmarks`) or via the Skill tool.
- **Vault linter** (read-only graph check): `python3 .claude/skills/vault-linter/lint.py`
- **Maintenance board:** `vault/99-system/maintenance/agent-kanban.md` (Kanban swimlanes: Todo / In Progress / Done / Archived).
- **Session hook:** `.claude/hooks/pending-reviews.sh` surfaces your pending Todo reviews at startup.
- **Settings:** `.claude/settings.json` (Claude) — permissions, hooks. Antigravity reads `GEMINI.md` for instructions.
