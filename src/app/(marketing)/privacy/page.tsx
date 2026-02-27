"use client";

import Link from 'next/link';
import { Zap, Shield, Lock, Eye, Database, Server, Globe, FileText, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
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
                        <Link href="/terms" className="text-black/50 hover:text-black transition-colors">Terms</Link>
                        <Link href="/contact" className="text-black/50 hover:text-black transition-colors">Contact</Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-32 md:py-48">
                <header className="mb-24">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-8 border-l border-black pl-5 font-bold">// PRIVACY & DATA PROVENANCE</div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-12 italic text-black leading-[0.85]">Privacy Protocol</h1>
                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono font-bold tracking-widest text-black/40">
                        <span className="bg-soft-gray px-4 py-2 rounded-full border border-black/5">REVISION: 2026.02.17</span>
                        <span className="bg-soft-gray px-4 py-2 rounded-full border border-black/5">STATUS: ACTIVE</span>
                    </div>
                </header>

                <div className="text-xl md:text-2xl text-black/50 leading-relaxed font-light space-y-24">
                    <p className="text-2xl md:text-3xl text-black leading-tight mb-24 italic border-b border-black/5 pb-10">
                        In the age of generative intelligence, privacy is not just about protecting personal details; it is about protecting the <span className="text-black font-medium underline underline-offset-8">strategic perimeter</span> of your brand.
                    </p>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">01. The Strategic Perimeter</h2>
                        <div className="space-y-8">
                            <p>
                                At Tracintel, we operate on a principle of **Zero-Knowledge Surveillance**. We monitor the public-facing intelligence of Large Language Models (LLMs) without compromising the private internal strategies of our users.
                            </p>
                            <div className="bento-card p-12 bg-soft-gray border-black/5">
                                <ul className="space-y-6 text-sm font-mono uppercase tracking-widest text-black font-bold">
                                    <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5" /> Identity Data Encryption</li>
                                    <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5" /> Config Isolation</li>
                                    <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5" /> Telemetry Auditing</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">02. AI Model Interfacing</h2>
                        <p>
                            We utilize API-level interfaces that exclude your query data from being used in the training of underlying model weights. Your probes are ephemeral at the model layer.
                        </p>
                        <div className="bento-card p-12 bg-black text-white shadow-2xl shadow-black/20 my-12">
                            <h4 className="flex items-center gap-3 font-bold mb-6 uppercase text-[10px] font-mono tracking-[0.3em] text-white/40"><Shield className="h-4 w-4" /> NO-TRAIN GUARANTEE</h4>
                            <p className="text-lg leading-relaxed text-white/60 mb-0 font-light italic">
                                We enforce strict contractual exclusions with model providers. Your intelligence probes do not leak into the public weight-space.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">03. Ground Truth Retention</h2>
                        <p>
                            We maintain a "Historical Ground Truth" database for each customer, enabling **Time-Series Sentiment Auditing**. Data is encrypted at rest using AES-256 and transit using TLS 1.3.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 italic text-black">04. Contact Governance</h2>
                        <p>
                            For inquiries regarding your data rights, please contact our Data Governance lead:
                        </p>
                        <div className="bento-card p-10 font-mono text-sm border-black/5 bg-soft-gray text-black font-bold tracking-tight">
                            EMAIL: GOVERNANCE@TRACINTEL.AI<br />
                            REFERENCE: DATA_PROVENANCE_AUDIT
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
