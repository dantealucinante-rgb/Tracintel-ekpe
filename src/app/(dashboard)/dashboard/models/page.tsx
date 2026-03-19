"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Info, BarChart, Binary, ShieldCheck, CheckCircle2, XCircle, Brain, Target, Layers, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { ChevronRight } from 'lucide-react';
import HallucinationAlert from '@/components/dashboard/HallucinationAlert';
import { DashboardSkeleton } from '@/components/dashboard/Skeleton';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BIAS_DATA = [
    { name: 'GPT-4o', luxury: 85, budget: 42, logic: 98 },
    { name: 'Claude 3.5', luxury: 62, budget: 88, logic: 84 },
    { name: 'Gemini 1.5', luxury: 75, budget: 70, logic: 92 },
];

const MODELS_STATIC = [
    {
        name: 'GPT-4o',
        tag: 'The Logic King',
        description: 'Optimized for technical specifications, high-density comparisons, and deterministic reasoning. Ideal for complex product logic.',
        provider: 'openai',
        bias: 'Technical/Premium'
    },
    {
        name: 'Claude 3.5 Sonnet',
        tag: 'The Narrator',
        description: 'Best-in-class brand storytelling and sentiment alignment. Traverses conversational nuances with constitutional constraints.',
        provider: 'anthropic',
        bias: 'Nuanced/Ethical'
    },
    {
        name: 'Gemini 1.5 Pro',
        tag: 'The Librarian',
        description: 'Massive context window indexing for SGE visibility. Deeply integrated with Google Search knowledge graphs.',
        provider: 'gemini',
        bias: 'Data-Centric/Scale'
    },
];

