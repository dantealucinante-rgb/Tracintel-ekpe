"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section className="py-32 md:py-64 px-6 bg-white border-t border-black/5">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bento-card p-12 md:p-32 text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <h2 className="text-5xl md:text-9xl font-bold tracking-tighter text-black mb-12 relative z-10 leading-[0.95]">
                        Ready to optimize <br />your AI presence?
                    </h2>
                    <p className="text-2xl text-black/60 mb-16 font-light leading-relaxed max-w-2xl mx-auto relative z-10">
                        Join leading brands using Tracintel to monitor and improve their Generative Engine Optimization strategy.
                    </p>
                    <div className="flex justify-center relative z-10">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/sign-up" className="inline-flex h-16 px-12 rounded-full bg-black text-white font-bold items-center gap-3 transition-all shadow-2xl shadow-black/20 text-lg">
                                Start Free Trial <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
