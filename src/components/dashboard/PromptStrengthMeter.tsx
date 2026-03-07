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
        <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#111827]" />
                    Optimization Quality Score
                </h3>
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Inference Analysis</div>
            </div>

            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Fact Density</span>
                        <span className="text-sm font-bold text-[#111827]">{groundedness}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${groundedness}%` }}
                            className="h-full bg-[#111827]"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Model Readability</span>
                        <span className="text-sm font-bold text-emerald-600">{indexability}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${indexability}%` }}
                            className="h-full bg-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-10 p-5 bg-gray-50 border border-[#E5E7EB] rounded-[16px] flex items-start gap-3">
                <Info className="h-4 w-4 text-[#6B7280] mt-0.5" />
                <p className="text-[12px] leading-relaxed text-[#6B7280] font-medium">
                    {aggregate > 80 ? (
                        "High Utility: This description is highly deterministic and likely to form a strong semantic reference in AI model training sets."
                    ) : aggregate > 40 ? (
                        "Moderate Signal: Consider adding more technical specificity (metrics, specs) to improve model understanding."
                    ) : (
                        "Low Signal: High risk of inconsistent responses. Adding structured data and specific details will improve visibility."
                    )}
                </p>
            </div>
        </div>
    );
}
