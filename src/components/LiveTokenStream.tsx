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
        <div className="w-full h-full bg-white border border-[#E5E7EB] rounded-[16px] p-6 text-[13px] leading-relaxed overflow-hidden flex flex-col shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-[#E5E7EB] pb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[#111827] font-bold tracking-tight">Intelligence Stream</span>
                <span className="ml-auto text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Active Scan</span>
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
                                className="text-[#374151] font-medium"
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

            <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex justify-between text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                <span>Tokens: {tokens.length}</span>
                <span>Latency: 42ms</span>
            </div>
        </div>
    );
}
