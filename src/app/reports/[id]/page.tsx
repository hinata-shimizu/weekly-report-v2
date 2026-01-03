"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  type Task,
  type TaskStatus,
  type Report,
  STORAGE_KEY,
  TASKS_KEY_PREFIX,
  DEFAULT_TAG_LABEL,
  pickTopTagsBySeconds,
  findThisWeekReport,
  normalizeTask,
  buildStats,
  loadStoredTags,
  saveStoredTags,
  loadTasks
} from "@/lib/reportUtils";

import { ReportDetailHeader } from "@/components/ReportDetailHeader";
import { TaskInput } from "@/components/task/TaskInput";
import { TaskList } from "@/components/task/TaskList";
import { ReportSummary } from "@/components/report/ReportSummary";
import { ReportReflection } from "@/components/report/ReportReflection";
import { ReportActions } from "@/components/report/ReportActions";

import {
  calculateTotalXP,
  getLevelInfo,
  type LevelInfo
} from "@/lib/gamification";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import { generateCoachAdvice, CoachMessage } from "@/lib/coaching";

export default function ReportDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  // --- State ---
  const [loaded, setLoaded] = useState(false);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Gamification
  const [levelInfo, setLevelInfo] = useState<LevelInfo | undefined>(undefined);
  const prevLevelRef = React.useRef<number | undefined>(undefined);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ old: number; new: number } | null>(null);

  // AI Coach
  const [advice, setAdvice] = useState<CoachMessage | undefined>(undefined);

  // ... (Initial Load Effect) ... 

  // (Update XP Effect - modified to detect level up)
  useEffect(() => {
    if (!loaded || allReports.length === 0) return;

    const now = Date.now();
    const allTasks: any[] = [];
    for (const r of allReports) {
      if (r.id === id) {
        allTasks.push(...tasks);
      } else {
        allTasks.push(...loadTasks(r.id, now));
      }
    }
    const xp = calculateTotalXP(allTasks);
    const newInfo = getLevelInfo(xp);

    // Detect Level Up
    if (prevLevelRef.current !== undefined && newInfo.level > prevLevelRef.current) {
      setLevelUpData({ old: prevLevelRef.current, new: newInfo.level });
      setShowLevelUp(true);
    }
    // Update ref
    prevLevelRef.current = newInfo.level;

    setLevelInfo(newInfo);
  }, [tasks, allReports, loaded, id]);
  const NOTE_KEY = `weekly-report-note-${id}`;
  const [weeklyNote, setWeeklyNote] = useState("");
  const [noteSavedMessage, setNoteSavedMessage] = useState("");

  // Filters
  const [tagFilter, setTagFilter] = useState("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Timer
  const [now, setNow] = useState(Date.now());

  // UI Messages
  const [savedMessage, setSavedMessage] = useState("");

  // --- Effects ---

  // 1. Initial Load
  useEffect(() => {
    if (typeof window === "undefined" || !id) return;

    // Load reports list to validate existence (optional, but good for navigation)
    // AND to calculate XP from all history
    const rawReports = localStorage.getItem(STORAGE_KEY);
    if (rawReports) {
      try {
        const parsed = JSON.parse(rawReports);
        setAllReports(parsed);

        // Calculate XP immediately
        const now = Date.now();
        const allTasks: any[] = [];
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            const t = loadTasks(r.id, now);
            allTasks.push(...t);
          }
        }
        const xp = calculateTotalXP(allTasks);
        setLevelInfo(getLevelInfo(xp));
      } catch { }
    }

    // Load Tasks
    const rawTasks = localStorage.getItem(`${TASKS_KEY_PREFIX}${id}`);
    if (rawTasks) {
      try {
        const parsed = JSON.parse(rawTasks);
        if (Array.isArray(parsed)) {
          setTasks(parsed.map(normalizeTask));
        }
      } catch { }
    }

    // Load Note
    const rawNote = localStorage.getItem(NOTE_KEY);
    if (rawNote) {
      setWeeklyNote(rawNote);
    }

    setLoaded(true);
  }, [id, NOTE_KEY]);

  // Update XP when current tasks change (Realtime update!)
  useEffect(() => {
    // This is local update optimization: 
    // Re-calculating ALL XP every time we tick a checkbox might be heavy if we re-read all reports.
    // But we can optimize: We know total XP excluding THIS report, plus XP from THIS report.
    // For simplicity, let's just re-calculate all for now. LocalStorage read is fast.
    if (!loaded || allReports.length === 0) return;

    const now = Date.now();
    const allTasks: any[] = [];
    for (const r of allReports) {
      if (r.id === id) {
        // Use current state for this report!
        allTasks.push(...tasks);
      } else {
        allTasks.push(...loadTasks(r.id, now));
      }
    }
    const xp = calculateTotalXP(allTasks);
    setLevelInfo(getLevelInfo(xp));

    // Generate Advice
    setAdvice(generateCoachAdvice(buildStats(tasks), tasks));
  }, [tasks, allReports, loaded, id]);


  // 2. Timer Loop (update 'now' every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Auto Save Tasks
  useEffect(() => {
    if (!loaded || !id) return;
    localStorage.setItem(`${TASKS_KEY_PREFIX}${id}`, JSON.stringify(tasks));
    showSavedIndicator();
  }, [tasks, loaded, id]);

  // 4. Auto Save Note
  useEffect(() => {
    if (!loaded || !id) return;
    localStorage.setItem(NOTE_KEY, weeklyNote);
    setNoteSavedMessage("保存しました");
    const t = setTimeout(() => setNoteSavedMessage(""), 2000);
    return () => clearTimeout(t);
  }, [weeklyNote, loaded, id, NOTE_KEY]);


  // --- Helper: Save Indicator ---
  const showSavedIndicator = () => {
    setSavedMessage("保存しました");
    const t = setTimeout(() => setSavedMessage(""), 2000);
    return () => clearTimeout(t);
  };

  // --- Actions ---

  const handleAddTask = useCallback((title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: "todo",
      tag: null,
      priority: "p1",
      isToday: false,
      estimatedMinutes: null,
      actualSeconds: 0,
      isRunning: false,
      startedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const handleChangeStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      // If completing, stop timer
      if (status === "done" && t.isRunning) {
        const added = t.startedAt ? Math.floor((Date.now() - t.startedAt) / 1000) : 0;
        return { ...t, status, isRunning: false, startedAt: null, actualSeconds: t.actualSeconds + added };
      }
      return { ...t, status };
    }));
  }, []);

  const handleChangeTag = useCallback((taskId: string, tag: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, tag: tag || null } : t));
  }, []);

  const handleChangePriority = useCallback((taskId: string, priority: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: priority as any } : t));
  }, []);

  const handleChangeEstimated = useCallback((taskId: string, value: string) => {
    const num = parseInt(value, 10);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, estimatedMinutes: isNaN(num) ? null : num } : t));
  }, []);

  const handleToggleToday = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isToday: !t.isToday } : t));
  }, []);

  const handleStartTimer = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, isRunning: true, startedAt: Date.now() };
      }
      if (t.isRunning && t.startedAt) {
        const added = Math.floor((Date.now() - t.startedAt) / 1000);
        return { ...t, isRunning: false, startedAt: null, actualSeconds: t.actualSeconds + added };
      }
      return t;
    }));
  }, []);

  const handleStopTimer = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      if (!t.isRunning || !t.startedAt) return t;
      const added = Math.floor((Date.now() - t.startedAt) / 1000);
      return { ...t, isRunning: false, startedAt: null, actualSeconds: t.actualSeconds + added };
    }));
  }, []);

  const handleDelete = useCallback((taskId: string) => {
    if (!confirm("本当に削除しますか？")) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const handleRestore = useCallback((newTasks: any[], newNote: string) => {
    try {
      const normalized = newTasks.map(normalizeTask);
      setTasks(normalized);
      setWeeklyNote(newNote);
    } catch (e) {
      alert("復元に失敗しました");
    }
  }, []);

  // --- Derived Data ---
  const tags = useMemo(() => {
    // 1. Tags from current tasks
    const currentTags = new Set<string>();
    tasks.forEach(t => { if (t.tag) currentTags.add(t.tag); });

    // 2. Load globally saved tags (from tags page source)
    if (typeof window !== "undefined") {
      const globalTags = loadStoredTags();
      globalTags.forEach(t => currentTags.add(t));
    }

    return Array.from(currentTags).sort();
  }, [tasks]);

  // Sync new tags to global storage
  useEffect(() => {
    if (!loaded) return;

    const globalTags = new Set(loadStoredTags());
    let changed = false;

    tasks.forEach(t => {
      if (t.tag && !globalTags.has(t.tag)) {
        globalTags.add(t.tag);
        changed = true;
      }
    });

    if (changed) {
      saveStoredTags(Array.from(globalTags));
    }
  }, [tasks, loaded]);

  const stats = useMemo(() => buildStats(tasks), [tasks]);

  const countsByStatus = useMemo(() => {
    const counts = { done: 0, doing: 0, todo: 0, not_decided: 0 };
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return counts;
  }, [tasks]);


  // Derived: Find current report object
  const report = useMemo(() => {
    return allReports.find(r => r.id === id) || {
      id: id as string,
      title: "読込中...",
      description: "",
      createdAt: new Date().toISOString(),
      weekStart: new Date().toISOString(),
      weekEnd: new Date().toISOString()
    } as Report;
  }, [allReports, id]);

  const handleDeleteAllTasks = useCallback(() => {
    setTasks([]);
    setWeeklyNote("");
  }, []);

  // If not loaded yet
  if (!loaded) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-8">

        <ReportDetailHeader
          id={id as string}
          loaded={loaded}
          savedMessage={savedMessage}
          totalCount={tasks.length}
          countsByStatus={countsByStatus}
          levelInfo={levelInfo}
          advice={advice}
        />

        <div className="grid gap-8">
          <div className="space-y-6">
            <TaskInput onAdd={handleAddTask} />

            <TaskList
              tasks={tasks}
              now={now}
              tags={tags}
              showTodayOnly={showTodayOnly}
              setShowTodayOnly={setShowTodayOnly}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
              actions={{
                onChangeStatus: handleChangeStatus,
                onChangeTag: handleChangeTag,
                onChangePriority: handleChangePriority,
                onChangeEstimated: handleChangeEstimated,
                onToggleToday: handleToggleToday,
                onStartTimer: handleStartTimer,
                onStopTimer: handleStopTimer,
                onDelete: handleDelete,
                onReorder: (newTasks) => setTasks(newTasks)
              }}
            />
          </div>

          <ReportSummary tasks={tasks} now={now} />

          <ReportReflection
            weeklyNote={weeklyNote}
            setWeeklyNote={setWeeklyNote}
            noteSavedMessage={noteSavedMessage}
            tasks={tasks}
            now={now}
          />

          <ReportActions
            id={report.id}
            report={report}
            tasks={tasks}
            now={now}
            weeklyNote={weeklyNote}
            onRestore={handleRestore}
            onDeleteAllTasks={handleDeleteAllTasks}
          />
        </div>

        {levelInfo && levelUpData && (
          <LevelUpModal
            show={showLevelUp}
            oldLevel={levelUpData.old}
            newLevel={levelUpData.new}
            rank={levelInfo.rank}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </div>
    </main>
  );
}