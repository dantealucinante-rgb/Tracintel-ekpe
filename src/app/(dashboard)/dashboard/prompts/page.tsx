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
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto min-h-screen"
        >
            {/* Page Header */}
            <div>
                <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight mb-2">
                    Latent Strategy & Sentiment Priming
                </h1>
                <p className="text-[#6B7280] text-[15px] font-medium max-w-2xl leading-relaxed">
                    Design and deploy semantic anchors to influence how AI models perceive and recommend your brand.
                    Optimize your digital footprint for deterministic visibility across generative engines.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Technical Analysis */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Vector Displacement Log */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="px-7 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F8FA]">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[#2563EB]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">Engine Activity Feed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">Live Analysis</span>
                            </div>
                        </div>
                        <div
                            ref={terminalRef}
                            className="p-8 h-72 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1.5 scrollbar-hide bg-white"
                        >
                            {logs.map((log, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-4",
                                        log.includes('[SUCCESS]') ? "text-[#16A34A]" :
                                            log.includes('[WARN]') ? "text-[#D97706]" :
                                                log.includes('[DEBUG]') ? "text-[#94A3B8]" :
                                                    log.includes('[INFO]') ? "text-[#6B7280]" : "text-[#6B7280]"
                                    )}
                                >
                                    <span className="opacity-30 flex-shrink-0 w-4">#</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="h-full flex items-center justify-center flex-col text-slate-300">
                                    <span className="text-[13px] font-medium tracking-widest uppercase">Initializing feeds...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Strategy Interaction Form */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h3 className="text-[18px] font-medium text-[#111827] mb-8">Optimization Parameters</h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest block">Model Focus Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-32 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] p-5 text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB]/30 focus:bg-white transition-all resize-none font-medium"
                                    placeholder="Describe your core value proposition..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest block">Target Semantic Node</label>
                                <input
                                    value={strategy}
                                    onChange={(e) => setStrategy(e.target.value)}
                                    type="text"
                                    className="w-full h-12 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-5 text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB]/30 focus:bg-white transition-all font-medium"
                                    placeholder="e.g., Enterprise Resilience, Sustainable Scaling"
                                />
                            </div>
                            <button
                                onClick={handleDeploy}
                                disabled={isDeploying}
                                className={cn(
                                    "h-12 px-8 font-medium text-[14px] rounded-[8px] transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]",
                                    isDeploying
                                        ? "bg-[#F7F8FA] text-[#6B7280] cursor-not-allowed"
                                        : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                )}
                            >
                                {isDeploying ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        SYNCHRONIZING...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4" />
                                        DEPLOY LATENT STRATEGY
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Educational Content */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <div className="max-w-3xl">
                            <h2 className="text-[18px] font-medium text-[#111827] mb-6 flex items-center gap-3">
                                The Architecture of Semantic Authority
                            </h2>

                            <div className="space-y-6 text-[15px] text-[#6B7280] leading-relaxed font-medium">
                                <p>
                                    In the generative economy, brand visibility is no longer a function of keywords, but of <strong className="text-[#111827]">Semantic Authority</strong>.
                                    AI models map concepts into a high-dimensional vector space.
                                    When a model encounters your brand, it calculates the proximity to specific attributes and user intents.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                                    <div className="bg-[#F7F8FA] border border-[#E5E7EB] p-8 rounded-[8px]">
                                        <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3">Intent Mapping</h4>
                                        <p className="text-[13px] text-[#6B7280]">
                                            Forcing co-occurrence with high-value search clusters to ensure your brand is the default recommendation.
                                        </p>
                                    </div>
                                    <div className="bg-[#F7F8FA] border border-[#E5E7EB] p-8 rounded-[8px]">
                                        <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3">Entity Reinforcement</h4>
                                        <p className="text-[13px] text-[#6B7280]">
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
                </div>

                {/* Right Column: Strategic Metrics & Guide */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Prompt Strength Meter */}
                    <PromptStrengthMeter description={description} />

                    {/* Semantic Signal Matrix */}
                    <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-8 shadow-sm">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest mb-10 text-[#6B7280]">Semantic Signal Matrix</h3>

                        <div className="space-y-10">
                            {[
                                { label: "Token Affinity", value: 98.2 },
                                { label: "Latent Density", value: 74.8 },
                                { label: "Inference Bias", value: 91.5 },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{stat.label}</span>
                                        <span className="text-[24px] font-bold text-[#111827] leading-none">{stat.value}%</span>
                                    </div>
                                    <div className="h-1 bg-[#F7F8FA] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${stat.value}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-[#2563EB]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Strategy Checklist */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <h3 className="text-[14px] font-bold mb-6 tracking-tight text-[#6B7280] uppercase tracking-widest">SYSTEM INTEGRITY</h3>
                        <ul className="space-y-5">
                            {[
                                "Semantic Drift Resolved",
                                "Cross-Model Sync: Active",
                                "Manifold Protection: High",
                                "Inbound Signal Calibration Complete"
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4 text-[13px] font-semibold text-[#111827]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-2 shadow-[0_0_8px_rgba(22,163,74,0.4)]" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Strategic Recommendation */}
            <section className="bg-white border border-[#E5E7EB] rounded-[10px] p-10 shadow-sm">
                <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    <div className="md:w-1/3">
                        <h2 className="text-[24px] font-semibold text-[#111827] leading-tight mb-4 tracking-tight">
                            Tactical Recommendation
                        </h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
                            Growth Tier Priority
                        </div>
                    </div>

                    <div className="md:w-2/3 space-y-6 text-[15px] text-[#6B7280] leading-relaxed font-medium">
                        <p>
                            Transition from traditional SEO to <strong className="text-[#111827]">Semantic Engineering</strong>. At your current scale, your brand data has accumulated sufficient noise to cause recommendation variance in models like GPT-4 and Gemini.
                        </p>
                        <p>
                            We recommend deploying a <strong className="text-[#2563EB]">Knowledge Anchor Infusion</strong> across your primary marketing nodes. This involves embedding semantically rich, structured metadata that acts as a definitive source for AI crawlers.
                        </p>
                    </div>
                </div>
            </section>

            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
