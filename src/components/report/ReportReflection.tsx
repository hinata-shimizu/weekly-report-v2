import React from "react";
import { generateReflectionText, Task } from "@/lib/reportUtils";

type Props = {
    weeklyNote: string;
    setWeeklyNote: React.Dispatch<React.SetStateAction<string>>;
    noteSavedMessage: string;
    tasks: Task[];
    now: number;
};

const NOTE_TEMPLATE =
    "## 🎯 今週の目標・テーマ\n\n\n" +
    "## 🙌 KPT - Keep (良かったこと・続けたいこと)\n\n\n" +
    "## 💦 KPT - Problem (困ったこと・課題)\n\n\n" +
    "## 🚀 KPT - Try (次週やること・改善策)\n\n\n" +
    "## 📝 その他・フリーメモ\n";

export function ReportReflection({ weeklyNote, setWeeklyNote, noteSavedMessage, tasks, now }: Props) {

    const handleInsertTemplate = () => {
        const trimmed = weeklyNote.trim();
        if (trimmed === "") {
            setWeeklyNote(NOTE_TEMPLATE);
        } else {
            const sep = weeklyNote.endsWith("\n") ? "\n\n" : "\n\n\n";
            setWeeklyNote((prev) => prev + sep + NOTE_TEMPLATE);
        }
    };

    const handleAppendAutoReflection = () => {
        const snippet = generateReflectionText(tasks, now, 5);
        setWeeklyNote((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return snippet + "\n";
            const sep = prev.endsWith("\n") ? "\n\n" : "\n\n";
            return prev + sep + snippet + "\n";
        });
    };

    return (
        <section className="space-y-3 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">📝 週次ふりかえりメモ</h2>
                    <p className="text-xs text-slate-500">入力内容は自動保存されます。</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleInsertTemplate}
                        className="text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        テンプレ挿入
                    </button>
                    <button
                        type="button"
                        onClick={handleAppendAutoReflection}
                        disabled={tasks.length === 0}
                        className="text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        ✨ 自動生成を追記
                    </button>
                </div>
            </div>

            <div className="relative">
                <textarea
                    className="w-full min-h-[400px] rounded-xl border border-slate-300 bg-white dark:bg-black dark:border-[#2f3336] dark:text-[#e7e9ea] px-4 py-3 text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-y"
                    value={weeklyNote}
                    onChange={(e) => setWeeklyNote(e.target.value)}
                    placeholder="ここをクリックして、今週の振り返りやメモを自由に記述してください..."
                />
                <div className="absolute bottom-3 right-3">
                    {noteSavedMessage && (
                        <span className="text-xs font-medium text-emerald-600 bg-white/80 px-2 py-1 rounded shadow-sm">
                            {noteSavedMessage}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}
