"use client";

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface SentimentHeatmapProps {
    data: {
        day: string;
        trust: number;
    }[];
}

export default function SentimentHeatmap({ data }: SentimentHeatmapProps) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-2xl h-full flex flex-col group hover:border-[#34C759]/20 transition-all">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-bold tracking-tighter text-black font-serif italic uppercase flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-[#34C759]" />
                        Trust Heatmap
                    </h3>
                    <p className="text-[10px] font-mono font-bold text-black/20 uppercase tracking-[0.2em] mt-1">30-Day Sentiment Volatility</p>
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
                            backgroundColor: `rgba(52, 199, 89, ${Math.max(0.1, item.trust / 100)})`,
                            border: item.trust > 90 ? '1.5px solid #34C759' : 'none'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/80 rounded-lg">
                            <span className="text-[9px] font-mono font-bold text-white">{item.trust}%</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-black/20 font-bold uppercase">
                    <span>Low</span>
                    <div className="w-20 h-2 bg-gradient-to-r from-green-50 to-green-500 rounded-full" />
                    <span>Extreme</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#34C759] uppercase">Bias: Verified</span>
            </div>
        </div>
    );
}
