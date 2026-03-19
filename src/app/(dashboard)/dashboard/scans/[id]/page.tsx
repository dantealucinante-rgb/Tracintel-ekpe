"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    RefreshCw,
    TrendingUp,
    ShieldCheck,
    Globe,
    Zap,
    Activity,
    AlertCircle,
    CheckCircle2,
    Search,
    Brain,
    Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import useSWR from 'swr';
import { DashboardSkeleton } from '@/components/dashboard/Skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ScanDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: scan, error, isLoading } = useSWR(`/api/scans/${id}`, fetcher);

    if (isLoading) return <div className="p-12"><DashboardSkeleton /></div>;
    if (error || !scan) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle className="w-12 h-12 text-[#DC2626] mb-4" />
            <h2 className="text-[18px] font-bold text-[#111827]">Scan not found</h2>
            <p className="text-[#6B7280] mt-1">We couldn't retrieve the details for this scan.</p>
            <Link href="/dashboard/scans" className="mt-6 text-[#2563EB] font-bold text-[14px]">Back to Scans</Link>
        </div>
    );

    const metrics = [
        { label: 'Mention Frequency', value: `${Math.round(scan.metrics.mentionFrequency * 100)}%`, icon: TrendingUp },
        { label: 'Sentiment Score', value: `${Math.round(scan.metrics.sentimentScore * 100)}%`, icon: Activity },
        { label: 'Citation Density', value: `${Math.round(scan.metrics.citationDensity * 100)}%`, icon: Globe },
        { label: 'Latent Authority', value: `${Math.round(scan.metrics.latentDensity * 100)}%`, icon: ShieldCheck }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 space-y-10 max-w-[1400px] mx-auto min-h-screen"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link
                        href="/dashboard/scans"
                        className="inline-flex items-center gap-2 text-[12px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 hover:text-[#2563EB] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Scanning History
                    </Link>
                    <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight">{scan.brand} – Landscape Audit</h1>
                    <p className="text-[#6B7280] mt-1 text-[15px] font-medium">Captured on {new Date(scan.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="h-11 px-6 bg-white border border-[#E5E7EB] text-[#111827] text-[13px] font-bold rounded-[8px] hover:bg-[#F7F8FA] transition-all flex items-center gap-2 shadow-sm">
                        <Zap className="w-4 h-4 text-[#2563EB]" />
                        Re-run Scan
                    </button>
                    <button className="h-11 px-6 bg-[#2563EB] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#1D4ED8] transition-all shadow-sm">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white border border-[#E5E7EB] rounded-[10px] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <m.icon className="w-5 h-5 text-[#2563EB]" />
                            <span className="text-[10px] font-bold text-[#16A34A] bg-[#16A34A]/[0.05] px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">{m.label}</p>
                        <p className="text-[32px] font-bold text-[#111827] tracking-tight">{m.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Intelligence Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h3 className="text-[18px] font-medium text-[#111827] mb-6 flex items-center gap-3">
                            <Brain className="w-5 h-5 text-[#2563EB]" />
                            AI Sentiment Narrative
                        </h3>
                        <div className="prose prose-slate max-w-none text-[#6B7280] leading-relaxed text-[15px] font-medium space-y-4">
                            <p>
                                The following analysis represents the semantic weighting of <strong>{scan.brand}</strong> across the <strong>{scan.industry}</strong> sector, synthesized from multiple model inference points.
                            </p>
                            <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] p-6 italic font-medium">
                                "Overall, {scan.brand} is perceived as a high-authority leader in {scan.industry}. LLM sentiment benchmarks indicate strong alignment with technical innovation and enterprise reliability, though citation density suggests a need for increased mentions in non-indexed research repositories."
                            </div>
                            <p>
                                <strong>Optimization Strategy:</strong> To improve citation ranking, we recommend hardening of knowledge-layer metadata to ensure deterministic model grounding during retrieval-augmented generation (RAG) cycles.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="px-8 py-5 bg-[#F7F8FA] border-b border-[#E5E7EB]">
                            <h3 className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Model Breakdown
                            </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Object.entries(scan.perModelScores || {}).map(([model, data]: [string, any], i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] font-bold text-[#111827]">{model.toUpperCase()}</span>
                                        <span className="text-[11px] font-bold text-[#2563EB]">{data.score}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#F7F8FA] rounded-full overflow-hidden border border-[#E5E7EB]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data.score}%` }}
                                            className="h-full bg-[#2563EB]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Healthy</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Comparative Data */}
                <div className="space-y-8">
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h3 className="text-[15px] font-bold text-[#111827] mb-8 flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#2563EB]" />
                            Competitive Context
                        </h3>
                        <div className="space-y-6">
                            {(scan.competitors || []).map((comp: string, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[14px] font-bold text-[#111827]">{comp}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-1 bg-[#F7F8FA] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#E5E7EB]"
                                                style={{ width: `${60 - (i * 10)}%` }}
                                            />
                                        </div>
                                        <span className="text-[12px] font-bold text-[#6B7280]">{60 - (i * 10)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB] mb-4">Strategic Insight</h3>
                            <p className="text-[14px] text-[#111827] leading-relaxed font-medium">
                                "The semantic gap between <strong>{scan.brand}</strong> and top competitors is closing. Recommend deploying a latent narrative shift focusing on <strong>'Technical Scalability'</strong> to regain a 5% margin in LLM ranking."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
