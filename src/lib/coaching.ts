import { Task, ReportStats } from "./reportUtils";

export type CoachMessage = {
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "encouragement";
};

/**
 * Generate coaching advice based on current stats and tasks.
 */
export function generateCoachAdvice(stats: ReportStats, tasks: Task[]): CoachMessage {
    const total = stats.totalCount;
    // Calculate completion rate safely
    const completionRate = total > 0 ? Math.round((stats.doneCount / total) * 100) : 0;
    const focusMinutes = Math.floor(stats.totalActualSeconds / 60);

    // 0. Empty State
    if (total === 0) {
        return {
            title: "まずは計画から",
            message: "今週のタスクがまだありません。「タスクを追加」から、やるべきことを書き出してみましょう！",
            type: "info"
        };
    }

    // 1. High Priority Overload check
    const p0Tasks = tasks.filter(t => t.priority === "p0" && t.status !== "done").length;
    if (p0Tasks > 3) {
        return {
            title: "詰め込みすぎ注意報",
            message: `最優先(P0)タスクが${p0Tasks}個残っています。全てを追うと疲れてしまいます。本当に今日やるべき1つに絞りましょう。`,
            type: "warning"
        };
    }

    // 2. High Focus but Low Completion (Stuck?)
    if (focusMinutes > 120 && completionRate < 20) {
        return {
            title: "少し休憩しませんか？",
            message: "かなり集中して作業されていますが、完了タスクが少なめです。一度タスクを細分化するか、短い休憩を取ってリフレッシュしましょう。",
            type: "encouragement"
        };
    }

    // 3. Great Progress (Flow State)
    if (completionRate > 80 && total > 5) {
        return {
            title: "素晴らしい流れです！",
            message: "タスクの消化率がとても高いです！この調子で今週の目標を達成しましょう。無理せず水分補給も忘れずに。",
            type: "success"
        };
    }

    // 4. End of Week / Monday Blues
    const today = new Date().getDay(); // 0=Sun, 1=Mon...
    if (today === 1 && completionRate < 10) {
        return {
            title: "良い一週間のスタートを",
            message: "月曜日ですね！まずは5分で終わる簡単なタスクから始めて、リズムを作っていきましょう。",
            type: "info"
        };
    }

    if (today === 5 && completionRate < 50) {
        return {
            title: "ラストスパート！",
            message: "金曜日です。今週中に絶対に終わらせたいタスクだけを選んで、残りは来週に回すのも戦略です。",
            type: "warning"
        };
    }

    // Default Encouragement
    if (completionRate > 50) {
        return {
            title: "順調に進んでいます",
            message: "半分以上のタスクが完了しました。残りのタスク優先順位を見直して、着実に進めていきましょう。",
            type: "success"
        };
    }

    return {
        title: "焦らずいきましょう",
        message: "タスクリストを見直して、今すぐに着手できる小さなことから始めてみてください。",
        type: "info"
    };
}
