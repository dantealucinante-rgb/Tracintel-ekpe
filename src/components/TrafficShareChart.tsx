"use client";

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

const data = [
    {
        name: 'Jan',
        OpenAI: 85,
        Gemini: 5,
        Claude: 2,
        Others: 8
    },
    {
        name: 'Feb',
        OpenAI: 80,
        Gemini: 8,
        Claude: 3,
        Others: 9
    },
    {
        name: 'Mar',
        OpenAI: 75,
        Gemini: 12,
        Claude: 4,
        Others: 9
    },
    {
        name: 'Apr',
        OpenAI: 70,
        Gemini: 15,
        Claude: 5,
        Others: 10
    },
    {
        name: 'May',
        OpenAI: 65,
        Gemini: 20,
        Claude: 5,
        Others: 10
    },
];

const COLORS = {
    Tracintel: '#007AFF',
    OpenAI: '#34C759',
    Gemini: '#FFCC00',
    Claude: '#5856D6',
};

export default function TrafficShareChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-full bg-white rounded-2xl border border-black/5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col transition-colors duration-300 hover:border-black/20 group"
        >
            <div className="flex flex-col lg:flex-row gap-10 h-full">
                <div className="flex-1 flex flex-col min-h-[350px]">
                    <h3 className="text-xl font-bold tracking-tighter text-black uppercase font-serif mb-6">Aggregate Traffic Growth</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                stackOffset="expand"
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
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
                                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#0000004d', fontSize: 10, fontWeight: 600 }}
                                />
                                <Tooltip
                                    formatter={(value: any) => `${(Number(value) * 100).toFixed(0)}%`}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                                    }}
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                />
                                <Legend
                                    iconType="circle"
                                    verticalAlign="top"
                                    align="right"
                                    wrapperStyle={{ paddingBottom: '20px' }}
                                />
                                <Bar
                                    dataKey="Gemini"
                                    stackId="a"
                                    fill={COLORS.Gemini}
                                    isAnimationActive={true}
                                    animationDuration={1500}
                                />
                                <Bar
                                    dataKey="OpenAI"
                                    stackId="a"
                                    fill={COLORS.OpenAI}
                                    isAnimationActive={true}
                                    animationDuration={1500}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Trend Analysis Sidebar */}
                <div className="lg:w-48 flex flex-col justify-end pb-4 border-t lg:border-t-0 lg:border-l border-black/5 pt-8 lg:pt-0 lg:pl-10">
                    <div className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.3em] mb-4 group-hover:text-black/50 transition-colors">
                        // Trend Analysis
                    </div>
                    <p className="text-[11px] leading-relaxed text-black/50 font-medium">
                        Gemini market share increased by <span className="text-black font-bold">4.2%</span> this quarter. Tracintel detects a direct correlation between model update cycles and <span className="text-black italic">brand citation volatility</span>.
                    </p>
                </div>
            </div>

            {/* Data Footnote */}
            <div className="mt-8 pt-6 border-t border-black/5">
                <p className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-wider leading-relaxed">
                    Statistical Noise Threshold: ±0.4%. Model citations audited for latent semantic relevance and brand positioning consistency.
                </p>
            </div>
        </motion.div>
    );
}
