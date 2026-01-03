"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/reportUtils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={cn("flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200 dark:bg-black dark:border-[#2f3336]", className)}>
            <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                    "p-1.5 rounded transition-all",
                    theme === "light"
                        ? "bg-white text-yellow-500 shadow-sm dark:bg-[#16181c]"
                        : "text-slate-400 hover:text-slate-600 dark:text-[#71767b] dark:hover:text-[#e7e9ea]"
                )}
                title="Light Mode"
            >
                <SunIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                    "p-1.5 rounded transition-all",
                    theme === "dark"
                        ? "bg-white text-indigo-500 shadow-sm dark:bg-[#16181c] dark:text-[#1d9bf0]"
                        : "text-slate-400 hover:text-slate-600 dark:text-[#71767b] dark:hover:text-[#e7e9ea]"
                )}
                title="Dark Mode"
            >
                <MoonIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => setTheme("system")}
                className={cn(
                    "p-1.5 rounded transition-all",
                    theme === "system"
                        ? "bg-white text-slate-700 shadow-sm dark:bg-[#16181c] dark:text-[#e7e9ea]"
                        : "text-slate-400 hover:text-slate-600 dark:text-[#71767b] dark:hover:text-[#e7e9ea]"
                )}
                title="System Preference"
            >
                <ComputerDesktopIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
