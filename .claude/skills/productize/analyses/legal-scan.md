---
analysis: legal-scan
title: Legal & Regulatory Intelligence Scan
catalog: "2.19"
depends_on: []
reference_skills: []
relevant_when: "any product touching data, consumers, payments, or a regulated sector"
---
# Legal & Regulatory Intelligence Scan — analysis spec

> **⚠️ LEGAL DISCLAIMER:** Informational and awareness purposes only. This is **NOT legal advice**; we are not a law firm and assume no liability. Users must consult a qualified legal professional before acting.

**Evaluates:** potential legal/regulatory concerns across **7 sub-areas** (one artifact, seven sections).
**Reads:** PRD 1.5/1.6 (offering, geography, entity, regulatory notes) + `regulatory-legal-assessment` if present.
**Method — flag concerns in each applicable sub-area (skip the genuinely N/A):**
1. **Business-model legality** — industry restrictions, required licenses, B2B-only vs. B2C viability.
2. **Data privacy & GDPR** — DPO need, consent, cross-border transfers.
3. **Consumer protection & B2C** — refunds, cooling-off, advertising standards, age verification.
4. **Industry-specific regulation** — PSD2, MiFID II, MDR, food safety, broadcasting, etc.
5. **IP & trademark** — conflicts, patent risk, own-IP protection.
6. **Tax & entity formation** — VAT/GST, corporate tax, entity type (GmbH/SAS/Ltd), jurisdiction.
7. **Employment & contractor law** — contracts, minimum wage, contributions, misclassification, remote work.

**Writes:** artifact per template (a `## ` per applicable sub-area). `verdict` ∈ {low-risk, watch-items, blockers}. `key_findings`: the highest-severity flags + where professional advice is mandatory.

*Re-authored from Dean Peters' Product-Manager-Skills, CC BY-NC-SA 4.0 — attribution per Build Stance.*
