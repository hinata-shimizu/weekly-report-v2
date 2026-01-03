"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rank } from "@/lib/gamification";

type Props = {
    show: boolean;
    oldLevel: number;
    newLevel: number;
    rank: Rank;
    onClose: () => void;
};

export function LevelUpModal({ show, oldLevel, newLevel, rank, onClose }: Props) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-sm rounded-3xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/50 dark:border-[#2f3336] shadow-2xl overflow-hidden p-8 text-center"
                    >
                        {/* Glow Effect */}
                        <div className={`absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-20 blur-3xl ${rank.color.replace("text-", "bg-")}`} />
                        <div className={`absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-3xl ${rank.color.replace("text-", "bg-")}`} />

                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl mb-4"
                        >
                            🎉
                        </motion.div>

                        <motion.h2
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 mb-2"
                        >
                            LEVEL UP!
                        </motion.h2>

                        <div className="flex justify-center items-baseline gap-4 mb-6">
                            <span className="text-xl font-bold text-slate-400">Lv.{oldLevel}</span>
                            <span className="text-2xl text-slate-300">→</span>
                            <span className="text-4xl font-black text-slate-800">Lv.{newLevel}</span>
                        </div>

                        <div className="mb-8">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Rank</div>
                            <div className={`text-lg font-bold ${rank.color}`}>
                                {rank.name}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-6 rounded-xl bg-slate-900 dark:bg-[#e7e9ea] text-white dark:text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            Awesome!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
