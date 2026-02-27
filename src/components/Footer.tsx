"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const SimpleLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
        <li>
            <Link
                href={href}
                className={`text-sm transition-all flex items-center gap-2 ${isActive(href) ? 'text-black font-bold' : 'text-black/50 hover:text-black hover:opacity-100'
                    }`}
            >
                {isActive(href) && (
                    <motion.div
                        layoutId="active-dot"
                        className="w-1 h-1 rounded-full bg-black"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    />
                )}
                {children}
            </Link>
        </li>
    );


    return (
        <footer className="bg-white border-t border-black/5 pb-24">
            <div className="max-w-7xl mx-auto px-6 py-32">
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-16 mb-32">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <img src="/2.png" alt="Tracintel Logo" className="w-full h-full object-contain" />
                            </motion.div>
                            <span className="font-extrabold tracking-tighter text-xl text-black">Tracintel</span>
                        </Link>
                        <p className="text-xs font-mono uppercase tracking-widest text-black/30 leading-relaxed mb-6">
                            Intelligence for the AI Economy.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/20 mb-6 font-bold">Product</h3>
                        <ul className="space-y-4">
                            <SimpleLink href="/features">Features</SimpleLink>
                            <SimpleLink href="/integrations">Integrations</SimpleLink>
                            <SimpleLink href="/pricing">Pricing</SimpleLink>
                            <SimpleLink href="/changelog">Changelog</SimpleLink>
                            <SimpleLink href="/signal-lab">Signal Lab</SimpleLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/20 mb-6 font-bold">Company</h3>
                        <ul className="space-y-4">
                            <SimpleLink href="/about">About</SimpleLink>
                            <SimpleLink href="/careers">Careers</SimpleLink>
                            <SimpleLink href="/contact">Contact</SimpleLink>
                            <SimpleLink href="/customers">Customers</SimpleLink>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/20 mb-6 font-bold">Resources</h3>
                        <ul className="space-y-4">
                            <SimpleLink href="/docs">Documentation</SimpleLink>
                            <SimpleLink href="/blog">Blog</SimpleLink>
                            <SimpleLink href="/guides">Guides</SimpleLink>
                            <SimpleLink href="/faq">FAQ</SimpleLink>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/20 mb-6 font-bold">Legal</h3>
                        <ul className="space-y-4">
                            <SimpleLink href="/privacy">Privacy</SimpleLink>
                            <SimpleLink href="/terms">Terms</SimpleLink>
                            <SimpleLink href="/cookies">Cookies</SimpleLink>
                            <SimpleLink href="/security">Security</SimpleLink>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/20 mb-6 font-bold">Social</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-all"><Twitter className="h-4 w-4" /> Twitter</a></li>
                            <li><a href="#" className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-all"><Linkedin className="h-4 w-4" /> LinkedIn</a></li>
                            <li><a href="#" className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-all"><Github className="h-4 w-4" /> GitHub</a></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-16 border-t border-black/5">
                    <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-black/5 gap-8">
                        <div className="flex items-center gap-6 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/30">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span>System Status: Active</span>
                            </div>
                            <span>Latency: 24ms</span>
                        </div>
                        <p className="text-[10px] font-mono text-black/20 uppercase tracking-[0.4em]">
                            Built for the generative economy
                        </p>
                    </div>
                    <p className="text-xs text-black/40 font-medium">
                        &copy; {new Date().getFullYear()} Tracintel. All rights reserved.
                    </p>

                    {/* Compliance & Ethics */}
                    <div className="max-w-2xl mt-8 pt-8 border-t border-black/5">
                        <p className="text-[10px] leading-relaxed text-black/30 font-medium uppercase tracking-widest mb-4">Compliance {"&"} Ethics Statement</p>
                        <p className="text-[11px] leading-relaxed text-black/40 font-medium">
                            Tracintel operates in accordance with the Fair AI Data Initiative. Our scraping methodology respects robots.txt and focuses exclusively on publicly accessible LLM inference outputs. We do not ingest private user data or bypass authentication layers. All brand intelligence is derived through ethical, low-latency sampling of global model endpoints to ensure data integrity without compromising provider terms.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
