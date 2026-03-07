"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
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
    const [health, setHealth] = useState<any>(null);

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
            <div className="min-h-screen bg-[#F9FAFB] text-[#374151] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-[12px] bg-white border border-[#E5E7EB] flex items-center justify-center mb-8 shadow-sm">
                    <Target className="w-8 h-8 text-[#111827]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#111827] mb-2">Models in Stasis</h2>
                <p className="text-[13px] text-[#6B7280] max-w-sm mb-8 leading-relaxed">Latent bias mapping requires comparative inference results. Run a system scan to benchmark model responses.</p>
                <button
                    onClick={() => {
                        if (!user) {
                            setShowAuthOverlay(true);
                            toast.info("Access Protocol Required", {
                                description: "Verify session to synchronize with model benchmarks."
                            });
                        } else {
                            window.location.href = "/dashboard";
                        }
                    }}
                    className="h-12 px-8 bg-[#111827] text-white text-[13px] font-bold rounded-[8px] flex items-center gap-3 hover:bg-black transition-all"
                >
                    <Zap className="w-4 h-4" />
                    Compute Baseline Benchmark
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 md:p-12 space-y-12 max-w-[1700px] mx-auto"
        >
            {/* Page Header */}
            <div className="max-w-4xl">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-[#101828] tracking-tight">
                    Model Comparison & Recommendation Logic
                </h1>
                <p className="font-sans text-[14px] text-[#667085] leading-relaxed mt-2 max-w-2xl font-medium">
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
                        <div key={provider.id} className="bg-white border border-[#EAECF0] rounded-[16px] p-6 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors border border-[#EAECF0]",
                                    isActive ? "bg-[#F9FAFB] text-[#101828]" : "bg-[#F9FAFB] text-[#98A2B3]"
                                )}>
                                    <provider.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">{provider.label}</div>
                                    <div className="font-sans text-[12px] text-[#101828] font-bold">Status: {status}</div>
                                </div>
                            </div>
                            {isActive ? (
                                <CheckCircle2 className="h-5 w-5 text-[#12B76A]" />
                            ) : (
                                <XCircle className="h-5 w-5 text-[#F04438]" />
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {MODELS_STATIC.map((model, i) => (
                            <div key={i} className="bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                                <h3 className="text-[#101828] font-display font-bold text-[16px] mb-1">{model.name}</h3>
                                <div className="font-sans text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-4">{model.tag}</div>
                                <p className="font-sans text-[13px] text-[#667085] leading-relaxed font-medium">{model.description}</p>
                                <div className="mt-6 pt-6 border-t border-[#EAECF0]">
                                    <div className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-2">Primary Bias:</div>
                                    <span className="font-sans text-[12px] text-[#101828] font-bold">{model.bias}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benchmark Writeup */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                        <h2 className="font-display font-bold text-xl text-[#101828] mb-6 flex items-center gap-3">
                            Inference Parameters & Recommendation Logic
                        </h2>
                        <div className="space-y-6 font-sans text-[14px] text-[#667085] leading-relaxed font-medium">
                            <p>
                                When an AI model recommends your brand, its decision-making is governed by critical hyperparameters like <strong className="text-[#101828]">Temperature</strong> and <strong className="text-[#101828]">Top-P</strong>. These settings determine whether a model is deterministic or creative.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                <div className="bg-[#F9FAFB] border border-[#EAECF0] p-6 rounded-[12px]">
                                    <h4 className="font-sans text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-3">Grounding Control</h4>
                                    <p className="text-[13px] text-[#667085]">
                                        Deterministic modes prioritize brands with high factual density and technical groundedness.
                                    </p>
                                </div>
                                <div className="bg-[#F9FAFB] border border-[#EAECF0] p-6 rounded-[12px]">
                                    <h4 className="font-sans text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-3">Sampling Threshold</h4>
                                    <p className="text-[13px] text-[#667085]">
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
                    <div className="bg-[#0F172A] rounded-[16px] p-8 shadow-xl relative overflow-hidden">
                        <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] mb-10 text-white/70 flex items-center justify-between">
                            Model Specific Biases
                            <Target className="h-4 w-4 text-[#12B76A]" />
                        </h3>

                        <div className="space-y-10">
                            {BIAS_DATA.map((data, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest">
                                        <span>{data.name} Displacement</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-tighter">
                                                <span>Luxury</span>
                                                <span className="text-white">{data.luxury}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${data.luxury}%` }}
                                                    className="h-full bg-[#12B76A]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-tighter">
                                                <span>Budget</span>
                                                <span className="text-white">{data.budget}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${data.budget}%` }}
                                                    className="h-full bg-white/40"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-5 bg-white/[0.03] border border-white/5 rounded-[12px] flex items-center justify-between">
                            <span className="font-sans text-[10px] font-bold uppercase text-white/40">Benchmark Sync:</span>
                            <span className="font-sans text-[10px] font-bold text-[#12B76A]">OPTIMAL</span>
                        </div>
                    </div>

                    {/* Inference Latency */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm transition-all hover:shadow-md">
                        <h4 className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-6 pb-4 border-b border-[#F2F4F7]">Inference Latency</h4>
                        <div className="space-y-4 font-sans text-[13px]">
                            <div className="flex justify-between">
                                <span className="text-[#667085] font-medium">GPT-4 Response</span>
                                <span className="text-[#101828] font-bold">1.2s</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#667085] font-medium">Claude Response</span>
                                <span className="text-[#101828] font-bold">0.8s</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#667085] font-medium">Gemini Response</span>
                                <span className="text-[#101828] font-bold">1.4s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategy Recommendation */}
            <section className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                    <div className="md:w-1/3">
                        <h2 className="font-display font-bold text-[24px] text-[#101828] leading-tight mb-4 tracking-tight">Tactical Recommendation</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F4F7] border border-[#EAECF0] font-sans text-[10px] font-bold text-[#344054] uppercase tracking-wider">Enterprise Tier Priority</div>
                    </div>
                    <div className="md:w-2/3 space-y-6 font-sans text-[14px] text-[#667085] leading-relaxed font-medium">
                        <p>
                            Calibration for model alignment is critical. GPT-4, Claude, and Gemini each interpret your brand signals through different deterministic manifolds.
                        </p>
                        <p>
                            We recommend a <strong className="text-[#101828]">Triad Calibration Protocol</strong>. Harden your factual data for GPT-4, refine your sentiment narrative for Claude, and ensure Knowledge Graph synchronization for Gemini.
                        </p>
                    </div>
                </div>
            </section>

            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
