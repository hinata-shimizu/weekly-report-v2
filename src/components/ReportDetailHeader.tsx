import Link from "next/link";
import React from "react";
import { Report, type TaskStatus } from "@/lib/reportUtils";
import { LevelInfo } from "@/lib/gamification";
import { MiniUserLevelBadge } from "@/components/gamification/UserLevelCard";
import { CoachMessage } from "@/lib/coaching";
import { CoachCard } from "@/components/coaching/CoachCard";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
    id: string;
    loaded: boolean;
    savedMessage: string;
    totalCount: number;
    countsByStatus: Record<TaskStatus, number>;
    levelInfo?: LevelInfo;
    advice?: CoachMessage;
};

export function ReportDetailHeader({
    id,
    loaded,
    savedMessage,
    totalCount,
    countsByStatus,
    levelInfo,
    advice,
}: Props) {
    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
                <Link
                    href="/reports"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <span aria-hidden>←</span> 週報一覧に戻る
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-[#e7e9ea] tracking-tight flex items-center gap-3 flex-wrap">
                    週報タスク管理 <span className="text-lg font-normal text-slate-400 dark:text-[#71767b]">#{id}</span>
                    {levelInfo && <MiniUserLevelBadge levelInfo={levelInfo} />}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                    今週やることを箇条書きで洗い出して、ステータス・見積もり時間・実績時間を管理します。<br className="hidden md:block" />
                    入力内容はすべて「ブラウザ（この端末）」に自動保存されます。
                </p>
                {!loaded && <p className="text-xs text-slate-400 animate-pulse">読み込み中...</p>}
            </div>

            <div className="flex flex-col items-end gap-3 pt-1">
                <div className="flex flex-wrap items-center justify-end gap-2 text-[10px] md:text-xs">
                    <ThemeToggle className="mr-2" />
                    <Badge label="合計" value={totalCount} color="slate" />
                    <Badge label="完了" value={countsByStatus.done} color="emerald" />
                    <Badge label="進行中" value={countsByStatus.doing} color="blue" />
                    <Badge label="未着手" value={countsByStatus.todo} color="amber" />
                </div>

                <div className="h-4 flex items-center">
                    {savedMessage && (
                        <p className="text-[11px] font-medium text-emerald-600 animate-fade-in-out">
                            {savedMessage}
                        </p>
                    )}
                </div>
            </div>

            {/* AI Coach Section */}
            {advice && (
                <div className="w-full md:absolute md:top-full md:right-0 md:mt-4 md:w-96 z-20">
                    <CoachCard advice={advice} className="bg-white/90 backdrop-blur shadow-lg border-opacity-60" />
                </div>
            )}
        </header>
    );
}

function Badge({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: "slate" | "emerald" | "blue" | "amber";
}) {
    const styles = {
        slate: "bg-slate-100 text-slate-700 dark:bg-[#16181c] dark:text-[#71767b]",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-[#051c12] dark:text-[#00ba7c] dark:border-[#003a27]", // X green-like
        blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-[#0a1727] dark:text-[#1d9bf0] dark:border-[#102a43]", // X blue
        amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-[#1e160a] dark:text-[#ffd400] dark:border-[#382800]", // X yellow
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-1 ${styles[color]}`}
        >
            {label}: <span className="ml-1 font-bold">{value}</span>
        </span>
    );
}