export default function ModelsPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [showAuthOverlay, setShowAuthOverlay] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) setShowAuthOverlay(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const { data: statsData, isLoading: statsLoading } = useSWR('/api/dashboard/stats', fetcher);
    const { data: scans = [], isLoading: scansLoading } = useSWR('/api/scans', fetcher);
    const [health, setHealth] = useState<any>(null);
    const isLoading = statsLoading || scansLoading;

    const stats = user ? statsData : { latest: true }; // Simplified guest check

    useEffect(() => {
        fetch('/api/models/health')
            .then(res => res.json())
            .then(data => setHealth(data))
            .catch(err => console.error("Failed to fetch health:", err));
    }, []);

    if (statsLoading) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] text-[#374151] font-sans pb-20">
                <div className="container mx-auto px-6 pt-24">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (!stats?.latest) {
        return (
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-[10px] bg-white border border-[#E5E7EB] flex items-center justify-center mb-8 shadow-sm">
                    <Target className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827] mb-2">Models in Stasis</h2>
                <p className="text-[14px] text-[#6B7280] max-w-sm mb-8 leading-relaxed">Latent bias mapping requires comparative inference results. Run a system scan to benchmark model responses.</p>
                <button
                    onClick={() => {
                        if (!user) {
                            setShowAuthOverlay(true);
                        } else {
                            window.location.href = "/dashboard";
                        }
                    }}
                    className="h-12 px-8 bg-[#2563EB] text-white text-[14px] font-medium rounded-[8px] flex items-center gap-3 hover:bg-[#1D4ED8] transition-all"
                >
                    <Zap className="w-4 h-4" />
                    Compute Baseline Benchmark
                </button>
            </div>
        );
    }

    const modelStats = useMemo(() => {
        const statsMap: Record<string, any> = {
            'gemini': { name: 'Gemini 1.5 Pro', id: 'gemini', scans: 0, freq: 0, sentiment: 0, density: 0, tag: 'The Librarian' },
            'gpt-4o-mini': { name: 'GPT-4o Mini', id: 'gpt-4o-mini', scans: 0, freq: 0, sentiment: 0, density: 0, tag: 'The Logic King' },
            'claude-3-5-sonnet': { name: 'Claude 3.5 Sonnet', id: 'claude-3-5-sonnet', scans: 0, freq: 0, sentiment: 0, density: 0, tag: 'The Narrator' },
        };

        scans.forEach((scan: any) => {
            const providerUsed = scan.providerUsed?.toLowerCase() || 'gemini';
            const s = statsMap[providerUsed];
            if (s) {
                s.scans += 1;
                s.freq += scan.mentionFrequency || 0;
                s.sentiment += scan.sentimentScore || 0;
                s.density += scan.citationDensity || 0;
            }
        });

        return Object.values(statsMap).map((s: any) => ({
            ...s,
            avgFreq: s.scans ? (s.freq / s.scans) : 0,
            avgSentiment: s.scans ? (s.sentiment / s.scans) : 0,
            avgDensity: s.scans ? (s.density / s.scans) : 0,
        }));
    }, [scans]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto min-h-screen"
        >
            {/* Page Header */}
            <div>
                <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight mb-2">
                    Model Comparison & Recommendation Logic
                </h1>
                <p className="text-[#6B7280] text-[15px] font-medium max-w-2xl leading-relaxed">
                    AI models are not neutral. Each architecture possesses a unique semantic bias.
                    We benchmark the primary LLMs to identify which engine is currently prioritizing your brand signal.
                </p>
            </div>

            {/* Connection Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'openai', label: 'OpenAI Stack', icon: Cpu },
                    { id: 'anthropic', label: 'Anthropic Core', icon: Brain },
                    { id: 'gemini', label: 'Google Gemini', icon: Activity },
                ].map((provider) => {
                    const status = health?.[provider.id] || "Inactive";
                    const isActive = status === "Active";

                    return (
                        <div key={provider.id} className="bg-white border border-[#E5E7EB] rounded-[10px] p-6 flex items-center justify-between shadow-sm hover:border-[#2563EB]/20 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-[#E5E7EB] bg-[#F7F8FA] group-hover:bg-white",
                                    isActive ? "text-[#2563EB]" : "text-[#6B7280]"
                                )}>
                                    <provider.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{provider.label}</div>
                                    <div className="text-[13px] text-[#111827] font-bold">Status: {status}</div>
                                </div>
                            </div>
                            {isActive ? (
                                <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
                            ) : (
                                <XCircle className="h-5 w-5 text-[#DC2626]" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Model Deep Dive */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Triad Model Cards */}
                    {/* Model Intelligence Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {modelStats.map((model, i) => (
                            <div key={i} className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm relative overflow-hidden group hover:border-[#2563EB]/20 transition-all">
                                <h3 className="text-[#111827] font-bold text-[16px] mb-1">{model.name}</h3>
                                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-6">{model.tag}</div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-[#F7F8FA] px-3 py-2 rounded-[6px]">
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Total Audits</span>
                                        <span className="text-[12px] font-bold text-[#111827]">{model.scans}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#F7F8FA] px-3 py-2 rounded-[6px]">
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Mention Freq</span>
                                        <span className="text-[12px] font-bold text-[#111827]">{(model.avgFreq * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#F7F8FA] px-3 py-2 rounded-[6px]">
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Sentiment</span>
                                        <span className="text-[12px] font-bold text-[#111827]">{(model.avgSentiment * 100).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#F7F8FA] px-3 py-2 rounded-[6px]">
                                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Citation Density</span>
                                        <span className="text-[12px] font-bold text-[#111827]">{(model.avgDensity * 100).toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#F7F8FA] flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Status:</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                        <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">Trained</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benchmark Writeup */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h2 className="text-[18px] font-medium text-[#111827] mb-6 flex items-center gap-3">
                            Inference Parameters & Recommendation Logic
                        </h2>
                        <div className="space-y-6 text-[15px] text-[#6B7280] leading-relaxed font-medium">
                            <p>
                                When an AI model recommends your brand, its decision-making is governed by critical hyperparameters like <strong className="text-[#111827]">Temperature</strong> and <strong className="text-[#111827]">Top-P</strong>. These settings determine whether a model is deterministic or creative.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                                <div className="bg-[#F7F8FA] border border-[#E5E7EB] p-8 rounded-[8px]">
                                    <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3">Grounding Control</h4>
                                    <p className="text-[13px] text-[#6B7280]">
                                        Deterministic modes prioritize brands with high factual density and technical groundedness.
                                    </p>
                                </div>
                                <div className="bg-[#F7F8FA] border border-[#E5E7EB] p-8 rounded-[8px]">
                                    <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3">Sampling Threshold</h4>
                                    <p className="text-[13px] text-[#6B7280]">
                                        Filters out brands with low semantic weight, ensuring only primary authority sources are cited.
                                    </p>
                                </div>
                            </div>
                            <p>
                                By saturating the model manifolds with deterministic data, we ensure your brand remains a high-probability prediction across all inference cycles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Bias Analysis */}
                <div className="lg:col-span-4 space-y-8">
                    <HallucinationAlert />

                    {/* Bias Chart Panel */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest mb-10 text-[#6B7280] flex items-center justify-between">
                            Model Specific Biases
                            <Target className="h-4 w-4 text-[#2563EB]" />
                        </h3>

                        <div className="space-y-10">
                            {BIAS_DATA.map((data, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
                                        <span>{data.name} Displacement</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-bold text-[#6B7280] uppercase tracking-tighter">
                                                <span>Luxury</span>
                                                <span className="text-[#111827]">{data.luxury}%</span>
                                            </div>
                                            <div className="h-1 bg-[#F7F8FA] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${data.luxury}%` }}
                                                    className="h-full bg-[#2563EB]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-bold text-[#6B7280] uppercase tracking-tighter">
                                                <span>Budget</span>
                                                <span className="text-[#111827]">{data.budget}%</span>
                                            </div>
                                            <div className="h-1 bg-[#F7F8FA] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${data.budget}%` }}
                                                    className="h-full bg-[#E5E7EB]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-[#6B7280] tracking-widest">Benchmark Sync:</span>
                            <span className="text-[10px] font-bold text-[#16A34A] tracking-widest">OPTIMAL</span>
                        </div>
                    </div>

                    {/* Inference Latency */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-8 pb-4 border-b border-[#F7F8FA]">Inference Latency</h4>
                        <div className="space-y-6 text-[13px]">
                            <div className="flex justify-between items-center group cursor-default">
                                <span className="#6B7280 font-medium group-hover:text-[#111827] transition-colors">GPT-4o Response</span>
                                <span className="text-[#111827] font-bold bg-[#F7F8FA] px-2 py-0.5 rounded">1.2s</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-default">
                                <span className="#6B7280 font-medium group-hover:text-[#111827] transition-colors">Claude 3.5 Response</span>
                                <span className="text-[#111827] font-bold bg-[#F7F8FA] px-2 py-0.5 rounded">0.8s</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-default">
                                <span className="#6B7280 font-medium group-hover:text-[#111827] transition-colors">Gemini 1.5 Response</span>
                                <span className="text-[#111827] font-bold bg-[#F7F8FA] px-2 py-0.5 rounded">1.4s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategy Recommendation */}
            <section className="bg-white border border-[#E5E7EB] rounded-[10px] p-10 shadow-sm">
                <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    <div className="md:w-1/3">
                        <h2 className="text-[24px] font-semibold text-[#111827] leading-tight mb-4 tracking-tight">Tactical Recommendation</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Enterprise Tier Priority</div>
                    </div>
                    <div className="md:w-2/3 space-y-6 text-[15px] text-[#6B7280] leading-relaxed font-medium">
                        <p>
                            Calibration for model alignment is critical. GPT-4, Claude, and Gemini each interpret your brand signals through different deterministic manifolds.
                        </p>
                        <p>
                            We recommend a <strong className="text-[#2563EB]">Triad Calibration Protocol</strong>. Harden your factual data for GPT-4, refine your sentiment narrative for Claude, and ensure Knowledge Graph synchronization for Gemini.
                        </p>
                    </div>
                </div>
            </section>

            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
