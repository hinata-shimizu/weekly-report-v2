import Link from "next/link";
import React from "react";
import { UserLevelCard } from "@/components/gamification/UserLevelCard";
import { LevelInfo } from "@/lib/gamification";
import { CoachCard } from "@/components/coaching/CoachCard";
import { CoachMessage } from "@/lib/coaching";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsModal } from "@/components/SettingsModal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { pushToCloud, pullFromCloud } from "@/lib/sync";

type Props = {
    reportCount: number;
    loading: boolean;
    levelInfo?: LevelInfo;
    advice?: CoachMessage;
    onAddReport: () => void;
};

export function ReportsHeader({ reportCount, loading, levelInfo, advice, onAddReport }: Props) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-2">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                            週報一覧
                        </h1>
                        <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
                            週ごとのタスクや振り返りをまとめたページです。<br className="hidden md:block" />
                            各行をクリックすると詳細に移動します。
                        </p>
                        {!loading && (
                            <p className="text-xs text-slate-400 pt-1">
                                現在のレポート数: <span className="font-medium text-slate-600">{reportCount}件</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                    {levelInfo && <UserLevelCard levelInfo={levelInfo} />}

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/tags"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-black px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-[#2f3336] dark:text-[#e7e9ea] dark:hover:bg-[#16181c] dark:hover:text-white"
                        >
                            <span className="text-base">🏷️</span>
                            タグ管理
                        </Link>

                        {/* Sync Buttons (Visible only when logged in) */}
                        {user && (
                            <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-1 mr-2">
                                <button
                                    onClick={async () => {
                                        if (!confirm("クラウドからデータを読み込みますか？\n（現在のローカルデータは上書きされます）")) return;
                                        setSyncing(true);
                                        try {
                                            await pullFromCloud();
                                            window.location.reload();
                                        } catch (e: any) {
                                            alert("エラー: " + e.message);
                                        } finally {
                                            setSyncing(false);
                                        }
                                    }}
                                    disabled={syncing}
                                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-indigo-900/50 rounded-md transition-all text-xs font-bold flex items-center gap-1"
                                    title="クラウドから読み込み"
                                >
                                    ⬇️ <span className="hidden md:inline">受信</span>
                                </button>
                                <div className="w-px h-4 bg-indigo-200 dark:bg-indigo-800"></div>
                                <button
                                    onClick={async () => {
                                        if (!confirm("クラウドに現在のデータを保存しますか？")) return;
                                        setSyncing(true);
                                        try {
                                            await pushToCloud();
                                            alert("保存しました！");
                                        } catch (e: any) {
                                            alert("エラー: " + e.message);
                                        } finally {
                                            setSyncing(false);
                                        }
                                    }}
                                    disabled={syncing}
                                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-indigo-900/50 rounded-md transition-all text-xs font-bold flex items-center gap-1"
                                    title="クラウドへ保存"
                                >
                                    ☁️ <span className="hidden md:inline">保存</span>
                                </button>
                            </div>
                        )}

                        {/* Settings Button */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 text-slate-400 dark:text-[#71767b] hover:text-slate-600 dark:hover:text-[#e7e9ea] hover:bg-slate-100 dark:hover:bg-[#1d9bf0]/10 rounded-full transition-colors"
                            title="設定・データ管理"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={onAddReport}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95"
                        >
                            <span>＋</span>
                            新しい週を追加
                        </button>

                        {user ? (
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    setUser(null);
                                }}
                                className="p-2.5 text-slate-400 dark:text-[#71767b] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
                                title="ログアウト"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-[#e7e9ea] text-white dark:text-black text-xs font-bold rounded-full shadow hover:opacity-90 transition-all"
                            >
                                <span>☁️</span> ログイン
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}
