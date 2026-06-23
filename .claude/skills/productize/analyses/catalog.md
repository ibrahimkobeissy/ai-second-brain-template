# Analysis Catalog

Index of available analyses for `productize-analyze`. The **analysis-slip** reads this to suggest a set from a product's PRD; the runner reads the matching `<analysis-id>.md` entry to execute. Add a row here when you author a new analysis.

| # | analysis-id | Title | relevant when | depends_on |
| --- | --- | --- | --- | --- |
| 2.1 | `feasibility` | Feasibility Study | always — core viability gate | market-study, competitive-landscape |
| 2.2 | `market-study` | Market Study / Assessment | always — sizing demand & segments | — |
| 2.3 | `competitive-landscape` | Competitive Landscape | always, unless no comparable offering | — |
| 2.4 | `industry-analysis` | Industry Analysis (Five Forces / PESTEL) | always; heavier if regulated/consolidating | — |
| 2.5 | `financial-model` | Financial Modeling & Valuation | once a revenue model exists (1.4) | market-study |
| 2.6 | `due-diligence` | Due Diligence | partnership / investment / acquisition | — |
| 2.7 | `regulatory-legal-assessment` | Regulatory & Legal Assessment | regulated sectors/geographies | — |
| 2.8 | `location-analysis` | Location / Site Analysis | physical/retail/logistics only | — |
| 2.9 | `swot` | SWOT Analysis | always — synthesis lens | market-study, competitive-landscape |
| 2.10 | `risk-assessment` | Risk Assessment | always | feasibility |
| 2.11 | `benchmarking` | Benchmarking Study | when comparable ventures exist | competitive-landscape |
| 2.12 | `competitive-differentiation` | Competitive Differentiation | competitive markets | competitive-landscape |
| 2.13 | `value-proposition` | Value Proposition Analysis | always | market-study |
| 2.14 | `feature-gap` | Feature Gap Analysis | feature-competing software/products | competitive-landscape |
| 2.15 | `blue-ocean` | Blue Ocean Strategy | crowded markets seeking an angle | competitive-landscape |
| 2.16 | `usp` | USP Identification | always — synthesis | value-proposition, competitive-differentiation |
| 2.17 | `idea-validation` | Idea Validation Study | early-stage / unvalidated | market-study |
| 2.18 | `customer-discovery` | Customer Discovery & Persona | always — sharpest early-stage | — |
| 2.19 | `legal-scan` | Legal & Regulatory Intelligence Scan (7 sub-areas) | data / consumer / payments / regulated | — |

> The Legal Scan (2.19) is informational only — **not legal advice.**
