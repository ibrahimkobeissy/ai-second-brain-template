---
type: dashboard
status: active
created: {{today}}
area: "{{area_slug}}"
related: "[[{{area_slug}}]]"
cssclasses:
  - second-brain-dashboard-note
tags:
  - dashboard
---

```dataviewjs
await dv.view("99-system/views/area-dashboard")
```
