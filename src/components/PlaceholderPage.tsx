"use client";

import Link from 'next/link';
import { ArrowLeft, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PlaceholderPageProps {
    title: string;
    description: string;
    comingSoonItems: string[];
}

export default function PlaceholderPage({ title, description, comingSoonItems }: PlaceholderPageProps) {
    const [session, setSession] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-black/5 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white fill-white" />
                        </div>
                        <span className="font-bold tracking-tight text-black">Tracintel</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {!session ? (
                            <>
                                <Link href="/sign-in" className="text-sm font-medium text-black/60 hover:text-black transition-colors">
                                    Log In
                                </Link>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/sign-up" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                        Start Free Trial
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-black/60 hover:text-black transition-colors mr-2">
                                    Dashboard
                                </Link>
                                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center border border-black/10 overflow-hidden">
                                    {session.user?.user_metadata?.avatar_url ? (
                                        <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-4 w-4 text-black/60" />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Coming Soon Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-black text-sm font-medium mb-8">
                            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                            Coming Soon
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-black mb-6">
                            {title}
                        </h1>

                        <p className="text-xl text-black/60 mb-12 max-w-2xl mx-auto font-light">
                            {description}
                        </p>

                        {/* What's Coming */}
                        <div className="bg-white rounded-2xl border border-black/5 p-8 mb-12 text-left shadow-sm">
                            <h2 className="text-2xl font-bold tracking-tighter text-black mb-6 text-center">
                                What's Coming
                            </h2>
                            <ul className="space-y-4">
                                {comingSoonItems.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-black" />
                                        </div>
                                        <span className="text-black/70 leading-relaxed">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-black/10 hover:border-black/20 text-black/70 font-medium transition-colors">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Home
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black hover:bg-black/90 text-white font-medium transition-colors shadow-lg shadow-black/10">
                                    Get Early Access
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
