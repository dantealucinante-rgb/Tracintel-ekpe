"use client";

import { useEffect, useState, useRef } from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ReferenceLine,
    ComposedChart
} from 'recharts';
import { useMotionValue, animate, useMotionValueEvent } from 'framer-motion';
import { Activity, TrendingUp, Shield, MapPin, ArrowUp, ArrowDown } from 'lucide-react';

// High-fidelity data with dates, insights, and model breakdown
const data = [
    { name: 'Jan 1', date: 'Jan 1', visibility: 40, sentiment: 65, OpenAI: 45, Gemini: 30, Claude: 35, Perplexity: 25, insight: "Baseline performance" },
    { name: 'Jan 15', date: 'Jan 15', visibility: 42, sentiment: 68, OpenAI: 46, Gemini: 32, Claude: 36, Perplexity: 28, insight: "Minor algorithm update" },
    { name: 'Feb 1', date: 'Feb 1', visibility: 45, sentiment: 70, OpenAI: 48, Gemini: 35, Claude: 38, Perplexity: 30, insight: "Content optimization began" },
    { name: 'Feb 15', date: 'Feb 15', visibility: 48, sentiment: 73, OpenAI: 50, Gemini: 40, Claude: 42, Perplexity: 35, insight: "Gemini 1.5 Pro update favored brand" },
    { name: 'Mar 1', date: 'Mar 1', visibility: 55, sentiment: 75, OpenAI: 55, Gemini: 50, Claude: 45, Perplexity: 38, insight: "Viral mention in AI overview" },
    { name: 'Mar 15', date: 'Mar 15', visibility: 58, sentiment: 72, OpenAI: 60, Gemini: 48, Claude: 50, Perplexity: 42, insight: "Competitor campaign launched" },
    { name: 'Apr 1', date: 'Apr 1', visibility: 63, sentiment: 85, OpenAI: 65, Gemini: 60, Claude: 55, Perplexity: 50, insight: "Strategic partnership announced" },
    { name: 'Apr 15', date: 'Apr 15', visibility: 65, sentiment: 82, OpenAI: 68, Gemini: 65, Claude: 58, Perplexity: 55, insight: "Positive sentiment in Claude" },
    { name: 'May 1', date: 'May 1', visibility: 70, sentiment: 88, OpenAI: 72, Gemini: 70, Claude: 60, Perplexity: 60, insight: "Record high engagement" },
    { name: 'May 15', date: 'May 15', visibility: 72, sentiment: 86, OpenAI: 75, Gemini: 72, Claude: 65, Perplexity: 62, insight: "Stable growth across models" },
];

const MODELS = [
    { name: 'Tracintel', color: '#007AFF' },
    { name: 'OpenAI', color: '#34C759' },
    { name: 'Gemini', color: '#FFCC00' },
    { name: 'Claude', color: '#5856D6' },
];

