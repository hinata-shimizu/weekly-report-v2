"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type TaskStatus = "not_decided" | "todo" | "doing" | "done";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  not_decided: "未決定",
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};

const STATUS_ORDER: TaskStatus[] = ["not_decided", "todo", "doing", "done"];

export default function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 週報IDごとに別々のキー
  const storageKey = `weekly-report-tasks-${String(params.id)}`;

  const [newTitle, setNewTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // ★ 初回＋「IDが変わったとき」に localStorage から読み込む
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      // このID用のデータがまだ無いときは、前のIDのタスクを引き継がずリセットする
      setTasks([]);
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed)) {
        setTasks(parsed);
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error("failed to parse tasks from localStorage", e);
      setTasks([]);
    }

    setLoaded(true);
  }, [storageKey]);

  // tasks が変わったら自動保存
  useEffect(() => {
    if (!loaded) return;
    if (typeof window === "undefined") return;

    window.localStorage.setItem(storageKey, JSON.stringify(tasks));

    if (tasks.length === 0) {
      setSavedMessage("");
      return;
    }
    setSavedMessage("自動保存しました");
    const timer = setTimeout(() => setSavedMessage(""), 1500);
    return () => clearTimeout(timer);
  }, [tasks, loaded, storageKey]);

  const handleAddTask = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      status: "todo", // 初期ステータス：未着手
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleChangeStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const countsByStatus: Record<TaskStatus, number> = {
    not_decided: tasks.filter((t) => t.status === "not_decided").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <main className="max-w-5xl mx-auto py-6 px-3 md:px-4 space-y-6">
      {/* ヘッダー */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <Link
            href="/reports"
            className="inline-flex items-center text-[11px] md:text-xs text-slate-600 hover:text-slate-900"
          >
            ← 週報一覧に戻る
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">
            週報ID: {params.id} のタスク管理
          </h1>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
            今週やることを箇条書きで洗い出して、ステータスを切り替えながら進捗を管理します。
            タスクは「週報IDごとに」ブラウザへ自動保存されます。
          </p>
          <p className="text-[10px] text-slate-400">
            storageKey: <code>{storageKey}</code>
          </p>
          {!loaded && (
            <p className="text-[11px] text-slate-500">読み込み中...</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex flex-wrap gap-1.5 text-[11px] md:text-xs">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1">
              合計:{" "}
              <span className="ml-1 font-semibold text-slate-800">
                {tasks.length}
              </span>
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1">
              完了:{" "}
              <span className="ml-1 font-semibold text-emerald-700">
                {countsByStatus.done}
              </span>
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1">
              進行中:{" "}
              <span className="ml-1 font-semibold text-blue-700">
                {countsByStatus.doing}
              </span>
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1">
              未着手:{" "}
              <span className="ml-1 font-semibold text-amber-700">
                {countsByStatus.todo}
              </span>
            </span>
          </div>
          {savedMessage && (
            <p className="text-[11px] text-emerald-600">{savedMessage}</p>
          )}
        </div>
      </header>

      {/* タスク追加 */}
      <section className="rounded-xl border bg-white/80 shadow-sm p-4 md:p-5 space-y-3">
        <h2 className="text-base md:text-lg font-semibold">タスクを追加</h2>
        <div className="flex flex-col md:flex-row gap-2.5">
          <input
            type="text"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
            placeholder="例）画面AのUI調整／バグ#123の原因調査／仕様書レビュー など"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleAddTask}
            className="w-full md:w-auto inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-medium border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 transition"
          >
            ＋ 追加
          </button>
        </div>
      </section>

      {/* タスク一覧 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base md:text-lg font-semibold">タスク一覧</h2>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-center space-y-1.5">
            <p className="text-sm text-slate-600">まだタスクがありません。</p>
            <p className="text-[11px] md:text-xs text-slate-500">
              上の入力欄から「今週やること」を1行ずつ追加してみてください。
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-white/90 shadow-sm max-h-[60vh] overflow-y-auto">
            <ul className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="px-3 md:px-4 py-2 md:py-2.5 flex items-start gap-2 md:gap-3"
                >
                  {/* 左：タスク名（少し大きめ） */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base text-slate-900 break-words">
                      {task.title}
                    </p>
                  </div>

                  {/* 右：ステータスボタン群＋削除 */}
                  <div className="flex flex-col items-end gap-1 min-w-[150px]">
                    <div className="flex flex-wrap justify-end gap-1">
                      {STATUS_ORDER.map((status) => {
                        const active = task.status === status;
                        const base =
                          "px-2 py-[2px] rounded-full text-[11px] border transition focus:outline-none whitespace-nowrap";
                        const activeStyleByStatus: Record<TaskStatus, string> = {
                          not_decided:
                            "bg-slate-800 border-slate-800 text-white",
                          todo: "bg-amber-500 border-amber-500 text-white",
                          doing: "bg-blue-600 border-blue-600 text-white",
                          done: "bg-emerald-600 border-emerald-600 text-white",
                        };
                        const inactiveStyleByStatus: Record<
                          TaskStatus,
                          string
                        > = {
                          not_decided:
                            "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100",
                          todo: "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100",
                          doing: "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100",
                          done: "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100",
                        };

                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() =>
                              handleChangeStatus(task.id, status)
                            }
                            className={
                              base +
                              " " +
                              (active
                                ? activeStyleByStatus[status]
                                : inactiveStyleByStatus[status])
                            }
                          >
                            {STATUS_LABEL[status]}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="text-[11px] text-red-500 hover:text-red-600 hover:underline"
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
