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
    LogOut,
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            setIsSigningOut(false);
        }
    };

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

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0F172A] text-[#94A3B8]">
            {/* Logo */}
            <div className="h-20 flex items-center px-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1.5 shadow-lg shadow-white/10">
                        <Image src="/1.png" alt="Logo" width={20} height={20} className="object-contain" priority />
                    </div>
                    <span className="font-display font-semibold text-white text-base tracking-tight">Tracintel</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                <div className="space-y-1">
                    <div className="px-4 text-[10px] font-bold text-[#475569] uppercase tracking-[0.08em] mb-4 font-sans">Navigation</div>
                    {SIDEBAR_ITEMS.map((item) => (
                        <SidebarLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            active={pathname === item.href}
                        />
                    ))}
                </div>

                <div className="space-y-1">
                    <div className="px-4 text-[10px] font-bold text-[#475569] uppercase tracking-[0.08em] mb-4 font-sans">Settings</div>
                    <SidebarLink
                        href="/dashboard/settings"
                        icon={Settings}
                        label="Settings"
                        active={pathname === '/dashboard/settings'}
                    />
                </div>
            </nav>

            {/* System Status Strip */}
            <div className="px-6 py-4 border-t border-[#1E293B] bg-[#0F172A]/50 backdrop-blur-md">
                <div className="space-y-3">
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A] shadow-[0_0_8px_rgba(18,183,106,0.4)]" />
                            <span className="text-[12px] font-sans text-[#94A3B8]">AI Engine</span>
                        </div>
                        <span className="text-[12px] font-sans font-medium text-white transition-opacity">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A] shadow-[0_0_8px_rgba(18,183,106,0.4)]" />
                            <span className="text-[12px] font-sans text-[#94A3B8]">Data Buffer</span>
                        </div>
                        <span className="text-[12px] font-sans font-medium text-white transition-opacity">OPTIMAL</span>
                    </div>
                </div>
            </div>

            {/* Sign Out Button */}
            <div className="px-4 py-2 border-t border-[#1E293B]">
                <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-3 w-full px-4 py-3 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-all disabled:opacity-50 text-left font-sans rounded-lg"
                    style={{ fontSize: '13px' }}
                >
                    <LogOut className="h-[18px] w-[18px]" />
                    <span className="font-medium">{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
                </button>
            </div>

            {/* User Footer */}
            <div className="p-4 bg-[#1E293B]">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center text-white text-[12px] font-bold border border-white/5 shadow-inner">
                        {session?.user?.email ? session.user.email[0].toUpperCase() : 'JD'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white truncate font-sans tracking-tight">
                            {session?.user?.email?.split('@')[0] || "Administrator"}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] font-medium font-sans">Pro Enterprise</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 fixed h-full z-40 hidden md:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Mobile Top Bar */}
                <header className="h-16 bg-white border-b border-[#EAECF0] flex items-center justify-between px-6 md:hidden sticky top-0 z-30 shadow-sm">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#0F172A] rounded-lg flex items-center justify-center p-1.5">
                            <Image src="/1.png" alt="Logo" width={16} height={16} className="invert brightness-0" priority />
                        </div>
                        <span className="font-display font-bold text-[#101828] text-base tracking-tight">Tracintel</span>
                    </Link>
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8F9FA] border border-[#EAECF0] hover:bg-[#F2F4F7] transition-all"
                    >
                        <Menu className="h-5 w-5 text-[#101828]" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 w-full relative">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 z-[60] bg-[#0F172A]/40 backdrop-blur-sm md:hidden"
                        />
                        <motion.aside
                            key="mobile-sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 40, stiffness: 400 }}
                            className="fixed top-0 left-0 bottom-0 z-[70] w-72 md:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-4 py-2.5 transition-all group relative font-sans ${active
                ? 'text-white bg-[#1E293B]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                } rounded-md mx-2`}
        >
            {active && (
                <div className="absolute left-[-8px] top-2.5 bottom-2.5 w-[2px] bg-white rounded-full shadow-[0_0_8px_white]" />
            )}
            <div className="flex items-center gap-3">
                <Icon className={`h-[18px] w-[18px] transition-colors ${active ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'}`} />
                <span className="text-[13px] font-medium">{label}</span>
            </div>
        </Link>
    );
}

