---
name: scout-idea
description: >-
  Scout for external resources (tools, OSS, SaaS, articles, forum threads) to
  build an idea — a broad discovery sweep that casts a wide net of candidate
  links for you to curate, for when you don't have bookmarks yet. Challenges the
  idea's value first, then gathers many resources (verified picks + candidates).
---

# Scout Idea

Turn an idea into a **broad pile of candidate external resources** — the discovery
sweep you'd otherwise do by scrolling forums and bookmarking links, for when you
have no bookmarks yet. This is deliberately **wide, not a curated shortlist**:
**scout gathers, curation narrows.** Breadth is the point — the job is to surface
*many* tools, repos, articles, and discussions, not to pre-pick the one winner.
The downstream `curate-bookmarks` / `synthesize-drafts` steps do the filtering;
don't do their job here.

## Vault paths
- Work areas: `vault/01-work/areas/`
- Personal areas: `vault/02-personal/areas/`
- Output scouts: `vault/<part>/areas/<area-slug>/scout/<kebab-title>.md`
- Output template: `templates/scout.md` (in this skill folder)

## The Workflow

### 1. Discovery & Clarification
- Ask the user which Area this idea belongs to (list discovered areas).
- Ask clarifying questions to understand the intent and scope.
- **Break the idea into its distinct sub-angles** (e.g. "personal finance" →
  apps / statement-ingestion / AI-advice). The net must cover *each* angle — this
  is what makes the sweep broad instead of one narrow search.

### 2. The Challenge
- **Read the Area first.** Read the Area's hub note (the `<area-slug>.md` MOC) and
  skim its existing notes — you cannot judge overlap or value without knowing
  what is already there.
- Challenge the idea honestly: is it worth a sweep, or does it duplicate or
  contradict existing notes? Say so plainly.
- If the idea does not survive the challenge, **stop here and tell the user** — do
  not run a big search for a weak idea. (The challenge stays; only the *output*
  is broad, not the standard for *whether* to scout.)

### 3. Link Scouting — cast a wide net
- **Use real web search/fetch tools — never your memory.** Links recalled from
  memory are stale or hallucinated and are worthless in a scout.
- **Run multiple searches per angle, not one.** Vary the queries: `open source X`,
  `X alternatives`, `best X 2026`, `awesome X`, `X reddit`, `X hacker news`,
  `self-hosted X`, plus the specific sub-angles from step 1. One query per topic
  is the main reason a sweep comes back thin.
- **Search across categories** so the pile is mixed, not all repos:
  - OSS repos (GitHub/GitLab) and **awesome-lists**,
  - commercial/SaaS tools and **alternatives directories** (e.g. AlternativeTo,
    OpenAlternative),
  - articles, tutorials, official docs,
  - **forum discussion** (Hacker News, Reddit, Stack Overflow).
- **Gather broadly — relevance is the only filter.** Keep every genuinely
  on-topic candidate. Do **not** drop a relevant tool for being niche, new, or
  low-star — adoption/polish judgments are *curation's* job, not scout's.
  Deduplicate near-identical hits.
- **Never fabricate or guess URLs.** Only list links that a real search returned
  or that you fetched. An invented URL is worse than a missing one.

### Tiered verification (keeps breadth affordable)
- **Tier 1 — Verified picks:** for the strongest / most on-point candidates,
  **fetch the URL** to confirm it resolves and capture what it is + a signal
  (stars, last updated, author/authority). These you vouch for. Aim for a solid
  handful per angle, not one.
- **Tier 2 — More candidates (unverified):** the broader long tail. Include them
  **straight from the search results**, clearly marked *unverified*, as long as
  the result itself looks on-topic. No fetch required — curation will triage and
  verify the ones worth keeping.

### 4. Output: Writing the Scout
1. Copy `templates/scout.md` and fill every `{{placeholder}}`.
2. `scout_title`: a clear, descriptive title.
3. Filename: kebab-case of the title (e.g., `personal-finance-tooling-landscape.md`).
4. `today`: current date, `YYYY-MM-DD`.
5. `area_display_name`: readable form of the area slug (use `slug|Display` so the
   wikilink resolves).
6. **Resources:** group by **angle/category**. Within each, list **Verified picks**
   first (one-sentence reason + signal), then **More candidates** (a short
   few-word tag is enough — keep the long tail light). Go **wide**: many links,
   not a tidy few.
7. **Impact section** carries the honest read — including which angles are
   crowded/solved vs where the real gap is. That analysis is where the value
   concentrates, not in pruning the list.
8. Ensure the destination `scout/` folder exists (`mkdir -p`) before writing.

## Constraints
- **Breadth over polish**: a wide, mixed pile of relevant candidates is the
  deliverable. Scout gathers; curation narrows. Do not pre-filter to "the best."
- **Real searches, never memory**: every link traces to a real search hit or a
  fetch.
- **No fabricated URLs**: list only links that actually surfaced.
- **Tiered, not all-or-nothing verification**: verified picks are fetched;
  candidates are marked unverified, not omitted.
- **Traceability**: the output resides in the relevant Area's `scout/` folder.
