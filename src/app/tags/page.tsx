"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const TAG_STORAGE_KEY = "weekly-report-tags";
const TASKS_KEY_PREFIX = "weekly-report-tasks-";

// 初期タグ（localStorage に何もなかった時だけ使う）
const DEFAULT_TAGS = ["開発", "学習", "就活", "事務", "生活"];

function safeParseTags(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const cleaned = parsed
      .filter((x) => typeof x === "string")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    // ✅ 空配列も「ユーザーが全部消した結果」として尊重する
    return Array.from(new Set(cleaned));
  } catch {
    return null;
  }
}

function loadTags(): string[] {
  if (typeof window === "undefined") return DEFAULT_TAGS;

  const raw = window.localStorage.getItem(TAG_STORAGE_KEY);
  const parsed = safeParseTags(raw);

  // ✅ 保存済みがあるならそれを使う（空配列もOK）
  if (parsed !== null) return parsed;

  // ✅ 初回だけ DEFAULT_TAGS を保存して初期化しておく
  window.localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(DEFAULT_TAGS));
  return DEFAULT_TAGS;
}

function saveTags(tags: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
}

function cleanupDeletedTagFromAllTasks(deletedTag: string) {
  if (typeof window === "undefined") return;

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(TASKS_KEY_PREFIX)) continue;

    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;

      const updated = parsed.map((t: any) => {
        if (!t || typeof t !== "object") return t;
        if (t.tag !== deletedTag) return t;
        return { ...t, tag: null };
      });

      window.localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // 壊れてるデータがあっても止めない
    }
  }
}

export default function TagsPage() {
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTags(loadTags());
  }, []);

  const normalizedNewTag = useMemo(() => newTag.trim(), [newTag]);

  const handleAdd = () => {
    const t = normalizedNewTag;
    if (!t) return;

    // 重複防止（完全一致）
    if (tags.includes(t)) {
      setMessage("同じタグがすでにあります");
      setTimeout(() => setMessage(""), 1500);
      return;
    }

    const next = [...tags, t];
    setTags(next);

    // ✅ ここで即保存（重要）
    saveTags(next);

    setNewTag("");
    setMessage("タグを追加しました");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleDelete = (tag: string) => {
    const ok = window.confirm(
      `「${tag}」を削除します。\nこのタグが付いたタスクは「未設定」になります。`
    );
    if (!ok) return;

    const next = tags.filter((t) => t !== tag);
    setTags(next);

    // ✅ ここで即保存（重要）
    saveTags(next);

    // ✅ 既存タスクからもタグを外す
    cleanupDeletedTagFromAllTasks(tag);

    setMessage("タグを削除しました");
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl py-6 px-4 md:px-8 space-y-6">
        <header className="space-y-2">
          <Link
            href="/reports"
            className="inline-flex items-center text-[11px] md:text-xs text-slate-600 hover:text-slate-900"
          >
            ← 週報一覧に戻る
          </Link>
          <h1 className="text-xl md:text-3xl font-bold">タグ管理</h1>
          <p className="text-xs md:text-sm text-slate-600">
            タグを追加・削除できます。削除したタグが付いたタスクは自動で「未設定」に置き換わります。
          </p>
        </header>

        <section className="rounded-xl border bg-white shadow-sm p-4 md:p-5 space-y-3">
          <h2 className="text-base md:text-lg font-semibold">タグを追加</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              placeholder="例：研究 / バイト / 体調管理"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="w-full md:w-auto inline-flex justify-center items-center rounded-lg px-5 py-2.5 text-sm font-medium border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              ＋ 追加
            </button>
          </div>
          {message && <p className="text-[11px] md:text-xs text-emerald-600">{message}</p>}
        </section>

        <section className="rounded-xl border bg-white shadow-sm p-4 md:p-5 space-y-3">
          <h2 className="text-base md:text-lg font-semibold">登録済みタグ</h2>

          {tags.length === 0 ? (
            <p className="text-sm text-slate-600">タグがありません。</p>
          ) : (
            <ul className="space-y-2">
              {tags.map((tag) => (
                <li key={tag} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-sm text-slate-900">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(tag)}
                    className="text-xs text-red-500 hover:text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
