import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STORAGE_KEY, TASKS_KEY_PREFIX, TAG_STORAGE_KEY } from "@/lib/reportUtils";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export function SettingsModal({ isOpen, onClose }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    // --- Export ---
    const handleExport = () => {
        if (typeof window === "undefined") return;

        const data: Record<string, any> = {};

        // Collect all relevant keys
        // 1. Report List
        const reportList = window.localStorage.getItem(STORAGE_KEY);
        if (reportList) data[STORAGE_KEY] = JSON.parse(reportList);

        // 2. Tags
        const tags = window.localStorage.getItem(TAG_STORAGE_KEY);
        if (tags) data[TAG_STORAGE_KEY] = JSON.parse(tags);

        // 3. Tasks & Notes for each report
        // We iterate through all keys to find matching prefixes
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && (key.startsWith(TASKS_KEY_PREFIX) || key.startsWith("weekly-report-note-"))) {
                const val = window.localStorage.getItem(key);
                if (val) {
                    try {
                        data[key] = JSON.parse(val);
                    } catch {
                        data[key] = val; // keep as string if not json
                    }
                }
            }
        }

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `weekly-report-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- Import ---
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("現在のデータはすべて上書きされます。よろしいですか？\n（事前のバックアップを推奨します）")) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setImporting(true);
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const text = ev.target?.result as string;
                const data = JSON.parse(text);

                if (typeof data !== "object" || data === null) {
                    throw new Error("Invalid JSON format");
                }

                // Clear and Restore
                // We only clear keys related to our app to avoid wiping other localhost stuff
                // But simplified approach: just overwrite keys present in backup. 
                // Ideally we should wipe our specific keys first to remove "deleted" reports.

                // 1. Wipe known prefixes
                const keysToRemove: string[] = [];
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    if (key && (
                        key === STORAGE_KEY ||
                        key === TAG_STORAGE_KEY ||
                        key.startsWith(TASKS_KEY_PREFIX) ||
                        key.startsWith("weekly-report-note-")
                    )) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(k => window.localStorage.removeItem(k));

                // 2. Restore
                Object.entries(data).forEach(([key, value]) => {
                    if (typeof value === "object") {
                        window.localStorage.setItem(key, JSON.stringify(value));
                    } else {
                        window.localStorage.setItem(key, String(value));
                    }
                });

                alert("データの復元が完了しました。ページをリロードします。");
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert("ファイルの読み込みに失敗しました。形式が正しいか確認してください。");
            } finally {
                setImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
                    >
                        <div className="bg-white dark:bg-black w-full max-w-md rounded-2xl shadow-xl border border-slate-100 dark:border-[#2f3336] pointer-events-auto overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-[#2f3336] flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-[#e7e9ea]">設定 / データ管理</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-[#16181c] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Backup Section */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-500 dark:text-[#71767b] uppercase tracking-wider mb-3">
                                        データのバックアップ
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleExport}
                                            className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#16181c] hover:bg-slate-100 dark:hover:bg-[#1d1f23] rounded-xl group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 dark:bg-[#1d9bf0]/20 text-indigo-600 dark:text-[#1d9bf0] rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-slate-700 dark:text-[#e7e9ea]">データを書き出す</div>
                                                    <div className="text-xs text-slate-500 dark:text-[#71767b]">JSONファイルとして保存します</div>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-300 dark:text-[#71767b] group-hover:text-indigo-500 dark:group-hover:text-[#1d9bf0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={handleImportClick}
                                            disabled={importing}
                                            className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#16181c] hover:bg-slate-100 dark:hover:bg-[#1d1f23] rounded-xl group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 dark:bg-[#00ba7c]/20 text-emerald-600 dark:text-[#00ba7c] rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-slate-700 dark:text-[#e7e9ea]">データを読み込む</div>
                                                    <div className="text-xs text-slate-500 dark:text-[#71767b]">JSONファイルから復元します</div>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-300 dark:text-[#71767b] group-hover:text-emerald-500 dark:group-hover:text-[#00ba7c] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".json"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#16181c] border border-slate-100 dark:border-[#2f3336]">
                                    <p className="text-xs text-slate-500 dark:text-[#71767b] leading-relaxed">
                                        ※ データはブラウザ内（LocalStorage）に保存されています。
                                        定期的に書き出しを行うことで、PCの故障や誤操作によるデータ消失を防ぐことができます。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
