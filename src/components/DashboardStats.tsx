import Link from "next/link";
import React from "react";
import {
    type Report,
    type ReportStats,
    formatDate,
    formatHMFromSecondsSimple,
} from "@/lib/reportUtils";

type Props = {
    thisWeekReport: Report | null;
    thisWeekStats: ReportStats | null;
    onRefresh: () => void;
};

export function DashboardStats({ thisWeekReport, thisWeekStats, onRefresh }: Props) {
    if (!thisWeekReport || !thisWeekStats) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:bg-black dark:border-[#2f3336] p-6 text-center">
                <p className="text-sm text-slate-500 dark:text-[#71767b]">
                    今週のレポートが見つかりません。右上の「新しい週を追加」から作成できます。
                </p>
            </div>
        );
    }

    const completionRate =
        thisWeekStats.totalCount === 0
            ? 0
            : Math.round((thisWeekStats.doneCount / thisWeekStats.totalCount) * 100);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2">
                    📊 ホーム <span className="text-xs font-normal text-slate-400 dark:text-[#71767b]">| 今週の状況</span>
                </h2>
                <button
                    type="button"
                    onClick={onRefresh}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:underline transition-colors"
                >
                    集計を更新
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Link Card */}
                <Link
                    href={`/reports/${thisWeekReport.id}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-black dark:border-[#2f3336] p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-[#536471] transition-all duration-200"
                >
                    <div className="absolute right-0 top-0 h-16 w-16 -mr-4 -mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-transparent dark:to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div>
                        <div className="flex items-center justify-between">
                            <span className="inline-block rounded-md bg-slate-100 dark:bg-[#16181c] px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-[#71767b]">
                                CURRENT
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-[#71767b]">
                                {formatDate(thisWeekReport.createdAt)}
                            </span>
                        </div>
                        <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-[#e7e9ea] group-hover:text-indigo-600 dark:group-hover:text-[#1d9bf0] transition-colors line-clamp-1">
                            {thisWeekReport.title}
                        </h3>
                    </div>

                    <div className="mt-4 flex items-center justify-end text-xs font-medium text-slate-500 dark:text-[#71767b] group-hover:translate-x-1 transition-transform">
                        開く <span className="ml-1">→</span>
                    </div>
                </Link>

                {/* Total Time */}
                <div className="rounded-2xl border border-slate-100 dark:border-[#2f3336] bg-white dark:bg-black p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 -mr-6 -mt-6 bg-emerald-50 dark:bg-transparent rounded-full blur-xl opacity-60" />
                    <p className="text-xs font-medium text-slate-500 dark:text-[#71767b] z-10">合計実績時間</p>
                    <div className="mt-2 z-10">
                        <span className="text-2xl font-bold text-slate-800 dark:text-[#e7e9ea] tracking-tight">
                            {formatHMFromSecondsSimple(thisWeekStats.totalActualSeconds)}
                        </span>
                        <p className="text-[10px] text-slate-400 dark:text-[#71767b] mt-1">タスク全体の作業時間</p>
                    </div>
                </div>

                {/* Completion Rate */}
                <div className="rounded-2xl border border-slate-100 dark:border-[#2f3336] bg-white dark:bg-black p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 -mr-6 -mt-6 bg-blue-50 dark:bg-transparent rounded-full blur-xl opacity-60" />
                    <p className="text-xs font-medium text-slate-500 dark:text-[#71767b] z-10">完了率</p>
                    <div className="mt-2 z-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-800 dark:text-[#e7e9ea] tracking-tight">
                                {thisWeekStats.totalCount === 0 ? "—" : `${completionRate}%`}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-[#71767b]">
                                ({thisWeekStats.doneCount}/{thisWeekStats.totalCount})
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-[#2f3336] overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Today Remaining */}
                <div className="rounded-2xl border border-slate-100 dark:border-[#2f3336] bg-white dark:bg-black p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 -mr-6 -mt-6 bg-amber-50 dark:bg-transparent rounded-full blur-xl opacity-60" />
                    <p className="text-xs font-medium text-slate-500 dark:text-[#71767b] z-10">今日の残りタスク</p>
                    <div className="mt-2 z-10">
                        <span className={`text-2xl font-bold tracking-tight ${thisWeekStats.todayRemaining > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-slate-300 dark:text-[#2f3336]'}`}>
                            {thisWeekStats.todayRemaining}
                            <span className="text-sm font-normal text-slate-400 dark:text-[#71767b] ml-1">件</span>
                        </span>
                        <p className="text-[10px] text-slate-400 dark:text-[#71767b] mt-1">
                            {thisWeekStats.todayRemaining > 0 ? "あと一息です！" : "すべて完了しました 🎉"}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
