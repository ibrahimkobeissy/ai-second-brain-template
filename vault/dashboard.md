---
type: moc
status: active
created: 2026-06-19
tags:
  - dashboard
  - cross-domain
---

# 🧭 Vault Dashboard

The vault's home and command center. The top half is **live pending work** across every Area — what's *not done* — so nothing sits forgotten. The bottom half **browses notes by `type`** across the Hard Wall (Work/Personal/Resources) for cross-domain retrieval.

> Live blocks need the **Tasks** and core **Search** plugins (both active). Open this note in Reading or Live-Preview mode to render them. "Pending" comes straight from the files — curate/act on an item and it disappears here on its own.

---

## ⏳ Pending Work

### 📥 Uncurated inbox
*Raw captures waiting for `curate-bookmarks` → `draft/`.*
```query
path:"00-inbox"
```

### 🗂️ Open Kanban tasks (by Area)
*Unchecked cards under Todo / In Progress in every Area board.*
```tasks
not done
path includes todo-kanban
path does not include 04-archive
group by folder
short mode
```

### ✅ To-check queue (by Area)
*Raw links/items still to triage into `draft/` or verify via `scout-idea`.*
```tasks
not done
path includes to-check
path does not include 04-archive
group by folder
short mode
```

### 📝 Drafts awaiting synthesis
*Curated drafts not yet folded into a synthesis plan.*
```query
[type:draft] -[status:synthesized]
```

### 🕵️ Scouts awaiting action
*Discovery sweeps not yet curated or synthesized.*
```query
[type:scout] -[status:synthesized]
```

### 🛠️ Maintenance / peer reviews
*Open cross-agent review cards in the maintenance board.*
```tasks
not done
path includes agent-kanban
short mode
```

---

## 🔭 Browse by Type
*Cross-domain retrieval by the `type` frontmatter property (see [[conventions]]) — pulls from all Areas without breaking the ARA Hard Wall.*

### 🗺️ MOCs & Area Hubs
```query
[type:moc]
```

### 🌲 Evergreen Claims
```query
[type:evergreen]
```

### 📚 Literature & Sources
```query
[type:literature] OR [type:source]
```

### 🧠 Strategic Synthesis Plans
```query
[type:synthesis]
```
