"use client";

export const dynamic = "force-dynamic";

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
        <div className="min-h-screen bg-[#F9FAFB] text-[#374151] font-sans pb-20">
            {/* Top Bar */}
            <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-[#111827] tracking-wider">Governance Protocol Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12 space-y-12">
                {/* Hero Section */}
                <div className="max-w-4xl">
                    <h1 className="text-[22px] font-bold text-[#111827] mb-4">
                        Governance {"&"} Global Synchronization
                    </h1>
                    <p className="text-[14px] text-[#374151] leading-relaxed max-w-2xl">
                        Configure your enterprise infusion engine. Manage compliance, real-time metadata injection,
                        and secure API handshakes across the generative ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Governance Config */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Shopify Webhook Status */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm relative overflow-hidden group">
                            <h2 className="text-[18px] font-bold text-[#111827] mb-10 flex items-center gap-3">
                                Webhook Synchronization
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-gray-50 border border-[#E5E7EB] p-8 rounded-[12px] space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Frequency</span>
                                        <span className="text-[12px] font-medium text-[#111827]">6 Hours</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Metadata Sync</span>
                                        <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Compression</span>
                                        <span className="text-[12px] text-[#374151] font-medium italic">Enabled</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[13px] text-[#6B7280] leading-relaxed">
                                        Your SEO metadata is processed and synthesized every 6 hours. This ensures that any changes to product specifications are immediately available.
                                    </div>
                                    <button className="w-full h-10 rounded-[8px] bg-white border border-[#E5E7EB] text-[12px] font-bold text-[#111827] uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                        <RefreshCcw className="h-3 w-3" />
                                        Force Synchronize
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SGE Compliance Writeup */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm space-y-6">
                            <h2 className="text-[18px] font-bold text-[#111827] flex items-center gap-3">
                                Compliance {"&"} Data Injection
                            </h2>
                            <div className="text-[14px] text-[#374151] leading-relaxed space-y-4">
                                <p>
                                    Search Generative Experience (SGE) represents a shift in intent-based discovery. Tracintel ensures that your brand data is formatted specifically for model consumption.
                                </p>
                                <p>
                                    This goes beyond technical SEO. It is about <strong>Authority Architecture</strong>—ensuring that every inference a model makes is backed by verified, high-authority datasets.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: API Health & Governance */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* API Health Dashboard */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm space-y-8 relative overflow-hidden group">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center justify-between">
                                API Infrastructure Status
                            </h3>

                            <div className="space-y-6">
                                {[
                                    { id: 'openai', label: 'OpenAI Infrastructure', delay: '42ms' },
                                    { id: 'anthropic', label: 'Anthropic Core', delay: '28ms' },
                                    { id: 'gemini', label: 'Google Search API', delay: '55ms' },
                                ].map((provider) => {
                                    const status = health?.[provider.id] || "Inactive";
                                    const isActive = status === "Active";

                                    return (
                                        <div key={provider.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">{provider.label}</div>
                                                <div className="text-[12px] text-[#6B7280] font-medium">{isActive ? `Latency: ${provider.delay}` : 'Offline'}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-200"
                                                )} />
                                                <span className={cn(
                                                    "text-[11px] font-bold uppercase tracking-wider",
                                                    isActive ? "text-emerald-600" : "text-gray-300"
                                                )}>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <button className="w-full h-10 text-[12px] font-bold uppercase tracking-wider text-[#111827] hover:bg-gray-50 transition-colors border border-[#E5E7EB] rounded-[8px]">
                                    Manage Keys
                                </button>
                            </div>
                        </div>

                        {/* Governance Widgets */}
                        <div className="space-y-3">
                            {[
                                { label: 'Audit Logging', value: 'Enabled', icon: Shield },
                                { label: 'Metadata Controls', value: 'Active', icon: Sliders },
                                { label: 'Rotation Policy', value: '30 Days', icon: Key },
                            ].map((w, i) => (
                                <div key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <w.icon className="h-4 w-4 text-[#111827]" />
                                        <span className="text-[13px] font-medium text-[#374151]">{w.label}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{w.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Strategy Recommendation */}
                <section className="bg-white border border-[#E5E7EB] rounded-[12px] p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-[22px] font-bold text-[#111827] leading-tight mb-4">Strategic recommendation</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Priority: Enterprise Protocol</div>
                        </div>
                        <div className="md:w-2/3 space-y-6 text-[14px] text-[#374151] leading-relaxed">
                            <p>
                                Metadata integrity is a primary asset. Consistent synchronization across all endpoints ensures that AI models maintain high confidence-weights for your brand.
                            </p>
                            <p>
                                We recommend a <strong>Hard Governance Loop</strong>. Maintain high sync frequency and unified brand narratives across all distributed data nodes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Persist Bar */}
                <div className="pt-12 flex justify-center">
                    <button
                        onClick={handlePersist}
                        disabled={isPersisting}
                        className="h-12 px-12 bg-[#111827] hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-[8px] transition-all shadow-lg flex items-center gap-3"
                    >
                        {isPersisting ? (
                            <Loader2 className="h-4 w-5 animate-spin" />
                        ) : (
                            <Save className="h-4 w-5" />
                        )}
                        {isPersisting ? "Synchronizing..." : "Save Configuration"}
                    </button>
                </div>
            </div>
        </div>
    );
}
