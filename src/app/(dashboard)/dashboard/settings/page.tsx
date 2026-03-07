"use client";

export const dynamic = "force-dynamic";

import { motion } from 'framer-motion';
import { Settings, Shield, Key, Sliders, Save, LogOut, ChevronRight, Activity, Globe, RefreshCcw, Database, ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/dashboard/Skeleton';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';

interface ApiHealth {
    [key: string]: "Active" | "Inactive" | string;
}

export default function SettingsPage() {
    const [health, setHealth] = useState<ApiHealth | null>(null);
    const [isPersisting, setIsPersisting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showAuthOverlay, setShowAuthOverlay] = useState(false);
    const supabase = createClient();

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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 md:p-12 space-y-12 max-w-[1700px] mx-auto"
        >
            {/* Page Header */}
            <div className="max-w-4xl">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-[#101828] tracking-tight">
                    Governance & Global Synchronization
                </h1>
                <p className="font-sans text-[14px] text-[#667085] leading-relaxed mt-2 max-w-2xl font-medium">
                    Configure your enterprise infusion engine. Manage compliance, real-time metadata injection,
                    and secure API handshakes across the generative ecosystem.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Governance Config */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Webhook Synchronization */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                        <h2 className="font-display font-bold text-xl text-[#101828] mb-10 flex items-center gap-3">
                            Webhook Synchronization
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                            <div className="bg-[#F9FAFB] border border-[#EAECF0] p-8 rounded-[12px] space-y-6">
                                <div className="flex justify-between items-center border-b border-[#EAECF0] pb-4">
                                    <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider">Frequency</span>
                                    <span className="font-sans text-[12px] font-bold text-[#101828]">6 Hours</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#EAECF0] pb-4">
                                    <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider">Metadata Sync</span>
                                    <span className="font-sans text-[12px] font-bold text-[#12B76A] uppercase tracking-wider">Active</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider">Compression</span>
                                    <span className="font-sans text-[12px] text-[#101828] font-bold italic">Enabled</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <p className="font-sans text-[13px] text-[#667085] leading-relaxed font-medium">
                                    Your SEO metadata is processed and synthesized every 6 hours. This ensures that any changes to product specifications are immediately available to model crawlers.
                                </p>
                                <button className="w-full h-12 rounded-[10px] bg-white border border-[#EAECF0] font-sans text-[12px] font-bold text-[#101828] uppercase tracking-wider hover:bg-[#F9FAFB] transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]">
                                    <RefreshCcw className="h-4 w-4" />
                                    Force Synchronize
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SGE Compliance Writeup */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                        <h2 className="font-display font-bold text-xl text-[#101828] mb-6 flex items-center gap-3">
                            Compliance & Data Injection
                        </h2>
                        <div className="font-sans text-[14px] text-[#667085] leading-relaxed space-y-4 font-medium">
                            <p>
                                Search Generative Experience (SGE) represents a fundamental shift in intent-based discovery. Tracintel ensures that your brand data is formatted specifically for model consumption.
                            </p>
                            <p>
                                This goes beyond technical SEO. It is about <strong className="text-[#101828]">Authority Architecture</strong>—ensuring that every inference a model makes is backed by verified, high-authority datasets.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: API Health & Governance */}
                <div className="lg:col-span-4 space-y-8">
                    {/* API Infrastructure Status */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-[#667085] mb-10">
                            API Infrastructure status
                        </h3>

                        <div className="space-y-8">
                            {[
                                { id: 'openai', label: 'OpenAI Infrastructure', delay: '42ms' },
                                { id: 'anthropic', label: 'Anthropic Core', delay: '28ms' },
                                { id: 'gemini', label: 'Google Search API', delay: '55ms' },
                            ].map((provider) => {
                                const status = health?.[provider.id] || "Inactive";
                                const isActive = status === "Active";

                                return (
                                    <div key={provider.id} className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <div className="font-sans text-[11px] font-bold text-[#101828] uppercase tracking-wider group-hover:text-black transition-colors">{provider.label}</div>
                                            <div className="font-sans text-[12px] text-[#667085] font-medium">{isActive ? `Latency: ${provider.delay}` : 'Offline'}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isActive ? "bg-[#12B76A] animate-pulse" : "bg-[#EAECF0]"
                                            )} />
                                            <span className={cn(
                                                "font-sans text-[10px] font-bold uppercase tracking-wider",
                                                isActive ? "text-[#12B76A]" : "text-[#98A2B3]"
                                            )}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-8 mt-8 border-t border-[#F2F4F7]">
                            <button className="w-full h-11 font-sans text-[11px] font-bold uppercase tracking-wider text-[#101828] border border-[#EAECF0] rounded-[8px] hover:bg-[#F9FAFB] transition-all shadow-sm">
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
                            <div key={i} className="bg-white border border-[#EAECF0] rounded-[16px] p-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center border border-[#EAECF0]">
                                        <w.icon className="h-4 w-4 text-[#101828]" />
                                    </div>
                                    <span className="font-sans text-[13px] font-bold text-[#101828]">{w.label}</span>
                                </div>
                                <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider">{w.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Strategy Recommendation */}
            <section className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                    <div className="md:w-1/3">
                        <h2 className="font-display font-bold text-[24px] text-[#101828] leading-tight mb-4 tracking-tight">Strategic Recommendation</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F4F7] border border-[#EAECF0] font-sans text-[10px] font-bold text-[#344054] uppercase tracking-wider">Priority: Enterprise Protocol</div>
                    </div>
                    <div className="md:w-2/3 space-y-6 font-sans text-[14px] text-[#667085] leading-relaxed font-medium">
                        <p>
                            Metadata integrity is a primary enterprise asset. Consistent synchronization across all endpoints ensures that AI models maintain high confidence-weights for your brand entity.
                        </p>
                        <p>
                            We recommend a <strong className="text-[#101828]">Hard Governance Loop</strong>. Maintain high sync frequency and unified brand narratives across all distributed data nodes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Persist Bar */}
            <div className="pt-4 flex justify-center">
                <button
                    onClick={handlePersist}
                    disabled={isPersisting}
                    className="h-14 px-12 bg-[#0F172A] hover:bg-black disabled:bg-[#F2F4F7] disabled:text-[#98A2B3] disabled:cursor-not-allowed text-white font-sans text-[14px] font-bold rounded-[12px] transition-all shadow-xl flex items-center gap-4 active:scale-[0.98]"
                >
                    {isPersisting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Save className="h-5 w-5" />
                    )}
                    {isPersisting ? "Synchronizing Configuration..." : "Save Configuration"}
                </button>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
