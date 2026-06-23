---
type: product-intake
product: "{{product-name}}"
area: "{{area-slug}}"
status: intake
depth: {{1 | 2 | 3}}
html_report: {{yes | no}}
created: {{today}}
---
# Product Intake — {{product-name}}

Part of [[{{area-slug}}]]. Phase-1 capture; feeds `02-prd.md`.

| # | Field | Value |
| --- | --- | --- |
| 1 | Idea / context / summary | {{summary}} |
| 2 | Business scope | {{Local / National / Multi-country / Global}} |
| 3 | Product type | {{Software / Hardware / Service / Marketplace / Hybrid}} |
| 4 | SaaS model (if software) | {{Cloud / On-prem / Open-source / One-time}} |
| 5 | Customer type | {{B2B / B2C / B2B2C / B2G}} |
| 6 | Customer segments | {{company size / demographics / verticals}} |
| 7 | Revenue model | {{Subscription / Pay-per-use / Freemium / One-time / Commission / Ads / Licensing}} |
| 8 | Stage & maturity | {{Idea / Validated / MVP / Early traction / Scaling}} |
| 9 | Team & resources | {{team size, skills, budget, timeline}} |
| 10 | Competitive awareness | {{None / Know a few / Know the market / No direct competitors}} |
| 11 | Regulatory sensitivity | {{Not / Lightly / Moderately / Heavily regulated}} |
| 12 | **Thoroughness level** | {{1 Sketch / 2 Standard / 3 Investment-grade}} — sets the depth of every artifact + how many analyses run (see `depth-levels.md`) |
| 13 | **Final HTML report** | {{yes / no}} — the expensive capstone webpage visualizing every artifact (`productize-report` → `07-summary.html`) |
