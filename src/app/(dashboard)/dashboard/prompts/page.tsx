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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 md:p-12 space-y-12 max-w-[1700px] mx-auto"
        >
            {/* Page Header */}
            <div className="max-w-4xl">
                <h1 className="font-display font-bold text-2xl md:text-3lx text-[#101828] tracking-tight">
                    Latent Strategy & Sentiment Priming
                </h1>
                <p className="font-sans text-[14px] text-[#667085] leading-relaxed mt-2 max-w-2xl font-medium">
                    Design and deploy semantic anchors to influence how AI models perceive and recommend your brand.
                    Optimize your digital footprint for deterministic visibility across generative engines.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Technical Analysis */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Vector Displacement Log */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                        <div className="px-7 py-5 border-b border-[#EAECF0] flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[#101828]" />
                                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-[#667085]">Engine Activity Feed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A] animate-pulse" />
                                <span className="font-sans text-[10px] font-bold text-[#12B76A] uppercase tracking-wider">Live Analysis</span>
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
                                        log.includes('[SUCCESS]') ? "text-[#12B76A]" :
                                            log.includes('[WARN]') ? "text-[#F79009]" :
                                                log.includes('[DEBUG]') ? "text-[#98A2B3]/60" :
                                                    log.includes('[INFO]') ? "text-[#667085]" : "text-[#667085]"
                                    )}
                                >
                                    <span className="opacity-30 flex-shrink-0 w-4">#</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="h-full flex items-center justify-center flex-col text-[#98A2B3]">
                                    <span className="font-sans text-[13px] font-medium">Initializing feeds...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Strategy Interaction Form */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-display font-semibold text-lg text-[#101828] mb-8">Optimization Parameters</h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em] block">Model Focus Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-32 bg-[#F9FAFB] border border-[#EAECF0] rounded-[12px] p-5 font-sans text-[14px] text-[#101828] focus:outline-none focus:border-[#0F172A]/30 transition-colors resize-none font-medium"
                                    placeholder="Describe your core value proposition..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em] block">Target Semantic Node</label>
                                <input
                                    value={strategy}
                                    onChange={(e) => setStrategy(e.target.value)}
                                    type="text"
                                    className="w-full h-12 bg-[#F9FAFB] border border-[#EAECF0] rounded-[12px] px-5 font-sans text-[14px] text-[#101828] focus:outline-none focus:border-[#0F172A]/30 transition-colors font-medium"
                                    placeholder="e.g., Enterprise Resilience, Sustainable Scaling"
                                />
                            </div>
                            <button
                                onClick={handleDeploy}
                                disabled={isDeploying}
                                className={cn(
                                    "h-12 px-8 font-sans font-medium text-[13px] rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm",
                                    isDeploying
                                        ? "bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed"
                                        : "bg-[#0F172A] text-white hover:bg-black active:scale-[0.98]"
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

                    {/* Educational Content */}
                    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-10 shadow-sm">
                        <div className="max-w-3xl">
                            <h2 className="font-display font-bold text-xl text-[#101828] mb-6 flex items-center gap-3">
                                The Architecture of Semantic Authority
                            </h2>

                            <div className="space-y-6 font-sans text-[14px] text-[#667085] leading-relaxed font-medium">
                                <p>
                                    In the generative economy, brand visibility is no longer a function of keywords, but of <strong className="text-[#101828]">Semantic Authority</strong>.
                                    AI models map concepts into a high-dimensional vector space.
                                    When a model encounters your brand, it calculates the proximity to specific attributes and user intents.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                    <div className="bg-[#F9FAFB] border border-[#EAECF0] p-6 rounded-[12px]">
                                        <h4 className="font-sans text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-2">Intent Mapping</h4>
                                        <p className="text-[13px] text-[#667085]">
                                            Forcing co-occurrence with high-value search clusters to ensure your brand is the default recommendation.
                                        </p>
                                    </div>
                                    <div className="bg-[#F9FAFB] border border-[#EAECF0] p-6 rounded-[12px]">
                                        <h4 className="font-sans text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-2">Entity Reinforcement</h4>
                                        <p className="text-[13px] text-[#667085]">
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
                    <div className="bg-white rounded-[16px] border border-[#EAECF0] p-8 shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.06em] mb-10 text-[#667085]">Semantic Signal Matrix</h3>

                        <div className="space-y-10">
                            {[
                                { label: "Token Affinity", value: 98.2 },
                                { label: "Latent Density", value: 74.8 },
                                { label: "Inference Bias", value: 91.5 },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-wider">{stat.label}</span>
                                        <span className="font-sans text-[18px] font-bold text-[#101828]">{stat.value}%</span>
                                    </div>
                                    <div className="h-2 bg-[#F2F4F7] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${stat.value}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-[#0F172A]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Strategy Checklist */}
                    <div className="bg-[#0F172A] rounded-[16px] p-8 text-white shadow-lg">
                        <h3 className="font-display font-semibold text-lg mb-6 tracking-tight">System Integrity</h3>
                        <ul className="space-y-5">
                            {[
                                "Semantic Drift Resolved",
                                "Cross-Model Sync: Active",
                                "Manifold Protection: High",
                                "Inbound Signal Calibration Complete"
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4 font-sans text-[13px] font-medium text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A] mt-2 shadow-[0_0_8px_rgba(18,183,106,0.6)]" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Strategic Recommendation */}
            <section className="bg-white border border-[#EAECF0] rounded-[16px] p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                    <div className="md:w-1/3">
                        <h2 className="font-display font-bold text-[24px] text-[#101828] leading-tight mb-4 tracking-tight">
                            Tactical Recommendation
                        </h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F4F7] border border-[#EAECF0] font-sans text-[10px] font-bold text-[#344054] uppercase tracking-wider">
                            Growth Tier Priority
                        </div>
                    </div>

                    <div className="md:w-2/3 space-y-6 font-sans text-[14px] text-[#667085] leading-relaxed font-medium">
                        <p>
                            Transition from traditional SEO to <strong className="text-[#101828]">Semantic Engineering</strong>. At your current scale, your brand data has accumulated sufficient noise to cause recommendation variance in models like GPT-4 and Gemini.
                        </p>
                        <p>
                            We recommend deploying a <strong className="text-[#101828]">Knowledge Anchor Infusion</strong> across your primary marketing nodes. This involves embedding semantically rich, structured metadata that acts as a definitive source for AI crawlers.
                        </p>
                    </div>
                </div>
            </section>

            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
