<!-- Skeleton for a COMPONENT-tier productize skill (single deliverable; NOT slash-invokable). -->
---
name: productize-<name>
description: <one line — what deliverable this generates>. Component tier; invoked by a productize Workflow, not directly.
---
# <Title> (Component)

Generates **<deliverable>** for a product. Invoked by `productize-<workflow>`, never run by hand.

## Input
- Reads: `02-prd.md` (+ named `03-analyses/*.md` via `depends_on`).

## Output
- Writes: `<path>` with the knowledge-graph frontmatter (see conventions → Cross-Analysis Intelligence Engine).

## Steps
1. …

## References
- Re-authored from Dean Peters' Product-Manager-Skills (`<skill>`), CC BY-NC-SA 4.0 — attribution per Build Stance.
