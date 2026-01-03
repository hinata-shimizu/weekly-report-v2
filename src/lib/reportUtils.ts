import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Types ---

export type Report = {
    id: string;
    title: string; // 「M/D～M/Dの週報」
    description: string; // 説明
    createdAt: string; // ISO文字列
    weekStart: string; // その週の開始日（ISO）
    weekEnd: string; // その週の終了日（ISO）
};

export type TaskStatus = "not_decided" | "todo" | "doing" | "done";

export type TaskPriority = "p0" | "p1" | "p2";

export type Task = {
    id: string;
    title: string;
    status: TaskStatus;
    tag: string | null;

    priority: TaskPriority; // existing code assumed "todo" priority but now we have explicit priority
    isToday: boolean;

    estimatedMinutes: number | null;
    actualSeconds: number;

    isRunning: boolean;
    startedAt: number | null;
};

// ... existing types ... 

export const PRIORITY_ORDER: TaskPriority[] = ["p0", "p1", "p2"];
export const STATUS_ORDER: TaskStatus[] = ["not_decided", "todo", "doing", "done"];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
    p0: "P0",
    p1: "P1",
    p2: "P2",
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
    not_decided: "未決定",
    todo: "未着手",
    doing: "進行中",
    done: "完了",
};

// ... existing constants ...

// --- Utility Functions ---

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ... existing functions (getWeekRange, formatWeekRangeTitle, formatDate, sortReportsDesc, safeTagLabel, formatHMFromSecondsSimple, clamp) ...

/** 完了時のnormalize用（詳細ページで使う） */
export function normalizeTask(t: any): Task {
    return {
        id: t?.id ?? crypto.randomUUID(),
        title: typeof t?.title === "string" ? t.title : "",
        status: (STATUS_ORDER as string[]).includes(t?.status)
            ? (t.status as TaskStatus)
            : "todo",
        tag: typeof t?.tag === "string" ? t.tag : null,

        priority: (PRIORITY_ORDER as string[]).includes(t?.priority)
            ? (t.priority as TaskPriority)
            : "p1",
        isToday: typeof t?.isToday === "boolean" ? t.isToday : false,

        estimatedMinutes: typeof t?.estimatedMinutes === "number" ? t.estimatedMinutes : null,
        actualSeconds: typeof t?.actualSeconds === "number" ? t.actualSeconds : 0,

        isRunning: false, // ロード時は停止
        startedAt: null,
    };
}

export function getRunningExtraSeconds(task: Task, now: number) {
    if (!task.isRunning || !task.startedAt) return 0;
    return Math.max(0, Math.floor((now - task.startedAt) / 1000));
}

export function getTotalActualSeconds(task: Task, now: number) {
    return task.actualSeconds + getRunningExtraSeconds(task, now);
}

