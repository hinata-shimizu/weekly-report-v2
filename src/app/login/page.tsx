"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/login`,
                    },
                });
                if (error) throw error;
                setMessage("確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/reports");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-[#e7e9ea] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-2">
                        Weekly Report
                    </h1>
                    <p className="text-slate-500 dark:text-[#71767b]">
                        {isSignUp ? "新しいアカウントを作成" : "アカウントにログイン"}
                    </p>
                </div>

                <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#2f3336] rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleAuth} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#71767b] mb-1.5">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#16181c] border border-slate-200 dark:border-[#2f3336] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#71767b] mb-1.5">
                                パスワード
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#16181c] border border-slate-200 dark:border-[#2f3336] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#1d9bf0] dark:hover:bg-[#1a8cd8] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "処理中..." : isSignUp ? "アカウント作成" : "ログイン"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500 dark:text-[#71767b]">
                            {isSignUp ? "すでにアカウントをお持ちですか？" : "アカウントをお持ちでないですか？"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 font-bold text-indigo-600 dark:text-[#1d9bf0] hover:underline"
                            >
                                {isSignUp ? "ログイン" : "新規登録"}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
