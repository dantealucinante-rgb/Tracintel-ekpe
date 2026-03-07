"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompetitiveLeaderboardProps {
    data: {
        model: string;
        visibility: number;
        brand: string;
    }[];
    isSimulated?: boolean;
}

const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ef4444', '#cbd5e1'];

export default function CompetitiveLeaderboard({ data, isSimulated = false }: CompetitiveLeaderboardProps) {
    return (
        <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-8 shadow-sm h-full flex flex-col group transition-all">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Leaderboard by Model
                    </h3>
                    <p className="text-[13px] text-[#6B7280] font-medium mt-1">Visibility analysis across different architectures</p>
                </div>
                {isSimulated && (
                    <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                        Simulated
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis
                            dataKey="model"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                        />
                        <Bar
                            dataKey="visibility"
                            radius={[0, 4, 4, 0]}
                            barSize={32}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Engine v3.0.1</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Real-time Sync</span>
            </div>
        </div>
    );
}
