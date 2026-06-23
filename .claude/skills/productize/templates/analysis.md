---
analysis: {{analysis-id}}
title: {{title}}
product: "{{product-name}}"
status: {{complete | partial}}
verdict: {{short machine-readable verdict, e.g. viable / risky / not-viable}}
confidence: {{low | medium | high}}
depends_on: [{{ids actually read, or empty}}]
key_findings:
  - "{{1–5 structured facts downstream analyses + Go/No-Go will consume}}"
created: {{today}}
---
# {{title}} — {{product-name}}

> Reads `02-prd.md`{{ + depends_on artifacts}}. Dependencies resolve by the `analysis:` frontmatter id. Scaled to the PRD's `depth` (`depth-levels.md`): L1 trims to Summary + Conclusion; L2 is this structure; L3 adds scenarios, sensitivity, a "what would change this verdict" section, a sources-to-gather plan, and active research.

## Summary
{{2–3 sentences: the verdict and the single decision-relevant takeaway. The busy reader stops here.}}

## Analysis
{{The substance — use the specific sub-sections the catalog entry's Method calls for (e.g. for a market study: Sizing (TAM/SAM/SOM) · Demand drivers & trend · Segments · Willingness to pay). For each claim, show the reasoning: claim → because (evidence) → therefore. Quantify where possible and **show how the number is derived**, even if rough. Cite specifics by name (competitors, prices, PRD §, upstream verdicts). Consider the counter-argument. This section is the analysis — not a paragraph.}}

## Evidence & assumptions
- **Grounded in:** {{verified inputs — PRD facts, scout sources, upstream artifact verdicts}}
- **Assumed / needs primary research:** {{what is inferred vs. confirmed — name the gaps honestly; this is what keeps confidence calibrated, not inflated}}

## Conclusion
{{verdict + confidence, and the single implication for the Go/No-Go. If evidence is thin, say so and lower confidence / mark status: partial rather than asserting.}}
