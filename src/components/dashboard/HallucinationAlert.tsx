"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HallucinationAlert() {
    const alerts = [
        { model: 'GPT-4o', type: 'DATA_DRIFT', severity: 'MEDIUM', text: 'Inconsistent product specs detected in r/technology training node.' },
        { model: 'Claude 3.5', type: 'SENTIMENT_ERR', severity: 'HIGH', text: 'Brand sentiment mismatch: model correlates brand with outdated legacy pricing.' },
    ];

    return (
        <div className="bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF3B30] flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Hallucination Alerts
                </h3>
                <div className="px-2 py-0.5 rounded bg-[#FF3B30]/10 text-[#FF3B30] text-[8px] font-bold uppercase tracking-widest">Active Monitoring</div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert, i) => (
                    <div key={i} className="bg-black/40 border border-[#FF3B30]/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF3B30]/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono font-bold text-white/60 uppercase">{alert.model}</span>
                            <span className={cn(
                                "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                alert.severity === 'HIGH' ? "bg-[#FF3B30]/20 text-[#FF3B30]" : "bg-amber-400/20 text-amber-400"
                            )}>
                                {alert.severity} Severity
                            </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed pr-8">
                            {alert.text}
                        </p>
                        <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <AlertTriangle className="h-4 w-4 text-[#FF3B30]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-start gap-3">
                <Info className="h-3 w-3 text-[#FF3B30]/40 mt-0.5" />
                <p className="text-[9px] text-[#FF3B30]/60 italic font-mono leading-relaxed">
                    System Alert: Hallucination score is 1.2% higher than baseline for Claude 3.5. We recommend a "Hard Metadata Flush" to re-ground the model architecture.
                </p>
            </div>
        </div>
    );
}
