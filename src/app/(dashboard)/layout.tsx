"use client";

import {
    LayoutDashboard,
    Settings,
    Database,
    User,
    Zap,
    Terminal,
    BookOpen,
    Menu,
    X,
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@/lib/supabase/client";

const BOTTOM_NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/prompts', icon: Terminal, label: 'Prompts' },
    { href: '/dashboard/sources', icon: Database, label: 'Sources' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const SIDEBAR_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/prompts', icon: Terminal, label: 'Prompts' },
    { href: '/dashboard/sources', icon: Database, label: 'Sources' },
    { href: '/dashboard/models', icon: Zap, label: 'Models' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<any>(null);
    const pathname = usePathname();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
        };
        getSession();
    }, []);

    useEffect(() => {
        setMobileNavOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-white flex font-sans">

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-black/5 fixed h-full z-40 hidden md:flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-black/5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center relative">
                            <Image src="/1.png" alt="Tracintel Logo" fill className="object-contain" priority />
                        </div>
                        <span className="font-bold tracking-tight text-black">Tracintel</span>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3 px-3">Navigation</div>
                    {SIDEBAR_ITEMS.map((item) => (
                        <SidebarLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            active={pathname === item.href}
                        />
                    ))}
                    <div className="pt-6">
                        <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3 px-3">Settings</div>
                        <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === '/dashboard/settings'} />
                    </div>
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-black/5">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center overflow-hidden">
                            {session?.user?.user_metadata?.avatar_url ? (
                                <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-4 w-4 text-black/60" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">
                                {session?.user?.email?.split('@')[0] || "My Account"}
                            </p>
                            <p className="text-xs text-black/40 truncate">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Mobile Top Bar */}
                <header className="h-14 bg-white border-b border-black/5 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center relative">
                            <Image src="/1.png" alt="Tracintel Logo" fill className="object-contain" priority />
                        </div>
                        <span className="font-bold tracking-tight text-black text-base">Tracintel</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center overflow-hidden">
                            {session?.user?.user_metadata?.avatar_url ? (
                                <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-4 w-4 text-black/60" />
                            )}
                        </div>
                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors"
                            aria-label="Open navigation"
                        >
                            <Menu className="h-5 w-5 text-black" />
                        </button>
                    </div>
                </header>

                {/* Desktop Top Header Bar */}
                <header className="h-16 bg-white border-b border-black/5 hidden md:flex items-center justify-between px-6">
                    <div>
                        <h2 className="text-sm font-bold text-black">Default Workspace</h2>
                        <p className="text-xs text-black/40 font-mono tracking-tight lowercase">AI Search Analytics</p>
                    </div>
                    <button className="px-4 py-2 bg-black hover:bg-black/90 text-white text-sm font-bold rounded-lg transition-colors">
                        Start Free Trial
                    </button>
                </header>

                {/* Page Content — extra bottom padding on mobile to clear bottom nav */}
                <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile Slide-out Sidebar Drawer */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
                        />
                        <motion.aside
                            key="mobile-sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 38 }}
                            className="fixed top-0 left-0 bottom-0 z-[70] w-72 bg-white flex flex-col md:hidden shadow-2xl"
                        >
                            <div className="h-14 flex items-center justify-between px-4 border-b border-black/5">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileNavOpen(false)}>
                                    <div className="w-7 h-7 flex items-center justify-center relative">
                                        <Image src="/1.png" alt="Tracintel Logo" fill className="object-contain" priority />
                                    </div>
                                    <span className="font-bold tracking-tight text-black">Tracintel</span>
                                </Link>
                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors"
                                >
                                    <X className="h-5 w-5 text-black/50" />
                                </button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3 px-3">Navigation</div>
                                {SIDEBAR_ITEMS.map((item) => (
                                    <SidebarLink
                                        key={item.href}
                                        href={item.href}
                                        icon={item.icon}
                                        label={item.label}
                                        active={pathname === item.href}
                                    />
                                ))}
                                <div className="pt-6">
                                    <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3 px-3">Settings</div>
                                    <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === '/dashboard/settings'} />
                                </div>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 inset-x-0 z-50 h-16 bg-white/90 backdrop-blur-xl border-t border-black/5 flex items-center justify-around px-2 md:hidden">
                {BOTTOM_NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 group"
                        >
                            <Icon
                                className={`h-5 w-5 transition-colors ${isActive ? 'text-[#007AFF]' : 'text-black/30 group-hover:text-black/60'
                                    }`}
                            />
                            <span
                                className={`text-[10px] font-semibold tracking-tight transition-colors ${isActive ? 'text-[#007AFF]' : 'text-black/30 group-hover:text-black/60'
                                    }`}
                            >
                                {label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute bottom-0 h-0.5 w-8 bg-[#007AFF] rounded-t-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

function SidebarLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${active
                ? 'bg-[#007AFF]/8 text-[#007AFF]'
                : 'text-black/60 hover:text-black hover:bg-black/5'
                }`}
        >
            <Icon className={`h-5 w-5 transition-colors ${active ? 'text-[#007AFF]' : 'text-black/40 group-hover:text-black'}`} />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}
