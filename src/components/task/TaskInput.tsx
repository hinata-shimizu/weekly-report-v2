import React, { useState } from "react";

type Props = {
    onAdd: (title: string) => void;
};

export function TaskInput({ onAdd }: Props) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setTitle("");
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white dark:bg-black dark:border-[#2f3336] shadow-sm p-4 md:p-5 hover:border-slate-300 dark:hover:border-[#536471] transition-colors">
            <div className="flex flex-col gap-2 mb-3">
                <h2 className="text-base font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2">
                    ✏️ 新しいタスクを追加
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    className="flex-1 rounded-lg border border-slate-300 dark:border-[#2f3336] dark:bg-black dark:text-[#e7e9ea] px-4 py-2.5 text-sm placeholder:text-slate-400 dark:placeholder:text-[#71767b] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="例：Reactの公式ドキュメントを読む、A社の資料作成..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full md:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                    <span>＋</span> 追加
                </button>
            </form>
        </section>
    );
}
