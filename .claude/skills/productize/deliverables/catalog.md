# Deliverables Catalog (Phase 6)

Index for `productize-build`. Two tracks: **Product** (the what/why) and **Technical** (the how). Each entry is `<deliverable-id>.md`; outputs land in `<product>/deliverables/`.

## 6A — Product Track
| # | id | Title | reads |
| --- | --- | --- | --- |
| 6A.1 | `business-model-design` | Business Model Design | financial-model, value-proposition, market-study |
| 6A.2 | `pricing-strategy` | Revenue Model & Pricing Strategy | business-model-design, financial-model, market-study |
| 6A.3 | `functional-spec` | Functional Specification | prd, feature-gap, value-proposition |
| 6A.4 | `gtm-strategy` | Go-to-Market Strategy | customer-discovery, market-study, pricing-strategy, usp |
| 6A.5 | `marketing-strategy` | Marketing Strategy & Brand Positioning | usp, customer-discovery, gtm-strategy |
| 6A.6 | `customer-journey` | Customer Journey Mapping | customer-discovery, value-proposition |
| 6A.7 | `kpi-framework` | KPI & Metrics Framework | prd, financial-model, business-model-design |

## 6B — Technical Track
| # | id | Title | reads |
| --- | --- | --- | --- |
| 6B.1 | `adr` | Architecture Decision Record | prd, functional-spec |
| 6B.2 | `technical-spec` | Technical Specification & System Design | functional-spec, adr |
| 6B.3 | `spec-generation` | Spec Generation (exportable) | functional-spec, technical-spec |
| 6B.4 | `uiux-mockup` | UI/UX Mockup Generation | functional-spec, customer-journey |
| 6B.5 | `data-model` | Data Model & Database Design | technical-spec, functional-spec |
| 6B.6 | `devops` | DevOps & Deployment Strategy | technical-spec, adr |

> Build code lives **outside the vault** (CLAUDE.md §7). These deliverables are the spec/design that the separate build project consumes.
