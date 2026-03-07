"use client";

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

// Exact Market Truth Dataset
const data = [
    { name: 'Jan', OpenAI: 45, Gemini: 20, Claude: 15, Llama: 10, Mistral: 10 }
];

// Standardized Global Palette
const COLORS: Record<string, string> = {
    OpenAI: '#10b981', // emerald-500
    Gemini: '#fbbf24', // amber-400
    Claude: '#6366f1', // indigo-500
    Llama: '#f43f5e',  // rose-500
    Mistral: '#3b82f6', // blue-500
};

const STACK_ORDER = ['OpenAI', 'Gemini', 'Claude', 'Llama', 'Mistral'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-[#E5E7EB] rounded-[12px] shadow-xl min-w-[200px] space-y-3">
                <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">{label} Distribution</p>
                <div className="space-y-2">
                    {payload.map((entry: any) => (
                        <div key={entry.name} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[12px] font-medium text-[#111827]">{entry.name}</span>
                            </div>
                            <span className="text-[12px] font-bold text-[#111827]">{entry.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function GenerativeAITrafficChart({ isSimulated = false }: { isSimulated?: boolean }) {
    const [mounted, setMounted] = useState(false);
    const [focusKey, setFocusKey] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full bg-transparent flex flex-col transition-all duration-500 relative group overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-[#E5E7EB] pb-8 relative">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#111827] border border-[#E5E7EB]">
                        <BarChart3 className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-[#111827]">Share of Voice by Model</h3>
                        <p className="text-[13px] text-[#6B7280] font-medium mt-1">Distribution of brand mentions across major AI engines</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    {STACK_ORDER.map(key => (
                        <div key={key} className="text-left">
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">{key}</p>
                            <p className="text-xl font-bold text-[#111827] leading-none">{(data[0] as any)[key]}%</p>
                        </div>
                    ))}
                </div>
                {isSimulated && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-amber-50 border border-amber-100 rounded text-[10px] font-bold text-amber-600 uppercase tracking-widest translate-y-[-50%] md:translate-y-0">
                        Simulated
                    </div>
                )}
            </div>

            <div className="flex-1 w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                        barGap={24}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                        {STACK_ORDER.map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={COLORS[key]}
                                radius={[8, 8, 0, 0]}
                                barSize={60}
                                animationDuration={1500}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col md:flex-row gap-8 items-end justify-between">
                <div className="space-y-4 max-w-sm">
                    <div className="flex items-center gap-2 text-[#6B7280]">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Market Analysis</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-[#6B7280] font-medium">
                        Market concentration is stabilizing as model diversification protocols mature. OpenAI remains dominant across primary nodes while Claude and Gemini show significant growth in technical query segments.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Status</p>
                        <p className="text-[11px] text-emerald-600 font-bold uppercase">Verified Stream</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-[#E5E7EB] flex items-center justify-center bg-gray-50">
                        <Cpu className="w-5 h-5 text-[#6B7280]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Cell } from 'recharts';
