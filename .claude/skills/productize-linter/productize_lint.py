#!/usr/bin/env python3
"""productize-linter — read-only deterministic health check for the productize toolkit.

The productize commands promise mechanical guarantees (unique ids, acyclic graphs,
matching dependencies, valid frontmatter, no phantom links, build gate honored). Those
promises live in Markdown command prose and are otherwise trusted to the LLM each run.
This script makes them deterministic — the same role `vault-linter` plays for the vault.

READ-ONLY: never modifies anything; prints a report and exits non-zero on any ERROR.

  python3 .claude/skills/productize-linter/productize_lint.py            # CATALOG health
  python3 .claude/skills/productize-linter/productize_lint.py <product>  # PRODUCT health
      e.g. … productize_lint.py vault/02-personal/areas/standup-tools/standupzero

Catalog checks (the .claude/skills/productize/ libraries):
  C1  unique ids per catalog (analyses / decisions / deliverables)
  C2  every analysis `depends_on` resolves to a real analysis id
  C3  every decision `reads` resolves to a real analysis id
  C4  every deliverable `reads` resolves to a real analysis / deliverable id (or `prd`)
  C5  analysis graph + deliverable graph are acyclic

Product checks (a generated areas/<area>/<product>/ folder):
  P1  each artifact carries its required frontmatter keys
  P2  every analysis artifact's `depends_on` == the backtick analysis-ids it consumes (parity)
  P3  the product's analysis graph is acyclic and every `depends_on` resolves to a present artifact
  P4  00-productization-plan.md `[[links]]` resolve to files that exist (no phantom links)
  P5  build gate — if 05-go-no-go is not GO/CONDITIONAL GO, 06-deliverables must be empty
      or every deliverable explicitly `status: illustrative`
  P6  the `## Analysis plan` map matches the artifacts: same id set, each id's level band ==
      its `depends_on`-derived level (ASAP), and the `(standalone)` set == nodes with no deps
      and no dependents (skipped when no map is rendered yet)
"""
import re
import sys
from pathlib import Path

CATALOG = Path(__file__).resolve().parents[1] / "productize"      # .claude/skills/productize
ANALYSES, DECISIONS, DELIVERABLES = CATALOG / "analyses", CATALOG / "decisions", CATALOG / "deliverables"

REQUIRED_FM = {
    "analysis": ["analysis", "title", "status", "verdict", "confidence", "depends_on", "key_findings"],
    "decision": ["decision", "title", "recommendation", "confidence", "reads"],
    "deliverable": ["deliverable", "title", "track", "reads"],
}
GO_OK = {"GO", "CONDITIONAL GO"}


class Report:
    def __init__(self):
        self.rows, self.errors = [], 0

    def add(self, level, name, detail=""):
        self.rows.append((level, name, detail))
        if level == "ERROR":
            self.errors += 1

    def render(self):
        out = []
        for level, name, detail in self.rows:
            mark = {"PASS": "✓", "ERROR": "✗", "WARN": "!"}[level]
            out.append(f"  [{mark}] {level:5} {name}")
            for ln in (detail.splitlines() if detail else []):
                out.append(f"            {ln}")
        return "\n".join(out)


# --- minimal frontmatter parsing (stdlib only, like vault-linter) ----------
def split_fm(text):
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    return text[3:end], text[end + 4:]


def fm_scalar(fm, key):
    m = re.search(rf"^{key}:\s*(.+)$", fm, re.M)
    return m.group(1).strip().strip('"').strip("'") if m else None


def fm_list(fm, key):
    """Parse `key: [a, b]` inline lists (the form productize uses for depends_on/reads)."""
    m = re.search(rf"^{key}:\s*\[(.*?)\]", fm, re.M | re.S)
    if not m:
        return None
    return [x.strip() for x in m.group(1).split(",") if x.strip()]


def fm_has_key(fm, key):
    return re.search(rf"^{key}:", fm, re.M) is not None


def read(p):
    return p.read_text(encoding="utf-8")


