"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  type Report,
  type ReportStats,
  type TrendData,
  STORAGE_KEY,
  TASKS_KEY_PREFIX,
  getWeekRange,
  formatWeekRangeTitle,
  sortReportsDesc,
  loadTasks,
  buildStats,
  findThisWeekReport,
  loadAllReportsStats,
  generateSampleReports,
} from "@/lib/reportUtils";

import { ReportsHeader } from "@/components/ReportsHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { ReportList } from "@/components/ReportList";
import { TrendAnalysis } from "@/components/dashboard/TrendAnalysis";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

import {
  calculateTotalXP,
  getLevelInfo,
  type LevelInfo
} from "@/lib/gamification";
import { generateCoachAdvice, CoachMessage } from "@/lib/coaching";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 週ごとの集計キャッシュ
  const [statsById, setStatsById] = useState<Record<string, ReportStats>>({});

  // トレンドデータ
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [showTrend, setShowTrend] = useState(false);

  // Gamification
  const [levelInfo, setLevelInfo] = useState<LevelInfo | undefined>(undefined);
  const [advice, setAdvice] = useState<CoachMessage | undefined>(undefined);

  // 初回読み込み：localStorage から一覧を読む
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      // 初期サンプル
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
            typeof r.createdAt === "string" && r.createdAt ? r.createdAt : new Date().toISOString();

          const createdDate = new Date(createdAt);
          const baseDate = Number.isNaN(createdDate.getTime()) ? new Date() : createdDate;

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

  // 集計を作る
  const refreshStats = useCallback(() => {
    if (typeof window === "undefined") return;
    const nowMs = Date.now();

    const next: Record<string, ReportStats> = {};
    const allTasksForXP: any[] = []; // Collect all tasks for XP

    for (const r of reports) {
      const tasks = loadTasks(r.id, nowMs);
      const stats = buildStats(tasks);

      // Collect tasks for XP
      tasks.forEach(t => allTasksForXP.push(t));

      // Load note summary
      const noteKey = `weekly-report-note-${r.id}`;
      const noteRaw = window.localStorage.getItem(noteKey);
      if (noteRaw) {
        stats.noteSummary = noteRaw.slice(0, 100).replace(/\n/g, " ") + (noteRaw.length > 100 ? "..." : "");
      }

      next[r.id] = stats;
    }
    setStatsById(next);

    // Trend Data Update
    setTrendData(loadAllReportsStats(reports));

    // Gamification Update
    const totalXP = calculateTotalXP(allTasksForXP);
    setLevelInfo(getLevelInfo(totalXP));

    // Generate Advice (Based on the latest report if exists)
    if (reports.length > 0) {
      const latestReport = reports[0];
      const tasks = loadTasks(latestReport.id, nowMs);
      const stats = buildStats(tasks);
      setAdvice(generateCoachAdvice(stats, tasks));
    }

  }, [reports]);

  useEffect(() => {
    if (!loaded) return;

    refreshStats();

    const onFocus = () => refreshStats();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loaded, refreshStats]);

  // 新しい週を追加
  const handleAddReport = () => {
    setReports((prev) => {
      const numericIds = prev.map((r) => Number(r.id)).filter((n) => !Number.isNaN(n));
      const nextIdNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
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

  // 週報削除
  const handleDelete = (reportId: string, e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "本当にこのレポートを削除してよろしいですか？\n（このレポートに紐づくタスクとメモも削除されます）"
      );
      if (!ok) return;

      window.localStorage.removeItem(`${TASKS_KEY_PREFIX}${reportId}`);
      window.localStorage.removeItem(`weekly-report-note-${reportId}`);
    }

    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  const thisWeekReport = useMemo(() => findThisWeekReport(reports), [reports]);
  const thisWeekStats = thisWeekReport ? statsById[thisWeekReport.id] : null;

  const handleGenerateSample = () => {
    const samples = generateSampleReports();
    setReports(sortReportsDesc(samples));
  };

  return (
    <main className="min-h-screen relative p-4 md:p-8">
      {/* Background is handled by globals.css (Aurora) */}
      <div className="mx-auto max-w-5xl space-y-10 relative z-10">

        <AnimatedCard delay={0} className="p-5">
          <ReportsHeader
            reportCount={reports.length}
            loading={!loaded}
            levelInfo={levelInfo}
            advice={advice}
            onAddReport={handleAddReport}
          />
        </AnimatedCard>

        {reports.length === 0 && loaded && (
          <AnimatedCard delay={0.1} className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400">
                まだレポートがありません。<br />
                「新しい週を追加」するか、サンプルデータを生成して試すことができます。
              </p>
              <button
                onClick={handleGenerateSample}
                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium"
              >
                🪄 サンプルデータを生成する
              </button>
            </div>
          </AnimatedCard>
        )}

        {/* View Switcher */}
        <div className="flex flex-col gap-4">
          <AnimatedCard delay={0.1} className="border-none shadow-none bg-transparent">
            <div className="flex items-center justify-end">
              <div className="flex bg-white/40 dark:bg-slate-800/40 p-1 rounded-lg backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm">
                <button
                  onClick={() => setShowTrend(false)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!showTrend
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                    }`}
                >
                  今週のサマリー
                </button>
                <button
                  onClick={() => setShowTrend(true)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${showTrend
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                    }`}
                >
                  長期トレンド
                </button>
              </div>
            </div>
          </AnimatedCard>

          <AnimatePresence mode="wait">
            {showTrend ? (
              <AnimatedCard key="trend" delay={0.2} className="bg-transparent border-none shadow-none">
                <TrendAnalysis
                  data={trendData}
                  onGenerateSample={() => {
                    const samples = generateSampleReports();
                    setReports(prev => sortReportsDesc([...prev, ...samples]));
                    alert("サンプルデータを生成しました！");
                  }}
                />
              </AnimatedCard>
            ) : (
              <AnimatedCard key="dashboard" delay={0.2} className="bg-transparent border-none shadow-none">
                <DashboardStats
                  thisWeekReport={thisWeekReport}
                  thisWeekStats={thisWeekStats}
                  onRefresh={refreshStats}
                />
              </AnimatedCard>
            )}
          </AnimatePresence>
        </div>

        <AnimatedCard delay={0.3} className="bg-transparent border-none shadow-none">
          <ReportList
            reports={reports}
            statsById={statsById}
            onDelete={handleDelete}
          />
        </AnimatedCard>
      </div>
    </main>
  );
}
