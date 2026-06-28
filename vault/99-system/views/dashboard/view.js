const runDashboard = async () => {
    "use strict";

    const app = dv.app;
    const host = dv.container;
    const doc = host.ownerDocument;
    const sourcePath = dv.currentFilePath || "dashboard.md";
    const AREA_ROOTS = [
        { path: "01-work/areas", domain: "Work" },
        { path: "02-personal/areas", domain: "Personal" },
    ];
    const INBOX_ROOT = "00-inbox";
    const MAINTENANCE_PATH = "99-system/maintenance/agent-kanban.md";
    const DIARY_ROOT = "02-personal/areas/second-brain/diaries";
    const THINGS_TO_TEST_PATH = "03-resources/things-to-test.md";
    const ACTIVE_KANBAN_LANES = new Set(["todo", "in progress"]);
    const INACTIVE_STATUSES = new Set(["archived", "synthesized", "done", "complete", "completed"]);
    const DAY_MS = 86_400_000;
    // Staleness thresholds (days). Time-in-state signals; tune here.
    const STALE_SOURCE_DAYS = 21; // an unsynthesized draft/scout older than this is "stale"
    const STALE_PLAN_DAYS = 30; // an active synthesis plan untouched this long = decided-not-moving
    const DORMANT_AREA_DAYS = 30; // an Area with no edits this long has gone quiet

    Array.from(host.children)
        .filter((child) => child.tagName !== "STYLE")
        .forEach((child) => child.remove());
    const hasDashboardStyles = Array.from(host.children).some(
        (child) => child.tagName === "STYLE" && child.textContent.includes("--sb-bg")
    );
    if (!hasDashboardStyles) {
        const cssFile = app.vault.getAbstractFileByPath("99-system/views/dashboard/view.css");
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
            .map((word) => {
                if (/^(ai|seo|b2b|api|oss|ui|ux)$/i.test(word)) return word.toUpperCase();
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

    function cleanTitle(value) {
        const cleaned = String(value || "")
            .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
            .replace(/\[\[([^\]]+)\]\]/g, "$1")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[*_`#]/g, "")
            .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, "")
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
        const date = /^\d{4}-\d{2}-\d{2}$/.test(raw)
            ? new Date(`${raw}T00:00:00`)
            : new Date(raw);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    function ageForFile(file) {
        const fm = frontmatter(file);
        const created = parseDate(fm.created);
        const timestamp = created?.getTime() || file.stat?.ctime || file.stat?.mtime || Date.now();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const then = new Date(timestamp);
        then.setHours(0, 0, 0, 0);
        return Math.max(0, Math.floor((today.getTime() - then.getTime()) / DAY_MS));
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

    function findHub(folder) {
        const exact = getFile(`${folder.path}/${folder.name}.md`);
        if (exact) return exact;
        return (
            folder.children.find(
                (child) =>
                    isMarkdownFile(child) &&
                    normalizeField(frontmatter(child).type).includes("moc")
            ) || null
        );
    }

    function discoverAreas() {
        const areas = [];
        AREA_ROOTS.forEach((root) => {
            const rootFolder = app.vault.getAbstractFileByPath(root.path);
            if (!isFolder(rootFolder)) return;
            rootFolder.children
                .filter(
                    (child) =>
                        isFolder(child) &&
                        !child.name.startsWith(".") &&
                        !isArchivedPath(child.path)
                )
                .forEach((folder) => {
                    const hub = findHub(folder);
                    const hubFm = hub ? frontmatter(hub) : {};
                    if (normalizeField(hubFm.status).includes("archived")) return;
                    areas.push({
                        slug: folder.name,
                        name: cleanTitle(hubFm.title || titleFromSlug(folder.name)),
                        domain: root.domain,
                        path: folder.path,
                        hub,
                        todoFile: getFile(`${folder.path}/todo-kanban.md`),
                        toCheckFile: getFile(`${folder.path}/to-check.md`),
                        execute: [],
                        curate: [],
                        synthesize: [],
                        drafts: [],
                        scouts: [],
                        plans: [],
                        lastActive: null,
                        workload: 0,
                    });
                });
        });
        return areas;
    }

    async function hydrateArea(area, markdownFiles) {
        if (area.todoFile) {
            const text = await app.vault.cachedRead(area.todoFile);
            area.execute = extractOpenCheckboxes(text, ACTIVE_KANBAN_LANES).map((item) => ({
                ...item,
                area: area.name,
                domain: area.domain,
                status: titleFromSlug(item.lane),
                path: area.todoFile.path,
                kind: "execute",
            }));
        }

        if (area.toCheckFile) {
            const text = await app.vault.cachedRead(area.toCheckFile);
            area.curate = extractOpenCheckboxes(text).map((item) => ({
                ...item,
                area: area.name,
                domain: area.domain,
                status: "Open queue item",
                path: area.toCheckFile.path,
                kind: "curate",
            }));
        }

        const prefix = `${area.path}/`;
        const synthPrefix = `${area.path}/synthesis/`;
        const areaFiles = markdownFiles.filter((file) => file.path.startsWith(prefix));

        // "Last active" = most recent created/mtime across the Area's notes (staleness/dormancy).
        let newestTouch = 0;
        areaFiles.forEach((file) => {
            const created = parseDate(frontmatter(file).created)?.getTime() || 0;
            newestTouch = Math.max(newestTouch, created, file.stat?.mtime || 0);
        });
        area.lastActive = newestTouch ? daysSince(newestTouch) : null;

        areaFiles
            .filter((file) => !isArchivedPath(file.path))
            .forEach((file) => {
                const fm = frontmatter(file);
                const types = normalizeField(fm.type);
                const statuses = normalizeField(fm.status);
                if (statuses.some((status) => INACTIVE_STATUSES.has(status))) return;

                // Synthesis plans live in synthesis/ (type: synthesis) — the decided-but-not-yet-executed layer.
                if (file.path.startsWith(synthPrefix) && types.includes("synthesis")) {
                    const days = ageForFile(file);
                    const stale = days >= STALE_PLAN_DAYS;
                    area.plans.push({
                        title: cleanTitle(fm.title || file.basename),
                        area: area.name,
                        domain: area.domain,
                        status: `Plan · ${ageLabel(days)}${stale ? " · aging" : ""}`,
                        age: days,
                        stale,
                        path: file.path,
                        kind: "plan",
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
                const days = ageForFile(file);
                const stale = days >= STALE_SOURCE_DAYS;
                const item = {
                    title: cleanTitle(fm.title || file.basename),
                    area: area.name,
                    domain: area.domain,
                    status: `${titleFromSlug(kind)} · ${ageLabel(days)}${stale ? " · stale" : ""}`,
                    age: days,
                    stale,
                    path: file.path,
                    kind,
                };
                area.synthesize.push(item);
                if (kind === "draft") area.drafts.push(item);
                else area.scouts.push(item);
            });

        area.synthesize.sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
        area.plans.sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
        area.workload = area.execute.length + area.curate.length + area.synthesize.length;
        return area;
    }

    function isActionableInboxFile(file) {
        if (!file.path.startsWith(`${INBOX_ROOT}/`)) return false;
        const relative = file.path.slice(INBOX_ROOT.length + 1);
        const segments = relative.split("/");
        const basename = file.basename.toLowerCase();
        if (basename === "readme" || basename.startsWith(".")) return false;
        if (
            segments.some((segment) => {
                const normalized = segment.toLowerCase();
                return (
                    normalized.startsWith(".") ||
                    normalized === "attachments" ||
                    normalized === "templates"
                );
            })
        ) {
            return false;
        }
        const statuses = normalizeField(frontmatter(file).status);
        return !statuses.some((status) => INACTIVE_STATUSES.has(status));
    }

    function collectInbox(markdownFiles) {
        return markdownFiles
            .filter(isActionableInboxFile)
            .map((file) => {
                const fm = frontmatter(file);
                const age = ageForFile(file);
                return {
                    title: cleanTitle(fm.title || file.basename),
                    area: "Inbox",
                    domain: "Capture",
                    status: ageLabel(age),
                    age,
                    path: file.path,
                    kind: "capture",
                };
            })
            .sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
    }

    // 03-resources/things-to-test.md — a global phone-capture queue of links to triage (high priority).
    async function collectThingsToTest() {
        const file = getFile(THINGS_TO_TEST_PATH);
        if (!file) return { file: null, items: [] };
        const text = await app.vault.cachedRead(file);
        const items = extractOpenCheckboxes(text)
            .filter((entry) => /\S/.test(entry.raw))
            .map((entry) => {
                const value = entry.raw.trim();
                const isUrl = /^https?:\/\//i.test(value);
                return {
                    title: isUrl ? shortenUrl(value) : cleanTitle(value),
                    area: "To Test",
                    domain: "Resources",
                    status: "Captured to test",
                    href: isUrl ? value : null,
                    path: file.path,
                    kind: "totest",
                };
            });
        return { file, items };
    }

    async function collectMaintenance() {
        const file = getFile(MAINTENANCE_PATH);
        if (!file) return { file: null, items: [] };
        const text = await app.vault.cachedRead(file);
        const items = extractOpenCheckboxes(text, new Set(["todo"])).map((item) => ({
            ...item,
            area: "System",
            domain: "Maintenance",
            status: "Pending review",
            path: file.path,
            kind: "maintenance",
        }));
        return { file, items };
    }

    function isGraphExcluded(path) {
        return (
            isArchivedPath(path) ||
            /(^|\/)(templates|attachments)\//i.test(path) ||
            String(path).split("/").pop().toLowerCase() === "readme.md"
        );
    }

    // Vault-wide graph health, recomputed from Obsidian's link index (no extra deps).
    function computeGraphHealth(markdownFiles) {
        const resolved = app.metadataCache.resolvedLinks || {};
        const unresolved = app.metadataCache.unresolvedLinks || {};

        const broken = [];
        Object.entries(unresolved).forEach(([source, links]) => {
            if (isGraphExcluded(source)) return;
            const sourceName = source.split("/").pop();
            Object.keys(links || {}).forEach((target) => {
                broken.push({
                    title: target,
                    area: "",
                    status: `Missing link in ${sourceName}`,
                    path: source,
                    kind: "broken",
                });
            });
        });

        const linkedTargets = new Set();
        const hasOutgoing = new Set();
        Object.entries(resolved).forEach(([source, targets]) => {
            const keys = Object.keys(targets || {});
            if (keys.length) hasOutgoing.add(source);
            keys.forEach((target) => linkedTargets.add(target));
        });

        const orphans = markdownFiles
            .filter(
                (file) =>
                    !isGraphExcluded(file.path) &&
                    file.path !== sourcePath &&
                    !hasOutgoing.has(file.path) &&
                    !linkedTargets.has(file.path)
            )
            .map((file) => ({
                title: cleanTitle(frontmatter(file).title || file.basename),
                area: file.parent?.name || "—",
                status: "No links in or out",
                path: file.path,
                kind: "orphan",
            }))
            .sort((a, b) => a.title.localeCompare(b.title));

        broken.sort((a, b) => a.title.localeCompare(b.title));
        return { broken, orphans };
    }

    // Journaling cadence from the diary filenames (ISO dates) — last entry + current streak.
    function diaryStats() {
        const root = app.vault.getAbstractFileByPath(DIARY_ROOT);
        if (!isFolder(root)) return { last: null, daysSince: null, streak: 0 };
        const dates = new Set();
        const walk = (folder) => {
            folder.children.forEach((child) => {
                if (isFolder(child)) walk(child);
                else if (isMarkdownFile(child) && /^\d{4}-\d{2}-\d{2}$/.test(child.basename)) {
                    dates.add(child.basename);
                }
            });
        };
        walk(root);
        if (!dates.size) return { last: null, daysSince: null, streak: 0 };

        const lastIso = Array.from(dates).sort()[dates.size - 1];
        const last = parseDate(lastIso);
        let streak = 0;
        const cursor = new Date(last);
        cursor.setHours(0, 0, 0, 0);
        const pad = (value) => String(value).padStart(2, "0");
        while (
            dates.has(
                `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`
            )
        ) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return { last: lastIso, daysSince: daysSince(last.getTime()), streak };
    }

    const model = {
        areas: [],
        capture: [],
        curate: [],
        synthesize: [],
        execute: [],
        plans: [],
        toTest: { file: null, items: [] },
        maintenance: { file: null, items: [] },
        graph: { broken: [], orphans: [] },
        errors: {},
    };

    const markdownFiles = app.vault.getMarkdownFiles();

    try {
        model.capture = collectInbox(markdownFiles);
    } catch (error) {
        model.errors.capture = error;
    }

    try {
        model.areas = discoverAreas();
        await Promise.all(model.areas.map((area) => hydrateArea(area, markdownFiles)));
        model.curate = model.areas.flatMap((area) => area.curate);
        model.synthesize = model.areas.flatMap((area) => area.synthesize);
        model.execute = model.areas.flatMap((area) => area.execute);
        model.plans = model.areas.flatMap((area) => area.plans);
        model.areas.sort(
            (a, b) =>
                b.workload - a.workload ||
                b.execute.length - a.execute.length ||
                b.curate.length - a.curate.length ||
                b.synthesize.length - a.synthesize.length ||
                a.name.localeCompare(b.name)
        );
    } catch (error) {
        model.errors.areas = error;
    }

    try {
        model.toTest = await collectThingsToTest();
    } catch (error) {
        model.errors.toTest = error;
    }

    try {
        model.maintenance = await collectMaintenance();
    } catch (error) {
        model.errors.maintenance = error;
    }

    try {
        model.graph = computeGraphHealth(markdownFiles);
    } catch (error) {
        model.errors.graph = error;
    }

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
            console.warn("Dashboard notice fallback used", error);
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
            const leaf = app.workspace.getLeaf(false);
            await leaf.openFile(file, { active: true });
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

    async function ensureFolder(path) {
        let current = "";
        for (const part of path.split("/")) {
            current = current ? `${current}/${part}` : part;
            if (!app.vault.getAbstractFileByPath(current)) {
                try {
                    await app.vault.createFolder(current);
                } catch (error) {
                    // Tolerate races / already-exists; the next lookup confirms the folder.
                }
            }
        }
    }

    // Open today's diary entry, creating it (with the `diary` skill's schema/path) if absent.
    async function createDiary(trigger) {
        trigger.disabled = true;
        try {
            const pad = (value) => String(value).padStart(2, "0");
            const now = new Date();
            const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
            const monthName = now.toLocaleString("en-US", { month: "long" });
            const folder = `${DIARY_ROOT}/${now.getFullYear()}/${pad(now.getMonth() + 1)}-${monthName}`;
            const path = `${folder}/${iso}.md`;

            let file = app.vault.getAbstractFileByPath(path);
            if (!isMarkdownFile(file)) {
                await ensureFolder(folder);
                const content = `---\ntype: daily\nstatus: active\ncreated: ${iso}\narea: second-brain\ntags:\n  - diaries\n---\n\n# Diary — ${iso}\n\nPart of [[second-brain]]\n\n`;
                file = await app.vault.create(path, content);
            }
            const leaf = app.workspace.getLeaf(false);
            await leaf.openFile(file, { active: true });
            const editor = leaf.view?.editor;
            if (editor) {
                editor.setCursor(editor.lastLine(), 0);
                editor.focus();
            }
        } catch (error) {
            showNotice(`Could not open today's diary: ${error.message || error}`);
        } finally {
            trigger.disabled = false;
        }
    }

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
            drawer.querySelectorAll(
                'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            )
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
                item.href ? `Open ${item.title} in browser` : `Open ${item.title} in ${item.area}`,
                () => (item.href ? openExternal(item.href) : openPath(item.path))
            );
            const copy = el("span", "sb-item-copy");
            copy.append(el("strong", "sb-item-title", item.title));
            const meta = [item.area || item.domain, item.status].filter(Boolean).join(" · ");
            copy.append(el("span", "sb-item-meta", meta));
            row.append(copy, el("span", "sb-item-open", item.href ? "Open ↗" : "Open"));
            list.append(row);
        });
        parent.append(list);
    }

    function openItemsDrawer(title, items, emptyText, trigger) {
        openDrawer(
            title,
            `${items.length} live item${items.length === 1 ? "" : "s"}`,
            (parent) => renderItemList(parent, items, emptyText),
            trigger
        );
    }

    function openGraphDrawer(trigger) {
        if (model.errors.graph) {
            openDrawer(
                "Graph health",
                "Query error",
                (parent) => renderError(parent, "Graph health could not be computed."),
                trigger
            );
            return;
        }
        const { broken, orphans } = model.graph;
        openDrawer(
            "Graph health",
            `${broken.length} broken · ${orphans.length} orphan${orphans.length === 1 ? "" : "s"}`,
            (parent) => {
                const brokenSection = el("section", "sb-drawer-section");
                brokenSection.append(el("h3", "", `Broken links · ${broken.length}`));
                renderItemList(brokenSection, broken, "No broken links.");
                parent.append(brokenSection);
                const orphanSection = el("section", "sb-drawer-section");
                orphanSection.append(el("h3", "", `Orphans · ${orphans.length}`));
                renderItemList(orphanSection, orphans, "No orphaned notes.");
                parent.append(orphanSection);
            },
            trigger
        );
    }

    const header = el("header", "sb-header");
    const identity = el("div", "sb-identity");
    const dateText = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date());
    identity.append(el("span", "sb-date", dateText));
    identity.append(el("h1", "", "Second Brain"));
    const headerActions = el("div", "sb-header-actions");
    const queryHealthy = Object.keys(model.errors).length === 0;
    const live = el("span", `sb-live ${queryHealthy ? "is-live" : "is-partial"}`);
    live.append(el("span", "sb-live-dot"));
    live.append(doc.createTextNode(queryHealthy ? "Live" : "Partial"));
    live.title = queryHealthy
        ? "All dashboard queries rendered successfully"
        : "One or more dashboard sections could not render";
    const graphHealthy = !model.errors.graph;
    const brokenCount = model.graph.broken.length;
    const orphanCount = model.graph.orphans.length;
    const healthTone = !graphHealthy
        ? "is-partial"
        : brokenCount
          ? "tone-coral"
          : orphanCount
            ? "tone-amber"
            : "is-clean";
    const healthChip = button(
        `sb-health ${healthTone}`,
        "",
        graphHealthy
            ? `Vault graph health: ${brokenCount} broken link${brokenCount === 1 ? "" : "s"}, ${orphanCount} orphan${orphanCount === 1 ? "" : "s"}. Open details.`
            : "Vault graph health unavailable. Open details.",
        (event) => openGraphDrawer(event.currentTarget)
    );
    const healthLabel = !graphHealthy
        ? "Graph"
        : brokenCount
          ? `${brokenCount} broken`
          : orphanCount
            ? `${orphanCount} orphan${orphanCount === 1 ? "" : "s"}`
            : "Graph OK";
    healthChip.append(el("span", "sb-live-dot"));
    healthChip.append(doc.createTextNode(healthLabel));
    healthChip.title = `${brokenCount} broken link${brokenCount === 1 ? "" : "s"} · ${orphanCount} orphan${orphanCount === 1 ? "" : "s"}`;
    let journal;
    try {
        journal = diaryStats();
    } catch (error) {
        journal = { last: null, daysSince: null, streak: 0 };
    }
    let journalTone = "";
    let journalText = "No journal";
    if (journal.last !== null) {
        if (journal.daysSince === 0) {
            journalTone = "is-live";
            journalText = journal.streak >= 2 ? `${journal.streak}-day streak` : "Journaled today";
        } else if (journal.daysSince === 1) {
            journalTone = "tone-amber";
            journalText = "Journal · 1d ago";
        } else {
            journalTone = "tone-coral";
            journalText = `Journal · ${journal.daysSince}d ago`;
        }
    }
    const journalChip = el("span", `sb-journal ${journalTone}`);
    journalChip.append(el("span", "sb-live-dot"));
    journalChip.append(doc.createTextNode(journalText));
    journalChip.title = journal.last
        ? `Last diary entry ${journal.last} · ${journal.streak}-day streak`
        : "No diary entries yet — start one";

    const diaryButton = button(
        "sb-capture",
        "Create Diary",
        "Open or create today's diary entry",
        (event) => createDiary(event.currentTarget)
    );
    headerActions.append(live, healthChip, journalChip, diaryButton);
    header.append(identity, headerActions);
    dashboard.append(header);

    const main = el("main", "sb-main");
    dashboard.append(main);

    const metricsSection = el("section", "sb-metrics");
    metricsSection.setAttribute("aria-label", "Pipeline metrics");
    const draftCount = model.synthesize.filter((item) => item.kind === "draft").length;
    const scoutCount = model.synthesize.filter((item) => item.kind === "scout").length;
    const stalePlanCount = model.plans.filter((plan) => plan.stale).length;
    const metrics = [
        {
            label: "To Test",
            value: model.errors.toTest ? null : model.toTest.items.length,
            detail: "Phone captures",
            items: model.toTest.items,
            tone: "coral",
            relief: true,
            error: model.errors.toTest,
            empty: "Nothing waiting to be tested.",
        },
        {
            label: "Capture",
            value: model.errors.capture ? null : model.capture.length,
            detail: "Inbox notes",
            items: model.capture,
            tone: "coral",
            error: model.errors.capture,
            empty: "The actionable inbox is empty.",
        },
        {
            label: "Curate",
            value: model.errors.areas ? null : model.curate.length,
            detail: "Queue items",
            items: model.curate,
            tone: "amber",
            error: model.errors.areas,
            empty: "No unresolved to-check items.",
        },
        {
            label: "Synthesize",
            value: model.errors.areas ? null : model.synthesize.length,
            detail: model.errors.areas ? "Unavailable" : `${draftCount} draft · ${scoutCount} scout`,
            items: model.synthesize,
            tone: "cyan",
            error: model.errors.areas,
            empty: "No unsynthesized drafts or scouts.",
        },
        {
            label: "Plans",
            value: model.errors.areas ? null : model.plans.length,
            detail: model.errors.areas
                ? "Unavailable"
                : stalePlanCount
                  ? `${stalePlanCount} aging`
                  : "Strategic plans",
            items: model.plans,
            tone: "violet",
            error: model.errors.areas,
            empty: "No active strategic plans.",
        },
        {
            label: "Execute",
            value: model.errors.areas ? null : model.execute.length,
            detail: "Open cards",
            items: model.execute,
            tone: "accent",
            error: model.errors.areas,
            empty: "No open Kanban cards.",
        },
    ];

    metrics.forEach((metric) => {
        const tile = button(
            `sb-metric tone-${metric.tone}${metric.relief ? " is-relief" : ""}`,
            "",
            `${metric.label}: ${metric.value ?? "unavailable"}. Open details.`,
            (event) => {
                if (metric.error) {
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
        tile.append(el("strong", "sb-metric-value", metric.value ?? "—"));
        tile.append(el("span", "sb-metric-detail", metric.detail));
        metricsSection.append(tile);
    });
    main.append(metricsSection);
    const lower = el("div", "sb-lower");
    main.append(lower);

    function topAreaBy(key) {
        return model.areas
            .filter((area) => area[key].length > 0)
            .sort(
                (a, b) =>
                    b[key].length - a[key].length ||
                    b.workload - a.workload ||
                    a.name.localeCompare(b.name)
            )[0];
    }

    function attentionCandidates() {
        const candidates = [];
        if (!model.errors.toTest && model.toTest.items.length) {
            const count = model.toTest.items.length;
            candidates.push({
                title: `${count} captured link${count === 1 ? "" : "s"} to test`,
                reason: "Phone captures awaiting triage — high priority",
                value: `${count} open`,
                area: "To Test",
                score: 5_500 + Math.min(count, 999),
                tone: "coral",
                action: "Open list",
                run: () => openPath(model.toTest.file.path),
            });
        }

        if (!model.errors.maintenance && model.maintenance.items.length) {
            const count = model.maintenance.items.length;
            candidates.push({
                title: `${count} maintenance review${count === 1 ? "" : "s"} pending`,
                reason: "Peer review is waiting",
                value: `${count} open`,
                area: "System",
                score: 5_000 + Math.min(count, 999),
                tone: "amber",
                action: "Open maintenance board",
                run: () => openPath(model.maintenance.file.path),
            });
        }

        const executeArea = topAreaBy("execute");
        if (!model.errors.areas && executeArea) {
            const count = executeArea.execute.length;
            candidates.push({
                title: `${executeArea.name} has the largest execution queue`,
                reason: "Open Kanban workload",
                value: `${count} card${count === 1 ? "" : "s"}`,
                area: executeArea.name,
                score: 4_000 + Math.min(count, 999),
                tone: "coral",
                action: "Open Kanban",
                run: () => openPath(executeArea.todoFile.path),
            });
        }

        if (!model.errors.capture && model.capture.length && model.capture[0].age >= 3) {
            const oldest = model.capture[0];
            candidates.push({
                title: "An inbox capture is aging",
                reason: cleanTitle(oldest.title),
                value: ageLabel(oldest.age),
                area: "Inbox",
                score: 4_000 + Math.min(oldest.age, 999),
                tone: "coral",
                action: "Open capture",
                run: () => openPath(oldest.path),
            });
        }

        const curateArea = topAreaBy("curate");
        if (!model.errors.areas && curateArea) {
            const count = curateArea.curate.length;
            candidates.push({
                title: `${curateArea.name} has the largest triage queue`,
                reason: "Unresolved to-check items",
                value: `${count} item${count === 1 ? "" : "s"}`,
                area: curateArea.name,
                score: 3_000 + Math.min(count, 999),
                tone: "amber",
                action: "Open triage queue",
                run: () => openPath(curateArea.toCheckFile.path),
            });
        }

        const synthArea = topAreaBy("synthesize");
        if (!model.errors.areas && synthArea) {
            const count = synthArea.synthesize.length;
            candidates.push({
                title: `${synthArea.name} has the largest synthesis backlog`,
                reason: "Unsynthesized drafts and scouts",
                value: `${count} note${count === 1 ? "" : "s"}`,
                area: synthArea.name,
                score: 2_000 + Math.min(count, 999),
                tone: "cyan",
                action: "Open drafts",
                run: (trigger) =>
                    openItemsDrawer(
                        `${synthArea.name} synthesis backlog`,
                        synthArea.synthesize,
                        "No unsynthesized sources.",
                        trigger
                    ),
            });
        }

        const stalePlans = model.plans
            .filter((plan) => plan.stale)
            .sort((a, b) => b.age - a.age);
        if (!model.errors.areas && stalePlans.length) {
            const oldest = stalePlans[0];
            candidates.push({
                title:
                    stalePlans.length === 1
                        ? `${oldest.area} has a strategic plan going stale`
                        : `${stalePlans.length} strategic plans going stale`,
                reason: `Decided but untouched ${ageLabel(oldest.age)} — action or archive`,
                value: ageLabel(oldest.age),
                area: oldest.area,
                score: 4_500 + Math.min(oldest.age, 999),
                tone: "amber",
                action: "Open plan",
                run: () => openPath(oldest.path),
            });
        }

        const staleSources = model.synthesize
            .filter((item) => item.stale)
            .sort((a, b) => b.age - a.age);
        if (!model.errors.areas && staleSources.length) {
            const oldest = staleSources[0];
            candidates.push({
                title:
                    staleSources.length === 1
                        ? `A ${oldest.kind} has gone unsynthesized`
                        : `${staleSources.length} sources are aging unsynthesized`,
                reason: `${oldest.title} · ${oldest.area}`,
                value: ageLabel(oldest.age),
                area: oldest.area,
                score: 2_500 + Math.min(oldest.age, 999),
                tone: "cyan",
                action: "Open source",
                run: () => openPath(oldest.path),
            });
        }

        const dormant = model.areas
            .filter((area) => area.lastActive !== null && area.lastActive >= DORMANT_AREA_DAYS)
            .sort((a, b) => b.lastActive - a.lastActive);
        if (!model.errors.areas && dormant.length) {
            const quietest = dormant[0];
            candidates.push({
                title:
                    dormant.length === 1
                        ? `${quietest.name} has gone quiet`
                        : `${dormant.length} Areas have gone quiet`,
                reason: `No edits in ${ageLabel(quietest.lastActive)}`,
                value: ageLabel(quietest.lastActive),
                area: quietest.name,
                score: 1_500 + Math.min(quietest.lastActive, 999),
                tone: "amber",
                action: "Open area",
                run: (trigger) => renderAreaDrawer(quietest, trigger),
            });
        }

        return candidates
            .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
            .slice(0, 6);
    }

    const attention = attentionCandidates();
    if (attention.length) {
        const attentionSection = el("section", "sb-attention");
        const attentionHeader = el("div", "sb-section-header");
        attentionHeader.append(el("h2", "", "Needs Attention"));
        attentionSection.append(attentionHeader);
        const rows = el("div", "sb-attention-rows");
        attention.forEach((item) => {
            const row = el("div", `sb-attention-row tone-${item.tone}`);
            const copy = el("div", "sb-attention-copy");
            copy.append(el("strong", "", item.title));
            copy.append(el("span", "", `${item.reason} · ${item.area}`));
            const actions = el("div", "sb-attention-action");
            actions.append(el("span", "sb-attention-value", item.value));
            const action = button(
                "sb-text-action",
                item.action,
                `${item.action}: ${item.title}`,
                (event) => item.run(event.currentTarget)
            );
            actions.append(action);
            row.append(copy, actions);
            rows.append(row);
        });
        attentionSection.append(rows);
        lower.append(attentionSection);
    } else {
        lower.classList.add("has-no-attention");
    }

    const areaSection = el("section", "sb-area-section");
    const areaHeader = el("div", "sb-section-header sb-area-header");
    areaHeader.append(el("h2", "", "Area Pulse"));
    const filters = el("div", "sb-filters");
    areaHeader.append(filters);
    areaSection.append(areaHeader);
    const areaGrid = el("div", "sb-area-grid");
    areaSection.append(areaGrid);
    lower.append(areaSection);

    // Vault Vitals — a read-only footer strip of whole-vault stats (the "vision" layer).
    const vitals = el("section", "sb-vitals");
    vitals.setAttribute("aria-label", "Vault vitals");
    const totalLinks = model.errors.graph
        ? null
        : Object.values(app.metadataCache.resolvedLinks || {}).reduce(
              (sum, targets) =>
                  sum + Object.values(targets || {}).reduce((inner, count) => inner + count, 0),
              0
          );
    const staleSourceTotal = model.synthesize.filter((item) => item.stale).length;
    const dormantTotal = model.areas.filter(
        (area) => area.lastActive !== null && area.lastActive >= DORMANT_AREA_DAYS
    ).length;
    const vitalChips = [
        { label: "Notes", value: markdownFiles.length },
        { label: "Links", value: totalLinks ?? "—" },
        { label: "Areas", value: model.errors.areas ? "—" : model.areas.length },
        { label: "Plans", value: model.errors.areas ? "—" : model.plans.length },
        { label: "Stale", value: model.errors.areas ? "—" : staleSourceTotal, tone: staleSourceTotal ? "cyan" : "" },
        { label: "Dormant", value: model.errors.areas ? "—" : dormantTotal, tone: dormantTotal ? "amber" : "" },
        {
            label: "Broken",
            value: model.errors.graph ? "—" : model.graph.broken.length,
            tone: model.graph.broken.length ? "coral" : "",
            onClick: openGraphDrawer,
        },
        {
            label: "Orphans",
            value: model.errors.graph ? "—" : model.graph.orphans.length,
            tone: model.graph.orphans.length ? "amber" : "",
            onClick: openGraphDrawer,
        },
    ];
    vitalChips.forEach((chip) => {
        const node = chip.onClick
            ? button(
                  `sb-vital${chip.tone ? " tone-" + chip.tone : ""}`,
                  "",
                  `${chip.label}: ${chip.value}. Open details.`,
                  (event) => chip.onClick(event.currentTarget)
              )
            : el("div", `sb-vital${chip.tone ? " tone-" + chip.tone : ""}`);
        node.append(el("strong", "sb-vital-value", chip.value));
        node.append(el("span", "sb-vital-label", chip.label));
        vitals.append(node);
    });
    main.append(vitals);

    let areaFilter = "All";
    let areaLimit = 8;
    const filterValues = ["All", "Work", "Personal"];

    function severityFor(area, filteredAreas) {
        if (area.workload === 0) return { label: "Clear", className: "clear" };
        const maximum = Math.max(...filteredAreas.map((candidate) => candidate.workload), 1);
        const ratio = area.workload / maximum;
        if (ratio >= 0.75) return { label: "High", className: "high" };
        if (ratio >= 0.4) return { label: "Medium", className: "medium" };
        return { label: "Low", className: "low" };
    }

    function renderAreaDrawer(area, trigger) {
        const lastActiveText =
            area.lastActive === null ? "" : ` · last active ${ageLabel(area.lastActive)}`;
        openDrawer(
            area.name,
            `${area.domain} · ${area.workload} open item${area.workload === 1 ? "" : "s"}${lastActiveText}`,
            (parent) => {
                const links = el("div", "sb-quick-links");
                if (area.hub) {
                    links.append(
                        button("sb-link-button", "Open hub", `Open ${area.name} hub`, () =>
                            openPath(area.hub.path)
                        )
                    );
                }
                if (area.todoFile) {
                    links.append(
                        button("sb-link-button", "Open Kanban", `Open ${area.name} Kanban`, () =>
                            openPath(area.todoFile.path)
                        )
                    );
                }
                if (area.toCheckFile) {
                    links.append(
                        button(
                            "sb-link-button",
                            "Open triage queue",
                            `Open ${area.name} triage queue`,
                            () => openPath(area.toCheckFile.path)
                        )
                    );
                }
                parent.append(links);

                if (!area.hub) {
                    const missing = el("div", "sb-inline-warning");
                    missing.textContent = "Area hub missing; folder discovery fallback is active.";
                    parent.append(missing);
                }

                const groups = [
                    ["Execute", area.execute, "No open Kanban cards."],
                    ["Curate", area.curate, "No unresolved to-check items."],
                    ["Drafts", area.drafts, "No unsynthesized drafts."],
                    ["Scouts", area.scouts, "No unsynthesized scouts."],
                    ["Plans", area.plans, "No active strategic plans."],
                ];
                groups.forEach(([label, items, empty]) => {
                    const section = el("section", "sb-drawer-section");
                    section.append(el("h3", "", `${label} · ${items.length}`));
                    renderItemList(section, items, empty);
                    parent.append(section);
                });
            },
            trigger
        );
    }

    function updateAreaLimit() {
        const bounds = dashboard.getBoundingClientRect();
        const width = bounds.width || window.innerWidth;
        const height = bounds.height || window.innerHeight;
        const next = width < 560 ? 2 : width < 980 ? 5 : height >= 760 ? 11 : 8;
        if (next !== areaLimit) {
            areaLimit = next;
            renderAreas();
        }
    }

    function renderFilters() {
        filters.replaceChildren();
        filterValues.forEach((value) => {
            const control = button(
                "sb-filter",
                value,
                `Show ${value.toLowerCase()} Areas`,
                () => {
                    areaFilter = value;
                    renderFilters();
                    renderAreas();
                }
            );
            control.setAttribute("aria-pressed", String(areaFilter === value));
            filters.append(control);
        });
    }

    function renderAreas() {
        areaGrid.replaceChildren();
        if (model.errors.areas) {
            renderError(areaGrid, "Areas and workload could not be calculated.");
            return;
        }
        const filtered =
            areaFilter === "All"
                ? model.areas
                : model.areas.filter((area) => area.domain === areaFilter);
        if (!filtered.length) {
            renderEmpty(areaGrid, `No ${areaFilter.toLowerCase()} Areas were discovered.`);
            return;
        }

        filtered.slice(0, areaLimit).forEach((area) => {
            const severity = severityFor(area, filtered);
            const maximum = Math.max(...filtered.map((candidate) => candidate.workload), 1);
            const pressure = Math.round((area.workload / maximum) * 100);
            const areaStale =
                area.synthesize.some((item) => item.stale) || area.plans.some((plan) => plan.stale);
            const tile = button(
                `sb-area-tile severity-${severity.className}${areaStale ? " is-stale" : ""}`,
                "",
                `${area.name}, ${area.domain}, ${area.workload} open items, ${severity.label} pressure${areaStale ? ", has stale items" : ""}`,
                (event) => renderAreaDrawer(area, event.currentTarget)
            );
            const top = el("span", "sb-area-top");
            const name = el("span", "sb-area-name");
            name.append(el("strong", "", area.name));
            const workload = el("span", "sb-area-workload");
            workload.append(el("strong", "", area.workload), el("small", "", "Open"));
            top.append(name, workload);
            const bottom = el("span", "sb-area-bottom");
            bottom.append(
                el("span", `sb-severity severity-${severity.className}`, severity.label),
                el(
                    "span",
                    "sb-composition",
                    `${area.execute.length} execute · ${area.curate.length} curate · ${area.synthesize.length} synthesize`
                )
            );
            const pressureTrack = el("span", "sb-pressure-track");
            const pressureFill = el(
                "span",
                `sb-pressure-fill severity-${severity.className}`
            );
            pressureFill.style.width = `${pressure}%`;
            pressureTrack.append(pressureFill);
            tile.append(el("span", "sb-area-domain", area.domain), top, bottom, pressureTrack);
            areaGrid.append(tile);
        });

        const remaining = filtered.length - areaLimit;
        if (remaining > 0) {
            const more = button(
                "sb-area-more",
                `+${remaining} more`,
                `Open all ${filtered.length} Areas`,
                (event) =>
                    openDrawer(
                        `${areaFilter} Areas`,
                        `${filtered.length} dynamically discovered`,
                        (parent) => {
                            const list = el("div", "sb-full-area-list");
                            filtered.forEach((area) => {
                                const row = button(
                                    "sb-full-area",
                                    "",
                                    `Inspect ${area.name}`,
                                    (rowEvent) =>
                                        renderAreaDrawer(area, rowEvent.currentTarget)
                                );
                                const copy = el("span", "");
                                copy.append(
                                    el("strong", "", area.name),
                                    el("small", "", area.domain)
                                );
                                row.append(copy, el("span", "", `${area.workload} open`));
                                list.append(row);
                            });
                            parent.append(list);
                        },
                        event.currentTarget
                    )
            );
            areaGrid.append(more);
        }
    }

    renderFilters();
    updateAreaLimit();
    renderAreas();

    if (typeof ResizeObserver === "function") {
        const observer = new ResizeObserver(updateAreaLimit);
        observer.observe(dashboard);
        dv.component?.register?.(() => observer.disconnect());
    }
};

runDashboard().catch((error) => {
    console.error("Second Brain dashboard failed", error);
    const host = dv.container;
    Array.from(host.children)
        .filter((child) => child.tagName !== "STYLE")
        .forEach((child) => child.remove());
    const state = host.ownerDocument.createElement("div");
    state.className = "sb-dashboard sb-fatal";
    const title = host.ownerDocument.createElement("strong");
    title.textContent = "Dashboard unavailable";
    const detail = host.ownerDocument.createElement("span");
    detail.textContent = error?.message || String(error);
    state.append(title, detail);
    host.append(state);
});