export function formatJPDateTime(ms: number) {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${day} ${hh}:${mm}`;
}

export function pickTopBySeconds(tasks: Task[], now: number, n: number) {
    const arr = tasks
        .map((t) => ({ t, sec: getTotalActualSeconds(t, now) }))
        .filter((x) => x.sec > 0)
        .sort((a, b) => b.sec - a.sec)
        .slice(0, n);
    return arr;
}

export function pickTopTagsBySeconds(tasks: Task[], now: number, n: number) {
    const map = new Map<string, number>();
    for (const t of tasks) {
        const tag = safeTagLabel(t.tag ?? "");
        map.set(tag, (map.get(tag) ?? 0) + getTotalActualSeconds(t, now));
    }
    return Array.from(map.entries())
        .map(([tag, sec]) => ({ tag, sec }))
        .filter((x) => x.sec > 0)
        .sort((a, b) => b.sec - a.sec)
        .slice(0, n);
}

export function calcEstimateInsights(tasks: Task[], now: number) {
    const withEst = tasks.filter((t) => t.estimatedMinutes != null && t.estimatedMinutes >= 0);

    const diffs = withEst.map((t) => {
        const actualMin = Math.floor(getTotalActualSeconds(t, now) / 60);
        const estMin = t.estimatedMinutes ?? 0;
        const diff = actualMin - estMin;
        return { t, actualMin, estMin, diff };
    });

    const overruns = diffs
        .filter((x) => x.estMin > 0 && x.diff > 0)
        .sort((a, b) => b.diff - a.diff);

    const underruns = diffs
        .filter((x) => x.estMin > 0 && x.diff < 0)
        .sort((a, b) => a.diff - b.diff);

    const avgDiff =
        diffs.length > 0 ? diffs.reduce((sum, x) => sum + x.diff, 0) / diffs.length : null;

    return { withEstCount: diffs.length, avgDiff, overruns, underruns };
}

export function generateReflectionText(tasks: Task[], now: number, topN = 5) {
    const done = tasks.filter((t) => t.status === "done");
    const notDone = tasks.filter((t) => t.status !== "done");

    const totalSec = tasks.reduce((sum, t) => sum + getTotalActualSeconds(t, now), 0);
    const doneSec = done.reduce((sum, t) => sum + getTotalActualSeconds(t, now), 0);
    const notDoneSec = notDone.reduce((sum, t) => sum + getTotalActualSeconds(t, now), 0);

    const topTasks = pickTopBySeconds(tasks, now, 3);
    const topTags = pickTopTagsBySeconds(tasks, now, 5);

    // High Priority Done
    const doneP0 = done.filter(t => t.priority === "p0");

    // Low Priority but time consuming (Potential Problem)
    const timeWasters = done
        .filter(t => t.priority === "p2" && getTotalActualSeconds(t, now) > 30 * 60) // > 30 mins
        .sort((a, b) => getTotalActualSeconds(b, now) - getTotalActualSeconds(a, now));

    const todayNotDone = tasks
        .filter((t) => t.isToday && t.status !== "done")
        .sort((a, b) => {
            const pr: Record<TaskPriority, number> = { p0: 0, p1: 1, p2: 2 };
            return pr[a.priority] - pr[b.priority];
        });

    const { withEstCount, avgDiff, overruns } = calcEstimateInsights(tasks, now);

    const lines: string[] = [];
    lines.push(`【🤖 自動生成サマリー ${formatJPDateTime(now)}】`);
    lines.push("");

    // 1. Overview
    lines.push("📊 1. 定量データ");
    lines.push(`- 稼働時間：${formatHMFromSecondsSimple(totalSec)}（完了 ${formatHMFromSecondsSimple(doneSec)} / 未完了 ${formatHMFromSecondsSimple(notDoneSec)}）`);
    lines.push(`- タスク消化率：${Math.round((done.length / Math.max(tasks.length, 1)) * 100)}%（完了 ${done.length} / 全 ${tasks.length}）`);
    if (doneP0.length > 0) {
        lines.push(`- ★重要タスク(P0)達成数：${doneP0.length}件`);
    }
    lines.push("");

    // 2. Focus Area (Tags)
    lines.push("🎨 2. 時間の使い方（タグ分析）");
    if (topTags.length > 0) {
        topTags.forEach(row => {
            const pct = Math.round((row.sec / Math.max(totalSec, 1)) * 100);
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
            doneP0.forEach(t => lines.push(`  ✓ ${t.title} (${formatHMFromSecondsSimple(getTotalActualSeconds(t, now))})`));
        }
        // Others (Top 5 by time)
        const otherDone = done.filter(t => t.priority !== "p0")
            .sort((a, b) => getTotalActualSeconds(b, now) - getTotalActualSeconds(a, now))
            .slice(0, 5);

        if (otherDone.length > 0) {
            if (doneP0.length > 0) lines.push("【その他：主要な完了】");
            otherDone.forEach(t => lines.push(`  ✓ ${t.title} (${formatHMFromSecondsSimple(getTotalActualSeconds(t, now))})`));
        }
    }
    lines.push("");

    // 4. Issues / Next Actions
    lines.push("⚠️ 4. 課題・ネクストアクション");
    if (overruns.length > 0) {
        lines.push("- ⏰ 時間超過（見積もりとのズレ大）");
        overruns.slice(0, 3).forEach(x => {
            lines.push(`  ! ${x.t.title}：予 +${Math.round(x.diff)}分オーバー`);
        });
    }
    if (timeWasters.length > 0) {
        lines.push("- 🐢 優先度低だが時間消費大（要見直し？）");
        timeWasters.slice(0, 3).forEach(t => {
            lines.push(`  ? ${t.title} (P2)：${formatHMFromSecondsSimple(getTotalActualSeconds(t, now))}`);
        });
    }
    if (todayNotDone.length > 0) {
        lines.push("- 🔥 本日の積み残し");
        todayNotDone.slice(0, 3).forEach(t => {
            lines.push(`  -> ${t.title} (${PRIORITY_LABEL[t.priority]})`);
        });
    }
    if (overruns.length === 0 && timeWasters.length === 0 && todayNotDone.length === 0) {
        lines.push("- 特になし。順調です！🎉");
    }

    return lines.join("\n");
}

export function generateCsvText(tasks: Task[], now: number) {
    if (tasks.length === 0) return "";

    const escapeCsv = (value: string): string => {
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
    };

    const header = "タスク名,タグ,優先度,Today,ステータス,見積もり(分),実績(分),差分(分)";

    const lines = tasks.map((task) => {
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

        return [title, tagStr, priorityStr, todayStr, statusStr, estStr, actualStr, diffStr].join(",");
    });

    return [header, ...lines].join("\n");
}




export type ReportStats = {
    totalCount: number;
    doneCount: number;
    todayRemaining: number;

    totalActualSeconds: number;

    estimatedCount: number;
    avgDiffMinutes: number | null;

    topTags: { tag: string; seconds: number }[];
    highlights: Task[];
    noteSummary?: string;
};

// --- Constants ---

export const STORAGE_KEY = "weekly-report-list";
export const TASKS_KEY_PREFIX = "weekly-report-tasks-";
export const TAG_STORAGE_KEY = "weekly-report-tags";
export const DEFAULT_TAG_LABEL = "(未設定)";
export const DEFAULT_TAGS = ["開発", "学習", "就活", "事務", "生活"];

// --- Utility Functions ---

export function loadStoredTags(): string[] {
    if (typeof window === "undefined") return DEFAULT_TAGS;

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
    } catch {
        return DEFAULT_TAGS;
    }
}

export function saveStoredTags(tags: string[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
}

/** 週の開始・終了（月曜はじまり、日曜おわり） */
export function getWeekRange(date: Date): { start: Date; end: Date } {
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

    return { start, end };
}

/** タイトル用：「M/D～M/Dの週報」 */
export function formatWeekRangeTitle(startIso: string, endIso: string): string {
    const s = new Date(startIso);
    const e = new Date(endIso);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "週報";

    const sStr = s.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
    const eStr = e.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
    return `${sStr}～${eStr}の週報`;
}

/** 作成日の表示用（例: 2025/12/13） */
export function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

/** 一覧を「新しい順」に並べ替える（createdAt → id の順） */
export function sortReportsDesc(reports: Report[]): Report[] {
    return [...reports].sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) return tb - ta;

        const na = Number(a.id);
        const nb = Number(b.id);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;

        return 0;
    });
}

export function safeTagLabel(tag: unknown): string {
    if (typeof tag !== "string") return DEFAULT_TAG_LABEL;
    const t = tag.trim();
    return t ? t : DEFAULT_TAG_LABEL;
}

export function formatHMFromSecondsSimple(totalSeconds: number) {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h <= 0) return `${m}分`;
    if (m === 0) return `${h}時間`;
    return `${h}時間${m}分`;
}

export function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

/** タスク配列を安全に読む（壊れてても落ちない） */
export function loadTasks(reportId: string, nowMs: number): Task[] {
    if (typeof window === "undefined") return [];

    const raw = window.localStorage.getItem(`${TASKS_KEY_PREFIX}${reportId}`);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.map((t: any) => {
            const baseActual = typeof t?.actualSeconds === "number" ? t.actualSeconds : 0;
            const isRunning = !!t?.isRunning;
            const startedAt = typeof t?.startedAt === "number" ? t.startedAt : null;

            // 一覧ページでは「この瞬間の経過分」を加算して表示だけ更新（リアルタイム更新はしない）
            const extra =
                isRunning && startedAt ? Math.max(0, Math.floor((nowMs - startedAt) / 1000)) : 0;

            const status: TaskStatus =
                t?.status === "not_decided" || t?.status === "todo" || t?.status === "doing" || t?.status === "done"
                    ? t.status
                    : "todo";

            return {
                id: typeof t?.id === "string" ? t.id : crypto.randomUUID(),
                title: typeof t?.title === "string" ? t.title : "",
                status,
                tag: typeof t?.tag === "string" ? t.tag : null,

                priority: (PRIORITY_ORDER as string[]).includes(t?.priority) ? (t.priority as TaskPriority) : "p1",

                estimatedMinutes:
                    typeof t?.estimatedMinutes === "number" && t.estimatedMinutes >= 0 ? Math.floor(t.estimatedMinutes) : null,

                actualSeconds: baseActual + extra,
                isToday: typeof t?.isToday === "boolean" ? t.isToday : false,

                isRunning,
                startedAt,
            };
        });
    } catch {
        return [];
    }
}

export function buildStats(tasks: Task[]): ReportStats {
    const totalCount = tasks.length;
    const doneCount = tasks.filter((t) => t.status === "done").length;
    const todayRemaining = tasks.filter((t) => t.isToday && t.status !== "done").length;

    const totalActualSeconds = tasks.reduce((sum, t) => sum + (t.actualSeconds ?? 0), 0);

    // 見積精度（平均差分 = 実績(分) - 見積(分)）
    const withEst = tasks.filter((t) => t.estimatedMinutes != null);
    const estimatedCount = withEst.length;

    let avgDiffMinutes: number | null = null;
    if (estimatedCount > 0) {
        const diffs = withEst.map((t) => {
            const actualMin = Math.floor((t.actualSeconds ?? 0) / 60);
            const estMin = t.estimatedMinutes ?? 0;
            return actualMin - estMin;
        });
        avgDiffMinutes = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    }

    // タグ別（上位3）
    const map = new Map<string, number>();
    for (const t of tasks) {
        const key = safeTagLabel(t.tag);
        map.set(key, (map.get(key) ?? 0) + (t.actualSeconds ?? 0));
    }

    const topTags = Array.from(map.entries())
        .map(([tag, seconds]) => ({ tag, seconds }))
        .filter((x) => x.seconds > 0)
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, 3);

    // ハイライト抽出: P0の完了タスク、または時間がかかった完了タスク上位
    const highlights = tasks
        .filter(t => t.status === "done")
        .sort((a, b) => {
            // Priority first (p0 < p1 < p2)
            const pRank = { p0: 0, p1: 1, p2: 2 };
            if (a.priority !== b.priority) return pRank[a.priority] - pRank[b.priority];
            // Then duration desc
            return Math.abs(getTotalActualSeconds(b, 0)) - Math.abs(getTotalActualSeconds(a, 0));
        })
        .slice(0, 3);

    return {
        totalCount,
        doneCount,
        todayRemaining,
        totalActualSeconds,
        estimatedCount,
        avgDiffMinutes,
        topTags,
        highlights,
    };
}

export function findThisWeekReport(reports: Report[]): Report | null {
    const nowMs = Date.now();

    const candidates = reports.filter((r) => {
        const s = new Date(r.weekStart).getTime();
        const e = new Date(r.weekEnd).getTime();
        if (Number.isNaN(s) || Number.isNaN(e)) return false;
        return s <= nowMs && nowMs <= e;
    });

    if (candidates.length === 0) return null;

    // createdAtが新しいものを優先
    return [...candidates].sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
    })[0];
}

export function formatAvgDiff(avg: number | null) {
    if (avg == null) return { label: "—", className: "text-slate-500" };
    const rounded = Math.round(avg * 10) / 10;
    if (rounded === 0) return { label: "±0分", className: "text-slate-700" };
    if (rounded > 0) return { label: `+${rounded}分`, className: "text-red-600" };
    return { label: `${rounded}分`, className: "text-emerald-600" };
}

/** タグの文字列から色を生成する（パステルカラー） */
export function getTagColor(tag: string | null): string {
    if (!tag) return "bg-slate-100 text-slate-600 border-slate-200";

    // Simple hash
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
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
        "bg-rose-50 text-rose-700 border-rose-100",
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

export const TAG_COLORS: Record<string, string> = {
    "開発": "#6366f1", // Indigo
    "学習": "#10b981", // Emerald
    "事務": "#f59e0b", // Amber
    "就活": "#ec4899", // Pink
    "生活": "#3b82f6", // Blue
    "その他": "#94a3b8", // Slate
};

export function getTagColorHex(tag: string): string {
    if (TAG_COLORS[tag]) return TAG_COLORS[tag];
    // Randomish pastel
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

// --- Trend Analysis Data Loading ---
export type TrendData = {
    id: string;
    label: string;
    focusTime: number; // in hours
    doneCount: number;
    completionRate: number; // 0-100
    // Dynamic tag usage: { "開発": 2.5, "学習": 1.0, ... }
    [key: string]: string | number;
};

export function loadAllReportsStats(reports: Report[]): TrendData[] {
    const data: TrendData[] = [];
    const now = Date.now();

    // Sort reports by date asc (Oldest -> Newest)
    const sorted = [...reports].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    for (const r of sorted) {
        const tasks = loadTasks(r.id, now);

        // Stats
        const total = tasks.length;
        const done = tasks.filter(t => t.status === "done").length;
        const rate = total > 0 ? Math.round((done / total) * 100) : 0;

        let totalSec = 0;
        const tagMap: Record<string, number> = {};

        tasks.forEach(t => {
            const sec = getTotalActualSeconds(t, now);
            totalSec += sec;
            const tag = safeTagLabel(t.tag);
            tagMap[tag] = (tagMap[tag] ?? 0) + sec;
        });

        const hours = parseFloat((totalSec / 3600).toFixed(1));

        // Label
        const d = new Date(r.createdAt);
        const label = !Number.isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()}` : "N/A";

        const row: TrendData = {
            id: r.id,
            label,
            focusTime: hours,
            doneCount: done,
            completionRate: rate,
        };

        // Add tags to row (converted to hours)
        Object.keys(tagMap).forEach(tag => {
            row[tag] = parseFloat((tagMap[tag] / 3600).toFixed(1));
        });

        data.push(row);
    }
    return data;
}

