"use client";

import { useEffect, useState } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ReferenceLine,
    ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Shield, MapPin, ArrowUp, ArrowDown, Info, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

const data = [
    { date: 'Jan 1', visibility: 45.0, sentiment: 90, OpenAI: 45.0, Gemini: 20.0, Claude: 15.0, Llama: 10.0, Mistral: 10.0, delta: '+5.1%', insight: "Verified Truth" },
];

const STACK_ORDER = ['OpenAI', 'Gemini', 'Claude', 'Llama', 'Mistral'];

const COLORS = {
    Tracintel: '#007AFF', // Electric Blue
    OpenAI: '#10b981',   // emerald-500
    Gemini: '#fbbf24',   // amber-400
    Claude: '#6366f1',   // indigo-500
    Llama: '#f43f5e',    // rose-500
    Mistral: '#0ea5e9',  // sky-500
};

export default function BrandIntelligenceGraph() {
    const [mounted, setMounted] = useState(false);
    const [focusKey, setFocusKey] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full bg-transparent flex flex-col transition-all duration-500 group">

            <div className="flex flex-col xl:flex-row gap-8 mb-12 items-end justify-between">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    <MetricCard label="Visibility Vector" value={82} suffix="%" icon={Activity} trend={12} />
                    <MetricCard label="Trust Score" value={90} suffix="" icon={Shield} trend={5} />
                    <MetricCard label="Latent Position" value={1.8} suffix="" icon={MapPin} isPosition inverse trend={-0.4} />
                    <MetricCard label="Citation Peak" value={94} suffix="%" icon={TrendingUp} trend={8} />
                </div>
                <div className="flex flex-wrap gap-3 p-4 bg-black/5 rounded-[2rem] border border-black/5">
                    {Object.keys(COLORS).map(key => (
                        <button
                            key={key}
                            onClick={() => setFocusKey(focusKey === key ? null : key)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                focusKey === key ? "bg-black text-white" : "bg-white text-black/40 hover:text-black shadow-sm"
                            )}
                        >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (COLORS as any)[key] }} />
                            {key}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[600px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.Tracintel} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={COLORS.Tracintel} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="1 5" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '-0.02em' }}
                            dy={15}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tick={{ fill: '#00000030', fontSize: 11, fontWeight: 800 }}
                            tickFormatter={(val) => `${val}%`}
                        />
                        <Tooltip content={<HighDensityTooltip />} cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }} />

                        {data.map((entry: any, i: number) => entry.event && (
                            <ReferenceLine
                                key={i}
                                x={entry.date}
                                stroke={COLORS.Gemini}
                                strokeDasharray="3 3"
                                label={{ position: 'top', value: entry.event, fill: COLORS.Gemini, fontSize: 9, fontWeight: 800, offset: 10 }}
                            />
                        ))}

                        <Area
                            isAnimationActive={true}
                            type="monotone"
                            dataKey="visibility"
                            stroke={COLORS.Tracintel}
                            strokeWidth={2}
                            fill="url(#visGrad)"
                            fillOpacity={focusKey && focusKey !== 'Tracintel' ? 0.2 : 1}
                            strokeOpacity={focusKey && focusKey !== 'Tracintel' ? 0.2 : 1}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                            className="transition-opacity duration-300"
                        />

                        <Area
                            isAnimationActive={true}
                            type="monotone"
                            dataKey="OpenAI"
                            stroke={COLORS.OpenAI}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="transparent"
                            strokeOpacity={focusKey && focusKey !== 'OpenAI' ? 0.1 : 1}
                            animationDuration={2000}
                            className="transition-opacity duration-300"
                        />

                        <Area
                            isAnimationActive={true}
                            type="monotone"
                            dataKey="Gemini"
                            stroke={COLORS.Gemini}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="transparent"
                            strokeOpacity={focusKey && focusKey !== 'Gemini' ? 0.1 : 1}
                            animationDuration={2500}
                            className="transition-opacity duration-300"
                        />

                        <Area
                            isAnimationActive={true}
                            type="monotone"
                            dataKey="Claude"
                            stroke={COLORS.Claude}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="transparent"
                            strokeOpacity={focusKey && focusKey !== 'Claude' ? 0.1 : 1}
                            animationDuration={2800}
                            className="transition-opacity duration-300"
                        />

                        <Area
                            isAnimationActive={true}
                            type="monotone"
                            dataKey="Llama"
                            stroke={COLORS.Llama}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="transparent"
                            strokeOpacity={focusKey && focusKey !== 'Llama' ? 0.1 : 1}
                            animationDuration={3000}
                            className="transition-opacity duration-300"
                        />

                        <Area
                            isAnimationActive={true}
                            type="monotone"
                            dataKey="Mistral"
                            stroke={COLORS.Mistral}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="transparent"
                            strokeOpacity={focusKey && focusKey !== 'Mistral' ? 0.1 : 1}
                            animationDuration={3200}
                            className="transition-opacity duration-300"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-12 pt-8 border-t border-black/5 flex flex-col xl:flex-row gap-10 items-end">
                <div className="flex-1">
                    <p className="text-[10px] font-mono font-black text-black/20 uppercase tracking-[0.3em] mb-4 group-hover:text-black/30 transition-colors">
                        // Latent Trajectory Analysis
                    </p>
                    <p className="text-xs leading-relaxed text-slate-500 font-medium tracking-tighter max-w-2xl">
                        Brand visibility is locked into a <span className="text-black font-bold">Positive Sentiment Loop</span> across Emerald and Amber nodes. Recommended action: amplify technical provenance metadata to consolidate 1.8 ranking.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                    <div>
                        <p className="text-[9px] text-black/20 font-bold uppercase tracking-widest mb-1">Source Validated</p>
                        <p className="text-[10px] text-black font-mono font-bold tracking-tighter uppercase">Proprietary_Manifold</p>
                    </div>
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
                    <p className="text-xs font-bold text-black uppercase tracking-widest font-mono">{label}</p>
                    <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-mono font-bold">Δ {delta}</div>
                </div>
                <div className="space-y-4">
                    {payload.map((entry: any, i: number) => {
                        const citationRank = Math.floor(Math.random() * 20) + 80;
                        return (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between gap-6">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase tracking-tighter">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill }} />
                                        {entry.name}
                                    </span>
                                    <span className="font-bold text-black text-xs font-serif">
                                        {Number(entry.value).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-mono text-black/20 ml-4 uppercase">
                                    <span>Citation: #{citationRank}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

function MetricCard({ label, value, suffix, icon: Icon, trend, isPosition, inverse }: any) {
    const isPositive = trend > 0;
    const isGood = inverse ? !isPositive : isPositive;

    return (
        <div className="p-8 group flex flex-col justify-between min-h-[160px] bg-transparent">
            <div className="flex items-start justify-between w-full">
                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black">
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={cn(
                        "font-black tracking-tighter flex items-center gap-1",
                        isGood ? "text-emerald-500" : "text-amber-500"
                    )}>
                        {isPositive ? '+' : '-'}{Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter text-black font-serif italic leading-tight text-left">
                        {value}{suffix}
                    </span>
                </div>
            </div>
        </div>
    );
}
