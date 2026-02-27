"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy } from 'lucide-react';

interface CompetitiveLeaderboardProps {
    data: {
        model: string;
        visibility: number;
        brand: string;
    }[];
}

const COLORS = ['#007AFF', '#34C759', '#FFCC00', '#5856D6', '#FF2D55'];

export default function CompetitiveLeaderboard({ data }: CompetitiveLeaderboardProps) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-2xl h-full flex flex-col group hover:border-[#007AFF]/20 transition-all">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-bold tracking-tighter text-black font-serif italic uppercase flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-[#FFCC00]" />
                        Model Leaderboard
                    </h3>
                    <p className="text-[10px] font-mono font-bold text-black/20 uppercase tracking-[0.2em] mt-1">Cross-Architecture Visibility Analysis</p>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#00000008" />
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis
                            dataKey="model"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#0000004d', fontSize: 10, fontWeight: 700 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                        />
                        <Bar
                            dataKey="visibility"
                            radius={[0, 10, 10, 0]}
                            barSize={32}
                            animationDuration={2000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-black/20 uppercase">Inference Engine v3.0.1</span>
                <span className="text-[10px] font-mono font-bold text-[#34C759]">SYNC: REAL-TIME</span>
            </div>
        </div>
    );
}
