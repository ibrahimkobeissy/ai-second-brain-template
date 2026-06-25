---
name: job-hunt-careerops-portals
description: Customize career-ops' portals.yml (the scan targets) by interviewing you. Reads career-ops' portals.example.yml as the schema, asks the right questions (target role titles, geography, salary floor, stack, and which companies to track), researches each company's careers page + ATS, and writes a portals.yml tuned to you. Use when setting up or refining career-ops scanning, curating target companies, or fixing the default (US/AI-lab) portal list.
---

# job-hunt-careerops-portals — tune career-ops' scan targets

career-ops ships a huge `templates/portals.example.yml` (1000+ lines) tuned to **US AI labs** — and it even **blocks France** by default. Useless for most people as-is. This skill interviews you and writes a `portals.yml` tuned to **your** roles, geography, and target companies, so `/career-ops scan` surfaces the right openings instead of noise. It reads career-ops' own example as the schema (so it stays current with career-ops' version) and writes into your career-ops install.

## What `portals.yml` controls (the levers to set)
- **`title_filter`** (`positive` / `negative`) — which job titles count (≥1 positive AND 0 negatives, case-insensitive). The single biggest lever.
- **`location_filter`** (`always_allow` / `allow` / `block`) — geography. *(The example blocks most of the world incl. France — you flip this.)*
- **`salary_filter`** (`min` / `max` / `currency`) — optional comp floor (jobs with no salary data pass).
- **`content_filter`** (`positive` / `negative`) — optional keywords in the JD **text** (stack-based; only some boards supply descriptions).
- **`search_queries`** — Google `site:<ATS>` discovery queries (`{name, query, enabled}`).
- **`tracked_companies`** — the company list scanned via ATS APIs (Greenhouse / Lever / Ashby / Workable) or a WebSearch fallback. The big curation job.
- *(System structure to keep as-is: `job_boards` / `board_api_catalog`, plus optional `scan_history.recheck_after_days`.)*

## Hard rules (non-negotiable)
- **Never invent a `careers_url` or ATS endpoint.** A wrong URL silently breaks scanning (or causes false 410s). For each company, *research* its real careers page + ATS (WebSearch); when unsure, use the `scan_method: websearch` + `scan_query` fallback **or flag it for the user** — don't guess a URL. Prefer the branded careers URL over the raw ATS URL.
- **Read career-ops' `templates/portals.example.yml` as the schema** (and its `board_api_catalog` for the per-ATS API URL patterns) — don't hardcode a format that can drift.
- **career-ops is outside the vault.** Confirm the install path; don't clobber an existing `portals.yml` without showing the diff and backing up (`portals.yml.bak`).
- **Start from the user, not the defaults.** Replace the US/AI `tracked_companies` with the user's curated list — never ship hundreds of irrelevant companies left `enabled: true`.

## Steps
1. **Inputs.** Verify the career-ops path + that `templates/portals.example.yml` exists. Read `config/profile.yml` + `hunter/personal-profile/cv.md` to pre-fill sensible defaults (archetypes → role keywords; location; comp floor).
2. **Interview — one topic at a time:**
   - **Roles** (`title_filter.positive`) — propose keywords from the archetypes/CV (e.g. "Architect", "Tech Lead", "Engineering Manager", "Platform", "Java"); confirm/edit. Ask for **negatives** to exclude (e.g. junior, intern, sales, or company types you don't want).
   - **Geography** (`location_filter`) — home region + cities to `allow`, remote stance, and what to `block`. **Flip the default that blocks your country.**
   - **Salary floor** (`salary_filter`, optional) — pull from `profile.yml` comp or ask; skip to leave unfiltered.
   - **Stack** (`content_filter`, optional) — JD keywords to require/exclude.
   - **Target companies** (`tracked_companies`) — the core. Ask for **sectors + named companies** (offer suggestions for their sector/geography). For **each** company, **research its careers page + ATS** and build the entry: `careers_url` + `api` when the ATS is known (per `board_api_catalog`), else `scan_method: websearch` + a `scan_query`. Confirm anything uncertain; don't fabricate.
   - **Search queries** (`search_queries`) — generate `site:<ATS>` queries from the role keywords + geography (swap "remote" for the user's locations) across the main boards (Ashby / Greenhouse / Lever / Workable).
3. **Write `portals.yml`** — keep the example's system structure (`job_boards` / `board_api_catalog`), replace the user-facing sections with the interviewed values, and drop in the curated `tracked_companies`.
4. **Validate** — run career-ops' `node validate-portals.mjs` (`npm run validate:portals`) from its dir; fix any errors. Optionally `node doctor.mjs`.
5. **Report** — summarize the role/location/company choices, **flag any company whose `careers_url` you couldn't verify**, and note that `scan` on SPA boards needs the Playwright MCP.

## Done when
career-ops' `portals.yml` exists, **validates**, targets the user's real roles + geography + a **curated (not default)** company list, and any unverified careers URL is flagged (not silently guessed). Per `CLAUDE.md` §8, logged for cross-agent review and synced to the operating-system doc.
