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
            <aside className="w-64 bg-white border-r border-[#E5E7EB] fixed h-full z-40 hidden md:flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center relative">
                            <Image src="/1.png" alt="Tracintel Logo" fill className="object-contain" priority />
                        </div>
                        <span className="font-bold tracking-tight text-[#111827] text-lg">Tracintel</span>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-3 px-3">Navigation</div>
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
                        <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-3 px-3">Settings</div>
                        <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === '/dashboard/settings'} />
                    </div>
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-[#E5E7EB]">
                            {session?.user?.user_metadata?.avatar_url ? (
                                <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-4 w-4 text-[#6B7280]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#111827] truncate">
                                {session?.user?.email?.split('@')[0] || "ekpeandcotravels"}
                            </p>
                            <p className="text-[12px] text-[#6B7280] truncate font-normal">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Mobile Top Bar */}
                <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center relative">
                            <Image src="/1.png" alt="Tracintel Logo" fill className="object-contain" priority />
                        </div>
                        <span className="font-bold tracking-tight text-[#111827] text-base">Tracintel</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {session?.user?.user_metadata?.avatar_url ? (
                                <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-4 w-4 text-[#6B7280]" />
                            )}
                        </div>
                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-50 transition-colors"
                            aria-label="Open navigation"
                        >
                            <Menu className="h-5 w-5 text-[#111827]" />
                        </button>
                    </div>
                </header>

                {/* Desktop Top Header Bar */}
                <header className="h-16 bg-white border-b border-[#E5E7EB] hidden md:flex items-center justify-between px-6">
                    <div>
                        <h2 className="text-sm font-bold text-[#111827]">Default Workspace</h2>
                        <p className="text-[12px] text-[#6B7280] font-normal tracking-tight">AI Search Analytics</p>
                    </div>
                    <button className="px-4 py-2 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-lg transition-colors">
                        Start Free Trial
                    </button>
                </header>

                {/* Page Content — forced full width with no horizontal constraints */}
                <main className="flex-1 m-0 p-0 w-full transition-all duration-500 overflow-x-hidden">
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
                            <div className="h-14 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileNavOpen(false)}>
                                    <div className="w-7 h-7 flex items-center justify-center relative">
                                        <Image src="/1.png" alt="Tracintel Logo" fill className="object-contain" priority />
                                    </div>
                                    <span className="font-bold tracking-tight text-[#111827]">Tracintel</span>
                                </Link>
                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <X className="h-5 w-5 text-[#6B7280]" />
                                </button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-3 px-3">Navigation</div>
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
                                    <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-3 px-3">Settings</div>
                                    <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === '/dashboard/settings'} />
                                </div>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 inset-x-0 z-50 h-16 bg-white/90 backdrop-blur-xl border-t border-[#E5E7EB] flex items-center justify-around px-2 md:hidden">
                {BOTTOM_NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 group"
                        >
                            <Icon
                                className={`h-5 w-5 transition-colors ${isActive ? 'text-[#111827]' : 'text-[#6B7280] group-hover:text-[#111827]'
                                    }`}
                            />
                            <span
                                className={`text-[10px] font-semibold tracking-tight transition-colors ${isActive ? 'text-[#111827]' : 'text-[#6B7280] group-hover:text-[#111827]'
                                    }`}
                            >
                                {label}
                            </span>
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
            className={`flex items-center gap-3 px-3 py-2 transition-all group relative ${active
                ? 'text-[#111827]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 rounded-lg'
                }`}
        >
            {active && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#111827] rounded-full" />
            )}
            <Icon className={`h-5 w-5 transition-colors ${active ? 'text-[#111827]' : 'text-[#6B7280] group-hover:text-[#111827]'}`} />
            <span className="text-[14px] font-medium">{label}</span>
        </Link>
    );
}

