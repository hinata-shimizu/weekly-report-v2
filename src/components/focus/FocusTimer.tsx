"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
    initialMinutes: number;
    onComplete: (elapsedSeconds: number) => void;
    onExit: () => void;
};

export function FocusTimer({ initialMinutes, onComplete, onExit }: Props) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [duration, setDuration] = useState(initialMinutes * 60);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Don't auto-complete to avoid accidental triggers, let user feel the accomplishment
            // OR maybe play a sound? For now, just stop.
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const progress = Math.max(0, timeLeft / duration); // 1.0 -> 0.0
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const fmt = (n: number) => String(n).padStart(2, "0");

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(duration);
    };

    // Circular Progress Props
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative flex items-center justify-center">
                {/* Background Ring */}
                <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                    <circle
                        className="stroke-slate-200 dark:stroke-[#2f3336]"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <motion.circle
                        className="stroke-indigo-500 dark:stroke-[#1d9bf0]"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeDasharray={circumference + " " + circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 dark:text-[#e7e9ea]">
                    <div className="text-6xl font-mono font-bold tracking-widest tabular-nums">
                        {fmt(minutes)}:{fmt(seconds)}
                    </div>
                    <p className="text-sm text-slate-400 dark:text-[#71767b] mt-2 font-medium">
                        {isRunning ? "FOCUSING..." : "READY"}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={onExit}
                    className="p-4 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:bg-[#16181c] dark:text-[#71767b] dark:hover:bg-[#2f3336] dark:hover:text-[#e7e9ea] transition-all"
                    title="終了して戻る"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>

                <button
                    onClick={toggleTimer}
                    className="p-6 rounded-full bg-white text-indigo-600 shadow-xl border border-indigo-100 dark:bg-black dark:text-[#1d9bf0] dark:border-[#1d9bf0]/50 hover:scale-105 active:scale-95 transition-all"
                >
                    {isRunning ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={() => onComplete(duration - timeLeft)}
                    className="p-4 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-black dark:text-[#00ba7c] dark:border-[#003a27] hover:bg-emerald-500 hover:text-white dark:hover:bg-[#00ba7c] dark:hover:text-white transition-all"
                    title="タスク完了！"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </button>
            </div>

            <div className="text-center">
                <button
                    onClick={resetTimer}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                    タイマーをリセット
                </button>
            </div>
        </div>
    );
}
