"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ArrowRight, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV_LINKS = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
    { href: '/integrations', label: 'Integrations' },
];

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const pathname = usePathname();
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

    // Close drawer on route change
    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <nav className="border-b border-black/5 bg-white/70 backdrop-blur-md sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Logo — far left */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 flex items-center justify-center relative"
                        >
                            <Image
                                src="/2.png"
                                alt="Tracintel Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <span className="font-extrabold text-2xl tracking-tighter text-black">Tracintel</span>
                    </Link>

                    {/* Desktop Nav — centered */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
                        ))}
                    </div>

                    {/* Desktop CTA — far right */}
                    <div className="hidden md:flex items-center gap-6">
                        {!session ? (
                            <>
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium tracking-tight text-black/50 hover:text-black transition-colors"
                                >
                                    Sign In
                                </Link>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        href="/register"
                                        className="bg-[#111827] text-white px-5 py-2 rounded-[6px] text-[13px] font-semibold transition-all shadow-sm hover:bg-black"
                                    >
                                        Get Early Access
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-[13px] font-medium tracking-tight text-black/50 hover:text-black transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-9 h-9 border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors rounded-full flex items-center justify-center overflow-hidden bg-white"
                                >
                                    <User className="h-4.5 w-4.5 text-[#4B5563]" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-black/5 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5 text-black" />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            key="drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 38 }}
                            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[#0a0a0a] flex flex-col md:hidden overflow-hidden"
                        >
                            {/* Breathing Canvas grid texture */}
                            <div
                                className="absolute inset-0 opacity-[0.04]"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                                    backgroundSize: '28px 28px',
                                }}
                            />

                            {/* Electric Blue glow blob */}
                            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#007AFF] opacity-10 blur-3xl" />
                            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#34C759] opacity-8 blur-3xl" />

                            {/* Drawer Header */}
                            <div className="relative z-10 flex items-center justify-between px-6 h-20 border-b border-white/5">
                                <Link href="/" className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
                                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
                                        <Zap className="h-5 w-5 text-black fill-black" />
                                    </div>
                                    <span className="font-extrabold text-xl tracking-tighter text-white">Tracintel</span>
                                </Link>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5 text-white/70" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="relative z-10 flex-1 px-6 py-8 flex flex-col gap-2">
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.08 + i * 0.06 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setDrawerOpen(false)}
                                            className="group flex items-center justify-between py-4 border-b border-white/5 hover:border-[#007AFF]/30 transition-colors"
                                        >
                                            <span className="text-2xl font-bold tracking-tight text-white/80 group-hover:text-white transition-colors">
                                                {link.label}
                                            </span>
                                            <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-[#007AFF] group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Auth links in drawer */}
                                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
                                    {!session ? (
                                        <Link
                                            href="/login"
                                            onClick={() => setDrawerOpen(false)}
                                            className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setDrawerOpen(false)}
                                            className="text-sm font-medium text-white/40 hover:text-white transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                </div>
                            </nav>

                            {/* Drawer Footer CTA */}
                            <motion.div
                                className="relative z-10 px-6 pb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                {/* System status dot */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">System Active</span>
                                </div>

                                {!session ? (
                                    <Link
                                        href="/register"
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-gradient-to-r from-[#007AFF] to-indigo-600 text-white font-bold text-base shadow-2xl shadow-blue-500/30 hover:shadow-[0_0_30px_rgba(0,122,255,0.5)] transition-all"
                                    >
                                        Get Early Access <ArrowRight className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-gradient-to-r from-[#007AFF] to-indigo-600 text-white font-bold text-base shadow-2xl shadow-blue-500/30 hover:shadow-[0_0_30px_rgba(0,122,255,0.5)] transition-all"
                                    >
                                        Open Dashboard <ArrowRight className="h-5 w-5" />
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`relative text-[13px] font-medium tracking-[-0.01em] transition-colors group ${active ? 'text-black' : 'text-black/50 hover:text-black'
                }`}
        >
            {label}
            {/* Animated underline */}
            <span
                className={`absolute -bottom-0.5 left-0 h-px bg-black transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
            />
        </Link>
    );
}
