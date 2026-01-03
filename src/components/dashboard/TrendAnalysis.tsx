import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ComposedChart,
    Line,
} from 'recharts';
import { type TrendData, getTagColorHex, DEFAULT_TAGS } from '@/lib/reportUtils';

type Props = {
    data: TrendData[];
    onGenerateSample?: () => void;
};

export function TrendAnalysis({ data, onGenerateSample }: Props) {
    if (data.length < 2) {
        return (
            <div className="p-12 text-center text-slate-500 dark:text-[#71767b] bg-white dark:bg-black rounded-lg shadow-sm border border-slate-100 dark:border-[#2f3336]">
                <div className="text-4xl mb-4">📉</div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-[#e7e9ea] mb-2">
                    データが不足しています
                </h3>
                <p className="text-sm mb-6">
                    トレンド分析を表示するには、少なくとも2週間分の週報データが必要です。
                </p>
                {onGenerateSample && (
                    <button
                        onClick={onGenerateSample}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        過去のサンプルデータを生成する
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Weekly Focus Time */}
                <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-slate-100 dark:border-[#2f3336]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#e7e9ea] mb-6 flex items-center gap-2">
                        <span>⏱️</span> 週間フォーカス時間
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#71767b' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#71767b' }} unit="h" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #2f3336', boxShadow: 'none', backgroundColor: '#000', color: '#e7e9ea' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar
                                    dataKey="focusTime"
                                    name="実稼働(時間)"
                                    fill="#1d9bf0"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Task Volume & Completion Rate */}
                <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-slate-100 dark:border-[#2f3336]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#e7e9ea] mb-6 flex items-center gap-2">
                        <span>📊</span> タスク消化率
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#71767b' }} />
                                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#71767b' }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#71767b' }} unit="%" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #2f3336', boxShadow: 'none', backgroundColor: '#000', color: '#e7e9ea' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar
                                    yAxisId="left"
                                    dataKey="doneCount"
                                    name="完了数"
                                    fill="#71767b"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                    opacity={0.5}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="completionRate"
                                    name="完了率(%)"
                                    stroke="#00ba7c"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#00ba7c', strokeWidth: 2, stroke: '#000' }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. Tag Distribution Trend */}
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-slate-100 dark:border-[#2f3336]">
                <h3 className="text-lg font-bold text-slate-800 dark:text-[#e7e9ea] mb-6 flex items-center gap-2">
                    <span>🎨</span> タスク分野別 時間推移（タグ分析）
                </h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#71767b' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#71767b' }} unit="h" />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #2f3336', boxShadow: 'none', backgroundColor: '#000', color: '#e7e9ea' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            {DEFAULT_TAGS.map((tag) => (
                                <Bar
                                    key={tag}
                                    dataKey={tag}
                                    name={tag}
                                    stackId="a"
                                    fill={getTagColorHex(tag)}
                                // radius is tricky with stack, let's keep it simple
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
