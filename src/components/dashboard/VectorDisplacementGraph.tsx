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
        <div className="bg-white text-[#111827] rounded-[24px] border border-[#E5E7EB] p-8 shadow-sm h-full flex flex-col group transition-all">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#111827]" />
                        Keyword Alignment Map
                    </h3>
                    <p className="text-[13px] text-[#6B7280] font-medium mt-1">Analysis of keyword positioning in latent space</p>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Intent Alignment"
                            unit="%"
                            stroke="#E5E7EB"
                            fontSize={11}
                            tick={{ fill: '#6B7280', fontWeight: 500 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Semantic Distance"
                            stroke="#E5E7EB"
                            fontSize={11}
                            tick={{ fill: '#6B7280', fontWeight: 500 }}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Resonance" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Scatter
                            name="Keywords"
                            data={data}
                            fill="#111827"
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#111827' : '#E5E7EB'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Displacement: 0.042rad</span>
                <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                </div>
            </div>
        </div>
    );
}
