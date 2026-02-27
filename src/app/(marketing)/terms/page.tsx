"use client";

import Link from 'next/link';
import { Zap, Scale, FileText, ShieldAlert, Cpu, Gavel } from 'lucide-react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Navbar */}
            <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10"
                        >
                            <Zap className="h-6 w-6 text-white fill-white" />
                        </motion.div>
                        <span className="font-bold text-2xl tracking-tighter text-black">Tracintel</span>
                    </Link>
                    <div className="flex items-center gap-8 text-sm font-bold">
                        <Link href="/privacy" className="text-black/50 hover:text-black transition-colors">Privacy</Link>
                        <Link href="/contact" className="text-black/50 hover:text-black transition-colors">Contact</Link>
                    </div>
                </div>
            </nav>

            <main className="py-32 md:py-48 px-6 max-w-4xl mx-auto">
                <header className="mb-24">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-8 border-l border-black pl-5 font-bold">// GOVERNANCE & COMPLIANCE</div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-12 italic text-black leading-[0.85]">Service Terms</h1>
                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono font-bold tracking-widest text-black/40">
                        <span className="bg-soft-gray px-4 py-2 rounded-full border border-black/5">VERSION: 2026.02.17</span>
                        <span className="bg-soft-gray px-4 py-2 rounded-full border border-black/5">JURISDICTION: DELAWARE, USA</span>
                    </div>
                </header>

                <div className="text-xl md:text-2xl text-black/50 leading-relaxed font-light space-y-24">
                    <p className="text-2xl md:text-3xl text-black leading-tight mb-24 italic border-b border-black/5 pb-10">
                        By accessing the Tracintel platform ("Service"), provided by Tracintel, Inc. ("Company"), you agree to be bound by these Terms of Service.
                    </p>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">01. Service Provision</h2>
                        <p>
                            Tracintel grants you a non-exclusive, revocable license to use our Generative Engine Optimization (GEO) tools. We reserve the right to modify model support and adjust scoring algorithms as the AI landscape shifts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">02. API & Entropy</h2>
                        <p>
                            Any account utilizing our API must adhere to high-bandwidth standards. Your usage is governed by tier-specific limits. If you exceed these, your probes may be throttled to ensure global node network stability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">03. Probabilistic Disclaimer</h2>
                        <div className="bento-card p-12 bg-black text-white shadow-2xl shadow-black/20 my-12">
                            <h4 className="flex items-center gap-3 font-bold mb-6 uppercase text-[10px] font-mono tracking-[0.3em] text-white/40"><ShieldAlert className="h-4 w-4" /> STATISTICAL DISCLAIMER</h4>
                            <p className="text-lg leading-relaxed text-white/60 mb-0 font-light italic">
                                Tracintel analyzes third-party probabilistic models (LLMs). We provide market intelligence and statistical probability, not absolute factual certainty. You assume all risk for business decisions based on these metrics.
                            </p>
                        </div>
                    </section>

                    <section className="pt-24 border-t border-black/5">
                        <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-black/20 uppercase tracking-[0.3em]">
                            <Gavel className="h-4 w-4" />
                            <span>END OF DOCUMENT // TRACINTEL GRC SYSTEM</span>
                            <span className="ml-auto">NO: TI_TS_2026_01</span>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
