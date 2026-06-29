const runAreaDashboard = async () => {
    "use strict";

    const app = dv.app;
    const host = dv.container;
    const doc = host.ownerDocument;
    const sourcePath = dv.currentFilePath || "";

    const INACTIVE_STATUSES = new Set(["archived", "synthesized", "done", "complete", "completed"]);
    const ACTIVE_KANBAN_LANES = new Set(["todo", "in progress"]);
    const DAY_MS = 86_400_000;
    const STALE_SOURCE_DAYS = 21;
    const STALE_PLAN_DAYS = 30;
    const DORMANT_AREA_DAYS = 30;
    const GLOBAL_DASHBOARD = "dashboard.md";
    const SHARED_CSS = "99-system/views/dashboard/view.css";

    // The area dashboard reuses the global stylesheet verbatim — one design system.
    Array.from(host.children)
        .filter((child) => child.tagName !== "STYLE")
        .forEach((child) => child.remove());
    const hasStyles = Array.from(host.children).some(
        (child) => child.tagName === "STYLE" && child.textContent.includes("--sb-bg")
    );
    if (!hasStyles) {
        const cssFile = app.vault.getAbstractFileByPath(SHARED_CSS);
        if (cssFile?.extension !== "css") throw new Error("Dashboard stylesheet is missing");
        const style = doc.createElement("style");
        style.dataset.sbDashboard = "styles";
        style.textContent = await app.vault.read(cssFile);
        host.prepend(style);
    }

    function el(tag, className, text) {
        const node = doc.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = String(text);
        return node;
    }

    function button(className, text, ariaLabel, onClick) {
        const node = el("button", className, text);
        node.type = "button";
        if (ariaLabel) node.setAttribute("aria-label", ariaLabel);
        node.addEventListener("click", onClick);
        return node;
    }

    function normalizeField(value) {
        const values = [];
        const visit = (entry) => {
            if (entry === null || entry === undefined) return;
            if (Array.isArray(entry)) {
                entry.forEach(visit);
                return;
            }
            if (typeof entry === "object") {
                if (typeof entry.path === "string") visit(entry.path);
                else if (Array.isArray(entry.values)) entry.values.forEach(visit);
                else visit(String(entry));
                return;
            }
            String(entry)
                .split(/[;,|]/)
                .map((part) => part.trim().toLowerCase())
                .filter(Boolean)
                .forEach((part) => values.push(part));
        };
        visit(value);
        return values;
    }

    function hasValue(value) {
        if (value === null || value === undefined || value === false) return false;
        if (Array.isArray(value)) return value.some(hasValue);
        return String(value).trim().length > 0;
    }

    function frontmatter(file) {
        const value = app.metadataCache.getFileCache(file)?.frontmatter;
        return value && typeof value === "object" ? value : {};
    }

    function isMarkdownFile(value) {
        return Boolean(value && value.extension === "md" && typeof value.path === "string");
    }

    function isFolder(value) {
        return Boolean(value && Array.isArray(value.children) && typeof value.path === "string");
    }

    function isArchivedPath(path) {
        return String(path)
            .split("/")
            .some((segment) => ["archive", "archived", "04-archive"].includes(segment.toLowerCase()));
    }

    function getFile(path) {
        const value = app.vault.getAbstractFileByPath(path);
        return isMarkdownFile(value) ? value : null;
    }

    function titleFromSlug(slug) {
        return slug
            .split(/[-_]+/)
            .filter(Boolean)
            .map((word) =>
                /^(ai|seo|b2b|api|oss|ui|ux)$/i.test(word)
                    ? word.toUpperCase()
                    : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    }

    function cleanTitle(value) {
        const cleaned = String(value || "")
            .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
            .replace(/\[\[([^\]]+)\]\]/g, "$1")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[*_`#]/g, "")
            .replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, "")
            .replace(/\s+/g, " ")
            .trim();
        return cleaned || "Untitled item";
    }

    function shortenUrl(raw) {
        const url = String(raw).trim();
        try {
            const parsed = new URL(url);
            const path = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "";
            return `${parsed.hostname.replace(/^www\./, "")}${path}`.slice(0, 64);
        } catch (error) {
            return url.slice(0, 64);
        }
    }

    function parseDate(value) {
        if (!value) return null;
        if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
        if (typeof value?.toJSDate === "function") {
            const date = value.toJSDate();
            return Number.isNaN(date.getTime()) ? null : date;
        }
        const raw = String(value).trim();
        const date = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00`) : new Date(raw);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    function daysSince(timestamp) {
        if (!timestamp) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const then = new Date(timestamp);
        then.setHours(0, 0, 0, 0);
        return Math.max(0, Math.floor((today.getTime() - then.getTime()) / DAY_MS));
    }

    function ageLabel(days) {
        if (days === 0) return "Today";
        if (days === 1) return "1 day";
        return `${days} days`;
    }

    // Age since CREATION — used for a source's "unsynthesized backlog" duration.
    function ageForFile(file) {
        const created = parseDate(frontmatter(file).created);
        const timestamp = created?.getTime() || file.stat?.ctime || file.stat?.mtime || Date.now();
        return daysSince(timestamp);
    }

    // Days since the file was last EDITED (mtime) — the "untouched"/idle age, used for plan staleness.
    function idleDaysForFile(file) {
        return daysSince(file.stat?.mtime || file.stat?.ctime || Date.now());
    }

    function extractOpenCheckboxes(text, allowedLanes = null) {
        const results = [];
        let currentLane = "";
        let inFence = false;
        String(text || "")
            .split(/\r?\n/)
            .forEach((line, index) => {
                if (/^\s*```/.test(line)) {
                    inFence = !inFence;
                    return;
                }
                if (inFence) return;
                const heading = line.match(/^##\s+(.+?)\s*$/);
                if (heading) {
                    currentLane = heading[1].trim().toLowerCase();
                    return;
                }
                const task = line.match(/^- \[ \]\s+(.+?)\s*$/);
                if (!task || !task[1].trim()) return;
                if (allowedLanes && !allowedLanes.has(currentLane)) return;
                results.push({
                    title: cleanTitle(task[1]),
                    raw: task[1].trim(),
                    lane: currentLane || "Queue",
                    line: index + 1,
                });
            });
        return results;
    }

    // --- Resolve which Area this dashboard belongs to (from its own path) ---
    const parts = sourcePath.split("/");
    const areasIndex = parts.indexOf("areas");
    if (areasIndex === -1 || !parts[areasIndex + 1]) {
        throw new Error("Area dashboard must live inside an areas/<slug>/ folder");
    }
    const slug = parts[areasIndex + 1];
    const areaPath = parts.slice(0, areasIndex + 2).join("/");
    const partRoot = parts[0] || "";
    const domain = partRoot.startsWith("01-work")
        ? "Work"
        : partRoot.startsWith("02-personal")
          ? "Personal"
          : "Area";

    const areaFolder = app.vault.getAbstractFileByPath(areaPath);
    if (!isFolder(areaFolder)) throw new Error(`Area folder not found: ${areaPath}`);

    const hub = getFile(`${areaPath}/${slug}.md`) ||
        areaFolder.children.find(
            (child) => isMarkdownFile(child) && normalizeField(frontmatter(child).type).includes("moc")
        ) || null;
    const hubFm = hub ? frontmatter(hub) : {};
    const areaName = cleanTitle(hubFm.title || titleFromSlug(slug));
    const todoFile = getFile(`${areaPath}/todo-kanban.md`);
    const toCheckFile = getFile(`${areaPath}/to-check.md`);

    const model = {
        execute: [],
        board: { todo: [], "in progress": [] },
        curate: [],
        drafts: [],
        scouts: [],
        plans: [],
        lastActive: null,
        errors: {},
    };

    function toUrlItem(entry, status, file) {
        const value = entry.raw.trim();
        const isUrl = /^https?:\/\//i.test(value);
        return {
            title: isUrl ? shortenUrl(value) : entry.title,
            area: areaName,
            status,
            href: isUrl ? value : null,
            path: file.path,
        };
    }

    try {
        if (todoFile) {
            const text = await app.vault.cachedRead(todoFile);
            const cards = extractOpenCheckboxes(text, ACTIVE_KANBAN_LANES).map((item) => ({
                title: item.title,
                area: areaName,
                status: titleFromSlug(item.lane),
                lane: item.lane,
                path: todoFile.path,
            }));
            model.execute = cards;
            cards.forEach((card) => {
                if (model.board[card.lane]) model.board[card.lane].push(card);
            });
        }

        if (toCheckFile) {
            const text = await app.vault.cachedRead(toCheckFile);
            model.curate = extractOpenCheckboxes(text).map((entry) =>
                toUrlItem(entry, "To triage", toCheckFile)
            );
        }

        const prefix = `${areaPath}/`;
        const synthPrefix = `${areaPath}/synthesis/`;
        const areaFiles = app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(prefix));

        // Exclude generated/system notes (dashboards, the timeline) — they aren't real "activity",
        // else a freshly-scaffolded dashboard masks a genuinely dormant Area.
        let newestTouch = 0;
        areaFiles.forEach((file) => {
            const t = normalizeField(frontmatter(file).type);
            if (t.includes("dashboard") || t.includes("timeline")) return;
            const created = parseDate(frontmatter(file).created)?.getTime() || 0;
            newestTouch = Math.max(newestTouch, created, file.stat?.mtime || 0);
        });
        model.lastActive = newestTouch ? daysSince(newestTouch) : null;

        areaFiles
            .filter((file) => !isArchivedPath(file.path))
            .forEach((file) => {
                const fm = frontmatter(file);
                const types = normalizeField(fm.type);
                const statuses = normalizeField(fm.status);
                if (statuses.some((status) => INACTIVE_STATUSES.has(status))) return;

                if (file.path.startsWith(synthPrefix) && types.includes("synthesis")) {
                    const days = idleDaysForFile(file); // "untouched" age = days since last edit (mtime), not creation
                    const stale = days >= STALE_PLAN_DAYS;
                    model.plans.push({
                        title: cleanTitle(fm.title || file.basename),
                        area: areaName,
                        status: `Plan · ${ageLabel(days)}${stale ? " · aging" : ""}`,
                        age: days,
                        stale,
                        path: file.path,
                    });
                    return;
                }

                const kind = types.includes("draft")
                    ? "draft"
                    : types.includes("scout")
                      ? "scout"
                      : null;
                if (!kind) return;
                if (hasValue(fm.synthesized_into)) return;
                const days = ageForFile(file); // unsynthesized-backlog age = since CREATION (editing a draft ≠ synthesizing it)
                const stale = days >= STALE_SOURCE_DAYS;
                const item = {
                    title: cleanTitle(fm.title || file.basename),
                    area: areaName,
                    status: `${titleFromSlug(kind)} · ${ageLabel(days)}${stale ? " · stale" : ""}`,
                    age: days,
                    stale,
                    kind,
                    path: file.path,
                };
                if (kind === "draft") model.drafts.push(item);
                else model.scouts.push(item);
            });

        model.drafts.sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
        model.scouts.sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
        model.plans.sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
    } catch (error) {
        model.errors.area = error;
    }

    const synthesize = [...model.drafts, ...model.scouts];
    const workload = model.execute.length + model.curate.length + synthesize.length;

    // ----- Shell -----
    const dashboard = el("div", "sb-dashboard");
    const ariaLive = el("div", "sb-sr-only");
    ariaLive.setAttribute("aria-live", "assertive");
    dashboard.append(ariaLive);
    host.append(dashboard);

    function showNotice(message, timeout = 5000) {
        let displayed = false;
        try {
            let NoticeClass = globalThis.Notice;
            if (!NoticeClass && typeof require === "function") {
                NoticeClass = require("obsidian")?.Notice;
            }
            if (typeof NoticeClass === "function") {
                new NoticeClass(message, timeout);
                displayed = true;
            }
        } catch (error) {
            console.warn("Area dashboard notice fallback used", error);
        }
        ariaLive.textContent = message;
        if (!displayed) {
            ariaLive.classList.add("sb-inline-notice");
            window.setTimeout(() => ariaLive.classList.remove("sb-inline-notice"), timeout);
        }
    }

    async function openPath(path) {
        const file = getFile(path);
        if (!file) {
            showNotice(`Cannot open missing note: ${path}`);
            return;
        }
        try {
            await app.workspace.getLeaf(false).openFile(file, { active: true });
        } catch (error) {
            showNotice(`Could not open ${file.basename}: ${error.message || error}`);
        }
    }

    function openExternal(url) {
        try {
            window.open(url, "_blank");
        } catch (error) {
            showNotice(`Could not open link: ${error.message || error}`);
        }
    }

    // ----- Drawer (same pattern as the global dashboard) -----
    const overlay = el("div", "sb-overlay");
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    const backdrop = el("div", "sb-backdrop");
    const drawer = el("aside", "sb-drawer");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", "sb-drawer-title");
    const drawerHeader = el("div", "sb-drawer-header");
    const drawerHeading = el("div", "sb-drawer-heading");
    const drawerTitle = el("h2", "sb-drawer-title");
    drawerTitle.id = "sb-drawer-title";
    const drawerSubtitle = el("p", "sb-drawer-subtitle");
    drawerHeading.append(drawerTitle, drawerSubtitle);
    const closeButton = button("sb-close", "Close", "Close details", closeDrawer);
    drawerHeader.append(drawerHeading, closeButton);
    const drawerBody = el("div", "sb-drawer-body");
    drawer.append(drawerHeader, drawerBody);
    overlay.append(backdrop, drawer);
    dashboard.append(overlay);

    let restoreFocus = null;

    function openDrawer(title, subtitle, renderBody, trigger = null) {
        restoreFocus = trigger || doc.activeElement;
        drawerTitle.textContent = title;
        drawerSubtitle.textContent = subtitle || "";
        drawerBody.replaceChildren();
        renderBody(drawerBody);
        overlay.hidden = false;
        overlay.setAttribute("aria-hidden", "false");
        dashboard.classList.add("is-drawer-open");
        window.requestAnimationFrame(() => closeButton.focus());
    }

    function closeDrawer() {
        if (overlay.hidden) return;
        overlay.hidden = true;
        overlay.setAttribute("aria-hidden", "true");
        dashboard.classList.remove("is-drawer-open");
        if (restoreFocus && typeof restoreFocus.focus === "function") restoreFocus.focus();
    }

    backdrop.addEventListener("click", closeDrawer);

    const keyHandler = (event) => {
        if (overlay.hidden) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeDrawer();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = Array.from(
            drawer.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && doc.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };
    if (typeof dv.component?.registerDomEvent === "function") {
        dv.component.registerDomEvent(doc, "keydown", keyHandler);
    } else {
        doc.addEventListener("keydown", keyHandler);
        dv.component?.register?.(() => doc.removeEventListener("keydown", keyHandler));
    }

    function renderEmpty(parent, text) {
        const empty = el("div", "sb-empty");
        empty.append(el("strong", "", "Nothing here"), el("span", "", text));
        parent.append(empty);
    }

    function renderError(parent, text) {
        const error = el("div", "sb-error");
        error.append(el("strong", "", "Section unavailable"), el("span", "", text));
        parent.append(error);
    }

    function renderItemList(parent, items, emptyText) {
        if (!items.length) {
            renderEmpty(parent, emptyText);
            return;
        }
        const list = el("div", "sb-item-list");
        items.forEach((item) => {
            const row = button(
                "sb-item",
                "",
                item.href ? `Open ${item.title} in browser` : `Open ${item.title}`,
                () => (item.href ? openExternal(item.href) : openPath(item.path))
            );
            const copy = el("span", "sb-item-copy");
            copy.append(el("strong", "sb-item-title", item.title));
            if (item.status) copy.append(el("span", "sb-item-meta", item.status));
            row.append(copy, el("span", "sb-item-open", item.href ? "Open ↗" : "Open"));
            list.append(row);
        });
        parent.append(list);
    }

    function openItemsDrawer(title, items, emptyText, trigger) {
        openDrawer(
            title,
            `${items.length} item${items.length === 1 ? "" : "s"}`,
            (parent) => renderItemList(parent, items, emptyText),
            trigger
        );
    }

    // ----- Header -----
    const header = el("header", "sb-header");
    const identity = el("div", "sb-identity");
    identity.append(el("span", "sb-date", domain));
    identity.append(el("h1", "", areaName));
    header.append(identity);

    const headerActions = el("div", "sb-header-actions");
    const healthy = !model.errors.area;
    const live = el("span", `sb-live ${healthy ? "is-live" : "is-partial"}`);
    live.append(el("span", "sb-live-dot"));
    live.append(
        doc.createTextNode(
            healthy
                ? model.lastActive === null
                    ? "Live"
                    : `Active ${ageLabel(model.lastActive).toLowerCase()}`
                : "Partial"
        )
    );
    headerActions.append(live);
    if (hub) {
        headerActions.append(
            button("sb-link-button", "Hub", `Open ${areaName} hub`, () => openPath(hub.path))
        );
    }
    if (todoFile) {
        headerActions.append(
            button("sb-link-button", "Kanban", `Open ${areaName} Kanban`, () =>
                openPath(todoFile.path)
            )
        );
    }
    if (toCheckFile) {
        headerActions.append(
            button("sb-link-button", "To-check", `Open ${areaName} triage queue`, () =>
                openPath(toCheckFile.path)
            )
        );
    }
    headerActions.append(
        button("sb-link-button", "↗ All areas", "Open the global dashboard", () =>
            openPath(GLOBAL_DASHBOARD)
        )
    );
    header.append(headerActions);
    dashboard.append(header);

    const main = el("main", "sb-main");
    dashboard.append(main);

    // ----- Metrics (area-scoped) -----
    const metricsSection = el("section", "sb-metrics");
    metricsSection.setAttribute("aria-label", "Area pipeline");
    const stalePlans = model.plans.filter((plan) => plan.stale).length;
    const staleSources = synthesize.filter((item) => item.stale).length;
    const metrics = [
        { label: "To-Check", value: model.curate.length, detail: "Triage queue", items: model.curate, tone: "amber", empty: "Triage queue is clear." },
        { label: "Drafts", value: model.drafts.length, detail: staleSources ? `${staleSources} stale` : "Curated notes", items: model.drafts, tone: "cyan", empty: "No unsynthesized drafts." },
        { label: "Scouts", value: model.scouts.length, detail: "Discovery sweeps", items: model.scouts, tone: "cyan", empty: "No unsynthesized scouts." },
        { label: "Plans", value: model.plans.length, detail: stalePlans ? `${stalePlans} aging` : "Strategic plans", items: model.plans, tone: "violet", empty: "No active strategic plans." },
        { label: "Execute", value: model.execute.length, detail: "Open cards", items: model.execute, tone: "accent", empty: "No open Kanban cards." },
    ];
    metrics.forEach((metric) => {
        const tile = button(
            `sb-metric tone-${metric.tone}`,
            "",
            `${metric.label}: ${model.errors.area ? "unavailable" : metric.value}. Open details.`,
            (event) => {
                if (model.errors.area) {
                    openDrawer(
                        metric.label,
                        "Query error",
                        (parent) => renderError(parent, "This metric could not be calculated."),
                        event.currentTarget
                    );
                    return;
                }
                openItemsDrawer(metric.label, metric.items, metric.empty, event.currentTarget);
            }
        );
        tile.append(el("span", "sb-metric-label", metric.label));
        tile.append(el("strong", "sb-metric-value", model.errors.area ? "—" : metric.value));
        tile.append(el("span", "sb-metric-detail", metric.detail));
        metricsSection.append(tile);
    });
    main.append(metricsSection);

    const lower = el("div", "sb-lower");
    main.append(lower);

    // ----- Needs Attention (area-scoped) -----
    function attentionCandidates() {
        const candidates = [];
        const stale = model.plans.filter((plan) => plan.stale).sort((a, b) => b.age - a.age);
        if (stale.length) {
            const oldest = stale[0];
            candidates.push({
                title: stale.length === 1 ? "A strategic plan is going stale" : `${stale.length} plans going stale`,
                reason: `Decided but untouched ${ageLabel(oldest.age)} — action or archive`,
                value: ageLabel(oldest.age),
                tone: "amber",
                action: "Open plan",
                run: () => openPath(oldest.path),
            });
        }
        if (model.curate.length) {
            candidates.push({
                title: `${model.curate.length} link${model.curate.length === 1 ? "" : "s"} to triage`,
                reason: "Unresolved to-check items",
                value: `${model.curate.length} open`,
                tone: "coral",
                action: "Open triage",
                run: () => openPath(toCheckFile.path),
            });
        }
        const staleSrc = synthesize.filter((item) => item.stale).sort((a, b) => b.age - a.age);
        if (staleSrc.length) {
            const oldest = staleSrc[0];
            candidates.push({
                title: staleSrc.length === 1 ? `A ${oldest.kind} has gone unsynthesized` : `${staleSrc.length} sources aging unsynthesized`,
                reason: `${oldest.title}`,
                value: ageLabel(oldest.age),
                tone: "cyan",
                action: "Open source",
                run: () => openPath(oldest.path),
            });
        }
        if (model.lastActive !== null && model.lastActive >= DORMANT_AREA_DAYS) {
            candidates.push({
                title: "This Area has gone quiet",
                reason: `No edits in ${ageLabel(model.lastActive)}`,
                value: ageLabel(model.lastActive),
                tone: "amber",
                action: "Open hub",
                run: () => (hub ? openPath(hub.path) : openPath(todoFile?.path || sourcePath)),
            });
        }
        return candidates.slice(0, 6);
    }

    const attention = attentionCandidates();
    const attentionSection = el("section", "sb-attention");
    const attentionHeader = el("div", "sb-section-header");
    attentionHeader.append(el("h2", "", "Needs Attention"));
    attentionSection.append(attentionHeader);
    const rows = el("div", "sb-attention-rows");
    if (model.errors.area) {
        renderError(rows, "Area data could not be calculated.");
    } else if (!attention.length) {
        renderEmpty(rows, "Nothing urgent — this Area is in good shape.");
    } else {
        attention.forEach((item) => {
            const row = el("div", `sb-attention-row tone-${item.tone}`);
            const copy = el("div", "sb-attention-copy");
            copy.append(el("strong", "", item.title));
            copy.append(el("span", "", item.reason));
            const actions = el("div", "sb-attention-action");
            actions.append(el("span", "sb-attention-value", item.value));
            actions.append(
                button("sb-text-action", item.action, `${item.action}: ${item.title}`, (event) =>
                    item.run(event.currentTarget)
                )
            );
            row.append(copy, actions);
            rows.append(row);
        });
    }
    attentionSection.append(rows);
    lower.append(attentionSection);

    // ----- Work Board (the focused payoff: actual cards inline) -----
    const boardSection = el("section", "sb-area-section");
    const boardHeader = el("div", "sb-section-header");
    boardHeader.append(el("h2", "", "Work Board"));
    boardHeader.append(el("span", "sb-area-domain", `${model.execute.length} open`));
    boardSection.append(boardHeader);
    const boardBody = el("div", "sb-drawer-body");
    if (model.errors.area) {
        renderError(boardBody, "The Kanban board could not be read.");
    } else if (!todoFile) {
        renderEmpty(boardBody, "This Area has no todo-kanban.md yet.");
    } else if (!model.execute.length) {
        renderEmpty(boardBody, "No open cards in Todo or In Progress.");
    } else {
        [
            ["Todo", model.board.todo],
            ["In Progress", model.board["in progress"]],
        ].forEach(([label, cards]) => {
            const lane = el("section", "sb-drawer-section");
            lane.append(el("h3", "", `${label} · ${cards.length}`));
            renderItemList(lane, cards, `Nothing in ${label}.`);
            boardBody.append(lane);
        });
    }
    boardSection.append(boardBody);
    lower.append(boardSection);
};

runAreaDashboard().catch((error) => {
    console.error("Second Brain area dashboard failed", error);
    const host = dv.container;
    Array.from(host.children)
        .filter((child) => child.tagName !== "STYLE")
        .forEach((child) => child.remove());
    const state = host.ownerDocument.createElement("div");
    state.className = "sb-dashboard sb-fatal";
    const title = host.ownerDocument.createElement("strong");
    title.textContent = "Area dashboard unavailable";
    const detail = host.ownerDocument.createElement("span");
    detail.textContent = error?.message || String(error);
    state.append(title, detail);
    host.append(state);
});
