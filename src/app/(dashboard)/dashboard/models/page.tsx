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
        <div className="min-h-screen bg-[#F9FAFB] text-[#374151] font-sans pb-20">
            {/* Top Bar */}
            <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-[#111827] tracking-wider">Model Benchmarking Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12 space-y-12">
                {/* Hero Section */}
                <div className="max-w-4xl">
                    <h1 className="text-[22px] font-bold text-[#111827] mb-4">
                        Model Comparison {"&"} Recommendation Logic
                    </h1>
                    <p className="text-[14px] text-[#374151] leading-relaxed max-w-2xl">
                        AI models are not neutral. Each architecture possesses a unique semantic bias.
                        We benchmark GPT-4, Claude, and Gemini to identify which model is currently prioritizing your brand signal.
                    </p>
                </div>

                {/* Connection Status Row (Compact) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { id: 'openai', label: 'OpenAI Stack', icon: Cpu },
                        { id: 'anthropic', label: 'Anthropic Core', icon: Brain },
                        { id: 'gemini', label: 'Google Gemini', icon: Activity },
                    ].map((provider) => {
                        const status = health?.[provider.id] || "Inactive";
                        const isActive = status === "Active";

                        return (
                            <div key={provider.id} className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-[8px] flex items-center justify-center transition-colors",
                                        isActive ? "bg-gray-50 text-[#111827]" : "bg-gray-50 text-gray-300"
                                    )}>
                                        <provider.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{provider.label}</div>
                                        <div className="text-[12px] text-[#374151] font-medium">Status: {status}</div>
                                    </div>
                                </div>
                                {isActive ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-gray-200" />
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
                                <div key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 shadow-sm relative overflow-hidden group">
                                    <h3 className="text-[#111827] font-bold text-[16px] mb-1">{model.name}</h3>
                                    <div className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-4">{model.tag}</div>
                                    <p className="text-[13px] text-[#374151] leading-relaxed">{model.description}</p>
                                    <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                                        <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Primary Bias:</div>
                                        <span className="text-[12px] text-[#374151] font-medium">{model.bias}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Benchmark Writeup */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm">
                            <h2 className="text-[18px] font-bold text-[#111827] mb-6 flex items-center gap-3">
                                Inference Parameters {"&"} Recommendation Logic
                            </h2>
                            <div className="space-y-6 text-[14px] text-[#374151] leading-relaxed">
                                <p>
                                    When an AI model recommends your brand, its decision-making is governed by critical hyperparameters like <strong>Temperature</strong> and <strong>Top-P</strong>. These settings determine whether a model is deterministic or creative.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                                    <div className="bg-gray-50 border border-[#E5E7EB] p-6 rounded-[12px]">
                                        <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Grounding Control</h4>
                                        <p className="text-[13px] text-[#374151]">
                                            Deterministic modes prioritize brands with high factual density and technical groundedness.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 border border-[#E5E7EB] p-6 rounded-[12px]">
                                        <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Sampling Threshold</h4>
                                        <p className="text-[13px] text-[#374151]">
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

                        {/* Hallucination Alert System */}
                        <HallucinationAlert />

                        {/* Bias Chart Panel */}
                        <div className="bg-black rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden group">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-12 text-white flex items-center justify-between">
                                Model Specific Biases
                                <Target className="h-4 w-4 text-[#007AFF]" />
                            </h3>

                            <div className="space-y-12">
                                {BIAS_DATA.map((data, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                                            <span>{data.name} Displacement</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                                                    <span>Luxury</span>
                                                    <span>{data.luxury}%</span>
                                                </div>
                                                <div className="h-0.5 bg-white/5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${data.luxury}%` }}
                                                        className="h-full bg-[#007AFF]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                                                    <span>Budget</span>
                                                    <span>{data.budget}%</span>
                                                </div>
                                                <div className="h-0.5 bg-white/5 overflow-hidden">
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

                            <div className="mt-12 p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Benchmark Sync:</span>
                                <span className="text-[10px] font-mono font-bold text-[#34C759]">OPTIMAL</span>
                            </div>
                        </div>

                        {/* Comparison Matrix Small */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 shadow-sm">
                            <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">Inference Latency</h4>
                            <div className="space-y-4 text-[13px]">
                                <div className="flex justify-between">
                                    <span className="text-[#374151] font-medium">GPT-4 Response</span>
                                    <span className="text-[#111827] font-bold">1.2s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#374151] font-medium">Claude Response</span>
                                    <span className="text-[#111827] font-bold">0.8s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#374151] font-medium">Gemini Response</span>
                                    <span className="text-[#111827] font-bold">1.4s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategy Recommendation */}
                <section className="bg-white border border-[#E5E7EB] rounded-[12px] p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-[22px] font-bold text-[#111827] leading-tight mb-4">Tactical Recommendation</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Enterprise Tier Priority</div>
                        </div>
                        <div className="md:w-2/3 space-y-6 text-[14px] text-[#374151] leading-relaxed">
                            <p>
                                Calibration for model alignment is critical. GPT-4, Claude, and Gemini each interpret your brand signals through different deterministic manifolds.
                            </p>
                            <p>
                                We recommend a <strong>Triad Calibration Protocol</strong>. Harden your factual data for GPT-4, refine your sentiment narrative for Claude, and ensure Knowledge Graph synchronization for Gemini.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </div>
    );
}
