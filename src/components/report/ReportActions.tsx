import React, { useState } from "react";
import { generateCsvText, Task, generateSlackText, generateNotionText, Report } from "@/lib/reportUtils";

type Props = {
    id: string; // Report ID
    report: Report; // We need the full report object for smart copy
    tasks: Task[];
    now: number;
    weeklyNote: string;
    onRestore: (tasks: unknown[], note: string) => void;
    onDeleteAllTasks: () => void;
};

export function ReportActions({ id, report, tasks, now, weeklyNote, onRestore, onDeleteAllTasks }: Props) {
    const [csvCopied, setCsvCopied] = useState(false);
    const [backupJson, setBackupJson] = useState("");
    const [backupMsg, setBackupMsg] = useState("");
    const [copyStatus, setCopyStatus] = useState<"idle" | "slack" | "notion">("idle");

    const handleCopy = async (target: "slack" | "notion") => {
        const text = target === "slack"
            ? generateSlackText(report, tasks, weeklyNote)
            : generateNotionText(report, tasks, weeklyNote);

        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(target);
            setTimeout(() => setCopyStatus("idle"), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
            alert("コピーに失敗しました");
        }
    };

    // CSV
    const csvText = React.useMemo(() => generateCsvText(tasks, now), [tasks, now]);

    const handleCopyCsv = async () => {
        if (!csvText) return;
        try {
            await navigator.clipboard.writeText(csvText);
            setCsvCopied(true);
            setTimeout(() => setCsvCopied(false), 2000);
        } catch {
            alert("コピーに失敗しました");
        }
    };

    // Backup
    const handleExportBackup = async () => {
        const payload = {
            version: 1,
            reportId: id,
            exportedAt: new Date().toISOString(),
            tasks,
            weeklyNote
        };
        const text = JSON.stringify(payload, null, 2);
        setBackupJson(text);
        try {
            await navigator.clipboard.writeText(text);
            setBackupMsg("JSONを作成してコピーしました");
        } catch {
            setBackupMsg("JSONを作成しました（コピー失敗）");
        }
    };

    const handleImportBackup = () => {
        if (!backupJson.trim()) return;
        try {
            const parsed = JSON.parse(backupJson);
            if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("Invalid format");

            const ok = confirm("テキストエリアのJSON内容でタスクとメモを上書きして良いですか？");
            if (ok) {
                onRestore(parsed.tasks, parsed.weeklyNote || "");
                setBackupMsg("復元しました");
            }
        } catch {
            setBackupMsg("JSON形式が正しくありません");
        }
    };

    return (
        <section className="space-y-8 pt-8 mt-4 border-t border-slate-200 pb-20">
            {/* CSV Export */}
            <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2">
                    📋 CSVエクスポート
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-[#16181c] dark:text-[#71767b] px-2 py-0.5 rounded">コピペ用</span>
                </h2>
                <div className="flex gap-2">
                    <textarea
                        className="flex-1 h-24 text-[11px] font-mono border rounded-lg p-2 bg-slate-50 dark:bg-black dark:border-[#2f3336] text-slate-600 dark:text-[#71767b] focus:outline-none"
                        readOnly
                        value={csvText}
                        placeholder="タスクを追加するとCSVが生成されます"
                    />
                    <button
                        onClick={handleCopyCsv}
                        className="self-start px-4 py-2 bg-white dark:bg-black border border-slate-300 dark:border-[#2f3336] text-slate-700 dark:text-[#e7e9ea] text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-[#16181c] active:bg-slate-100 transition-colors"
                    >
                        {csvCopied ? "コピー済" : "コピー"}
                    </button>
                </div>
            </div>

            {/* Slack / Notion Copy and Delete All Tasks */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-slate-100 dark:border-[#2f3336] backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    {/* Slack Copy */}
                    <button
                        onClick={() => handleCopy("slack")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-[#2f3336] text-slate-600 dark:text-[#e7e9ea] text-sm font-bold hovering-scale shadow-sm hover:border-[#4A154B] hover:text-[#4A154B] transition-colors"
                    >
                        {copyStatus === "slack" ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                COPIED
                            </span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.52v-6.315zm8.853-8.887a2.528 2.528 0 0 1 2.521-2.521A2.528 2.528 0 0 1 20.208 6.278a2.528 2.528 0 0 1-2.52 2.52h-2.522V6.278zm-1.26 0a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.52-2.521V0a2.528 2.528 0 0 1 2.52 2.521v6.313zM6.313 6.313a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.52 0 2.528 2.528 0 0 1 2.52-2.52H6.313v2.52zm0 2.52h6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H6.313A2.528 2.528 0 0 1 3.792 11.374a2.528 2.528 0 0 1 2.521-2.541zM20.208 17.688a2.528 2.528 0 0 1-2.52 2.52h-6.313a2.528 2.528 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.521h6.313a2.528 2.528 0 0 1 2.52 2.521z" />
                                </svg>
                                Slack Copy
                            </>
                        )}
                    </button>

                    {/* Notion Copy */}
                    <button
                        onClick={() => handleCopy("notion")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-[#2f3336] text-slate-600 dark:text-[#e7e9ea] text-sm font-bold hovering-scale shadow-sm hover:border-slate-800 dark:hover:border-[#e7e9ea] hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                        {copyStatus === "notion" ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                COPIED
                            </span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.459 4.208c.746-3.167 3.226-4.208 7.426-4.208 4.2 0 6.679 1.041 7.426 4.208.157.665.23 1.636.23 2.929v10.709c0 3.385-1.936 6.154-7.656 6.154-5.721 0-7.656-2.769-7.656-6.154V7.137c0-1.293.073-2.264.23-2.929zm12.35 2.951c.148 0 .27-.119.27-.272a27.18 27.18 0 0 0-.175-3.074c-.234-2.029-2.03-2.7-4.998-2.7-2.969 0-4.764.671-4.998 2.7-.091.772-.15 1.794-.175 3.074a.273.273 0 0 0 .27.272h9.807z" />
                                </svg>
                                Notion Copy
                            </>
                        )}
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (confirm("全てのタスクを削除しますか？この操作は取り消せません。")) {
                                onDeleteAllTasks();
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors text-xs font-bold"
                    >
                        🗑️ 全タスク削除
                    </button>
                </div>
            </div>

            {/* Backup / Restore */}
            <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2">
                    📦 バックアップ / 復元
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#71767b]">
                    この週報データをJSONテキストとして保存・復元できます。
                </p>

                <div className="bg-slate-50 dark:bg-black p-3 rounded-xl border border-slate-200 dark:border-[#2f3336]">
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={handleExportBackup}
                            className="text-xs bg-slate-800 dark:bg-[#16181c] text-white dark:text-[#e7e9ea] px-3 py-1.5 rounded-md hover:bg-slate-700 dark:hover:bg-[#2f3336] border border-transparent dark:border-[#2f3336]"
                        >
                            バックアップ作成（コピー）
                        </button>
                        <button
                            onClick={handleImportBackup}
                            className="text-xs bg-white dark:bg-black border border-slate-300 dark:border-[#2f3336] text-slate-700 dark:text-[#e7e9ea] px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-[#16181c]"
                        >
                            JSONから復元（Import）
                        </button>
                        <span className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center">{backupMsg}</span>
                    </div>
                    <textarea
                        className="w-full h-24 text-[11px] font-mono border border-slate-200 dark:border-[#2f3336] bg-white dark:bg-black text-slate-700 dark:text-[#71767b] rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                        value={backupJson}
                        onChange={(e) => setBackupJson(e.target.value)}
                        placeholder="ここにJSONが表示されます。復元する場合は、保存しておいたJSONをここに貼り付けて「Import」を押してください。"
                    />
                </div>
            </div>
        </section>
    );
}
