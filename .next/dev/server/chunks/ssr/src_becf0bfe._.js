module.exports = [
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
}),
"[project]/src/components/focus/FocusTimer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusTimer",
    ()=>FocusTimer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function FocusTimer({ initialMinutes, onComplete, onExit }) {
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialMinutes * 60);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialMinutes * 60);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(()=>{
                setTimeLeft((prev)=>prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        // Don't auto-complete to avoid accidental triggers, let user feel the accomplishment
        // OR maybe play a sound? For now, just stop.
        }
        return ()=>clearInterval(interval);
    }, [
        isRunning,
        timeLeft
    ]);
    const progress = Math.max(0, timeLeft / duration); // 1.0 -> 0.0
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const fmt = (n)=>String(n).padStart(2, "0");
    const toggleTimer = ()=>setIsRunning(!isRunning);
    const resetTimer = ()=>{
        setIsRunning(false);
        setTimeLeft(duration);
    };
    // Circular Progress Props
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        height: radius * 2,
                        width: radius * 2,
                        className: "rotate-[-90deg]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                className: "stroke-slate-200 dark:stroke-[#2f3336]",
                                strokeWidth: stroke,
                                fill: "transparent",
                                r: normalizedRadius,
                                cx: radius,
                                cy: radius
                            }, void 0, false, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 54,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].circle, {
                                className: "stroke-indigo-500 dark:stroke-[#1d9bf0]",
                                strokeWidth: stroke,
                                fill: "transparent",
                                r: normalizedRadius,
                                cx: radius,
                                cy: radius,
                                strokeDasharray: circumference + " " + circumference,
                                strokeDashoffset: strokeDashoffset,
                                strokeLinecap: "round",
                                initial: {
                                    strokeDashoffset: circumference
                                },
                                animate: {
                                    strokeDashoffset
                                },
                                transition: {
                                    duration: 1,
                                    ease: "linear"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 62,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/focus/FocusTimer.tsx",
                        lineNumber: 53,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex flex-col items-center justify-center text-slate-800 dark:text-[#e7e9ea]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-6xl font-mono font-bold tracking-widest tabular-nums",
                                children: [
                                    fmt(minutes),
                                    ":",
                                    fmt(seconds)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 80,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-400 dark:text-[#71767b] mt-2 font-medium",
                                children: isRunning ? "FOCUSING..." : "READY"
                            }, void 0, false, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 83,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/focus/FocusTimer.tsx",
                        lineNumber: 79,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                lineNumber: 51,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onExit,
                        className: "p-4 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:bg-[#16181c] dark:text-[#71767b] dark:hover:bg-[#2f3336] dark:hover:text-[#e7e9ea] transition-all",
                        title: "終了して戻る",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "24",
                            height: "24",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M18 6 6 18"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                    lineNumber: 97,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "m6 6 12 12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                    lineNumber: 97,
                                    columnNumber: 48
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/focus/FocusTimer.tsx",
                            lineNumber: 96,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/focus/FocusTimer.tsx",
                        lineNumber: 91,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleTimer,
                        className: "p-6 rounded-full bg-white text-indigo-600 shadow-xl border border-indigo-100 dark:bg-black dark:text-[#1d9bf0] dark:border-[#1d9bf0]/50 hover:scale-105 active:scale-95 transition-all",
                        children: isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "32",
                            height: "32",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 107,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/focus/FocusTimer.tsx",
                            lineNumber: 106,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "32",
                            height: "32",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            className: "ml-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M8 5v14l11-7z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 111,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/focus/FocusTimer.tsx",
                            lineNumber: 110,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/focus/FocusTimer.tsx",
                        lineNumber: 101,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onComplete(duration - timeLeft),
                        className: "p-4 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-black dark:text-[#00ba7c] dark:border-[#003a27] hover:bg-emerald-500 hover:text-white dark:hover:bg-[#00ba7c] dark:hover:text-white transition-all",
                        title: "タスク完了！",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "24",
                            height: "24",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M20 6 9 17l-5-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                                lineNumber: 122,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/focus/FocusTimer.tsx",
                            lineNumber: 121,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/focus/FocusTimer.tsx",
                        lineNumber: 116,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                lineNumber: 90,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: resetTimer,
                    className: "text-xs text-slate-400 hover:text-slate-600 underline",
                    children: "タイマーをリセット"
                }, void 0, false, {
                    fileName: "[project]/src/components/focus/FocusTimer.tsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/focus/FocusTimer.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/focus/FocusTimer.tsx",
        lineNumber: 50,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/app/focus/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FocusPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reportUtils.ts [app-ssr] (ecmascript)"); // Assuming we need save logic imports that might not be exported yet, check utils
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$focus$2f$FocusTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/focus/FocusTimer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// We need a way to save specific report's tasks back to storage from here.
// Since loadTasks is readonly, we'll implement a simple save helper here or assume we can write to localStorage directly using the same key pattern.
function FocusPageContent() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const reportId = searchParams.get("reportId");
    const taskId = searchParams.get("taskId");
    const [task, setTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [allTasks, setAllTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // Keep all to save back
    const [isCompleted, setIsCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!reportId || !taskId) {
            setLoaded(true);
            return;
        }
        const now = Date.now();
        const tasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reportUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadTasks"])(reportId, now);
        setAllTasks(tasks);
        const found = tasks.find((t)=>t.id === taskId);
        if (found) {
            setTask(found);
        }
        setLoaded(true);
    }, [
        reportId,
        taskId
    ]);
    const handleComplete = (elapsedSeconds)=>{
        setIsCompleted(true);
        // Save status change
        if (reportId && taskId) {
            const nextTasks = allTasks.map((t)=>{
                if (t.id === taskId) {
                    return {
                        ...t,
                        status: "done",
                        // Only add what was actually spent in this session
                        actualSeconds: (t.actualSeconds || 0) + elapsedSeconds
                    };
                }
                return t;
            });
            // Persist
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
        // Delay route back to show celebration
        setTimeout(()=>{
            router.back();
        }, 2000);
    };
    const handleExit = ()=>{
        router.back();
    };
    if (!loaded) return null;
    if (!task) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-950 flex items-center justify-center text-slate-400",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "タスクが見つかりません"
                }, void 0, false, {
                    fileName: "[project]/src/app/focus/page.tsx",
                    lineNumber: 79,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleExit,
                    className: "ml-4 underline hover:text-white",
                    children: "戻る"
                }, void 0, false, {
                    fileName: "[project]/src/app/focus/page.tsx",
                    lineNumber: 80,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/focus/page.tsx",
            lineNumber: 78,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 transition-colors duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md mx-auto text-center space-y-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-xl font-medium text-slate-700 tracking-wide",
                            children: task.title
                        }, void 0, false, {
                            fileName: "[project]/src/app/focus/page.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/focus/page.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        transition: {
                            delay: 0.4
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$focus$2f$FocusTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FocusTimer"], {
                            initialMinutes: 25,
                            onComplete: handleComplete,
                            onExit: handleExit
                        }, void 0, false, {
                            fileName: "[project]/src/app/focus/page.tsx",
                            lineNumber: 103,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/focus/page.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/focus/page.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            scale: 0.5,
                            opacity: 0
                        },
                        animate: {
                            scale: 1.2,
                            opacity: 1
                        },
                        className: "text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse text-center",
                        children: [
                            "COMPLETED! 🎉",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-500 text-lg mt-4 font-medium tracking-widest",
                                children: "GREAT JOB"
                            }, void 0, false, {
                                fileName: "[project]/src/app/focus/page.tsx",
                                lineNumber: 126,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/focus/page.tsx",
                        lineNumber: 120,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/focus/page.tsx",
                    lineNumber: 114,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/focus/page.tsx",
                lineNumber: 112,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/focus/page.tsx",
        lineNumber: 86,
        columnNumber: 9
    }, this);
}
function FocusPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-50"
        }, void 0, false, {
            fileName: "[project]/src/app/focus/page.tsx",
            lineNumber: 137,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FocusPageContent, {}, void 0, false, {
            fileName: "[project]/src/app/focus/page.tsx",
            lineNumber: 138,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/focus/page.tsx",
        lineNumber: 137,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=src_becf0bfe._.js.map