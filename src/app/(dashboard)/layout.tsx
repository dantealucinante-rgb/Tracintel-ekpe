"use client";

import {
    LayoutDashboard,
    Settings,
    Database,
    Zap,
    Terminal,
    Search,
    Globe,
    Users,
    LogOut,
    Menu,
    ChevronRight
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/scans', label: 'Scans' },
    { href: '/dashboard/brands', label: 'Brands' },
    { href: '/dashboard/sources', label: 'Sources' },
    { href: '/dashboard/models', label: 'Models' },
    { href: '/dashboard/settings', label: 'Settings' },
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
        <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB]">
            {/* Logo */}
            <div className="h-20 flex items-center px-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center p-1.5">
                        <Image src="/1.png" alt="Logo" width={20} height={20} className="invert brightness-0" priority />
                    </div>
                    <span className="font-sans font-bold text-[#111827] text-[18px] tracking-tight">Tracintel</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {SIDEBAR_ITEMS.map((item) => (
                    <SidebarLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        active={pathname === item.href}
                    />
                ))}
            </nav>

            {/* Status & User */}
            <div className="p-6 space-y-6 mt-auto">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] rounded-md border border-[#E5E7EB]">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        process.env.NEXT_PUBLIC_ENABLE_SIMULATION_MODE === 'true' ? "bg-[#D97706]" : "bg-[#16A34A]"
                    )} />
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
                        {process.env.NEXT_PUBLIC_ENABLE_SIMULATION_MODE === 'true' ? "Simulation" : "Live"}
                    </span>
                </div>

                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#111827] text-[12px] font-bold">
                        {session?.user?.email ? session.user.email[0].toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#111827] truncate font-sans">
                            {session?.user?.email?.split('@')[0] || "Admin"}
                        </p>
                    </div>
                    <button onClick={handleSignOut} className="p-1.5 text-[#6B7280] hover:text-[#111827] transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F8FA] flex font-sans text-[#111827]">
            {/* Desktop Sidebar */}
            <aside className="w-[240px] fixed h-full z-40 hidden md:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-[240px] flex flex-col">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 md:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center p-1.5">
                            <Image src="/1.png" alt="Logo" width={16} height={16} className="invert" priority />
                        </div>
                        <span className="font-sans font-bold text-[#111827] text-base">Tracintel</span>
                    </div>
                    <button onClick={() => setMobileNavOpen(true)} className="p-2 text-[#6B7280]">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 w-full relative">
                    {children}
                </main>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 z-[60] bg-[#111827]/40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 z-[70] w-64 md:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center px-3 py-2 transition-all group rounded-md text-[14px] font-medium",
                active
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]'
            )}
        >
            <span>{label}</span>
        </Link>
    );
}

