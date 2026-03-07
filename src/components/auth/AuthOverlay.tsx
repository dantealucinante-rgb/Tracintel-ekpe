'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { LogIn, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AuthOverlayProps {
    isVisible: boolean;
}

export function AuthOverlay({ isVisible }: AuthOverlayProps) {
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        // Dynamic redirect target: prioritized by environment variable (canonical)
        // with window.location.origin as a resilient browser-side fallback.
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
            },
        });

        if (error) {
            toast.error("Access Protocol Failure", {
                description: error.message,
            });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="w-full max-w-sm p-10 bg-white border border-[#E5E7EB] shadow-2xl rounded-[24px] relative overflow-hidden"
                    >
                        {/* Background subtle glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[100px]" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/5 blur-[100px]" />

                        <div className="relative z-10 text-center">
                            <div className="inline-flex p-3 rounded-xl bg-gray-50 border border-[#E5E7EB] mb-6">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>

                            <h2 className="text-2xl font-bold mb-3 tracking-tight text-[#111827]">Sign in to Dashboard</h2>
                            <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                                Connect your account to run intelligence scans,
                                track historical data, and access competitor insights.
                            </p>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full group relative flex items-center justify-center gap-3 bg-[#111827] text-white py-4 px-6 rounded-xl font-bold transition-all hover:bg-black active:scale-[0.98] shadow-sm"
                            >
                                <Zap className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                                <span>Continue with Google</span>
                            </button>

                            <p className="mt-8 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                                Secure Authentication Protocol
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
