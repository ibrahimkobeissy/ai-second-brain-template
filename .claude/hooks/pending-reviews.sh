#!/usr/bin/env bash
# SessionStart hook: notify the user (systemMessage) and the agent
# (additionalContext) of pending maintenance reviews assigned to them.
#
# "Pending" = an unchecked card (`- [ ]`) in the **## Todo** swimlane of the
# Kanban board whose `Reviewer:` matches. Cards in In Progress / Done / Archived
# are ignored, matching the audit-maintenance skill's definition.
#
# Usage: pending-reviews.sh <Reviewer>      e.g. pending-reviews.sh Claude
#
# Output is JSON on stdout, valid for both Claude Code and Antigravity:
#   - systemMessage         -> shown directly to the user in the terminal
#   - additionalContext     -> added to the agent's context so it can act
# Emits "{}" (a no-op) when there are no pending reviews. Never blocks startup.
set -euo pipefail

reviewer="${1:?usage: pending-reviews.sh <Reviewer>}"

# Self-locate the vault so this works regardless of which agent / cwd calls it.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
tasks="$root/vault/99-system/maintenance/agent-kanban.md"

# Only unchecked cards under the "## Todo" swimlane, with file line numbers (NR).
list="$(awk -v r="$reviewer" '
  /^## /        { intodo = ($0 ~ /^## Todo[[:space:]]*$/) }
  intodo && /^- \[ \]/ && index($0, "Reviewer: " r) { print NR ":" $0 }
' "$tasks" 2>/dev/null || true)"

if [ -z "$list" ]; then
  printf '{}\n'
  exit 0
fi

n="$(printf '%s\n' "$list" | grep -c '')"

jq -n --arg n "$n" --arg reviewer "$reviewer" --arg list "$list" '
{
  systemMessage: "⚠ \($n) pending maintenance review(s) assigned to \($reviewer) — run /audit-maintenance to process them.",
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: ("Pending maintenance reviews (assigned to \($reviewer)) — run audit-maintenance:\n" + $list)
  }
}'
