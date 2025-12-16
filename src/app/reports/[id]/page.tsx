"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type TaskStatus = "not_decided" | "todo" | "doing" | "done";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  estimatedMinutes: number | null; // 見積もり（分）
  actualSeconds: number; // 実績の累計秒
  isRunning: boolean; // タイマー動作中か
  startedAt: number | null; // タイマー開始時刻（Date.now()）
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  not_decided: "未決定",
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};

const STATUS_ORDER: TaskStatus[] = ["not_decided", "todo", "doing", "done"];

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id);

  const storageKey = `weekly-report-tasks-${id}`;
  const noteStorageKey = `weekly-report-note-${id}`;

  const [newTitle, setNewTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [now, setNow] = useState<number>(Date.now());

  const [weeklyNote, setWeeklyNote] = useState("");
  const [noteSavedMessage, setNoteSavedMessage] = useState("");
  const [csvCopiedMessage, setCsvCopiedMessage] = useState("");

  // 完了タスク表示 ON/OFF
  const [showCompleted, setShowCompleted] = useState(true);

  // 初回＋ID変化時に localStorage から読み込み
  useEffect(() => {
    if (typeof window === "undefined") return;

    // タスク読み込み
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      setTasks([]);
    } else {
      try {
        const parsed = JSON.parse(raw) as any[];
        if (Array.isArray(parsed)) {
          const normalized: Task[] = parsed.map((t) => ({
            id: t.id ?? crypto.randomUUID(),
            title: t.title ?? "",
            status: (STATUS_ORDER as string[]).includes(t.status)
              ? (t.status as TaskStatus)
              : "todo",
            estimatedMinutes:
              typeof t.estimatedMinutes === "number" ? t.estimatedMinutes : null,
            actualSeconds:
              typeof t.actualSeconds === "number" ? t.actualSeconds : 0,
            isRunning: !!t.isRunning,
            startedAt: typeof t.startedAt === "number" ? t.startedAt : null,
          }));
          setTasks(normalized);
        } else {
          setTasks([]);
        }
      } catch (e) {
        console.error("failed to parse tasks from localStorage", e);
        setTasks([]);
      }
    }

    // メモ読み込み
    const noteRaw = window.localStorage.getItem(noteStorageKey);
    if (typeof noteRaw === "string") {
      setWeeklyNote(noteRaw);
    } else {
      setWeeklyNote("");
    }

    setLoaded(true);
  }, [storageKey, noteStorageKey]);

  // どれかのタスクが動いている時だけ1秒ごとに now を更新
  useEffect(() => {
    const hasRunning = tasks.some((t) => t.isRunning);
    if (!hasRunning) return;

    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, [tasks]);

  // tasks が変わるたびに自動保存
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

  // 週次メモの自動保存
  useEffect(() => {
    if (!loaded) return;
    if (typeof window === "undefined") return;

    window.localStorage.setItem(noteStorageKey, weeklyNote);

    if (weeklyNote.trim() === "") {
      setNoteSavedMessage("");
      return;
    }
    setNoteSavedMessage("メモを保存しました");
    const timer = setTimeout(() => setNoteSavedMessage(""), 1500);
    return () => clearTimeout(timer);
  }, [weeklyNote, loaded, noteStorageKey]);

  const handleAddTask = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      status: "todo",
      estimatedMinutes: null,
      actualSeconds: 0,
      isRunning: false,
      startedAt: null,
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

  const handleChangeStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleChangeEstimated = (taskId: string, value: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        if (value === "") {
          return { ...task, estimatedMinutes: null };
        }
        const num = Number(value);
        if (Number.isNaN(num) || num < 0) {
          return task;
        }
        return { ...task, estimatedMinutes: Math.floor(num) };
      })
    );
  };

  // タイマー開始
  const handleStartTimer = (taskId: string) => {
    const nowTs = Date.now();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isRunning: true,
              startedAt: task.startedAt ?? nowTs,
              status: task.status === "done" ? task.status : "doing",
            }
          : task
      )
    );
  };

  // タイマー停止
  const handleStopTimer = (taskId: string) => {
    const nowTs = Date.now();
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        if (!task.isRunning || !task.startedAt) {
          return { ...task, isRunning: false, startedAt: null };
        }
        const diffSeconds = Math.max(
          0,
          Math.floor((nowTs - task.startedAt) / 1000)
        );
        return {
          ...task,
          isRunning: false,
          startedAt: null,
          actualSeconds: task.actualSeconds + diffSeconds,
        };
      })
    );
  };

  const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
  };

  const formatHMFromSeconds = (totalSeconds: number): string => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  const countsByStatus: Record<TaskStatus, number> = {
    not_decided: tasks.filter((t) => t.status === "not_decided").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  // 週全体サマリー計算
  const summary = React.useMemo(() => {
    let totalEstimatedMinutes = 0;
    let estimatedTaskCount = 0;
    let totalActualSeconds = 0;
    let totalDiffMinutes = 0;
    let diffCount = 0;

    for (const task of tasks) {
      const runningExtra =
        task.isRunning && task.startedAt
          ? Math.max(0, Math.floor((now - task.startedAt) / 1000))
          : 0;
      const totalSeconds = task.actualSeconds + runningExtra;
      totalActualSeconds += totalSeconds;

      if (task.estimatedMinutes != null) {
        totalEstimatedMinutes += task.estimatedMinutes;
        estimatedTaskCount += 1;

        const minutes = Math.floor(totalSeconds / 60);
        const diff = minutes - task.estimatedMinutes;
        totalDiffMinutes += diff;
        diffCount += 1;
      }
    }

    const totalActualMinutes = Math.floor(totalActualSeconds / 60);
    const totalActualHours = Math.floor(totalActualMinutes / 60);
    const remainingMinutes = totalActualMinutes % 60;

    const avgDiffMinutes =
      diffCount > 0 ? totalDiffMinutes / diffCount : null;

    return {
      totalEstimatedMinutes,
      estimatedTaskCount,
      totalActualSeconds,
      totalActualMinutes,
      totalActualHours,
      remainingMinutes,
      avgDiffMinutes,
    };
  }, [tasks, now]);

  const formatAvgDiff = (
    avg: number | null
  ): { label: string; color: string } => {
    if (avg === null) {
      return { label: "—", color: "text-slate-500" };
    }
    const rounded = Math.round(avg * 10) / 10; // 小数1桁
    if (rounded === 0) {
      return { label: "±0分", color: "text-slate-700" };
    }
    if (rounded > 0) {
      return { label: `+${rounded}分（見積もりより遅い）`, color: "text-red-600" };
    }
    return { label: `${rounded}分（見積もりより早い）`, color: "text-emerald-600" };
  };

  const avgDiff = formatAvgDiff(summary.avgDiffMinutes ?? null);

  // ステータスごとの集計
  const statusSummary = React.useMemo(() => {
    const base: Record<
      TaskStatus,
      {
        count: number;
        totalSeconds: number;
      }
    > = {
      not_decided: { count: 0, totalSeconds: 0 },
      todo: { count: 0, totalSeconds: 0 },
      doing: { count: 0, totalSeconds: 0 },
      done: { count: 0, totalSeconds: 0 },
    };

    for (const task of tasks) {
      const runningExtra =
        task.isRunning && task.startedAt
          ? Math.max(0, Math.floor((now - task.startedAt) / 1000))
          : 0;
      const totalSeconds = task.actualSeconds + runningExtra;

      base[task.status].count += 1;
      base[task.status].totalSeconds += totalSeconds;
    }

    return base;
  }, [tasks, now]);

  // CSV用テキスト生成
  const csvText = React.useMemo(() => {
    if (tasks.length === 0) return "";

    const escapeCsv = (value: string): string => {
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const header =
      "タスク名,ステータス,見積もり(分),実績(分),差分(分)";

    const lines = tasks.map((task) => {
      const runningExtra =
        task.isRunning && task.startedAt
          ? Math.max(0, Math.floor((now - task.startedAt) / 1000))
          : 0;
      const totalSeconds = task.actualSeconds + runningExtra;

      const actualMinutes = Math.floor(totalSeconds / 60);
      const est = task.estimatedMinutes;

      let diffStr = "";
      if (est != null) {
        const diff = actualMinutes - est;
        if (diff > 0) {
          diffStr = `+${diff}`;
        } else if (diff === 0) {
          diffStr = "0";
        } else {
          diffStr = `${diff}`;
        }
      }

      const title = escapeCsv(task.title);
      const statusLabel = STATUS_LABEL[task.status];
      const estStr = est != null ? String(est) : "";
      const actualStr = String(actualMinutes);

      return [title, statusLabel, estStr, actualStr, diffStr].join(",");
    });

    return [header, ...lines].join("\n");
  }, [tasks, now]);

  const handleCopyCsv = async () => {
    if (!csvText.trim()) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(csvText);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = csvText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCsvCopiedMessage("CSV形式のテキストをコピーしました");
    } catch (e) {
      console.error("failed to copy csv", e);
      setCsvCopiedMessage("コピーに失敗しました…");
    }
    setTimeout(() => setCsvCopiedMessage(""), 2000);
  };

  // 表示順：未完了タスク → 完了タスク（下に寄せる）
  const sortedTasks = React.useMemo(() => {
    const notDone = tasks.filter((t) => t.status !== "done");
    const done = tasks.filter((t) => t.status === "done");
    return [...notDone, ...done];
  }, [tasks]);

  // 完了タスクの表示／非表示
  const visibleTasks = React.useMemo(
    () =>
      sortedTasks.filter(
        (t) => showCompleted || t.status !== "done"
      ),
    [sortedTasks, showCompleted]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl py-6 px-4 md:px-8 space-y-6">
        {/* ヘッダー */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <Link
              href="/reports"
              className="inline-flex items-center text-[11px] md:text-xs text-slate-600 hover:text-slate-900"
            >
              ← 週報一覧に戻る
            </Link>
            <h1 className="text-xl md:text-3xl font-bold">
              週報タスク管理（ID: {id}）
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-3xl">
              今週やることを箇条書きで洗い出して、ステータス・見積もり時間・実績時間を管理します。
              タスクとメモは「週報IDごとに」ブラウザへ自動保存されます。
            </p>
            {!loaded && (
              <p className="text-[11px] text-slate-500">読み込み中...</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
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
        <section className="rounded-xl border bg-white shadow-sm p-4 md:p-5 space-y-3">
          <h2 className="text-base md:text-lg font-semibold">タスクを追加</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              placeholder="タスク内容を入力"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="w-full md:w-auto inline-flex justify-center items-center rounded-lg px-5 py-2.5 text-sm font-medium border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              ＋ 追加
            </button>
          </div>
        </section>

        {/* タスク一覧 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base md:text-lg font-semibold">タスク一覧</h2>

            {/* 完了タスク表示切り替え */}
            {tasks.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCompleted((prev) => !prev)}
                className="inline-flex items-center rounded-full border border-slate-400 px-3 py-1 text-[11px] md:text-xs text-slate-700 hover:bg-slate-100"
              >
                {showCompleted ? "完了タスクを隠す" : "完了タスクを表示"}
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center space-y-2">
              <p className="text-sm text-slate-600">まだタスクがありません。</p>
              <p className="text-[11px] md:text-xs text-slate-500">
                上の入力欄から「今週やること」を1行ずつ追加してみてください。
              </p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="rounded-xl border bg-white p-4 text-center space-y-1">
              <p className="text-sm text-slate-600">
                表示中のタスクはありません。
              </p>
              <p className="text-[11px] md:text-xs text-slate-500">
                完了タスクを非表示にしている場合は、右上のボタンから表示に切り替えられます。
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {visibleTasks.map((task) => {
                const runningExtra =
                  task.isRunning && task.startedAt
                    ? Math.max(0, Math.floor((now - task.startedAt) / 1000))
                    : 0;
                const totalSeconds = task.actualSeconds + runningExtra;

                const est = task.estimatedMinutes;
                const totalMinutes = Math.floor(totalSeconds / 60);
                let diffLabel = "";
                let diffClass = "text-slate-700";
                if (est != null) {
                  const diff = totalMinutes - est;
                  if (diff === 0) {
                    diffLabel = "±0分";
                  } else if (diff > 0) {
                    diffLabel = `+${diff}分`;
                    diffClass = "text-red-600";
                  } else {
                    diffLabel = `${diff}分`;
                    diffClass = "text-emerald-600";
                  }
                }

                const isHighlighted = task.isRunning;

                const baseItemClass =
                  "rounded-xl border bg-white shadow-sm px-3 md:px-4 py-2 md:py-2.5 flex flex-col gap-2";
                const highlightClass = isHighlighted
                  ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/80"
                  : "";

                return (
                  <li
                    key={task.id}
                    className={`${baseItemClass} ${highlightClass}`}
                  >
                    {/* 1行目：タイトル＋ステータス＋「実行中」バッジ */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm md:text-base text-slate-900 break-words">
                          {task.title}
                        </p>
                        {isHighlighted && (
                          <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-[2px] text-[11px] font-medium text-white">
                            ▶ 実行中のタスク
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 min-w-[190px]">
                        <div className="flex flex-wrap justify-end gap-1">
                          {STATUS_ORDER.map((status) => {
                            const active = task.status === status;
                            const base =
                              "px-2 py-[2px] rounded-full text-[11px] border transition focus:outline-none whitespace-nowrap";
                            const activeStyleByStatus: Record<
                              TaskStatus,
                              string
                            > = {
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
                      </div>
                    </div>

                    {/* 2行目：時間まわり */}
                    {isHighlighted ? (
                      // 実行中タスク：大きめパネル
                      <div className="rounded-lg bg-slate-50 px-3 py-2.5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        {/* 左：見積もり */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-sm text-slate-600">
                            見積もり
                          </span>
                          <input
                            type="number"
                            min={0}
                            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm md:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            value={est ?? ""}
                            onChange={(e) =>
                              handleChangeEstimated(task.id, e.target.value)
                            }
                          />
                          <span className="text-xs md:text-sm text-slate-600">
                            分
                          </span>
                        </div>

                        {/* 中央：実績時間（大きく） */}
                        <div className="flex flex-col items-start md:items-center gap-0.5">
                          <span className="text-xs md:text-sm text-slate-600">
                            実績
                          </span>
                          <span className="text-base md:text-xl font-semibold text-slate-900">
                            {formatDuration(totalSeconds)}
                          </span>
                        </div>

                        {/* 右：差分＋タイマーボタン */}
                        <div className="flex flex-col items-end gap-1.5">
                          {est != null && (
                            <div className="text-xs md:text-sm">
                              <span className="text-slate-500 mr-1">
                                差分
                              </span>
                              <span className={`font-semibold ${diffClass}`}>
                                {diffLabel}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStopTimer(task.id)}
                              className="px-3 py-1.5 rounded-md border border-red-500 text-xs md:text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              ⏹ 停止
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(task.id)}
                              className="text-xs md:text-sm text-red-500 hover:text-red-600 hover:underline"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 非実行中タスク：コンパクト表示
                      <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>見積もり</span>
                          <input
                            type="number"
                            min={0}
                            className="w-16 rounded-md border border-slate-300 px-1.5 py-[2px] text-[11px] md:text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                            value={est ?? ""}
                            onChange={(e) =>
                              handleChangeEstimated(task.id, e.target.value)
                            }
                          />
                          <span>分</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span>実績</span>
                          <span className="font-medium text-slate-800 text-[11px] md:text-xs">
                            {formatDuration(totalSeconds)}
                          </span>
                        </div>

                        {est != null && (
                          <div className="flex items-center gap-1.5">
                            <span>差分</span>
                            <span className={`font-medium ${diffClass}`}>
                              {diffLabel}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleStartTimer(task.id)}
                            className="px-2 py-[2px] rounded-md border border-slate-700 text-[10px] md:text-xs font-medium text-slate-800 hover:bg-slate-100"
                          >
                            ▶ 開始
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(task.id)}
                            className="text-[10px] md:text-xs text-red-500 hover:text-red-600 hover:underline"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 週全体のサマリー ＋ ステータス別集計 */}
        <section className="space-y-3 pt-2 border-t border-slate-200">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">
            週全体のサマリー
          </h2>

          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-[11px] md:text-xs text-slate-500">
              タスクを追加すると、この週の合計時間や見積もり精度のサマリーが表示されます。
            </div>
          ) : (
            <>
              {/* 上段：全体サマリー3カード */}
              <div className="grid gap-3 md:grid-cols-3">
                {/* 合計実績時間 */}
                <div className="rounded-lg border bg-white px-4 py-3 flex flex-col justify-between">
                  <p className="text-[11px] md:text-xs text-slate-500">
                    合計実績時間
                  </p>
                  <p className="mt-1 text-base md:text-xl font-semibold text-slate-900">
                    {summary.totalActualHours}時間{summary.remainingMinutes}分
                  </p>
                  <p className="mt-1 text-[10px] md:text-[11px] text-slate-500">
                    （全タスクの実績時間の合計）
                  </p>
                </div>

                {/* 合計見積もり時間 */}
                <div className="rounded-lg border bg-white px-4 py-3 flex flex-col justify-between">
                  <p className="text-[11px] md:text-xs text-slate-500">
                    合計見積もり時間
                  </p>
                  <p className="mt-1 text-base md:text-xl font-semibold text-slate-900">
                    {summary.totalEstimatedMinutes}分
                  </p>
                  <p className="mt-1 text-[10px] md:text-[11px] text-slate-500">
                    見積もり入力済みタスク:{" "}
                    <span className="font-medium">
                      {summary.estimatedTaskCount}件
                    </span>
                  </p>
                </div>

                {/* 平均見積もり誤差 */}
                <div className="rounded-lg border bg白 px-4 py-3 flex flex-col justify-between">
                  <p className="text-[11px] md:text-xs text-slate-500">
                    平均見積もり誤差
                  </p>
                  <p
                    className={`mt-1 text-sm md:text-lg font-semibold ${avgDiff.color}`}
                  >
                    {avgDiff.label}
                  </p>
                  <p className="mt-1 text-[10px] md:text-[11px] text-slate-500">
                    （実績 − 見積もりの平均値。プラスは見積もりより時間がかかっている状態です）
                  </p>
                </div>
              </div>

              {/* 下段：ステータスごとの集計 */}
              <div className="rounded-lg border bg-white px-4 py-3 space-y-2">
                <p className="text-[11px] md:text-xs font-semibold text-slate-700">
                  ステータスごとの集計
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-[11px] md:text-xs text-left text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-1.5 pr-4 font-medium">ステータス</th>
                        <th className="py-1.5 pr-4 font-medium">タスク数</th>
                        <th className="py-1.5 pr-4 font-medium">合計実績時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STATUS_ORDER.map((status) => {
                        const s = statusSummary[status];
                        return (
                          <tr
                            key={status}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="py-1.5 pr-4">
                              {STATUS_LABEL[status]}
                            </td>
                            <td className="py-1.5 pr-4">{s.count}件</td>
                            <td className="py-1.5 pr-4">
                              {s.count === 0
                                ? "—"
                                : formatHMFromSeconds(s.totalSeconds)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px] md:text-[11px] text-slate-500">
                  実績時間には、現在タイマーが動いているタスクの経過時間も含まれます。
                </p>
              </div>
            </>
          )}
        </section>

        {/* CSVエクスポート（コピペ用） */}
        <section className="space-y-2 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm md:text-base font-semibold text-slate-800">
              CSV形式でエクスポート（コピペ用）
            </h2>
            {tasks.length > 0 && (
              <button
                type="button"
                onClick={handleCopyCsv}
                className="inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-800 hover:bg-slate-100"
              >
                コピー
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-[11px] md:text-xs text-slate-500">
              タスクを追加すると、この週の内容をCSV形式で出力できます。
            </div>
          ) : (
            <div className="rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4 space-y-2">
              <p className="text-[11px] md:text-xs text-slate-500">
                下のテキストをコピーして、Excel / Googleスプレッドシート / 会社の週報フォーマットなどに貼り付けて使えます。
              </p>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-[11px] md:text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-vertical"
                value={csvText}
                readOnly
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] md:text-[11px] text-slate-500">
                  列: タスク名 / ステータス / 見積もり(分) / 実績(分) / 差分(分)
                </p>
                {csvCopiedMessage && (
                  <p className="text-[10px] md:text-[11px] text-emerald-600">
                    {csvCopiedMessage}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 週次ふりかえりメモ */}
        <section className="space-y-2 pt-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">
            週次ふりかえりメモ
          </h2>
          <p className="text-[11px] md:text-xs text-slate-500">
            今週の振り返りや来週に向けたメモを書いておくスペースです。
          </p>

          <div className="rounded-lg border bg-white px-3 py-3 md:px-4 md:py-4 space-y-2">
            <textarea
              className="w-full min-h-[120px] rounded-md border border-slate-300 px-3 py-2 text-sm md:text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 resize-vertical"
              value={weeklyNote}
              onChange={(e) => setWeeklyNote(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] md:text-[11px] text-slate-500">
                入力内容は自動で保存されます（ブラウザごと／週報IDごと）。
              </p>
              {noteSavedMessage && (
                <p className="text-[10px] md:text-[11px] text-emerald-600">
                  {noteSavedMessage}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
