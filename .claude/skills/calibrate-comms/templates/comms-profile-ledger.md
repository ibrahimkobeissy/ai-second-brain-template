---
title: "Communication Profile — {{user}}"
type: profile
status: active
user: "{{user}}"
created: {{today}}
updated: {{today}}
depth: "{{quick_or_deep}}"
source: "[[communication-calibration-design]]"
tags:
  - communication-profile
---

# Communication Profile — {{user}}

> Re-runnable record produced by `/calibrate-comms`. The **compiled directives** the agents actually obey live in `CLAUDE.md` §12 (the `COMMS-PROFILE` block); this ledger holds the full reasoning + history behind them. Bands are **priors corrected by revealed preference** — not a personality type.

## Current bands ({{today}})
| # | Axis | Band | Set by |
|---|------|------|--------|
| 1 | density | {{band}} | {{prior / sample / override}} |
| 2 | sequence | {{band}} | {{…}} |
| 3 | modality | {{band}} | {{…}} |
| 4 | abstraction | {{band}} | {{…}} |
| 5 | tradeoff | {{band}} | {{…}} |
| 6 | detail | {{band}} | {{…}} |
| 7 | jargon (global default) | {{band}} | {{…}} |
| 8 | tone | {{band}} | {{…}} |
| 9 | context-giving | {{band}} | {{…}} |

## Compiled HOUSE STYLE block (mirror of CLAUDE.md §12)
{{house_style_block}}

## Overrides & notes
- {{where a sample overrode a prior, or the user hand-edited a directive — one line each}}

## History
- {{today}} — {{quick|deep}} calibration. {{one-line summary of what changed}}
