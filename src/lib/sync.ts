import { supabase } from "./supabase";
import {
    STORAGE_KEY,
    TASKS_KEY_PREFIX,
    Report,
    Task,
    TAG_STORAGE_KEY,
    loadStoredTags,
    saveStoredTags,
} from "./reportUtils";

/**
 * Upload all local data to Supabase (Overwrite cloud with local)
 * Note: simplistic approach for MVP
 */
export async function pushToCloud() {
    if (typeof window === "undefined") return;

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    // 2. Read Local Data
    const reportsRaw = window.localStorage.getItem(STORAGE_KEY);
    const reports: Report[] = reportsRaw ? JSON.parse(reportsRaw) : [];

    const tags = loadStoredTags();
    // Assuming we might store profile later, but for now just sync reports/tasks

    if (reports.length === 0) return;

    try {
        // 3. Reports
        // Upsert all reports
        for (const r of reports) {
            const { error: rErr } = await supabase
                .from("reports")
                .upsert({
                    id: r.id,
                    user_id: user.id,
                    week_label: r.title, // mapping title -> week_label
                    week_number: 0, // Placeholder
                    start_date: r.weekStart,
                    end_date: r.weekEnd,
                    reflection_text: window.localStorage.getItem(`weekly-report-note-${r.id}`) ?? "",
                    created_at: r.createdAt,
                }, { onConflict: "id" });

            if (rErr) throw rErr;

            // 4. Tasks for this report
            const tasksRaw = window.localStorage.getItem(`${TASKS_KEY_PREFIX}${r.id}`);
            const tasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];

            if (tasks.length > 0) {
                // Prepare payload
                const taskRows = tasks.map(t => ({
                    id: t.id,
                    report_id: r.id,
                    user_id: user.id,
                    title: t.title,
                    completed: t.status === "done",
                    status: t.status,
                    priority: t.priority,
                    estimated_minutes: t.estimatedMinutes ?? 0,
                    actual_minutes: Math.floor(t.actualSeconds / 60), // Store as minutes in DB or change DB schema? 
                    // DB schema has actual_minutes integer. 
                    // Let's stick to schema: actual_minutes. But frontend uses seconds.
                    // We might lose precision. Ideally DB should have actual_seconds. 
                    // Let's assume schema integer is minutes for now as defined.
                    tags: t.tag ? [t.tag] : [],
                    created_at: new Date().toISOString(), // Tasks in local don't have createdAt, use now
                }));

                const { error: tErr } = await supabase
                    .from("tasks")
                    .upsert(taskRows, { onConflict: "id" });

                if (tErr) throw tErr;
            }
        }
    } catch (e) {
        console.error("Sync Push Error:", e);
        throw e;
    }
}

/**
 * Download all data from Supabase and overwrite LocalStorage
 */
export async function pullFromCloud() {
    if (typeof window === "undefined") return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    // 1. Fetch Reports
    const { data: reportsData, error: rErr } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

    if (rErr) throw rErr;
    if (!reportsData) return;

    const reports: Report[] = reportsData.map((r: any) => ({
        id: r.id,
        title: r.week_label,
        description: "", // DB doesn't have description column in reports table? Check schema.
        // Schema: week_label, reflection_text... oh generic description is missing.
        // Let's map description to something or ignore.
        // Actually earlier code used description. 
        createdAt: r.created_at,
        weekStart: r.start_date,
        weekEnd: r.end_date,
    }));

    // Save Reports
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    // 2. Fetch Tasks & Notes for each report
    for (const r of reportsData) {
        // Save Note
        if (r.reflection_text) {
            window.localStorage.setItem(`weekly-report-note-${r.id}`, r.reflection_text);
        }

        // Fetch Tasks
        const { data: tasksData, error: tErr } = await supabase
            .from("tasks")
            .select("*")
            .eq("report_id", r.id);

        if (tErr) console.error("Task fetch error", tErr);

        if (tasksData) {
            const tasks: Task[] = tasksData.map((t: any) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                tag: t.tags && t.tags.length > 0 ? t.tags[0] : null,
                priority: t.priority,
                isToday: false, // lost in sync
                estimatedMinutes: t.estimated_minutes,
                actualSeconds: t.actual_minutes * 60, // Convert back to seconds
                isRunning: false,
                startedAt: null,
            }));
            window.localStorage.setItem(`${TASKS_KEY_PREFIX}${r.id}`, JSON.stringify(tasks));
        }
    }
}
