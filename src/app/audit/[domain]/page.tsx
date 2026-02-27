"use client";

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import BentoGrid, { BentoCard } from '@/components/BentoGrid';
import { Target, BarChart3, Zap, Shield, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AuditReportPage() {
    const params = useParams();
    const domain = params.domain as string;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-7xl mx-auto pt-32 pb-32 px-6">
                <div className="mb-16 flex flex-col md:flex-row items-baseline justify-between gap-8 border-b border-black/5 pb-16">
                    <div>
                        <div className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.3em] mb-4">// Public_Audit_v1.0</div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black font-serif italic">
                            {domain}
                        </h1>
                        <p className="text-xl text-black/50 mt-4 max-w-xl font-light">
                            GEO Gap Analysis and visibility audit for the generative search era.
                        </p>
                    </div>

                    <button onClick={() => window.print()} className="h-14 px-8 rounded-full bg-black text-white font-bold flex items-center gap-3 hover:bg-black/90 transition-all">
                        <FileText className="h-4 w-4" />
                        Download Report PDF
                    </button>
                </div>

                <BentoGrid className="mb-16">
                    <BentoCard
                        title="Visibility Index"
                        value="64.2"
                        description="Overall mindshare ranking across GPT-4, Gemini, and Claude benchmarks."
                        icon={Target}
                        trend="-12%"
                        trendType="down"
                    />
                    <BentoCard
                        title="Gap Delta"
                        value="-18.5"
                        description="Performance variance between current brand and industry leaders."
                        icon={BarChart3}
                        trend="High Importance"
                    />
                    <BentoCard
                        title="Actionable Signals"
                        value="3 High"
                        description="Specific technical optimizations available to reclaim citation share."
                        icon={Zap}
                        trendType="neutral"
                    />
                </BentoGrid>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold tracking-tighter font-serif italic border-l-4 border-black pl-6">The Gap Analysis</h2>
                        <div className="space-y-6">
                            {[
                                { name: "Linear", score: 88, gap: -24 },
                                { name: "Jira", score: 72, gap: -8 },
                                { name: "Asana", score: 68, gap: -4 }
                            ].map((comp, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-black/[0.02] rounded-2xl border border-black/5">
                                    <div className="font-bold text-lg">{comp.name}</div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <div className="text-[10px] font-mono text-black/30 tracking-widest uppercase mb-1">Score</div>
                                            <div className="font-bold font-serif">{comp.score}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-mono text-black/30 tracking-widest uppercase mb-1">Gap</div>
                                            <div className="font-bold font-serif text-rose-600">{comp.gap}%</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold tracking-tighter font-serif italic border-l-4 border-black pl-6">Technical Recommendations</h2>
                        <div className="bento-card p-10 space-y-6">
                            <ul className="space-y-6">
                                {[
                                    { title: "Structured Data Injection", desc: "Inject Product and Organization Schema.org entities to improve training metadata recognition." },
                                    { title: "Semantic Value Prop Alignment", desc: "Update H1/H2 tags to match latent space search intent for 'High-performance PM tools'." },
                                    { title: "Authority Signal Hardening", desc: "Publish first-party case studies to verify enterprise-readiness claims for RAG pipelines." }
                                ].map((rec, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">{i + 1}</div>
                                        <div>
                                            <div className="font-bold text-black mb-1">{rec.title}</div>
                                            <p className="text-sm text-black/50 leading-relaxed">{rec.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
