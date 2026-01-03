import React, { useMemo, useState } from "react";
import { type Task, type TaskStatus, type TaskPriority } from "@/lib/reportUtils";
import { TaskItem } from "./TaskItem";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type Props = {
    tasks: Task[];
    now: number;
    tags: string[];

    // Filters
    showTodayOnly: boolean;
    setShowTodayOnly: (v: boolean) => void;
    showCompleted: boolean;
    setShowCompleted: (v: boolean) => void;
    tagFilter: string;
    setTagFilter: (v: string) => void;

    // Actions
    actions: {
        onChangeStatus: (id: string, status: TaskStatus) => void;
        onChangeTag: (id: string, tag: string) => void;
        onChangePriority: (id: string, priority: string) => void;
        onChangeEstimated: (id: string, value: string) => void;
        onToggleToday: (id: string) => void;
        onStartTimer: (id: string) => void;
        onStopTimer: (id: string) => void;
        onDelete: (id: string) => void;
        // New: Reorder callback
        onReorder?: (newTasks: Task[]) => void;
    };
};

export function TaskList({
    tasks,
    now,
    tags,
    showTodayOnly,
    setShowTodayOnly,
    showCompleted,
    setShowCompleted,
    tagFilter,
    setTagFilter,
    actions,
}: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Require slight movement to prevent drag when clicking inputs
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Filter tasks
    const visibleTasks = useMemo(() => {
        // NOTE: In DnD mode, we display tasks explicitly ordered by the user (the 'tasks' array order).
        // We do *not* automatically sort by priority/status anymore to allow manual organization.

        return tasks.filter((t) => {
            if (showTodayOnly && !t.isToday) return false;
            if (!showCompleted && t.status === "done") return false;
            if (tagFilter !== "all" && t.tag !== tagFilter) return false;
            return true;
        });
    }, [tasks, showTodayOnly, showCompleted, tagFilter]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newTasks = arrayMove(tasks, oldIndex, newIndex);
                actions.onReorder?.(newTasks);
            }
        }
    }

    if (tasks.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#2f3336] bg-slate-50/50 dark:bg-black/50 p-8 text-center backdrop-blur-sm">
                <p className="text-slate-500 dark:text-[#71767b] font-medium">まだタスクがありません</p>
                <p className="text-sm text-slate-400 dark:text-[#536471] mt-1">上のフォームから、今週やることを追加しましょう。</p>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            {/* Filters Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 bg-slate-50/80 dark:bg-black/80 backdrop-blur-md py-3 px-1 border-b border-slate-200/50 dark:border-[#2f3336] transition-all rounded-b-lg -mx-1">
                <div className="flex items-center gap-2 px-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-[#e7e9ea] flex items-center gap-2">
                        📋 タスク一覧
                        <span className="text-xs font-normal text-slate-500 dark:text-[#71767b] bg-slate-200/50 dark:bg-[#16181c] px-2 py-0.5 rounded-full">
                            {visibleTasks.length} / {tasks.length}
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide px-2">
                    {/* Tag Filter */}
                    <select
                        className="text-xs border border-slate-200 dark:border-[#2f3336] rounded-lg px-2 py-1.5 bg-white/80 dark:bg-black text-slate-700 dark:text-[#e7e9ea] hover:border-indigo-300 cursor-pointer focus:outline-none focus:border-indigo-500 shadow-sm"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                    >
                        <option value="all">すべてのタグ</option>
                        {tags.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Toggle Today */}
                    <button
                        onClick={() => setShowTodayOnly(!showTodayOnly)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shadow-sm ${showTodayOnly
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold dark:bg-[#1d9bf0]/10 dark:border-[#1d9bf0]/30 dark:text-[#1d9bf0]"
                            : "bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-black dark:border-[#2f3336] dark:text-[#71767b] dark:hover:bg-[#16181c]"
                            }`}
                    >
                        Today
                    </button>

                    {/* Toggle Completed */}
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shadow-sm ${showCompleted
                            ? "bg-slate-100 border-slate-200 text-slate-700 dark:bg-[#16181c] dark:border-[#2f3336] dark:text-[#e7e9ea]"
                            : "bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-black dark:border-[#2f3336] dark:text-[#71767b] dark:hover:text-[#e7e9ea]"
                            }`}
                    >
                        {showCompleted ? "完了を隠す" : "完了を表示"}
                    </button>
                </div>
            </div>

            {visibleTasks.length === 0 ? (
                <div className="py-12 text-center border rounded-xl bg-white/50 dark:bg-black/50 border-slate-200 dark:border-[#2f3336] backdrop-blur-sm">
                    <p className="text-slate-400 dark:text-[#71767b]">表示するタスクがありません</p>
                    <p className="text-xs text-slate-400 dark:text-[#536471] mt-1">フィルタ条件を変更してみてください</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={visibleTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-3">
                            {visibleTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    now={now}
                                    tags={tags}
                                    {...actions}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </section>
    );
}
