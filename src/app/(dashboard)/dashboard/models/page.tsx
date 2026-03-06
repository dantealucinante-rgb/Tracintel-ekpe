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
            <div className="min-h-screen bg-[#09090b] text-[#a1a1aa] font-sans pb-20">
                <div className="container mx-auto px-6 pt-24">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (!stats?.latest) {
        return (
            <div className="min-h-screen bg-[#09090b] text-[#a1a1aa] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 animate-pulse text-white/10">
                    <Target className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tighter text-white font-serif italic mb-4">Models in Stasis</h2>
                <p className="text-sm text-zinc-500 max-w-sm mb-10 leading-relaxed font-medium">Latent bias mapping requires comparative inference results. Run a system scan to benchmark model responses.</p>
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
                    className="h-16 px-10 bg-white text-black text-sm font-bold rounded-2xl flex items-center gap-3 hover:bg-zinc-200 transition-all font-mono tracking-widest uppercase"
                >
                    <Zap className="w-4 h-4 text-[#007AFF]" />
                    Compute Baseline Benchmark
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-[#a1a1aa] font-sans pb-20 selection:bg-[#007AFF] selection:text-white">
            {/* Top Bar */}
            <div className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#5856D6] animate-pulse" />
                            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#5856D6]">Protocol: TRIAD_BENCHMARK_v1</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden md:block">Logic_Mode: Multi_Inference</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-10 space-y-10">
                {/* Hero Section */}
                <div className="max-w-4xl">
                    <h1 className="text-6xl font-extrabold tracking-tighter text-white font-serif italic mb-6">
                        The Triad of <span className="text-[#007AFF]">Recommendation Logic</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed max-w-2xl text-zinc-400">
                        Large Language Models (LLMs) are not neutral. Each architecture possesses a unique semantic bias.
                        We benchmark GPT-4o, Claude 3.5, and Gemini 1.5 to calculate which {"\""}Inference King{"\""} is currently prioritizing your brand signal.
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
                            <div key={provider.id} className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-[#007AFF]/20 transition-all backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                        isActive ? "bg-[#007AFF]/5 text-[#007AFF]" : "bg-white/5 text-white/10"
                                    )}>
                                        <provider.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{provider.label}</div>
                                        <div className="text-[11px] font-mono text-white/60 font-bold uppercase">Status: {status}</div>
                                    </div>
                                </div>
                                {isActive ? (
                                    <CheckCircle2 className="h-5 w-5 text-[#34C759]" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-white/10" />
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
                                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Layers className="h-12 w-12 text-[#007AFF]" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">{model.name}</h3>
                                    <div className="text-[10px] font-mono font-bold text-[#007AFF] uppercase tracking-widest mb-4">{model.tag}</div>
                                    <p className="text-xs text-zinc-500 font-light leading-relaxed">{model.description}</p>
                                    <div className="mt-6 pt-6 border-t border-white/5">
                                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Primary Bias:</div>
                                        <span className="text-[10px] font-mono text-zinc-400 font-bold">{model.bias}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Benchmark Writeup */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group">
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 flex items-center gap-3 italic font-serif">
                                <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                                    <Binary className="h-4 w-4 text-[#007AFF]" />
                                </div>
                                Temperature vs. Top-P: The Recommendation Threshold
                            </h2>
                            <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed">
                                <p className="text-lg mb-8 text-zinc-300">
                                    When an AI model recommends your brand, its decision-making is governed by two critical hyperparameters: <strong>Temperature</strong> and <strong>Top-P (Nucleus Sampling)</strong>. These settings determine whether a model is "creative" or "deterministic."
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
                                    <div className="bg-black/40 border border-white/5 p-8 rounded-3xl">
                                        <h4 className="text-[#007AFF] text-xs font-mono font-bold uppercase mb-4 tracking-widest">Temperature (Entropy Control)</h4>
                                        <p className="text-xs text-zinc-500 mb-4">
                                            Temperature controls the "flatness" of the probability distribution. At T=0.2, the model is highly deterministic—it will only cite the most verified factual nodes. At T=0.8, it becomes more creative, often pulling from "hallucinated" edge-case training data.
                                        </p>
                                        <div className="text-[10px] font-mono text-white/20 italic">
                                            Impact: Low Temperature favors brands with high technical groundedness.
                                        </div>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 p-8 rounded-3xl">
                                        <h4 className="text-[#34C759] text-xs font-mono font-bold uppercase mb-4 tracking-widest">Top-P (Sample Filter)</h4>
                                        <p className="text-xs text-zinc-500 mb-4">
                                            Top-P limits the model to a "nucleus" of tokens whose cumulative probability is P. If P=0.1, the model only considers the top 10% of likely words. If your brand isn't in this top 10% bracket, it will never be recommended, regardless of logic.
                                        </p>
                                        <div className="text-[10px] font-mono text-white/20 italic">
                                            Impact: Top-P filters out brands with low semantic weight density.
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-6">Winning the Zero-Shot Inference Cycle</h3>
                                <p className="mb-6">
                                    To ensure your store is recommended across all sampling thresholds, Tracintel implements <strong>Inference Hardening</strong>. We saturate the latent manifold with so many deterministic technical specifications that your brand's token probability remains high even at P=0.05. This means that even in the most "strict" logic modes (zero temperature), the LLM still arrives at your product as the optimal solution.
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
                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-black/5 pb-4">Inference Speed Avg</h4>
                            <div className="space-y-4 font-mono text-[10px]">
                                <div className="flex justify-between">
                                    <span className="text-white/40 italic">OpenAI Latency</span>
                                    <span className="text-[#007AFF]">1.2s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40 italic">Anthropic Latency</span>
                                    <span className="text-[#007AFF]">0.8s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40 italic">Gemini Latency</span>
                                    <span className="text-[#007AFF]">1.4s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategy Recommendation */}
                <section className="bg-white/5 border border-white/5 rounded-[3rem] p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007AFF]/50 to-transparent" />
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-4xl font-bold tracking-tighter text-white font-serif italic mb-6">Strategic <br /> Recommendation</h2>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Revenue Tier: Enterprise ($10k+/mo)</div>
                        </div>
                        <div className="md:w-2/3 prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed">
                            <p className="text-lg mb-8">
                                For high-earning Shopify merchants, the most common pitfall is attempting a {"\""}one-size-fits-all{"\""} SEO approach to AI. At this scale, you are not just competing for keywords; you are competing for <strong>Model Alignment</strong>. GPT-4o, Claude 3.5, and Gemini 1.5 all interpret your brand data through different lens, and you must calibrate your metadata for each.
                            </p>
                            <p className="text-lg">
                                We recommend a <strong>Triad Optimization Protocol</strong>. For GPT-4o, you must harden your product data with technical specifications—LLMs assign logic-weight to detailed attribute matrices. For Claude 3.5, pivot your content strategy toward storytelling and positive community validation—Claude is highly sensitive to the {"\""}Sentiment Manifold{"\""} and will de-prioritize brands with clinical or generic descriptions. Finally, for Gemini 1.5, ensure your brand is deeply integrated into Google{"'"}s knowledge graphs. Use schema markups that link directly to your high-authority unindexed sources to anchor Gemini{"'"}s librarian logic.
                            </p>
                            <p className="text-lg mt-8">
                                Use the <strong>Bias Displacement Chart</strong> in our dashboard to identify which model is currently {"\""}undervaluing{"\""} your brand. If you see high luxury-displacement in GPT-4o but low visibility in Claude, it means your technical specs are clear but your brand narrative is thin. At the $10k/month revenue level, your priority should be balancing these biases to ensure that no matter which model a high-intent customer uses, your brand appears as the inevitable, top-tier recommendation.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </div>
    );
}