export default function BrandIntelligenceGraph() {
    const [mounted, setMounted] = useState(false);
    const [activeModels, setActiveModels] = useState<string[]>([]);

    // Toggle model visibility
    const toggleModel = (modelName: string) => {
        setActiveModels(prev =>
            prev.includes(modelName)
                ? prev.filter(name => name !== modelName)
                : [...prev, modelName]
        );
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full h-full bg-white rounded-2xl border border-black/5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden p-6 md:p-8 flex flex-col transition-colors duration-300 hover:border-black/20 group">

            <div className="flex flex-col md:flex-row gap-8 mb-6">
                {/* Metrics Column */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <MetricCard
                        label="AI Visibility"
                        value={72}
                        suffix="%"
                        icon={Activity}
                        trend={12}
                        trendLabel="vs last 30d"
                    />
                    <MetricCard
                        label="AI Trust Score"
                        value={88}
                        suffix=""
                        icon={Shield}
                        trend={5}
                        trendLabel="vs last 30d"
                    />
                    <MetricCard
                        label="Avg Position"
                        value={2.4}
                        suffix=""
                        icon={MapPin}
                        inverse
                        trend={-0.8}
                        trendLabel="ranking improved"
                        isPosition
                    />
                    <MetricCard
                        label="Citation Freq"
                        value={94}
                        suffix="%"
                        icon={TrendingUp}
                        trend={8}
                        trendLabel="vs last 30d"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm font-medium text-slate-500 mr-2">Compare Models:</span>
                {MODELS.map((model) => (
                    <button
                        key={model.name}
                        onClick={() => toggleModel(model.name)}
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5
                            ${activeModels.includes(model.name)
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }
                        `}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: model.color }}
                        />
                        {model.name}
                    </button>
                ))}
            </div>

            {/* Graph Column */}
            <div className="flex-1 min-h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34C759" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000a" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#0000004d', fontSize: 10, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />

                        <ReferenceLine y={85} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Industry Avg', fill: '#94a3b8', fontSize: 10 }} />

                        {/* Base Metrics - Always visible unless hidden explicitly (design choice to keep them) */}
                        <Area
                            type="monotone"
                            dataKey="visibility"
                            stroke="#007AFF"
                            strokeWidth={1.5}
                            fillOpacity={1}
                            fill="url(#colorVis)"
                            name="Overall Visibility"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="sentiment"
                            stroke="#34C759"
                            strokeWidth={1.5}
                            fillOpacity={1}
                            fill="url(#colorSen)"
                            name="AI Trust Score"
                            animationDuration={2000}
                        />

                        {/* Comparative Lines */}
                        {activeModels.map(modelName => {
                            const model = MODELS.find(m => m.name === modelName);
                            if (!model) return null;
                            return (
                                <Line
                                    key={modelName}
                                    type="monotone"
                                    dataKey={modelName}
                                    stroke={model.color}
                                    strokeWidth={1.5}
                                    dot={false}
                                    animationDuration={2500}
                                />
                            );
                        })}

                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Data Footnote */}
            <div className="mt-8 pt-6 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-[10px] font-mono font-bold text-black/30 leading-relaxed max-w-md uppercase tracking-wider">
                    Source: Tracintel Proprietary Crawler. Data normalized against a 30-day rolling average of 1.2M synthetic queries across 14 global LLM endpoints.
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black/5" />
                    <span className="text-[10px] font-mono font-bold text-black/20 uppercase tracking-[0.2em]">Validated Inference Layer</span>
                </div>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload;
        return (
            <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl max-w-xs">
                <p className="text-slate-500 text-xs font-semibold mb-1">{dataPoint.date}</p>
                <p className="text-slate-900 text-sm font-medium mb-3">{dataPoint.insight}</p>

                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill }} />
                                {entry.name || entry.dataKey}
                            </span>
                            <span className="font-semibold text-slate-900">
                                {Number(entry.value).toFixed(1)}
                                {entry.name === 'Avg Position' ? '' : '%'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

function MetricCard({
    label,
    value,
    suffix,
    icon: Icon,
    inverse = false,
    trend,
    trendLabel,
    isPosition = false
}: any) {
    const ref = useRef<HTMLSpanElement>(null);
    const count = useMotionValue(0);

    useEffect(() => {
        const controls = animate(count, value, { duration: 2.5, ease: "circOut" });
        return controls.stop;
    }, [value, count]);

    useMotionValueEvent(count, "change", (latest: number) => {
        if (ref.current) {
            const formatted = inverse || isPosition
                ? latest.toFixed(1)
                : Math.round(latest).toString();
            ref.current.textContent = formatted;
        }
    });

    const isPositive = trend > 0;
    const trendColor = "text-black bg-black/5";
    const TrendIcon = isPositive ? ArrowUp : ArrowDown;

    return (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
            <div className="flex w-full items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-white border border-black/5 text-black">
                    <Icon className="h-4 w-4" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trendColor}`}>
                        <TrendIcon className="h-3 w-3" />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-bold text-black flex items-baseline mb-1 tracking-tighter">
                <span ref={ref} className="font-serif">0</span>
                <span className="text-sm font-normal text-black/40 ml-1">{suffix}</span>
            </div>
            {trendLabel && (
                <div className="text-xs text-slate-400 font-medium">
                    {trendLabel}
                </div>
            )}
        </div>
    )
}
