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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-md p-8 bg-zinc-900/80 border border-white/5 shadow-2xl rounded-2xl relative overflow-hidden"
                    >
                        {/* Background subtle glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px]" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[100px]" />

                        <div className="relative z-10 text-center">
                            <div className="inline-flex p-3 rounded-xl bg-white/5 border border-white/10 mb-6">
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                            </div>

                            <h2 className="text-2xl font-semibold mb-2 tracking-tight">Access Protocol Required</h2>
                            <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-mono">
                                Establishing secure handshake with Neural Vault...
                                <br />
                                Session verification required to access live intelligence nodes.
                            </p>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full group relative flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-xl font-medium transition-all hover:bg-zinc-200 active:scale-[0.98]"
                            >
                                <Zap className="w-5 h-5 fill-black" />
                                <span>Continue with Google</span>
                            </button>

                            <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
                                Enterprise Governance v3.0 // Tracintel Apex
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
