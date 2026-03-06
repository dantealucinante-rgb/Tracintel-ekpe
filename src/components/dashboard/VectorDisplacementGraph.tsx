"use client";

import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VectorDisplacementProps {
    data: {
        x: number; // Intent Alignment
        y: number; // Semantic Distance
        z: number; // Resonance
        keyword: string;
    }[];
}

export default function VectorDisplacementGraph({ data }: VectorDisplacementProps) {
    return (
        <div className="bg-black text-white rounded-[3rem] border border-white/5 p-10 shadow-2xl h-full flex flex-col group">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-bold tracking-tighter text-white font-serif italic uppercase flex items-center gap-3">
                        <Target className="w-6 h-6 text-[#007AFF]" />
                        Vector Displacement
                    </h3>
                    <p className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Latent Space Keyword Alignment</p>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Intent Alignment"
                            unit="%"
                            stroke="#ffffff1a"
                            fontSize={10}
                            tick={{ fill: '#ffffff33' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Semantic Distance"
                            stroke="#ffffff1a"
                            fontSize={10}
                            tick={{ fill: '#ffffff33' }}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Resonance" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff1a', borderRadius: '12px' }}
                        />
                        <Scatter
                            name="Keywords"
                            data={data}
                            fill="#007AFF"
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#007AFF' : '#ffffff22'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-white/10 italic">Core Displacement: 0.042rad</span>
                <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                </div>
            </div>
        </div>
    );
}
