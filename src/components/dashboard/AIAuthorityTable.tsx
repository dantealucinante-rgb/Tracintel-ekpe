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
        <div className="bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight text-[#111827] flex items-center gap-2 uppercase">
                    <Shield className="h-4 w-4 text-[#111827]" />
                    Intelligence Source Authority
                </h3>
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Weight Alpha v4</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] bg-gray-50/30">
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#111827]">Source Node</th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#6B7280] text-center">Authority</th>
                            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#6B7280] text-right">Influence</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px]">
                        {AUTHORITY_DATA.map((row, i) => (
                            <tr key={i} className="border-b border-[#E5E7EB] last:border-0 hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                                        <span className="text-[#374151] group-hover:text-[#111827] font-medium transition-colors">{row.source}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight",
                                        row.authority === 'CRITICAL' || row.authority === 'ELITE' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                            row.authority === 'HIGH' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                "bg-gray-50 text-gray-500 border border-gray-100"
                                    )}>
                                        {row.authority}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right font-bold">
                                    <div className="flex items-center justify-end gap-3 text-[#111827]">
                                        <span>{(row.weight * 100).toFixed(0)}%</span>
                                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${row.weight * 100}%` }}
                                                className="h-full bg-[#111827]"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-6 bg-gray-50/30 border-t border-[#E5E7EB] flex items-start gap-3">
                <Info className="h-4 w-4 text-[#6B7280] mt-0.5" />
                <p className="text-[11px] leading-relaxed text-[#6B7280] font-medium">
                    Training weight indicates the statistical probability of a node being selected as a citation source. Primary nodes are prioritized by major AI model architectures.
                </p>
            </div>
        </div>
    );
}
