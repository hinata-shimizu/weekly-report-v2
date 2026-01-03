"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4 backdrop-blur-sm bg-black/50 dark:bg-black/80 transition-all">
            <Command className="w-full max-w-lg rounded-xl overflow-hidden border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-slate-100 dark:border-[#2f3336] px-3">
                    <svg className="w-5 h-5 text-slate-400 dark:text-[#71767b] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Command.Input
                        placeholder="コマンドを入力..."
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                        autoFocus
                    />
                    <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 dark:bg-[#16181c] dark:border-[#2f3336] dark:text-[#71767b]">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollBar-thin">
                    <Command.Empty className="py-6 text-center text-sm text-slate-500 dark:text-[#71767b]">
                        結果が見つかりません
                    </Command.Empty>

                    <Command.Group heading="ナビゲーション" className="text-xs font-medium text-slate-500 dark:text-[#71767b] px-2 py-1.5 mb-1">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/reports"))}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-[#e7e9ea] aria-selected:bg-indigo-50 dark:aria-selected:bg-[#1d9bf0]/10 aria-selected:text-indigo-600 dark:aria-selected:text-[#1d9bf0] cursor-pointer"
                        >
                            <span className="text-lg">📄</span> 週報一覧へ
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/tags"))}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-[#e7e9ea] aria-selected:bg-indigo-50 dark:aria-selected:bg-[#1d9bf0]/10 aria-selected:text-indigo-600 dark:aria-selected:text-[#1d9bf0] cursor-pointer"
                        >
                            <span className="text-lg">🏷️</span> タグ管理へ
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/focus"))}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-[#e7e9ea] aria-selected:bg-indigo-50 dark:aria-selected:bg-[#1d9bf0]/10 aria-selected:text-indigo-600 dark:aria-selected:text-[#1d9bf0] cursor-pointer"
                        >
                            <span className="text-lg">🧘</span> フォーカスモード
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="my-1 h-px bg-slate-100 dark:bg-[#2f3336]" />

                    <Command.Group heading="アクション" className="text-xs font-medium text-slate-500 dark:text-[#71767b] px-2 py-1.5 mb-1">
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-[#e7e9ea] aria-selected:bg-indigo-50 dark:aria-selected:bg-[#1d9bf0]/10 aria-selected:text-indigo-600 dark:aria-selected:text-[#1d9bf0] cursor-pointer"
                        >
                            <span className="text-lg">{theme === "dark" ? "☀️" : "🌙"}</span> テーマを切り替え
                        </Command.Item>
                        {/* Using a custom event or router query to trigger backup modal would be better, but for now just navigation */}
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}
