"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CoachMessage } from "@/lib/coaching";

type Props = {
    advice: CoachMessage;
    className?: string;
};

export function CoachCard({ advice, className = "" }: Props) {
    // Typing effect state
    const [displayedMessage, setDisplayedMessage] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayedMessage("");
        setIsTyping(true);
        let index = 0;
        const msg = advice.message;

        const timer = setInterval(() => {
            if (index < msg.length) {
                setDisplayedMessage((prev) => prev + msg.charAt(index));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, 30); // Speed of typing

        return () => clearInterval(timer);
    }, [advice]);

    const getIcon = (type: CoachMessage["type"]) => {
        switch (type) {
            case "warning": return "⚠️";
            case "success": return "🎉";
            case "encouragement": return "☕";
            default: return "💡";
        }
    };

    const getColors = (type: CoachMessage["type"]) => {
        switch (type) {
            case "warning": return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-black dark:text-[#ffd400] dark:border-[#332600]";
            case "success": return "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-black dark:text-[#1d9bf0] dark:border-[#0a2949]";
            case "encouragement": return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-black dark:text-[#00ba7c] dark:border-[#052e1f]";
            default: return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-black dark:text-[#e7e9ea] dark:border-[#2f3336]";
        }
    };

    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm ${getColors(advice.type)} ${className}`}>
            <div className="flex-shrink-0 text-3xl bg-white dark:bg-[#16181c] p-2 rounded-full shadow-sm border border-black/5 dark:border-[#2f3336]">
                🤖
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold uppercase tracking-wider opacity-60">AI Coach</span>
                    <span className="text-xs">{getIcon(advice.type)}</span>
                </div>
                <h4 className="font-bold text-sm mb-1">{advice.title}</h4>
                <p className="text-sm leading-relaxed min-h-[1.5em] font-medium opacity-90">
                    {displayedMessage}
                    {isTyping && <span className="animate-pulse inline-block w-1.5 h-3 ml-0.5 bg-current align-middle" />}
                </p>
            </div>
        </div>
    );
}
