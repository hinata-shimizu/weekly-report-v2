module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/reportUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "generateNotionText",
    ()=>generateNotionText,
    "generateReflectionText",
    ()=>generateReflectionText,
    "generateSlackText",
    ()=>generateSlackText,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
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
    if ("TURBOPACK compile-time truthy", 1) return DEFAULT_TAGS;
    //TURBOPACK unreachable
    ;
    const raw = undefined;
}
function saveStoredTags(tags) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
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
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
    const raw = undefined;
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
function loadAllReportsStats(reports) {
    const data = [];
    const now = Date.now();
    // Sort reports by date asc (Oldest -> Newest) for the chart
    const sorted = [
        ...reports
    ].sort((a, b)=>a.createdAt.localeCompare(b.createdAt));
    for (const r of sorted){
        const tasks = loadTasks(r.id, now);
        // Calculate stats
        const total = tasks.length;
        const done = tasks.filter((t)=>t.status === "done").length;
        const rate = total > 0 ? Math.round(done / total * 100) : 0;
        let totalSec = 0;
        tasks.forEach((t)=>{
            totalSec += getTotalActualSeconds(t, now);
        });
        const hours = parseFloat((totalSec / 3600).toFixed(1));
        // Label: Short date range e.g. "12/29"
        const d = new Date(r.createdAt);
        const label = !Number.isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()}` : "N/A";
        data.push({
            id: r.id,
            label,
            focusTime: hours,
            doneCount: done,
            completionRate: rate
        });
    }
    return data;
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
}),
"[project]/src/lib/gamification.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RANKS",
    ()=>RANKS,
    "calculateTotalXP",
    ()=>calculateTotalXP,
    "getLevelInfo",
    ()=>getLevelInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-ssr] (ecmascript)");
;
const RANKS = [
    {
        name: "見習い (Novice)",
        color: "text-slate-500",
        minLevel: 1
    },
    {
        name: "一般 (Associate)",
        color: "text-emerald-500",
        minLevel: 5
    },
    {
        name: "シニア (Senior)",
        color: "text-blue-500",
        minLevel: 10
    },
    {
        name: "プロ (Principal)",
        color: "text-indigo-500",
        minLevel: 15
    },
    {
        name: "マネージャー (Manager)",
        color: "text-violet-500",
        minLevel: 20
    },
    {
        name: "部長 (Director)",
        color: "text-pink-500",
        minLevel: 30
    },
    {
        name: "役員 (VP)",
        color: "text-rose-500",
        minLevel: 50
    },
    {
        name: "伝説 (Legend)",
        color: "text-amber-500",
        minLevel: 99
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
        const totalSeconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTotalActualSeconds"])(t, 0); // 0 for strict historical calc, or now if realtime
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
}),
"[project]/src/app/reports/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gamification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gamification.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ReportsPage() {
    const [reports, setReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 週ごとの集計キャッシュ
    const [statsById, setStatsById] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // トレンドデータ
    const [trendData, setTrendData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showTrend, setShowTrend] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Gamification
    const [levelInfo, setLevelInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    // ... (useEffect for loading reports is same) ...
    // 集計を作る
    const refreshStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const nowMs = undefined;
        const next = undefined;
        const allTasksForXP = undefined; // Collect all tasks for XP
        const r = undefined;
        // Gamification Update
        const totalXP = undefined;
    }, [
        reports
    ]);
    // ... (rest is same)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen relative p-4 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl space-y-10 relative z-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCard, {
                    delay: 0,
                    className: "p-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReportsHeader, {
                        reportCount: reports.length,
                        loading: !loaded,
                        levelInfo: levelInfo,
                        onAddReport: handleAddReport
                    }, void 0, false, {
                        fileName: "[project]/src/app/reports/page.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/page.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCard, {
                            delay: 0.1,
                            className: "border-none shadow-none bg-transparent",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex bg-white/40 p-1 rounded-lg backdrop-blur-md border border-white/50 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowTrend(false),
                                            className: `px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!showTrend ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`,
                                            children: "今週のサマリー"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowTrend(true),
                                            className: `px-4 py-1.5 text-sm font-medium rounded-md transition-all ${showTrend ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`,
                                            children: "長期トレンド"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/page.tsx",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/reports/page.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: showTrend ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCard, {
                                delay: 0.2,
                                className: "bg-transparent border-none shadow-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TrendAnalysis, {
                                    data: trendData
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 17
                                }, this)
                            }, "trend", false, {
                                fileName: "[project]/src/app/reports/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCard, {
                                delay: 0.2,
                                className: "bg-transparent border-none shadow-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardStats, {
                                    thisWeekReport: thisWeekReport,
                                    thisWeekStats: thisWeekStats,
                                    onRefresh: refreshStats
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/page.tsx",
                                    lineNumber: 126,
                                    columnNumber: 17
                                }, this)
                            }, "dashboard", false, {
                                fileName: "[project]/src/app/reports/page.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/page.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCard, {
                    delay: 0.3,
                    className: "bg-transparent border-none shadow-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReportList, {
                        reports: reports,
                        statsById: statsById,
                        onDelete: handleDelete
                    }, void 0, false, {
                        fileName: "[project]/src/app/reports/page.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/reports/page.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/reports/page.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07192df0._.js.map