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
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
            <div className="space-y-4">
                <div className="group relative">
                    <input
                        type="text"
                        placeholder="Brand Name"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        className="w-full h-12 bg-transparent border-b border-[#E5E7EB] focus:border-[#111827] transition-colors outline-none text-[15px] font-medium placeholder:text-[#9CA3AF]"
                    />
                </div>
                <div className="group relative">
                    <input
                        type="text"
                        placeholder="Industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        className="w-full h-12 bg-transparent border-b border-[#E5E7EB] focus:border-[#111827] transition-colors outline-none text-[15px] font-medium placeholder:text-[#9CA3AF]"
                    />
                </div>
                <div className="group relative">
                    <input
                        type="text"
                        placeholder="Competitors (comma separated)"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        required
                        className="w-full h-12 bg-transparent border-b border-[#E5E7EB] focus:border-[#111827] transition-colors outline-none text-[15px] font-medium placeholder:text-[#9CA3AF]"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !brand || !industry || !competitors}
                className="w-full h-12 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm md:mt-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                        Run Intelligence Scan
                    </>
                )}
            </button>
        </form>
    );
}
