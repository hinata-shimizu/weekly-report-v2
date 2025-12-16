"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: string;
  title: string;       // 「M/D～M/Dの週報」
  description: string; // 説明
  createdAt: string;   // ISO文字列
  weekStart: string;   // その週の開始日（ISO）
  weekEnd: string;     // その週の終了日（ISO）
};

const STORAGE_KEY = "weekly-report-list";

/** 週の開始・終了（ここでは「月曜はじまり、日曜おわり」にしています） */
function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay(); // 0:日, 1:月, ... 6:土
  const diffFromMonday = (day + 6) % 7; // 月曜を0にする調整
  const start = new Date(d);
  start.setDate(d.getDate() - diffFromMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/** タイトル用：「M/D～M/Dの週報」 */
function formatWeekRangeTitle(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    return "週報";
  }
  const sStr = s.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });
  const eStr = e.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });
  return `${sStr}～${eStr}の週報`;
}

/** 作成日の表示用（例: 2025/12/13） */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** 一覧を「新しい順」に並べ替える（createdAt → id の順） */
function sortReportsDesc(reports: Report[]): Report[] {
  return [...reports].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) {
      return tb - ta; // 新しいcreatedAtが上
    }
    const na = Number(a.id);
    const nb = Number(b.id);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return nb - na;
    }
    return 0;
  });
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 初回読み込み時：localStorage から一覧を読む
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      // 初期サンプル（全部「今週」の週報として扱う）
      const now = new Date();
      const { start, end } = getWeekRange(now);
      const weekStartIso = start.toISOString();
      const weekEndIso = end.toISOString();
      const title = formatWeekRangeTitle(weekStartIso, weekEndIso);
      const createdAt = now.toISOString();

      const initial: Report[] = [
        {
          id: "1",
          title,
          description: "この週に取り組んだタスクや学びを整理します。（サンプル）",
          createdAt,
          weekStart: weekStartIso,
          weekEnd: weekEndIso,
        },
        {
          id: "2",
          title,
          description: "引き続き、今週のアウトプットを記録します。（サンプル）",
          createdAt,
          weekStart: weekStartIso,
          weekEnd: weekEndIso,
        },
        {
          id: "3",
          title,
          description: "より具体的な成果や反省点を書き出してみましょう。（サンプル）",
          createdAt,
          weekStart: weekStartIso,
          weekEnd: weekEndIso,
        },
      ];
      setReports(sortReportsDesc(initial));
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as any[];
      if (Array.isArray(parsed)) {
        const normalized: Report[] = parsed.map((r, index) => {
          const id = String(r.id ?? index + 1);

          const createdAt =
            typeof r.createdAt === "string" && r.createdAt
              ? r.createdAt
              : new Date().toISOString();
          const createdDate = new Date(createdAt);
          const baseDate = Number.isNaN(createdDate.getTime())
            ? new Date()
            : createdDate;

          let weekStartIso: string;
          let weekEndIso: string;

          if (typeof r.weekStart === "string" && typeof r.weekEnd === "string") {
            weekStartIso = r.weekStart;
            weekEndIso = r.weekEnd;
          } else {
            const { start, end } = getWeekRange(baseDate);
            weekStartIso = start.toISOString();
            weekEndIso = end.toISOString();
          }

          const title = formatWeekRangeTitle(weekStartIso, weekEndIso);

          const description =
            typeof r.description === "string" && r.description.trim() !== ""
              ? r.description
              : "この週のタスクや振り返りを記録します。";

          return {
            id,
            title,
            description,
            createdAt,
            weekStart: weekStartIso,
            weekEnd: weekEndIso,
          };
        });

        setReports(sortReportsDesc(normalized));
      } else {
        setReports([]);
      }
    } catch (e) {
      console.error("failed to parse reports from localStorage", e);
      setReports([]);
    }

    setLoaded(true);
  }, []);

  // 一覧が変わるたびに保存
  useEffect(() => {
    if (!loaded) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports, loaded]);

  // 新しい週を追加
  const handleAddReport = () => {
    setReports((prev) => {
      const numericIds = prev
        .map((r) => Number(r.id))
        .filter((n) => !Number.isNaN(n));
      const nextIdNum =
        numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      const nextId = String(nextIdNum);

      const now = new Date();
      const { start, end } = getWeekRange(now);
      const weekStartIso = start.toISOString();
      const weekEndIso = end.toISOString();

      const newReport: Report = {
        id: nextId,
        title: formatWeekRangeTitle(weekStartIso, weekEndIso),
        description: "新しく作成した週のタスクや振り返りを記録できます。",
        createdAt: now.toISOString(),
        weekStart: weekStartIso,
        weekEnd: weekEndIso,
      };

      const next = [newReport, ...prev];
      return sortReportsDesc(next);
    });
  };

  // 週報削除（確認ダイアログ付き）
  const handleDelete = (reportId: string) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "本当にこの週報を削除してよろしいですか？\n（この週報に紐づくタスクもすべて削除されます）"
      );
      if (!ok) return;

      // その週報のタスクも削除
      window.localStorage.removeItem(`weekly-report-tasks-${reportId}`);
    }

    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl py-6 px-4 md:px-8 space-y-6">
        {/* ヘッダー */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-3xl font-bold">週報一覧</h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              週ごとのタスクや振り返りをまとめたページです。
              各行をクリックすると、その週の詳細なタスク管理画面に移動します。
            </p>
            {!loaded && (
              <p className="text-[11px] text-slate-500">読み込み中...</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] md:text-xs text-slate-500">
              週報の数:{" "}
              <span className="font-semibold text-slate-800">
                {reports.length}
              </span>
            </p>
            <button
              type="button"
              onClick={handleAddReport}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              ＋ 新しい週を追加
            </button>
          </div>
        </header>

        {/* 週報一覧（1週1行のリスト表示） */}
        {reports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center space-y-2">
            <p className="text-sm text-slate-600">週報がまだありません。</p>
            <p className="text-[11px] md:text-xs text-slate-500">
              「新しい週を追加」ボタンから、最初の週報を作成してみてください。
            </p>
          </div>
        ) : (
          <section className="rounded-xl border bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {reports.map((report) => (
                <li key={report.id}>
                  <Link
                    href={`/reports/${report.id}`}
                    className="group flex items-center gap-3 px-4 py-2.5 md:px-5 md:py-3 hover:bg-slate-50 transition"
                  >
                    {/* 左：タイトル＋説明 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium text-slate-900 group-hover:text-slate-950 truncate">
                        {report.title}
                      </p>
                      <p className="text-[11px] md:text-xs text-slate-600 line-clamp-1">
                        {report.description}
                      </p>
                    </div>

                    {/* 右：作成日＋削除ボタン＋矢印 */}
                    <div className="flex items-center gap-3 text-[10px] md:text-[11px] text-slate-500">
                      <span>
                        作成日:{" "}
                        <span className="font-medium">
                          {formatDate(report.createdAt)}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="text-[10px] md:text-[11px] text-red-500 hover:text-red-600 hover:underline"
                      >
                        削除
                      </button>

                      <span className="inline-flex items-center gap-1 text-slate-600 group-hover:text-slate-900">
                        週報を開く
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
