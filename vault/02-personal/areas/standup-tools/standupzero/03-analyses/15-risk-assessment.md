---
analysis: risk-assessment
title: Risk Assessment
product: "StandupZero"
status: complete
verdict: high
confidence: high
depends_on: [feasibility]
key_findings:
  - "Top risks: (R1) differentiation already commoditized and (R2) no distribution as a solo part-timer — both HIGH likelihood × HIGH impact."
  - "Dealbreaker: YES for the current PRD bet — R1+R2 together have no credible mitigation without a pivot; `feasibility`'s binding constraint (viable-to-win) is realized, not hypothetical."
  - "The PRD's headline COGS risk is NOT a top risk (downgraded by `07-financial-model`); the real risks are strategic, not technical/financial."
created: 2026-06-22
---
# Risk Assessment — StandupZero

> Reads `02-prd.md` (1.9) + `feasibility` (binding constraint) + completed artifacts. Depth 3: likelihood × impact, mitigation/kill-criterion per top risk.

## Summary
The risk profile is dominated by two strategic risks that are already partly *realized*, not merely possible: the wedge is commoditized and the founder has no distribution. `feasibility`'s "viable-to-win" cap is the lived reality here. **Verdict: high, high confidence** — and the top two together are a dealbreaker for the current bet.

## Analysis

### Risk register (likelihood × impact)
| # | Risk | L | I | Notes / source |
|---|---|---|---|---|
| **R1** | Differentiation already gone (auto-draft commoditized) | **High** | **High** | Realized — `10-competitive-differentiation` = parity; `02-competitive-landscape` = crowded |
| **R2** | No distribution / GTM as solo part-timer | **High** | **High** | `14-swot` W×T; `09-benchmarking` (winners won on distribution) |
| R3 | Draft quality insufficient (★A2) | Med | High | Untested — `13-idea-validation` Test 1 |
| R4 | Teams won't trust machine-written status (★A1) | Med | High | Untested — `13-idea-validation` Test 2 |
| R5 | Platform/LLM dependence (terms, native feature) | Med | Med | `04-industry-analysis` supplier power |
| R6 | Trademark collision ("ZeroStandup") | Med | Med | `05-legal-scan` IP |
| R7 | GDPR/sub-processor trust bar | Low–Med | Med | `05-legal-scan` — manageable by design |
| — | COGS/margin | Low | Low–Med | **Downgraded** by `07-financial-model` (~3–5% with cheap model on metadata) |

### Top risks → mitigation / kill-criterion
- **R1 (dealbreaker core).** *Mitigation:* abandon the head-on auto-draft bet; pivot to the privacy-first/self-host niche (`12-blue-ocean`) that rivals structurally avoid. *Kill-criterion:* if no defensible axis is found, stop. There is no mitigation that keeps the *current* PRD viable.
- **R2 (dealbreaker core).** *Mitigation:* build a single repeatable organic channel (e.g. an OSS CLI funnel) *before* a paid product; if none works in N weeks, the unit economics (`07-financial-model`) never close. *Kill-criterion:* no channel → no business.
- **R3/R4.** *Mitigation:* run `13-idea-validation` Test 1 (draft quality) and Test 2 (acceptance) *before* building. *Kill-criterion:* drafts posted with minor edits <50%, or interviews show teams value writing their own.

### Is any risk a dealbreaker?
**Yes.** R1 and R2 are concurrently High×High and *already materializing*; unlike R3–R7 they have no mitigation that preserves the current plan — only a pivot. That is the definition of a dealbreaker for the bet as written.

## Evidence & assumptions
- **Grounded in:** `feasibility` (risky; binding constraint = viable-to-win) and the upstream verdicts it rests on; `07-financial-model` (COGS downgrade); `05-legal-scan`.
- **Assumed / needs primary research:** R3/R4 likelihoods (untested); whether a distribution channel is reachable (assumed not, absent evidence).

## What would change this verdict
- **→ moderate:** a committed, validated pivot to the privacy-first niche *plus* a working distribution loop would retire R1+R2.
- **→ stays high:** proceeding with the current PRD as written.

## Conclusion
**High, high confidence — dealbreaker present.** The risks are strategic and largely realized, not speculative. This is the central input to the Go/No-Go (`productize-decide`): on the current plan, the honest recommendation trends **No-Go / pivot-required**, conditional on the `13-idea-validation` tests.
