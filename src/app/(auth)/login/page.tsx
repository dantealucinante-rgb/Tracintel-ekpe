"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || "Could not initialize Google sign in");
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex flex-col font-sans selection:bg-black selection:text-white">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            {/* Top Navigation / Logo */}
            <header className="relative z-10 p-12">
                <Link href="/" className="inline-flex items-center gap-4 group">
                    <div className="relative w-10 h-10 bg-black flex items-center justify-center">
                        <Image
                            src="/2.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="invert brightness-0"
                        />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-black">Tracintel</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-24">
                <div className="w-full max-w-[440px] space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-7xl font-bold tracking-tighter text-black font-serif italic leading-none">
                            Sign In
                        </h1>
                        <p className="text-xl text-zinc-500 font-light tracking-tight">
                            Monitor your brand&apos;s narrative across LLMs.
                        </p>
                    </div>

                    <div className="space-y-10">
                        <form onSubmit={handleSignIn} className="space-y-10">
                            {message && (
                                <div className="text-[13px] font-medium text-[#067647] bg-[#ECFDF3] p-4 border-l-2 border-[#067647] font-sans">
                                    {message}
                                </div>
                            )}
                            <div className="space-y-8">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-focus-within:text-black transition-colors">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@domain.com"
                                        className="w-full bg-transparent border-0 border-b border-zinc-200 focus:border-black focus:ring-0 px-0 py-3 text-lg font-medium transition-all placeholder:text-zinc-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-focus-within:text-black transition-colors">
                                            Password
                                        </label>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent border-0 border-b border-zinc-200 focus:border-black focus:ring-0 px-0 py-3 text-lg font-medium transition-all placeholder:text-zinc-200"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 p-4 border-l-2 border-red-600">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-black text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                            </button>
                        </form>

                        <div className="space-y-8">
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-zinc-100"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">or</span>
                                <div className="flex-grow border-t border-zinc-100"></div>
                            </div>

                            <button
                                onClick={handleGoogleSignIn}
                                type="button"
                                className="w-full h-16 bg-white border border-zinc-200 text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-4"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>

                    <footer className="pt-12 border-t border-zinc-100 flex flex-col items-center gap-4">
                        <p className="text-xs text-zinc-400 font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-black font-black uppercase tracking-widest hover:underline decoration-2">
                                Register
                            </Link>
                        </p>
                        <Link href="/forgot-password" avoided-is-internal-link className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest hover:text-black transition-colors">
                            Forgot password?
                        </Link>
                    </footer>
                </div>
            </main>
        </div>
    );
}
