"use client";

import { motion } from 'framer-motion';
import { Target, Shield, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const AUTHORITY_DATA = [
    { source: 'Common Crawl (Primary)', authority: 'CRITICAL', reach: 'GLOBAL', weight: 0.95 },
    { source: 'Reddit (Top-Tier Subs)', authority: 'HIGH', reach: 'COMMUNITY', weight: 0.88 },
    { source: 'ArXiv / Tech Journals', authority: 'ELITE', reach: 'VERIFIED', weight: 0.98 },
    { source: 'Discord Private Logs (Leaked)', authority: 'MEDIUM', reach: 'HIDDEN', weight: 0.72 },
    { source: 'Generic News Outlets', authority: 'LOW', reach: 'MASS', weight: 0.45 },
    { source: 'Niche Engineering Blogs', authority: 'HIGH', reach: 'SPECIALIZED', weight: 0.92 },
];

export default function AIAuthorityTable() {
    return (
        <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2 uppercase font-mono">
                    <Shield className="h-4 w-4 text-[#007AFF]" />
                    AI Authority Ranking Matrix
                </h3>
                <div className="text-[10px] font-mono text-white/20 uppercase">Weight_Alpha_v4</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#007AFF]">Information Node</th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center">Authority Level</th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Training Weight</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-[11px]">
                        {AUTHORITY_DATA.map((row, i) => (
                            <tr key={i} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors group px-4">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] shadow-[0_0_5px_rgba(0,122,255,0.5)]" />
                                        <span className="text-white/80 group-hover:text-white transition-colors">{row.source}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter",
                                        row.authority === 'CRITICAL' || row.authority === 'ELITE' ? "bg-[#34C759]/10 text-[#34C759]" :
                                            row.authority === 'HIGH' ? "bg-[#007AFF]/10 text-[#007AFF]" :
                                                "bg-white/5 text-zinc-500"
                                    )}>
                                        {row.authority}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right font-bold">
                                    <div className="flex items-center justify-end gap-3 text-white">
                                        <span>{(row.weight * 100).toFixed(0)}%</span>
                                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${row.weight * 100}%` }}
                                                className="h-full bg-[#007AFF]"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-start gap-3">
                <Info className="h-4 w-4 text-[#007AFF] mt-0.5" />
                <p className="text-[10px] leading-relaxed text-zinc-500 italic">
                    Note: Training weight indicates the statistical probability of a node being selected as a citation source during zero-shot inference. Critical nodes are prioritized by OpenAI and Anthropic stack.
                </p>
            </div>
        </div>
    );
}
