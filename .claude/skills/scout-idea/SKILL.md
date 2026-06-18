---
name: scout-idea
description: >-
  Scout for external resources (tools, OSS, articles) to validate and build a
  simple idea. Challenges the idea's value and identifies high-signal links.
---

# Scout Idea

Turn a simple idea into a structured list of relevant external resources. This 
is a "lightweight discovery" tool, not deep research. It is designed to save 
tokens by challenging the idea's worth before executing research.

## Vault paths
- Work areas: `vault/01-work/areas/`
- Personal areas: `vault/02-personal/areas/`
- Output scouts: `vault/<part>/areas/<area-slug>/scout/<kebab-title>.md`
- Output template: `templates/scout.md` (in this skill folder)

## The Workflow

### 1. Discovery & Clarification
- Ask the user which Area this idea belongs to (list discovered areas).
- Ask clarifying questions to fully understand the intent and scope of the idea.

### 2. The Challenge
- **Read the Area first.** Read the Area's `README.md` and skim its existing notes — you cannot judge overlap or value without knowing what is already there.
- Evaluate the idea in that context. Challenge it honestly: is it worth the time/tokens, or does it duplicate or contradict existing notes? Say so plainly.
- If the idea does not survive the challenge, **stop here and tell the user** — do not scout links for a weak idea.

### 3. Link Scouting
- **Use real web search/fetch tools — never your memory.** Run actual searches (web search + page fetch) for every candidate. Links recalled from memory are stale or hallucinated and are worthless in a scouting note.
- Search across: open-source repos (GitHub), specialized tools/SaaS, and high-signal discussion/articles (Hacker News, Reddit, technical blogs, official docs).
- **Verify every link before including it.** Fetch the URL; if it 404s, redirects to something unrelated, or you cannot confirm it exists, drop it. Never guess or construct URLs.
- **Rank by signal, keep only the best.** Judge each candidate on relevance to the idea, recency/maintenance (last updated), and adoption/authority (stars, reputation). Deduplicate. Keep only the genuinely high-signal results.
- **Goal**: Identify the "shoulders of giants" we can stand on — a few strong, verified links beat a long list of plausible ones.

### 4. Output: Writing the Scout
1. Copy `templates/scout.md` and fill every `{{placeholder}}`.
2. `scout_title`: A clear, descriptive title.
3. Filename: kebab-case of the title (e.g., `scout-automated-vault-linting.md`).
4. `today`: Current date, `YYYY-MM-DD`.
5. `area_display_name`: Readable form of the area slug.
6. **Links Section**: One bullet per *verified* resource — as many as earned, not a fixed number (delete unused template rows). Each link gets exactly a **one-sentence** reason stating its specific utility.
7. Ensure the destination `scout/` folder exists (`mkdir -p`) before writing.

## Constraints
- **No Dissertations**: Keep the output tight and actionable.
- **No Deep Dives**: Identify the links and move on; do not summarize the content of every link.
- **Verified or omitted**: Never include a link you have not confirmed resolves — an unverified link is worse than no link.
- **Traceability**: The output must reside in the relevant Area's `scout/` folder.
