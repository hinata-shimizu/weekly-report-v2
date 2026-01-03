"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadTasks, saveStoredTags, TASKS_KEY_PREFIX, type Task } from "@/lib/reportUtils"; // Assuming we need save logic imports that might not be exported yet, check utils
import { FocusTimer } from "@/components/focus/FocusTimer";
import { AnimatePresence, motion } from "framer-motion";

// We need a way to save specific report's tasks back to storage from here.
// Since loadTasks is readonly, we'll implement a simple save helper here or assume we can write to localStorage directly using the same key pattern.

function FocusPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const reportId = searchParams.get("reportId");
    const taskId = searchParams.get("taskId");

    const [task, setTask] = useState<Task | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [allTasks, setAllTasks] = useState<Task[]>([]); // Keep all to save back
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!reportId || !taskId) {
            setLoaded(true);
            return;
        }

        const now = Date.now();
        const tasks = loadTasks(reportId, now);
        setAllTasks(tasks);

        const found = tasks.find((t) => t.id === taskId);
        if (found) {
            setTask(found);
        }
        setLoaded(true);
    }, [reportId, taskId]);

    const handleComplete = (elapsedSeconds: number) => {
        setIsCompleted(true);

        // Save status change
        if (reportId && taskId) {
            const nextTasks = allTasks.map(t => {
                if (t.id === taskId) {
                    return {
                        ...t,
                        status: "done" as const,
                        // Only add what was actually spent in this session
                        actualSeconds: (t.actualSeconds || 0) + elapsedSeconds
                    };
                }
                return t;
            });

            // Persist
            if (typeof window !== "undefined") {
                window.localStorage.setItem(`${TASKS_KEY_PREFIX}${reportId}`, JSON.stringify(nextTasks));
            }
        }

        // Delay route back to show celebration
        setTimeout(() => {
            router.back();
        }, 2000);
    };

    const handleExit = () => {
        router.back();
    };

    if (!loaded) return null;

    if (!task) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <p>タスクが見つかりません</p>
                <button onClick={handleExit} className="ml-4 underline hover:text-white">戻る</button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 transition-colors duration-500">
            <div className="w-full max-w-md mx-auto text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-xl font-medium text-slate-700 tracking-wide">
                        {task.title}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <FocusTimer
                        initialMinutes={25}
                        onComplete={handleComplete}
                        onExit={handleExit}
                    />
                </motion.div>
            </div>

            {/* Celebration Overlay */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse text-center"
                        >
                            COMPLETED! 🎉
                            <p className="text-slate-500 text-lg mt-4 font-medium tracking-widest">GREAT JOB</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function FocusPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <FocusPageContent />
        </Suspense>
    );
}
