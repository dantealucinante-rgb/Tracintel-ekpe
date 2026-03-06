"use client";

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Network, TrendingUp, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Realistic market share data
const data = [
    { name: 'Today', OpenAI: 45, Gemini: 20, Claude: 15, Llama: 10, Mistral: 10, delta: '+5.1%' },
];

const STACK_ORDER = ['OpenAI', 'Gemini', 'Claude', 'Llama', 'Mistral'];

const COLORS: Record<string, string> = {
    OpenAI: '#10b981', // emerald-500
    Gemini: '#fbbf24', // amber-400
    Claude: '#6366f1', // indigo-500
    Llama: '#f43f5e',  // rose-500
    Mistral: '#0ea5e9', // sky-500
};

export default function TrafficShareChart() {
    const [mounted, setMounted] = useState(false);
    const [focusKey, setFocusKey] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full bg-transparent flex flex-col transition-all duration-500 group">
            <div className="flex flex-col lg:flex-row gap-16 h-full">
                <div className="flex-1 flex flex-col min-h-[600px]">
                    <div className="flex items-start justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tighter text-black uppercase font-serif">Deep Funnel Saturation</h3>
                            <div className="mt-4 flex flex-wrap gap-4">
                                {Object.keys(COLORS).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setFocusKey(focusKey === key ? null : key)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                            focusKey === key ? "bg-black text-white" : "bg-black/5 text-black/40 hover:bg-black/10"
                                        )}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[key] }} />
                                        {key}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black">
                            <Network className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex-1 w-full relative min-h-[600px] p-6 lg:p-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                stackOffset="expand"
                                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="1 5" vertical={false} stroke="#e4e4e7" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '-0.02em' }}
                                    dy={15}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#00000030', fontSize: 11, fontWeight: 800 }}
                                />
                                <Tooltip content={<HighDensityTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />

                                <Bar isAnimationActive={true} dataKey="Mistral" stackId="a" fill={COLORS.Mistral} fillOpacity={focusKey && focusKey !== 'Mistral' ? 0.2 : 1} animationDuration={1500} animationEasing="ease-in-out" className="transition-opacity duration-300" />
                                <Bar isAnimationActive={true} dataKey="Claude" stackId="a" fill={COLORS.Claude} fillOpacity={focusKey && focusKey !== 'Claude' ? 0.2 : 1} animationDuration={1500} animationEasing="ease-in-out" className="transition-opacity duration-300" />
                                <Bar isAnimationActive={true} dataKey="Llama" stackId="a" fill={COLORS.Llama} fillOpacity={focusKey && focusKey !== 'Llama' ? 0.2 : 1} animationDuration={1500} animationEasing="ease-in-out" className="transition-opacity duration-300" />
                                <Bar isAnimationActive={true} dataKey="Gemini" stackId="a" fill={COLORS.Gemini} fillOpacity={focusKey && focusKey !== 'Gemini' ? 0.2 : 1} animationDuration={1500} animationEasing="ease-in-out" className="transition-opacity duration-300" />
                                <Bar isAnimationActive={true} dataKey="OpenAI" stackId="a" fill={COLORS.OpenAI} fillOpacity={focusKey && focusKey !== 'OpenAI' ? 0.2 : 1} animationDuration={1500} animationEasing="ease-in-out" className="transition-opacity duration-300" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tactical Logic Sidebar — Clearly separated */}
                <div className="lg:w-72 flex flex-col justify-end pb-4 border-t lg:border-t-0 lg:border-l border-black/5 pt-12 lg:pt-0 lg:pl-16">
                    <div className="flex items-center gap-3 mb-8">
                        <Cpu className="w-4 h-4 text-black/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 whitespace-nowrap">
                            // Tactical Logic
                        </span>
                    </div>

                    <div className="space-y-8">
                        <div className="p-6 italic">
                            <p className="text-[12px] leading-relaxed text-black/40 font-medium tracking-tighter">
                                <span className="text-black font-bold uppercase tracking-tight not-italic">Amber Engine</span> market parity achieved in technical nodes. Tracintel detects a weight-adjustment favoring <span className="text-black font-bold">Provenance-Proofing</span> over raw token generation.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-black/40">
                                <span>Signal Consistency</span>
                                <span className="text-emerald-500">Locked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[11px] font-bold text-black uppercase tracking-widest">AEO Buffer Optimal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-black/5 flex items-center justify-between">
                <p className="text-[10px] font-black font-mono text-black/20 uppercase tracking-[0.2em] leading-relaxed">
                    Epoch: Alpha-9 | Manifold Accuracy: 99.82%
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Validated_State</span>
                </div>
            </div>
        </div>
    );
}

const HighDensityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const delta = payload[0].payload.delta;
        return (
            <div className="bg-white p-6 border border-black/5 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[220px]">
                <div className="flex items-center justify-between gap-8 mb-4 border-b border-black/5 pb-2">
                    <p className="text-xs font-bold text-black uppercase tracking-widest font-mono">{label} Segment</p>
                    <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-mono font-bold">Δ {delta}</div>
                </div>
                <div className="space-y-4">
                    {payload.slice().reverse().map((entry: any, i: number) => {
                        const citationRank = Math.floor(Math.random() * 20) + 80;
                        return (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between gap-8">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase tracking-tighter">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                        {entry.name}
                                    </span>
                                    <span className="font-bold text-black text-xs font-serif">
                                        {(entry.value * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-mono text-black/20 ml-4 uppercase">
                                    <span>Citation: #{citationRank}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-5 pt-4 border-t border-black/5 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-black/30" />
                    <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Active Market Shift</span>
                </div>
            </div>
        );
    }
    return null;
};
