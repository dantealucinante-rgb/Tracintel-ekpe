"use client";

import Link from 'next/link';
import { ArrowRight, BarChart3, Zap, Shield, CheckCircle2, Database, TrendingUp, Target, Cpu, Layers, Globe, Activity, Lock, FlaskConical, GitBranch, Network, Binary, Eye } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { DemoSection } from '@/components/DemoSection';
import Header from '@/components/Header';

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-white m-0 p-0 overflow-x-hidden" style={{ width: '100vw !important' } as any}>

            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-32 md:pt-48 md:pb-48 px-6 overflow-hidden bg-white">
                {/* Subtle grid pattern - purely black/white */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px]" />

                <div className="w-full text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-[clamp(80px,12vw,160px)] font-bold tracking-[-0.04em] text-black mb-12 leading-[0.85] font-serif italic"
                    >
                        Generative <br />
                        <span className="text-black/20">Optimization</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl text-black/70 max-w-3xl mx-auto mb-8 font-light leading-relaxed"
                    >
                        Monitor your brand's narrative across LLMs. Track citation frequency and optimize for AI-first discovery.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25 }}
                        className="text-sm text-black/50 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
                    >
                        Move beyond traditional SEO. Tracintel monitors the hidden layer of the internet: the training sets, RAG pipelines, and inference engines of GPT-4, Gemini, and Claude. We don't just track clicks; we track LLM Mindshare.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/register" className="h-14 px-10 rounded-[6px] bg-[#111827] text-white font-semibold flex items-center gap-3 transition-all shadow-sm hover:bg-black text-[15px]">
                                Get Early Access <ArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/dashboard" className="h-14 px-10 rounded-[6px] border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#4B5563] font-semibold flex items-center gap-3 transition-all text-[15px] bg-white">
                                View Demo
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Abstract - High Density Columnar Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left pt-16 border-t border-black/5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-black" />
                                01 / The Attribution Problem
                            </div>
                            <p className="text-[13px] leading-relaxed text-black/60 font-medium">
                                We are entering the "Dark Funnel" of AI chat. Over <span className="text-black font-bold">70% of brand mentions</span> inside generative interfaces go untracked by legacy analytics. Tracintel captures these signals before they are lost to the inference loop.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-black" />
                                02 / The Sentiment Engine
                            </div>
                            <p className="text-[13px] leading-relaxed text-black/60 font-medium">
                                Legacy sentiment tools rely on shallow keyword matching. Tracintel utilizes <span className="text-black font-bold">Vector-Based Semantic Analysis</span> to understand how models interpret your brand value prop across multi-dimensional latent space.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="space-y-4"
                        >
                            <div className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-black" />
                                03 / The Future of Search
                            </div>
                            <p className="text-[13px] leading-relaxed text-black/60 font-medium">
                                The transition from SERPs to <span className="text-black font-bold">Synthetic Answers</span> is absolute. Tracintel allows you to audit the training origins of these answers and claim your share of generative citations through structured intelligence.
                            </p>
                        </motion.div>
                    </div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-12 flex items-center justify-center gap-8 text-xs font-mono uppercase tracking-widest text-black/30 mb-16"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-black" />
                            <span>NO_CREDIT_CARD_REQUIRED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-black" />
                            <span>14_DAY_FREE_TRIAL</span>
                        </div>
                    </motion.div>

                    {/* The Tracintel Index */}
                    <section className="mb-32">
                        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-8">
                            <h2 className="text-5xl font-bold tracking-tighter text-black font-serif italic">
                                The Tracintel Index
                            </h2>
                            <p className="max-w-md text-sm text-black/50 leading-relaxed font-medium">
                                Real-time monitoring of model update cycles and their direct impact on brand citation volatility across the global generative landscape.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    model: "GPT-4o (OpenAI)",
                                    status: "Active Tracking",
                                    blurb: "Demonstrates high affinity for structured data and technical documentation. Retail brands with strong Schema.org implementations see a 12% higher 'Mindshare' ranking in direct product comparisons.",
                                    trend: "+4.2% Citation Growth"
                                },
                                {
                                    model: "Gemini 1.5 Pro (Google)",
                                    status: "Active Tracking",
                                    blurb: "Heavily weights authority signals from verified news sources and first-party case studies. Tech brands utilizing RAG-friendly whitepapers currently dominate recommendation loops.",
                                    trend: "High Recommendation Consistency"
                                },
                                {
                                    model: "Claude 3.5 Sonnet (Anthropic)",
                                    status: "Active Tracking",
                                    blurb: "Prioritizes nuanced, conversational value propositions. Brands with clear, non-generic brand voices are 3x more likely to be featured in 'Top choice' summaries during complex user queries.",
                                    trend: "Improved Sentiment Precision"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bento-card p-8 flex flex-col justify-between group hover:border-black/20 transition-all cursor-default"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-widest">{item.status}</div>
                                            <div className="px-2 py-0.5 rounded-full bg-black/5 text-[9px] font-mono font-bold text-black/50">{item.trend}</div>
                                        </div>
                                        <h4 className="text-xl font-bold text-black mb-4 font-serif">{item.model}</h4>
                                        <p className="text-[13px] leading-relaxed text-black/50 font-medium">
                                            {item.blurb}
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold text-black/20 uppercase tracking-widest">Model Index Score: 94.2</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Dashboard Preview Section */}
                </div>
            </section>

            <DemoSection />

            {/* ── Section 1: The Invisible Search Shift ─────────────────────── */}
            <section className="py-32 px-6 bg-white border-t border-black/5 relative overflow-hidden">
                <div className="w-full">
                    {/* Label + Heading */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-mono uppercase tracking-[0.3em] text-black/30 mb-6 border-l-2 border-black pl-6">
                        // 01 // THE DISPLACEMENT OF THE CLICK
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-bold tracking-tighter text-black mb-20 leading-[0.95] font-serif italic">
                        The Invisible<br /><span className="text-black/20">Search Shift</span>
                    </motion.h2>

                    {/* 2-Column: long-form text LEFT + bento grid RIGHT */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* LEFT: 400-word write-up */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="space-y-6 text-zinc-600 font-light leading-relaxed">
                            <p className="text-xl text-zinc-900 font-medium leading-relaxed">
                                The click is dying. Not slowly—structurally. As of 2025, <strong className="text-black">60% of searches now terminate at an AI-generated answer</strong> before a single URL is visited. This is the Displacement of the Click: a fundamental rewiring of how intent becomes information.
                            </p>
                            <p>
                                In the legacy search economy, a brand&apos;s rank on a SERP was an explicit, auditable position. Page one, position three. A human user could scroll past it, click it, or ignore it. The economics were linear. In the AI economy, that map no longer applies. Large Language Models do not rank brands—they synthesize them. They collapse the entire corpus of web knowledge into a probabilistic representation of truth, and your brand either appears in that synthesis or it doesn&apos;t.
                            </p>
                            <h4 className="text-zinc-900 font-bold text-sm uppercase tracking-widest">LLM Content Aggregation</h4>
                            <p>
                                When a user queries an AI assistant, the model doesn&apos;t fetch pages—it retrieves knowledge fragments from its latent space, shaped by its training corpus. If your brand&apos;s content was sourced, cited, or summarized by authoritative communities—developer forums, review platforms, editorial publications—those fragments carry weight in inference. If they weren&apos;t, you are invisible at the moment of highest consumer intent.
                            </p>
                            <p>
                                This is the aggregation problem. One model response synthesizes five, ten, or fifty sources into a single authoritative statement. The brands that contributed the most semantically coherent, factually dense material to those source nodes receive disproportionate representation in the output. The long tail of low-density brand content is simply compressed out of the answer.
                            </p>
                            <h4 className="text-zinc-900 font-bold text-sm uppercase tracking-widest">Predictive User Intent</h4>
                            <p>
                                Modern AI search systems don&apos;t just respond to queries—they anticipate them. Intent prediction models, trained on billions of conversational turns, can identify that a user asking &quot;best project management tool for remote teams&quot; is 73% likely to follow up with &quot;compare pricing plans.&quot; Brands optimized for the first query but absent from the second lose the conversion to a competitor present at both intent nodes.
                            </p>
                            <p>
                                Tracintel maps this intent graph in real time, identifying the full chain of queries your customers are traversing and measuring your brand&apos;s coverage across every node. We don&apos;t optimize for one query. We optimize for the entire decision journey.
                            </p>
                            <div className="pt-4 border-t border-black/5">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-black/25">Tracintel Research Corpus 2025 // AI Search Displacement Index</span>
                            </div>
                        </motion.div>

                        {/* RIGHT: 4-card bento with grid texture + glassmorphism */}
                        <div className="relative">
                            {/* Subtle grid texture behind the cards */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:20px_20px] rounded-3xl" />
                            <div className="relative grid grid-cols-2 gap-3">
                                {[
                                    { icon: Eye, tag: "SERP Collapse", title: "Zero-Click Dominance", stat: "60%", body: "AI Overviews deliver 1 synthesized verdict. Brands outside the model's top knowledge clusters receive zero referral equity—regardless of their traditional SEO ranking." },
                                    { icon: GitBranch, tag: "Synthesis Layer", title: "LLM Aggregation", stat: "5→1", body: "Five authoritative sources collapse into a single synthesized answer. The brand contributing most to that synthesis wins the recommendation—entirely." },
                                    { icon: Lock, tag: "Trust Economics", title: "The Trust Paradox", stat: "4×", body: "AI citations carry 4× the conversion weight of a paid ad. Consumers perceive model recommendations as objective—not commercial—creating a trust asymmetry advertisers can't buy." },
                                    { icon: Activity, tag: "Intent Prediction", title: "Predictive Recall", stat: "<2s", body: "Speed-optimized models favor semantic density over accuracy. Brands with strong latent representation are recalled instantly—others are truncated from the answer entirely." },
                                ].map((card, i) => (
                                    <motion.div
                                        key={card.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-300 hover:bg-white hover:shadow-lg transition-all duration-400 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-200">
                                                <card.icon className="h-3.5 w-3.5 text-zinc-700" />
                                            </div>
                                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">{card.tag}</span>
                                        </div>
                                        <div className="text-2xl font-bold text-zinc-900 font-mono">{card.stat}</div>
                                        <h4 className="text-zinc-900 font-bold text-xs tracking-tight">{card.title}</h4>
                                        <p className="text-[11px] text-zinc-500 leading-relaxed">{card.body}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: GEO Infrastructure ─────────────────────────────── */}
            <section className="py-32 px-6 bg-white border-t border-black/5 relative overflow-hidden" >
                <div className="max-w-7xl mx-auto">
                    {/* Label + Heading */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-mono uppercase tracking-[0.3em] text-black/30 mb-6 border-l-2 border-black pl-6">
                        // 02 // LATENT SPACE ARCHITECTURE
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-20">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tighter text-black leading-[0.95] font-serif italic">
                            GEO<br /><span className="text-black/20">Infrastructure</span>
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-zinc-600 text-lg leading-relaxed font-light">
                            Tracintel operates at the mathematical layer beneath the visible web—mapping, optimizing, and defending your brand&apos;s position inside the latent manifold of every major AI architecture.
                        </motion.p>
                    </div>

                    {/* 3-column bento: 1 large + 2 small */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-24">
                        {/* Large card: Latent Space Mapping */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2 relative overflow-hidden bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-10 hover:border-slate-300 hover:shadow-lg transition-all duration-400 group"
                        >
                            {/* Grid texture */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f012_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f012_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                                        <Binary className="h-5 w-5 text-zinc-700" />
                                    </div>
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">LATENT SPACE MAPPING</span>
                                </div>
                                <div className="text-5xl font-bold text-zinc-900 font-mono mb-1">4,096D</div>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-6">Embedding Space Dimensionality Per Model</div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight">Brand Centroid Mapping</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                                    Every document in your brand&apos;s content ecosystem is encoded as a vector in a high-dimensional semantic space. Tracintel computes your brand&apos;s centroid—the geometric mean of all associated vectors—and measures its proximity to high-intent query clusters using cosine similarity: <strong className="text-zinc-700 font-mono text-xs">cos(θ) = (A·B) / (|A||B|)</strong>.
                                </p>
                                <ul className="grid grid-cols-2 gap-2">
                                    {["Cosine similarity across model namespaces", "Real-time centroid drift detection", "Query cluster proximity scoring", "Cross-architecture delta tracking"].map(item => (
                                        <li key={item} className="text-xs text-zinc-500 flex items-start gap-2">
                                            <div className="w-1 h-1 rounded-full bg-black mt-1.5 flex-shrink-0" />{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        {/* Small cards column */}
                        <div className="flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex-1 bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-7 hover:border-slate-300 hover:shadow-lg transition-all duration-400 group"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                                        <Network className="h-4 w-4 text-zinc-700" />
                                    </div>
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">Token Proximity</span>
                                </div>
                                <div className="text-3xl font-bold text-zinc-900 font-mono mb-1">87×</div>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4">Authority uplift</div>
                                <h4 className="text-zinc-900 font-bold text-sm mb-2">Token Injection Protocol</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">Identifies the exact source domains each model preferentially samples from, then engineers targeted content for maximum semantic weight at those nodes.</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex-1 bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-7 hover:border-slate-300 hover:shadow-lg transition-all duration-400 group"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                                        <FlaskConical className="h-4 w-4 text-zinc-700" />
                                    </div>
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">Entity Verification</span>
                                </div>
                                <div className="text-3xl font-bold text-zinc-900 font-mono mb-1">99.1%</div>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4">Hallucination detection rate</div>
                                <h4 className="text-zinc-900 font-bold text-sm mb-2">Hallucination Shield</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">Runs adversarial probe queries across all major models, flags ground-truth divergence, and generates Provenance Correction Briefs to eliminate factual errors before they reach customers.</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* 500-word RAG deep-dive — centered in the section */}
                    <div className="border-t border-black/5 pt-20">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/30 mb-8 text-center">Deep Dive // Retrieval-Augmented Generation & GEO</motion.div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="space-y-4 text-sm text-zinc-500 font-light leading-relaxed">
                                <h5 className="text-zinc-900 font-bold text-xs uppercase tracking-widest">What is RAG?</h5>
                                <p>
                                    Retrieval-Augmented Generation (RAG) is the dominant inference architecture for production AI search systems. Rather than relying solely on parametric knowledge (what the model absorbed during training), RAG systems dynamically retrieve relevant documents from an external vector store at query time—combining retrieved context with the model&apos;s generative capability to produce grounded, current answers.
                                </p>
                                <p>
                                    This architecture is critical to understand because it creates a two-layer optimization target. Your brand must be optimized both for the model&apos;s static knowledge base <strong className="text-zinc-700">(training-time GEO)</strong> and for retrieval relevance in real-time RAG pipelines <strong className="text-zinc-700">(inference-time GEO)</strong>. Brands that only optimize for one layer are invisible to the other.
                                </p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="space-y-4 text-sm text-zinc-500 font-light leading-relaxed">
                                <h5 className="text-zinc-900 font-bold text-xs uppercase tracking-widest">How Tracintel Optimizes for RAG</h5>
                                <p>
                                    Tracintel&apos;s RAG Optimization Layer operates on two parallel tracks. First, we index the external knowledge stores used by Perplexity, Bing Copilot, and Google AI Overviews—identifying which content sources are being pulled into live retrieval pipelines and ensuring your brand has high-relevance representation in those stores.
                                </p>
                                <p>
                                    Second, we engineer your content for retrieval-friendliness: structured data that chunks cleanly into 512-token retrieval windows, entity-dense prose that satisfies semantic similarity thresholds, and factual density that passes the reranking filters that determine which retrieved chunks actually appear in the final synthesized response.
                                </p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }} className="space-y-4 text-sm text-zinc-500 font-light leading-relaxed">
                                <h5 className="text-zinc-900 font-bold text-xs uppercase tracking-widest">The Reranking Problem</h5>
                                <p>
                                    RAG systems don&apos;t use every retrieved document—they employ a reranker model to select the top-k chunks most semantically aligned with the query. Brands whose content scores below the reranker&apos;s relevance threshold are excluded from the final context window, and thus from the generated answer—even if they were retrieved in the first pass.
                                </p>
                                <p>
                                    Tracintel monitors reranker behavior across deployments, identifies the semantic signals that correlate with high reranker scores for your category, and provides a Content Architecture Brief that restructures your existing material to maximize reranker pass-through rates. The result: your brand appears in the context window, and therefore in the answer.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Infrastructure at Scale ────────────────────────── */}
            <section className="py-32 px-6 bg-white border-t border-black/5 relative overflow-hidden" >
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-mono uppercase tracking-[0.3em] text-black/30 mb-6 border-l-2 border-black pl-6">
                        // 04 // GLOBAL SENTIMENT AGGREGATION
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-20">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tighter text-black leading-[0.95] font-serif italic">
                            Infrastructure<br /><span className="text-black/20">at Scale</span>
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-zinc-600 text-lg leading-relaxed font-light">
                            Our distributed ingestion engine processes discourse from Reddit, Discord, niche blogs, and 150,000+ source nodes continuously—without ever compromising application performance.
                        </motion.p>
                    </div>

                    {/* 300-word write-up: 2 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4 text-sm text-zinc-500 font-light leading-relaxed">
                            <p className="text-base text-zinc-900 font-medium leading-relaxed">
                                The AI training corpus is not static text—it is a living, evolving ecosystem of community discourse, editorial opinion, technical documentation, and real-time user sentiment. Tracintel&apos;s <strong className="text-black">Distributed Ingestion Engine</strong> monitors this ecosystem continuously, capturing the signals that will shape the next model update epoch.
                            </p>
                            <p>
                                Unlike traditional social listening tools that rely on rate-limited public APIs, our ingestion layer operates at the protocol level. We process Reddit threads, Discord server exports, Hacker News discussions, and the long tail of niche vertical blogs—sources that are authoritative within their communities and heavily sampled by LLM training crawlers, yet invisible to conventional analytics platforms.
                            </p>
                            <p>
                                Critically, our ingestion pipeline is architected for zero performance impact on the consumer application. All processing occurs on dedicated edge nodes that operate completely independently of the customer&apos;s site infrastructure—no CDN load, no database overhead, no Core Web Vitals degradation. The intelligence runs in parallel, not in series.
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4 text-sm text-zinc-500 font-light leading-relaxed">
                            <p>
                                Every ingested document is processed through our Sentiment Classification Layer—a fine-tuned model that performs aspect-based sentiment extraction at the brand-attribute level. Rather than returning a simple positive/negative score, it identifies <em>which specific aspects</em> of your brand (pricing, support, UX, reliability) are being discussed positively or negatively, and in which communities.
                            </p>
                            <p>
                                This granularity matters because LLMs are trained on community discourse weighted by engagement signals. A Reddit thread with 200 upvotes discussing your pricing as &quot;overpriced for SMBs&quot; is a high-weight training signal for exactly that sentiment—and it will surface in AI responses to queries about your brand&apos;s value proposition. Our system detects these signals early and provides a Sentiment Correction Brief before they propagate into model weights.
                            </p>
                            <div className="pt-4 border-t border-black/5">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-black/25">Processing 4.2B tokens daily // 150k+ sources // 12 regional nodes</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Data Ribbon: 3 full-width stat blocks */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl" />
                        <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden">
                            {[
                                { icon: Cpu, tag: "Processing Power", stat: "4.2B", unit: "Tokens / Day", body: "Parallel ingestion across GPT-4o, Claude 3.5, and Gemini 1.5 with sub-100ms alert latency across 12 regional nodes.", details: ["99.97% Uptime SLA", "Real-time delta tracking", "Provenance-linked signals"] },
                                { icon: Globe, tag: "Source Diversity", stat: "150k+", unit: "Sources Monitored", body: "Reddit, Discord, niche forums, preprint archives, and regional LLM networks—re-indexed every 48 hours against active training crawlers.", details: ["48hr Re-index Cycle", "17 Content Categories", "Cross-language support"] },
                                { icon: Layers, tag: "Cross-Model Architecture", stat: "3×", unit: "Simultaneous Model Probing", body: "Parallel probe architecture isolates model-specific bias and computes a Brand Coherence Score across the AI ecosystem.", details: ["GPT-4o // Claude 3.5 // Gemini 1.5", "Divergence detection", "90-day rolling baseline"] },
                            ].map((block, i) => {
                                const BlockIcon = block.icon;
                                return (
                                    <motion.div
                                        key={block.tag}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="p-10 flex flex-col gap-5 group hover:bg-white transition-colors duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200">
                                                    <BlockIcon className="h-4 w-4 text-zinc-700" />
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest">Live</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">{block.tag}</span>
                                        </div>
                                        <div>
                                            <div className="text-5xl font-bold text-zinc-900 font-mono">{block.stat}</div>
                                            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">{block.unit}</div>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed">{block.body}</p>
                                        <div className="pt-4 border-t border-slate-200 space-y-2">
                                            {block.details.map(d => (
                                                <div key={d} className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-zinc-300" />{d}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>



            {/* How It Works */}
            <section className="py-32 md:py-64 px-6 bg-white border-t border-black/5" >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-32">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-black/30 mb-8">// 03 // THE PROCESS</div>
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-black mb-6">
                            How It Works
                        </h2>
                        <p className="text-2xl text-black/60 max-w-2xl mx-auto font-light leading-relaxed">
                            Three steps to optimize your AI search presence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AnimatedCard delay={0}>
                            <div className="bento-card p-10 h-full flex flex-col items-start">
                                <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-8">
                                    <Database className="h-7 w-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">1. Connect Data</h3>
                                <p className="text-black/60 font-light text-lg leading-relaxed">
                                    Link your brand assets and define your target prompts. Our system queries multiple LLMs to establish your baseline visibility.
                                </p>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.1}>
                            <div className="bento-card p-10 h-full flex flex-col items-start">
                                <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-8">
                                    <TrendingUp className="h-7 w-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">2. Analyze Reputation</h3>
                                <p className="text-black/60 font-light text-lg leading-relaxed">
                                    Track your AI Share of Voice, sentiment analysis, and LLM Citation Frequency across all major AI models in real-time.
                                </p>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard delay={0.2}>
                            <div className="bento-card p-10 h-full flex flex-col items-start">
                                <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-8">
                                    <Target className="h-7 w-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">3. Deploy Signals</h3>
                                <p className="text-black/60 font-light text-lg leading-relaxed">
                                    Use our Signal Lab to generate optimized structured data and AI-friendly content that improves your GEO performance.
                                </p>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </section>


            {/* Methodology Section */}
            <section className="py-32 md:py-64 px-6 bg-white border-t border-black/5" >
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bento-card p-12 md:p-24 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-black/10 transition-colors duration-1000" />

                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-black/30 mb-12 text-center">// 05 // METHODOLOGY</div>
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-black mb-16 text-center leading-tight">
                            Scan → Analyze <br />→ Signal
                        </h2>
                        <div className="space-y-10 text-2xl text-black/70 font-light leading-relaxed">
                            <p>
                                Tracintel operates on a three-phase continuous loop. <strong className="text-black font-medium">First, we Scan:</strong> Our system queries multiple LLMs with the exact questions your potential customers are asking AI assistants.
                            </p>
                            <p>
                                <strong className="text-black font-medium">Next, we Analyze:</strong> Raw AI responses are processed through our proprietary sentiment analysis engine, revealing patterns invisible to traditional analytics.
                            </p>
                            <p>
                                <strong className="text-black font-medium">Finally, we Signal:</strong> Insights are translated into actionable recommendations. Our Signal Lab identifies high-impact opportunities to shape how AI models recommend your brand.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <CTA />

            <Footer />
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bento-card p-10 h-full relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-8 relative z-10">
                <Icon className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 relative z-10">{title}</h3>
            <p className="text-black/60 text-lg leading-relaxed font-light relative z-10">{description}</p>
        </motion.div>
    );
}

function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
}
