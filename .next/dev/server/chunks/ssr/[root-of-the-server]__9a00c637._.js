module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/reports/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const STATUS_LABEL = {
    not_decided: "未決定",
    todo: "未着手",
    doing: "進行中",
    done: "完了"
};
const STATUS_ORDER = [
    "not_decided",
    "todo",
    "doing",
    "done"
];
function ReportDetailPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const id = String(params.id);
    const storageKey = `weekly-report-tasks-${id}`;
    const noteStorageKey = `weekly-report-note-${id}`;
    const [newTitle, setNewTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savedMessage, setSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(Date.now());
    const [weeklyNote, setWeeklyNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [noteSavedMessage, setNoteSavedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [csvCopiedMessage, setCsvCopiedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // 完了タスク表示 ON/OFF
    const [showCompleted, setShowCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // 初回＋ID変化時に localStorage から読み込み
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // タスク読み込み
        const raw = undefined;
        // メモ読み込み
        const noteRaw = undefined;
    }, [
        storageKey,
        noteStorageKey
    ]);
    // どれかのタスクが動いている時だけ1秒ごとに now を更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const hasRunning = tasks.some((t)=>t.isRunning);
        if (!hasRunning) return;
        const timerId = setInterval(()=>{
            setNow(Date.now());
        }, 1000);
        return ()=>clearInterval(timerId);
    }, [
        tasks
    ]);
    // tasks が変わるたびに自動保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!loaded) return;
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const timer = undefined;
    }, [
        tasks,
        loaded,
        storageKey
    ]);
    // 週次メモの自動保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!loaded) return;
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const timer = undefined;
    }, [
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
        setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                    ...task,
                    status
                } : task));
    };
    const handleDelete = (taskId)=>{
        setTasks((prev)=>prev.filter((task)=>task.id !== taskId));
    };
    const handleChangeEstimated = (taskId, value)=>{
        setTasks((prev)=>prev.map((task)=>{
                if (task.id !== taskId) return task;
                if (value === "") {
                    return {
                        ...task,
                        estimatedMinutes: null
                    };
                }
                const num = Number(value);
                if (Number.isNaN(num) || num < 0) {
                    return task;
                }
                return {
                    ...task,
                    estimatedMinutes: Math.floor(num)
                };
            }));
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
                if (!task.isRunning || !task.startedAt) {
                    return {
                        ...task,
                        isRunning: false,
                        startedAt: null
                    };
                }
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
        if (hours > 0) {
            return `${hours}時間${minutes}分`;
        }
        return `${minutes}分`;
    };
    const countsByStatus = {
        not_decided: tasks.filter((t)=>t.status === "not_decided").length,
        todo: tasks.filter((t)=>t.status === "todo").length,
        doing: tasks.filter((t)=>t.status === "doing").length,
        done: tasks.filter((t)=>t.status === "done").length
    };
    // 週全体サマリー計算
    const summary = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        let totalEstimatedMinutes = 0;
        let estimatedTaskCount = 0;
        let totalActualSeconds = 0;
        let totalDiffMinutes = 0;
        let diffCount = 0;
        for (const task of tasks){
            const runningExtra = task.isRunning && task.startedAt ? Math.max(0, Math.floor((now - task.startedAt) / 1000)) : 0;
            const totalSeconds = task.actualSeconds + runningExtra;
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
    }, [
        tasks,
        now
    ]);
    const formatAvgDiff = (avg)=>{
        if (avg === null) {
            return {
                label: "—",
                color: "text-slate-500"
            };
        }
        const rounded = Math.round(avg * 10) / 10; // 小数1桁
        if (rounded === 0) {
            return {
                label: "±0分",
                color: "text-slate-700"
            };
        }
        if (rounded > 0) {
            return {
                label: `+${rounded}分（見積もりより遅い）`,
                color: "text-red-600"
            };
        }
        return {
            label: `${rounded}分（見積もりより早い）`,
            color: "text-emerald-600"
        };
    };
    const avgDiff = formatAvgDiff(summary.avgDiffMinutes ?? null);
    // ステータスごとの集計
    const statusSummary = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
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
            const runningExtra = task.isRunning && task.startedAt ? Math.max(0, Math.floor((now - task.startedAt) / 1000)) : 0;
            const totalSeconds = task.actualSeconds + runningExtra;
            base[task.status].count += 1;
            base[task.status].totalSeconds += totalSeconds;
        }
        return base;
    }, [
        tasks,
        now
    ]);
    // CSV用テキスト生成
    const csvText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        if (tasks.length === 0) return "";
        const escapeCsv = (value)=>{
            const escaped = value.replace(/"/g, '""');
            return `"${escaped}"`;
        };
        const header = "タスク名,ステータス,見積もり(分),実績(分),差分(分)";
        const lines = tasks.map((task)=>{
            const runningExtra = task.isRunning && task.startedAt ? Math.max(0, Math.floor((now - task.startedAt) / 1000)) : 0;
            const totalSeconds = task.actualSeconds + runningExtra;
            const actualMinutes = Math.floor(totalSeconds / 60);
            const est = task.estimatedMinutes;
            let diffStr = "";
            if (est != null) {
                const diff = actualMinutes - est;
                if (diff > 0) {
                    diffStr = `+${diff}`;
                } else if (diff === 0) {
                    diffStr = "0";
                } else {
                    diffStr = `${diff}`;
                }
            }
            const title = escapeCsv(task.title);
            const statusLabel = STATUS_LABEL[task.status];
            const estStr = est != null ? String(est) : "";
            const actualStr = String(actualMinutes);
            return [
                title,
                statusLabel,
                estStr,
                actualStr,
                diffStr
            ].join(",");
        });
        return [
            header,
            ...lines
        ].join("\n");
    }, [
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
    // 表示順：未完了タスク → 完了タスク（下に寄せる）
    const sortedTasks = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        const notDone = tasks.filter((t)=>t.status !== "done");
        const done = tasks.filter((t)=>t.status === "done");
        return [
            ...notDone,
            ...done
        ];
    }, [
        tasks
    ]);
    // 完了タスクの表示／非表示
    const visibleTasks = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>sortedTasks.filter((t)=>showCompleted || t.status !== "done"), [
        sortedTasks,
        showCompleted
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl py-6 px-4 md:px-8 space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/reports",
                                    className: "inline-flex items-center text-[11px] md:text-xs text-slate-600 hover:text-slate-900",
                                    children: "← 週報一覧に戻る"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl md:text-3xl font-bold",
                                    children: [
                                        "週報タスク管理（ID: ",
                                        id,
                                        "）"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs md:text-sm text-slate-600 max-w-3xl",
                                    children: "今週やることを箇条書きで洗い出して、ステータス・見積もり時間・実績時間を管理します。 タスクとメモは「週報IDごとに」ブラウザへ自動保存されます。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 450,
                                    columnNumber: 13
                                }, this),
                                !loaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-slate-500",
                                    children: "読み込み中..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 455,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 440,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-1.5 text-[11px] md:text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1",
                                            children: [
                                                "合計:",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-slate-800",
                                                    children: tasks.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 463,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 461,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1",
                                            children: [
                                                "完了:",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-emerald-700",
                                                    children: countsByStatus.done
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 469,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 467,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1",
                                            children: [
                                                "進行中:",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-blue-700",
                                                    children: countsByStatus.doing
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 473,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1",
                                            children: [
                                                "未着手:",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1 font-semibold text-amber-700",
                                                    children: countsByStatus.todo
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 479,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 460,
                                    columnNumber: 13
                                }, this),
                                savedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-emerald-600",
                                    children: savedMessage
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 487,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 459,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 439,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "rounded-xl border bg-white shadow-sm p-4 md:p-5 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-base md:text-lg font-semibold",
                            children: "タスクを追加"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 494,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400",
                                    placeholder: "タスク内容を入力",
                                    value: newTitle,
                                    onChange: (e)=>setNewTitle(e.target.value),
                                    onKeyDown: handleKeyDown
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 496,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleAddTask,
                                    className: "w-full md:w-auto inline-flex justify-center items-center rounded-lg px-5 py-2.5 text-sm font-medium border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 transition",
                                    children: "＋ 追加"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 504,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 495,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 493,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-base md:text-lg font-semibold",
                                    children: "タスク一覧"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 517,
                                    columnNumber: 13
                                }, this),
                                tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowCompleted((prev)=>!prev),
                                    className: "inline-flex items-center rounded-full border border-slate-400 px-3 py-1 text-[11px] md:text-xs text-slate-700 hover:bg-slate-100",
                                    children: showCompleted ? "完了タスクを隠す" : "完了タスクを表示"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 521,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 516,
                            columnNumber: 11
                        }, this),
                        tasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-600",
                                    children: "まだタスクがありません。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 533,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] md:text-xs text-slate-500",
                                    children: "上の入力欄から「今週やること」を1行ずつ追加してみてください。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 534,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 532,
                            columnNumber: 13
                        }, this) : visibleTasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border bg-white p-4 text-center space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-600",
                                    children: "表示中のタスクはありません。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 540,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] md:text-xs text-slate-500",
                                    children: "完了タスクを非表示にしている場合は、右上のボタンから表示に切り替えられます。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 539,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-3",
                            children: visibleTasks.map((task)=>{
                                const runningExtra = task.isRunning && task.startedAt ? Math.max(0, Math.floor((now - task.startedAt) / 1000)) : 0;
                                const totalSeconds = task.actualSeconds + runningExtra;
                                const est = task.estimatedMinutes;
                                const totalMinutes = Math.floor(totalSeconds / 60);
                                let diffLabel = "";
                                let diffClass = "text-slate-700";
                                if (est != null) {
                                    const diff = totalMinutes - est;
                                    if (diff === 0) {
                                        diffLabel = "±0分";
                                    } else if (diff > 0) {
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
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: `${baseItemClass} ${highlightClass}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm md:text-base text-slate-900 break-words",
                                                            children: task.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 589,
                                                            columnNumber: 25
                                                        }, this),
                                                        isHighlighted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center rounded-full bg-blue-600 px-2 py-[2px] text-[11px] font-medium text-white",
                                                            children: "▶ 実行中のタスク"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1 min-w-[190px]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleChangeStatus(task.id, status),
                                                                className: base + " " + (active ? activeStyleByStatus[status] : inactiveStyleByStatus[status]),
                                                                children: STATUS_LABEL[status]
                                                            }, status, false, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 626,
                                                                columnNumber: 31
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 599,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 598,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 587,
                                            columnNumber: 21
                                        }, this),
                                        isHighlighted ? // 実行中タスク：大きめパネル
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg bg-slate-50 px-3 py-2.5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs md:text-sm text-slate-600",
                                                            children: "見積もり"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            min: 0,
                                                            className: "w-20 rounded-md border border-slate-300 px-2 py-1 text-sm md:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400",
                                                            value: est ?? "",
                                                            onChange: (e)=>handleChangeEstimated(task.id, e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 657,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs md:text-sm text-slate-600",
                                                            children: "分"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 666,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-start md:items-center gap-0.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs md:text-sm text-slate-600",
                                                            children: "実績"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 673,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-base md:text-xl font-semibold text-slate-900",
                                                            children: formatDuration(totalSeconds)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 676,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 672,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1.5",
                                                    children: [
                                                        est != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs md:text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-500 mr-1",
                                                                    children: "差分"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 685,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `font-semibold ${diffClass}`,
                                                                    children: diffLabel
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 688,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>handleStopTimer(task.id),
                                                                    className: "px-3 py-1.5 rounded-md border border-red-500 text-xs md:text-sm font-medium text-red-600 hover:bg-red-50",
                                                                    children: "⏹ 停止"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 695,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>handleDelete(task.id),
                                                                    className: "text-xs md:text-sm text-red-500 hover:text-red-600 hover:underline",
                                                                    children: "削除"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 702,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 694,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 682,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 651,
                                            columnNumber: 23
                                        }, this) : // 非実行中タスク：コンパクト表示
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "見積もり"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 716,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            min: 0,
                                                            className: "w-16 rounded-md border border-slate-300 px-1.5 py-[2px] text-[11px] md:text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400",
                                                            value: est ?? "",
                                                            onChange: (e)=>handleChangeEstimated(task.id, e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 717,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "分"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 726,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 715,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "実績"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 730,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium text-slate-800 text-[11px] md:text-xs",
                                                            children: formatDuration(totalSeconds)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 731,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 25
                                                }, this),
                                                est != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "差分"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 738,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-medium ${diffClass}`,
                                                            children: diffLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 739,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 737,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 ml-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleStartTimer(task.id),
                                                            className: "px-2 py-[2px] rounded-md border border-slate-700 text-[10px] md:text-xs font-medium text-slate-800 hover:bg-slate-100",
                                                            children: "▶ 開始"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 746,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleDelete(task.id),
                                                            className: "text-[10px] md:text-xs text-red-500 hover:text-red-600 hover:underline",
                                                            children: "削除"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 753,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 714,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, task.id, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 582,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 548,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 515,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-3 pt-2 border-t border-slate-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-sm md:text-base font-semibold text-slate-800",
                            children: "週全体のサマリー"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 772,
                            columnNumber: 11
                        }, this),
                        tasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-[11px] md:text-xs text-slate-500",
                            children: "タスクを追加すると、この週の合計時間や見積もり精度のサマリーが表示されます。"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 777,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3 md:grid-cols-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-white px-4 py-3 flex flex-col justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] md:text-xs text-slate-500",
                                                    children: "合計実績時間"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 786,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-base md:text-xl font-semibold text-slate-900",
                                                    children: [
                                                        summary.totalActualHours,
                                                        "時間",
                                                        summary.remainingMinutes,
                                                        "分"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 789,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[10px] md:text-[11px] text-slate-500",
                                                    children: "（全タスクの実績時間の合計）"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 792,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 785,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-white px-4 py-3 flex flex-col justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] md:text-xs text-slate-500",
                                                    children: "合計見積もり時間"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-base md:text-xl font-semibold text-slate-900",
                                                    children: [
                                                        summary.totalEstimatedMinutes,
                                                        "分"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[10px] md:text-[11px] text-slate-500",
                                                    children: [
                                                        "見積もり入力済みタスク:",
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: [
                                                                summary.estimatedTaskCount,
                                                                "件"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 807,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 798,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg白 px-4 py-3 flex flex-col justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] md:text-xs text-slate-500",
                                                    children: "平均見積もり誤差"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 815,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `mt-1 text-sm md:text-lg font-semibold ${avgDiff.color}`,
                                                    children: avgDiff.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 818,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-[10px] md:text-[11px] text-slate-500",
                                                    children: "（実績 − 見積もりの平均値。プラスは見積もりより時間がかかっている状態です）"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                    lineNumber: 823,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 814,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 783,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border bg-white px-4 py-3 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] md:text-xs font-semibold text-slate-700",
                                            children: "ステータスごとの集計"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 831,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-x-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "min-w-full text-[11px] md:text-xs text-left text-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-b border-slate-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "ステータス"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 839,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "タスク数"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 840,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "py-1.5 pr-4 font-medium",
                                                                    children: "合計実績時間"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                    lineNumber: 841,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                            lineNumber: 838,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 837,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: STATUS_ORDER.map((status)=>{
                                                            const s = statusSummary[status];
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "border-b border-slate-100 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: STATUS_LABEL[status]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 852,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: [
                                                                            s.count,
                                                                            "件"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 855,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "py-1.5 pr-4",
                                                                        children: s.count === 0 ? "—" : formatHMFromSeconds(s.totalSeconds)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                        lineNumber: 856,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, status, true, {
                                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                                lineNumber: 848,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                        lineNumber: 844,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/reports/[id]/page.tsx",
                                                lineNumber: 836,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 835,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "実績時間には、現在タイマーが動いているタスクの経過時間も含まれます。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 868,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 830,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 771,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-2 pt-3 border-t border-slate-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-sm md:text-base font-semibold text-slate-800",
                                    children: "CSV形式でエクスポート（コピペ用）"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 879,
                                    columnNumber: 13
                                }, this),
                                tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleCopyCsv,
                                    className: "inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100",
                                    children: "コピー"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 883,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 878,
                            columnNumber: 11
                        }, this),
                        tasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-[11px] md:text-xs text-slate-500",
                            children: "タスクを追加すると、この週の内容をCSV形式で出力できます。"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 894,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] md:text-xs text-slate-500",
                                    children: "下のテキストをコピーして、Excel / Googleスプレッドシート / 会社の週報フォーマットなどに貼り付けて使えます。"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 899,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "w-full min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-[11px] md:text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-vertical",
                                    value: csvText,
                                    readOnly: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 902,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "列: タスク名 / ステータス / 見積もり(分) / 実績(分) / 差分(分)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 908,
                                            columnNumber: 17
                                        }, this),
                                        csvCopiedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-emerald-600",
                                            children: csvCopiedMessage
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 912,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 907,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 898,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 877,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-2 pt-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-sm md:text-base font-semibold text-slate-800",
                            children: "週次ふりかえりメモ"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 923,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[11px] md:text-xs text-slate-500",
                            children: "今週の振り返りや来週に向けたメモを書いておくスペースです。"
                        }, void 0, false, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 926,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "w-full min-h-[120px] rounded-md border border-slate-300 px-3 py-2 text-sm md:text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 resize-vertical",
                                    value: weeklyNote,
                                    onChange: (e)=>setWeeklyNote(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 931,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-slate-500",
                                            children: "入力内容は自動で保存されます（ブラウザごと／週報IDごと）。"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 937,
                                            columnNumber: 15
                                        }, this),
                                        noteSavedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] md:text-[11px] text-emerald-600",
                                            children: noteSavedMessage
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                                            lineNumber: 941,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                                    lineNumber: 936,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/reports/[id]/page.tsx",
                            lineNumber: 930,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/reports/[id]/page.tsx",
                    lineNumber: 922,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/reports/[id]/page.tsx",
            lineNumber: 437,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/reports/[id]/page.tsx",
        lineNumber: 436,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9a00c637._.js.map