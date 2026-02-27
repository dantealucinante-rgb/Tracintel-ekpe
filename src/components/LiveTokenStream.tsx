"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface LiveTokenStreamProps {
    rawText: string;
    isScanning: boolean;
}

export default function LiveTokenStream({ rawText, isScanning }: LiveTokenStreamProps) {
    const [tokens, setTokens] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isScanning) return;

        // Simulate streaming tokens
        const allTokens = rawText.split(' ');
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex >= allTokens.length) {
                clearInterval(interval);
                return;
            }
            setTokens(prev => [...prev, allTokens[currentIndex]]);
            currentIndex++;
        }, 50);

        return () => clearInterval(interval);
    }, [rawText, isScanning]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [tokens]);

    return (
        <div className="w-full h-full bg-black border border-white/10 rounded-lg p-6 font-mono text-[11px] leading-relaxed overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white/40 uppercase tracking-[0.2em] font-bold">Inference_Stream_v4.0</span>
                <span className="ml-auto text-white/20">JSON_PARSER: ACTIVE</span>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto custom-scrollbar space-y-2 selection:bg-white/20"
            >
                <AnimatePresence mode="popLayout">
                    <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                        {tokens.map((token, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.1 }}
                                className="text-white/70"
                            >
                                {token}
                            </motion.span>
                        ))}
                        {isScanning && (
                            <motion.span
                                animate={{ opacity: [0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="inline-block w-1.5 h-3 bg-white/50 align-middle ml-1"
                            />
                        )}
                    </div>
                </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[9px] text-white/20 uppercase tracking-widest">
                <span>Tokens: {tokens.length}</span>
                <span>Latency: 42ms</span>
            </div>
        </div>
    );
}
