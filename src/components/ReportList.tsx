import Link from "next/link";
import React, { useMemo } from "react";
import {
    type Report,
    type ReportStats,
    formatDate,
    formatHMFromSecondsSimple,
    formatAvgDiff,
    cn
} from "@/lib/reportUtils";

type Props = {
    reports: Report[];
    statsById: Record<string, ReportStats>;
    onDelete: (id: string, e: React.MouseEvent) => void;
};

export function ReportList({ reports, statsById, onDelete }: Props) {
    if (reports.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-[#2f3336] bg-slate-50/50 dark:bg-black p-12 text-center">
                <p className="text-slate-500 dark:text-[#71767b] font-medium">まだレポートがありません</p>
                <p className="text-sm text-slate-400 dark:text-[#536471] mt-2">
                    「新しい週を追加」ボタンから、今週のレポートを作成しましょう。
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2">
                    📑 レポート一覧
                </h2>
                <p className="text-[10px] text-slate-400 dark:text-[#71767b]">Total: {reports.length}</p>
            </div>

            <div className="space-y-3">
                {reports.map((report) => (
                    <ReportRow
                        key={report.id}
                        report={report}
                        stats={statsById[report.id]}
                        onDelete={(e) => onDelete(report.id, e)}
                    />
                ))}
            </div>
        </section>
    );
}

function ReportRow({
    report,
    stats,
    onDelete,
}: {
    report: Report;
    stats?: ReportStats;
    onDelete: (e: React.MouseEvent) => void;
}) {
    const avg = formatAvgDiff(stats?.avgDiffMinutes ?? null);
    const totalSec = stats?.totalActualSeconds ?? 0;
    const done = stats?.doneCount ?? 0;
    const total = stats?.totalCount ?? 0;
    const topTags = stats?.topTags ?? [];

    return (
        <Link
            href={`/reports/${report.id}`}
            className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white dark:bg-black dark:border-[#2f3336] shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-[#536471] transition-all duration-200"
        >
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                {/* Main Info */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-[#e7e9ea] group-hover:text-indigo-600 dark:group-hover:text-[#1d9bf0] transition-colors truncate">
                            {report.title}
                        </h3>
                        <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-[#16181c] text-slate-500 dark:text-[#71767b] font-mono">
                            #{report.id}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#71767b] line-clamp-1 group-hover:text-slate-600 dark:group-hover:text-[#aab8c2]">
                        {report.description}
                    </p>

                    {/* Tags (Desktop) */}
                    {topTags.length > 0 && (
                        <div className="hidden sm:flex items-center gap-2 pt-1">
                            {topTags.slice(0, 3).map((t) => (
                                <span
                                    key={t.tag}
                                    className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-[#16181c] px-2 py-0.5 text-[10px] text-slate-600 dark:text-[#71767b] border border-slate-100 dark:border-[#2f3336]"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    {t.tag}
                                    <span className="text-slate-400 dark:text-[#71767b] font-normal ml-0.5">
                                        {formatHMFromSecondsSimple(t.seconds)}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats & Meta */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1 text-right border-t sm:border-t-0 border-dashed pt-3 sm:pt-0 border-slate-100 dark:border-[#2f3336]">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-center sm:text-right">
                            <p className="text-[10px] text-slate-400 dark:text-[#71767b] uppercase tracking-wider font-semibold">Done</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-[#e7e9ea]">
                                {done}
                                <span className="text-xs font-medium text-slate-400 dark:text-[#71767b]">/{total}</span>
                            </p>
                        </div>

                        <div className="w-px h-6 bg-slate-100 dark:bg-[#2f3336] hidden sm:block" />

                        <div className="text-center sm:text-right">
                            <p className="text-[10px] text-slate-400 dark:text-[#71767b] uppercase tracking-wider font-semibold">Time</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-[#e7e9ea]">
                                {formatHMFromSecondsSimple(totalSec)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-1 pl-2 sm:pl-0">
                        <span className="text-[10px] text-slate-400 dark:text-[#71767b]">
                            {formatDate(report.createdAt)}
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(e);
                            }}
                            className="p-1 -mr-1 rounded-md text-slate-300 dark:text-[#71767b] hover:text-red-500 dark:hover:text-[#f4212e] hover:bg-red-50 dark:hover:bg-[#f4212e]/10 transition-colors"
                            title="削除"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
