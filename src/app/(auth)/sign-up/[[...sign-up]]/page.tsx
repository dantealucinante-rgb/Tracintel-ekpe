"use client";

import Link from "next/link";
import { Zap, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Link href="/" className="flex items-center gap-2 justify-center mb-12">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10">
                        <Zap className="h-6 w-6 text-white fill-white" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tighter text-black">Tracintel</span>
                </Link>

                <div className="bg-white rounded-3xl border border-black/5 p-10 shadow-2xl shadow-black/5">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                                <Zap className="h-8 w-8 text-emerald-500 fill-emerald-500" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-black mb-2">Check your email</h1>
                            <p className="text-sm text-black/40 mb-8 font-medium">We've sent a magic link to {email} to verify your account.</p>
                            <Link href="/sign-in" className="inline-flex h-12 px-8 bg-black text-white font-bold rounded-xl items-center justify-center transition-all">
                                Go to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight text-black mb-2">Initialize Profile</h1>
                            <p className="text-sm text-black/40 mb-8 font-medium">Join the intelligence network today.</p>

                            <form onSubmit={handleSignUp} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full h-12 bg-black/5 border-transparent focus:bg-white focus:border-black/10 focus:ring-0 rounded-xl pl-12 pr-4 text-sm font-medium transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full h-12 bg-black/5 border-transparent focus:bg-white focus:border-black/10 focus:ring-0 rounded-xl pl-12 pr-4 text-sm font-medium transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-12 bg-black/5 border-transparent focus:bg-white focus:border-black/10 focus:ring-0 rounded-xl pl-12 pr-4 text-sm font-medium transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-medium text-red-600">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-black hover:bg-black/90 text-white font-bold rounded-xl transition-all shadow-xl shadow-black/10 flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? "Initializing..." : "Create Account"}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-black/5 text-center">
                                <p className="text-sm text-black/40 font-medium">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-black hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className="text-center mt-12">
                    <Link href="/" className="text-xs font-mono uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                        ← RETURN_TO_BASE
                    </Link>
                </div>
            </div>
        </div>
    );
}
