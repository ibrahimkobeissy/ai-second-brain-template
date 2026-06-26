# Second Brain Workspace (Instructional Context)

This file provides core guidance for both **Claude Code** and **Codex** when working in this repository.

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

- **Claude as Master**: Claude Code is the **source of truth**. All skills, slash commands, templates, hooks, and configurations are created and modified in the `.claude/` directory.
- **Codex as Secondary Agent**: Codex is the active secondary reviewer/operator. It reads instructions from `AGENTS.md` (symlinked to `CLAUDE.md`) and uses `.claude/` as the master toolset.
- **Codex Tool Discipline**: The canonical skills are exposed to Codex at its documented repo skills path via `.agents/skills` → `../.claude/skills` (one source, no duplication). Codex runs a skill by reading its `SKILL.md` and following it (invoked as `$skill-name`). Do not add `.codex/agents` or `.codex/config.toml` as load-bearing adapters unless their load path has been verified.
- **Instructional Parity**: `AGENTS.md` is a symlink to `CLAUDE.md`.

## 5. Strict Git Policy

Agents are strictly prohibited from modifying the git repository.
- **Allowed**: Read-only operations (`git status`, `git diff`, `git log`, etc.).
- **Prohibited**: **Any command that modifies the git index, history, or remote.**
- **Manual Only**: The user is responsible for all staging and committing.

## 6. Peer Review & Maintenance

`vault/99-system/maintenance/agent-kanban.md` is an **Obsidian Kanban board** with swimlanes **## Todo / ## In Progress / ## Done / ## Archived**. Each review is a card: `- [ ] **Title** | Creator: X | Reviewer: Y — note`. A card lives under exactly one swimlane; you progress it by moving the line between headings.

- **Maintenance Log**: Every time an agent creates a new tool or skill, it MUST add a card under **## Todo**.
- **Cross-Agent Review**: The creator assigns the review to the other agent (Claude → Codex, Codex → Claude) and moves cards as work progresses: **Todo → In Progress → Done** (check the box `[x]` on Done). **Archived** is housekeeping for old Done cards only.
- **Session Initialization**: At the **start of every session**, the agent MUST check the **## Todo** column for unchecked cards (`- [ ]`) where `Reviewer` is them. Claude gets this through its `SessionStart` hook; Codex must run `bash .claude/hooks/pending-reviews.sh Codex` explicitly because it does not run Claude's hook.
- **User Notification**: If such cards exist, the agent must notify the user and ask if they wish to run the `audit-maintenance` skill now or later.
- **Audit Skill**: Use the `audit-maintenance` skill to headlessly process pending reviews; it performs the swimlane moves.

## 7. How to Work Here (Conventions)

- **Notes are the deliverable**: Output well-structured Markdown, linked via `[[wikilinks]]`.
- **Never hard-wrap prose**: Write each paragraph as **one continuous line** — no manual newlines mid-paragraph. Separate blocks with a single blank line only. (Obsidian runs with *Readable line length* off and must stay that way; hard wraps freeze text at ~80 cols in Live Preview instead of flowing to the window width.) Hard line breaks are allowed **only** where Markdown needs them: between list items, table rows, and inside fenced code blocks. This applies to every `.md` file an agent writes or edits.
- **Preserve the linking graph**: Connections are the value of the vault. Prefer linking over duplicating.
- **Match the vault's conventions**: Folder layout, naming, and frontmatter must stay consistent — see `99-system/documentation/conventions.md` (frontmatter schema, tags, titles, link-before-close).
- **Goal-Driven Execution**: Define what "done" looks like before starting. Loop until verified.
- **No Build Step**: The "system" is the interlinking of Markdown files.
- **Design here, build elsewhere**: The vault is a whiteboard for thinking — capturing, researching, architecting, and planning. It is **not** where applications get built. An Area matures a design until it's solid; the actual tool/app is then built in a **separate project outside the vault**. Keep source code and real/sensitive operational data (e.g. bank statements, credentials) out of the vault entirely. This holds for every Area, not just one.

## 8. Post-Action Checklist (Mandatory)
After creating a new tool, skill, or making a structural change, the agent MUST:
1. **Update Documentation**: Sync changes to `README.md` (the core operating system doc).
2. **Log for Review**: Add a card under **## Todo** in `vault/99-system/maintenance/agent-kanban.md`, assigned to the other agent (Claude -> Codex, Codex -> Claude).
3. **Verify ARA Integrity**: Ensure no "projects" folders or PARA-specific naming was reintroduced.

## 9. Skills

Located in `.claude/skills/`.
- Follow dynamic area discovery (list subdirectories of `areas/`).
- **Area write rule:** curation/research skills (`curate-bookmarks`, `scout-idea`, `synthesize-drafts`) never write into an Area's core — they write only to its `draft/`, `scout/`, or `synthesis/` subfolders. **Exception:** the `productize-*` skills may create and write a product subfolder `areas/<area>/<product>/` directly, but only after an explicit `productize-new` invocation (which scaffolds the folder and confirms with the user). System tooling writes only under `.claude/` and `vault/99-system/`.
- Maintain consistency with templates.

