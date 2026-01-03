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
    "generateReflectionText",
    ()=>generateReflectionText,
    "getRunningExtraSeconds",
    ()=>getRunningExtraSeconds,
    "getTagColor",
    ()=>getTagColor,
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
    return {
        totalCount,
        doneCount,
        todayRemaining,
        totalActualSeconds,
        estimatedCount,
        avgDiffMinutes,
        topTags
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
function loadAllReportsStats(reports) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Sort by date ascending for trend (Oldest -> Newest)
    const sorted = [
        ...reports
    ].sort((a, b)=>{
        const ta = new Date(a.weekStart).getTime();
        const tb = new Date(b.weekStart).getTime();
        return (Number.isNaN(ta) ? 0 : ta) - (Number.isNaN(tb) ? 0 : tb);
    });
    return sorted.map((report)=>{
        const tasks = loadTasks(report.id, Date.now());
        const stats = buildStats(tasks);
        // Format name from weekStart (e.g. "12/9")
        const d = new Date(report.weekStart);
        const name = !Number.isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()}` : report.id;
        const totalActualHours = Math.round(stats.totalActualSeconds / 3600 * 10) / 10;
        const completionRate = stats.totalCount > 0 ? Math.round(stats.doneCount / stats.totalCount * 100) : 0;
        return {
            name,
            weekStart: report.weekStart,
            totalActualHours,
            totalTasks: stats.totalCount,
            completionRate,
            doneCount: stats.doneCount
        };
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ReportsHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportsHeader",
    ()=>ReportsHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function ReportsHeader({ reportCount, loading, onAddReport }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl md:text-3xl font-bold tracking-tight text-slate-900",
                        children: "週報一覧"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ReportsHeader.tsx",
                        lineNumber: 14,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500 max-w-lg leading-relaxed",
                        children: [
                            "週ごとのタスクや振り返りをまとめたページです。",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                className: "hidden md:block"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportsHeader.tsx",
                                lineNumber: 18,
                                columnNumber: 44
                            }, this),
                            "各行をクリックすると詳細に移動します。"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportsHeader.tsx",
                        lineNumber: 17,
                        columnNumber: 17
                    }, this),
                    !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-400 pt-1",
                        children: [
                            "現在のレポート数: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-slate-600",
                                children: [
                                    reportCount,
                                    "件"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ReportsHeader.tsx",
                                lineNumber: 23,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportsHeader.tsx",
                        lineNumber: 22,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ReportsHeader.tsx",
                lineNumber: 13,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/tags",
                        className: "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base",
                                children: "🏷️"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportsHeader.tsx",
                                lineNumber: 33,
                                columnNumber: 21
                            }, this),
                            "タグ管理"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportsHeader.tsx",
                        lineNumber: 29,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onAddReport,
                        className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "＋"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ReportsHeader.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, this),
                            "新しい週を追加"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportsHeader.tsx",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ReportsHeader.tsx",
                lineNumber: 28,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ReportsHeader.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
_c = ReportsHeader;
var _c;
__turbopack_context__.k.register(_c, "ReportsHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DashboardStats.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardStats",
    ()=>DashboardStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
;
;
function DashboardStats({ thisWeekReport, thisWeekStats, onRefresh }) {
    if (!thisWeekReport || !thisWeekStats) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-slate-500",
                children: "今週のレポートが見つかりません。右上の「新しい週を追加」から作成できます。"
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardStats.tsx",
                lineNumber: 20,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/DashboardStats.tsx",
            lineNumber: 19,
            columnNumber: 13
        }, this);
    }
    const completionRate = thisWeekStats.totalCount === 0 ? 0 : Math.round(thisWeekStats.doneCount / thisWeekStats.totalCount * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base font-bold text-slate-800 flex items-center gap-2",
                        children: [
                            "📊 ホーム ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-normal text-slate-400",
                                children: "| 今週の状況"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 36,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardStats.tsx",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRefresh,
                        className: "text-xs text-slate-500 hover:text-slate-800 hover:underline transition-colors",
                        children: "集計を更新"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardStats.tsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardStats.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/reports/${thisWeekReport.id}`,
                        className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-0 h-16 w-16 -mr-4 -mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 53,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600",
                                                children: "CURRENT"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardStats.tsx",
                                                lineNumber: 57,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-slate-400",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(thisWeekReport.createdAt)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardStats.tsx",
                                                lineNumber: 60,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 56,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mt-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1",
                                        children: thisWeekReport.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 64,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 55,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex items-center justify-end text-xs font-medium text-slate-500 group-hover:translate-x-1 transition-transform",
                                children: [
                                    "開く ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-1",
                                        children: "→"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 70,
                                        columnNumber: 28
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 69,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardStats.tsx",
                        lineNumber: 49,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-0 h-20 w-20 -mr-6 -mt-6 bg-emerald-50 rounded-full blur-xl opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 76,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-slate-500 z-10",
                                children: "合計実績時間"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 77,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold text-slate-800 tracking-tight",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(thisWeekStats.totalActualSeconds)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 79,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-400 mt-1",
                                        children: "タスク全体の作業時間"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 82,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 78,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardStats.tsx",
                        lineNumber: 75,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-0 h-20 w-20 -mr-6 -mt-6 bg-blue-50 rounded-full blur-xl opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 88,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-slate-500 z-10",
                                children: "完了率"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 89,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-baseline gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl font-bold text-slate-800 tracking-tight",
                                                children: thisWeekStats.totalCount === 0 ? "—" : `${completionRate}%`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardStats.tsx",
                                                lineNumber: 92,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-500",
                                                children: [
                                                    "(",
                                                    thisWeekStats.doneCount,
                                                    "/",
                                                    thisWeekStats.totalCount,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DashboardStats.tsx",
                                                lineNumber: 95,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 91,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full bg-blue-500 rounded-full",
                                            style: {
                                                width: `${completionRate}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardStats.tsx",
                                            lineNumber: 101,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 100,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 90,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardStats.tsx",
                        lineNumber: 87,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-0 h-20 w-20 -mr-6 -mt-6 bg-amber-50 rounded-full blur-xl opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 111,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-slate-500 z-10",
                                children: "今日の残りタスク"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-2xl font-bold tracking-tight ${thisWeekStats.todayRemaining > 0 ? 'text-amber-600' : 'text-slate-300'}`,
                                        children: [
                                            thisWeekStats.todayRemaining,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-normal text-slate-400 ml-1",
                                                children: "件"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardStats.tsx",
                                                lineNumber: 116,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 114,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-400 mt-1",
                                        children: thisWeekStats.todayRemaining > 0 ? "あと一息です！" : "すべて完了しました 🎉"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardStats.tsx",
                                        lineNumber: 118,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardStats.tsx",
                                lineNumber: 113,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardStats.tsx",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardStats.tsx",
                lineNumber: 47,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardStats.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
_c = DashboardStats;
var _c;
__turbopack_context__.k.register(_c, "DashboardStats");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ReportList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportList",
    ()=>ReportList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
;
;
;
function ReportList({ reports, statsById, onDelete }) {
    if (reports.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mb-4",
                    children: "📝"
                }, void 0, false, {
                    fileName: "[project]/src/components/ReportList.tsx",
                    lineNumber: 22,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-base font-semibold text-slate-900",
                    children: "週報がまだありません"
                }, void 0, false, {
                    fileName: "[project]/src/components/ReportList.tsx",
                    lineNumber: 25,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-sm text-slate-500",
                    children: "「新しい週を追加」ボタンから、今週のレポートを作成してみましょう。"
                }, void 0, false, {
                    fileName: "[project]/src/components/ReportList.tsx",
                    lineNumber: 26,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ReportList.tsx",
            lineNumber: 21,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base font-bold text-slate-800 flex items-center gap-2",
                        children: "📑 レポート一覧"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ReportList.tsx",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] text-slate-400",
                        children: [
                            "Total: ",
                            reports.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ReportList.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ReportList.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: reports.map((report)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReportRow, {
                        report: report,
                        stats: statsById[report.id],
                        onDelete: (e)=>onDelete(report.id, e)
                    }, report.id, false, {
                        fileName: "[project]/src/components/ReportList.tsx",
                        lineNumber: 44,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ReportList.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ReportList.tsx",
        lineNumber: 34,
        columnNumber: 9
    }, this);
}
_c = ReportList;
function ReportRow({ report, stats, onDelete }) {
    const avg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAvgDiff"])(stats?.avgDiffMinutes ?? null);
    const totalSec = stats?.totalActualSeconds ?? 0;
    const done = stats?.doneCount ?? 0;
    const total = stats?.totalCount ?? 0;
    const topTags = stats?.topTags ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/reports/${report.id}`,
        className: "group block rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 hover:-translate-y-0.5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col sm:flex-row gap-4 sm:items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 min-w-0 space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate",
                                    children: report.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 font-mono",
                                    children: [
                                        "#",
                                        report.id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 83,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ReportList.tsx",
                            lineNumber: 79,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500 line-clamp-1 group-hover:text-slate-600",
                            children: report.description
                        }, void 0, false, {
                            fileName: "[project]/src/components/ReportList.tsx",
                            lineNumber: 87,
                            columnNumber: 21
                        }, this),
                        topTags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden sm:flex items-center gap-2 pt-1",
                            children: topTags.slice(0, 3).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 border border-slate-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-indigo-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 99,
                                            columnNumber: 37
                                        }, this),
                                        t.tag,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-400 font-normal ml-0.5",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(t.seconds)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 101,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, t.tag, true, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 95,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ReportList.tsx",
                            lineNumber: 93,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ReportList.tsx",
                    lineNumber: 78,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1 text-right border-t sm:border-t-0 border-dashed pt-3 sm:pt-0 border-slate-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 sm:gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center sm:text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-slate-400 uppercase tracking-wider font-semibold",
                                            children: "Done"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 114,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-bold text-slate-700",
                                            children: [
                                                done,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-medium text-slate-400",
                                                    children: [
                                                        "/",
                                                        total
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ReportList.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 115,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 113,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-px h-6 bg-slate-100 hidden sm:block"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 121,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center sm:text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-slate-400 uppercase tracking-wider font-semibold",
                                            children: "Time"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 124,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-bold text-slate-700",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHMFromSecondsSimple"])(totalSec)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 125,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 123,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-px h-6 bg-slate-100 hidden sm:block"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 130,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:block text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-slate-400 uppercase tracking-wider font-semibold",
                                            children: "Diff"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 133,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-bold", avg.className),
                                            children: avg.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ReportList.tsx",
                                            lineNumber: 134,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 132,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ReportList.tsx",
                            lineNumber: 112,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-3 mt-1 pl-2 sm:pl-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-slate-400",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(report.createdAt)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDelete(e);
                                    },
                                    className: "p-1 -mr-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors",
                                    title: "削除",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "14",
                                        height: "14",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 6h18"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ReportList.tsx",
                                                lineNumber: 152,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ReportList.tsx",
                                                lineNumber: 152,
                                                columnNumber: 53
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ReportList.tsx",
                                                lineNumber: 152,
                                                columnNumber: 103
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ReportList.tsx",
                                        lineNumber: 151,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ReportList.tsx",
                                    lineNumber: 142,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ReportList.tsx",
                            lineNumber: 138,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ReportList.tsx",
                    lineNumber: 111,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ReportList.tsx",
            lineNumber: 76,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ReportList.tsx",
        lineNumber: 72,
        columnNumber: 9
    }, this);
}
_c1 = ReportRow;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReportList");
__turbopack_context__.k.register(_c1, "ReportRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/reports/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReportsHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ReportsHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardStats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DashboardStats.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReportList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ReportList.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ReportsPage() {
    _s();
    const [reports, setReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 週ごとの集計キャッシュ
    const [statsById, setStatsById] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // 初回読み込み：localStorage から一覧を読む
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportsPage.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const raw = window.localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEY"]);
            if (!raw) {
                // 初期サンプル（全部「今週」）
                const now = new Date();
                const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekRange"])(now);
                const weekStartIso = start.toISOString();
                const weekEndIso = end.toISOString();
                const title = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWeekRangeTitle"])(weekStartIso, weekEndIso);
                const createdAt = now.toISOString();
                const initial = [
                    {
                        id: "1",
                        title,
                        description: "この週に取り組んだタスクや学びを整理します。（サンプル）",
                        createdAt,
                        weekStart: weekStartIso,
                        weekEnd: weekEndIso
                    },
                    {
                        id: "2",
                        title,
                        description: "引き続き、今週のアウトプットを記録します。（サンプル）",
                        createdAt,
                        weekStart: weekStartIso,
                        weekEnd: weekEndIso
                    },
                    {
                        id: "3",
                        title,
                        description: "より具体的な成果や反省点を書き出してみましょう。（サンプル）",
                        createdAt,
                        weekStart: weekStartIso,
                        weekEnd: weekEndIso
                    }
                ];
                setReports((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortReportsDesc"])(initial));
                setLoaded(true);
                return;
            }
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    const normalized = parsed.map({
                        "ReportsPage.useEffect.normalized": (r, index)=>{
                            const id = String(r.id ?? index + 1);
                            const createdAt = typeof r.createdAt === "string" && r.createdAt ? r.createdAt : new Date().toISOString();
                            const createdDate = new Date(createdAt);
                            const baseDate = Number.isNaN(createdDate.getTime()) ? new Date() : createdDate;
                            let weekStartIso;
                            let weekEndIso;
                            if (typeof r.weekStart === "string" && typeof r.weekEnd === "string") {
                                weekStartIso = r.weekStart;
                                weekEndIso = r.weekEnd;
                            } else {
                                const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekRange"])(baseDate);
                                weekStartIso = start.toISOString();
                                weekEndIso = end.toISOString();
                            }
                            const title = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWeekRangeTitle"])(weekStartIso, weekEndIso);
                            const description = typeof r.description === "string" && r.description.trim() !== "" ? r.description : "この週のタスクや振り返りを記録します。";
                            return {
                                id,
                                title,
                                description,
                                createdAt,
                                weekStart: weekStartIso,
                                weekEnd: weekEndIso
                            };
                        }
                    }["ReportsPage.useEffect.normalized"]);
                    setReports((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortReportsDesc"])(normalized));
                } else {
                    setReports([]);
                }
            } catch (e) {
                console.error("failed to parse reports from localStorage", e);
                setReports([]);
            }
            setLoaded(true);
        }
    }["ReportsPage.useEffect"], []);
    // 一覧が変わるたびに保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportsPage.useEffect": ()=>{
            if (!loaded) return;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEY"], JSON.stringify(reports));
        }
    }["ReportsPage.useEffect"], [
        reports,
        loaded
    ]);
    // 集計を作る（戻ってきたときも最新化するため focus で再計算）
    const refreshStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ReportsPage.useCallback[refreshStats]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const nowMs = Date.now();
            const next = {};
            for (const r of reports){
                const tasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadTasks"])(r.id, nowMs);
                next[r.id] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildStats"])(tasks);
            }
            setStatsById(next);
        }
    }["ReportsPage.useCallback[refreshStats]"], [
        reports
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportsPage.useEffect": ()=>{
            if (!loaded) return;
            refreshStats();
            const onFocus = {
                "ReportsPage.useEffect.onFocus": ()=>refreshStats()
            }["ReportsPage.useEffect.onFocus"];
            window.addEventListener("focus", onFocus);
            return ({
                "ReportsPage.useEffect": ()=>window.removeEventListener("focus", onFocus)
            })["ReportsPage.useEffect"];
        }
    }["ReportsPage.useEffect"], [
        loaded,
        refreshStats
    ]);
    // 新しい週を追加
    const handleAddReport = ()=>{
        setReports((prev)=>{
            const numericIds = prev.map((r)=>Number(r.id)).filter((n)=>!Number.isNaN(n));
            const nextIdNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
            const nextId = String(nextIdNum);
            const now = new Date();
            const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekRange"])(now);
            const weekStartIso = start.toISOString();
            const weekEndIso = end.toISOString();
            const newReport = {
                id: nextId,
                title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWeekRangeTitle"])(weekStartIso, weekEndIso),
                description: "新しく作成した週のタスクや振り返りを記録できます。",
                createdAt: now.toISOString(),
                weekStart: weekStartIso,
                weekEnd: weekEndIso
            };
            const next = [
                newReport,
                ...prev
            ];
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortReportsDesc"])(next);
        });
    };
    // 週報削除（確認ダイアログ付き）
    const handleDelete = (reportId, e)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            const ok = window.confirm("本当にこのレポートを削除してよろしいですか？\n（このレポートに紐づくタスクとメモも削除されます）");
            if (!ok) return;
            // その週報のタスク＆メモも削除
            window.localStorage.removeItem(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TASKS_KEY_PREFIX"]}${reportId}`);
            window.localStorage.removeItem(`weekly-report-note-${reportId}`);
        }
        setReports((prev)=>prev.filter((r)=>r.id !== reportId));
    };
    const thisWeekReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportsPage.useMemo[thisWeekReport]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findThisWeekReport"])(reports)
    }["ReportsPage.useMemo[thisWeekReport]"], [
        reports
    ]);
    const thisWeekStats = thisWeekReport ? statsById[thisWeekReport.id] : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50/50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl py-8 px-4 md:px-8 space-y-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReportsHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportsHeader"], {
                    reportCount: reports.length,
                    loading: !loaded,
                    onAddReport: handleAddReport
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/page.tsx",
                    lineNumber: 206,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardStats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardStats"], {
                    thisWeekReport: thisWeekReport,
                    thisWeekStats: thisWeekStats,
                    onRefresh: refreshStats
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/page.tsx",
                    lineNumber: 212,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ReportList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportList"], {
                    reports: reports,
                    statsById: statsById,
                    onDelete: handleDelete
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/page.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/reports/page.tsx",
            lineNumber: 205,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/reports/page.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_s(ReportsPage, "p8Ez60t2b9FuV+YiZXHF2QHUwyw=");
_c = ReportsPage;
var _c;
__turbopack_context__.k.register(_c, "ReportsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a1301934._.js.map