---
deliverable: uiux-mockup
title: UI/UX Mockup Generation
track: technical
catalog: "6B.4"
product: "StandupZero"
status: draft
reads: [functional-spec, customer-journey]
created: 2026-06-22
---
# UI/UX Mockup Generation — StandupZero

> Phase-6 deliverable. Draws from `02-prd.md` + [[02-functional-spec]], [[03-customer-journey]]. Depth 3: key screens (text wireframes), the critical interaction, states. **Specs/wireframes only — real UI is built outside the vault (CLAUDE.md §7).**

## Summary
The product is mostly invisible — it lives where the work already is (Slack + GitHub). The only UI that matters daily is the **Slack draft-review card**; the web app is setup-and-history. Design priority: the draft card must make accept/edit/skip a one-tap, low-friction habit ([[03-customer-journey]] decisive moment).

## Screen 1 — Slack draft-review card (the critical surface)
```
┌─ StandupZero · your standup for Tue 23 Jun ───────────┐
│ Yesterday                                              │
│  • Merged PR #482 "rate-limit the webhook intake"      │
│  • Closed PROJ-211; reviewed 2 PRs                     │
│ Today                                                  │
│  • Likely: finish PROJ-215 (in progress)   ⚠ low conf │
│ Blockers                                               │
│  • PR #479 waiting on review 3 days                    │
│ ─────────────────────────────────────────────────────  │
│ [ ✓ Post ]   [ ✎ Edit ]   [ Skip today ]              │
│ drafted from your activity · metadata only             │
└────────────────────────────────────────────────────────┘
```
- **Critical interaction:** `Post` is one tap. `Edit` opens an inline modal (prefilled — never a blank field; that's the whole value). The **⚠ low-confidence flag** on "Today" is a deliberate honesty cue (S2.2) — it builds trust by not overclaiming.
- *States:* zero-activity ("Light day — no clear plan inferred. Post anyway / Skip"); generation-failed ("Couldn't draft — retry / write manually"); already-posted (collapsed confirmation).

## Screen 2 — Onboarding / connect (web)
```
Step 1  Connect GitHub      [Connect]   ✓ metadata only — your code is never read or stored
Step 2  Connect Jira/Linear [Connect]
Step 3  Pick channel + time [#standup ▾] [09:00 ▾ tz]
Step 4  Invite teammates    [emails…]            (Free: up to 10)
```
- Privacy reassurance is on the connect step itself ([[03-customer-journey]] activation friction = source-code fear).

## Screen 3 — Web dashboard (setup + history)
- Team standup history (searchable), per-member status, schedule/channel settings, billing/seats. Low-frequency; not the daily surface.

## Screen 4 — Manager rollup digest (post-MVP, Business tier)
- A daily/weekly cross-squad summary card ("where are we?") — the upsell hook ([[04-pricing-strategy]] Business). Wireframe deferred with the feature ([[02-functional-spec]] S4.3).

## Trade-offs & alternatives
- **Slack-native card (chosen)** vs **web-first** — the user already lives in Slack; forcing a web visit daily would kill the habit. Web is for setup only.
- **Prefilled edit modal (chosen)** vs **freeform compose** — prefilled *is* the differentiator made visible; a blank box would erase the value at the moment of truth.
- **Visible low-confidence flag (chosen)** vs **hiding uncertainty** — showing it costs polish but buys trust (★A1); chosen deliberately.

## Open questions & dependencies
- Does the low-confidence flag reassure or undermine? Test with design partners.
- Edit-modal UX must make small fixes faster than typing from scratch, or DAR ([[05-kpi-framework]]) suffers.
- Accessibility of Slack interactive components; Teams equivalent (post-MVP).
