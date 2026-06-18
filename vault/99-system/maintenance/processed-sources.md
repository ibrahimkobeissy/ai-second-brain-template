# Processed Sources

Append-only ledger of every source that has been **bookmarked → curated → synthesized**, so a re-bookmark of the same link is caught as a *possible duplicate* even after the bookmark and draft notes are deleted (the vault is kept lite — CLAUDE.md §2).

`curate-bookmarks` checks this by **normalized URL** before creating a draft: scheme + lowercased host + path, with tracking query params (`?s=…&t=…`) and `#fragments` stripped. Match → flag possible duplicate.

| date | normalized url | title | stage | landed in |
| :--- | :--- | :--- | :--- | :--- |
