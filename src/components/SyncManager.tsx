"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { pushToCloud, pullFromCloud } from "@/lib/sync";
import { useRouter } from "next/navigation";

export function SyncManager() {
    const [syncing, setSyncing] = useState(false);
    const router = useRouter();

    // Auto-pull on login? 
    // Maybe better to have a manual button first to be safe.

    const handleSync = async (direction: "push" | "pull") => {
        if (!confirm(direction === "push"
            ? "この端末のデータをクラウドに上書き保存しますか？"
            : "クラウドのデータをこの端末に読み込みますか？（現在の未保存データは上書きされます）")) {
            return;
        }

        setSyncing(true);
        try {
            if (direction === "push") {
                await pushToCloud();
                alert("クラウドへの保存が完了しました！");
            } else {
                await pullFromCloud();
                alert("クラウドからの読み込みが完了しました！");
                window.location.reload(); // Reload to reflect changes
            }
        } catch (e: any) {
            alert("エラーが発生しました: " + e.message);
        } finally {
            setSyncing(false);
        }
    };

    return null; // This component handles logic, UI will be in Header
}
