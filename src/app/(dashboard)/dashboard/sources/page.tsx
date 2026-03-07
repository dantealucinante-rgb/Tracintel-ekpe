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
        <div className="min-h-screen bg-[#F9FAFB] text-[#374151] font-sans pb-20">
            {/* Top Bar */}
            <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-[#111827] tracking-wider">Dark Funnel Protocol Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12 space-y-12">
                <div className="max-w-4xl">
                    <h1 className="text-[22px] font-bold text-[#111827] mb-4">
                        AI Dark Funnel Intelligence
                    </h1>
                    <p className="text-[14px] text-[#374151] leading-relaxed max-w-2xl">
                        Map and monitor your brand authority across non-indexed repositories, research nodes, and specialized AI training sets.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <AIAuthorityTable />

                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm relative overflow-hidden">
                            <div className="relative">
                                <h2 className="text-[18px] font-bold text-[#111827] mb-6 flex items-center gap-3">
                                    Entity Recognition Cycle
                                </h2>
                                <p className="text-[14px] text-[#374151] leading-relaxed mb-8">
                                    AI models process information in distinct epochs. To maintain a high citation ranking,
                                    deterministic authority must be confirmed at the knowledge layer.
                                </p>
                                <div className="p-8 bg-gray-50 border border-[#E5E7EB] rounded-[12px]">
                                    <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Authority Verification
                                    </h4>
                                    <p className="text-[13px] text-[#6B7280]">
                                        Ensuring technical specifications are synchronized with the exact nodes used for model grounding.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 shadow-sm">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-6 text-[#6B7280]">Optimization Terms</h3>
                            <nav className="space-y-4">
                                {["Semantic Authority", "Model Manifold", "Knowledge Provenance", "Latent Space"].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#111827] transition-colors">{item}</span>
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <div className="space-y-3">
                            {[
                                { name: "OpenAI Indexer", status: isAiConfigured ? "Active" : "Keys Required", icon: ShieldCheck, color: isAiConfigured ? "bg-emerald-500" : "bg-red-500", text: isAiConfigured ? "text-emerald-600" : "text-red-600" },
                                { name: "Shopify Sync", status: isShopifyConnected ? "Active" : "Setup Required", icon: Link2, color: isShopifyConnected ? "bg-emerald-500" : "bg-amber-500", text: isShopifyConnected ? "text-emerald-600" : "text-amber-600" },
                                { name: "Google AI Bot", status: "Active", icon: Globe, color: "bg-emerald-500", text: "text-emerald-600" },
                            ].map((row, i) => (
                                <div key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <row.icon className="h-4 w-4 text-[#111827]" />
                                        <span className="text-[13px] font-medium text-[#374151]">{row.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", row.color)} />
                                        <span className={cn("text-[11px] font-bold uppercase tracking-wider", row.text)}>{row.status}</span>
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
