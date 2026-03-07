"use client";

import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface ScanFormProps {
    onScan: (data: { brand: string; industry: string; competitors: string[] }) => Promise<void>;
    isLoading: boolean;
}

export default function ScanForm({ onScan, isLoading }: ScanFormProps) {
    const [brand, setBrand] = useState('');
    const [industry, setIndustry] = useState('');
    const [competitors, setCompetitors] = useState('');

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
                    <label className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">
                        Brand Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Apple, Nike, Tracintel"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        className="w-full bg-white border border-[#D0D5DD] rounded-[10px] px-[14px] py-[12px] font-sans text-[14px] text-[#101828] focus:border-[#101828] focus:outline-none transition-colors placeholder:text-[#98A2B3]"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">
                        Industry
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Technology, Healthcare, Fashion"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        className="w-full bg-white border border-[#D0D5DD] rounded-[10px] px-[14px] py-[12px] font-sans text-[14px] text-[#101828] focus:border-[#101828] focus:outline-none transition-colors placeholder:text-[#98A2B3]"
                    />
                </div>

                <div className="flex flex-col gap-2 relative">
                    <label className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">
                        Competitors
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Google, Microsoft, Samsung"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        required
                        className="w-full bg-white border border-[#D0D5DD] rounded-[10px] px-[14px] py-[12px] font-sans text-[14px] text-[#101828] focus:border-[#101828] focus:outline-none transition-colors placeholder:text-[#98A2B3] mb-1"
                    />
                    <span className="font-sans text-[11px] text-[#98A2B3]">
                        Separate multiple competitors with a comma
                    </span>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !brand || !industry || !competitors}
                className="w-full bg-[#101828] text-white font-sans font-semibold text-[14px] py-[14px] rounded-[10px] hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin opacity-70" />
                        Scanning...
                    </>
                ) : (
                    "Run Visibility Scan"
                )}
            </button>
        </form>
    );
}
