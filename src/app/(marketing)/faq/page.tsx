"use client";

import Link from 'next/link';
import { Zap, HelpCircle, RefreshCw, BarChart3, Shield, Search, Database, Scale, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
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
                        <span className="font-bold text-2xl tracking-tighter text-black">Tracintel FAQ</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/pricing" className="text-sm font-bold text-black/50 hover:text-black transition-colors">Pricing</Link>
                        <Link href="/contact" className="text-sm font-bold text-black/50 hover:text-black transition-colors">Contact</Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="py-32 px-6 border-b border-black/5 bg-soft-gray">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-8 font-bold">KNOWLEDGE BASE</div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black mb-10 italic">
                        Technical Queries
                    </h1>
                    <p className="text-2xl text-black/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Deep dive into our scanning methodology, data provenance, and sentiment scoring algorithms.
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto space-y-24">

                    {/* Section 1: Methodology */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/10">
                                <Database className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter italic">Methodology</h2>
                        </div>

                        <div className="space-y-6">
                            <FaqItem
                                q="How frequently is data refreshed?"
                                a="Our scanning engine operates on a configurable schedule based on your plan tier. For Pro users, high-volatility keywords (e.g., brand names, crisis terms) are scanned daily at 00:00 UTC. Standard industry terms are refreshed every 72 hours. Enterprise clients can configure real-time scanning (up to hourly intervals) for critical monitoring during product launches or PR events."
                            />
                            <FaqItem
                                q="Do your scans affect public search volume?"
                                a="No. We use a proprietary headless browser cluster to simulate user queries in a sandboxed environment. These queries are isolated and do not artificially inflate search volume metrics reported by other SEO tools. We accurately replicate the 'incognito' user experience to ensure the results we report are unbiased by personalization history."
                            />
                            <FaqItem
                                q="Which geographic regions do you support?"
                                a="We currently simulate queries from IP addresses originating in the US, UK, Canada, Australia, and Germany. Enterprise plans allow for specific city-level IP targeting to debug regional variance in LLM responses (e.g., how Gemini responds in London vs. New York)."
                            />
                        </div>
                    </motion.div>

                    {/* Section 2: Sentiment */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/10">
                                <Scale className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter italic">Sentiment & Scoring</h2>
                        </div>

                        <div className="space-y-6">
                            <FaqItem
                                q="How is 'Sentiment Score' calculated?"
                                a="We use a fine-tuned BERT-based model specifically trained on product reviews and technical documentation. Unlike generic sentiment analyzers that only detect 'happy' or 'sad' words, our model evaluates 'Trust', 'Authority', and 'Competence'. A score of 100 means the LLM cited your brand as the definitive, unquestioned industry leader. A score of 50 implies you were mentioned as one of many options without specific recommendation."
                            />
                            <FaqItem
                                q="What constitutes a 'Citation'?"
                                a="A citation is registered when an LLM explicitly names your brand entity in response to a non-branded query (e.g., 'Best CRM for Startups'). We distinguish between 'Passing Mentions' (a list item) and 'Detailed Recommendations' (a dedicated paragraph). Our 'Share of Voice' metric weights detailed recommendations 3x higher than passing mentions."
                            />
                        </div>
                    </motion.div>

                    {/* Section 3: Privacy & Security */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/10">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter italic">Governance</h2>
                        </div>

                        <div className="space-y-6">
                            <FaqItem
                                q="Do you store the query data?"
                                a="Yes, we store the full text of the LLM responses for historical analysis. This allows you to 'time travel' and see exactly how ChatGPT's perception of your brand has evolved over the last 12 months. All data is encrypted at rest using AES-256 and transit using TLS 1.3."
                            />
                            <FaqItem
                                q="Is my competitor data private?"
                                a="Absolutely. Your tracked keywords and brand configurations are strictly siloed. We do not aggregate client data to train our internal models, nor do we share your monitoring targets with any third parties. Your strategy remains yours."
                            />
                        </div>
                    </motion.div>

                </div>
            </section>

            <section className="py-32 px-6 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 italic">Still have questions?</h2>
                    <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto font-light">
                        Our engineering team is available to discuss specific technical implementation details.
                    </p>
                    <div className="flex justify-center flex-wrap gap-6">
                        <Link href="/docs" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-all">
                            Documentation
                        </Link>
                        <Link href="/contact" className="border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FaqItem({ q, a }: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bento-card overflow-hidden hover:border-black/10 transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-10 text-left"
            >
                <div className="pr-12">
                    <span className="font-bold text-xl md:text-2xl text-black tracking-tighter leading-tight block">{q}</span>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full border border-black/5 flex items-center justify-center bg-soft-gray">
                    {isOpen ? <Minus className="h-4 w-4 text-black" /> : <Plus className="h-4 w-4 text-black" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-10 pt-0 text-xl text-black/50 font-light leading-relaxed border-t border-black/5 pt-10">
                            {a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
