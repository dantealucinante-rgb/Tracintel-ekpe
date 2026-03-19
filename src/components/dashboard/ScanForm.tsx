"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ScanFormProps {
    onScan: (data: { brand: string; industry: string; competitors: string[] }) => Promise<void>;
    isLoading: boolean;
}

export default function ScanForm({ onScan, isLoading }: ScanFormProps) {
    const [brand, setBrand] = useState('');
    const [industry, setIndustry] = useState('');
    const [competitors, setCompetitors] = useState('');
    const [progress, setProgress] = useState(0);
    const [stageLabel, setStageLabel] = useState('');
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        let t1: NodeJS.Timeout, t2: NodeJS.Timeout, t3: NodeJS.Timeout, t4: NodeJS.Timeout, t5: NodeJS.Timeout, hideTimer: NodeJS.Timeout;

        if (isLoading) {
            setShowProgress(true);
            setProgress(0);
            setStageLabel("Connecting to AI models...");

            // Stage 1 (0-20%): "Connecting to AI models..." — duration 1s
            t1 = setTimeout(() => { setProgress(20); }, 100);

            // Stage 2 (20-45%): "Analyzing brand recognition..." — duration 2s
            t2 = setTimeout(() => { setProgress(45); setStageLabel("Analyzing brand recognition..."); }, 1100);

            // Stage 3 (45-65%): "Comparing competitors..." — duration 2s
            t3 = setTimeout(() => { setProgress(65); setStageLabel("Comparing competitors..."); }, 3100);

            // Stage 4 (65-85%): "Calculating visibility scores..." — duration 2s
            t4 = setTimeout(() => { setProgress(85); setStageLabel("Calculating visibility scores..."); }, 5100);

            // Stage 5 (85-100%): "Finalizing intelligence report..." — duration 1s
            t5 = setTimeout(() => { setProgress(98); setStageLabel("Finalizing intelligence report..."); }, 7100);

        } else if (showProgress) {
            setProgress(100);
            setStageLabel("Complete!");
            hideTimer = setTimeout(() => {
                setShowProgress(false);
                setProgress(0);
            }, 500);
        }

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            clearTimeout(t5);
            clearTimeout(hideTimer);
        };
    }, [isLoading, showProgress]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !industry || !competitors) return;

        const competitorsArray = competitors
            .split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);

        await onScan({
            brand,
            industry,
            competitors: competitorsArray
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-[20px] mb-[28px] text-left">
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                        Brand Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Apple, Nike, Tracintel"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-[14px] py-[12px] text-[14px] text-[#111827] focus:border-[#2563EB]/30 focus:bg-white focus:outline-none transition-all placeholder:text-[#94A3B8] font-medium"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                        Industry
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Technology, Healthcare, Fashion"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-[14px] py-[12px] text-[14px] text-[#111827] focus:border-[#2563EB]/30 focus:bg-white focus:outline-none transition-all placeholder:text-[#94A3B8] font-medium"
                    />
                </div>

                <div className="flex flex-col gap-2 relative">
                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                        Competitors
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Google, Microsoft, Samsung"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        required
                        className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg px-[14px] py-[12px] text-[14px] text-slate-900 focus:border-[#3B4EFF]/30 focus:bg-white focus:outline-none transition-all placeholder:text-[#94A3B8] mb-1 font-medium"
                    />
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        Separate multiple competitors with a comma
                    </span>
                </div>
            </div>

            {showProgress && (
                <div className="mb-[24px] animate-in fade-in duration-300">
                    <div className="w-full h-[3px] bg-[#F7F8FA] rounded-full overflow-hidden mb-[12px]">
                        <div
                            className="h-full bg-[#2563EB] transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[11px] font-bold text-[#6B7280] text-center uppercase tracking-widest">
                        {stageLabel}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !brand || !industry || !competitors}
                className="w-full bg-[#2563EB] text-white font-medium text-[14px] py-[14px] rounded-[8px] hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin opacity-70" />
                        {stageLabel || "SCANNING..."}
                    </>
                ) : (
                    "RUN VISIBILITY SCAN"
                )}
            </button>
        </form>
    );
}
