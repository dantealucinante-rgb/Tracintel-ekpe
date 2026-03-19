"use client";

import { motion } from 'framer-motion';
import { Database, Link2, ShieldCheck, Globe, Search, Zap, Network, Activity, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import AIAuthorityTable from '@/components/dashboard/AIAuthorityTable';
import { DashboardSkeleton } from '@/components/dashboard/Skeleton';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect, useMemo } from 'react';
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

    const { data: statsData, isLoading: statsLoading } = useSWR('/api/dashboard/stats', fetcher);
    const { data: scans = [], isLoading: scansLoading } = useSWR('/api/scans', fetcher);
    const isLoading = statsLoading || scansLoading;

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
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-[10px] bg-white border border-[#E5E7EB] flex items-center justify-center mb-8 shadow-sm">
                    <Database className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827] mb-2">No Data Points Indexed</h2>
                <p className="text-[14px] text-[#6B7280] max-w-sm mb-8 leading-relaxed">The Dark Funnel mapping requires an initial systemic scan.</p>
                <button
                    onClick={() => {
                        if (!user) setShowAuthOverlay(true);
                        else window.location.href = "/dashboard";
                    }}
                    className="h-12 px-8 bg-[#2563EB] text-white text-[14px] font-medium rounded-[8px] flex items-center gap-3 hover:bg-[#1D4ED8] transition-all"
                >
                    <Zap className="w-4 h-4" />
                    Initialize Scanning Protocol
                </button>
            </div>
        );
    }

    const sourceSummary = useMemo(() => {
        if (!scans || !scans.length) return [];

        const summary: Record<string, any> = {};
        const urlPattern = /https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

        scans.forEach((scan: any) => {
            const text = scan.rawText || '';
            const matches = [...text.matchAll(urlPattern)];

            matches.forEach(match => {
                const domain = match[1].toLowerCase().replace(/^www\./, '');
                if (!summary[domain]) {
                    summary[domain] = {
                        source: domain,
                        count: 0,
                        brands: new Set(),
                        models: new Set(),
                        authority: 'HIGH',
                        weight: 0
                    };
                }
                summary[domain].count += 1;
                summary[domain].brands.add(scan.brand);
                summary[domain].models.add(scan.provider || 'Gemini');
            });
        });

        const values = Object.values(summary);
        if (values.length === 0) return [];

        const maxCount = Math.max(...values.map((s: any) => s.count), 1);

        return values
            .map((s: any) => ({
                ...s,
                weight: s.count / maxCount,
                authority: s.count > 10 ? 'ELITE' : s.count > 5 ? 'HIGH' : 'MEDIUM'
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [scans]);

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight">Intelligence Sources</h1>
                    <p className="text-[#6B7280] mt-1 text-[14px] font-medium">Deterministic mapping of citation domains and source node hierarchy.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table */}
                <div className="lg:col-span-2 space-y-8">
                    <AIAuthorityTable data={sourceSummary.length > 0 ? sourceSummary : undefined} />
                </div>

                {/* Info Column */}
                <div className="space-y-8">
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h3 className="text-[15px] font-bold text-[#111827] mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#2563EB]" />
                            Model Training Bias
                        </h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-[#F7F8FA] rounded-[8px] border border-[#E5E7EB]">
                                <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Primary Crawler Node</p>
                                <p className="text-[14px] text-[#111827] font-medium leading-relaxed">
                                    Common Crawl remains the dominant source node for initial entity discovery.
                                </p>
                            </div>
                            <div className="p-4 bg-[#F7F8FA] rounded-[8px] border border-[#E5E7EB]">
                                <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Citation Lag</p>
                                <p className="text-[14px] text-[#111827] font-medium leading-relaxed">
                                    Domain updates typically reflect in LLM inference paths within 4-6 weeks of ingestion.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827] rounded-[10px] p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB] mb-4">Authority Hardening</h3>
                            <p className="text-[14px] text-white leading-relaxed font-medium">
                                To improve your brand's authority index, focus on securing mentions in <strong>.edu</strong> and <strong>.gov</strong> domains, which carry a 2.4x authority multiplier in current models.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </div>
    );
}
