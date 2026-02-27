"use client";

import { motion } from 'framer-motion';
import { Settings, Shield, Key, Sliders, Save, LogOut, ChevronRight, Activity, Globe, RefreshCcw, Database, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ApiHealth {
    [key: string]: "Active" | "Inactive" | string;
}

export default function SettingsPage() {
    const [health, setHealth] = useState<ApiHealth | null>(null);
    const [isPersisting, setIsPersisting] = useState(false);

    useEffect(() => {
        fetch('/api/models/health')
            .then(res => res.json())
            .then(data => setHealth(data))
            .catch(err => console.error("Failed to fetch health:", err));
    }, []);

    const handlePersist = async () => {
        setIsPersisting(true);
        // Simulate persistence
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsPersisting(false);
        toast.success("Global Configuration Persisted", {
            description: "Enterprise governance protocols have been updated across all nodes.",
        });
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#a1a1aa] font-sans pb-20 selection:bg-[#007AFF] selection:text-white">
            {/* Top Bar */}
            <div className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#007AFF]">Protocol: GOVERNANCE_ALPHA</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden md:block">Compliance: SGE_SECURE</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-10 space-y-10">
                {/* Hero Section */}
                <div className="max-w-4xl">
                    <h1 className="text-6xl font-extrabold tracking-tighter text-white font-serif italic mb-6 text-center lg:text-left">
                        Governance {"&"} <span className="text-[#007AFF]">Global Sync</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed max-w-2xl text-zinc-400 mx-auto lg:mx-0 text-center lg:text-left">
                        Configure your enterprise infusion engine. Manage SGE compliance, real-time metadata injection,
                        and secure API handshakes across the generative ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Governance Config */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Shopify Webhook Status */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <RefreshCcw className="h-48 w-48 text-[#007AFF]" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mb-10 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#34C759]/10 flex items-center justify-center">
                                    <Database className="h-4 w-4 text-[#34C759]" />
                                </div>
                                Shopify Webhook Synchronization
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Push Frequency</span>
                                        <span className="text-xs font-mono font-bold text-[#007AFF]">6 Hours (Automated)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Metadata Sync</span>
                                        <span className="text-xs font-mono font-bold text-[#34C759]">ACTIVE</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Delta Compression</span>
                                        <span className="text-xs font-mono font-bold text-white/60 text-right italic">Enabled_V3</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-xs text-zinc-500 font-light leading-relaxed">
                                        Your Shopify SEO metadata is processed and synthesized every 6 hours. This ensures that any changes to product specifications, inventory levels, or brand narratives are immediately available for model retraining windows.
                                    </div>
                                    <button className="w-full h-12 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                        <RefreshCcw className="h-3 w-3" />
                                        Force Global Re-Sync
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-light text-sm p-8 bg-black/20 rounded-3xl border border-white/5 italic">
                                Note: For merchants earning $10k+/mo, we recommend the 6-hour interval to shield against high-frequency semantic drift in competitive niches.
                                Lower frequencies may result in LLMs citing outdated pricing or attributes during inference.
                            </div>
                        </div>

                        {/* SGE Compliance Writeup */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 space-y-8">
                            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4 text-[#007AFF]" />
                                </div>
                                SGE Compliance {"&"} Real-time Injection
                            </h2>
                            <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed">
                                <p className="text-lg">
                                    Google{"'"}s Search Generative Experience (SGE) represents the first mass-market application of the AI Dark Funnel. Unlike traditional search, SGE synthesizes answers based on <strong>deterministic metadata injection</strong>.
                                </p>
                                <p>
                                    Tracintel{"'"}s Governance engine ensures that your brand data is formatted specifically for SGE consumption. We bypass traditional indexing delays by utilizing direct API handshakes that ground Google{"'"}s librarian logic in your brand{"'"}s ground truth. This is not just technical SEO; it is <strong>Compliance Architecture</strong>—ensuring that every inference Google makes is backed by verified, high-authority nodes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: API Health & Governance */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* API Health Dashboard */}
                        <div className="bg-black rounded-[2.5rem] border border-white/5 p-10 shadow-2xl space-y-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Activity className="h-32 w-32 text-red-500" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white flex items-center justify-between">
                                API Health Dashboard
                                <ChevronRight className="h-4 w-4 text-[#007AFF]" />
                            </h3>

                            <div className="space-y-8">
                                {[
                                    { id: 'openai', label: 'OpenAI (GPT-4o)', delay: '42ms' },
                                    { id: 'anthropic', label: 'Anthropic (Claude)', delay: '28ms' },
                                    { id: 'gemini', label: 'Google (Gemini)', delay: '55ms' },
                                ].map((provider) => {
                                    const status = health?.[provider.id] || "Inactive";
                                    const isActive = status === "Active";

                                    return (
                                        <div key={provider.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{provider.label}</div>
                                                <div className="text-xs font-mono text-zinc-500">{isActive ? provider.delay : '--'}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    isActive ? "bg-[#34C759] shadow-[0_0_5px_#34C759]" : "bg-white/10"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-mono font-bold uppercase",
                                                    isActive ? "text-white/60" : "text-white/10"
                                                )}>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <button className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#007AFF] hover:text-white transition-colors border border-[#007AFF]/20 rounded-xl hover:bg-[#007AFF]/10">
                                    Manage Infusion Keys
                                </button>
                            </div>
                        </div>

                        {/* Governance Widgets */}
                        <div className="space-y-4">
                            {[
                                { label: 'Audit Logging', value: 'Enabled', icon: Shield },
                                { label: 'Zero-Leak Injection', value: 'Active', icon: Sliders },
                                { label: 'Auth_Rotation', value: '30 Days', icon: Key },
                            ].map((w, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <w.icon className="h-4 w-4 text-white/20 group-hover:text-[#007AFF] transition-colors" />
                                        <span className="text-xs font-bold text-white/40">{w.label}</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-white/60">{w.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Strategy Recommendation: Final Instruction */}
                <section className="bg-white/5 border border-white/5 rounded-[3rem] p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007AFF]/50 to-transparent" />
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-4xl font-bold tracking-tighter text-white font-serif italic mb-6">Strategic <br /> Recommendation</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Protocol: Enterprise Governance</div>
                        </div>
                        <div className="md:w-2/3 prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed">
                            <p className="text-lg mb-8">
                                For most Shopify merchants, governance is an afterthought. However, at the $10k/month revenue tier, your brand{"'"}s <strong>Metadata Integrity</strong> is your most valuable asset in the AI economy. If Google SGE or GPT-4o crawls your store and finds inconsistent specs or outdated narratives, its internal confidence-weights for your brand will collapse, resulting in hallucinations where competitors are recommended instead.
                            </p>
                            <p className="text-lg">
                                We recommend implementing a <strong>Hard Governance Loop</strong>. First, ensure your sync frequency is set to at least every 6 hours. This ensures that the {"\""}stochastic drift{"\""} of AI knowledge graphs never deviates significantly from your current inventory and pricing. Second, unify your brand narrative across all API endpoints. Whether a model pulls data from your Shopify metadata, a Reddit thread, or a Discord log, the core semantic anchors must be identical. Tracintel{"'"}s Governance engine provides the secure handshake necessary to maintain this consistency across the distributed Dark Funnel.
                            </p>
                            <p className="text-lg mt-8">
                                Finally, prioritize <strong>SGE-Deterministic JSON-LD</strong>. By using the specialized schemas provided in Tracintel{"'"}s lab, you force models to cite your store directly during SGE inference. This reduces the friction in the decision-making pipeline, turning high-intent conversational queries into trackable, high-margin conversions. Consistent governance today is the only way to shield your brand from the AI-driven disruption of the search marketplace tomorrow.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Persist Bar */}
                <div className="pt-10 flex justify-center">
                    <button
                        onClick={handlePersist}
                        disabled={isPersisting}
                        className="h-16 px-16 bg-[#007AFF] hover:bg-[#0060cc] disabled:bg-[#007AFF]/50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-2xl shadow-[#007AFF]/40 flex items-center gap-3 group"
                    >
                        {isPersisting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        )}
                        {isPersisting ? "Synchronizing Protocols..." : "Persist Global Configuration"}
                    </button>
                </div>
            </div>
        </div>
    );
}
