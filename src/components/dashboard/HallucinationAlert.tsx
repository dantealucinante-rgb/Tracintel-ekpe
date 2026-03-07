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
        <div className="bg-red-50/50 border border-red-100 rounded-[24px] p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Model Reliability Alerts
                </h3>
                <div className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Active Monitoring</div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert, i) => (
                    <div key={i} className="bg-white border border-red-100/50 rounded-[16px] p-6 relative overflow-hidden group hover:border-red-200 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{alert.model}</span>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight",
                                alert.severity === 'HIGH' ? "bg-red-50 text-red-600 border border-red-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                            )}>
                                {alert.severity} Severity
                            </span>
                        </div>
                        <p className="text-[13px] text-[#374151] leading-relaxed pr-8 font-medium">
                            {alert.text}
                        </p>
                        <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-start gap-3">
                <Info className="h-4 w-4 text-red-400 mt-0.5" />
                <p className="text-[11px] text-red-700/70 font-medium leading-relaxed">
                    Reliability analysis: Hallucination score is slightly higher than baseline for Claude 3.5. We recommend reviewing data grounding for this model architecture.
                </p>
            </div>
        </div>
    );
}
