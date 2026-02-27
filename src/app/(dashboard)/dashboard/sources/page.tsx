"use client";

import { motion } from 'framer-motion';
import { Database, Link2, ShieldCheck, Globe, Search, Zap, Network, Activity, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import AIAuthorityTable from '@/components/dashboard/AIAuthorityTable';
import { DashboardSkeleton } from '@/components/dashboard/Skeleton';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SOURCES_TABLE = [
    { domain: 'Reddit r/Shopify', authority: 92, trust: 85, impact: 'High' },
    { domain: 'HackerNews', authority: 95, trust: 91, impact: 'Critical' },
    { domain: 'Stack Overflow', authority: 88, trust: 78, impact: 'Medium' },
    { domain: 'Specialized Engineering Blogs', authority: 82, trust: 94, impact: 'Very High' },
    { domain: 'Discord Dev Logs', authority: 65, trust: 89, impact: 'Hidden' },
    { domain: 'Niche Substacks', authority: 75, trust: 92, impact: 'High' },
];

export default function SourcesPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [showAuthOverlay, setShowAuthOverlay] = useState(false);

    // In a real app, these would come from env or user config
    const [isShopifyConnected, setIsShopifyConnected] = useState(false);
    const [isAiConfigured, setIsAiConfigured] = useState(true);

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

    const { data: statsData, isLoading } = useSWR('/api/dashboard/stats', fetcher);

    const stats = user ? statsData : { latest: true };

    if (isLoading) {
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
                    <Database className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tighter text-white font-serif italic mb-4">No Data Points Indexed</h2>
                <p className="text-sm text-zinc-500 max-w-sm mb-10 leading-relaxed">The Dark Funnel mapping requires an initial systemic scan.</p>
                <button
                    onClick={() => {
                        if (!user) setShowAuthOverlay(true);
                        else window.location.href = "/dashboard";
                    }}
                    className="h-16 px-10 bg-white text-black text-sm font-bold rounded-2xl flex items-center gap-3 hover:bg-zinc-200 transition-all"
                >
                    <Zap className="w-4 h-4 text-[#007AFF]" />
                    Initialize Scanning Protocol
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
                            <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
                            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#34C759]">Protocol: DARK_FUNNEL_ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-10 space-y-10">
                <div className="max-w-4xl">
                    <h1 className="text-6xl font-extrabold tracking-tighter text-white font-serif italic mb-6">
                        AI Dark Funnel <span className="text-[#007AFF]">Intelligence</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed max-w-2xl px-1">
                        Tracintel maps your brand perception across non-indexed repositories, Reddit threads, and specialized research nodes.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <AIAuthorityTable />

                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <Network className="h-64 w-64 text-[#007AFF]" />
                            </div>
                            <div className="relative">
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-8 flex items-center gap-3 font-serif italic">
                                    <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                                        <Database className="h-4 w-4 text-[#007AFF]" />
                                    </div>
                                    Neural Ingestion Cycle
                                </h2>
                                <p className="text-zinc-400 font-light leading-relaxed mb-6">
                                    Models digest information in epochs. To influence recommendation weights, deterministic provenance must be established at the crawl layer.
                                </p>
                                <div className="p-8 bg-[#007AFF]/5 border border-[#007AFF]/20 rounded-3xl">
                                    <h4 className="text-[#007AFF] text-sm font-bold mb-4 flex items-center gap-2">
                                        <Zap className="h-4 w-4" />
                                        Deterministic Control
                                    </h4>
                                    <p className="text-sm text-zinc-400">
                                        Automate technical specification distribution to the exact nodes crawled by multi-modal LLM indexers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-white/40">Inference Glossary</h3>
                            <nav className="space-y-4">
                                {["Semantic Anchor", "Vector Manifold", "Deterministic Provenance", "Latent Density"].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-xs font-bold text-white/60 group-hover:text-[#007AFF] transition-colors">{item}</span>
                                        <ChevronRight className="h-3 w-3 text-white/20" />
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Domain Status Cards with Graceful Fallbacks */}
                        <div className="space-y-4">
                            {[
                                { name: "OpenAI Indexer", status: isAiConfigured ? "Active" : "Keys Required", icon: ShieldCheck, color: isAiConfigured ? "text-[#34C759]" : "text-[#FF3B30]" },
                                { name: "Shopify Sync", status: isShopifyConnected ? "Active" : "Setup Required", icon: Link2, color: isShopifyConnected ? "text-[#34C759]" : "text-[#FFCC00]" },
                                { name: "Google SGE Bot", status: "Monitoring", icon: Globe, color: "text-[#007AFF]" },
                            ].map((row, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-[#007AFF]/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <row.icon className={cn("h-4 w-4", row.color)} />
                                        <span className="text-xs font-bold text-white/60">{row.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {row.status.includes("Required") && <AlertCircle className="h-3 w-3 text-[#FFCC00]" />}
                                        <span className={cn("text-[10px] font-mono uppercase font-bold", row.color)}>{row.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </div>
    );
}
