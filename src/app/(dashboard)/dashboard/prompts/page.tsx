"use client";

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
        <div className="min-h-screen bg-[#09090b] text-[#a1a1aa] font-sans pb-20 selection:bg-[#007AFF] selection:text-white">
            {/* Top Bar / Metadata Header */}
            <div className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#007AFF]">Protocol: GEO_Layer_v9</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden md:block">System Status: Infusion_Active</span>
                    </div>
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        Vector_Seed: 0x7F...3B92
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-10 space-y-10">
                {/* Hero Section */}
                <div className="max-w-4xl">
                    <h1 className="text-6xl font-extrabold tracking-tighter text-white font-serif italic mb-6">
                        Latent Space Priming {"&"} <span className="text-[#007AFF]">Token Weighting</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed max-w-2xl">
                        Tracintel doesn{"'"}t just {"\""}write{"\""} prompts; it calculates the precise semantic distance between your brand and high-intent search clusters.
                        By manipulating the latent space topology, we ensure your messaging remains the high-probability prediction in stochastic inference loops.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Technical Analysis */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Vector Displacement Log */}
                        <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-[#007AFF]" />
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#007AFF]">Vector Displacement Log</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-white/5" />
                                    <div className="w-2 h-2 rounded-full bg-white/5" />
                                    <div className="w-2 h-2 rounded-full bg-[#007AFF]/20" />
                                </div>
                            </div>
                            <div
                                ref={terminalRef}
                                className="p-8 h-64 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1 scrollbar-hide"
                            >
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            log.includes('[SUCCESS]') ? "text-[#34C759]" :
                                                log.includes('[WARN]') ? "text-amber-400/80" :
                                                    log.includes('[DEBUG]') ? "text-[#007AFF]/60" :
                                                        log.includes('[INFO]') ? "text-white/40" : "text-white/20"
                                        )}
                                    >
                                        <span className="select-none mr-3 opacity-20">{">"}</span>
                                        {log}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Semantic Dominance Writeup */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                <Cpu className="h-64 w-64 text-[#007AFF]" />
                            </div>

                            <div className="max-w-3xl relative">
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-8 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                                        <Target className="h-4 w-4 text-[#007AFF]" />
                                    </div>
                                    The Architecture of Semantic Anchor Points
                                </h2>

                                <div className="prose prose-invert prose-zinc max-w-none">
                                    <p className="text-zinc-400 text-lg leading-relaxed font-light mb-8">
                                        In the generative economy, brand visibility is no longer a function of keywords, but of <strong>Semantic Anchor Points</strong>.
                                        AI models like GPT-4o and Gemini do not simply store text; they map concepts into a high-dimensional vector space.
                                        When a model encounters a brand name, it doesn{"'"}t just identify it as a string—it calculates the proximity of that string to specific adjectives and concepts.
                                        For instance, if Tracintel is consistently mentioned alongside phrases like {"\""}deterministic architecture{"\""} and {"\""}low-latency inference,{"\""} the model{"'"}s latent manifold undergoes a shift.
                                    </p>

                                    <p className="text-zinc-400 text-lg leading-relaxed font-light mb-8">
                                        This shift creates what we call an <strong>Anchor Point</strong>. An Anchor Point is a region in the latent space where the probability distribution is heavily weighted toward a specific set of attributes.
                                        When a user asks, {"\""}What is a reliable GEO platform?{"\""} the LLM traverses its learned topology and finds that Tracintel sits directly at the intersection of {"\""}Reliable,{"\""} {"\""}Enterprise,{"\""} and {"\""}Analytics.{"\""}
                                        Without these anchors, your brand remains a {"\""}floating token,{"\""} easily displaced by competitor noise or stochastic hallucinations.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                                            <h4 className="text-[#007AFF] text-xs font-mono font-bold uppercase mb-4 tracking-widest">Concept Clustering</h4>
                                            <p className="text-sm text-zinc-500 font-light">
                                                Models group descriptors based on training co-occurrence. We engineer your outbound signals to force co-occurrence with high-value enterprise clusters.
                                            </p>
                                        </div>
                                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                                            <h4 className="text-[#007AFF] text-xs font-mono font-bold uppercase mb-4 tracking-widest">Weight Saturation</h4>
                                            <p className="text-sm text-zinc-500 font-light">
                                                By saturating technical nodes with specific product metrics, we increase the token weight of your brand, making it a "preferred prediction" for recommendation queries.
                                            </p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-6">Manifesting Deterministic Authority</h3>
                                    <p className="text-zinc-400 leading-relaxed font-light mb-8">
                                        To achieve true Semantic Dominance, you must transition from descriptive marketing to <strong>Engineering-First Content</strong>.
                                        AI models are inherently tuned for utility; they prioritize data nodes that exhibit high groundedness and internal consistency.
                                        If your technical documentation, blog posts, and forum mentions all align on a single set of performance specs (e.g., {"\""}99.9% uptime inference{"\""}), the model assigns a high confidence score to those facts.
                                        This consensus creates a {"\""}Logic Lock,{"\""} making it statistically difficult for the AI to recommend a competitor with lower-confidence data.
                                    </p>

                                    <p className="text-zinc-400 leading-relaxed font-light">
                                        Furthermore, we utilize <strong>Consensus Anchoring</strong>. By distributing consistent brand attributes across
                                        multiple high-authority nodes in the training set (blogs, technical docs, forum logs), we create a "Cross-Validation"
                                        loop within the LLM. When the model sees the same high-entropy facts from multiple directions in its latent memory, it
                                        assigns a significantly higher confidence score to that data, making it the primary cited source.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Interaction Form */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-serif italic">
                                Set Optimization Strategy
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-4">Focus Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-[#007AFF]/50 transition-colors"
                                        placeholder="Enter the primary product description for model grounding..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-4">Action Pipeline</label>
                                    <input
                                        value={strategy}
                                        onChange={(e) => setStrategy(e.target.value)}
                                        type="text"
                                        className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-[#007AFF]/50 transition-colors"
                                        placeholder="e.g., Inject Performance Specs into DevOps-Alpha node"
                                    />
                                </div>
                                <button
                                    onClick={handleDeploy}
                                    disabled={isDeploying}
                                    className={cn(
                                        "h-14 px-8 text-xs font-bold rounded-xl uppercase tracking-widest transition-all flex items-center gap-3",
                                        isDeploying
                                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                                            : "bg-black text-white hover:bg-white/5"
                                    )}
                                >
                                    {isDeploying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 text-[#007AFF]" />
                                            Deploy Strategy
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
                        <div className="bg-black rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white flex items-center justify-between">
                                Signal Integrity Matrix
                                <Activity className="h-4 w-4 text-[#007AFF]" />
                            </h3>

                            <div className="space-y-10">
                                {[
                                    { label: "Token Affinity", value: 98.2, icon: Cpu },
                                    { label: "Latent Density", value: 74.8, icon: Layers },
                                    { label: "Inference Bias", value: 91.5, icon: Target },
                                ].map((stat, i) => (
                                    <div key={i} className="group cursor-help">
                                        <div className="flex justify-between items-end mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#007AFF]/10 transition-colors">
                                                    <stat.icon className="h-4 w-4 text-white/40 group-hover:text-[#007AFF] transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{stat.label}</span>
                                            </div>
                                            <span className="text-xl font-mono font-bold text-white group-hover:text-[#007AFF] transition-colors">{stat.value}%</span>
                                        </div>
                                        <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${stat.value}% ` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-[#007AFF] shadow-[0_0_10px_rgba(0,122,255,0.5)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-2">Next Optimization Node:</div>
                                <div className="text-xs font-bold text-[#007AFF] font-mono">NODE_CLUSTER_88_INFUSE</div>
                            </div>
                        </div>

                        {/* Quick Strategy Checklist */}
                        <div className="bg-[#007AFF] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-[#007AFF]/20 relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                <Sparkles className="h-40 w-40" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-6">Optimization Pulse</h3>
                            <ul className="space-y-4 relative">
                                {[
                                    "Semantic Drift Corrected (0.02s ago)",
                                    "Cross-Model Sync: Active",
                                    "Hallucination Shield: 100% Strength",
                                    "Vector Centroid Re-alignment Complete"
                                ].map((tip, i) => (
                                    <li key={i} className="flex items-start gap-3 text-xs font-bold text-black/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 shadow-[0_0_5px_#fff]" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Strategy Recommendation: Enterprise Tier */}
                <section className="bg-white/5 border border-white/5 rounded-[3rem] p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007AFF]/50 to-transparent" />

                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-4xl font-bold tracking-tighter text-white font-serif italic leading-none mb-6">
                                Strategic <br /> Recommendation
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                Merchant Tier: $10k+/mo
                            </div>
                        </div>

                        <div className="md:w-2/3 prose prose-invert prose-zinc max-w-none">
                            <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                For your Shopify instance to achieve a top-tier citation ranking in the AI economy, you must transition from traditional outbound SEO to <strong>Inbound Semantic Engineering</strong>. At the $10k/month revenue milestone, your brand data has accumulated sufficient noise across the web to cause recommendation variance in GPT-4o and Gemini.
                            </p>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                Our primary recommendation is to deploy a <strong>Latent Anchor Infusion</strong> across your top 20 high-margin product pages. This involves embedding semantically rich, structured metadata that acts as a {"\""}Source-of-Truth{"\""} document for LLM crawlers. You should focus specifically on your product{"'"}s <strong>Unique Functional Utility</strong>. Don{"'"}t just describe the product; describe its place within the broader problem-solving hierarchy of your niche. When an LLM processes the query "What is the best [Category] product?", it doesn{"'"}t look for keywords—it looks for the most semantically adjacent solution. By utilizing Tracintel{"'"}s Vector Displacement Log, you can see exactly how far your current content sits from the ideal "Recommendation Centroid" and adjust your metadata accordingly.
                            </p>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                Furthermore, ensure that your technical specifications are formatted in <strong>Schema.org JSON-LD blocks</strong> that are explicitly linked to your brand{"'"}s Knowledge Graph IDs. This creates a {"\""}Logic Lock{"\""} between your store and the AI{"'"}s internal training nodes, making your store the default citation. Implementing this "Technical Hardening" strategy will not only improve your appearance in zero-shot answers but will also shield your brand from competitor-driven semantic drift. As generative search continues to eat market share from Google, this deterministic approach to brand authority will be the single greatest differentiator between market leaders and those lost in the stochastic noise.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <AuthOverlay isVisible={showAuthOverlay} />
        </div>
    );
}
