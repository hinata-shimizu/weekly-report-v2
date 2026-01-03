import { Task, getTotalActualSeconds } from "./reportUtils";

export type Rank = {
    name: string;
    color: string; // Tailwind text color class or hex
    minLevel: number;
};

export const RANKS: Rank[] = [
    { name: "放浪者 (Wanderer)", color: "text-slate-500", minLevel: 1 },
    { name: "冒険者 (Adventurer)", color: "text-emerald-500", minLevel: 5 },
    { name: "戦士 (Warrior)", color: "text-cyan-500", minLevel: 10 },
    { name: "騎士 (Knight)", color: "text-blue-600", minLevel: 15 },
    { name: "達人 (Master)", color: "text-violet-600", minLevel: 20 },
    { name: "英雄 (Hero)", color: "text-fuchsia-500", minLevel: 30 },
    { name: "伝説 (Legend)", color: "text-amber-500", minLevel: 45 },
    { name: "神 (God)", color: "text-rose-600", minLevel: 60 },
];

export type LevelInfo = {
    level: number;
    rank: Rank;
    totalXP: number;
    currentLevelXP: number; // XP earned in this level
    nextLevelXP: number;    // XP needed to complete this level
    progressPercent: number;
};

// --- XP Rules ---
const XP_PER_TASK_DONE = 150;
const XP_BONUS_P0 = 50;
const XP_PER_FOCUS_MINUTE = 1;

/**
 * Calculate Total XP from a list of tasks (usually ALL tasks from ALL reports).
 */
export function calculateTotalXP(allTasks: Task[]): number {
    let xp = 0;
    for (const t of allTasks) {
        // 1. Basic completion
        if (t.status === "done") {
            xp += XP_PER_TASK_DONE;
            if (t.priority === "p0") {
                xp += XP_BONUS_P0;
            }
        }

        // 2. Focus Time (regardless of completion)
        const totalSeconds = getTotalActualSeconds(t, 0); // 0 for strict historical calc, or now if realtime
        const minutes = Math.floor(totalSeconds / 60);
        if (minutes > 0) {
            xp += minutes * XP_PER_FOCUS_MINUTE;
        }
    }
    return xp;
}

/**
 * Determine Level from Total XP.
 * Using a simple standardized RPG curve (or fibonacci-ish).
 * Level N requires roughly N * 500 XP total? No, that's linear.
 * Let's use: XP = 200 * (Level^2) roughly.
 * Level = sqrt(XP / 200).
 * 
 * Lv 1: 0 XP
 * Lv 2: 200 XP
 * Lv 5: 5000 XP (200 * 25)
 * Lv 10: 20000 XP
 */
export function getLevelInfo(totalXP: number): LevelInfo {
    // Formula: Level = floor(sqrt(totalXP / 150)) + 1
    // Adjusted constant '150' to tune pacing.
    // Lv 1 starts at 0.
    // Lv 2 needs 150 XP (1 task)
    // Lv 5 needs 150 * 16 = 2400 XP (~16 tasks)
    // Lv 10 needs 150 * 81 = 12150 XP (~80 tasks)

    // Reverse: Required XP for Level L = 150 * (L-1)^2

    const BASE_CONST = 150;
    const level = Math.floor(Math.sqrt(totalXP / BASE_CONST)) + 1;

    const currentLevelBaseXP = BASE_CONST * Math.pow(level - 1, 2);
    const nextLevelBaseXP = BASE_CONST * Math.pow(level, 2);

    const xpNeededForNext = nextLevelBaseXP - currentLevelBaseXP;
    const xpInCurrent = totalXP - currentLevelBaseXP;

    const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrent / xpNeededForNext) * 100)));

    // Find Rank
    // Reverse loop to find highest matching rank
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (level >= r.minLevel) {
            rank = r;
        }
    }

    return {
        level,
        rank,
        totalXP,
        currentLevelXP: xpInCurrent,
        nextLevelXP: xpNeededForNext,
        progressPercent
    };
}
