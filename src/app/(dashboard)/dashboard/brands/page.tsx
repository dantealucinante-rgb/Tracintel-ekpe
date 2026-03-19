"use client";

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
    ReferenceLine,
    Legend
} from 'recharts';
import { Globe, TrendingUp, Users, Target, Info, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-[#E5E7EB] p-4 rounded-[8px] shadow-sm">
                <p className="text-[13px] font-bold text-[#111827] mb-1">{data.name}</p>
                <div className="space-y-1">
                    <p className="text-[11px] text-[#6B7280] flex justify-between gap-4">
                        <span>Visibility:</span>
                        <span className="font-bold text-[#111827]">{data.x}%</span>
                    </p>
                    <p className="text-[11px] text-[#6B7280] flex justify-between gap-4">
                        <span>Authority:</span>
                        <span className="font-bold text-[#111827]">{data.y}%</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function BrandsPage() {
    const [scans, setScans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchScans() {
            const response = await fetch('/api/scans');
            if (response.ok) {
                const data = await response.json();
                setScans(data);
            }
            setIsLoading(false);
        }
        fetchScans();
    }, []);

    const scatterData = useMemo(() => {
        if (!scans.length) return [];
        const latest = scans[0];
        const result = [
            {
                name: latest.brand,
                x: latest.score,
                y: Math.round((latest.signals?.[0]?.sentimentScore || 0.5) * 100),
                z: 100,
                isBrand: true
            }
        ];

        // Add competitors if available
        if (latest.competitors) {
            latest.competitors.forEach((comp: string, i: number) => {
                result.push({
                    name: comp,
                    x: Math.max(10, Math.min(90, latest.score * (0.6 + Math.random() * 0.3))),
                    y: Math.max(10, Math.min(90, 50 + (Math.random() - 0.5) * 40)),
                    z: 60,
                    isBrand: false
                });
            });
        }
        return result;
    }, [scans]);

    const brandSummary = useMemo(() => {
        if (!scans.length) return [];

        const summary: Record<string, any> = {};

        scans.forEach(scan => {
            const name = scan.brand;
            if (!summary[name]) {
                summary[name] = {
                    name,
                    totalScans: 0,
                    totalMentionFreq: 0,
                    totalSentiment: 0,
                    latestScan: scan.date
                };
            }
            summary[name].totalScans += 1;
            summary[name].totalMentionFreq += scan.mentionFrequency || 0;
            summary[name].totalSentiment += scan.sentimentScore || 0;
            if (new Date(scan.date) > new Date(summary[name].latestScan)) {
                summary[name].latestScan = scan.date;
            }
        });

        return Object.values(summary).map(b => ({
            ...b,
            avgMentionFreq: b.totalMentionFreq / b.totalScans,
            avgSentiment: b.totalSentiment / b.totalScans
        }));
    }, [scans]);

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight">Brand Management</h1>
                    <p className="text-[#6B7280] mt-1 text-[14px] font-medium">Monitor and manage all tracked entities across the generative landscape.</p>
                </div>
                <button
                    onClick={() => { }}
                    className="h-11 px-6 bg-[#2563EB] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#1D4ED8] transition-all shadow-sm flex items-center gap-2"
                >
                    <Target className="w-4 h-4" />
                    Add New Brand
                </button>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E5E7EB] bg-[#F7F8FA]">
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Brand Name</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest text-center">Total Scans</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Avg Mention Freq</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Avg Sentiment</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Latest Audit</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-6 h-16 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : brandSummary.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-[#F7F8FA] rounded-full flex items-center justify-center mb-4 text-[#6B7280] border border-[#E5E7EB]">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <p className="text-slate-900 font-bold text-[16px]">No brands tracked</p>
                                            <p className="text-[#6B7280] text-[14px] mt-1 font-medium">Add a brand to start monitoring visibility.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                brandSummary.map((brand: any, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => window.location.href = `/dashboard/scans?brand=${encodeURIComponent(brand.name)}`}
                                        className="group hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[13px] font-bold text-[#2563EB]">
                                                    {brand.name?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-[14px] font-bold text-[#111827]">{brand.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-[14px] font-bold text-[#111827] bg-[#F7F8FA] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
                                                {brand.totalScans}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-1.5 bg-[#F7F8FA] rounded-full overflow-hidden border border-[#E5E7EB]">
                                                    <div
                                                        className="h-full bg-[#2563EB]"
                                                        style={{ width: `${Math.round(brand.avgMentionFreq * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[13px] font-bold text-[#111827]">
                                                    {Math.round(brand.avgMentionFreq * 100)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                brand.avgSentiment > 0.7 ? "bg-[#16A34A]/[0.08] text-[#16A34A]" :
                                                    brand.avgSentiment < 0.4 ? "bg-[#DC2626]/[0.08] text-[#DC2626]" :
                                                        "bg-[#D97706]/[0.08] text-[#D97706]"
                                            )}>
                                                <div className={cn("w-1 h-1 rounded-full", brand.avgSentiment > 0.7 ? "bg-[#16A34A]" : brand.avgSentiment < 0.4 ? "bg-[#DC2626]" : "bg-[#D97706]")} />
                                                {brand.avgSentiment > 0.7 ? 'Positive' : brand.avgSentiment < 0.4 ? 'Negative' : 'Neutral'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[13px] font-medium text-[#6B7280]">
                                                {new Date(brand.latestScan).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button className="text-[11px] font-bold text-[#6B7280] hover:text-[#2563EB] uppercase tracking-widest">Edit</button>
                                                <button className="text-[11px] font-bold text-[#6B7280] hover:text-[#DC2626] uppercase tracking-widest">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
