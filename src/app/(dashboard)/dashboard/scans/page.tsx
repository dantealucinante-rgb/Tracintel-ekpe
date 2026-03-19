"use client";

import { motion } from 'framer-motion';
import { Search, Calendar, ChevronRight, BarChart3, ArrowRight, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ScansPage() {
    const [scans, setScans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchScans() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch scans via API or direct prisma if it was a server component, 
            // but for simplicity and consistency with current client patterns:
            const response = await fetch('/api/scans');
            if (response.ok) {
                const data = await response.json();
                setScans(data);
            }
            setIsLoading(false);
        }
        fetchScans();
    }, [supabase.auth]);

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight">Intelligence Scans</h1>
                    <p className="text-[#6B7280] mt-1 text-[14px] font-medium">Historical visibility benchmarks and engine analysis.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#111827] hover:bg-[#F7F8FA] transition-all">
                        <Filter className="w-4 h-4" />
                        Refine Search
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-3 px-6 py-2.5 bg-[#2563EB] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#1D4ED8] transition-all uppercase tracking-widest">
                        New Engine Sweep
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E5E7EB] bg-[#F7F8FA]">
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Brand Name</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">LLM Used</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Mention Freq</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Sentiment</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Citation Density</th>
                                <th className="px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-8 py-6 h-20 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : scans.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-[#F7F8FA] rounded-full flex items-center justify-center mb-4 text-[#6B7280] border border-[#E5E7EB]">
                                                <Search className="w-5 h-5" />
                                            </div>
                                            <p className="text-slate-900 font-bold text-[16px]">No benchmarks recorded</p>
                                            <p className="text-[#6B7280] text-[14px] mt-1 font-medium">Sweep the generative landscape to begin data ingestion.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                scans.map((scan) => (
                                    <tr
                                        key={scan.id}
                                        onClick={() => window.location.href = `/dashboard/scans/${scan.id}`}
                                        className="group hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[12px] font-bold text-[#2563EB]">
                                                    {scan.brand?.[0]?.toUpperCase() || 'B'}
                                                </div>
                                                <span className="text-[14px] font-bold text-[#111827]">{scan.brand}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#94A3B8]" />
                                                <span className="text-[13px] font-medium text-[#6B7280]">
                                                    {new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[13px] font-semibold text-[#111827]">{scan.provider || 'Gemini Pro'}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[14px] font-bold text-[#111827]">{Math.round((scan.mentionFrequency || 0) * 100)}%</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                (scan.sentimentScore || 0) > 0.7 ? "bg-[#16A34A]/[0.08] text-[#16A34A]" :
                                                    (scan.sentimentScore || 0) < 0.4 ? "bg-[#DC2626]/[0.08] text-[#DC2626]" :
                                                        "bg-[#D97706]/[0.08] text-[#D97706]"
                                            )}>
                                                <div className={cn("w-1 h-1 rounded-full",
                                                    (scan.sentimentScore || 0) > 0.7 ? "bg-[#16A34A]" :
                                                        (scan.sentimentScore || 0) < 0.4 ? "bg-[#DC2626]" :
                                                            "bg-[#D97706]"
                                                )} />
                                                {(scan.sentimentScore || 0) > 0.7 ? 'Positive' : (scan.sentimentScore || 0) < 0.4 ? 'Negative' : 'Neutral'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[14px] font-bold text-[#111827]">{Math.round((scan.citationDensity || 0) * 100)}%</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <ChevronRight className="w-4 h-4 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Simple Pagination */}
                <div className="px-8 py-4 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#6B7280]">Showing {scans.length} results</span>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-2 text-[#6B7280] disabled:opacity-30 hover:text-[#2563EB]">
                            <motion.span whileHover={{ x: -2 }}>← Previous</motion.span>
                        </button>
                        <button disabled className="p-2 text-[#6B7280] disabled:opacity-30 hover:text-[#2563EB]">
                            <motion.span whileHover={{ x: 2 }}>Next →</motion.span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
