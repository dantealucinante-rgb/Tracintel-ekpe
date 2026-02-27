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

// Data from user request
const data = [
    {
        name: '12mo ago',
        OpenAI: 85,
        Gemini: 5,
        DeepSeek: 0,
        Grok: 0,
        Perplexity: 2,
        Claude: 2,
        Copilot: 3,
        Meta: 1,
        Huggingface: 1,
        Manus: 0,
        Other: 1,
    },
    {
        name: '6mo ago',
        OpenAI: 80,
        Gemini: 10,
        DeepSeek: 0,
        Grok: 0,
        Perplexity: 3,
        Claude: 2,
        Copilot: 2,
        Meta: 1,
        Huggingface: 1,
        Manus: 0,
        Other: 1,
    },
    {
        name: '3mo ago',
        OpenAI: 75,
        Gemini: 15,
        DeepSeek: 1,
        Grok: 1,
        Perplexity: 3,
        Claude: 2,
        Copilot: 1,
        Meta: 1,
        Huggingface: 0.5,
        Manus: 0,
        Other: 0.5,
    },
    {
        name: '1mo ago',
        OpenAI: 70,
        Gemini: 18,
        DeepSeek: 3,
        Grok: 2,
        Perplexity: 3,
        Claude: 1,
        Copilot: 1,
        Meta: 1,
        Huggingface: 0.5,
        Manus: 0.2,
        Other: 0.3,
    },
    {
        name: 'Today',
        OpenAI: 65,
        Gemini: 20,
        DeepSeek: 5,
        Grok: 3,
        Perplexity: 3,
        Claude: 1,
        Copilot: 1,
        Meta: 1,
        Huggingface: 0.5,
        Manus: 0.3,
        Other: 0.2,
    },
];

// Colors for each model
const COLORS = {
    OpenAI: '#007AFF', // High-signal Electric Blue
    Gemini: '#000000',
    DeepSeek: '#1A1A1A',
    Grok: '#333333',
    Perplexity: '#4D4D4D',
    Claude: '#666666',
    Copilot: '#808080',
    Meta: '#999999',
    Huggingface: '#B3B3B3',
    Manus: '#CCCCCC',
    Other: '#E6E6E6',
};

// Stack order (bottom to top)
const STACK_ORDER = [
    'Other', 'Manus', 'Huggingface', 'Meta', 'Copilot', 'Claude', 'Perplexity', 'Grok', 'DeepSeek', 'Gemini', 'OpenAI'
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-black/5 rounded-lg shadow-lg">
                <p className="text-black font-semibold mb-2 font-serif">{label}</p>
                {payload.slice().reverse().map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-black/40 w-24">{entry.name}:</span>
                        <span className="font-bold text-black ml-auto font-serif">{entry.value}%</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function GenerativeAITrafficChart() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-full bg-white rounded-2xl border border-black/5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col transition-colors duration-300 hover:border-black/20 group"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tighter text-black uppercase font-serif">Market Share Distribution</h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-black/40 font-bold">12 month historical span</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 0, // Legend is outside or adjusted
                            left: -20, // Pull closer to edge
                            bottom: 0,
                        }}
                        barSize={40}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000a" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#0000004d', fontSize: 10, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#0000004d', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{
                                fontSize: '10px',
                                color: 'rgba(0,0,0,0.4)',
                                paddingLeft: '20px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}
                            formatter={(value) => <span className="text-black/40 font-bold ml-1">{value}</span>}
                        />
                        {STACK_ORDER.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                fill={COLORS[key as keyof typeof COLORS]}
                                animationDuration={1500}
                                radius={index === STACK_ORDER.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Data Footnote */}
            <div className="mt-8 pt-6 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-wider leading-relaxed max-w-md">
                    Note: Market share reflects citation frequency in commercial intent queries. Data sourced from the Tracintel LLM-Crawler network.
                </p>
                <div className="text-[9px] font-mono font-bold text-black/20 uppercase tracking-[0.2em]">Updated hourly</div>
            </div>
        </motion.div>
    );
}
