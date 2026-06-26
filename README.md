# 🧠 AI Second Brain — an agent-operated PKM template for Obsidian

> A self-pruning, high-signal **second brain** for **Obsidian**, operated by AI coding agents (**Claude Code** & **Codex**). Capture an idea → research it → synthesize a plan → ship actionable tasks. The vault is for *thinking*; the agents do the labor.

![Obsidian](https://img.shields.io/badge/Obsidian-vault-7c3aed)
![Claude Code](https://img.shields.io/badge/Claude%20Code-agent-da7756)
![Codex](https://img.shields.io/badge/Codex-agent-10a37f)
![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)

This repository is a **template**: clone it, open it in Obsidian, point your AI agent at it, and you have a working *knowledge operating system* — an ARA-structured vault plus a toolbelt of skills that turn raw bookmarks into strategic plans and tracked work. **No personal areas or notes are included** — you bring your own; the scaffolding and tooling are the product. The one deliberate exception is a single **worked example** — the `standup-tools` Area — shipped on purpose as an end-to-end demo of the **Productize** workflow (below).

## ✨ Why this exists

Most "second brain" setups rot: you capture endlessly and synthesize never. This template makes **AI agents do the processing** — curating captures, synthesizing drafts into plans, extracting tasks, and linting the knowledge graph — while you keep the judgment. It is **agent-augmented, not agent-led**.

- **🔁 A capture → curate → synthesize → act loop** that prunes spent material as it goes (*lite over large*).
- **🧩 A toolbelt of skills** (slash commands) that automate the boring parts.
- **🗂️ ARA structure** (Areas / Resources / Archive) with a hard wall between Work, Personal, and Resources to stop context bleed.
- **🔗 Link-first**: value lives in the `[[wikilinks]]`, surfaced on a live dashboard.
- **🗣️ Calibrated to you**: a one-time `calibrate-comms` test teaches the agents *how you want to be written to*, so output never lands as "too long" or "too terse".
- **🛡️ Security guardrails** that stop agents from reading or exfiltrating your secrets (SSH keys, `.env`, cloud credentials, shell history).
- **🤝 Dual-agent peer review**: one agent builds a tool, the other challenges and hardens it before it ships.

## 🚀 Quickstart

1. **Use this template** (or clone the repo).
2. Open the `vault/` folder in **Obsidian** and enable the bundled community plugins: **Kanban**, **Tasks**, **Mermaid Tools**, **mdmenu**.
3. Install **[Claude Code](https://claude.com/claude-code)** (and/or Codex) and open the repo as your project — the agent reads `CLAUDE.md` automatically (Codex reads it via the `AGENTS.md` symlink).
4. **Calibrate how the agents write to you:** `/calibrate-comms` — a 5-minute test so every doc afterward matches your style.
5. Create your first Area: `/init-area`.
6. Drop a link into `vault/00-inbox/`, then run `/curate-bookmarks` → `/synthesize-drafts` → `/plan-to-kanban`.

## 🔁 The Operating Loop

```mermaid
flowchart LR
    Inbox["00-inbox<br/>(raw bookmarks)"] --> Curate["curate-bookmarks"]
    Curate -->|extract signal| Draft["draft/<br/>(curated notes)"]
    Draft --> Synthesize["synthesize-drafts"]
    Synthesize -->|thematic synthesis| Plan["synthesis/<br/>(strategic plan)"]
    Plan --> Extract["plan-to-kanban"]
    Extract -->|dedupe + append| Kanban["todo-kanban.md<br/>(tasks)"]
    Kanban --> Execute["build / execute"]
    Execute --> Prune["delete spent<br/>intermediates"]
```

## 🗂️ Vault Structure (ARA)

| Folder | Purpose |
| --- | --- |
| `00-inbox/` | Raw captures, web clippings, fleeting notes — the entry point. |
| `01-work/` | Work areas of responsibility (kept strictly apart from personal). |
| `02-personal/` | Personal areas of interest and life management. |
| `03-resources/` | Reference library and topics not tied to a responsibility. |
| `04-archive/` | Inactive areas and cold storage. |
| `99-system/` | Templates, documentation, maintenance board, attachments. |
| `dashboard.md` | Live command center — pending work + browse-by-`type`, driven by the Tasks + Search plugins. |

## 🧰 The Toolbelt (Skills)

Run these as slash commands in Claude Code (or via the Skill tool); Codex invokes the same skills with `$skill`:

- **`/calibrate-comms`** — *run this first.* Profile how you want the agents to write to you — length, structure, visuals, jargon, tone — and persist those directives to `CLAUDE.md` so every agent matches your brain. Calibration, not personality typing.
- **`/init-area`** — scaffold a new Area: challenge the idea, define goals/scope, create the hub note, Kanban board, and triage queue.
- **`/curate-bookmarks`** — turn inbox captures into per-Area "what can we steal" drafts; judge each link independently; log the source.
- **`/scout-idea`** — challenge an idea's value, then run a broad discovery sweep for tools/OSS/articles when you have no bookmarks yet.
- **`/synthesize-drafts`** — analyze an Area's drafts against each other with a scientific thematic matrix and produce one strategic plan.
- **`/plan-to-kanban`** — extract the plan's action items into the Area's Kanban board, deduplicated.
- **`/productize-new` → `/productize-report`** — a six-phase product toolkit: take an Area idea from intake → PRD → market/competitive/feasibility analyses → an honest Go/No-Go → build specs + roadmap → a capstone visual HTML report. Honest-by-design (thin evidence → low confidence; a weak case earns NO-GO/PIVOT).
- **`/job-hunt-cv-from-doc` → `/job-hunt-starter`** — a personal job-hunt toolset built on [career-ops](https://github.com/santifer/career-ops) as the execution hub: turn a CV into a data spine, grow a STAR story bank, prep & drill interviews, scout companies into HTML dossiers, and track progress — the skills *feed* career-ops and *beautify* what it can't. Ships as skills + an empty scaffold; your data stays private.
- **`/vault-linter`** — read-only graph integrity check: broken `[[wikilinks]]`, orphan notes, missing traceability.
- **`/audit-maintenance`** — headless cross-agent peer review that challenges and hardens newly built tools.
- **`/security-guardrails`** — install a portable deny-list **plus** a `PreToolUse` hook that blocks shell reads of secrets, in *any* project.

## 🏭 Productize — take an Area from idea to build specs

Once an Area's thinking has matured, the **productize** toolkit runs it through a six-phase pipeline — from a one-line spark to a Go/No-Go decision and, if it survives, build-ready specs:

`productize-new` (intake → PRD) → `productize-analyze` (16 analyses) → `productize-decide` (Go/No-Go) → `productize-build` (deliverables + roadmap) → `productize-report` (capstone HTML).

It is **honest by design**: thin evidence yields low confidence, and a weak case earns a **NO-GO or PIVOT** — not a rubber stamp.

**See it run end-to-end** on a real, deliberately ordinary idea — **StandupZero** ("auto-draft each developer's daily standup from their real activity"):

- 📖 **Walkthrough:** [Productize showcase](vault/99-system/documentation/productize-showcase.md) — the StandupZero run, narrated phase by phase.
- 📂 **Every artifact:** the [`standup-tools` Area](vault/02-personal/areas/standup-tools/) — PRD, 16 analyses, Go/No-Go, 13 deliverables + roadmap, plus the visual [summary report](vault/02-personal/areas/standup-tools/standupzero/07-summary.html).
- 📘 **Reference:** [Productize documentation](vault/99-system/documentation/productize.md) — how the phases, control plan, and analysis dependency map work.

## 💼 Job Hunt — run a real search on a toolset you control

A personal **job-hunt toolset** (`job-hunt-*` skills) built on **[career-ops](https://github.com/santifer/career-ops) as the execution hub** — the model is *build the bespoke, adopt the commodity*. career-ops does the heavy engine work (scan job boards, **A–F deep-score** each role, generate the ATS CV PDF, cover letters, outreach, application tracking); the vault skills **feed** it (turn your CV into the inputs it needs) and **beautify** what it can't (a shareable HTML portfolio, company dossiers, a progress dashboard).

Everything orbits one spine — your `cv.md` — which every skill (and career-ops, via a symlink) reads:

`cv-from-doc` (CV PDF/Word → structured `cv.md`) → `craft-profile` (portfolio HTML) · `capture-story` (STAR story bank) · `interview-prep` · `mock-interview` → `careerops-profile` / `careerops-portals` (configure career-ops) → **career-ops** scan + A–F eval → `scout-company` (dossier + me-vs-the-JD matrix) → apply via career-ops → `interview-debrief` (mines new stories back into the bank). Run `job-hunt-starter` anytime for an on-disk progress dashboard that nudges you to the next step.

**Privacy by design:** unlike the StandupZero demo, this ships as **skills + an empty folder scaffold only** — your CV, stories, and dossiers live under `hunter/` and never leave your own private remote. Nothing personal is committed to this template.

- 📖 **How to run it, step by step:** [Job-Hunt toolset manual](vault/99-system/documentation/job-hunt-toolset.md) — the full journey, the vault ↔ career-ops switching points, and the flywheel that makes every interview sharpen the next.
- 📂 **The scaffold to fill:** the [`job-hunt` Area](vault/02-personal/areas/job-hunt/) — the ready-to-use structure (`hunter/`, `draft/`, `scout/`, `synthesis/`) you drop your own CV into.

## 📚 Documentation

- **[Operating System doc](vault/99-system/documentation/second-brain-operating-system.md)** — the full philosophy, the loop, peer review, and the complete skill reference.
- **[Calibrate Comms](vault/99-system/documentation/calibrate-comms.md)** — the one-time test that tunes how the agents write to you (run it first).
- **[Productize toolkit](vault/99-system/documentation/productize.md)** — the six-phase idea → build-specs pipeline, with the [StandupZero worked example](vault/99-system/documentation/productize-showcase.md).
- **[Job-Hunt toolset](vault/99-system/documentation/job-hunt-toolset.md)** — the `job-hunt-*` skills + career-ops workflow: CV spine, story bank, interview prep, company dossiers, and progress dashboard.
- **[Vault conventions](vault/99-system/documentation/conventions.md)** — frontmatter schema, tags, titles, link-before-close.
- **`CLAUDE.md`** — the master instruction set both agents follow (`AGENTS.md` is a symlink to it, so Codex reads the same rules).

## 🛡️ Security

AI agents operate inside the project directory only. The included **`security-guardrails`** skill wires up a `permissions.deny` list **and** a `PreToolUse` hook so agents can't read or exfiltrate credential stores, `.env` files, private keys, tokens, or shell history — even via a shell `cat`. Harden any repo with `/security-guardrails`.

## 🤝 Contributing

Issues and PRs welcome — especially new skills and workflow improvements. New tooling is expected to pass the dual-agent peer review described in the Operating System doc.

## 📄 License

[**CC BY-NC-SA 4.0**](https://creativecommons.org/licenses/by-nc-sa/4.0/) © 2026 Ibrahim Kobeissy. See [LICENSE](LICENSE).

You may use, adapt, and share this template for **non-commercial** purposes with attribution, and must license any derivatives under the same terms. **Commercial use requires separate permission.**

> The bundled Obsidian plugins under `vault/.obsidian/plugins/` are third-party software and remain under their own original licenses (MIT/GPL) — see the carve-out in [LICENSE](LICENSE).
