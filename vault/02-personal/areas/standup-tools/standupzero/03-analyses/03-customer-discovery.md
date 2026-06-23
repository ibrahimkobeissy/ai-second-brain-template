---
analysis: customer-discovery
title: Customer Discovery & Persona Development
product: "StandupZero"
status: partial
verdict: partial
confidence: low
depends_on: []
key_findings:
  - "Sharpened ICP: the engineering lead of a 10–50-person distributed/async team that ALREADY runs a check-in bot — i.e. has admitted the problem and is paying to solve it."
  - "Buying trigger: a team goes remote / crosses ~10 people / kills a painful live standup — the moment status process gets (re)chosen."
  - "Status is hypothesis-only: zero primary interviews yet; persona and trigger are inferred from the PRD and market structure, not validated."
created: 2026-06-22
---
# Customer Discovery & Persona Development — StandupZero

> Reads `02-prd.md` (1.2 segments/personas). Depth 3: ICP sharpening, JTBD, buying trigger, interview guide, sources. **This spec plans discovery; it does not substitute for real interviews.**

## Summary
The PRD's three segments collapse to one sharp, reachable ICP for a wedge: the lead of a small distributed/async team already paying for a check-in bot. The job and trigger are coherent, but **nothing here is validated** — there are no interviews yet, so this is `status: partial / confidence: low` by design.

## Analysis

### From proto-persona → sharpened ICP
- **Primary ICP — "Distributed-team lead, already-bought-in."** Eng manager / tech lead of a 10–50-person team across ≥2 time zones, already running Geekbot/DailyBot/Slack-thread standups. *Why this ICP:* they have already admitted the problem and shown willingness to pay — the cheapest path to a paying user is someone dissatisfied with a tool they already pay for, not someone unaware they have the problem.
- **Secondary — mid-market eng manager** wanting a trustworthy cross-squad rollup. Larger contract, but longer cycle and security review (see `05-legal-scan`) — wrong first beachhead for a solo founder.
- **De-prioritized — co-located startups:** standup pain is low; persona is weak ("everyone already knows what everyone's doing").

### Job-to-be-done
> "Keep my distributed team aligned on progress and blockers **without forcing a call and without making everyone write a daily report** — and let me trust that the status reflects real work."
Pains relieved: time-zone-hostile meetings, the daily writing tax, stale/low-trust updates. The functional job is real for *this* ICP; emotional job (manager wants to look on-top-of-it without micromanaging) reinforces it.

### Buying trigger
The status process is (re)chosen at discrete moments: **a team goes remote, crosses ~10 people, onboards a new EM, or a manager declares "our standups are useless."** StandupZero must be discoverable at that trigger (marketplace, "Geekbot alternative" search, peer referral) — the same triggers incumbents already capture.

### Where they congregate
r/ExperiencedDevs, Rands Leadership Slack, Hacker News, dev X/Twitter, GitHub, Atlassian/Slack marketplaces, EM newsletters (Pragmatic Engineer, LeadDev).

### Interview guide (Mom Test — past behaviour, not hypotheticals)
1. "Walk me through how your team did standup yesterday." *(behaviour)*
2. "What did you do the last time an update felt useless or got skipped?" *(pain, real instance)*
3. "What are you using now, and what made you pick it / consider switching?" *(alternatives, trigger, WTP)*
4. "Who decides and pays for that tool?" *(buyer)*
5. *(Avoid: "Would you use a tool that auto-writes standups?" — hypothetical, biased.)*

## Evidence & assumptions
- **Grounded in:** PRD 1.2; market structure (existing paid async-tool users are a real, locatable population).
- **Assumed / needs primary research:** that the ICP *wants the writing removed* rather than valuing the reflection; that "already pays for a bot" predicts switching; the buying trigger list. All unvalidated.

## What would change this verdict
- **→ clear-ICP:** 5–8 interviews confirm the trigger + a consistent dissatisfaction with manual entry among bot-paying leads.
- **→ unclear:** interviews reveal teams *like* writing their own (reflection value) or don't trust machine-written status — which would also wound `08-value-proposition` and `13-idea-validation`.

## Sources to gather (primary)
- 5–8 Mom-Test interviews with distributed-team leads currently paying for a check-in bot.
- Scrape "Geekbot alternative / switching" threads for stated switch reasons.

## Conclusion
**Partial, low confidence.** A sharp, reachable ICP and a coherent JTBD exist on paper, which is enough to *target* validation — but the persona is unproven. Feeds `08-value-proposition` (the job to win on) and `13-idea-validation` (who to test). The honest state: a good hypothesis, zero evidence.