def entries(folder, id_key):
    """Yield (id, path, fm, body) for each non-catalog .md file in a catalog folder."""
    for p in sorted(folder.glob("*.md")):
        if p.name == "catalog.md":
            continue
        fm, body = split_fm(read(p))
        yield fm_scalar(fm, id_key), p, fm, body


def acyclic(graph):
    """graph: {id: set(dep_ids)} → (ok, cycle_nodes)."""
    placed = set()
    while len(placed) < len(graph):
        layer = [n for n in graph if n not in placed and graph[n] <= placed]
        if not layer:
            return False, sorted(set(graph) - placed)
        placed |= set(layer)
    return True, []


def asap_levels(graph):
    """graph: {id: set(dep_ids)} (acyclic) → {id: level}, level = 0 if no deps else
    1 + max(dep levels). This is the one map-layering algorithm (conventions → Analysis plan)."""
    level = {}
    def lvl(n):
        if n not in level:
            deps = graph[n] & set(graph)
            level[n] = 0 if not deps else 1 + max(lvl(d) for d in deps)
        return level[n]
    for n in graph:
        lvl(n)
    return level


def parse_analysis_plan(plan_text):
    """Parse the rendered `## Analysis plan` ASCII map → (id_level, standalone) or None.

    Reads the fenced code block under `## Analysis plan`. Tracks the current `LEVEL k`
    band; an analysis token is `NN <id>` (`◄── NN` upstream refs are digits-only, so they
    never match as ids). `(standalone)` attaches to the id token it immediately follows."""
    m = re.search(r"##\s*Analysis plan\b.*?```(.*?)```", plan_text, re.S)
    if not m:
        return None
    id_level, standalone, cur = {}, set(), None
    for line in m.group(1).splitlines():
        lm = re.search(r"\bLEVEL\s+(\d+)", line)
        if lm:
            cur = int(lm.group(1))
        # id tokens and standalone tags, in left-to-right order on the line
        last = None
        for tok in re.finditer(r"(\d\d)\s+([a-z][a-z0-9-]*)|\((standalone)\)", line):
            if tok.group(2):                       # an `NN <id>` token
                last = tok.group(2)
                if cur is not None:
                    id_level[last] = cur
            elif tok.group(3) and last is not None:  # a `(standalone)` tag
                standalone.add(last)
    return (id_level, standalone) if id_level else None


# ============================ CATALOG MODE ============================
def lint_catalog(rep):
    cats = {
        "analysis": (ANALYSES, "analysis"),
        "decision": (DECISIONS, "decision"),
        "deliverable": (DELIVERABLES, "deliverable"),
    }
    ids = {}
    for kind, (folder, key) in cats.items():
        seen, dupes = set(), set()
        for aid, p, _, _ in entries(folder, key):
            if aid is None:
                rep.add("ERROR", f"C1 {kind} id", f"{p.name}: missing `{key}:` frontmatter id")
                continue
            (dupes.add(aid) if aid in seen else seen.add(aid))
        ids[kind] = seen
        rep.add("ERROR" if dupes else "PASS", f"C1 unique {kind} ids",
                (f"duplicates: {sorted(dupes)}" if dupes else f"{len(seen)} unique"))

    analysis_ids, deliverable_ids = ids["analysis"], ids["deliverable"]

    # C2 analyses depends_on resolve + C5 acyclic
    agraph, dangling = {}, []
    for aid, p, fm, _ in entries(ANALYSES, "analysis"):
        deps = set(fm_list(fm, "depends_on") or [])
        agraph[aid] = deps
        dangling += [f"{p.name}: depends_on → {d}" for d in deps if d not in analysis_ids]
    rep.add("ERROR" if dangling else "PASS", "C2 analysis depends_on resolve",
            "\n".join(dangling) if dangling else "all resolve")
    ok, cyc = acyclic({k: v & analysis_ids for k, v in agraph.items()})
    rep.add("ERROR" if not ok else "PASS", "C5 analysis graph acyclic",
            f"cycle among {cyc}" if not ok else "acyclic")

    # C3 decisions reads resolve
    bad = []
    for did, p, fm, _ in entries(DECISIONS, "decision"):
        bad += [f"{p.name}: reads → {r}" for r in (fm_list(fm, "reads") or []) if r not in analysis_ids]
    rep.add("ERROR" if bad else "PASS", "C3 decision reads resolve",
            "\n".join(bad) if bad else "all resolve")

    # C4 deliverables reads resolve (analysis ∪ deliverable ∪ prd) + C5 acyclic (intra-deliverable)
    dgraph, bad = {}, []
    valid = analysis_ids | deliverable_ids | {"prd"}
    for did, p, fm, _ in entries(DELIVERABLES, "deliverable"):
        reads = set(fm_list(fm, "reads") or [])
        dgraph[did] = reads & deliverable_ids        # only intra-track edges matter for ordering
        bad += [f"{p.name}: reads → {r}" for r in reads if r not in valid]
    rep.add("ERROR" if bad else "PASS", "C4 deliverable reads resolve",
            "\n".join(bad) if bad else "all resolve")
    ok, cyc = acyclic(dgraph)
    rep.add("ERROR" if not ok else "PASS", "C5 deliverable graph acyclic",
            f"cycle among {cyc}" if not ok else "acyclic")


