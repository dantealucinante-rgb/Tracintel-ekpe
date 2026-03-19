"use client";

import { useMemo, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line, CartesianGrid, Legend,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Cell, ReferenceLine, PieChart, Pie, Sector
} from 'recharts';
import { Loader2, RefreshCw, Shield, Zap, TrendingUp, BarChart3, PieChart as PieIcon, Search, Activity, Quote, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimulationBanner from '@/components/dashboard/SimulationBanner';
import ScanForm from '@/components/dashboard/ScanForm';
import ScanModal from '@/components/dashboard/ScanModal';
import { toast } from 'sonner';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SomEngine } from '@/lib/ai/som-engine';

const toTitleCase = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const CHART_COLORS = {
    primary: '#2563EB',
    secondary: '#16A34A',
    accent: '#D97706',
    muted: '#F7F8FA',
    neutral: '#6B7280'
};

function dedupeHistory(history: any[]) {
    const map = new Map<string, any>();
    for (const entry of history) {
        const day = new Date(entry.date).toISOString().split('T')[0];
        // Keep the latest entry for each day
        map.set(day, entry);
    }
    return Array.from(map.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const ChartSkeleton = () => (
    <div className="w-full h-[300px] bg-slate-50/50 animate-pulse rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 text-slate-200 animate-spin mb-2" />
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Hydrating Chart Data...</span>
    </div>
);

interface DashboardClientProps {
    initialData: any;
    user: any;
}

export default function DashboardClient({ initialData, user }: DashboardClientProps) {
    const [stats, setStats] = useState(initialData);
    const [isScanning, setIsScanning] = useState(false);
    const [showAuthOverlay, setShowAuthOverlay] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const router = useRouter();

    const { latestBaseline = null, history: rawHistory = [] } = stats ?? {};
    const latest = latestBaseline;
    const score = latestBaseline?.score || 0;
    const benchmarkScore = latestBaseline?.benchmarkScore || 40;
    const benchmarkDelta = latestBaseline?.benchmarkDelta ?? (score - benchmarkScore);

    const history = useMemo(() => {
        const deduped = dedupeHistory(rawHistory);
        return deduped.map(item => ({
            ...item,
            mentionFrequency: Math.round((item.mentionFrequency || 0) * 100),
            citationDensity: Math.round((item.citationDensity || 0) * 100),
            sentimentScore: Math.round((item.sentimentScore || 0) * 100)
        }));
    }, [rawHistory]);

    const handleScan = async (scanData: { brand: string; industry: string; competitors: string[] }) => {
        if (!user) {
            setShowAuthOverlay(true);
            return;
        }
        setIsScanning(true);
        const toastId = toast.loading('Running scan...', { description: 'AI models are analyzing your brand.' });
        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scanData),
            });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.error || 'Scan failed');

            // Refresh data
            const refreshRes = await fetch('/api/scans');
            const refreshedData = await refreshRes.json();
            // Data from /api/scans is directly the scan array, we need to wrap it if DashboardClient expects the aggregate structure
            // Actually ScanService.getDashboardData() is called in page.tsx. Let's redirect or re-fetch properly.
            window.location.reload();

            toast.success('Scan complete', { id: toastId, description: 'Your visibility scores have been updated.' });
        } catch (e: any) {
            toast.error('Scan failed', { id: toastId, description: e.message || 'Something went wrong.' });
        } finally {
            setIsScanning(false);
        }
    };

    const activeSources = useMemo(() => {
        const domains = new Set();
        rawHistory.forEach((scan: any) => {
            const matches = [...(scan.rawText || '').matchAll(/https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)];
            matches.forEach(m => domains.add(m[1].toLowerCase().replace(/^www\./, '')));
        });
        return domains.size;
    }, [rawHistory]);

    const sentimentData = useMemo(() => {
        if (!latestBaseline) return [];
        const score = latestBaseline.sentimentScore || 0;
        return [
            { name: 'Positive', value: Math.round(score * 100), fill: '#12B76A' },
            { name: 'Critical/Neutral', value: 100 - Math.round(score * 100), fill: '#F2F4F7' }
        ];
    }, [latestBaseline]);

    const competitorStats = useMemo(() => {
        if (!latestBaseline?.rawText || !latestBaseline?.competitors) return [];
        const structured = SomEngine.parseStructuredResponse(latestBaseline.rawText);
        const competitors = latestBaseline.competitors;
        const text = latestBaseline.rawText.toLowerCase();

        return competitors.map((comp: string) => {
            if (structured && structured.competitor_mentions && structured.competitor_mentions.includes(comp)) {
                return { name: comp, score: Math.round(score * 0.8), mentions: (text.match(new RegExp(`\\b${comp.toLowerCase()}\\b`, 'g')) || []).length };
            }
            const compLower = comp.toLowerCase();
            const compMentions = (text.match(new RegExp(`\\b${compLower}\\b`, 'g')) || []).length;
            return { name: comp, score: Math.min(100, compMentions * 10), mentions: compMentions };
        });
    }, [latestBaseline, score]);

    const competitorComparisonData = useMemo(() => {
        if (!latestBaseline) return [];
        return [
            {
                name: toTitleCase(latestBaseline.brand),
                mentions: Math.round((latestBaseline.mentionFrequency || 0) * 100),
                citations: Math.round((latestBaseline.citationDensity || 0) * 100),
                isBrand: true
            },
            ...competitorStats.map((c: any) => ({
                name: toTitleCase(c.name),
                mentions: c.mentions * 10, // Normalized for comparison
                citations: Math.round(c.score * 0.5), // Estimate based on score
                isBrand: false
            }))
        ];
    }, [latestBaseline, competitorStats]);

    const chartData = useMemo(() => {
        if (!latestBaseline) return [];
        return [
            { name: toTitleCase(latestBaseline.brand), score: latestBaseline.score, isBrand: true },
            ...competitorStats.map((c: any) => ({ name: toTitleCase(c.name), score: c.score, isBrand: false }))
        ];
    }, [latestBaseline, competitorStats]);

    const radarData = useMemo(() => {
        const geminiScore = latestBaseline?.perModelScores?.gemini?.score || 0;
        const openaiScore = latestBaseline?.perModelScores?.openai?.score || 0;
        const claudeScore = latestBaseline?.perModelScores?.claude?.score || 0;
        const compScore = competitorStats[0]?.score || benchmarkScore;

        return [
            { subject: 'Gemini', A: Math.max(5, geminiScore), B: Math.max(5, compScore) },
            { subject: 'OpenAI', A: Math.max(5, openaiScore), B: Math.max(5, compScore) },
            { subject: 'Claude', A: Math.max(5, claudeScore), B: Math.max(5, compScore) },
            { subject: 'Overall', A: Math.max(5, score), B: Math.max(5, compScore) },
            { subject: 'Industry', A: Math.max(5, benchmarkScore), B: Math.max(5, benchmarkScore) },
        ];
    }, [latestBaseline, competitorStats, score, benchmarkScore]);

    if (!latestBaseline || history.length === 0) {
        return (
            <div className="flex min-h-[85vh] flex-col items-center justify-center p-4 md:p-6 bg-[#FAFAFA]">
                <div className="w-full max-w-[480px] bg-white border border-slate-100 rounded-[24px] p-12 shadow-sm flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h2 className="text-[24px] font-bold text-slate-900 font-sans mb-3 tracking-tight">No intelligence data</h2>
                    <p className="text-[15px] text-slate-500 font-sans mb-10 max-w-[320px] leading-relaxed">Run a brand scan to initialize your visibility benchmarks and trend analysis.</p>
                    <div className="w-full">
                        <ScanForm onScan={handleScan} isLoading={isScanning} />
                    </div>
                </div>
            </div>
        );
    }

    const renderValue = (val: any) => {
        if (val === null || val === undefined || val === 0) return '—';
        if (typeof val === 'number') return `${val}%`;
        return val;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 max-w-[1600px] mx-auto"
        >
            {!user && <SimulationBanner />}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-[#111827] tracking-[-0.02em] mb-1">Overview</h1>
                    <p className="text-[13px] text-[#6B7280] font-medium">Enterprise intelligence mapping and visibility benchmarks.</p>
                </div>
                <button
                    onClick={() => setIsScanModalOpen(true)}
                    className="flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#111827] text-white text-[13px] font-semibold rounded-[6px] hover:bg-black transition-all shadow-sm active:scale-[0.98] w-full md:w-auto"
                >
                    <RefreshCw className={cn("w-3.5 h-3.5", isScanning && "animate-spin")} />
                    Update Intelligence
                </button>
            </div>

            {/* Headline Metrics (Peec Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Avg Visibility Score', value: Math.round(score), color: 'text-[#2563EB]', border: 'border-t-[#2563EB]' },
                    { label: 'Total Scans', value: rawHistory.length, color: 'text-[#111827]', border: 'border-t-[#111827]', noPercent: true },
                    { label: 'Active Sources', value: activeSources, color: 'text-[#111827]', border: 'border-t-[#111827]', noPercent: true }
                ].map((item) => (
                    <div key={item.label} className={cn("bg-white border border-[#E5E7EB] border-t-[3px] rounded-[10px] p-6 flex flex-col justify-between h-32 shadow-sm", item.border)}>
                        <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.08em]">{item.label}</span>
                        <span className={cn("text-[40px] font-bold leading-none tracking-[-0.02em]", item.color)}>
                            {item.noPercent ? item.value : `${item.value}%`}
                        </span>
                    </div>
                ))}
            </div>

            {/* Combined Trend Chart */}
            <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-6 md:p-8 shadow-sm">
                <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[15px] font-bold text-[#111827] tracking-tight">Intelligence Trends</h2>
                        <p className="text-[13px] text-[#6B7280]">Authority analysis across model updates.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                            <span className="text-[11px] font-semibold text-[#6B7280] lowercase tracking-tight">mentions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            <span className="text-[11px] font-semibold text-[#6B7280] lowercase tracking-tight">sentiment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                            <span className="text-[11px] font-semibold text-[#6B7280] lowercase tracking-tight">citations</span>
                        </div>
                    </div>
                </div>
                <div className="h-[200px] md:h-[360px]">
                    {isScanning ? <ChartSkeleton /> : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} dy={10}
                                />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '6px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                />
                                <Line name="mention freq" type="monotone" dataKey="mentionFrequency" stroke="#2563EB" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                                <Line name="sentiment" type="monotone" dataKey="sentimentScore" stroke="#16A34A" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                                <Line name="citations" type="monotone" dataKey="citationDensity" stroke="#D97706" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Recent Scans List (Peec Pattern) */}
            <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h2 className="text-[18px] font-medium text-[#111827]">Scanning History</h2>
                    <button className="text-[12px] font-bold text-[#2563EB] hover:underline uppercase tracking-widest">Archive Overview</button>
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                    {history.slice(-10).reverse().map((scan: any, i: number) => (
                        <div
                            key={i}
                            onClick={() => router.push(`/dashboard/scans/${scan.id}`)}
                            className="px-8 py-5 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[13px] font-bold text-[#2563EB]">
                                    {scan.brand?.[0]?.toUpperCase() || 'B'}
                                </div>
                                <div className="min-w-[120px]">
                                    <p className="text-[14px] font-bold text-[#111827]">{scan.brand}</p>
                                    <p className="text-[11px] text-[#6B7280] font-medium">{new Date(scan.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-4 gap-8 items-center ml-12">
                                <div>
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em] mb-1">Impact Agent</p>
                                    <p className="text-[13px] font-semibold text-[#111827]">{toTitleCase(scan.provider || 'Gemini Pro')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em] mb-1">Sentiment</p>
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.02em]",
                                        scan.sentimentScore > 0.7 ? "bg-[#16A34A]/[0.08] text-[#16A34A]" :
                                            scan.sentimentScore < 0.4 ? "bg-[#DC2626]/[0.08] text-[#DC2626]" :
                                                "bg-[#D97706]/[0.08] text-[#D97706]"
                                    )}>
                                        <div className={cn("w-1 h-1 rounded-full",
                                            scan.sentimentScore > 0.7 ? "bg-[#16A34A]" :
                                                scan.sentimentScore < 0.4 ? "bg-[#DC2626]" :
                                                    "bg-[#D97706]"
                                        )} />
                                        {scan.sentimentScore > 0.7 ? 'Positive' : scan.sentimentScore < 0.4 ? 'Negative' : 'Neutral'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em] mb-1">Mention Freq</p>
                                    <p className="text-[13px] font-bold text-[#111827]">{scan.mentionFrequency}%</p>
                                </div>
                                <div className="text-right pr-8">
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em] mb-1">Ref Score</p>
                                    <p className="text-[14px] font-bold text-[#2563EB]">{scan.score}%</p>
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB]/20 hover:bg-[#EFF6FF] transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>


            <ScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
                onScan={handleScan}
                isLoading={isScanning}
            />

            <AuthOverlay isVisible={showAuthOverlay} />
        </motion.div>
    );
}
