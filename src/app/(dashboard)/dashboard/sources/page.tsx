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
                    <Database className="w-8 h-8 text-[#111827]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#111827] mb-2">No Data Points Indexed</h2>
                <p className="text-[13px] text-[#6B7280] max-w-sm mb-8 leading-relaxed">The Dark Funnel mapping requires an initial systemic scan.</p>
                <button
                    onClick={() => {
                        if (!user) setShowAuthOverlay(true);
                        else window.location.href = "/dashboard";
                    }}
                    className="h-12 px-8 bg-[#111827] text-white text-[13px] font-bold rounded-[8px] flex items-center gap-3 hover:bg-black transition-all"
                >
                    <Zap className="w-4 h-4" />
                    Initialize Scanning Protocol
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
                    AI Dark Funnel Intelligence
                </h1>
                <p className="font-sans text-[14px] text-[#667085] leading-relaxed mt-2 max-w-2xl font-medium">
                    Map and monitor your brand authority across non-indexed repositories, research nodes, and specialized AI training sets.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Authority Data */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                        <AIAuthorityTable />
                    </div>

                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-10 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="font-display font-bold text-xl text-[#101828] mb-6 flex items-center gap-3">
                                Entity Recognition Cycle
                            </h2>
                            <p className="font-sans text-[14px] text-[#667085] leading-relaxed mb-8 font-medium">
                                AI models process information in distinct epochs. To maintain a high citation ranking,
                                deterministic authority must be confirmed at the knowledge layer.
                            </p>
                            <div className="p-8 bg-[#F9FAFB] border border-[#EAECF0] rounded-[12px]">
                                <h4 className="font-sans text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5" />
                                    Authority Verification
                                </h4>
                                <p className="font-sans text-[13px] text-[#667085] font-medium leading-relaxed">
                                    Ensuring technical specifications are synchronized with the exact nodes used for model grounding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Optimization & Integration */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.06em] mb-8 text-[#667085]">Optimization Terms</h3>
                        <nav className="space-y-4">
                            {["Semantic Authority", "Model Manifold", "Knowledge Provenance", "Latent Space"].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-[#F2F4F7] pb-4 last:border-0 last:pb-0">
                                    <span className="font-sans text-[13px] font-semibold text-[#101828] group-hover:text-[#0F172A] transition-colors">{item}</span>
                                    <ChevronRight className="h-4 w-4 text-[#98A2B3] group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { name: "OpenAI Indexer", status: isAiConfigured ? "Active" : "Keys Required", icon: ShieldCheck, color: isAiConfigured ? "bg-[#12B76A]" : "bg-[#F04438]", text: isAiConfigured ? "text-[#12B76A]" : "text-[#F04438]" },
                            { name: "Shopify Sync", status: isShopifyConnected ? "Active" : "Setup Required", icon: Link2, color: isShopifyConnected ? "bg-[#12B76A]" : "bg-[#F79009]", text: isShopifyConnected ? "text-[#12B76A]" : "text-[#F79009]" },
                            { name: "Google AI Bot", status: "Active", icon: Globe, color: "bg-[#12B76A]", text: "text-[#12B76A]" },
                        ].map((row, i) => (
                            <div key={i} className="bg-white border border-[#EAECF0] rounded-[16px] p-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center border border-[#EAECF0]">
                                        <row.icon className="h-4 w-4 text-[#101828]" />
                                    </div>
                                    <span className="font-sans text-[13px] font-bold text-[#101828]">{row.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", row.color)} />
                                    <span className={cn("font-sans text-[10px] font-bold uppercase tracking-wider", row.text)}>{row.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
