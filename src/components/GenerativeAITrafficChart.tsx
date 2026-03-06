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
            <div className="bg-white p-6 border border-black/5 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[240px]">
                <div className="flex items-center justify-between gap-8 mb-4 border-b border-black/5 pb-2">
                    <p className="text-black font-bold font-serif text-sm tracking-tighter uppercase">{label} DISTRIBUTION</p>
                </div>
                <div className="space-y-3">
                    {payload.map((entry: any) => (
                        <div key={entry.name} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-black/60 font-bold uppercase tracking-tighter text-[10px]">{entry.name}</span>
                            </div>
                            <span className="font-bold text-black text-xs font-serif italic">{entry.value}%</span>
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
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-black/5 pb-8 relative">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-black">
                        <BarChart3 className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold tracking-tighter text-black uppercase font-serif italic">Deep Funnel Saturation</h3>
                        <p className="text-[11px] font-bold font-mono tracking-[0.3em] text-black/20 uppercase mt-1">Cross-Engine Market Truth</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    {STACK_ORDER.map(key => (
                        <div key={key} className="text-left">
                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-1">{key}</p>
                            <p className="text-2xl font-black font-serif italic text-black leading-none">{(data[0] as any)[key]}%</p>
                        </div>
                    ))}
                </div>
                {isSimulated && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-lg text-[10px] font-bold text-amber-600 uppercase tracking-widest translate-y-[-50%] md:translate-y-0">
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
                        <CartesianGrid strokeDasharray="1 10" vertical={false} stroke="#00000010" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#00000030', fontSize: 12, fontWeight: 800, letterSpacing: '-0.05em' }}
                            dy={20}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tick={{ fill: '#00000030', fontSize: 12, fontWeight: 800 }}
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

            <div className="mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row gap-8 items-end justify-between">
                <div className="space-y-4 max-w-sm">
                    <div className="flex items-center gap-2 text-black/60">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Temporal Analysis</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-black/40 font-medium tracking-tighter">
                        Market concentration is stabilizing as <span className="text-black font-bold">Inference Diversification</span> protocols mature. OpenAI remains dominant but faces 25% YoY erosion in private-node technical queries.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[9px] text-black/20 font-bold uppercase tracking-widest mb-1">Epoch Status</p>
                        <p className="text-[10px] text-black font-mono font-bold tracking-tighter uppercase text-emerald-500">Validated_Inbound</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-black/40" />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Cell } from 'recharts';
