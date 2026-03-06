"use client";

import Link from "next/link";
import { Zap, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
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
                    <h1 className="text-2xl font-bold tracking-tight text-black mb-2">Welcome back</h1>
                    <p className="text-sm text-black/40 mb-8 font-medium">Enter your credentials to access the console.</p>

                    <form onSubmit={handleSignIn} className="space-y-5">
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
                            {loading ? "Verifying..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-black/5 text-center">
                        <p className="text-sm text-black/40 font-medium">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-black hover:underline">
                                Request Access
                            </Link>
                        </p>
                    </div>
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