// --- Sample Data Generation ---
export function generateSampleReports(): Report[] {
    const samples: Report[] = [];
    const now = new Date();

    // Generate last 8 weeks
    for (let i = 8; i > 0; i--) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - i * 7); // Go back i weeks

        const { start, end } = getWeekRange(targetDate);
        const id = crypto.randomUUID();
        const weekStartIso = start.toISOString();
        const weekEndIso = end.toISOString();

        const report: Report = {
            id,
            title: formatWeekRangeTitle(weekStartIso, weekEndIso),
            description: "サンプルデータ：過去の活動履歴です。",
            createdAt: targetDate.toISOString(),
            weekStart: weekStartIso,
            weekEnd: weekEndIso,
        };

        samples.push(report);

        // Generate Dummy Tasks
        const tasks: Task[] = [];
        const taskCount = 5 + Math.floor(Math.random() * 8); // 5-12 tasks

        for (let j = 0; j < taskCount; j++) {
            const isDone = Math.random() > 0.3;
            const tag = DEFAULT_TAGS[Math.floor(Math.random() * DEFAULT_TAGS.length)];
            const durationMin = 30 + Math.floor(Math.random() * 120); // 30-150 min

            const task: Task = {
                id: crypto.randomUUID(),
                title: `${tag}のタスクサンプル ${j + 1}`,
                status: isDone ? "done" : "todo",
                tag,
                priority: Math.random() > 0.8 ? "p0" : Math.random() > 0.5 ? "p1" : "p2",
                isToday: false,
                estimatedMinutes: durationMin,
                actualSeconds: isDone ? durationMin * 60 : 0,
                isRunning: false,
                startedAt: null,
            };
            tasks.push(task);
        }

        // Save tasks to localStorage directly here? 
        // No, utility functions should probably format data, but side-effect here is cleaner for "One Button" action.
        if (typeof window !== "undefined") {
            window.localStorage.setItem(`${TASKS_KEY_PREFIX}${id}`, JSON.stringify(tasks));
        }
    }
    return samples;
}

export function generateSlackText(report: Report, tasks: Task[], note: string): string {
    const doneTasks = tasks.filter(t => t.status === "done");
    const doingTasks = tasks.filter(t => t.status === "doing");
    // Removed wipTasks as it duplicated doingTasks or used wrong status
    const todoTasks = tasks.filter(t => t.status === "todo");

    const formatTask = (t: Task) => {
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

export function generateNotionText(report: Report, tasks: Task[], note: string): string {
    const doneTasks = tasks.filter(t => t.status === "done");
    const doingTasks = tasks.filter(t => t.status === "doing");
    const todoTasks = tasks.filter(t => t.status === "todo");

    const formatTask = (t: Task) => {
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


