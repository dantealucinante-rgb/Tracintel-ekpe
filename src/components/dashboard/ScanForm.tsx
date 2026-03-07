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
                        placeholder="BRAND NAME"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        className="w-full h-12 bg-transparent border-b border-black/10 focus:border-black transition-colors outline-none text-sm font-bold tracking-widest uppercase placeholder:text-black/20"
                    />
                </div>
                <div className="group relative">
                    <input
                        type="text"
                        placeholder="INDUSTRY"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        className="w-full h-12 bg-transparent border-b border-black/10 focus:border-black transition-colors outline-none text-sm font-bold tracking-widest uppercase placeholder:text-black/20"
                    />
                </div>
                <div className="group relative">
                    <input
                        type="text"
                        placeholder="COMPETITORS (COMMA SEPARATED)"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        required
                        className="w-full h-12 bg-transparent border-b border-black/10 focus:border-black transition-colors outline-none text-sm font-bold tracking-widest uppercase placeholder:text-black/20"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !brand || !industry || !competitors}
                className="w-full h-14 bg-black text-white text-xs font-bold rounded-xl uppercase tracking-[0.3em] hover:bg-black/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Zap className="w-4 h-4 text-[#007AFF]" />
                        Initialize Neural Mapping
                    </>
                )}
            </button>
        </form>
    );
}
