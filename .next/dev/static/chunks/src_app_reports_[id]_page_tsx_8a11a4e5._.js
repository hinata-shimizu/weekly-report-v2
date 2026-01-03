(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/reports/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const STATUS_ORDER = [
    "not_decided",
    "todo",
    "doing",
    "done"
];
const PRIORITY_ORDER = [
    "p0",
    "p1",
    "p2"
];
const STATUS_LABEL = {
    not_decided: "未決定",
    todo: "未着手",
    doing: "進行中",
    done: "完了"
};
const PRIORITY_LABEL = {
    p0: "P0",
    p1: "P1",
    p2: "P2"
};
const TAG_STORAGE_KEY = "weekly-report-tags";
const DEFAULT_TAGS = [
    "開発",
    "学習",
    "就活",
    "事務",
    "生活"
];
const getRunningExtraSeconds = (task, now)=>{
    if (!task.isRunning || !task.startedAt) return 0;
    return Math.max(0, Math.floor((now - task.startedAt) / 1000));
};
const getTotalActualSeconds = (task, now)=>{
    return task.actualSeconds + getRunningExtraSeconds(task, now);
};
// Importしたデータが壊れていても安全な形に直す（タイマーは必ず停止状態にする）
const normalizeTask = (t)=>{
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
};
const formatHours1 = (seconds)=>`${(seconds / 3600).toFixed(1)}時間`;
const aggregateByTag = (tasks, now)=>{
    const map = new Map();
    for (const t of tasks){
        const key = t.tag && t.tag.trim() ? t.tag.trim() : "(未設定)";
        const sec = getTotalActualSeconds(t, now);
        map.set(key, (map.get(key) ?? 0) + sec);
    }
    return Array.from(map.entries()).map(([tag, seconds])=>({
            tag,
            seconds
        })).sort((a, b)=>b.seconds - a.seconds);
};
const formatJPDateTime = (ms)=>{
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${day} ${hh}:${mm}`;
};
const formatHMFromSecondsSimple = (totalSeconds)=>{
    const totalMinutes = Math.floor(totalSeconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h <= 0) return `${m}分`;
    if (m === 0) return `${h}時間`;
    return `${h}時間${m}分`;
};
const safeLabel = (s)=>s && s.trim() ? s.trim() : "（未設定）";
const pickTopBySeconds = (tasks, now, n)=>{
    const arr = tasks.map((t)=>({
            t,
            sec: getTotalActualSeconds(t, now)
        })).filter((x)=>x.sec > 0).sort((a, b)=>b.sec - a.sec).slice(0, n);
    return arr;
};
const pickTopTagsBySeconds = (tasks, now, n)=>{
    const map = new Map();
    for (const t of tasks){
        const tag = safeLabel(t.tag ?? "");
        map.set(tag, (map.get(tag) ?? 0) + getTotalActualSeconds(t, now));
    }
    return Array.from(map.entries()).map(([tag, sec])=>({
            tag,
            sec
        })).filter((x)=>x.sec > 0).sort((a, b)=>b.sec - a.sec).slice(0, n);
};
const calcEstimateInsights = (tasks, now)=>{
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
    const underruns = diffs.filter((x)=>x.estMin > 0 && x.diff < 0).sort((a, b)=>a.diff - b.diff); // マイナスが大きい順（早かった）
    const avgDiff = diffs.length > 0 ? diffs.reduce((sum, x)=>sum + x.diff, 0) / diffs.length : null;
    return {
        withEstCount: diffs.length,
        avgDiff,
        overruns,
        underruns
    };
};
/**
 * ✅ Markdown記号を一切使わない
 * ✅ 英語ステータスを出さない（STATUS_LABELを使う）
 * ✅ そのまま週報に貼れる文章を生成
 */ const generateReflectionText = (tasks, now, topN = 5)=>{
    const done = tasks.filter((t)=>t.status === "done");
    const notDone = tasks.filter((t)=>t.status !== "done");
    const totalSec = tasks.reduce((sum, t)=>sum + getTotalActualSeconds(t, now), 0);
    const doneSec = done.reduce((sum, t)=>sum + getTotalActualSeconds(t, now), 0);
    const notDoneSec = notDone.reduce((sum, t)=>sum + getTotalActualSeconds(t, now), 0);
    const topTasks = pickTopBySeconds(tasks, now, 3);
    const topTags = pickTopTagsBySeconds(tasks, now, 3);
    const todayNotDone = tasks.filter((t)=>t.isToday && t.status !== "done").sort((a, b)=>{
        const pr = {
            p0: 0,
            p1: 1,
            p2: 2
        };
        return pr[a.priority] - pr[b.priority];
    });
    const { withEstCount, avgDiff, overruns, underruns } = calcEstimateInsights(tasks, now);
    const avgDiffText = avgDiff == null ? "—" : avgDiff === 0 ? "±0分" : avgDiff > 0 ? `平均 +${Math.round(avgDiff * 10) / 10}分（見積もりより時間がかかりがち）` : `平均 ${Math.round(avgDiff * 10) / 10}分（見積もりより早めに終わりがち）`;
    // 未完了をステータスごとにまとめる（日本語表記）
    const notDoneByStatus = [
        "not_decided",
        "todo",
        "doing"
    ];
    const grouped = notDoneByStatus.map((st)=>({
            status: st,
            list: notDone.filter((t)=>t.status === st)
        }));
    // 次にやる（提案）：Today未完了があればそれ優先。無ければ P0→P1→P2 の未完了から上位3
    const nextActions = todayNotDone.length > 0 ? todayNotDone.slice(0, 3) : [
        ...notDone
    ].sort((a, b)=>{
        const pr = {
            p0: 0,
            p1: 1,
            p2: 2
        };
        if (pr[a.priority] !== pr[b.priority]) return pr[a.priority] - pr[b.priority];
        return 0;
    }).slice(0, 3);
    const lines = [];
    lines.push("【自動ふりかえり】");
    lines.push(`作成日時：${formatJPDateTime(now)}`);
    lines.push("");
    lines.push("■ 1) 今週の全体像");
    lines.push(`・タスク数：${tasks.length}件（完了 ${done.length} / 未完了 ${notDone.length}）`);
    lines.push(`・合計実績：${formatHMFromSecondsSimple(totalSec)}`);
    lines.push(`・完了の実績：${formatHMFromSecondsSimple(doneSec)} / 未完了の実績：${formatHMFromSecondsSimple(notDoneSec)}`);
    lines.push("");
    lines.push("■ 2) できたこと（完了）");
    if (done.length === 0) {
        lines.push("・なし");
    } else {
        for (const t of done){
            const sec = getTotalActualSeconds(t, now);
            const tag = t.tag ? `［${t.tag}］` : "";
            lines.push(`・${t.title} ${tag}（実績 ${formatHMFromSecondsSimple(sec)}）`);
        }
    }
    lines.push("");
    lines.push("■ 3) 途中のもの（未完了）");
    if (notDone.length === 0) {
        lines.push("・なし");
    } else {
        for (const g of grouped){
            if (g.list.length === 0) continue;
            lines.push(`・${STATUS_LABEL[g.status]}：${g.list.length}件`);
            for (const t of g.list){
                const sec = getTotalActualSeconds(t, now);
                const tag = t.tag ? `［${t.tag}］` : "";
                lines.push(`  - ${t.title} ${tag}（優先度 ${PRIORITY_LABEL[t.priority]} / 実績 ${formatHMFromSecondsSimple(sec)}）`);
            }
        }
    }
    lines.push("");
    lines.push("■ 4) 時間の使い方（上位）");
    if (topTasks.length === 0) {
        lines.push("・まだ実績が入っているタスクがありません（タイマーを回すとここが充実します）");
    } else {
        lines.push("・時間が長かったタスク（上位3つ）");
        for (const x of topTasks){
            const tag = x.t.tag ? `［${x.t.tag}］` : "";
            lines.push(`  - ${x.t.title} ${tag}：${formatHMFromSecondsSimple(x.sec)}`);
        }
    }
    if (topTags.length > 0) {
        lines.push("・タグ別（上位3つ）");
        for (const row of topTags){
            lines.push(`  - ${row.tag}：${formatHMFromSecondsSimple(row.sec)}`);
        }
    } else {
        lines.push("・タグ別：まだ集計できる実績がありません");
    }
    lines.push("");
    lines.push("■ 5) 見積もりの精度");
    lines.push(`・見積もり入力：${withEstCount}件`);
    lines.push(`・平均のズレ：${avgDiffText}`);
    lines.push("・時間が押したもの（最大5件）");
    if (overruns.length === 0) {
        lines.push("  - なし");
    } else {
        for (const x of overruns.slice(0, topN)){
            const tag = x.t.tag ? `［${x.t.tag}］` : "";
            lines.push(`  - ${x.t.title} ${tag}：見積 ${x.estMin}分 → 実績 ${x.actualMin}分（+${x.diff}分）`);
        }
    }
    lines.push("・早く終わったもの（最大3件）");
    if (underruns.length === 0) {
        lines.push("  - なし");
    } else {
        for (const x of underruns.slice(0, 3)){
            const tag = x.t.tag ? `［${x.t.tag}］` : "";
            lines.push(`  - ${x.t.title} ${tag}：見積 ${x.estMin}分 → 実績 ${x.actualMin}分（${x.diff}分）`);
        }
    }
    lines.push("");
    lines.push("■ 6) 次にやること（提案）");
    if (nextActions.length === 0) {
        lines.push("・なし（全タスクが完了しています）");
    } else {
        lines.push("・まずはこれ（上位3つ）");
        for (const t of nextActions){
            const tag = t.tag ? `［${t.tag}］` : "";
            const today = t.isToday ? "（Today）" : "";
            lines.push(`  - ${t.title} ${tag}：優先度 ${PRIORITY_LABEL[t.priority]} ${today}`);
        }
    }
    lines.push("");
    lines.push("――――――――――");
    return lines.join("\n");
};
function ReportDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const id = String(params.id);
    const storageKey = `weekly-report-tasks-${id}`;
    const noteStorageKey = `weekly-report-note-${id}`;
    const [newTitle, setNewTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savedMessage, setSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Date.now());
    const [weeklyNote, setWeeklyNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [noteSavedMessage, setNoteSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [csvCopiedMessage, setCsvCopiedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showTodayOnly, setShowTodayOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCompleted, setShowCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tags, setTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_TAGS);
    const [tagFilter, setTagFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [templateMessage, setTemplateMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [autoReflectionMessage, setAutoReflectionMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [backupJson, setBackupJson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [backupMessage, setBackupMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const NOTE_TEMPLATE = "■ 今週のテーマ\n\n\n" + "■ 実施内容\n\n\n" + "■ 学び・気づき\n\n\n" + "■ 課題\n\n\n" + "■ 次週アクション\n";
    // 初回＋ID変化時に localStorage から読み込み
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // タスク読み込み
            const raw = window.localStorage.getItem(storageKey);
            if (!raw) {
                setTasks([]);
            } else {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        // 古いデータも安全に読み込む（必要ならここで正規化）
                        const normalized = parsed.map({
                            "ReportDetailPage.useEffect.normalized": (t)=>({
                                    id: t.id ?? crypto.randomUUID(),
                                    title: typeof t.title === "string" ? t.title : "",
                                    status: STATUS_ORDER.includes(t.status) ? t.status : "todo",
                                    tag: typeof t.tag === "string" ? t.tag : null,
                                    priority: PRIORITY_ORDER.includes(t.priority) ? t.priority : "p1",
                                    isToday: typeof t.isToday === "boolean" ? t.isToday : false,
                                    estimatedMinutes: typeof t.estimatedMinutes === "number" ? t.estimatedMinutes : null,
                                    actualSeconds: typeof t.actualSeconds === "number" ? t.actualSeconds : 0,
                                    isRunning: !!t.isRunning,
                                    startedAt: typeof t.startedAt === "number" ? t.startedAt : null
                                })
                        }["ReportDetailPage.useEffect.normalized"]);
                        setTasks(normalized);
                    } else {
                        setTasks([]);
                    }
                } catch (e) {
                    console.error("failed to parse tasks from localStorage", e);
                    setTasks([]);
                }
            }
            // メモ読み込み
            const noteRaw = window.localStorage.getItem(noteStorageKey);
            if (typeof noteRaw === "string") setWeeklyNote(noteRaw);
            else setWeeklyNote("");
            // タグ読み込み（全週報共通）
            const tagsRaw = window.localStorage.getItem(TAG_STORAGE_KEY);
            if (typeof tagsRaw === "string") {
                try {
                    const parsed = JSON.parse(tagsRaw);
                    if (Array.isArray(parsed)) {
                        const cleaned = parsed.filter({
                            "ReportDetailPage.useEffect.cleaned": (x)=>typeof x === "string"
                        }["ReportDetailPage.useEffect.cleaned"]).map({
                            "ReportDetailPage.useEffect.cleaned": (x)=>x.trim()
                        }["ReportDetailPage.useEffect.cleaned"]).filter({
                            "ReportDetailPage.useEffect.cleaned": (x)=>x.length > 0
                        }["ReportDetailPage.useEffect.cleaned"]);
                        if (cleaned.length > 0) setTags(Array.from(new Set(cleaned)));
                    }
                } catch  {
                // 失敗してもデフォルトのまま
                }
            }
            setLoaded(true);
        }
    }["ReportDetailPage.useEffect"], [
        storageKey,
        noteStorageKey
    ]);
    // どれかのタスクが動いている時だけ1秒ごとに now を更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            const hasRunning = tasks.some({
                "ReportDetailPage.useEffect.hasRunning": (t)=>t.isRunning
            }["ReportDetailPage.useEffect.hasRunning"]);
            if (!hasRunning) return;
            const timerId = setInterval({
                "ReportDetailPage.useEffect.timerId": ()=>{
                    setNow(Date.now());
                }
            }["ReportDetailPage.useEffect.timerId"], 1000);
            return ({
                "ReportDetailPage.useEffect": ()=>clearInterval(timerId)
            })["ReportDetailPage.useEffect"];
        }
    }["ReportDetailPage.useEffect"], [
        tasks
    ]);
    // tasks が変わるたびに自動保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (!loaded) return;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            window.localStorage.setItem(storageKey, JSON.stringify(tasks));
            if (tasks.length === 0) {
                setSavedMessage("");
                return;
            }
            setSavedMessage("自動保存しました");
            const timer = setTimeout({
                "ReportDetailPage.useEffect.timer": ()=>setSavedMessage("")
            }["ReportDetailPage.useEffect.timer"], 1500);
            return ({
                "ReportDetailPage.useEffect": ()=>clearTimeout(timer)
            })["ReportDetailPage.useEffect"];
        }
    }["ReportDetailPage.useEffect"], [
        tasks,
        loaded,
        storageKey
    ]);
    // 週次メモの自動保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportDetailPage.useEffect": ()=>{
            if (!loaded) return;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            window.localStorage.setItem(noteStorageKey, weeklyNote);
            if (weeklyNote.trim() === "") {
                setNoteSavedMessage("");
                return;
            }
            setNoteSavedMessage("メモを保存しました");
            const timer = setTimeout({
                "ReportDetailPage.useEffect.timer": ()=>setNoteSavedMessage("")
            }["ReportDetailPage.useEffect.timer"], 1500);
            return ({
                "ReportDetailPage.useEffect": ()=>clearTimeout(timer)
            })["ReportDetailPage.useEffect"];
        }
    }["ReportDetailPage.useEffect"], [
        weeklyNote,
        loaded,
        noteStorageKey
    ]);
    const handleAddTask = ()=>{
        const trimmed = newTitle.trim();
        if (!trimmed) return;
        const newTask = {
            id: crypto.randomUUID(),
            title: trimmed,
            status: "todo",
            tag: null,
            priority: "p1",
            isToday: false,
            estimatedMinutes: null,
            actualSeconds: 0,
            isRunning: false,
            startedAt: null
        };
        setTasks((prev)=>[
                newTask,
                ...prev
            ]);
        setNewTitle("");
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTask();
        }
    };
    const handleChangeStatus = (taskId, status)=>{
        const nowTs = Date.now();
        setTasks((prev)=>prev.map((task)=>{
                if (task.id !== taskId) return task;
                // done にしたら必ずタイマー停止＆経過分を実績へ加算
                if (status === "done") {
                    let addedSeconds = 0;
                    if (task.isRunning && task.startedAt) {
                        addedSeconds = Math.max(0, Math.floor((nowTs - task.startedAt) / 1000));
                    }
                    return {
                        ...task,
                        status: "done",
                        isRunning: false,
                        startedAt: null,
                        actualSeconds: task.actualSeconds + addedSeconds
                    };
                }
                // done 以外は通常どおり
                return {
                    ...task,
                    status
                };
            }));
    };
    const handleDelete = (taskId)=>{
        const target = tasks.find((t)=>t.id === taskId);
        // 念のため：対象が見つからないなら何もしない
        if (!target) return;
        // 実行中は通常表示から削除できない設計ですが、
        // 万一どこかから呼ばれても安全な確認文にします。
        const message = target.isRunning ? "このタスクは実行中です。削除すると計測中の時間も失われます。本当に削除しますか？" : "このタスクを削除してもよいですか？";
        const ok = ("TURBOPACK compile-time truthy", 1) ? window.confirm(message) : "TURBOPACK unreachable";
        if (!ok) return;
        setTasks((prev)=>prev.filter((t)=>t.id !== taskId));
    };
    const handleChangeEstimated = (taskId, value)=>{
        setTasks((prev)=>prev.map((task)=>{
                if (task.id !== taskId) return task;
                if (value === "") return {
                    ...task,
                    estimatedMinutes: null
                };
                const num = Number(value);
                if (Number.isNaN(num) || num < 0) return task;
                return {
                    ...task,
                    estimatedMinutes: Math.floor(num)
                };
            }));
    };
    const handleChangeTag = (taskId, value)=>{
        const tag = value === "" ? null : value;
        setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                    ...task,
                    tag
                } : task));
    };
    const handleChangePriority = (taskId, value)=>{
        const p = PRIORITY_ORDER.includes(value) ? value : "p1";
        setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                    ...task,
                    priority: p
                } : task));
    };
    const handleToggleToday = (taskId)=>{
        setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                    ...task,
                    isToday: !task.isToday
                } : task));
    };
    // タイマー開始
    const handleStartTimer = (taskId)=>{
        const nowTs = Date.now();
        setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                    ...task,
                    isRunning: true,
                    startedAt: task.startedAt ?? nowTs,
                    status: task.status === "done" ? task.status : "doing"
                } : task));
    };
    // タイマー停止
    const handleStopTimer = (taskId)=>{
        const nowTs = Date.now();
        setTasks((prev)=>prev.map((task)=>{
                if (task.id !== taskId) return task;
                if (!task.isRunning || !task.startedAt) return {
                    ...task,
                    isRunning: false,
                    startedAt: null
                };
                const diffSeconds = Math.max(0, Math.floor((nowTs - task.startedAt) / 1000));
                return {
                    ...task,
                    isRunning: false,
                    startedAt: null,
                    actualSeconds: task.actualSeconds + diffSeconds
                };
            }));
    };
    const formatDuration = (totalSeconds)=>{
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
    };
    const formatHMFromSeconds = (totalSeconds)=>{
        const totalMinutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) return `${hours}時間${minutes}分`;
        return `${minutes}分`;
    };
    const countsByStatus = {
        not_decided: tasks.filter((t)=>t.status === "not_decided").length,
        todo: tasks.filter((t)=>t.status === "todo").length,
        doing: tasks.filter((t)=>t.status === "doing").length,
        done: tasks.filter((t)=>t.status === "done").length
    };
    // 週全体サマリー計算
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[summary]": ()=>{
            let totalEstimatedMinutes = 0;
            let estimatedTaskCount = 0;
            let totalActualSeconds = 0;
            let totalDiffMinutes = 0;
            let diffCount = 0;
            for (const task of tasks){
                const totalSeconds = getTotalActualSeconds(task, now);
                totalActualSeconds += totalSeconds;
                if (task.estimatedMinutes != null) {
                    totalEstimatedMinutes += task.estimatedMinutes;
                    estimatedTaskCount += 1;
                    const minutes = Math.floor(totalSeconds / 60);
                    const diff = minutes - task.estimatedMinutes;
                    totalDiffMinutes += diff;
                    diffCount += 1;
                }
            }
            const totalActualMinutes = Math.floor(totalActualSeconds / 60);
            const totalActualHours = Math.floor(totalActualMinutes / 60);
            const remainingMinutes = totalActualMinutes % 60;
            const avgDiffMinutes = diffCount > 0 ? totalDiffMinutes / diffCount : null;
            return {
                totalEstimatedMinutes,
                estimatedTaskCount,
                totalActualSeconds,
                totalActualMinutes,
                totalActualHours,
                remainingMinutes,
                avgDiffMinutes
            };
        }
    }["ReportDetailPage.useMemo[summary]"], [
        tasks,
        now
    ]);
    const formatAvgDiff = (avg)=>{
        if (avg === null) return {
            label: "—",
            color: "text-slate-500"
        };
        const rounded = Math.round(avg * 10) / 10;
        if (rounded === 0) return {
            label: "±0分",
            color: "text-slate-700"
        };
        if (rounded > 0) return {
            label: `+${rounded}分（見積もりより遅い）`,
            color: "text-red-600"
        };
        return {
            label: `${rounded}分（見積もりより早い）`,
            color: "text-emerald-600"
        };
    };
    const getPriorityBadgeClass = (p)=>{
        switch(p){
            case "p0":
                return "bg-slate-900 text-white border-slate-900";
            case "p1":
                return "bg-slate-300 text-slate-900 border-slate-400";
            case "p2":
                return "bg-white text-slate-600 border-slate-200";
            default:
                return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };
    const avgDiff = formatAvgDiff(summary.avgDiffMinutes ?? null);
    // ステータスごとの集計
    const statusSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[statusSummary]": ()=>{
            const base = {
                not_decided: {
                    count: 0,
                    totalSeconds: 0
                },
                todo: {
                    count: 0,
                    totalSeconds: 0
                },
                doing: {
                    count: 0,
                    totalSeconds: 0
                },
                done: {
                    count: 0,
                    totalSeconds: 0
                }
            };
            for (const task of tasks){
                const totalSeconds = getTotalActualSeconds(task, now);
                base[task.status].count += 1;
                base[task.status].totalSeconds += totalSeconds;
            }
            return base;
        }
    }["ReportDetailPage.useMemo[statusSummary]"], [
        tasks,
        now
    ]);
    const tagSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[tagSummary]": ()=>{
            return aggregateByTag(tasks, now);
        }
    }["ReportDetailPage.useMemo[tagSummary]"], [
        tasks,
        now
    ]);
    // CSV用テキスト生成（タグ / 優先度 / Today 対応）
    const csvText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[csvText]": ()=>{
            if (tasks.length === 0) return "";
            const escapeCsv = {
                "ReportDetailPage.useMemo[csvText].escapeCsv": (value)=>{
                    const escaped = value.replace(/"/g, '""');
                    return `"${escaped}"`;
                }
            }["ReportDetailPage.useMemo[csvText].escapeCsv"];
            const header = "タスク名,タグ,優先度,Today,ステータス,見積もり(分),実績(分),差分(分)";
            const lines = tasks.map({
                "ReportDetailPage.useMemo[csvText].lines": (task)=>{
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
                }
            }["ReportDetailPage.useMemo[csvText].lines"]);
            return [
                header,
                ...lines
            ].join("\n");
        }
    }["ReportDetailPage.useMemo[csvText]"], [
        tasks,
        now
    ]);
    const handleCopyCsv = async ()=>{
        if (!csvText.trim()) return;
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(csvText);
            } else if (typeof document !== "undefined") {
                const textarea = document.createElement("textarea");
                textarea.value = csvText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            setCsvCopiedMessage("CSV形式のテキストをコピーしました");
        } catch (e) {
            console.error("failed to copy csv", e);
            setCsvCopiedMessage("コピーに失敗しました…");
        }
        setTimeout(()=>setCsvCopiedMessage(""), 2000);
    };
    const buildBackupJson = ()=>{
        const payload = {
            version: 1,
            reportId: id,
            exportedAt: new Date().toISOString(),
            tasks,
            weeklyNote
        };
        return JSON.stringify(payload, null, 2);
    };
    const handleExportBackup = async ()=>{
        const text = buildBackupJson();
        setBackupJson(text);
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                setBackupMessage("バックアップJSONをコピーしました");
            } else if (typeof document !== "undefined") {
                const textarea = document.createElement("textarea");
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                setBackupMessage("バックアップJSONをコピーしました");
            }
        } catch (e) {
            console.error("failed to copy backup json", e);
            setBackupMessage("JSONは生成しました（コピーは失敗しました）");
        }
        setTimeout(()=>setBackupMessage(""), 2000);
    };
    const handleImportBackup = ()=>{
        const raw = backupJson.trim();
        if (!raw) {
            setBackupMessage("JSONが空です");
            setTimeout(()=>setBackupMessage(""), 1500);
            return;
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.error("invalid json", e);
            setBackupMessage("JSONの形式が正しくありません");
            setTimeout(()=>setBackupMessage(""), 2000);
            return;
        }
        if (!parsed || typeof parsed !== "object") {
            setBackupMessage("JSONの形式が正しくありません");
            setTimeout(()=>setBackupMessage(""), 2000);
            return;
        }
        if (!Array.isArray(parsed.tasks)) {
            setBackupMessage("tasks が見つかりません");
            setTimeout(()=>setBackupMessage(""), 2000);
            return;
        }
        if (typeof parsed.weeklyNote !== "string") {
            setBackupMessage("weeklyNote が見つかりません");
            setTimeout(()=>setBackupMessage(""), 2000);
            return;
        }
        const ok = ("TURBOPACK compile-time truthy", 1) ? window.confirm("この週報のタスクとメモを、貼り付けたJSONで上書きします。よろしいですか？") : "TURBOPACK unreachable";
        if (!ok) return;
        setTasks(parsed.tasks.map(normalizeTask));
        setWeeklyNote(typeof parsed.weeklyNote === "string" ? parsed.weeklyNote : "");
        setBackupMessage("復元しました");
        setTimeout(()=>setBackupMessage(""), 2000);
    };
    // 表示順：未完了タスク → 完了タスク（下に寄せる）＋ 未完了は優先度順
    const sortedTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[sortedTasks]": ()=>{
            const priorityRank = {
                p0: 0,
                p1: 1,
                p2: 2
            };
            const withIndex = tasks.map({
                "ReportDetailPage.useMemo[sortedTasks].withIndex": (t, idx)=>({
                        t,
                        idx
                    })
            }["ReportDetailPage.useMemo[sortedTasks].withIndex"]);
            withIndex.sort({
                "ReportDetailPage.useMemo[sortedTasks]": (a, b)=>{
                    const adone = a.t.status === "done";
                    const bdone = b.t.status === "done";
                    if (adone !== bdone) return adone ? 1 : -1;
                    const ar = priorityRank[a.t.priority];
                    const br = priorityRank[b.t.priority];
                    if (ar !== br) return ar - br;
                    return a.idx - b.idx;
                }
            }["ReportDetailPage.useMemo[sortedTasks]"]);
            return withIndex.map({
                "ReportDetailPage.useMemo[sortedTasks]": (x)=>x.t
            }["ReportDetailPage.useMemo[sortedTasks]"]);
        }
    }["ReportDetailPage.useMemo[sortedTasks]"], [
        tasks
    ]);
    const visibleTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportDetailPage.useMemo[visibleTasks]": ()=>{
            return sortedTasks.filter({
                "ReportDetailPage.useMemo[visibleTasks]": (t)=>showCompleted ? true : t.status !== "done"
            }["ReportDetailPage.useMemo[visibleTasks]"]).filter({
                "ReportDetailPage.useMemo[visibleTasks]": (t)=>tagFilter === "all" ? true : t.tag === tagFilter
            }["ReportDetailPage.useMemo[visibleTasks]"]).filter({
                "ReportDetailPage.useMemo[visibleTasks]": (t)=>showTodayOnly ? t.isToday : true
            }["ReportDetailPage.useMemo[visibleTasks]"]);
        }
    }["ReportDetailPage.useMemo[visibleTasks]"], [
        sortedTasks,
        showCompleted,
        tagFilter,
        showTodayOnly
    ]);
    const handleAppendAutoReflection = ()=>{
        const snippet = generateReflectionText(tasks, now, 5);
        setWeeklyNote((prev)=>{
            const trimmed = prev.trim();
            if (!trimmed) return snippet + "\n";
            const sep = prev.endsWith("\n") ? "\n\n" : "\n\n";
            return prev + sep + snippet + "\n";
        });
        setAutoReflectionMessage("自動生成をメモに追記しました");
        setTimeout(()=>setAutoReflectionMessage(""), 1500);
    };
    const handleInsertTemplate = ()=>{
        const trimmed = weeklyNote.trim();
        if (trimmed === "") {
            setWeeklyNote(NOTE_TEMPLATE);
        } else {
            const sep = weeklyNote.endsWith("\n") ? "\n\n" : "\n\n\n";
            setWeeklyNote((prev)=>prev + sep + NOTE_TEMPLATE);
        }
        setTemplateMessage("テンプレを挿入しました");
        setTimeout(()=>setTemplateMessage(""), 1500);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl py-6 px-4 md:px-8 space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/reports",
                                    className: "inline-flex items-center text-[11px] md:text-xs text-slate-600 hover:text-slate-900",
                                    children: "← 週報一覧に戻る"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 914,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl md:text-3xl font-bold",
                                    children: [
                                        "週報タスク管理（ID: ",
                                        id,
                                        "）"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 920,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs md:text-sm text-slate-600 max-w-3xl",
                                    children: "今週やることを箇条書きで洗い出して、ステータス・見積もり時間・実績時間を管理します。 タスクとメモは「週報IDごとに」ブラウザへ自動保存されます。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 921,
                                    columnNumber: 13
                                }, this),
                                !loaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-slate-500",
                                    children: "読み込み中..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 925,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 913,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-1.5 text-[11px] md:text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1",
                                            children: [
                                                "合計: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-slate-800",
                                                    children: tasks.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 931,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 930,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1",
                                            children: [
                                                "完了: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-emerald-700",
                                                    children: countsByStatus.done
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 934,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 933,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1",
                                            children: [
                                                "進行中: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-blue-700",
                                                    children: countsByStatus.doing
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 937,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 936,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1",
                                            children: [
                                                "未着手: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-amber-700",
                                                    children: countsByStatus.todo
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 940,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 939,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 929,
                                    columnNumber: 13
                                }, this),
                                savedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-emerald-600",
                                    children: savedMessage
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 943,
                                    columnNumber: 30
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 928,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 912,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "rounded-xl border bg-white shadow-sm p-4 md:p-5 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-base md:text-lg font-semibold",
                            children: "タスクを追加"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 949,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400",
                                    placeholder: "タスク内容を入力",
                                    value: newTitle,
                                    onChange: (e)=>setNewTitle(e.target.value),
                                    onKeyDown: handleKeyDown
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 951,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleAddTask,
                                    className: "w-full md:w-auto inline-flex justify-center items-center rounded-lg px-5 py-2.5 text-sm font-medium border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 transition",
                                    children: "＋ 追加"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 959,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 950,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 948,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row md:items-center md:justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-base md:text-lg font-semibold",
                                    children: showTodayOnly ? "Today（今日やるタスク）" : "タスク一覧"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 972,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-end gap-2",
                                    children: [
                                        tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] md:text-xs text-slate-600",
                                                    children: "タグ"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 980,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] md:text-xs text-slate-800 hover:bg-slate-50",
                                                    value: tagFilter,
                                                    onChange: (e)=>setTagFilter(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "all",
                                                            children: "すべて"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 986,
                                                            columnNumber: 21
                                                        }, this),
                                                        tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: tag,
                                                                children: tag
                                                            }, tag, false, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 988,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 981,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 979,
                                            columnNumber: 17
                                        }, this),
                                        tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowTodayOnly((prev)=>!prev),
                                            className: "inline-flex items-center rounded-full border border-slate-400 px-3 py-1 text-[11px] md:text-xs text-slate-700 hover:bg-slate-100",
                                            children: showTodayOnly ? "全タスクを表示" : "Todayだけ表示"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 997,
                                            columnNumber: 17
                                        }, this),
                                        tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowCompleted((prev)=>!prev),
                                            className: "inline-flex items-center rounded-full border border-slate-400 px-3 py-1 text-[11px] md:text-xs text-slate-700 hover:bg-slate-100",
                                            children: showCompleted ? "完了タスクを隠す" : "完了タスクを表示"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1007,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 976,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 971,
                            columnNumber: 11
                        }, this),
                        tasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-600",
                                    children: "まだタスクがありません。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1020,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] md:text-xs text-slate-500",
                                    children: "上の入力欄から「今週やること」を1行ずつ追加してみてください。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1021,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1019,
                            columnNumber: 13
                        }, this) : visibleTasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border bg-white p-4 text-center space-y-1",
                            children: showTodayOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-600",
                                        children: "Today に選ばれているタスクがありません。"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1029,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] md:text-xs text-slate-500",
                                        children: "タスク行の「Today」チェックをONにすると、ここに表示されます。"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1030,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-600",
                                        children: "表示中のタスクはありません。"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1036,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] md:text-xs text-slate-500",
                                        children: "完了タスクを非表示にしている場合は、右上のボタンから表示に切り替えられます。"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1026,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-3",
                            children: visibleTasks.map((task)=>{
                                const totalSeconds = getTotalActualSeconds(task, now);
                                const est = task.estimatedMinutes;
                                const totalMinutes = Math.floor(totalSeconds / 60);
                                let diffLabel = "";
                                let diffClass = "text-slate-700";
                                if (est != null) {
                                    const diff = totalMinutes - est;
                                    if (diff === 0) diffLabel = "±0分";
                                    else if (diff > 0) {
                                        diffLabel = `+${diff}分`;
                                        diffClass = "text-red-600";
                                    } else {
                                        diffLabel = `${diff}分`;
                                        diffClass = "text-emerald-600";
                                    }
                                }
                                const isHighlighted = task.isRunning;
                                const baseItemClass = "rounded-xl border bg-white shadow-sm px-3 md:px-4 py-2 md:py-2.5 flex flex-col gap-2";
                                const highlightClass = isHighlighted ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/80" : "";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: `${baseItemClass} ${highlightClass}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `mt-[2px] inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] md:text-[11px] font-semibold ${getPriorityBadgeClass(task.priority)} ${task.status === "done" ? "opacity-50" : ""}`,
                                                                    children: PRIORITY_LABEL[task.priority]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1078,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-sm md:text-base text-slate-900 break-words ${task.status === "done" ? "opacity-70" : ""}`,
                                                                    children: task.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1086,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1077,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] md:text-xs text-slate-500",
                                                                            children: "タグ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                            lineNumber: 1099,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            className: "rounded-md border border-slate-300 bg-white px-2 py-[3px] text-[11px] md:text-xs text-slate-800 hover:bg-slate-50",
                                                                            value: task.tag ?? "",
                                                                            onChange: (e)=>handleChangeTag(task.id, e.target.value),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "未設定"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                                    lineNumber: 1105,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: tag,
                                                                                        children: tag
                                                                                    }, tag, false, {
                                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                                        lineNumber: 1107,
                                                                                        columnNumber: 33
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                            lineNumber: 1100,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1098,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] md:text-xs text-slate-500",
                                                                            children: "優先度"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                            lineNumber: 1116,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            className: "rounded-md border border-slate-300 bg-white px-2 py-[3px] text-[11px] md:text-xs text-slate-800 hover:bg-slate-50",
                                                                            value: task.priority,
                                                                            onChange: (e)=>handleChangePriority(task.id, e.target.value),
                                                                            children: PRIORITY_ORDER.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: p,
                                                                                    children: PRIORITY_LABEL[p]
                                                                                }, p, false, {
                                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                                    lineNumber: 1123,
                                                                                    columnNumber: 33
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                            lineNumber: 1117,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1115,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "inline-flex items-center gap-1.5 text-[11px] md:text-xs text-slate-700 select-none",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: task.isToday,
                                                                            onChange: ()=>handleToggleToday(task.id),
                                                                            className: "accent-slate-900"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                            lineNumber: 1132,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "Today"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1131,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1096,
                                                            columnNumber: 25
                                                        }, this),
                                                        isHighlighted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center rounded-full bg-blue-600 px-2 py-[2px] text-[11px] font-medium text-white",
                                                            children: "▶ 実行中のタスク"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1143,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1076,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1 min-w-[190px]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap justify-end gap-1",
                                                        children: STATUS_ORDER.map((status)=>{
                                                            const active = task.status === status;
                                                            const base = "px-2 py-[2px] rounded-full text-[11px] border transition focus:outline-none whitespace-nowrap";
                                                            const activeStyleByStatus = {
                                                                not_decided: "bg-slate-800 border-slate-800 text-white",
                                                                todo: "bg-amber-500 border-amber-500 text-white",
                                                                doing: "bg-blue-600 border-blue-600 text-white",
                                                                done: "bg-emerald-600 border-emerald-600 text-white"
                                                            };
                                                            const inactiveStyleByStatus = {
                                                                not_decided: "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100",
                                                                todo: "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100",
                                                                doing: "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100",
                                                                done: "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleChangeStatus(task.id, status),
                                                                className: `${base} ${active ? activeStyleByStatus[status] : inactiveStyleByStatus[status]}`,
                                                                children: STATUS_LABEL[status]
                                                            }, status, false, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 1171,
                                                                columnNumber: 31
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 1151,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1150,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1075,
                                            columnNumber: 21
                                        }, this),
                                        isHighlighted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg bg-slate-50 px-3 py-2.5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs md:text-sm text-slate-600",
                                                            children: "見積もり"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1192,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            min: 0,
                                                            className: "w-20 rounded-md border border-slate-300 px-2 py-1 text-sm md:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400",
                                                            value: est ?? "",
                                                            onChange: (e)=>handleChangeEstimated(task.id, e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1193,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs md:text-sm text-slate-600",
                                                            children: "分"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1200,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1191,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-start md:items-center gap-0.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs md:text-sm text-slate-600",
                                                            children: "実績"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1205,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-base md:text-xl font-semibold text-slate-900",
                                                            children: formatDuration(totalSeconds)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1206,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1204,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1.5",
                                                    children: [
                                                        est != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs md:text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-500 mr-1",
                                                                    children: "差分"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1215,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `font-semibold ${diffClass}`,
                                                                    children: diffLabel
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1216,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1214,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleStopTimer(task.id),
                                                                className: "px-3 py-1.5 rounded-md border border-red-500 text-xs md:text-sm font-medium text-red-600 hover:bg-red-50",
                                                                children: "⏹ 停止"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 1221,
                                                                columnNumber: 3
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1220,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1212,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1189,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "見積もり"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1235,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            min: 0,
                                                            className: "w-16 rounded-md border border-slate-300 px-1.5 py-[2px] text-[11px] md:text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400",
                                                            value: est ?? "",
                                                            onChange: (e)=>handleChangeEstimated(task.id, e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1236,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "分"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1243,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1234,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "実績"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1247,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium text-slate-800 text-[11px] md:text-xs",
                                                            children: formatDuration(totalSeconds)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1248,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1246,
                                                    columnNumber: 25
                                                }, this),
                                                est != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "差分"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1255,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-medium ${diffClass}`,
                                                            children: diffLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1256,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1254,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 ml-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleStartTimer(task.id),
                                                            className: "px-4 py-2 rounded-md border border-slate-700 text-xs md:text-sm font-semibold text-slate-800 hover:bg-slate-100",
                                                            children: "▶ 開始"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1261,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleDelete(task.id),
                                                            className: "text-[10px] md:text-xs text-red-500 hover:text-red-600 hover:underline",
                                                            children: "削除"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1269,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1260,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1233,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, task.id, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1074,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1044,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 970,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-3 pt-2 border-t border-slate-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-sm md:text-base font-semibold text-slate-800",
                            children: "週全体のサマリー"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1288,
                            columnNumber: 11
                        }, this),
                        tasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-[11px] md:text-xs text-slate-500",
                            children: "タスクを追加すると、この週の合計時間や見積もり精度のサマリーが表示されます。"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1291,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3 md:grid-cols-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-white px-4 py-3 flex flex-col justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] md:text-xs text-slate-500",
                                                    children: "合計実績時間"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-base md:text-xl font-semibold text-slate-900",
                                                    children: [
                                                        summary.totalActualHours,
                                                        "時間",
                                                        summary.remainingMinutes,
                                                        "分"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1299,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[10px] md:text-[11px] text-slate-500",
                                                    children: "（全タスクの実績時間の合計）"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1302,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1297,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-white px-4 py-3 flex flex-col justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] md:text-xs text-slate-500",
                                                    children: "合計見積もり時間"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1306,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-base md:text-xl font-semibold text-slate-900",
                                                    children: [
                                                        summary.totalEstimatedMinutes,
                                                        "分"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[10px] md:text-[11px] text-slate-500",
                                                    children: [
                                                        "見積もり入力済みタスク: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: [
                                                                summary.estimatedTaskCount,
                                                                "件"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1311,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1310,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1305,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-white px-4 py-3 flex flex-col justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] md:text-xs text-slate-500",
                                                    children: "平均見積もり誤差"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1316,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `mt-1 text-sm md:text-lg font-semibold ${avgDiff.color}`,
                                                    children: avgDiff.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1317,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[10px] md:text-[11px] text-slate-500",
                                                    children: "（実績 − 見積もりの平均値。プラスは見積もりより時間がかかっている状態です）"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1318,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1315,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1296,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border bg-white px-4 py-3 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] md:text-xs font-semibold text-slate-700",
                                            children: "ステータスごとの集計"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1325,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-x-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "min-w-full text-[11px] md:text-xs text-left text-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-b border-slate-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "ステータス"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1331,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "タスク数"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1332,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "合計実績時間"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1333,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1330,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 1329,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: STATUS_ORDER.map((status)=>{
                                                            const s = statusSummary[status];
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "border-b border-slate-100 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: STATUS_LABEL[status]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 1341,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: [
                                                                            s.count,
                                                                            "件"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 1342,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: s.count === 0 ? "—" : formatHMFromSeconds(s.totalSeconds)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 1343,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, status, true, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 1340,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 1336,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1328,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1327,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "実績時間には、現在タイマーが動いているタスクの経過時間も含まれます。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1351,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1324,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border bg-white px-4 py-3 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] md:text-xs font-semibold text-slate-700",
                                            children: "タグ別集計（実績）"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1358,
                                            columnNumber: 17
                                        }, this),
                                        tagSummary.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] md:text-xs text-slate-500",
                                            children: "—"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1361,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-x-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "min-w-full text-[11px] md:text-xs text-left text-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-b border-slate-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "タグ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1367,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "実績"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 1368,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 1366,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 1365,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: tagSummary.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "border-b border-slate-100 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: row.tag
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 1374,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: formatHours1(row.seconds)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 1375,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, row.tag, true, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 1373,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 1371,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1364,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1363,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "実績には、タイマー稼働中タスクの経過時間も含まれます。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1383,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1357,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 1287,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-2 pt-3 border-t border-slate-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm md:text-base font-semibold text-slate-800",
                                children: "CSV形式でエクスポート（コピペ用）"
                            }, void 0, false, {
                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                lineNumber: 1394,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1393,
                            columnNumber: 11
                        }, this),
                        tasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-[11px] md:text-xs text-slate-500",
                            children: "タスクを追加すると、この週の内容をCSV形式で出力できます。"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1400,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] md:text-xs text-slate-500",
                                            children: "下のテキストをコピーして、Excel / Googleスプレッドシート / 会社の週報フォーマットなどに貼り付けて使えます。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1406,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleCopyCsv,
                                            className: "shrink-0 inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100",
                                            children: "コピー"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1410,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1405,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "w-full min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-[11px] md:text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-vertical",
                                    value: csvText,
                                    readOnly: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1419,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "列: タスク名 / タグ / 優先度 / Today / ステータス / 見積もり(分) / 実績(分) / 差分(分)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1426,
                                            columnNumber: 17
                                        }, this),
                                        csvCopiedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-emerald-600",
                                            children: csvCopiedMessage
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1429,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1425,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1404,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 1392,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "pt-3 border-t border-slate-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row md:items-start md:justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm md:text-base font-semibold text-slate-800",
                                                children: "バックアップ（移行 / 復元）"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1440,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] md:text-xs text-slate-600",
                                                children: "この週報（タスク・メモ）を「1つのテキスト」にして保存できます。PC変更や誤削除に備えるための機能です。"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1441,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] md:text-[11px] text-slate-500",
                                                children: "使い方：①バックアップ作成 → どこかに貼って保存　②復元 → 貼り付けてImport"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1444,
                                                columnNumber: 17
                                            }, this),
                                            backupMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] md:text-[11px] text-emerald-600",
                                                children: backupMessage
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1448,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1439,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleExportBackup,
                                                className: "inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100",
                                                children: "バックアップ作成（コピー）"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1452,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleImportBackup,
                                                className: "inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100",
                                                children: "復元（Import）"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1460,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1451,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                lineNumber: 1438,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                className: "mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                        className: "cursor-pointer list-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] md:text-[11px] text-slate-600 hover:bg-slate-50",
                                            children: [
                                                "※ 詳細（JSON表示）を開く / 閉じる ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "▾"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1473,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1472,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1471,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                className: "w-full min-h-[90px] max-h-[220px] rounded-md border border-slate-200 px-3 py-2 text-[11px] md:text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-vertical",
                                                value: backupJson,
                                                onChange: (e)=>setBackupJson(e.target.value),
                                                placeholder: "ここにバックアップJSONが入ります。別PCで復元したい時は、保存しておいたJSONを貼って Import（復元）してください。"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1478,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] md:text-[11px] text-slate-500",
                                                children: "※ Importすると現在のタスクとメモが上書きされます。"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 1485,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                        lineNumber: 1477,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                lineNumber: 1470,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                        lineNumber: 1437,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 1436,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-2 pt-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-end justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-sm md:text-base font-semibold text-slate-800",
                                            children: "週次ふりかえりメモ"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1495,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] md:text-xs text-slate-500",
                                            children: "今週の振り返りや来週に向けたメモを書いておくスペースです。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1496,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1494,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-end gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleInsertTemplate,
                                                    className: "inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100",
                                                    children: "テンプレ挿入"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1501,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleAppendAutoReflection,
                                                    disabled: tasks.length === 0,
                                                    className: "inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: "ふりかえり自動生成（追記）"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 1509,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1500,
                                            columnNumber: 15
                                        }, this),
                                        templateMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-emerald-600",
                                            children: templateMessage
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1519,
                                            columnNumber: 35
                                        }, this),
                                        autoReflectionMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-emerald-600",
                                            children: autoReflectionMessage
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1521,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1499,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1493,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "w-full min-h-[360px] rounded-md border border-slate-300 px-3 py-2 text-sm md:text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 resize-vertical",
                                    value: weeklyNote,
                                    onChange: (e)=>setWeeklyNote(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1527,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "入力内容は自動で保存されます（ブラウザごと／週報IDごと）。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1533,
                                            columnNumber: 15
                                        }, this),
                                        noteSavedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-emerald-600",
                                            children: noteSavedMessage
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 1534,
                                            columnNumber: 36
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 1532,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 1526,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 1492,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/reports/[id]/page.tsx",
            lineNumber: 910,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/reports/[id]/page.tsx",
        lineNumber: 909,
        columnNumber: 5
    }, this);
}
_s(ReportDetailPage, "OfpHPfclyTDVkRyXv7UQUGX1RrI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
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

//# sourceMappingURL=src_app_reports_%5Bid%5D_page_tsx_8a11a4e5._.js.map