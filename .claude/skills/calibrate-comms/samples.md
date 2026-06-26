# L2 Sample-Reaction Pairs

For each output axis, the **same content** rendered to opposite poles. In Phase 2 show the pair and ask *"which one lands better?"* — the pick is **revealed preference** and overrides the L1 prior on conflict. Prioritise axes whose prior is uncertain, plus `jargon` and `tone` (which have weak priors). `context-giving` (axis 9) is behavioural and has no sample pair.

Keep it pairwise and fast. In Deep mode show all; in Quick mode show only the contested ones. The agent may regenerate a pair on a topic the user cares about (e.g. render one of their own notes both ways) — that lands harder than a canned example.

---

### `density` — same answer, two lengths
- **A (LOW):** "Use Postgres — you need relational joins."
- **B (HIGH):** "Use Postgres. Your data is relational (users ↔ orders ↔ items), you'll want multi-table joins and transactional integrity, and you don't have the write-volume that would push you toward a document store. Mongo would force you to denormalize and hand-roll joins in app code."

### `sequence` — same answer, two orders
- **A (CHRONO):** "We started with the latency spike, traced it to N+1 queries, found the ORM was lazy-loading in a loop — so the fix is eager-loading the association."
- **B (BLUF):** "Fix: eager-load the association. Why: the ORM was lazy-loading in a loop (N+1), which caused the latency spike."

### `modality` — same process, two forms
- **A (PROSE):** "The request hits the load balancer, which routes to a web worker; the worker checks the cache, and on a miss queries the database, then writes the result back to the cache before responding."
- **B (VISUAL):**
```
request → load balancer → web worker → cache ──hit──► respond
                                         └─miss─► database → (write cache) → respond
```

### `abstraction` — same concept, two entries
- **A (CONCRETE):** "Pressing an elevator button five times does the same thing as pressing it once. That property — repeating the action doesn't change the result — is idempotency."
- **B (ABSTRACT):** "Idempotency: an operation is idempotent if applying it multiple times yields the same result as applying it once."

### `tradeoff` — same decision, two framings
- **A (DECISIVE):** "Use GitHub Actions. It's already in your stack and the setup is trivial."
- **B (OPTIONEER):** "Three options: GitHub Actions (zero new infra, tight GitHub integration), CircleCI (faster on big matrices, another vendor), GitLab CI (best if you migrate hosting). I'd lean Actions — but here's the tradeoff if matrix speed matters."

### `detail` — same topic, two coverages
- **A (GIST):** "Send the auth token in the `Authorization: Bearer` header."
- **B (COMPLETE):** "Send the token in `Authorization: Bearer`. Note: it expires in 1h (refresh via `/token`), a malformed header returns 401 not 403, and rate limits are per-token not per-IP — so rotating tokens won't dodge them."

### `jargon` — same point, two assumed levels
- **A (PLAIN):** "Add an index (a lookup structure the database keeps so it doesn't scan every row) on the `email` column."
- **B (EXPERT):** "Add a B-tree index on `email`; it'll turn the seq scan into an index scan."

### `tone` — same message, two registers
- **A (CASUAL):** "Heads up — this'll break on empty input. Want me to guard it?"
- **B (FORMAL):** "Please note this implementation will fail on empty input. Shall I add a validation guard?"
