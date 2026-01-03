"use client";

import React from "react";
import { motion } from "framer-motion";
import { LevelInfo } from "@/lib/gamification";

type Props = {
    levelInfo: LevelInfo;
};

export function UserLevelCard({ levelInfo }: Props) {
    const { level, rank, currentLevelXP, nextLevelXP, progressPercent, totalXP } = levelInfo;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-black/80 backdrop-blur-md border border-white/40 dark:border-[#2f3336] shadow-sm p-4 w-full max-w-sm">
            {/* Rank Background Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-current ${rank.color}`} />

            <div className="relative z-10 flex items-center justify-between mb-2">
                <div>
                    <span className={`text-xs font-bold tracking-wider uppercase opacity-70 ${rank.color}`}>
                        {rank.name}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium text-slate-500">Lv.</span>
                        <span className="text-3xl font-black text-slate-800 tracking-tight">{level}</span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#71767b] font-bold">Total XP</div>
                    <div className="text-sm font-mono font-medium text-slate-600 dark:text-[#e7e9ea]">{totalXP.toLocaleString()}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 w-full bg-slate-100 dark:bg-[#16181c] rounded-full overflow-hidden border border-slate-200/50 dark:border-[#2f3336]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500`}
                />
            </div>

            <div className="flex justify-between mt-1 text-[10px] font-medium text-slate-400 dark:text-[#71767b]">
                <span>{currentLevelXP} XP</span>
                <span>NEXT: {nextLevelXP - currentLevelXP} XP</span>
            </div>
        </div>
    );
}

export function MiniUserLevelBadge({ levelInfo }: Props) {
    const { level, rank } = levelInfo;
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-[#16181c] backdrop-blur-sm rounded-full border border-white/60 dark:border-[#2f3336] shadow-sm">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${rank.color}`}>
                {rank.name}
            </span>
            <div className="w-px h-3 bg-slate-300 dark:bg-[#2f3336]" />
            <span className="text-xs font-bold text-slate-700 dark:text-[#e7e9ea]">Lv.{level}</span>
        </div>
    );
}
