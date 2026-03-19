"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
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
                        {/* Overlay */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setDrawerOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 60,
                                background: 'rgba(0,0,0,0.3)',
                            }}
                            className="md:hidden"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            key="drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 38 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 70,
                                width: '100%',
                                background: '#ffffff',
                                padding: '24px',
                                border: 'none',
                                boxShadow: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            className="md:hidden"
                        >
                            {/* Drawer Header Row */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '32px',
                            }}>
                                <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3">
                                    <div className="w-9 h-9 relative">
                                        <Image src="/2.png" alt="Tracintel Logo" fill className="object-contain" />
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', color: '#111827' }}>Tracintel</span>
                                </Link>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '20px',
                                        color: '#111827',
                                        cursor: 'pointer',
                                        padding: '4px',
                                    }}
                                    aria-label="Close menu"
                                >
                                    <X style={{ width: 20, height: 20 }} />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav style={{ flex: 1 }}>
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setDrawerOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: '16px 0',
                                            fontSize: '17px',
                                            fontWeight: 500,
                                            color: '#111827',
                                            borderBottom: '1px solid #F3F4F6',
                                            textDecoration: 'none',
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {/* Dashboard link */}
                                <Link
                                    href="/dashboard"
                                    onClick={() => setDrawerOpen(false)}
                                    style={{
                                        display: 'block',
                                        marginTop: '24px',
                                        padding: '14px 20px',
                                        background: '#111827',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    Dashboard
                                </Link>
                            </nav>
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
