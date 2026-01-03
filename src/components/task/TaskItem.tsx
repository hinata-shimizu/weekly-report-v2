import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline"; // Grip Icon
import {
    type Task,
    type TaskStatus,
    type TaskPriority,
    PRIORITY_LABEL,
    PRIORITY_ORDER,
    STATUS_LABEL,
    STATUS_ORDER,
    getTotalActualSeconds,
    cn,
} from "@/lib/reportUtils";

type Props = {
    task: Task;
    now: number;
    tags: string[];
    onChangeStatus: (id: string, status: TaskStatus) => void;
    onChangeTag: (id: string, tag: string) => void;
    onChangePriority: (id: string, priority: string) => void;
    onChangeEstimated: (id: string, value: string) => void;
    onToggleToday: (id: string) => void;
    onStartTimer: (id: string) => void;
    onStopTimer: (id: string) => void;
    onDelete: (id: string) => void;
};

export function TaskItem({
    task,
    now,
    tags,
    onChangeStatus,
    onChangeTag,
    onChangePriority,
    onChangeEstimated,
    onToggleToday,
    onStartTimer,
    onStopTimer,
    onDelete,
}: Props) {
    // Sortable Hooks
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: isDragging ? "relative" as const : undefined,
    };

    const totalSeconds = getTotalActualSeconds(task, now);
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
    const containerClass = cn(
        "rounded-xl border p-3 sm:p-4 transition-all duration-200 flex flex-col gap-3 group relative",
        isRunning
            ? "border-indigo-500 bg-white dark:bg-black ring-4 ring-indigo-500/20 shadow-2xl scale-[1.05] md:scale-110 z-20 my-4"
            : "border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black hover:bg-white dark:hover:bg-black hover:shadow-md hover:border-indigo-200 dark:hover:border-[#536471]", // Glassy default
        isDragging && "shadow-xl ring-2 ring-indigo-500 opacity-80 cursor-grabbing bg-indigo-50 dark:bg-[#1d9bf0]/10"
    );

    // priority badge style
    const priorityColors = {
        high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-transparent dark:text-rose-500 dark:border-rose-900/50",
        medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-transparent dark:text-amber-500 dark:border-amber-900/50",
        low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-transparent dark:text-blue-500 dark:border-blue-900/50",
    };
    const getPriorityStyle = (p: TaskPriority) => {
        switch (p) {
            case "p0": return priorityColors.high;
            case "p1": return priorityColors.medium;
            case "p2": return priorityColors.low;
            default: return "";
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={containerClass}>

            {/* Top Row: Main Info */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-start justify-between pl-8 sm:pl-10 relative">
                {/* Drag Handle (Absolute Positioned for mobile/desktop unification) */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-1 top-4 p-2 text-slate-300 hover:text-indigo-500 cursor-grab active:cursor-grabbing touch-none z-10"
                    title="ドラッグして並び替え"
                >
                    <Bars3Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-2 min-w-0 pl-1">
                    <div className="flex items-start gap-2">
                        <div className="pt-0.5 shrink-0">
                            <span className={cn("inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getPriorityStyle(task.priority))}>
                                {PRIORITY_LABEL[task.priority]}
                            </span>
                        </div>
                        <p className={cn("text-base font-semibold leading-relaxed break-words text-slate-800 dark:text-[#e7e9ea]", task.status === "done" && "text-slate-400 dark:text-[#71767b] line-through decoration-slate-300 dark:decoration-[#2f3336]")}>
                            {task.title}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Tag Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-black rounded-md px-2 py-0.5 border border-transparent dark:border-[#2f3336] hover:border-slate-200 dark:hover:border-[#536471] transition-colors">
                            <span className="text-[10px] text-slate-500 dark:text-[#71767b]">TAG</span>
                            <select
                                className="text-[11px] bg-transparent border-none p-0 pr-4 focus:ring-0 text-slate-700 dark:text-[#e7e9ea] font-medium cursor-pointer"
                                value={task.tag ?? ""}
                                onChange={(e) => onChangeTag(task.id, e.target.value)}
                            >
                                <option value="" className="dark:bg-black dark:text-[#e7e9ea]">(未設定)</option>
                                {tags.map((t) => (
                                    <option key={t} value={t} className="dark:bg-black dark:text-[#e7e9ea]">{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-black rounded-md px-2 py-0.5 border border-transparent dark:border-[#2f3336] hover:border-slate-200 dark:hover:border-[#536471] transition-colors">
                            <span className="text-[10px] text-slate-500 dark:text-[#71767b]">PRIORITY</span>
                            <select
                                className="text-[11px] bg-transparent border-none p-0 pr-4 focus:ring-0 text-slate-700 dark:text-[#e7e9ea] font-medium cursor-pointer"
                                value={task.priority}
                                onChange={(e) => onChangePriority(task.id, e.target.value)}
                            >
                                {PRIORITY_ORDER.map((p) => (
                                    <option key={p} value={p} className="dark:bg-black dark:text-[#e7e9ea]">{p.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Today Toggle */}
                        <label className="flex items-center gap-1.5 cursor-pointer bg-slate-100/50 dark:bg-black rounded-md px-2 py-0.5 hover:bg-indigo-50 dark:hover:bg-[#1d9bf0]/10 hover:border-indigo-100 border border-transparent dark:border-[#2f3336] transition-colors">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300 dark:border-[#536471] text-indigo-600 focus:ring-indigo-500 h-3 w-3 dark:bg-black"
                                checked={task.isToday}
                                onChange={() => onToggleToday(task.id)}
                            />
                            <span className={cn("text-[11px] font-medium transition-colors", task.isToday ? "text-indigo-600 dark:text-[#1d9bf0]" : "text-slate-500 dark:text-[#71767b]")}>Today</span>
                        </label>
                    </div>
                </div>

                {/* Status Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    <div className="flex rounded-lg bg-slate-100/80 p-0.5 backdrop-blur-sm">
                        {STATUS_ORDER.map((s) => {
                            const isActive = task.status === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => onChangeStatus(task.id, s)}
                                    className={cn(
                                        "px-2.5 py-1 text-[10px] font-medium rounded-md transition-all whitespace-nowrap",
                                        isActive ? "bg-white dark:bg-[#1d9bf0] text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-0" : "text-slate-500 dark:text-[#71767b] hover:text-slate-700 dark:hover:text-[#e7e9ea]"
                                    )}
                                >
                                    {STATUS_LABEL[s]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Time Management */}
            {isRunning ? (
                // Running Layout: Centered Big Timer
                <div className="mt-2 flex flex-col items-center justify-center gap-3 py-4 bg-indigo-50/50 dark:bg-[#1d9bf0]/10 rounded-xl border border-indigo-100 dark:border-[#1d9bf0]/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 animate-pulse">RUNNING</span>
                        <span className="font-mono text-4xl md:text-5xl font-black text-indigo-600 tabular-nums tracking-tight drop-shadow-sm">
                            {minutes}<span className="text-xl md:text-2xl text-indigo-400 font-bold ml-1">m</span>
                            {seconds.toString().padStart(2, "0")}<span className="text-xl md:text-2xl text-indigo-400 font-bold ml-1">s</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-6 mt-2">
                        {/* Estimation (Small) */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#71767b] bg-white/80 dark:bg-black px-3 py-1.5 rounded-full border border-slate-200 dark:border-[#2f3336]">
                            <span>見積:</span>
                            <input
                                type="number"
                                min="0"
                                className="w-8 text-center font-bold text-slate-700 bg-transparent focus:outline-none border-b border-slate-300 focus:border-indigo-500 p-0"
                                placeholder="0"
                                value={est ?? ""}
                                onChange={(e) => onChangeEstimated(task.id, e.target.value)}
                            />
                            <span>分</span>
                            {est != null && (
                                <span className={cn("ml-1 font-bold", diffClass)}>{diffLabel}</span>
                            )}
                        </div>

                        <button
                            onClick={() => onStopTimer(task.id)}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                            STOP TIMER
                        </button>
                    </div>
                </div>
            ) : (
                // Standard Layout
                <div className="mt-1 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-[#2f3336] hover:bg-slate-50 dark:hover:bg-[#16181c] transition-colors">
                    {/* Estimation */}
                    <div className="flex items-center gap-4 text-xs pl-7 sm:pl-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">見積</span>
                            <div className="relative">
                                <input
                                    min="0"
                                    className="w-14 rounded border border-slate-200/60 dark:border-[#2f3336] bg-white dark:bg-black px-1.5 py-0.5 text-right font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-[#1d9bf0] focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#1d9bf0] text-slate-700 dark:text-[#e7e9ea]"
                                    placeholder="0"
                                    value={est ?? ""}
                                    onChange={(e) => onChangeEstimated(task.id, e.target.value)}
                                />
                                <span className="ml-1 text-slate-400">分</span>
                            </div>
                        </div>

                        {est != null && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-slate-400">差分</span>
                                <span className={diffClass}>{diffLabel}</span>
                            </div>
                        )}
                    </div>

                    {/* Actual & Control */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xs text-slate-500">実績</span>
                            <span className="font-mono text-base font-bold text-slate-700 tabular-nums">
                                {timeStr}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Focus Mode Button */}
                            <a
                                href={`/focus?reportId=${new URL(window.location.href).pathname.split("/").pop()}&taskId=${task.id}`}
                                className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                                title="フォーカスモードで集中"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* Start Button */}
                            <button
                                onClick={() => onStartTimer(task.id)}
                                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                            >
                                <span className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent block ml-0.5" />
                                START
                            </button>

                            <button
                                onClick={() => onDelete(task.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-1"
                                title="削除"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
