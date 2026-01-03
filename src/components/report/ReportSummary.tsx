import React, { useMemo } from "react";
import {
    Task,
    TaskStatus,
    STATUS_ORDER,
    STATUS_LABEL,
    getTotalActualSeconds,
    formatHMFromSecondsSimple,
    clamp,
    formatAvgDiff,
    pickTopTagsBySeconds,
    getTagColor,
    cn
} from "@/lib/reportUtils";

type Props = {
    tasks: Task[];
    now: number;
};

export function ReportSummary({ tasks, now }: Props) {
    const summary = useMemo(() => {
        let totalEst = 0;
        let estCount = 0;
        let totalActSec = 0;
        let totalDiff = 0;
        let diffCount = 0;

        for (const t of tasks) {
            const act = getTotalActualSeconds(t, now);
            totalActSec += act;

            if (t.estimatedMinutes != null) {
                totalEst += t.estimatedMinutes;
                estCount++;
                const actMin = Math.floor(act / 60);
                totalDiff += (actMin - t.estimatedMinutes);
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
    }, [tasks, now]);

    const statusStats = useMemo(() => {
        const res: Record<string, { count: number; sec: number }> = {};
        STATUS_ORDER.forEach(s => res[s] = { count: 0, sec: 0 });

        for (const t of tasks) {
            if (!res[t.status]) continue; // safety
            res[t.status].count++;
            res[t.status].sec += getTotalActualSeconds(t, now);
        }
        return res;
    }, [tasks, now]);

    // Re-use logic from util or just do it here for tags
    const topTags = useMemo(() => pickTopTagsBySeconds(tasks, now, 5), [tasks, now]);

    const avgDiffData = formatAvgDiff(summary.avgDiff);

    if (tasks.length === 0) return null;

    // New stats object for the updated UI
    const stats = useMemo(() => {
        const totalCount = tasks.length;
        const doneCount = statusStats.done.count;
        const totalActualSeconds = summary.totalActSec;
        const topTagsData = pickTopTagsBySeconds(tasks, now, 5); // Re-calculate or use existing topTags

        return {
            totalCount,
            doneCount,
            totalActualSeconds,
            topTags: topTagsData,
        };
    }, [tasks, now, summary, statusStats]);

    const avgDiffStyle = formatAvgDiff(summary.avgDiff);

    return (
        <div className="space-y-6 mt-6 pt-6 border-t border-slate-200">
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-[#e7e9ea]">📊 今週のサマリー</h2>
                    <span className="text-xs text-slate-500 dark:text-[#71767b] bg-slate-100 dark:bg-[#16181c] px-2 py-0.5 rounded-full">Real-time</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Overall Progress */}
                    <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#2f3336] p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-[#e7e9ea]">タスク消化状況</h3>
                            <span className="text-2xl font-black text-slate-800 dark:text-[#e7e9ea]">
                                {stats.doneCount}<span className="text-sm text-slate-400 dark:text-[#71767b] font-medium ml-1">/ {stats.totalCount}</span>
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-slate-100 dark:bg-[#16181c] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 dark:bg-[#1d9bf0] rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                    style={{ width: `${stats.totalCount > 0 ? (stats.doneCount / stats.totalCount) * 100 : 0}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-[#71767b]">
                                <span>{stats.totalCount > 0 ? Math.round((stats.doneCount / stats.totalCount) * 100) : 0}% Complete</span>
                                <span>残り {stats.totalCount - stats.doneCount}件</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-[#2f3336] grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 dark:text-[#71767b]">合計稼働時間</p>
                                <p className="text-lg font-bold text-slate-700 dark:text-[#e7e9ea] font-mono">
                                    {formatHMFromSecondsSimple(stats.totalActualSeconds)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 dark:text-[#71767b]">平均見積差分</p>
                                <p className={cn("text-lg font-bold font-mono", avgDiffStyle.className)}>
                                    {avgDiffStyle.label}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Tag Distribution (Visual) */}
                    <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-[#2f3336] p-5 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-600 dark:text-[#e7e9ea]">タグ別時間の使い方</h3>
                        {stats.topTags.length === 0 ? (
                            <div className="h-32 flex items-center justify-center text-slate-400 dark:text-[#71767b] text-xs text-center border-2 border-dashed border-slate-100 dark:border-[#2f3336] rounded-lg">
                                データがありません<br />タイマーを使って計測しましょう
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.topTags.slice(0, 4).map((row, i) => {
                                    const pct = Math.round((row.sec / Math.max(stats.totalActualSeconds, 1)) * 100);
                                    return (
                                        <div key={row.tag} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-medium text-slate-700 dark:text-[#e7e9ea]">{row.tag}</span>
                                                <span className="text-slate-500 dark:text-[#71767b]">{formatHMFromSecondsSimple(row.sec)} ({pct}%)</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 dark:bg-[#16181c] rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full opacity-80", getTagColor(row.tag).replace("bg-", "bg-").replace("text-", "").replace("border-", ""))}
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: 'currentColor',
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    <div className={cn("w-full h-full", getTagColor(row.tag).split(" ")[0].replace("bg-", "bg-"))} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Status Table */}
                <div className="rounded-xl border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black p-4">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-[#e7e9ea] mb-3">ステータス別</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 dark:text-[#71767b] border-b dark:border-[#2f3336]">
                            <tr>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Count</th>
                                <th className="pb-2 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-[#16181c]">
                            {STATUS_ORDER.map(s => (
                                <tr key={s}>
                                    <td className="py-2 text-slate-700 dark:text-[#e7e9ea]">{STATUS_LABEL[s]}</td>
                                    <td className="py-2 text-slate-600 dark:text-[#71767b] font-medium">{statusStats[s].count}</td>
                                    <td className="py-2 text-slate-500 dark:text-[#71767b] tabular-nums">
                                        {statusStats[s].sec > 0 ? formatHMFromSecondsSimple(statusStats[s].sec) : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tag Table */}
                <div className="rounded-xl border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black p-4">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-[#e7e9ea] mb-3">タグ別（Top 5）</h3>
                    {topTags.length === 0 ? (
                        <div className="h-24 flex items-center justify-center text-xs text-slate-400 dark:text-[#71767b]">実績データなし</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 dark:text-[#71767b] border-b dark:border-[#2f3336]">
                                <tr>
                                    <th className="pb-2 font-medium">Tag</th>
                                    <th className="pb-2 font-medium">Time</th>
                                    <th className="pb-2 font-medium">Share</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-[#16181c]">
                                {topTags.map(row => {
                                    const percent = summary.totalActSec > 0 ? Math.round((row.sec / summary.totalActSec) * 100) : 0;
                                    return (
                                        <tr key={row.tag}>
                                            <td className="py-2 text-slate-700 dark:text-[#e7e9ea]">{row.tag}</td>
                                            <td className="py-2 text-slate-600 dark:text-[#71767b] tabular-nums">{formatHMFromSecondsSimple(row.sec)}</td>
                                            <td className="py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-1.5 bg-slate-100 dark:bg-[#16181c] rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
                                                    </div>
                                                    <span className="text-xs text-slate-400 dark:text-[#71767b] tabular-nums">{percent}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
