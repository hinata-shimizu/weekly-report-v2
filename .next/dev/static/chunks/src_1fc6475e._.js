(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/reportUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TAGS",
    ()=>DEFAULT_TAGS,
    "DEFAULT_TAG_LABEL",
    ()=>DEFAULT_TAG_LABEL,
    "PRIORITY_LABEL",
    ()=>PRIORITY_LABEL,
    "PRIORITY_ORDER",
    ()=>PRIORITY_ORDER,
    "STATUS_LABEL",
    ()=>STATUS_LABEL,
    "STATUS_ORDER",
    ()=>STATUS_ORDER,
    "STORAGE_KEY",
    ()=>STORAGE_KEY,
    "TAG_COLORS",
    ()=>TAG_COLORS,
    "TAG_STORAGE_KEY",
    ()=>TAG_STORAGE_KEY,
    "TASKS_KEY_PREFIX",
    ()=>TASKS_KEY_PREFIX,
    "buildStats",
    ()=>buildStats,
    "calcEstimateInsights",
    ()=>calcEstimateInsights,
    "clamp",
    ()=>clamp,
    "cn",
    ()=>cn,
    "findThisWeekReport",
    ()=>findThisWeekReport,
    "formatAvgDiff",
    ()=>formatAvgDiff,
    "formatDate",
    ()=>formatDate,
    "formatHMFromSecondsSimple",
    ()=>formatHMFromSecondsSimple,
    "formatJPDateTime",
    ()=>formatJPDateTime,
    "formatWeekRangeTitle",
    ()=>formatWeekRangeTitle,
    "generateCsvText",
    ()=>generateCsvText,
    "generateNotionText",
    ()=>generateNotionText,
    "generateReflectionText",
    ()=>generateReflectionText,
    "generateSampleReports",
    ()=>generateSampleReports,
    "generateSlackText",
    ()=>generateSlackText,
    "getRunningExtraSeconds",
    ()=>getRunningExtraSeconds,
    "getTagColor",
    ()=>getTagColor,
    "getTagColorHex",
    ()=>getTagColorHex,
    "getTotalActualSeconds",
    ()=>getTotalActualSeconds,
    "getWeekRange",
    ()=>getWeekRange,
    "loadAllReportsStats",
    ()=>loadAllReportsStats,
    "loadStoredTags",
    ()=>loadStoredTags,
    "loadTasks",
    ()=>loadTasks,
    "normalizeTask",
    ()=>normalizeTask,
    "pickTopBySeconds",
    ()=>pickTopBySeconds,
    "pickTopTagsBySeconds",
    ()=>pickTopTagsBySeconds,
    "safeTagLabel",
    ()=>safeTagLabel,
    "saveStoredTags",
    ()=>saveStoredTags,
    "sortReportsDesc",
    ()=>sortReportsDesc
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
const PRIORITY_ORDER = [
    "p0",
    "p1",
    "p2"
];
const STATUS_ORDER = [
    "not_decided",
    "todo",
    "doing",
    "done"
];
const PRIORITY_LABEL = {
    p0: "P0",
    p1: "P1",
    p2: "P2"
};
const STATUS_LABEL = {
    not_decided: "未決定",
    todo: "未着手",
    doing: "進行中",
    done: "完了"
};
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function normalizeTask(t) {
    return {
        id: t?.id ?? crypto.randomUUID(),
        title: typeof t?.title === "string" ? t.title : "",
        status: STATUS_ORDER.includes(t?.status) ? t.status : "todo",
        tag: typeof t?.tag === "string" ? t.tag : null,
        priority: PRIORITY_ORDER.includes(t?.priority) ? t.priority : "p1",
        isToday: typeof t?.isToday === "boolean" ? t.isToday : false,
        estimatedMinutes: typeof t?.estimatedMinutes === "number" ? t.estimatedMinutes : null,
        actualSeconds: typeof t?.actualSeconds === "number" ? t.actualSeconds : 0,
        isRunning: false,
        startedAt: null
    };
}
function getRunningExtraSeconds(task, now) {
    if (!task.isRunning || !task.startedAt) return 0;
    return Math.max(0, Math.floor((now - task.startedAt) / 1000));
}
function getTotalActualSeconds(task, now) {
    return task.actualSeconds + getRunningExtraSeconds(task, now);
}
function formatJPDateTime(ms) {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${day} ${hh}:${mm}`;
}
function pickTopBySeconds(tasks, now, n) {
    const arr = tasks.map((t)=>({
            t,
            sec: getTotalActualSeconds(t, now)
        })).filter((x)=>x.sec > 0).sort((a, b)=>b.sec - a.sec).slice(0, n);
    return arr;
}
function pickTopTagsBySeconds(tasks, now, n) {
    const map = new Map();
    for (const t of tasks){
        const tag = safeTagLabel(t.tag ?? "");
        map.set(tag, (map.get(tag) ?? 0) + getTotalActualSeconds(t, now));
    }
    return Array.from(map.entries()).map(([tag, sec])=>({
            tag,
            sec
        })).filter((x)=>x.sec > 0).sort((a, b)=>b.sec - a.sec).slice(0, n);
}
function calcEstimateInsights(tasks, now) {
    const withEst = tasks.filter((t)=>t.estimatedMinutes != null && t.estimatedMinutes >= 0);
    const diffs = withEst.map((t)=>{
        const actualMin = Math.floor(getTotalActualSeconds(t, now) / 60);
        const estMin = t.estimatedMinutes ?? 0;
        const diff = actualMin - estMin;
        return {
            t,
            actualMin,
            estMin,
            diff
        };
    });
    const overruns = diffs.filter((x)=>x.estMin > 0 && x.diff > 0).sort((a, b)=>b.diff - a.diff);
    const underruns = diffs.filter((x)=>x.estMin > 0 && x.diff < 0).sort((a, b)=>a.diff - b.diff);
    const avgDiff = diffs.length > 0 ? diffs.reduce((sum, x)=>sum + x.diff, 0) / diffs.length : null;
    return {
        withEstCount: diffs.length,
        avgDiff,
        overruns,
        underruns
    };
}
function generateReflectionText(tasks, now, topN = 5) {
    const done = tasks.filter((t)=>t.status === "done");
    const notDone = tasks.filter((t)=>t.status !== "done");
    const totalSec = tasks.reduce((sum, t)=>sum + getTotalActualSeconds(t, now), 0);
    const doneSec = done.reduce((sum, t)=>sum + getTotalActualSeconds(t, now), 0);
    const notDoneSec = notDone.reduce((sum, t)=>sum + getTotalActualSeconds(t, now), 0);
    const topTasks = pickTopBySeconds(tasks, now, 3);
    const topTags = pickTopTagsBySeconds(tasks, now, 5);
    // High Priority Done
    const doneP0 = done.filter((t)=>t.priority === "p0");
    // Low Priority but time consuming (Potential Problem)
    const timeWasters = done.filter((t)=>t.priority === "p2" && getTotalActualSeconds(t, now) > 30 * 60) // > 30 mins
    .sort((a, b)=>getTotalActualSeconds(b, now) - getTotalActualSeconds(a, now));
    const todayNotDone = tasks.filter((t)=>t.isToday && t.status !== "done").sort((a, b)=>{
        const pr = {
            p0: 0,
            p1: 1,
            p2: 2
        };
        return pr[a.priority] - pr[b.priority];
    });
    const { withEstCount, avgDiff, overruns } = calcEstimateInsights(tasks, now);
    const lines = [];
    lines.push(`【🤖 自動生成サマリー ${formatJPDateTime(now)}】`);
    lines.push("");
    // 1. Overview
    lines.push("📊 1. 定量データ");
    lines.push(`- 稼働時間：${formatHMFromSecondsSimple(totalSec)}（完了 ${formatHMFromSecondsSimple(doneSec)} / 未完了 ${formatHMFromSecondsSimple(notDoneSec)}）`);
    lines.push(`- タスク消化率：${Math.round(done.length / Math.max(tasks.length, 1) * 100)}%（完了 ${done.length} / 全 ${tasks.length}）`);
    if (doneP0.length > 0) {
        lines.push(`- ★重要タスク(P0)達成数：${doneP0.length}件`);
    }
    lines.push("");
    // 2. Focus Area (Tags)
    lines.push("🎨 2. 時間の使い方（タグ分析）");
    if (topTags.length > 0) {
        topTags.forEach((row)=>{
            const pct = Math.round(row.sec / Math.max(totalSec, 1) * 100);
            lines.push(`- ${row.tag}：${formatHMFromSecondsSimple(row.sec)} (${pct}%)`);
        });
    } else {
        lines.push("- データなし");
    }
    lines.push("");
    // 3. Highlights
    lines.push("🏆 3. 主な成果");
    if (done.length === 0) {
        lines.push("- 完了タスクなし");
    } else {
        // List P0 first
        if (doneP0.length > 0) {
            lines.push("【P0：重要】即戦力として完了！");
            doneP0.forEach((t)=>lines.push(`  ✓ ${t.title} (${formatHMFromSecondsSimple(getTotalActualSeconds(t, now))})`));
        }
        // Others (Top 5 by time)
        const otherDone = done.filter((t)=>t.priority !== "p0").sort((a, b)=>getTotalActualSeconds(b, now) - getTotalActualSeconds(a, now)).slice(0, 5);
        if (otherDone.length > 0) {
            if (doneP0.length > 0) lines.push("【その他：主要な完了】");
            otherDone.forEach((t)=>lines.push(`  ✓ ${t.title} (${formatHMFromSecondsSimple(getTotalActualSeconds(t, now))})`));
        }
    }
    lines.push("");
    // 4. Issues / Next Actions
    lines.push("⚠️ 4. 課題・ネクストアクション");
    if (overruns.length > 0) {
        lines.push("- ⏰ 時間超過（見積もりとのズレ大）");
        overruns.slice(0, 3).forEach((x)=>{
            lines.push(`  ! ${x.t.title}：予 +${Math.round(x.diff)}分オーバー`);
        });
    }
    if (timeWasters.length > 0) {
        lines.push("- 🐢 優先度低だが時間消費大（要見直し？）");
        timeWasters.slice(0, 3).forEach((t)=>{
            lines.push(`  ? ${t.title} (P2)：${formatHMFromSecondsSimple(getTotalActualSeconds(t, now))}`);
        });
    }
    if (todayNotDone.length > 0) {
        lines.push("- 🔥 本日の積み残し");
        todayNotDone.slice(0, 3).forEach((t)=>{
            lines.push(`  -> ${t.title} (${PRIORITY_LABEL[t.priority]})`);
        });
    }
    if (overruns.length === 0 && timeWasters.length === 0 && todayNotDone.length === 0) {
        lines.push("- 特になし。順調です！🎉");
    }
    return lines.join("\n");
}
function generateCsvText(tasks, now) {
    if (tasks.length === 0) return "";
    const escapeCsv = (value)=>{
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
    };
    const header = "タスク名,タグ,優先度,Today,ステータス,見積もり(分),実績(分),差分(分)";
    const lines = tasks.map((task)=>{
        const totalSeconds = getTotalActualSeconds(task, now);
        const actualMinutes = Math.floor(totalSeconds / 60);
        const est = task.estimatedMinutes;
        let diffStr = "";
        if (est != null) {
            const diff = actualMinutes - est;
            if (diff > 0) diffStr = `+${diff}`;
            else if (diff === 0) diffStr = "0";
            else diffStr = `${diff}`;
        }
        const title = escapeCsv(task.title);
        const tagStr = escapeCsv(task.tag ?? "");
        const priorityStr = escapeCsv(PRIORITY_LABEL[task.priority]);
        const todayStr = task.isToday ? "1" : "0";
        const statusStr = escapeCsv(STATUS_LABEL[task.status]);
        const estStr = est != null ? String(est) : "";
        const actualStr = String(actualMinutes);
        return [
            title,
            tagStr,
            priorityStr,
            todayStr,
            statusStr,
            estStr,
            actualStr,
            diffStr
        ].join(",");
    });
    return [
        header,
        ...lines
    ].join("\n");
}
const STORAGE_KEY = "weekly-report-list";
const TASKS_KEY_PREFIX = "weekly-report-tasks-";
const TAG_STORAGE_KEY = "weekly-report-tags";
const DEFAULT_TAG_LABEL = "(未設定)";
const DEFAULT_TAGS = [
    "開発",
    "学習",
    "就活",
    "事務",
    "生活"
];
function loadStoredTags() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = window.localStorage.getItem(TAG_STORAGE_KEY);
    if (!raw) {
        // If empty, initialize with defaults
        window.localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(DEFAULT_TAGS));
        return DEFAULT_TAGS;
    }
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return DEFAULT_TAGS;
        return parsed;
    } catch  {
        return DEFAULT_TAGS;
    }
}
function saveStoredTags(tags) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
}
function getWeekRange(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0:日, 1:月, ... 6:土
    const diffFromMonday = (day + 6) % 7; // 月曜を0にする
    const start = new Date(d);
    start.setDate(d.getDate() - diffFromMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return {
        start,
        end
    };
}
function formatWeekRangeTitle(startIso, endIso) {
    const s = new Date(startIso);
    const e = new Date(endIso);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "週報";
    const sStr = s.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric"
    });
    const eStr = e.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric"
    });
    return `${sStr}～${eStr}の週報`;
}
function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}
function sortReportsDesc(reports) {
    return [
        ...reports
    ].sort((a, b)=>{
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) return tb - ta;
        const na = Number(a.id);
        const nb = Number(b.id);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
        return 0;
    });
}
function safeTagLabel(tag) {
    if (typeof tag !== "string") return DEFAULT_TAG_LABEL;
    const t = tag.trim();
    return t ? t : DEFAULT_TAG_LABEL;
}
function formatHMFromSecondsSimple(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h <= 0) return `${m}分`;
    if (m === 0) return `${h}時間`;
    return `${h}時間${m}分`;
}
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function loadTasks(reportId, nowMs) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = window.localStorage.getItem(`${TASKS_KEY_PREFIX}${reportId}`);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((t)=>{
            const baseActual = typeof t?.actualSeconds === "number" ? t.actualSeconds : 0;
            const isRunning = !!t?.isRunning;
            const startedAt = typeof t?.startedAt === "number" ? t.startedAt : null;
            // 一覧ページでは「この瞬間の経過分」を加算して表示だけ更新（リアルタイム更新はしない）
            const extra = isRunning && startedAt ? Math.max(0, Math.floor((nowMs - startedAt) / 1000)) : 0;
            const status = t?.status === "not_decided" || t?.status === "todo" || t?.status === "doing" || t?.status === "done" ? t.status : "todo";
            return {
                id: typeof t?.id === "string" ? t.id : crypto.randomUUID(),
                title: typeof t?.title === "string" ? t.title : "",
                status,
                tag: typeof t?.tag === "string" ? t.tag : null,
                priority: PRIORITY_ORDER.includes(t?.priority) ? t.priority : "p1",
                estimatedMinutes: typeof t?.estimatedMinutes === "number" && t.estimatedMinutes >= 0 ? Math.floor(t.estimatedMinutes) : null,
                actualSeconds: baseActual + extra,
                isToday: typeof t?.isToday === "boolean" ? t.isToday : false,
                isRunning,
                startedAt
            };
        });
    } catch  {
        return [];
    }
}
function buildStats(tasks) {
    const totalCount = tasks.length;
    const doneCount = tasks.filter((t)=>t.status === "done").length;
    const todayRemaining = tasks.filter((t)=>t.isToday && t.status !== "done").length;
    const totalActualSeconds = tasks.reduce((sum, t)=>sum + (t.actualSeconds ?? 0), 0);
    // 見積精度（平均差分 = 実績(分) - 見積(分)）
    const withEst = tasks.filter((t)=>t.estimatedMinutes != null);
    const estimatedCount = withEst.length;
    let avgDiffMinutes = null;
    if (estimatedCount > 0) {
        const diffs = withEst.map((t)=>{
            const actualMin = Math.floor((t.actualSeconds ?? 0) / 60);
            const estMin = t.estimatedMinutes ?? 0;
            return actualMin - estMin;
        });
        avgDiffMinutes = diffs.reduce((a, b)=>a + b, 0) / diffs.length;
    }
    // タグ別（上位3）
    const map = new Map();
    for (const t of tasks){
        const key = safeTagLabel(t.tag);
        map.set(key, (map.get(key) ?? 0) + (t.actualSeconds ?? 0));
    }
    const topTags = Array.from(map.entries()).map(([tag, seconds])=>({
            tag,
            seconds
        })).filter((x)=>x.seconds > 0).sort((a, b)=>b.seconds - a.seconds).slice(0, 3);
    // ハイライト抽出: P0の完了タスク、または時間がかかった完了タスク上位
    const highlights = tasks.filter((t)=>t.status === "done").sort((a, b)=>{
        // Priority first (p0 < p1 < p2)
        const pRank = {
            p0: 0,
            p1: 1,
            p2: 2
        };
        if (a.priority !== b.priority) return pRank[a.priority] - pRank[b.priority];
        // Then duration desc
        return Math.abs(getTotalActualSeconds(b, 0)) - Math.abs(getTotalActualSeconds(a, 0));
    }).slice(0, 3);
    return {
        totalCount,
        doneCount,
        todayRemaining,
        totalActualSeconds,
        estimatedCount,
        avgDiffMinutes,
        topTags,
        highlights
    };
}
function findThisWeekReport(reports) {
    const nowMs = Date.now();
    const candidates = reports.filter((r)=>{
        const s = new Date(r.weekStart).getTime();
        const e = new Date(r.weekEnd).getTime();
        if (Number.isNaN(s) || Number.isNaN(e)) return false;
        return s <= nowMs && nowMs <= e;
    });
    if (candidates.length === 0) return null;
    // createdAtが新しいものを優先
    return [
        ...candidates
    ].sort((a, b)=>{
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
    })[0];
}
function formatAvgDiff(avg) {
    if (avg == null) return {
        label: "—",
        className: "text-slate-500"
    };
    const rounded = Math.round(avg * 10) / 10;
    if (rounded === 0) return {
        label: "±0分",
        className: "text-slate-700"
    };
    if (rounded > 0) return {
        label: `+${rounded}分`,
        className: "text-red-600"
    };
    return {
        label: `${rounded}分`,
        className: "text-emerald-600"
    };
}
function getTagColor(tag) {
    if (!tag) return "bg-slate-100 text-slate-600 border-slate-200";
    // Simple hash
    let hash = 0;
    for(let i = 0; i < tag.length; i++){
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Predefined Tailwind classes for badges
    const colors = [
        "bg-red-50 text-red-700 border-red-100",
        "bg-orange-50 text-orange-700 border-orange-100",
        "bg-amber-50 text-amber-700 border-amber-100",
        "bg-yellow-50 text-yellow-700 border-yellow-100",
        "bg-lime-50 text-lime-700 border-lime-100",
        "bg-green-50 text-green-700 border-green-100",
        "bg-emerald-50 text-emerald-700 border-emerald-100",
        "bg-teal-50 text-teal-700 border-teal-100",
        "bg-cyan-50 text-cyan-700 border-cyan-100",
        "bg-sky-50 text-sky-700 border-sky-100",
        "bg-blue-50 text-blue-700 border-blue-100",
        "bg-indigo-50 text-indigo-700 border-indigo-100",
        "bg-violet-50 text-violet-700 border-violet-100",
        "bg-purple-50 text-purple-700 border-purple-100",
        "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
        "bg-pink-50 text-pink-700 border-pink-100",
        "bg-rose-50 text-rose-700 border-rose-100"
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}
const TAG_COLORS = {
    "開発": "#6366f1",
    "学習": "#10b981",
    "事務": "#f59e0b",
    "就活": "#ec4899",
    "生活": "#3b82f6",
    "その他": "#94a3b8"
};
function getTagColorHex(tag) {
    if (TAG_COLORS[tag]) return TAG_COLORS[tag];
    // Randomish pastel
    let hash = 0;
    for(let i = 0; i < tag.length; i++){
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
}
function loadAllReportsStats(reports) {
    const data = [];
    const now = Date.now();
    // Sort reports by date asc (Oldest -> Newest)
    const sorted = [
        ...reports
    ].sort((a, b)=>a.createdAt.localeCompare(b.createdAt));
    for (const r of sorted){
        const tasks = loadTasks(r.id, now);
        // Stats
        const total = tasks.length;
        const done = tasks.filter((t)=>t.status === "done").length;
        const rate = total > 0 ? Math.round(done / total * 100) : 0;
        let totalSec = 0;
        const tagMap = {};
        tasks.forEach((t)=>{
            const sec = getTotalActualSeconds(t, now);
            totalSec += sec;
            const tag = safeTagLabel(t.tag);
            tagMap[tag] = (tagMap[tag] ?? 0) + sec;
        });
        const hours = parseFloat((totalSec / 3600).toFixed(1));
        // Label
        const d = new Date(r.createdAt);
        const label = !Number.isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()}` : "N/A";
        const row = {
            id: r.id,
            label,
            focusTime: hours,
            doneCount: done,
            completionRate: rate
        };
        // Add tags to row (converted to hours)
        Object.keys(tagMap).forEach((tag)=>{
            row[tag] = parseFloat((tagMap[tag] / 3600).toFixed(1));
        });
        data.push(row);
    }
    return data;
}
function generateSampleReports() {
    const samples = [];
    const now = new Date();
    // Generate last 8 weeks
    for(let i = 8; i > 0; i--){
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - i * 7); // Go back i weeks
        const { start, end } = getWeekRange(targetDate);
        const id = crypto.randomUUID();
        const weekStartIso = start.toISOString();
        const weekEndIso = end.toISOString();
        const report = {
            id,
            title: formatWeekRangeTitle(weekStartIso, weekEndIso),
            description: "サンプルデータ：過去の活動履歴です。",
            createdAt: targetDate.toISOString(),
            weekStart: weekStartIso,
            weekEnd: weekEndIso
        };
        samples.push(report);
        // Generate Dummy Tasks
        const tasks = [];
        const taskCount = 5 + Math.floor(Math.random() * 8); // 5-12 tasks
        for(let j = 0; j < taskCount; j++){
            const isDone = Math.random() > 0.3;
            const tag = DEFAULT_TAGS[Math.floor(Math.random() * DEFAULT_TAGS.length)];
            const durationMin = 30 + Math.floor(Math.random() * 120); // 30-150 min
            const task = {
                id: crypto.randomUUID(),
                title: `${tag}のタスクサンプル ${j + 1}`,
                status: isDone ? "done" : "todo",
                tag,
                priority: Math.random() > 0.8 ? "p0" : Math.random() > 0.5 ? "p1" : "p2",
                isToday: false,
                estimatedMinutes: durationMin,
                actualSeconds: isDone ? durationMin * 60 : 0,
                isRunning: false,
                startedAt: null
            };
            tasks.push(task);
        }
        // Save tasks to localStorage directly here? 
        // No, utility functions should probably format data, but side-effect here is cleaner for "One Button" action.
        if ("TURBOPACK compile-time truthy", 1) {
            window.localStorage.setItem(`${TASKS_KEY_PREFIX}${id}`, JSON.stringify(tasks));
        }
    }
    return samples;
}
function generateSlackText(report, tasks, note) {
    const doneTasks = tasks.filter((t)=>t.status === "done");
    const doingTasks = tasks.filter((t)=>t.status === "doing");
    // Removed wipTasks as it duplicated doingTasks or used wrong status
    const todoTasks = tasks.filter((t)=>t.status === "todo");
    const formatTask = (t)=>{
        const time = formatHMFromSecondsSimple(getTotalActualSeconds(t, 0));
        const est = t.estimatedMinutes ? ` (予${t.estimatedMinutes}分)` : "";
        return `• ${t.title} [${time}${est}]`;
    };
    return `*${report.title}*
${report.description ? `_${report.description}_` : ""}

*✅ 完了 (${doneTasks.length})*
${doneTasks.map(formatTask).join("\n") || "なし"}

*🚧 進行中 (${doingTasks.length})*
${doingTasks.map(formatTask).join("\n") || "なし"}

*📅 トゥドゥ (${todoTasks.length})*
${todoTasks.map(formatTask).join("\n") || "なし"}

*💭 振り返り*
${note || "記述なし"}
`;
}
function generateNotionText(report, tasks, note) {
    const doneTasks = tasks.filter((t)=>t.status === "done");
    const doingTasks = tasks.filter((t)=>t.status === "doing");
    const todoTasks = tasks.filter((t)=>t.status === "todo");
    const formatTask = (t)=>{
        const time = formatHMFromSecondsSimple(getTotalActualSeconds(t, 0));
        return `- [ ] ${t.title} #time(${time})`;
    };
    // Notion uses markdown-like structure
    return `# ${report.title}
${report.description}

## 今週の進捗
### 完了
${doneTasks.map(formatTask).join("\n") || "なし"}

### 進行中
${doingTasks.map(formatTask).join("\n") || "なし"}

### 今後の予定
${todoTasks.map(formatTask).join("\n") || "なし"}

## 振り返り
${note}
`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gamification/UserLevelCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniUserLevelBadge",
    ()=>MiniUserLevelBadge,
    "UserLevelCard",
    ()=>UserLevelCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"use client";
;
;
function UserLevelCard({ levelInfo }) {
    const { level, rank, currentLevelXP, nextLevelXP, progressPercent, totalXP } = levelInfo;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden rounded-2xl bg-white/60 dark:bg-black/80 backdrop-blur-md border border-white/40 dark:border-[#2f3336] shadow-sm p-4 w-full max-w-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-current ${rank.color}`
            }, void 0, false, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-bold tracking-wider uppercase opacity-70 ${rank.color}`,
                                children: rank.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                                lineNumber: 21,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-slate-500",
                                        children: "Lv."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                                        lineNumber: 25,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xl font-black text-slate-800 tracking-tight",
                                        children: level
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                                        lineNumber: 26,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                                lineNumber: 24,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                        lineNumber: 20,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#71767b] font-bold",
                                children: "Total XP"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                                lineNumber: 31,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-mono font-medium text-slate-600 dark:text-[#e7e9ea]",
                                children: totalXP.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                                lineNumber: 32,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                        lineNumber: 30,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-3 w-full bg-slate-100 dark:bg-[#16181c] rounded-full overflow-hidden border border-slate-200/50 dark:border-[#2f3336]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        width: 0
                    },
                    animate: {
                        width: `${progressPercent}%`
                    },
                    transition: {
                        duration: 1,
                        ease: "easeOut"
                    },
                    className: `absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500`
                }, void 0, false, {
                    fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                    lineNumber: 38,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-1 text-[10px] font-medium text-slate-400 dark:text-[#71767b]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            currentLevelXP,
                            " XP"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "NEXT: ",
                            nextLevelXP - currentLevelXP,
                            " XP"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 46,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
_c = UserLevelCard;
function MiniUserLevelBadge({ levelInfo }) {
    const { level, rank } = levelInfo;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-[#16181c] backdrop-blur-sm rounded-full border border-white/60 dark:border-[#2f3336] shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-[10px] font-bold uppercase tracking-wider ${rank.color}`,
                children: rank.name
            }, void 0, false, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 58,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-px h-3 bg-slate-300 dark:bg-[#2f3336]"
            }, void 0, false, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-bold text-slate-700 dark:text-[#e7e9ea]",
                children: [
                    "Lv.",
                    level
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gamification/UserLevelCard.tsx",
        lineNumber: 57,
        columnNumber: 9
    }, this);
}
_c1 = MiniUserLevelBadge;
var _c, _c1;
__turbopack_context__.k.register(_c, "UserLevelCard");
__turbopack_context__.k.register(_c1, "MiniUserLevelBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/coaching/CoachCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoachCard",
    ()=>CoachCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function CoachCard({ advice, className = "" }) {
    _s();
    // Typing effect state
    const [displayedMessage, setDisplayedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachCard.useEffect": ()=>{
            setDisplayedMessage("");
            setIsTyping(true);
            let index = 0;
            const msg = advice.message;
            const timer = setInterval({
                "CoachCard.useEffect.timer": ()=>{
                    if (index < msg.length) {
                        setDisplayedMessage({
                            "CoachCard.useEffect.timer": (prev)=>prev + msg.charAt(index)
                        }["CoachCard.useEffect.timer"]);
                        index++;
                    } else {
                        setIsTyping(false);
                        clearInterval(timer);
                    }
                }
            }["CoachCard.useEffect.timer"], 30); // Speed of typing
            return ({
                "CoachCard.useEffect": ()=>clearInterval(timer)
            })["CoachCard.useEffect"];
        }
    }["CoachCard.useEffect"], [
        advice
    ]);
    const getIcon = (type)=>{
        switch(type){
            case "warning":
                return "⚠️";
            case "success":
                return "🎉";
            case "encouragement":
                return "☕";
            default:
                return "💡";
        }
    };
    const getColors = (type)=>{
        switch(type){
            case "warning":
                return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-black dark:text-[#ffd400] dark:border-[#332600]";
            case "success":
                return "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-black dark:text-[#1d9bf0] dark:border-[#0a2949]";
            case "encouragement":
                return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-black dark:text-[#00ba7c] dark:border-[#052e1f]";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-black dark:text-[#e7e9ea] dark:border-[#2f3336]";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-start gap-4 p-4 rounded-xl border shadow-sm ${getColors(advice.type)} ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 text-3xl bg-white dark:bg-[#16181c] p-2 rounded-full shadow-sm border border-black/5 dark:border-[#2f3336]",
                children: "🤖"
            }, void 0, false, {
                fileName: "[project]/src/components/coaching/CoachCard.tsx",
                lineNumber: 56,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-bold uppercase tracking-wider opacity-60",
                                children: "AI Coach"
                            }, void 0, false, {
                                fileName: "[project]/src/components/coaching/CoachCard.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: getIcon(advice.type)
                            }, void 0, false, {
                                fileName: "[project]/src/components/coaching/CoachCard.tsx",
                                lineNumber: 62,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/coaching/CoachCard.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-bold text-sm mb-1",
                        children: advice.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/coaching/CoachCard.tsx",
                        lineNumber: 64,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm leading-relaxed min-h-[1.5em] font-medium opacity-90",
                        children: [
                            displayedMessage,
                            isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "animate-pulse inline-block w-1.5 h-3 ml-0.5 bg-current align-middle"
                            }, void 0, false, {
                                fileName: "[project]/src/components/coaching/CoachCard.tsx",
                                lineNumber: 67,
                                columnNumber: 34
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/coaching/CoachCard.tsx",
                        lineNumber: 65,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/coaching/CoachCard.tsx",
                lineNumber: 59,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/coaching/CoachCard.tsx",
        lineNumber: 55,
        columnNumber: 9
    }, this);
}
_s(CoachCard, "mDm6SzAhMx3Lv4yxb7PDz8XyI0k=");
_c = CoachCard;
var _c;
__turbopack_context__.k.register(_c, "CoachCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SunIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SunIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/SunIcon.js [app-client] (ecmascript) <export default as SunIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MoonIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoonIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MoonIcon.js [app-client] (ecmascript) <export default as MoonIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ComputerDesktopIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ComputerDesktopIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ComputerDesktopIcon.js [app-client] (ecmascript) <export default as ComputerDesktopIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ThemeToggle({ className }) {
    _s();
    const { theme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>{
            setMounted(true);
        }
    }["ThemeToggle.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200 dark:bg-black dark:border-[#2f3336]", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme("light"),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1.5 rounded transition-all", theme === "light" ? "bg-white text-yellow-500 shadow-sm dark:bg-[#16181c]" : "text-slate-400 hover:text-slate-600 dark:text-[#71767b] dark:hover:text-[#e7e9ea]"),
                title: "Light Mode",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SunIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SunIcon$3e$__["SunIcon"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/ThemeToggle.tsx",
                    lineNumber: 31,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ThemeToggle.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme("dark"),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1.5 rounded transition-all", theme === "dark" ? "bg-white text-indigo-500 shadow-sm dark:bg-[#16181c] dark:text-[#1d9bf0]" : "text-slate-400 hover:text-slate-600 dark:text-[#71767b] dark:hover:text-[#e7e9ea]"),
                title: "Dark Mode",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MoonIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoonIcon$3e$__["MoonIcon"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/ThemeToggle.tsx",
                    lineNumber: 44,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ThemeToggle.tsx",
                lineNumber: 33,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme("system"),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1.5 rounded transition-all", theme === "system" ? "bg-white text-slate-700 shadow-sm dark:bg-[#16181c] dark:text-[#e7e9ea]" : "text-slate-400 hover:text-slate-600 dark:text-[#71767b] dark:hover:text-[#e7e9ea]"),
                title: "System Preference",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ComputerDesktopIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ComputerDesktopIcon$3e$__["ComputerDesktopIcon"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/ThemeToggle.tsx",
                    lineNumber: 57,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ThemeToggle.tsx",
                lineNumber: 46,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ThemeToggle.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_s(ThemeToggle, "uGU5l7ciDSfqFDe6wS7vfMb29jQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ReportDetailHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportDetailHeader",
    ()=>ReportDetailHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gamification$2f$UserLevelCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gamification/UserLevelCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$coaching$2f$CoachCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/coaching/CoachCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeToggle.tsx [app-client] (ecmascript)");
;
;
;
;
;
function ReportDetailHeader({ id, loaded, savedMessage, totalCount, countsByStatus, levelInfo, advice }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/reports",
                        className: "inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                children: "←"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 36,
                                columnNumber: 21
                            }, this),
                            " 週報一覧に戻る"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportDetailHeader.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl md:text-3xl font-bold text-slate-900 dark:text-[#e7e9ea] tracking-tight flex items-center gap-3 flex-wrap",
                        children: [
                            "週報タスク管理 ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-lg font-normal text-slate-400 dark:text-[#71767b]",
                                children: [
                                    "#",
                                    id
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 39,
                                columnNumber: 29
                            }, this),
                            levelInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gamification$2f$UserLevelCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniUserLevelBadge"], {
                                levelInfo: levelInfo
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 40,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportDetailHeader.tsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed",
                        children: [
                            "今週やることを箇条書きで洗い出して、ステータス・見積もり時間・実績時間を管理します。",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                className: "hidden md:block"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 43,
                                columnNumber: 63
                            }, this),
                            "入力内容はすべて「ブラウザ（この端末）」に自動保存されます。"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportDetailHeader.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    !loaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-400 animate-pulse",
                        children: "読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/ReportDetailHeader.tsx",
                        lineNumber: 46,
                        columnNumber: 29
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-end gap-3 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-end gap-2 text-[10px] md:text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {
                                className: "mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 51,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                label: "合計",
                                value: totalCount,
                                color: "slate"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 52,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                label: "完了",
                                value: countsByStatus.done,
                                color: "emerald"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 53,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                label: "進行中",
                                value: countsByStatus.doing,
                                color: "blue"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 54,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                label: "未着手",
                                value: countsByStatus.todo,
                                color: "amber"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                                lineNumber: 55,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportDetailHeader.tsx",
                        lineNumber: 50,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 flex items-center",
                        children: savedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[11px] font-medium text-emerald-600 animate-fade-in-out",
                            children: savedMessage
                        }, void 0, false, {
                            fileName: "[project]/src/components/ReportDetailHeader.tsx",
                            lineNumber: 60,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ReportDetailHeader.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, this),
            advice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full md:absolute md:top-full md:right-0 md:mt-4 md:w-96 z-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$coaching$2f$CoachCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoachCard"], {
                    advice: advice,
                    className: "bg-white/90 backdrop-blur shadow-lg border-opacity-60"
                }, void 0, false, {
                    fileName: "[project]/src/components/ReportDetailHeader.tsx",
                    lineNumber: 70,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                lineNumber: 69,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ReportDetailHeader.tsx",
        lineNumber: 30,
        columnNumber: 9
    }, this);
}
_c = ReportDetailHeader;
function Badge({ label, value, color }) {
    const styles = {
        slate: "bg-slate-100 text-slate-700 dark:bg-[#16181c] dark:text-[#71767b]",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-[#051c12] dark:text-[#00ba7c] dark:border-[#003a27]",
        blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-[#0a1727] dark:text-[#1d9bf0] dark:border-[#102a43]",
        amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-[#1e160a] dark:text-[#ffd400] dark:border-[#382800]"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center rounded-full border border-transparent px-2.5 py-1 ${styles[color]}`,
        children: [
            label,
            ": ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-1 font-bold",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/ReportDetailHeader.tsx",
                lineNumber: 97,
                columnNumber: 22
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ReportDetailHeader.tsx",
        lineNumber: 94,
        columnNumber: 9
    }, this);
}
_c1 = Badge;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReportDetailHeader");
__turbopack_context__.k.register(_c1, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/task/TaskInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaskInput",
    ()=>TaskInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function TaskInput({ onAdd }) {
    _s();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSubmit = (e)=>{
        e?.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setTitle("");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-xl border border-slate-200 bg-white dark:bg-black dark:border-[#2f3336] shadow-sm p-4 md:p-5 hover:border-slate-300 dark:hover:border-[#536471] transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 mb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-base font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2",
                    children: "✏️ 新しいタスクを追加"
                }, void 0, false, {
                    fileName: "[project]/src/components/task/TaskInput.tsx",
                    lineNumber: 21,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/task/TaskInput.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "flex flex-col md:flex-row gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "flex-1 rounded-lg border border-slate-300 dark:border-[#2f3336] dark:bg-black dark:text-[#e7e9ea] px-4 py-2.5 text-sm placeholder:text-slate-400 dark:placeholder:text-[#71767b] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                        placeholder: "例：Reactの公式ドキュメントを読む、A社の資料作成...",
                        value: title,
                        onChange: (e)=>setTitle(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskInput.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "w-full md:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "＋"
                            }, void 0, false, {
                                fileName: "[project]/src/components/task/TaskInput.tsx",
                                lineNumber: 38,
                                columnNumber: 21
                            }, this),
                            " 追加"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskInput.tsx",
                        lineNumber: 34,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/task/TaskInput.tsx",
                lineNumber: 26,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/task/TaskInput.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_s(TaskInput, "1GNs5BG/zBCkOIT6WAuxDpPLhMw=");
_c = TaskInput;
var _c;
__turbopack_context__.k.register(_c, "TaskInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/task/TaskItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaskItem",
    ()=>TaskItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Bars3Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bars3Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js [app-client] (ecmascript) <export default as Bars3Icon>"); // Grip Icon
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function TaskItem({ task, now, tags, onChangeStatus, onChangeTag, onChangePriority, onChangeEstimated, onToggleToday, onStartTimer, onStopTimer, onDelete }) {
    _s();
    // Sortable Hooks
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id: task.id
    });
    const style = {
        transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: isDragging ? "relative" : undefined
    };
    const totalSeconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalActualSeconds"])(task, now);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeStr = `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
    // 見積もり差分
    const est = task.estimatedMinutes;
    let diffLabel = "";
    let diffClass = "text-slate-500";
    if (est != null) {
        const diff = minutes - est;
        if (diff === 0) diffLabel = "±0";
        else if (diff > 0) {
            diffLabel = `+${diff}`;
            diffClass = "text-red-500 font-medium";
        } else {
            diffLabel = `${diff}`; // negative
            diffClass = "text-emerald-600 font-medium";
        }
    }
    // running state decoration
    const isRunning = task.isRunning;
    const containerClass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border p-3 sm:p-4 transition-all duration-200 flex flex-col gap-3 group relative", isRunning ? "border-indigo-500 bg-white dark:bg-black ring-4 ring-indigo-500/20 shadow-2xl scale-[1.05] md:scale-110 z-20 my-4" : "border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black hover:bg-white dark:hover:bg-black hover:shadow-md hover:border-indigo-200 dark:hover:border-[#536471]", isDragging && "shadow-xl ring-2 ring-indigo-500 opacity-80 cursor-grabbing bg-indigo-50 dark:bg-[#1d9bf0]/10");
    // priority badge style
    const priorityColors = {
        high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-transparent dark:text-rose-500 dark:border-rose-900/50",
        medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-transparent dark:text-amber-500 dark:border-amber-900/50",
        low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-transparent dark:text-blue-500 dark:border-blue-900/50"
    };
    const getPriorityStyle = (p)=>{
        switch(p){
            case "p0":
                return priorityColors.high;
            case "p1":
                return priorityColors.medium;
            case "p2":
                return priorityColors.low;
            default:
                return "";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: setNodeRef,
        style: style,
        className: containerClass,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row gap-2 sm:items-start justify-between pl-8 sm:pl-10 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ...attributes,
                        ...listeners,
                        className: "absolute left-1 top-4 p-2 text-slate-300 hover:text-indigo-500 cursor-grab active:cursor-grabbing touch-none z-10",
                        title: "ドラッグして並び替え",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Bars3Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bars3Icon$3e$__["Bars3Icon"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/task/TaskItem.tsx",
                            lineNumber: 119,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 113,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 space-y-2 min-w-0 pl-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-0.5 shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getPriorityStyle(task.priority)),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRIORITY_LABEL"][task.priority]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/task/TaskItem.tsx",
                                            lineNumber: 125,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 124,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-base font-semibold leading-relaxed break-words text-slate-800 dark:text-[#e7e9ea]", task.status === "done" && "text-slate-400 dark:text-[#71767b] line-through decoration-slate-300 dark:decoration-[#2f3336]"),
                                        children: task.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 129,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 123,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 bg-slate-100/50 dark:bg-black rounded-md px-2 py-0.5 border border-transparent dark:border-[#2f3336] hover:border-slate-200 dark:hover:border-[#536471] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-slate-500 dark:text-[#71767b]",
                                                children: "TAG"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 137,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "text-[11px] bg-transparent border-none p-0 pr-4 focus:ring-0 text-slate-700 dark:text-[#e7e9ea] font-medium cursor-pointer",
                                                value: task.tag ?? "",
                                                onChange: (e)=>onChangeTag(task.id, e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        className: "dark:bg-black dark:text-[#e7e9ea]",
                                                        children: "(未設定)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 33
                                                    }, this),
                                                    tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: t,
                                                            className: "dark:bg-black dark:text-[#e7e9ea]",
                                                            children: t
                                                        }, t, false, {
                                                            fileName: "[project]/src/components/task/TaskItem.tsx",
                                                            lineNumber: 145,
                                                            columnNumber: 37
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 138,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 136,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 bg-slate-100/50 dark:bg-black rounded-md px-2 py-0.5 border border-transparent dark:border-[#2f3336] hover:border-slate-200 dark:hover:border-[#536471] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-slate-500 dark:text-[#71767b]",
                                                children: "PRIORITY"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 152,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "text-[11px] bg-transparent border-none p-0 pr-4 focus:ring-0 text-slate-700 dark:text-[#e7e9ea] font-medium cursor-pointer",
                                                value: task.priority,
                                                onChange: (e)=>onChangePriority(task.id, e.target.value),
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRIORITY_ORDER"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: p,
                                                        className: "dark:bg-black dark:text-[#e7e9ea]",
                                                        children: p.toUpperCase()
                                                    }, p, false, {
                                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 37
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 153,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 151,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-1.5 cursor-pointer bg-slate-100/50 dark:bg-black rounded-md px-2 py-0.5 hover:bg-indigo-50 dark:hover:bg-[#1d9bf0]/10 hover:border-indigo-100 border border-transparent dark:border-[#2f3336] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "rounded border-slate-300 dark:border-[#536471] text-indigo-600 focus:ring-indigo-500 h-3 w-3 dark:bg-black",
                                                checked: task.isToday,
                                                onChange: ()=>onToggleToday(task.id)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 166,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[11px] font-medium transition-colors", task.isToday ? "text-indigo-600 dark:text-[#1d9bf0]" : "text-slate-500 dark:text-[#71767b]"),
                                                children: "Today"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 172,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 165,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 134,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 122,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex sm:flex-col items-center sm:items-end gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex rounded-lg bg-slate-100/80 p-0.5 backdrop-blur-sm",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"].map((s)=>{
                                const isActive = task.status === s;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>onChangeStatus(task.id, s),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 text-[10px] font-medium rounded-md transition-all whitespace-nowrap", isActive ? "bg-white dark:bg-[#1d9bf0] text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-0" : "text-slate-500 dark:text-[#71767b] hover:text-slate-700 dark:hover:text-[#e7e9ea]"),
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_LABEL"][s]
                                }, s, false, {
                                    fileName: "[project]/src/components/task/TaskItem.tsx",
                                    lineNumber: 183,
                                    columnNumber: 33
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/task/TaskItem.tsx",
                            lineNumber: 179,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 178,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/task/TaskItem.tsx",
                lineNumber: 111,
                columnNumber: 13
            }, this),
            isRunning ? // Running Layout: Centered Big Timer
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex flex-col items-center justify-center gap-3 py-4 bg-indigo-50/50 dark:bg-[#1d9bf0]/10 rounded-xl border border-indigo-100 dark:border-[#1d9bf0]/30 backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 animate-pulse",
                                children: "RUNNING"
                            }, void 0, false, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 205,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-4xl md:text-5xl font-black text-indigo-600 tabular-nums tracking-tight drop-shadow-sm",
                                children: [
                                    minutes,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl md:text-2xl text-indigo-400 font-bold ml-1",
                                        children: "m"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 207,
                                        columnNumber: 38
                                    }, this),
                                    seconds.toString().padStart(2, "0"),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl md:text-2xl text-indigo-400 font-bold ml-1",
                                        children: "s"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 208,
                                        columnNumber: 66
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 206,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 204,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-6 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs text-slate-500 dark:text-[#71767b] bg-white/80 dark:bg-black px-3 py-1.5 rounded-full border border-slate-200 dark:border-[#2f3336]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "見積:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 215,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: "0",
                                        className: "w-8 text-center font-bold text-slate-700 bg-transparent focus:outline-none border-b border-slate-300 focus:border-indigo-500 p-0",
                                        placeholder: "0",
                                        value: est ?? "",
                                        onChange: (e)=>onChangeEstimated(task.id, e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 216,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "分"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 224,
                                        columnNumber: 29
                                    }, this),
                                    est != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-1 font-bold", diffClass),
                                        children: diffLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 226,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 214,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onStopTimer(task.id),
                                className: "flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-2.5 h-2.5 rounded-full bg-white block"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 234,
                                        columnNumber: 29
                                    }, this),
                                    "STOP TIMER"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 230,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 212,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/task/TaskItem.tsx",
                lineNumber: 203,
                columnNumber: 17
            }, this) : // Standard Layout
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-[#2f3336] hover:bg-slate-50 dark:hover:bg-[#16181c] transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 text-xs pl-7 sm:pl-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-slate-500",
                                        children: "見積"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 245,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                min: "0",
                                                className: "w-14 rounded border border-slate-200/60 dark:border-[#2f3336] bg-white dark:bg-black px-1.5 py-0.5 text-right font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-[#1d9bf0] focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#1d9bf0] text-slate-700 dark:text-[#e7e9ea]",
                                                placeholder: "0",
                                                value: est ?? "",
                                                onChange: (e)=>onChangeEstimated(task.id, e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 247,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 text-slate-400",
                                                children: "分"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 254,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 246,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 244,
                                columnNumber: 25
                            }, this),
                            est != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-slate-400",
                                        children: "差分"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 260,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: diffClass,
                                        children: diffLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 261,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 259,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 243,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between sm:justify-end gap-4 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-slate-500",
                                        children: "実績"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 269,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-base font-bold text-slate-700 tabular-nums",
                                        children: timeStr
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 270,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 268,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `/focus?reportId=${new URL(window.location.href).pathname.split("/").pop()}&taskId=${task.id}`,
                                        className: "flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95",
                                        title: "フォーカスモードで集中",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            className: "w-4 h-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fillRule: "evenodd",
                                                d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z",
                                                clipRule: "evenodd"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 283,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/task/TaskItem.tsx",
                                            lineNumber: 282,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 277,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onStartTimer(task.id),
                                        className: "flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent block ml-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 292,
                                                columnNumber: 33
                                            }, this),
                                            "START"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 288,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onDelete(task.id),
                                        className: "p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-1",
                                        title: "削除",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                                lineNumber: 301,
                                                columnNumber: 112
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/task/TaskItem.tsx",
                                            lineNumber: 301,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskItem.tsx",
                                        lineNumber: 296,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskItem.tsx",
                                lineNumber: 275,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskItem.tsx",
                        lineNumber: 267,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/task/TaskItem.tsx",
                lineNumber: 241,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/task/TaskItem.tsx",
        lineNumber: 108,
        columnNumber: 9
    }, this);
}
_s(TaskItem, "/TOZZ/rmlDvX8r+a5PgN0n4tnHE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c = TaskItem;
var _c;
__turbopack_context__.k.register(_c, "TaskItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/task/TaskList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaskList",
    ()=>TaskList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$task$2f$TaskItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/task/TaskItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function TaskList({ tasks, now, tags, showTodayOnly, setShowTodayOnly, showCompleted, setShowCompleted, tagFilter, setTagFilter, actions }) {
    _s();
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointerSensor"], {
        // Require slight movement to prevent drag when clicking inputs
        activationConstraint: {
            distance: 8
        }
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardSensor"], {
        coordinateGetter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortableKeyboardCoordinates"]
    }));
    // Filter tasks
    const visibleTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TaskList.useMemo[visibleTasks]": ()=>{
            // NOTE: In DnD mode, we display tasks explicitly ordered by the user (the 'tasks' array order).
            // We do *not* automatically sort by priority/status anymore to allow manual organization.
            return tasks.filter({
                "TaskList.useMemo[visibleTasks]": (t)=>{
                    if (showTodayOnly && !t.isToday) return false;
                    if (!showCompleted && t.status === "done") return false;
                    if (tagFilter !== "all" && t.tag !== tagFilter) return false;
                    return true;
                }
            }["TaskList.useMemo[visibleTasks]"]);
        }
    }["TaskList.useMemo[visibleTasks]"], [
        tasks,
        showTodayOnly,
        showCompleted,
        tagFilter
    ]);
    function handleDragEnd(event) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = tasks.findIndex((t)=>t.id === active.id);
            const newIndex = tasks.findIndex((t)=>t.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayMove"])(tasks, oldIndex, newIndex);
                actions.onReorder?.(newTasks);
            }
        }
    }
    if (tasks.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-dashed border-slate-300 dark:border-[#2f3336] bg-slate-50/50 dark:bg-black/50 p-8 text-center backdrop-blur-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-500 dark:text-[#71767b] font-medium",
                    children: "まだタスクがありません"
                }, void 0, false, {
                    fileName: "[project]/src/components/task/TaskList.tsx",
                    lineNumber: 102,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-slate-400 dark:text-[#536471] mt-1",
                    children: "上のフォームから、今週やることを追加しましょう。"
                }, void 0, false, {
                    fileName: "[project]/src/components/task/TaskList.tsx",
                    lineNumber: 103,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/task/TaskList.tsx",
            lineNumber: 101,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 bg-slate-50/80 dark:bg-black/80 backdrop-blur-md py-3 px-1 border-b border-slate-200/50 dark:border-[#2f3336] transition-all rounded-b-lg -mx-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 px-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2",
                            children: [
                                "📋 タスク一覧",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-normal text-slate-500 dark:text-[#71767b] bg-slate-200/50 dark:bg-[#16181c] px-2 py-0.5 rounded-full",
                                    children: [
                                        visibleTasks.length,
                                        " / ",
                                        tasks.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/task/TaskList.tsx",
                                    lineNumber: 115,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/task/TaskList.tsx",
                            lineNumber: 113,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskList.tsx",
                        lineNumber: 112,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide px-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "text-xs border border-slate-200 dark:border-[#2f3336] rounded-lg px-2 py-1.5 bg-white/80 dark:bg-black text-slate-700 dark:text-[#e7e9ea] hover:border-indigo-300 cursor-pointer focus:outline-none focus:border-indigo-500 shadow-sm",
                                value: tagFilter,
                                onChange: (e)=>setTagFilter(e.target.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "すべてのタグ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/task/TaskList.tsx",
                                        lineNumber: 128,
                                        columnNumber: 25
                                    }, this),
                                    tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: t,
                                            children: t
                                        }, t, false, {
                                            fileName: "[project]/src/components/task/TaskList.tsx",
                                            lineNumber: 129,
                                            columnNumber: 40
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/task/TaskList.tsx",
                                lineNumber: 123,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowTodayOnly(!showTodayOnly),
                                className: `text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shadow-sm ${showTodayOnly ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold dark:bg-[#1d9bf0]/10 dark:border-[#1d9bf0]/30 dark:text-[#1d9bf0]" : "bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-black dark:border-[#2f3336] dark:text-[#71767b] dark:hover:bg-[#16181c]"}`,
                                children: "Today"
                            }, void 0, false, {
                                fileName: "[project]/src/components/task/TaskList.tsx",
                                lineNumber: 133,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowCompleted(!showCompleted),
                                className: `text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shadow-sm ${showCompleted ? "bg-slate-100 border-slate-200 text-slate-700 dark:bg-[#16181c] dark:border-[#2f3336] dark:text-[#e7e9ea]" : "bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-black dark:border-[#2f3336] dark:text-[#71767b] dark:hover:text-[#e7e9ea]"}`,
                                children: showCompleted ? "完了を隠す" : "完了を表示"
                            }, void 0, false, {
                                fileName: "[project]/src/components/task/TaskList.tsx",
                                lineNumber: 144,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/task/TaskList.tsx",
                        lineNumber: 121,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/task/TaskList.tsx",
                lineNumber: 111,
                columnNumber: 13
            }, this),
            visibleTasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-12 text-center border rounded-xl bg-white/50 dark:bg-black/50 border-slate-200 dark:border-[#2f3336] backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400 dark:text-[#71767b]",
                        children: "表示するタスクがありません"
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskList.tsx",
                        lineNumber: 158,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-400 dark:text-[#536471] mt-1",
                        children: "フィルタ条件を変更してみてください"
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskList.tsx",
                        lineNumber: 159,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/task/TaskList.tsx",
                lineNumber: 157,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DndContext"], {
                sensors: sensors,
                collisionDetection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closestCenter"],
                onDragEnd: handleDragEnd,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                    items: visibleTasks.map((t)=>t.id),
                    strategy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verticalListSortingStrategy"],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3",
                        children: visibleTasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$task$2f$TaskItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskItem"], {
                                task: task,
                                now: now,
                                tags: tags,
                                ...actions
                            }, task.id, false, {
                                fileName: "[project]/src/components/task/TaskList.tsx",
                                lineNumber: 173,
                                columnNumber: 33
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/task/TaskList.tsx",
                        lineNumber: 171,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/task/TaskList.tsx",
                    lineNumber: 167,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/task/TaskList.tsx",
                lineNumber: 162,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/task/TaskList.tsx",
        lineNumber: 109,
        columnNumber: 9
    }, this);
}
_s(TaskList, "LRAgcR8UcHHHjpaLgZ2OOIBLmA4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"]
    ];
});
_c = TaskList;
var _c;
__turbopack_context__.k.register(_c, "TaskList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/report/ReportSummary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportSummary",
    ()=>ReportSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function ReportSummary({ tasks, now }) {
    _s();
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportSummary.useMemo[summary]": ()=>{
            let totalEst = 0;
            let estCount = 0;
            let totalActSec = 0;
            let totalDiff = 0;
            let diffCount = 0;
            for (const t of tasks){
                const act = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalActualSeconds"])(t, now);
                totalActSec += act;
                if (t.estimatedMinutes != null) {
                    totalEst += t.estimatedMinutes;
                    estCount++;
                    const actMin = Math.floor(act / 60);
                    totalDiff += actMin - t.estimatedMinutes;
                    diffCount++;
                }
            }
            const avgDiff = diffCount > 0 ? totalDiff / diffCount : null;
            return {
                totalEst,
                estCount,
                totalActSec,
                avgDiff
            };
        }
    }["ReportSummary.useMemo[summary]"], [
        tasks,
        now
    ]);
    const statusStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportSummary.useMemo[statusStats]": ()=>{
            const res = {};
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"].forEach({
                "ReportSummary.useMemo[statusStats]": (s)=>res[s] = {
                        count: 0,
                        sec: 0
                    }
            }["ReportSummary.useMemo[statusStats]"]);
            for (const t of tasks){
                if (!res[t.status]) continue; // safety
                res[t.status].count++;
                res[t.status].sec += (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalActualSeconds"])(t, now);
            }
            return res;
        }
    }["ReportSummary.useMemo[statusStats]"], [
        tasks,
        now
    ]);
    // Re-use logic from util or just do it here for tags
    const topTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportSummary.useMemo[topTags]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickTopTagsBySeconds"])(tasks, now, 5)
    }["ReportSummary.useMemo[topTags]"], [
        tasks,
        now
    ]);
    const avgDiffData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAvgDiff"])(summary.avgDiff);
    if (tasks.length === 0) return null;
    // New stats object for the updated UI
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportSummary.useMemo[stats]": ()=>{
            const totalCount = tasks.length;
            const doneCount = statusStats.done.count;
            const totalActualSeconds = summary.totalActSec;
            const topTagsData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickTopTagsBySeconds"])(tasks, now, 5); // Re-calculate or use existing topTags
            return {
                totalCount,
                doneCount,
                totalActualSeconds,
                topTags: topTagsData
            };
        }
    }["ReportSummary.useMemo[stats]"], [
        tasks,
        now,
        summary,
        statusStats
    ]);
    const avgDiffStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAvgDiff"])(summary.avgDiff);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 mt-6 pt-6 border-t border-slate-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-800 dark:text-[#e7e9ea]",
                                children: "📊 今週のサマリー"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 92,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-slate-500 dark:text-[#71767b] bg-slate-100 dark:bg-[#16181c] px-2 py-0.5 rounded-full",
                                children: "Real-time"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 93,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                        lineNumber: 91,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#2f3336] p-5 shadow-sm space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-bold text-slate-600 dark:text-[#e7e9ea]",
                                                children: "タスク消化状況"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 100,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl font-black text-slate-800 dark:text-[#e7e9ea]",
                                                children: [
                                                    stats.doneCount,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-slate-400 dark:text-[#71767b] font-medium ml-1",
                                                        children: [
                                                            "/ ",
                                                            stats.totalCount
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 50
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 101,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 99,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-3 w-full bg-slate-100 dark:bg-[#16181c] rounded-full overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-full bg-indigo-500 dark:bg-[#1d9bf0] rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                                                    style: {
                                                        width: `${stats.totalCount > 0 ? stats.doneCount / stats.totalCount * 100 : 0}%`
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 113,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 108,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-xs text-slate-500 dark:text-[#71767b]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            stats.totalCount > 0 ? Math.round(stats.doneCount / stats.totalCount * 100) : 0,
                                                            "% Complete"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "残り ",
                                                            stats.totalCount - stats.doneCount,
                                                            "件"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 116,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 107,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-4 border-t border-slate-100 dark:border-[#2f3336] grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-400 dark:text-[#71767b]",
                                                        children: "合計稼働時間"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lg font-bold text-slate-700 dark:text-[#e7e9ea] font-mono",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(stats.totalActualSeconds)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 123,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-400 dark:text-[#71767b]",
                                                        children: "平均見積差分"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-bold font-mono", avgDiffStyle.className),
                                                        children: avgDiffStyle.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 129,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 122,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#2f3336] p-5 shadow-sm space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-slate-600 dark:text-[#e7e9ea]",
                                        children: "タグ別時間の使い方"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 140,
                                        columnNumber: 25
                                    }, this),
                                    stats.topTags.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-32 flex items-center justify-center text-slate-400 dark:text-[#71767b] text-xs text-center border-2 border-dashed border-slate-100 dark:border-[#2f3336] rounded-lg",
                                        children: [
                                            "データがありません",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 143,
                                                columnNumber: 42
                                            }, this),
                                            "タイマーを使って計測しましょう"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 142,
                                        columnNumber: 29
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: stats.topTags.slice(0, 4).map((row, i)=>{
                                            const pct = Math.round(row.sec / Math.max(stats.totalActualSeconds, 1) * 100);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-slate-700 dark:text-[#e7e9ea]",
                                                                children: row.tag
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                                lineNumber: 152,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-500 dark:text-[#71767b]",
                                                                children: [
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(row.sec),
                                                                    " (",
                                                                    pct,
                                                                    "%)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                                lineNumber: 153,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-2 w-full bg-slate-50 dark:bg-[#16181c] rounded-full overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full rounded-full opacity-80", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTagColor"])(row.tag).replace("bg-", "bg-").replace("text-", "").replace("border-", "")),
                                                            style: {
                                                                width: `${pct}%`,
                                                                backgroundColor: 'currentColor',
                                                                color: 'inherit'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full h-full", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTagColor"])(row.tag).split(" ")[0].replace("bg-", "bg-"))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                                lineNumber: 164,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, row.tag, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 150,
                                                columnNumber: 41
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 146,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 139,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                        lineNumber: 96,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportSummary.tsx",
                lineNumber: 90,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-bold text-slate-700 dark:text-[#e7e9ea] mb-3",
                                children: "ステータス別"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 179,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "text-xs text-slate-400 dark:text-[#71767b] border-b dark:border-[#2f3336]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-2 font-medium",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-2 font-medium",
                                                    children: "Count"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-2 font-medium",
                                                    children: "Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/report/ReportSummary.tsx",
                                            lineNumber: 182,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 181,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-slate-50 dark:divide-[#16181c]",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 text-slate-700 dark:text-[#e7e9ea]",
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_LABEL"][s]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 191,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 text-slate-600 dark:text-[#71767b] font-medium",
                                                        children: statusStats[s].count
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 text-slate-500 dark:text-[#71767b] tabular-nums",
                                                        children: statusStats[s].sec > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(statusStats[s].sec) : "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, s, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 190,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 188,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 180,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                        lineNumber: 178,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-bold text-slate-700 dark:text-[#e7e9ea] mb-3",
                                children: "タグ別（Top 5）"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 204,
                                columnNumber: 21
                            }, this),
                            topTags.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-24 flex items-center justify-center text-xs text-slate-400 dark:text-[#71767b]",
                                children: "実績データなし"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 206,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "text-xs text-slate-400 dark:text-[#71767b] border-b dark:border-[#2f3336]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-2 font-medium",
                                                    children: "Tag"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-2 font-medium",
                                                    children: "Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "pb-2 font-medium",
                                                    children: "Share"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/report/ReportSummary.tsx",
                                            lineNumber: 210,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 209,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-slate-50 dark:divide-[#16181c]",
                                        children: topTags.map((row)=>{
                                            const percent = summary.totalActSec > 0 ? Math.round(row.sec / summary.totalActSec * 100) : 0;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 text-slate-700 dark:text-[#e7e9ea]",
                                                        children: row.tag
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 text-slate-600 dark:text-[#71767b] tabular-nums",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(row.sec)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-1.5 bg-slate-100 dark:bg-[#16181c] rounded-full overflow-hidden",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-full bg-indigo-500",
                                                                        style: {
                                                                            width: `${percent}%`
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                                        lineNumber: 226,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                                    lineNumber: 225,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-slate-400 dark:text-[#71767b] tabular-nums",
                                                                    children: [
                                                                        percent,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                                    lineNumber: 228,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, row.tag, true, {
                                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                                lineNumber: 220,
                                                columnNumber: 41
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                                        lineNumber: 216,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/report/ReportSummary.tsx",
                                lineNumber: 208,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportSummary.tsx",
                        lineNumber: 203,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportSummary.tsx",
                lineNumber: 176,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/report/ReportSummary.tsx",
        lineNumber: 89,
        columnNumber: 9
    }, this);
}
_s(ReportSummary, "yuT7+nE6tc4oj7ImVRck4e42Z0k=");
_c = ReportSummary;
var _c;
__turbopack_context__.k.register(_c, "ReportSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/report/ReportReflection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportReflection",
    ()=>ReportReflection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
;
const NOTE_TEMPLATE = "## 🎯 今週の目標・テーマ\n\n\n" + "## 🙌 KPT - Keep (良かったこと・続けたいこと)\n\n\n" + "## 💦 KPT - Problem (困ったこと・課題)\n\n\n" + "## 🚀 KPT - Try (次週やること・改善策)\n\n\n" + "## 📝 その他・フリーメモ\n";
function ReportReflection({ weeklyNote, setWeeklyNote, noteSavedMessage, tasks, now }) {
    const handleInsertTemplate = ()=>{
        const trimmed = weeklyNote.trim();
        if (trimmed === "") {
            setWeeklyNote(NOTE_TEMPLATE);
        } else {
            const sep = weeklyNote.endsWith("\n") ? "\n\n" : "\n\n\n";
            setWeeklyNote((prev)=>prev + sep + NOTE_TEMPLATE);
        }
    };
    const handleAppendAutoReflection = ()=>{
        const snippet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateReflectionText"])(tasks, now, 5);
        setWeeklyNote((prev)=>{
            const trimmed = prev.trim();
            if (!trimmed) return snippet + "\n";
            const sep = prev.endsWith("\n") ? "\n\n" : "\n\n";
            return prev + sep + snippet + "\n";
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-3 pt-6 border-t border-slate-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-slate-800 dark:text-slate-100",
                                children: "📝 週次ふりかえりメモ"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportReflection.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500",
                                children: "入力内容は自動保存されます。"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportReflection.tsx",
                                lineNumber: 46,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportReflection.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleInsertTemplate,
                                className: "text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors",
                                children: "テンプレ挿入"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportReflection.tsx",
                                lineNumber: 49,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleAppendAutoReflection,
                                disabled: tasks.length === 0,
                                className: "text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50",
                                children: "✨ 自動生成を追記"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportReflection.tsx",
                                lineNumber: 56,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportReflection.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportReflection.tsx",
                lineNumber: 43,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        className: "w-full min-h-[400px] rounded-xl border border-slate-300 bg-white dark:bg-black dark:border-[#2f3336] dark:text-[#e7e9ea] px-4 py-3 text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-y",
                        value: weeklyNote,
                        onChange: (e)=>setWeeklyNote(e.target.value),
                        placeholder: "ここをクリックして、今週の振り返りやメモを自由に記述してください..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/report/ReportReflection.tsx",
                        lineNumber: 68,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 right-3",
                        children: noteSavedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-medium text-emerald-600 bg-white/80 px-2 py-1 rounded shadow-sm",
                            children: noteSavedMessage
                        }, void 0, false, {
                            fileName: "[project]/src/components/report/ReportReflection.tsx",
                            lineNumber: 76,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/report/ReportReflection.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportReflection.tsx",
                lineNumber: 67,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/report/ReportReflection.tsx",
        lineNumber: 42,
        columnNumber: 9
    }, this);
}
_c = ReportReflection;
var _c;
__turbopack_context__.k.register(_c, "ReportReflection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/report/ReportActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportActions",
    ()=>ReportActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function ReportActions({ id, report, tasks, now, weeklyNote, onRestore, onDeleteAllTasks }) {
    _s();
    const [csvCopied, setCsvCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backupJson, setBackupJson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [backupMsg, setBackupMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [copyStatus, setCopyStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const handleCopy = async (target)=>{
        const text = target === "slack" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSlackText"])(report, tasks, weeklyNote) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateNotionText"])(report, tasks, weeklyNote);
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(target);
            setTimeout(()=>setCopyStatus("idle"), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
            alert("コピーに失敗しました");
        }
    };
    // CSV
    const csvText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "ReportActions.useMemo[csvText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateCsvText"])(tasks, now)
    }["ReportActions.useMemo[csvText]"], [
        tasks,
        now
    ]);
    const handleCopyCsv = async ()=>{
        if (!csvText) return;
        try {
            await navigator.clipboard.writeText(csvText);
            setCsvCopied(true);
            setTimeout(()=>setCsvCopied(false), 2000);
        } catch  {
            alert("コピーに失敗しました");
        }
    };
    // Backup
    const handleExportBackup = async ()=>{
        const payload = {
            version: 1,
            reportId: id,
            exportedAt: new Date().toISOString(),
            tasks,
            weeklyNote
        };
        const text = JSON.stringify(payload, null, 2);
        setBackupJson(text);
        try {
            await navigator.clipboard.writeText(text);
            setBackupMsg("JSONを作成してコピーしました");
        } catch  {
            setBackupMsg("JSONを作成しました（コピー失敗）");
        }
    };
    const handleImportBackup = ()=>{
        if (!backupJson.trim()) return;
        try {
            const parsed = JSON.parse(backupJson);
            if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("Invalid format");
            const ok = confirm("テキストエリアのJSON内容でタスクとメモを上書きして良いですか？");
            if (ok) {
                onRestore(parsed.tasks, parsed.weeklyNote || "");
                setBackupMsg("復元しました");
            }
        } catch  {
            setBackupMsg("JSON形式が正しくありません");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-8 pt-8 mt-4 border-t border-slate-200 pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2",
                        children: [
                            "📋 CSVエクスポート",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-normal text-slate-500 bg-slate-100 dark:bg-[#16181c] dark:text-[#71767b] px-2 py-0.5 rounded",
                                children: "コピペ用"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 90,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "flex-1 h-24 text-[11px] font-mono border rounded-lg p-2 bg-slate-50 dark:bg-black dark:border-[#2f3336] text-slate-600 dark:text-[#71767b] focus:outline-none",
                                readOnly: true,
                                value: csvText,
                                placeholder: "タスクを追加するとCSVが生成されます"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 93,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCopyCsv,
                                className: "self-start px-4 py-2 bg-white dark:bg-black border border-slate-300 dark:border-[#2f3336] text-slate-700 dark:text-[#e7e9ea] text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-[#16181c] active:bg-slate-100 transition-colors",
                                children: csvCopied ? "コピー済" : "コピー"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 99,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 92,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportActions.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-slate-100 dark:border-[#2f3336] backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleCopy("slack"),
                                className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-[#2f3336] text-slate-600 dark:text-[#e7e9ea] text-sm font-bold hovering-scale shadow-sm hover:border-[#4A154B] hover:text-[#4A154B] transition-colors",
                                children: copyStatus === "slack" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-emerald-600 flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-4 w-4",
                                            viewBox: "0 0 20 20",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fillRule: "evenodd",
                                                d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                clipRule: "evenodd"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                                lineNumber: 119,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/report/ReportActions.tsx",
                                            lineNumber: 118,
                                            columnNumber: 33
                                        }, this),
                                        "COPIED"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/report/ReportActions.tsx",
                                    lineNumber: 117,
                                    columnNumber: 29
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.52v-6.315zm8.853-8.887a2.528 2.528 0 0 1 2.521-2.521A2.528 2.528 0 0 1 20.208 6.278a2.528 2.528 0 0 1-2.52 2.52h-2.522V6.278zm-1.26 0a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.52-2.521V0a2.528 2.528 0 0 1 2.52 2.521v6.313zM6.313 6.313a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.52 0 2.528 2.528 0 0 1 2.52-2.52H6.313v2.52zm0 2.52h6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H6.313A2.528 2.528 0 0 1 3.792 11.374a2.528 2.528 0 0 1 2.521-2.541zM20.208 17.688a2.528 2.528 0 0 1-2.52 2.52h-6.313a2.528 2.528 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.521h6.313a2.528 2.528 0 0 1 2.52 2.521z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                                lineNumber: 126,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/report/ReportActions.tsx",
                                            lineNumber: 125,
                                            columnNumber: 33
                                        }, this),
                                        "Slack Copy"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleCopy("notion"),
                                className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-[#2f3336] text-slate-600 dark:text-[#e7e9ea] text-sm font-bold hovering-scale shadow-sm hover:border-slate-800 dark:hover:border-[#e7e9ea] hover:text-slate-800 dark:hover:text-white transition-colors",
                                children: copyStatus === "notion" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-emerald-600 flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-4 w-4",
                                            viewBox: "0 0 20 20",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fillRule: "evenodd",
                                                d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                clipRule: "evenodd"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                                lineNumber: 141,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/report/ReportActions.tsx",
                                            lineNumber: 140,
                                            columnNumber: 33
                                        }, this),
                                        "COPIED"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/report/ReportActions.tsx",
                                    lineNumber: 139,
                                    columnNumber: 29
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M4.459 4.208c.746-3.167 3.226-4.208 7.426-4.208 4.2 0 6.679 1.041 7.426 4.208.157.665.23 1.636.23 2.929v10.709c0 3.385-1.936 6.154-7.656 6.154-5.721 0-7.656-2.769-7.656-6.154V7.137c0-1.293.073-2.264.23-2.929zm12.35 2.951c.148 0 .27-.119.27-.272a27.18 27.18 0 0 0-.175-3.074c-.234-2.029-2.03-2.7-4.998-2.7-2.969 0-4.764.671-4.998 2.7-.091.772-.15 1.794-.175 3.074a.273.273 0 0 0 .27.272h9.807z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                                lineNumber: 148,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/report/ReportActions.tsx",
                                            lineNumber: 147,
                                            columnNumber: 33
                                        }, this),
                                        "Notion Copy"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 134,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (confirm("全てのタスクを削除しますか？この操作は取り消せません。")) {
                                    onDeleteAllTasks();
                                }
                            },
                            className: "flex items-center gap-2 px-4 py-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors text-xs font-bold",
                            children: "🗑️ 全タスク削除"
                        }, void 0, false, {
                            fileName: "[project]/src/components/report/ReportActions.tsx",
                            lineNumber: 157,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 156,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportActions.tsx",
                lineNumber: 109,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2",
                        children: "📦 バックアップ / 復元"
                    }, void 0, false, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 172,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500 dark:text-[#71767b]",
                        children: "この週報データをJSONテキストとして保存・復元できます。"
                    }, void 0, false, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 175,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-slate-50 dark:bg-black p-3 rounded-xl border border-slate-200 dark:border-[#2f3336]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleExportBackup,
                                        className: "text-xs bg-slate-800 dark:bg-[#16181c] text-white dark:text-[#e7e9ea] px-3 py-1.5 rounded-md hover:bg-slate-700 dark:hover:bg-[#2f3336] border border-transparent dark:border-[#2f3336]",
                                        children: "バックアップ作成（コピー）"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportActions.tsx",
                                        lineNumber: 181,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleImportBackup,
                                        className: "text-xs bg-white dark:bg-black border border-slate-300 dark:border-[#2f3336] text-slate-700 dark:text-[#e7e9ea] px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-[#16181c]",
                                        children: "JSONから復元（Import）"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportActions.tsx",
                                        lineNumber: 187,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-emerald-600 dark:text-emerald-500 flex items-center",
                                        children: backupMsg
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/report/ReportActions.tsx",
                                        lineNumber: 193,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 180,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "w-full h-24 text-[11px] font-mono border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black text-slate-700 dark:text-[#71767b] rounded-lg p-2 focus:outline-none focus:border-indigo-500",
                                value: backupJson,
                                onChange: (e)=>setBackupJson(e.target.value),
                                placeholder: "ここにJSONが表示されます。復元する場合は、保存しておいたJSONをここに貼り付けて「Import」を押してください。"
                            }, void 0, false, {
                                fileName: "[project]/src/components/report/ReportActions.tsx",
                                lineNumber: 195,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/report/ReportActions.tsx",
                        lineNumber: 179,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/report/ReportActions.tsx",
                lineNumber: 171,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/report/ReportActions.tsx",
        lineNumber: 85,
        columnNumber: 9
    }, this);
}
_s(ReportActions, "ncbNS5qllPfpQBbEwBjy+WHycUE=");
_c = ReportActions;
var _c;
__turbopack_context__.k.register(_c, "ReportActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/gamification.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RANKS",
    ()=>RANKS,
    "calculateTotalXP",
    ()=>calculateTotalXP,
    "getLevelInfo",
    ()=>getLevelInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
const RANKS = [
    {
        name: "放浪者 (Wanderer)",
        color: "text-slate-500",
        minLevel: 1
    },
    {
        name: "冒険者 (Adventurer)",
        color: "text-emerald-500",
        minLevel: 5
    },
    {
        name: "戦士 (Warrior)",
        color: "text-cyan-500",
        minLevel: 10
    },
    {
        name: "騎士 (Knight)",
        color: "text-blue-600",
        minLevel: 15
    },
    {
        name: "達人 (Master)",
        color: "text-violet-600",
        minLevel: 20
    },
    {
        name: "英雄 (Hero)",
        color: "text-fuchsia-500",
        minLevel: 30
    },
    {
        name: "伝説 (Legend)",
        color: "text-amber-500",
        minLevel: 45
    },
    {
        name: "神 (God)",
        color: "text-rose-600",
        minLevel: 60
    }
];
// --- XP Rules ---
const XP_PER_TASK_DONE = 150;
const XP_BONUS_P0 = 50;
const XP_PER_FOCUS_MINUTE = 1;
function calculateTotalXP(allTasks) {
    let xp = 0;
    for (const t of allTasks){
        // 1. Basic completion
        if (t.status === "done") {
            xp += XP_PER_TASK_DONE;
            if (t.priority === "p0") {
                xp += XP_BONUS_P0;
            }
        }
        // 2. Focus Time (regardless of completion)
        const totalSeconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalActualSeconds"])(t, 0); // 0 for strict historical calc, or now if realtime
        const minutes = Math.floor(totalSeconds / 60);
        if (minutes > 0) {
            xp += minutes * XP_PER_FOCUS_MINUTE;
        }
    }
    return xp;
}
function getLevelInfo(totalXP) {
    // Formula: Level = floor(sqrt(totalXP / 150)) + 1
    // Adjusted constant '150' to tune pacing.
    // Lv 1 starts at 0.
    // Lv 2 needs 150 XP (1 task)
    // Lv 5 needs 150 * 16 = 2400 XP (~16 tasks)
    // Lv 10 needs 150 * 81 = 12150 XP (~80 tasks)
    // Reverse: Required XP for Level L = 150 * (L-1)^2
    const BASE_CONST = 150;
    const level = Math.floor(Math.sqrt(totalXP / BASE_CONST)) + 1;
    const currentLevelBaseXP = BASE_CONST * Math.pow(level - 1, 2);
    const nextLevelBaseXP = BASE_CONST * Math.pow(level, 2);
    const xpNeededForNext = nextLevelBaseXP - currentLevelBaseXP;
    const xpInCurrent = totalXP - currentLevelBaseXP;
    const progressPercent = Math.min(100, Math.max(0, Math.round(xpInCurrent / xpNeededForNext * 100)));
    // Find Rank
    // Reverse loop to find highest matching rank
    let rank = RANKS[0];
    for (const r of RANKS){
        if (level >= r.minLevel) {
            rank = r;
        }
    }
    return {
        level,
        rank,
        totalXP,
        currentLevelXP: xpInCurrent,
        nextLevelXP: xpNeededForNext,
        progressPercent
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gamification/LevelUpModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LevelUpModal",
    ()=>LevelUpModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function LevelUpModal({ show, oldLevel, newLevel, rank, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: onClose,
                    className: "absolute inset-0 bg-black/60 backdrop-blur-sm"
                }, void 0, false, {
                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                    lineNumber: 21,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        scale: 0.8,
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        scale: 1,
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        scale: 0.8,
                        opacity: 0,
                        y: 20
                    },
                    transition: {
                        type: "spring",
                        damping: 25,
                        stiffness: 300
                    },
                    className: "relative z-10 w-full max-w-sm rounded-3xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/50 dark:border-[#2f3336] shadow-2xl overflow-hidden p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-20 blur-3xl ${rank.color.replace("text-", "bg-")}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 38,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-3xl ${rank.color.replace("text-", "bg-")}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 39,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                y: -20,
                                opacity: 0
                            },
                            animate: {
                                y: 0,
                                opacity: 1
                            },
                            transition: {
                                delay: 0.2
                            },
                            className: "text-4xl mb-4",
                            children: "🎉"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 41,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h2, {
                            initial: {
                                scale: 0.5,
                                opacity: 0
                            },
                            animate: {
                                scale: 1,
                                opacity: 1
                            },
                            transition: {
                                delay: 0.3,
                                type: "spring"
                            },
                            className: "text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 mb-2",
                            children: "LEVEL UP!"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 50,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center items-baseline gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold text-slate-400",
                                    children: [
                                        "Lv.",
                                        oldLevel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                                    lineNumber: 60,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl text-slate-300",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                                    lineNumber: 61,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-4xl font-black text-slate-800",
                                    children: [
                                        "Lv.",
                                        newLevel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                                    lineNumber: 62,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 59,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1",
                                    children: "Current Rank"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                                    lineNumber: 66,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-lg font-bold ${rank.color}`,
                                    children: rank.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                                    lineNumber: 67,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 65,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "w-full py-3 px-6 rounded-xl bg-slate-900 dark:bg-[#e7e9ea] text-white dark:text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition-all",
                            children: "Awesome!"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                            lineNumber: 72,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
                    lineNumber: 30,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
            lineNumber: 19,
            columnNumber: 17
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gamification/LevelUpModal.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, this);
}
_c = LevelUpModal;
var _c;
__turbopack_context__.k.register(_c, "LevelUpModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/coaching.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateCoachAdvice",
    ()=>generateCoachAdvice
]);
function generateCoachAdvice(stats, tasks) {
    const total = stats.totalCount;
    // Calculate completion rate safely
    const completionRate = total > 0 ? Math.round(stats.doneCount / total * 100) : 0;
    const focusMinutes = Math.floor(stats.totalActualSeconds / 60);
    // 0. Empty State
    if (total === 0) {
        return {
            title: "まずは計画から",
            message: "今週のタスクがまだありません。「タスクを追加」から、やるべきことを書き出してみましょう！",
            type: "info"
        };
    }
    // 1. High Priority Overload check
    const p0Tasks = tasks.filter((t)=>t.priority === "p0" && t.status !== "done").length;
    if (p0Tasks > 3) {
        return {
            title: "詰め込みすぎ注意報",
            message: `最優先(P0)タスクが${p0Tasks}個残っています。全てを追うと疲れてしまいます。本当に今日やるべき1つに絞りましょう。`,
            type: "warning"
        };
    }
    // 2. High Focus but Low Completion (Stuck?)
    if (focusMinutes > 120 && completionRate < 20) {
        return {
            title: "少し休憩しませんか？",
            message: "かなり集中して作業されていますが、完了タスクが少なめです。一度タスクを細分化するか、短い休憩を取ってリフレッシュしましょう。",
            type: "encouragement"
        };
    }
    // 3. Great Progress (Flow State)
    if (completionRate > 80 && total > 5) {
        return {
            title: "素晴らしい流れです！",
            message: "タスクの消化率がとても高いです！この調子で今週の目標を達成しましょう。無理せず水分補給も忘れずに。",
            type: "success"
        };
    }
    // 4. End of Week / Monday Blues
    const today = new Date().getDay(); // 0=Sun, 1=Mon...
    if (today === 1 && completionRate < 10) {
        return {
            title: "良い一週間のスタートを",
            message: "月曜日ですね！まずは5分で終わる簡単なタスクから始めて、リズムを作っていきましょう。",
            type: "info"
        };
    }
    if (today === 5 && completionRate < 50) {
        return {
            title: "ラストスパート！",
            message: "金曜日です。今週中に絶対に終わらせたいタスクだけを選んで、残りは来週に回すのも戦略です。",
            type: "warning"
        };
    }
    // Default Encouragement
    if (completionRate > 50) {
        return {
            title: "順調に進んでいます",
            message: "半分以上のタスクが完了しました。残りのタスク優先順位を見直して、着実に進めていきましょう。",
            type: "success"
        };
    }
    return {
        title: "焦らずいきましょう",
        message: "タスクリストを見直して、今すぐに着手できる小さなことから始めてみてください。",
        type: "info"
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/reports/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReportDetailHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ReportDetailHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$task$2f$TaskInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/task/TaskInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$task$2f$TaskList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/task/TaskList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$report$2f$ReportSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/report/ReportSummary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$report$2f$ReportReflection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/report/ReportReflection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$report$2f$ReportActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/report/ReportActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gamification.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gamification$2f$LevelUpModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gamification/LevelUpModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coaching$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/coaching.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function ReportDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // --- State ---
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [allReports, setAllReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Gamification
    const [levelInfo, setLevelInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const prevLevelRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(undefined);
    const [showLevelUp, setShowLevelUp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [levelUpData, setLevelUpData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // AI Coach
    const [advice, setAdvice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    // ... (Initial Load Effect) ... 
    // (Update XP Effect - modified to detect level up)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (!loaded || allReports.length === 0) return;
            const now = Date.now();
            const allTasks = [];
            for (const r of allReports){
                if (r.id === id) {
                    allTasks.push(...tasks);
                } else {
                    allTasks.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadTasks"])(r.id, now));
                }
            }
            const xp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTotalXP"])(allTasks);
            const newInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLevelInfo"])(xp);
            // Detect Level Up
            if (prevLevelRef.current !== undefined && newInfo.level > prevLevelRef.current) {
                setLevelUpData({
                    old: prevLevelRef.current,
                    new: newInfo.level
                });
                setShowLevelUp(true);
            }
            // Update ref
            prevLevelRef.current = newInfo.level;
            setLevelInfo(newInfo);
        }
    }["ReportDetailPage.useEffect"], [
        tasks,
        allReports,
        loaded,
        id
    ]);
    const NOTE_KEY = `weekly-report-note-${id}`;
    const [weeklyNote, setWeeklyNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [noteSavedMessage, setNoteSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Filters
    const [tagFilter, setTagFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [showTodayOnly, setShowTodayOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCompleted, setShowCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Timer
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Date.now());
    // UI Messages
    const [savedMessage, setSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // --- Effects ---
    // 1. Initial Load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !id) return;
            // Load reports list to validate existence (optional, but good for navigation)
            // AND to calculate XP from all history
            const rawReports = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEY"]);
            if (rawReports) {
                try {
                    const parsed = JSON.parse(rawReports);
                    setAllReports(parsed);
                    // Calculate XP immediately
                    const now = Date.now();
                    const allTasks = [];
                    if (Array.isArray(parsed)) {
                        for (const r of parsed){
                            const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadTasks"])(r.id, now);
                            allTasks.push(...t);
                        }
                    }
                    const xp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTotalXP"])(allTasks);
                    setLevelInfo((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLevelInfo"])(xp));
                } catch  {}
            }
            // Load Tasks
            const rawTasks = localStorage.getItem(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TASKS_KEY_PREFIX"]}${id}`);
            if (rawTasks) {
                try {
                    const parsed = JSON.parse(rawTasks);
                    if (Array.isArray(parsed)) {
                        setTasks(parsed.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTask"]));
                    }
                } catch  {}
            }
            // Load Note
            const rawNote = localStorage.getItem(NOTE_KEY);
            if (rawNote) {
                setWeeklyNote(rawNote);
            }
            setLoaded(true);
        }
    }["ReportDetailPage.useEffect"], [
        id,
        NOTE_KEY
    ]);
    // Update XP when current tasks change (Realtime update!)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            // This is local update optimization: 
            // Re-calculating ALL XP every time we tick a checkbox might be heavy if we re-read all reports.
            // But we can optimize: We know total XP excluding THIS report, plus XP from THIS report.
            // For simplicity, let's just re-calculate all for now. LocalStorage read is fast.
            if (!loaded || allReports.length === 0) return;
            const now = Date.now();
            const allTasks = [];
            for (const r of allReports){
                if (r.id === id) {
                    // Use current state for this report!
                    allTasks.push(...tasks);
                } else {
                    allTasks.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadTasks"])(r.id, now));
                }
            }
            const xp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTotalXP"])(allTasks);
            setLevelInfo((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLevelInfo"])(xp));
            // Generate Advice
            setAdvice((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coaching$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateCoachAdvice"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildStats"])(tasks), tasks));
        }
    }["ReportDetailPage.useEffect"], [
        tasks,
        allReports,
        loaded,
        id
    ]);
    // 2. Timer Loop (update 'now' every second)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            const timer = setInterval({
                "ReportDetailPage.useEffect.timer": ()=>{
                    setNow(Date.now());
                }
            }["ReportDetailPage.useEffect.timer"], 1000);
            return ({
                "ReportDetailPage.useEffect": ()=>clearInterval(timer)
            })["ReportDetailPage.useEffect"];
        }
    }["ReportDetailPage.useEffect"], []);
    // 3. Auto Save Tasks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (!loaded || !id) return;
            localStorage.setItem(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TASKS_KEY_PREFIX"]}${id}`, JSON.stringify(tasks));
            showSavedIndicator();
        }
    }["ReportDetailPage.useEffect"], [
        tasks,
        loaded,
        id
    ]);
    // 4. Auto Save Note
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (!loaded || !id) return;
            localStorage.setItem(NOTE_KEY, weeklyNote);
            setNoteSavedMessage("保存しました");
            const t = setTimeout({
                "ReportDetailPage.useEffect.t": ()=>setNoteSavedMessage("")
            }["ReportDetailPage.useEffect.t"], 2000);
            return ({
                "ReportDetailPage.useEffect": ()=>clearTimeout(t)
            })["ReportDetailPage.useEffect"];
        }
    }["ReportDetailPage.useEffect"], [
        weeklyNote,
        loaded,
        id,
        NOTE_KEY
    ]);
    // --- Helper: Save Indicator ---
    const showSavedIndicator = ()=>{
        setSavedMessage("保存しました");
        const t = setTimeout(()=>setSavedMessage(""), 2000);
        return ()=>clearTimeout(t);
    };
    // --- Actions ---
    const handleAddTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleAddTask]": (title)=>{
            const newTask = {
                id: crypto.randomUUID(),
                title,
                status: "todo",
                tag: null,
                priority: "p1",
                isToday: false,
                estimatedMinutes: null,
                actualSeconds: 0,
                isRunning: false,
                startedAt: null
            };
            setTasks({
                "ReportDetailPage.useCallback[handleAddTask]": (prev)=>[
                        newTask,
                        ...prev
                    ]
            }["ReportDetailPage.useCallback[handleAddTask]"]);
        }
    }["ReportDetailPage.useCallback[handleAddTask]"], []);
    const handleChangeStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleChangeStatus]": (taskId, status)=>{
            setTasks({
                "ReportDetailPage.useCallback[handleChangeStatus]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleChangeStatus]": (t)=>{
                            if (t.id !== taskId) return t;
                            // If completing, stop timer
                            if (status === "done" && t.isRunning) {
                                const added = t.startedAt ? Math.floor((Date.now() - t.startedAt) / 1000) : 0;
                                return {
                                    ...t,
                                    status,
                                    isRunning: false,
                                    startedAt: null,
                                    actualSeconds: t.actualSeconds + added
                                };
                            }
                            return {
                                ...t,
                                status
                            };
                        }
                    }["ReportDetailPage.useCallback[handleChangeStatus]"])
            }["ReportDetailPage.useCallback[handleChangeStatus]"]);
        }
    }["ReportDetailPage.useCallback[handleChangeStatus]"], []);
    const handleChangeTag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleChangeTag]": (taskId, tag)=>{
            setTasks({
                "ReportDetailPage.useCallback[handleChangeTag]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleChangeTag]": (t)=>t.id === taskId ? {
                                ...t,
                                tag: tag || null
                            } : t
                    }["ReportDetailPage.useCallback[handleChangeTag]"])
            }["ReportDetailPage.useCallback[handleChangeTag]"]);
        }
    }["ReportDetailPage.useCallback[handleChangeTag]"], []);
    const handleChangePriority = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleChangePriority]": (taskId, priority)=>{
            setTasks({
                "ReportDetailPage.useCallback[handleChangePriority]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleChangePriority]": (t)=>t.id === taskId ? {
                                ...t,
                                priority: priority
                            } : t
                    }["ReportDetailPage.useCallback[handleChangePriority]"])
            }["ReportDetailPage.useCallback[handleChangePriority]"]);
        }
    }["ReportDetailPage.useCallback[handleChangePriority]"], []);
    const handleChangeEstimated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleChangeEstimated]": (taskId, value)=>{
            const num = parseInt(value, 10);
            setTasks({
                "ReportDetailPage.useCallback[handleChangeEstimated]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleChangeEstimated]": (t)=>t.id === taskId ? {
                                ...t,
                                estimatedMinutes: isNaN(num) ? null : num
                            } : t
                    }["ReportDetailPage.useCallback[handleChangeEstimated]"])
            }["ReportDetailPage.useCallback[handleChangeEstimated]"]);
        }
    }["ReportDetailPage.useCallback[handleChangeEstimated]"], []);
    const handleToggleToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleToggleToday]": (taskId)=>{
            setTasks({
                "ReportDetailPage.useCallback[handleToggleToday]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleToggleToday]": (t)=>t.id === taskId ? {
                                ...t,
                                isToday: !t.isToday
                            } : t
                    }["ReportDetailPage.useCallback[handleToggleToday]"])
            }["ReportDetailPage.useCallback[handleToggleToday]"]);
        }
    }["ReportDetailPage.useCallback[handleToggleToday]"], []);
    const handleStartTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleStartTimer]": (taskId)=>{
            setTasks({
                "ReportDetailPage.useCallback[handleStartTimer]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleStartTimer]": (t)=>{
                            if (t.id === taskId) {
                                return {
                                    ...t,
                                    isRunning: true,
                                    startedAt: Date.now()
                                };
                            }
                            if (t.isRunning && t.startedAt) {
                                const added = Math.floor((Date.now() - t.startedAt) / 1000);
                                return {
                                    ...t,
                                    isRunning: false,
                                    startedAt: null,
                                    actualSeconds: t.actualSeconds + added
                                };
                            }
                            return t;
                        }
                    }["ReportDetailPage.useCallback[handleStartTimer]"])
            }["ReportDetailPage.useCallback[handleStartTimer]"]);
        }
    }["ReportDetailPage.useCallback[handleStartTimer]"], []);
    const handleStopTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleStopTimer]": (taskId)=>{
            setTasks({
                "ReportDetailPage.useCallback[handleStopTimer]": (prev)=>prev.map({
                        "ReportDetailPage.useCallback[handleStopTimer]": (t)=>{
                            if (t.id !== taskId) return t;
                            if (!t.isRunning || !t.startedAt) return t;
                            const added = Math.floor((Date.now() - t.startedAt) / 1000);
                            return {
                                ...t,
                                isRunning: false,
                                startedAt: null,
                                actualSeconds: t.actualSeconds + added
                            };
                        }
                    }["ReportDetailPage.useCallback[handleStopTimer]"])
            }["ReportDetailPage.useCallback[handleStopTimer]"]);
        }
    }["ReportDetailPage.useCallback[handleStopTimer]"], []);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleDelete]": (taskId)=>{
            if (!confirm("本当に削除しますか？")) return;
            setTasks({
                "ReportDetailPage.useCallback[handleDelete]": (prev)=>prev.filter({
                        "ReportDetailPage.useCallback[handleDelete]": (t)=>t.id !== taskId
                    }["ReportDetailPage.useCallback[handleDelete]"])
            }["ReportDetailPage.useCallback[handleDelete]"]);
        }
    }["ReportDetailPage.useCallback[handleDelete]"], []);
    const handleRestore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleRestore]": (newTasks, newNote)=>{
            try {
                const normalized = newTasks.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTask"]);
                setTasks(normalized);
                setWeeklyNote(newNote);
            } catch (e) {
                alert("復元に失敗しました");
            }
        }
    }["ReportDetailPage.useCallback[handleRestore]"], []);
    // --- Derived Data ---
    const tags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[tags]": ()=>{
            // 1. Tags from current tasks
            const currentTags = new Set();
            tasks.forEach({
                "ReportDetailPage.useMemo[tags]": (t)=>{
                    if (t.tag) currentTags.add(t.tag);
                }
            }["ReportDetailPage.useMemo[tags]"]);
            // 2. Load globally saved tags (from tags page source)
            if ("TURBOPACK compile-time truthy", 1) {
                const globalTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadStoredTags"])();
                globalTags.forEach({
                    "ReportDetailPage.useMemo[tags]": (t)=>currentTags.add(t)
                }["ReportDetailPage.useMemo[tags]"]);
            }
            return Array.from(currentTags).sort();
        }
    }["ReportDetailPage.useMemo[tags]"], [
        tasks
    ]);
    // Sync new tags to global storage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (!loaded) return;
            const globalTags = new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadStoredTags"])());
            let changed = false;
            tasks.forEach({
                "ReportDetailPage.useEffect": (t)=>{
                    if (t.tag && !globalTags.has(t.tag)) {
                        globalTags.add(t.tag);
                        changed = true;
                    }
                }
            }["ReportDetailPage.useEffect"]);
            if (changed) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveStoredTags"])(Array.from(globalTags));
            }
        }
    }["ReportDetailPage.useEffect"], [
        tasks,
        loaded
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[stats]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildStats"])(tasks)
    }["ReportDetailPage.useMemo[stats]"], [
        tasks
    ]);
    const countsByStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[countsByStatus]": ()=>{
            const counts = {
                done: 0,
                doing: 0,
                todo: 0,
                not_decided: 0
            };
            tasks.forEach({
                "ReportDetailPage.useMemo[countsByStatus]": (t)=>{
                    if (counts[t.status] !== undefined) counts[t.status]++;
                }
            }["ReportDetailPage.useMemo[countsByStatus]"]);
            return counts;
        }
    }["ReportDetailPage.useMemo[countsByStatus]"], [
        tasks
    ]);
    // Derived: Find current report object
    const report = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[report]": ()=>{
            return allReports.find({
                "ReportDetailPage.useMemo[report]": (r)=>r.id === id
            }["ReportDetailPage.useMemo[report]"]) || {
                id: id,
                title: "読込中...",
                description: "",
                createdAt: new Date().toISOString(),
                weekStart: new Date().toISOString(),
                weekEnd: new Date().toISOString()
            };
        }
    }["ReportDetailPage.useMemo[report]"], [
        allReports,
        id
    ]);
    const handleDeleteAllTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportDetailPage.useCallback[handleDeleteAllTasks]": ()=>{
            setTasks([]);
            setWeeklyNote("");
        }
    }["ReportDetailPage.useCallback[handleDeleteAllTasks]"], []);
    // If not loaded yet
    if (!loaded) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 text-center text-slate-500",
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/src/app/reports/[id]/page.tsx",
        lineNumber: 351,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50/50 pb-20",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReportDetailHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportDetailHeader"], {
                    id: id,
                    loaded: loaded,
                    savedMessage: savedMessage,
                    totalCount: tasks.length,
                    countsByStatus: countsByStatus,
                    levelInfo: levelInfo,
                    advice: advice
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 357,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$task$2f$TaskInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskInput"], {
                                    onAdd: handleAddTask
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$task$2f$TaskList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskList"], {
                                    tasks: tasks,
                                    now: now,
                                    tags: tags,
                                    showTodayOnly: showTodayOnly,
                                    setShowTodayOnly: setShowTodayOnly,
                                    showCompleted: showCompleted,
                                    setShowCompleted: setShowCompleted,
                                    tagFilter: tagFilter,
                                    setTagFilter: setTagFilter,
                                    actions: {
                                        onChangeStatus: handleChangeStatus,
                                        onChangeTag: handleChangeTag,
                                        onChangePriority: handleChangePriority,
                                        onChangeEstimated: handleChangeEstimated,
                                        onToggleToday: handleToggleToday,
                                        onStartTimer: handleStartTimer,
                                        onStopTimer: handleStopTimer,
                                        onDelete: handleDelete,
                                        onReorder: (newTasks)=>setTasks(newTasks)
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 368,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$report$2f$ReportSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportSummary"], {
                            tasks: tasks,
                            now: now
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 395,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$report$2f$ReportReflection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportReflection"], {
                            weeklyNote: weeklyNote,
                            setWeeklyNote: setWeeklyNote,
                            noteSavedMessage: noteSavedMessage,
                            tasks: tasks,
                            now: now
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 397,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$report$2f$ReportActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportActions"], {
                            id: report.id,
                            report: report,
                            tasks: tasks,
                            now: now,
                            weeklyNote: weeklyNote,
                            onRestore: handleRestore,
                            onDeleteAllTasks: handleDeleteAllTasks
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 367,
                    columnNumber: 9
                }, this),
                levelInfo && levelUpData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gamification$2f$LevelUpModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LevelUpModal"], {
                    show: showLevelUp,
                    oldLevel: levelUpData.old,
                    newLevel: levelUpData.new,
                    rank: levelInfo.rank,
                    onClose: ()=>setShowLevelUp(false)
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 417,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/reports/[id]/page.tsx",
            lineNumber: 355,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/reports/[id]/page.tsx",
        lineNumber: 354,
        columnNumber: 5
    }, this);
}
_s(ReportDetailPage, "Xu6dX+37t+xky/b2ElfPd1xRKGI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ReportDetailPage;
var _c;
__turbopack_context__.k.register(_c, "ReportDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1fc6475e._.js.map