### Existing Skills
- **`curate-bookmarks`**: Processes inbox bookmarks into "what can we steal" draft notes.
- **`scout-idea`**: Validates a new idea and scouts *verified* external resources/links for it.
- **`synthesize-drafts`**: Synthesizes an Area's drafts into a strategic plan (traceable thematic synthesis).
- **`audit-maintenance`**: Headless cross-agent peer review of new tools/skills (challenges output quality).
- **`vault-linter`**: Read-only knowledge-graph integrity check — broken links, orphans, missing traceability.
- **`productize-*`**: Six phase orchestrator skills (`productize-new`/`-analyze`/`-decide`/`-build`/`-report`/`-plan`) taking an Area idea through intake → PRD → analysis → Go/No-Go → build specs → capstone report, plus three component skills they invoke (`productize-intake`, `productize-prd`, `productize-analysis-slip`) and `productize-linter`. User docs live at `vault/99-system/documentation/productize.md`; shared developer assets (catalogs, templates, methods, `conventions.md`) live in `.claude/skills/productize/`.
- **`job-hunt-*`**: A personal job-hunt toolset for the `02-personal/areas/job-hunt` Area, built on **[career-ops](https://github.com/santifer/career-ops) as the execution hub** — the `job-hunt-*` skills *feed* it (produce its inputs) and *beautify* what it can't. `job-hunt-cv-from-doc` (CV → `cv.md` spine) · `-careerops-profile` / `-careerops-portals` (generate career-ops' `profile.yml` / `portals.yml`) · `-craft-profile` (CV → portfolio HTML) · `-capture-story` (STAR story diary) · `-interview-prep` (story-backed Q&A) · `-mock-interview` (scored drill) · `-scout-company` (company dossier HTML + me-vs matrix) · `-interview-debrief` (post-interview retro) · `-starter` (`starter.html` progress dashboard). The personal outputs (CV, stories, dossiers under `hunter/`) are private data that stays in your own vault — this template ships the **skills + an empty folder scaffold only**. User manual: `vault/99-system/documentation/job-hunt-toolset.md`.
- **`calibrate-comms`**: Profiles how the user wants agents to write across nine communication axes, validates those preferences with sample-reaction tests, and compiles them into the `COMMS-PROFILE` block in §12. Re-runnable; calibration, not classification. Ledger: `vault/99-system/communication-profile/<user>.md`.

## 10. Security Guardrails

Agents (Claude **and** Codex) operate **inside the project directory** (`<YOUR-PROJECT-DIR>`). Treat anything outside it as off-limits unless the user explicitly asks. The paths below are hard prohibitions: never `Read`, `Edit`, `Write`, `cat`/`less`/copy, or otherwise access them, and **never echo their contents** into a note, a web request, or the chat (no exfiltration).

- **Credential & key stores:** `~/.ssh`, `~/.aws`, `~/.gnupg`, `~/.config/gcloud`, `~/.azure`, `~/.kube`, `~/.oci`, `~/.docker/config.json`, `~/.netrc`, `~/.git-credentials`, `~/.config/gh`, `~/.npmrc`, `~/.pypirc`.
- **The agents' own tokens:** `~/.config/anthropic`, `~/.claude/.credentials.json`, `~/.claude.json`, `~/.codex`, `~/.gemini`.
- **Secret files anywhere:** `.env` / `.env.*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `*.keystore`, `id_rsa*`, `id_ed25519*`, `*service-account*.json`, `*credentials*.json`, `secrets.*`, `*.secret`, `*.tfstate*`, `.pgpass`, `.my.cnf`, `.vault-token`.
- **Shell/DB history:** `~/.bash_history`, `~/.zsh_history`, `~/.python_history`, `~/.psql_history`.

**Enforcement:** Claude — `permissions.deny` plus the `PreToolUse` shell-read hook in `.claude/settings.json`; Codex — `AGENTS.md` instructions, Codex's native sandbox/approval model, and the project execpolicy at `.codex/rules/default.rules`. The Claude hook blocks obvious shell reads (`cat ~/.ssh/id_rsa`, `grep .env`, etc.) that path denies alone miss, after the session is restarted so hooks reload. Codex git-mutation guardrails live in the single canonical file `.codex/rules/default.rules`; explicit `codex execpolicy check --rules ...` tests validate the permanent rules, and a nested `codex exec -C <repo> --sandbox read-only` probe proved it auto-loads in this repo.

## 11. Running the Tools & Key Locations

- **Skills** live in `.claude/skills/`. Claude can run them as slash commands (e.g. `/audit-maintenance`, `/curate-bookmarks`) or via the Skill tool; Codex reads the relevant `SKILL.md` and executes the workflow from the file.
- **Vault linter** (read-only graph check): `python3 .claude/skills/vault-linter/lint.py`
- **Productize linter** (read-only toolkit/product check): `python3 .claude/skills/productize-linter/productize_lint.py [product-folder]`
- **Maintenance board:** `vault/99-system/maintenance/agent-kanban.md` (Kanban swimlanes: Todo / In Progress / Done / Archived).
- **Session hook:** `.claude/hooks/pending-reviews.sh` surfaces Claude's pending Todo reviews at startup. Codex startup check: `bash .claude/hooks/pending-reviews.sh Codex`.
- **Codex review commands:** `codex review --uncommitted` for local changes; use `codex exec --sandbox read-only ...` for read-only reviewer drills.
- **Settings:** `.claude/settings.json` (Claude) — permissions, hooks. Codex reads `AGENTS.md` for project instructions and `.codex/rules/default.rules` for verified project execpolicy. No repo-local Codex hooks/config are load-bearing.

## 12. Communication Profile (How to Write to This User)

How this user wants agents to write is calibrated by the `calibrate-comms` skill and persisted in the delimited block below, which loads every session and binds Claude and Codex. Until the user runs `/calibrate-comms`, the block stays empty and agents use sensible defaults. This block is personal data: public copies of the template must ship the empty placeholder, never a filled profile. Only `calibrate-comms` (or the user) edits content between the markers.

<!-- COMMS-PROFILE:START -->
<!-- COMMS-PROFILE:END -->
