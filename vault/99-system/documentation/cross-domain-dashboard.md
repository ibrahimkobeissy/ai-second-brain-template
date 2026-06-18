---
type: reference
status: active
created: 2026-06-18
tags:
  - cross-domain
  - dashboard
---

# Cross-Domain Dashboard (Prototype)

This dashboard uses Obsidian's native `query` blocks to pull notes by their `type` across the entire vault. This allows us to perform cross-domain reasoning (e.g. seeing all evergreen notes or all strategic plans) regardless of whether they live in `01-work` or `02-personal`, **without breaking the ARA folder Hard Wall**.

## 🌲 Evergreen Claims (All Areas)
*These are your durable concepts and independent thoughts.*
```query
line:(type: evergreen)
```

## 🗺️ MOCs & Area Hubs
*Maps of Content and Area entry points.*
```query
line:(type: moc)
```

## 📝 Literature & Sources
*Raw curated inputs and structured reading notes.*
```query
line:(type: literature) OR line:(type: source)
```

## 🧠 Strategic Synthesis Plans
*Agent-generated strategic plans analyzing multiple drafts.*
```query
line:(type: synthesis)
```

## 🕵️ Idea Scouts
*Agent-validated external tools and links for new ideas.*
```query
line:(type: scout)
```

---
*If this prototype proves useful for navigating notes by type, we can adopt it broadly as part of the standard retrieval workflow.*
