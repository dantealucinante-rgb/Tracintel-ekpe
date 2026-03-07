"use client";

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentHeatmapProps {
    data: {
        day: string;
        trust: number;
    }[];
}

export default function SentimentHeatmap({ data }: SentimentHeatmapProps) {
    return (
        <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-8 shadow-sm h-full flex flex-col group transition-all">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        Sentiment Trend Map
                    </h3>
                    <p className="text-[13px] text-[#6B7280] font-medium mt-1">Analysis of brand perception over the last 30 days</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-6 md:grid-cols-10 gap-2">
                {data.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="aspect-square rounded-lg relative group/item"
                        style={{
                            backgroundColor: `rgba(16, 185, 129, ${Math.max(0.1, item.trust / 100)})`,
                            border: item.trust > 90 ? '1.5px solid #10b981' : 'none'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity bg-[#111827]/90 rounded-lg">
                            <span className="text-[10px] font-bold text-white">{item.trust}%</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                    <span>Low</span>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-50 to-emerald-500 rounded-full" />
                    <span>High</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Validated</span>
            </div>
        </div>
    );
}