# ============================ PRODUCT MODE ============================
def lint_product(root, rep):
    apath = root / "03-analyses"
    analyses = sorted(apath.glob("*.md")) if apath.is_dir() else []

    # P1 required frontmatter
    missing = []
    def check_fm(p, kind):
        fm, _ = split_fm(read(p))
        for k in REQUIRED_FM[kind]:
            if not fm_has_key(fm, k):
                missing.append(f"{p.relative_to(root)}: missing `{k}`")
    for p in analyses:
        check_fm(p, "analysis")
    for p in (root / "06-deliverables").glob("*.md") if (root / "06-deliverables").is_dir() else []:
        if fm_has_key(split_fm(read(p))[0], "deliverable"):
            check_fm(p, "deliverable")
    gng = root / "05-go-no-go.md"
    if gng.exists():
        check_fm(gng, "decision")
    rep.add("ERROR" if missing else "PASS", "P1 required frontmatter",
            "\n".join(missing) if missing else "all artifacts complete")

    # build id→fm map for the product's analyses
    byid = {}
    for p in analyses:
        fm, body = split_fm(read(p))
        aid = fm_scalar(fm, "analysis")
        if aid:
            byid[aid] = (p, set(fm_list(fm, "depends_on") or []), body)

    # P2 parity: declared depends_on == backtick ids consumed in body
    known = set(byid)
    parity_bad = []
    for aid, (p, declared, body) in byid.items():
        used = {i for i in known if i != aid and re.search(rf"`{re.escape(i)}`", body)}
        if declared != used:
            parity_bad.append(f"{p.name}: declared={sorted(declared)} used={sorted(used)} "
                              f"(decorative={sorted(declared-used)}, undeclared={sorted(used-declared)})")
    rep.add("ERROR" if parity_bad else "PASS", "P2 depends_on ↔ body parity",
            "\n".join(parity_bad) if parity_bad else f"{len(byid)} artifacts parity-clean")

    # P3 acyclic + deps resolve to present artifacts
    dangling = [f"{p.name}: depends_on → {d}" for aid, (p, deps, _) in byid.items()
                for d in deps if d not in known]
    rep.add("ERROR" if dangling else "PASS", "P3 product deps resolve",
            "\n".join(dangling) if dangling else "all resolve to present artifacts")
    ok, cyc = acyclic({k: v & known for k, (_, v, _) in byid.items()})
    rep.add("ERROR" if not ok else "PASS", "P3 product graph acyclic",
            f"cycle among {cyc}" if not ok else "acyclic")

    # P4 plan links resolve to existing files
    plan = root / "00-productization-plan.md"
    if plan.exists():
        names = {p.stem for p in root.rglob("*.md")}
        phantom = []
        for m in re.finditer(r"\[\[([^\[\]|#]+)", read(plan)):
            target = m.group(1).strip()
            if target not in names and not target.endswith((".md",)) and target not in {
                    root.parent.name, root.name}:  # allow Area / product self-refs
                # only flag links that look like product artifacts (numbered) or known stems
                if re.match(r"\d\d-", target) or target in {"00-productization-plan"}:
                    phantom.append(target)
        rep.add("ERROR" if phantom else "PASS", "P4 plan links resolve",
                f"phantom: {sorted(set(phantom))}" if phantom else "no phantom links")
    else:
        rep.add("WARN", "P4 plan links resolve", "no 00-productization-plan.md")

    # P5 build gate
    deliv_dir = root / "06-deliverables"
    delivs = [p for p in deliv_dir.glob("*.md")] if deliv_dir.is_dir() else []
    if delivs:
        rec = fm_scalar(split_fm(read(gng))[0], "recommendation") if gng.exists() else None
        if rec in GO_OK:
            rep.add("PASS", "P5 build gate", f"decision={rec} → deliverables allowed")
        else:
            non_illus = [p.name for p in delivs
                         if fm_scalar(split_fm(read(p))[0], "status") != "illustrative"]
            if non_illus:
                rep.add("ERROR", "P5 build gate",
                        f"decision={rec or 'none'} (not GO) but non-illustrative deliverables: {non_illus}")
            else:
                rep.add("PASS", "P5 build gate",
                        f"decision={rec or 'none'}; all {len(delivs)} deliverables marked illustrative")
    else:
        rep.add("PASS", "P5 build gate", "no deliverables yet")

    # P6 Analysis-plan map parity: rendered map == artifacts (coverage, levels, standalone)
    if plan.exists() and byid:
        parsed = parse_analysis_plan(read(plan))
        if parsed is None:
            rep.add("WARN", "P6 analysis-plan map parity", "no rendered `## Analysis plan` map yet")
        else:
            map_level, map_standalone = parsed
            graph = {aid: deps & known for aid, (_, deps, _) in byid.items()}
            ok, _ = acyclic(graph)
            problems = []
            extra, miss = set(map_level) - known, known - set(map_level)
            if extra:
                problems.append(f"map lists absent analyses: {sorted(extra)}")
            if miss:
                problems.append(f"artifacts missing from map: {sorted(miss)}")
            if ok:
                true_level = asap_levels(graph)
                deps_union = set().union(*graph.values()) if graph else set()
                true_standalone = {n for n in known if not graph[n] and n not in deps_union}
                bad_lvl = sorted(f"{i}: map L{map_level[i]} ≠ computed L{true_level[i]}"
                                 for i in (set(map_level) & known) if map_level[i] != true_level[i])
                if bad_lvl:
                    problems.append("level mismatch — " + "; ".join(bad_lvl))
                if map_standalone != true_standalone:
                    problems.append(f"standalone mismatch — map={sorted(map_standalone)} "
                                    f"computed={sorted(true_standalone)} "
                                    f"(missing tag={sorted(true_standalone - map_standalone)}, "
                                    f"wrong tag={sorted(map_standalone - true_standalone)})")
            else:
                problems.append("graph has a cycle (see P3) — level/standalone parity skipped")
            rep.add("ERROR" if problems else "PASS", "P6 analysis-plan map parity",
                    "\n".join(problems) if problems else "map matches artifacts")


def main():
    rep = Report()
    if len(sys.argv) > 1:
        root = Path(sys.argv[1]).resolve()
        if not root.is_dir():
            print(f"✗ product folder not found: {root}")
            return 2
        print(f"\nProductize-linter — PRODUCT: {root}\n")
        lint_product(root, rep)
    else:
        print(f"\nProductize-linter — CATALOG: {CATALOG}\n")
        lint_catalog(rep)
    print(rep.render())
    if rep.errors:
        print(f"\n✗ {rep.errors} error(s). Fix before relying on the toolkit.\n")
        return 1
    print("\n✓ PASS — no errors.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
