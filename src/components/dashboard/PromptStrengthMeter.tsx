"use client";

import { motion } from 'framer-motion';
import { Target, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptStrengthMeterProps {
    description: string;
}

export default function PromptStrengthMeter({ description }: PromptStrengthMeterProps) {
    // Simple heuristic for "Groundedness" (fact-based)
    const calculateGroundedness = (text: string) => {
        const factKeywords = ['spec', 'data', 'verified', 'performance', 'latency', 'architecture', 'metrics'];
        const count = factKeywords.filter(k => text.toLowerCase().includes(k)).length;
        return Math.min(100, Math.round((count / 3) * 100));
    };

    // Simple heuristic for "Indexability" (structure/parsing)
    const calculateIndexability = (text: string) => {
        const structureChecks = [
            text.length > 100,
            text.includes('\n'),
            text.includes('- ') || text.includes('1. '),
            /[A-Z]/.test(text)
        ];
        const count = structureChecks.filter(Boolean).length;
        return Math.min(100, Math.round((count / structureChecks.length) * 100));
    };

    const groundedness = calculateGroundedness(description);
    const indexability = calculateIndexability(description);
    const aggregate = Math.round((groundedness + indexability) / 2);

    return (
        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#007AFF]" />
                    Prompt Strength Meter
                </h3>
                <div className="text-[10px] font-mono text-white/20 uppercase">Inference Validation</div>
            </div>

            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Groundedness (Fact-Bias)</span>
                        <span className="text-sm font-mono font-bold text-[#007AFF]">{groundedness}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${groundedness}%` }}
                            className="h-full bg-[#007AFF] shadow-[0_0_10px_rgba(0,122,255,0.3)]"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Indexability (Parser Ease)</span>
                        <span className="text-sm font-mono font-bold text-[#34C759]">{indexability}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${indexability}%` }}
                            className="h-full bg-[#34C759] shadow-[0_0_10px_rgba(52,199,89,0.3)]"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-10 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                <Info className="h-4 w-4 text-[#007AFF] mt-0.5" />
                <p className="text-[11px] leading-relaxed text-zinc-500">
                    {aggregate > 80 ? (
                        "High Utility: This description is highly deterministic and likely to form a Semantic Anchor in AI latent space."
                    ) : aggregate > 40 ? (
                        "Moderate Signal: Consider adding more technical specificity (metrics, specs) to improve model grounding."
                    ) : (
                        "Weak Inference: High risk of hallucination. The lack of structured data nodes makes this description difficult for LLMs to parse accurately."
                    )}
                </p>
            </div>
        </div>
    );
}
