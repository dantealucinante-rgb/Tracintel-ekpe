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
        <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#DC2626] flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Model Reliability Alerts
                </h3>
                <div className="px-3 py-1 rounded-full bg-[#DC2626]/[0.08] text-[#DC2626] text-[10px] font-bold uppercase tracking-widest">Active Monitoring</div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert, i) => (
                    <div key={i} className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] p-6 relative overflow-hidden group hover:border-[#DC2626]/20 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{alert.model}</span>
                            <span className={cn(
                                "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                                alert.severity === 'HIGH' ? "bg-[#DC2626]/[0.08] text-[#DC2626]" : "bg-[#D97706]/[0.08] text-[#D97706]"
                            )}>
                                {alert.severity} Severity
                            </span>
                        </div>
                        <p className="text-[14px] text-[#111827] leading-relaxed pr-8 font-medium">
                            {alert.text}
                        </p>
                        <div className="absolute right-4 bottom-4 opacity-5 group-hover:opacity-100 transition-opacity">
                            <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-start gap-4">
                <Info className="h-4 w-4 text-[#DC2626]/40 mt-0.5" />
                <p className="text-[11px] text-[#DC2626] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                    Reliability analysis: Hallucination score is slightly higher than baseline for Claude 3.5. We recommend reviewing data grounding for this model architecture.
                </p>
            </div>
        </div>
    );
}
