---
name: activity-timeline
description: >-
  Summarize git history day-by-day, grouped by Area, into a horizontal Chronos
  swimlane timeline so you can see whether effort is spread evenly across Areas or
  piling into one. Incremental: it reads only the commits since the last run (a
  `last_commit` marker in the timeline note), summarizes each new (date × Area), and
  merges the lines in — it never re-summarizes the whole history. Use to build or
  refresh the Areas Activity Timeline, or when the user asks "what did I work on /
  am I working evenly across areas / update the activity timeline".
---

# Activity Timeline

Turn `git log` into a per-Area, per-day activity record rendered as a **horizontal
swimlane timeline** (one lane per Area) **plus an effort-balance bar chart**. The git
log is the source of truth; an LLM pass (you) writes the human summaries; a
`last_commit` marker makes the *summarization* incremental so old days are summarized
exactly once.

**Pipeline:** new commits since `last_commit` → the **dates** they touch → recompute each
of those dates **in full** (summary + commit count per Area) → replace those dates in the
`chronos` block → recompute the full-history **balance bars** → advance `last_commit`.

## Where
- Timeline note: `vault/areas-activity-timeline.md` (vault root, beside `dashboard.md` — vault-wide view)
- It carries `last_commit:` in frontmatter (the incremental marker), a `## Effort balance`
  `text` bar chart, and one ` ```chronos ` block of `- [date] {Area} ×N summary` lines.
- Rendering the timeline needs the **Chronos Timeline** community plugin (groups `{}` =
  swimlanes). The balance bars are plain monospace text and render without any plugin.

## Prerequisite
Git read access only. **Never mutate git** (`log`/`rev-parse`/`rev-list` only — see CLAUDE.md §5).

## Why both a timeline AND bars
Chronos draws every event the same size whether it represents 1 commit or 50 — so the
timeline shows *when* each Area was worked, not *how much*. The **balance bars** (total
commits per Area) are what actually answer "am I working evenly?", and the **`×N`** on each
event carries the per-day magnitude. Keep both.

## Workflow

### 1. Locate / init the note
Read `vault/areas-activity-timeline.md`. If missing, this is a first run: **copy
`templates/areas-activity-timeline.md`** to that path, set `created:` to today, leave
`last_commit:` empty (so everything below processes all history).

### 2. Find new commits → affected dates
- `HEAD="$(git rev-parse HEAD)"`. If `HEAD == last_commit`, **stop** (no write) — already current.
- **Validate a non-empty marker first:** confirm it exists and is an ancestor of HEAD —
  `git cat-file -e <last_commit>^{commit}` **and** `git merge-base --is-ancestor <last_commit> HEAD`.
  If either fails (stale / rebased / non-ancestor marker), **abort with a clear message and write
  nothing** — do not silently re-summarize all history; the user decides whether to reset the marker.
- Affected dates: `git log <last_commit>..HEAD --format='%ad' --date=short | sort -u`
  (first run / empty marker: drop the `<last_commit>..HEAD` range → all history).
- You will (re)compute **only** these dates. Each is recomputed **in full** (step 4), not patched
  line-by-line — that is what makes a same-day rerun safe (no lost morning summary).

### 3. Map a changed path → Area
- `^vault/(01-work|02-personal)/areas/<slug>/…` → Area = `<slug>`.
- **Everything else** (`.claude/…`, `vault/99-system/…`, inbox, `03-resources/…`, `.obsidian/…`,
  root files) → Area = `second-brain` (the tooling/meta workshop — not a separate lane).
- **Dedupe Areas per commit** (one commit → at most one contribution per Area it touched).

### 4. Recompute each affected date in full (the LLM pass)
For **each affected date**, read *all* of that date's commits (not just the new ones):
`git log --since="<date> 00:00" --until="<date> 23:59:59" --date=short --format='@@@%ad|%s' --name-only`.
Map to Areas (step 3); for each (date, Area) compute the **commit count `N`** and write **one
concise line** (~6–14 words) synthesizing that day's subjects for that Area — faithful, no invented
work. Recomputing the whole day (vs. merging only new commits into an existing line) is what
prevents losing earlier summaries on a later same-day run.

Area **display names**: Title-Case the slug, upper-casing known acronyms (`ai`,`seo`,`b2b`,`api`,
`oss`,`ui`,`ux`) — `ai-seo`→`AI SEO`, `b2b-lead-data`→`B2B Lead Data`, `auto-entrepreneur`→`Auto-Entrepreneur`.

### 5. Replace affected dates in the chronos block
Line format: `- [YYYY-MM-DD] {Area Display} ×N summary` (`×N` = that date+Area commit count). For
each affected date, **delete every existing line for that date and insert the recomputed ones** —
so reruns are exact, never duplicated or partially lost. Leave non-affected dates untouched. Keep
the whole block **sorted by date, then Area**.

### 6. Recompute the effort-balance bars (full history, no LLM)
Tally **total commits per Area across the entire history** — a cheap deterministic count, so redo it
fully every run: `git log --reverse --date=short --format='@@@%ad|%s' --name-only` → map paths to
Areas → dedupe per commit → count per Area. Rewrite the `## Effort balance` `text` block as a
descending bar chart (`<area>  <█-bar scaled to the top Area>  <count>`). This is the panel that
answers "am I working evenly across Areas?"

### 7. Advance the marker + view window (do this LAST)
Only **after** the lines and bars are written: set `last_commit:` to `HEAD`. Advancing the marker is
the final step, so any mid-run failure leaves the marker untouched and the run safely repeatable.
Update `> DEFAULTVIEW <start>|<end>` to the latest ~15 days through tomorrow.

### 8. Report
How many new commits processed, which dates/Areas changed, the current balance leader/laggards, and
(if Chronos isn't installed) the install reminder.

## Output format
The note (see `templates/areas-activity-timeline.md` for the empty starter) has, in order:
1. **Frontmatter** — `title`, `type: timeline`, `status: active`, `created`, `last_commit: "<HEAD>"`,
   `related: "[[second-brain]]"`, `tags: [timeline, cross-domain]`.
2. **`# Areas Activity Timeline`** + a one-line intro (bars = balance, `×N` = commits that day).
3. **`## Effort balance — commits per Area (full history)`** — a fenced `text` block, one row per
   Area in descending order: `<area>   <█-bar scaled to the top Area>   <count>`.
4. **A fenced `chronos` block** — first line `> DEFAULTVIEW <start>|<end>`, then one event line per
   (date, Area): `- [YYYY-MM-DD] {Area Display} ×N summary`, sorted by date then Area.

## Constraints
- **Incremental summaries:** only affected dates are (re)summarized; untouched dates are left intact.
- **Whole-day recompute, not line-patch:** prevents same-day data loss; advance `last_commit` LAST.
- **Magnitude is mandatory:** every event carries `×N`, and the balance bars carry full-history totals
  — without them the timeline shows presence, not effort.
- **Read-only git:** `log`/`rev-parse`/`rev-list` only; never stage, commit, or push.
- **Writes one file:** only `vault/areas-activity-timeline.md`.
- **Faithful summaries:** every line traces to real commit subjects for that date+Area.
