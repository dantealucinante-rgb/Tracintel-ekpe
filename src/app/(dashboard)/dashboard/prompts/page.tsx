"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PromptStrengthMeter from '@/components/dashboard/PromptStrengthMeter';
import { toast } from 'sonner';
import { Terminal, Cpu, Target, Zap, Activity, Sparkles, Info, ChevronRight, Layers, ShieldCheck } from 'lucide-react';
import { saveStrategy } from '@/app/actions/strategy';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';

export default function PromptsPage() {
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

    const [logs, setLogs] = useState<string[]>([]);
    const [strategy, setStrategy] = useState('');
    const [description, setDescription] = useState('Our brand provides high-performance GEO solutions for enterprise Shopify merchants.');
    const [isDeploying, setIsDeploying] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    const handleDeploy = async () => {
        if (!user) {
            setShowAuthOverlay(true);
            toast.info("Access Protocol Required", {
                description: "Verify session to deploy live latent strategies.",
            });
            return;
        }

        if (!strategy) {
            toast.error('Tactical Void', { description: 'Please enter a strategy to deploy.' });
            return;
        }

        setIsDeploying(true);
        const tId = toast.loading('Hardening Latent Strategy...', {
            description: 'Injecting deterministic nodes into the manifold.'
        });

        try {
            const result = await saveStrategy(strategy);
            if (result.success) {
                toast.success('Strategy Synchronized', {
                    id: tId,
                    description: 'Primary intelligence node updated.'
                });
                setStrategy('');
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast.error('Sync Failure', {
                id: tId,
                description: error.message || 'Manifold rejection.'
            });
        } finally {
            setIsDeploying(false);
        }
    };

    // Simulated Vector Displacement Log
    useEffect(() => {
        const lines = [
            '[INFO] Initializing Vector_Engine v4.2.1...',
            '[DEBUG] Connecting to Semantic_Mesh_Node_US_EAST...',
            '[INFO] Re-centering Brand_Centroid towards "Premium_Sustainability" cluster...',
            '[WARN] Semantic drift detected in "Luxury_Efficiency" manifold. Correcting...',
            '[INFO] Anchor Injection successful: Node_ID_7A-F2 locked.',
            '[DEBUG] Calculating token probability bias for "Stochastic_Inference"...',
            '[INFO] Re-indexing Latent_Manifold for "Decision_Path_Alpha"...',
            '[SUCCESS] Vector displacement locked at 0.85 Sigma.',
            '[INFO] Polling dark funnel signals from 18 distributed nodes...',
            '[DEBUG] High-entropy semantic overlap found: [7A-F2] cluster.',
        ];

        let i = 0;
        const interval = setInterval(() => {
            setLogs(prev => [...prev, lines[i % lines.length]].slice(-12));
            i++;
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#374151] font-sans pb-20">
            {/* Top Bar / Metadata Header */}
            <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#111827] animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-[#111827] tracking-wider">Optimization Engine Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12 space-y-12">
                {/* Hero Section */}
                <div className="max-w-4xl">
                    <h1 className="text-[22px] font-bold text-[#111827] mb-4">
                        Latent Strategy {"&"} Sentiment Priming
                    </h1>
                    <p className="text-[14px] text-[#374151] leading-relaxed max-w-2xl">
                        Design and deploy semantic anchors to influence how AI models perceive and recommend your brand.
                        Optimize your digital footprint for deterministic visibility across generative engines.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Technical Analysis */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Vector Displacement Log */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-[#111827]" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827]">Engine Activity Feed</span>
                                </div>
                            </div>
                            <div
                                ref={terminalRef}
                                className="p-6 h-64 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1 scrollbar-hide bg-white"
                            >
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            log.includes('[SUCCESS]') ? "text-emerald-600" :
                                                log.includes('[WARN]') ? "text-amber-600" :
                                                    log.includes('[DEBUG]') ? "text-[#111827]/40" :
                                                        log.includes('[INFO]') ? "text-[#6B7280]" : "text-[#6B7280]"
                                        )}
                                    >
                                        <span className="mr-3 opacity-20">#</span>
                                        {log}
                                    </motion.div>
                                ))}
                                {logs.length === 0 && (
                                    <div className="h-full flex items-center justify-center flex-col text-[#6B7280]">
                                        <span className="text-[13px] font-medium">Initializing feeds...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Semantic Dominance Writeup */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm">
                            <div className="max-w-3xl">
                                <h2 className="text-[18px] font-bold text-[#111827] mb-6 flex items-center gap-3">
                                    The Architecture of Semantic Authority
                                </h2>

                                <div className="space-y-6 text-[14px] text-[#374151] leading-relaxed">
                                    <p>
                                        In the generative economy, brand visibility is no longer a function of keywords, but of <strong>Semantic Authority</strong>.
                                        AI models map concepts into a high-dimensional vector space.
                                        When a model encounters your brand, it calculates the proximity to specific attributes and user intents.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                        <div className="bg-gray-50 border border-[#E5E7EB] p-6 rounded-[12px]">
                                            <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Intent Mapping</h4>
                                            <p className="text-[13px] text-[#374151]">
                                                Forcing co-occurrence with high-value search clusters to ensure your brand is the default recommendation.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 border border-[#E5E7EB] p-6 rounded-[12px]">
                                            <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Entity Reinforcement</h4>
                                            <p className="text-[13px] text-[#374151]">
                                                Saturating knowledge nodes with deterministic data to increase citation probability.
                                            </p>
                                        </div>
                                    </div>

                                    <p>
                                        By aligning your technical documentation and public signals, you create a "Consensus Loop"
                                        within AI memory, significantly increasing the model&apos;s confidence in your brand as a primary source.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Interaction Form */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-10 shadow-sm">
                            <h3 className="text-[16px] font-bold text-[#111827] mb-8">
                                Optimization Parameters
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-3">Model Focus Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-32 bg-gray-50 border border-[#E5E7EB] rounded-[12px] p-5 text-[14px] text-[#111827] focus:outline-none focus:border-[#111827]/30 transition-colors resize-none"
                                        placeholder="Enter the primary product description..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-3">Target Semantic Node</label>
                                    <input
                                        value={strategy}
                                        onChange={(e) => setStrategy(e.target.value)}
                                        type="text"
                                        className="w-full h-12 bg-gray-50 border border-[#E5E7EB] rounded-[12px] px-5 text-[14px] text-[#111827] focus:outline-none focus:border-[#111827]/30 transition-colors"
                                        placeholder="e.g., Performance-First Architecture"
                                    />
                                </div>
                                <button
                                    onClick={handleDeploy}
                                    disabled={isDeploying}
                                    className={cn(
                                        "h-12 px-8 text-[13px] font-bold rounded-[8px] transition-all flex items-center justify-center gap-3",
                                        isDeploying
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-[#111827] text-white hover:bg-black"
                                    )}
                                >
                                    {isDeploying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4" />
                                            Deploy Latent Strategy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Strategic Metrics {"&"} Guide */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Prompt Strength Meter */}
                        <PromptStrengthMeter description={description} />

                        {/* High-Resolution Metrics Panel */}
                        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8 shadow-sm">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-10 text-[#6B7280] flex items-center justify-between">
                                Semantic Signal Matrix
                            </h3>

                            <div className="space-y-10">
                                {[
                                    { label: "Token Affinity", value: 98.2 },
                                    { label: "Latent Density", value: 74.8 },
                                    { label: "Inference Bias", value: 91.5 },
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-end mb-3">
                                            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{stat.label}</span>
                                            <span className="text-[16px] font-bold text-[#111827]">{stat.value}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${stat.value}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-[#111827]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Strategy Checklist */}
                        <div className="bg-[#111827] rounded-[12px] p-8 text-white shadow-sm">
                            <h3 className="text-[16px] font-bold mb-6">Optimization Active</h3>
                            <ul className="space-y-4">
                                {[
                                    "Semantic Drift Resolved",
                                    "Cross-Model Sync: Active",
                                    "Manifold Protection: High",
                                    "Inbound Signal Calibration Complete"
                                ].map((tip, i) => (
                                    <li key={i} className="flex items-start gap-4 text-[13px] font-medium text-gray-400">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Strategy Recommendation */}
                <section className="bg-white border border-[#E5E7EB] rounded-[12px] p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-[22px] font-bold text-[#111827] leading-tight mb-4">
                                Tactical Recommendation
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                                Growth Tier Priority
                            </div>
                        </div>

                        <div className="md:w-2/3 space-y-6 text-[14px] text-[#374151] leading-relaxed">
                            <p>
                                Transition from traditional SEO to <strong>Semantic Engineering</strong>. At your current scale, your brand data has accumulated sufficient noise to cause recommendation variance in models like GPT-4 and Gemini.
                            </p>
                            <p>
                                We recommend deploying a <strong>Knowledge Anchor Infusion</strong> across your primary marketing nodes. This involves embedding semantically rich, structured metadata that acts as a definitive source for AI crawlers.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </div>
    );
}
