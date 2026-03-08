"use client";

export const dynamic = "force-dynamic";

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, ReferenceLine
} from 'recharts';
import { Loader2, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimulationBanner from '@/components/dashboard/SimulationBanner';
import ScanForm from '@/components/dashboard/ScanForm';
import { toast } from 'sonner';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const toTitleCase = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const scoreColor = (s: number) =>
  s > 60 ? '#12B76A' : s > 40 ? '#F79009' : '#F04438';

export default function Dashboard() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowAuthOverlay(false);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const { data: statsData, error: statsError, isLoading: statsLoading, mutate: mutateStats } = useSWR('/api/dashboard/stats', fetcher);
  const [isScanning, setIsScanning] = useState(false);

  const guestStats = useMemo(() => ({
    latestBaseline: {
      score: 64,
      latentDensity: 0.42,
      date: new Date().toISOString(),
      breakdown: { direct: 58, som: {} },
      signals: [{ type: 'STRATEGY_INJECTION', source: 'Simulated Engine', content: 'Guest Monitoring active.', createdAt: new Date().toISOString() }],
      provider: 'Guest Mode (Preview)',
      brand: 'tracintel',
      industry: 'Technology',
      competitors: ['hubspot', 'semrush'],
      benchmarkScore: 45,
      benchmarkDelta: 19,
      perModelScores: { gemini: { score: 66, status: 'success' }, openai: { score: 63, status: 'success' }, claude: { score: 63, status: 'success' } }
    },
    latestStrategy: null,
    history: [
      { date: new Date(Date.now() - 86400000).toISOString(), score: 58 },
      { date: new Date(Date.now() - 43200000).toISOString(), score: 61 },
      { date: new Date().toISOString(), score: 64 }
    ]
  }), []);

  const stats = user ? statsData : guestStats;

  const handleScan = async (scanData: { brand: string; industry: string; competitors: string[] }) => {
    if (!user) {
      setShowAuthOverlay(true);
      toast.info("Authentication Required", { description: "Please sign in to run a live scan." });
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
      await mutateStats();
      toast.success('Scan complete', { id: toastId, description: 'Your visibility scores have been updated.' });
    } catch (e: any) {
      toast.error('Scan failed', { id: toastId, description: e.message || 'Something went wrong.' });
    } finally {
      setIsScanning(false);
    }
  };

  if (statsError) return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-black font-serif italic mb-2">Connection Error</h2>
      <p className="text-sm text-black/40 max-w-xs mb-8">Unable to load your dashboard data. Please try again.</p>
      <button onClick={() => mutateStats()} className="px-6 py-2 bg-black text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-black/90 transition-all">
        Retry
      </button>
    </div>
  );

  const { latestBaseline = null, latestStrategy = null, history = [] } = stats ?? {};
  const latest = latestBaseline;
  const score = latestBaseline?.score || 0;
  const benchmarkScore = latestBaseline?.benchmarkScore || 40;
  const benchmarkDelta = latestBaseline?.benchmarkDelta ?? (score - benchmarkScore);

  const competitorStats = useMemo(() => {
    if (!latestBaseline?.rawText || !latestBaseline?.competitors || !Array.isArray(latestBaseline.competitors)) return [];
    const text = latestBaseline.rawText.toLowerCase();
    const competitors = latestBaseline.competitors;
    const brand = (latestBaseline.brand || '').toLowerCase();
    return competitors.map((comp: string) => {
      const compLower = comp.toLowerCase();
      const compMentions = (text.match(new RegExp(compLower, 'g')) || []).length;
      const brandMentions = (text.match(new RegExp(brand, 'g')) || []).length;
      const relativeScore = brandMentions > 0
        ? Math.min(100, Math.round((compMentions / brandMentions) * latestBaseline.score))
        : Math.min(100, compMentions * 10);
      return { name: comp, score: relativeScore, mentions: compMentions };
    });
  }, [latestBaseline]);

  const chartData = useMemo(() => {
    if (!latestBaseline) return [];
    return [
      { name: toTitleCase(latestBaseline.brand), score: latestBaseline.score, isBrand: true },
      ...competitorStats.map((c: any) => ({ name: toTitleCase(c.name), score: c.score, isBrand: false }))
    ];
  }, [latestBaseline, competitorStats]);

  const hasMultipleHistoryPoints = history.length > 1;
  const latentScore = Math.round((latest?.latentDensity || 0) * 100);
  const mentionScore = latest?.breakdown?.direct || 0;

  if (statsLoading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#111827] mb-4" />
      <span className="text-[12px] font-medium text-[#6B7280]">Loading your dashboard...</span>
    </div>
  );

  if (!latestBaseline) {
    return (
      <div className="flex min-h-[85vh] flex-col items-center justify-center p-4 md:p-6 bg-[#F9FAFB]">
        <div className="w-full max-w-[480px] bg-white border border-[#EAECF0] rounded-[20px] p-[40px] shadow-sm flex flex-col items-center text-center">
          <h2 className="text-[26px] font-bold text-[#101828] font-display mb-[24px]">Start Your First Scan</h2>
          <p className="text-[14px] text-[#667085] font-sans mb-[24px] max-w-[380px] leading-relaxed">Enter your brand details below to see how AI models perceive you compared to your competitors.</p>
          <ScanForm onScan={handleScan} isLoading={isScanning} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-4 md:p-8 space-y-6 max-w-[1700px] mx-auto"
    >
      {!user && <SimulationBanner />}

      {/* Brand Info Card */}
      <div className="bg-white border border-[#EAECF0] rounded-[16px] px-7 pt-7 pb-0 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6">
          <div className="flex flex-col gap-3">
            <h1 className="font-display font-bold text-2xl md:text-[28px] text-[#101828] tracking-tight">
              {toTitleCase(latestBaseline.brand)}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 bg-[#F2F4F7] text-[#344054] font-sans text-[12px] font-medium rounded-[6px]">
                {latestBaseline.industry}
              </span>
              <div className="flex flex-wrap gap-2">
                {latestBaseline.competitors?.map((comp: string) => (
                  <div
                    key={comp}
                    className="h-6 px-2 flex items-center bg-white border border-[#EAECF0] text-[#667085] font-sans text-[12px] rounded-md"
                  >
                    {toTitleCase(comp)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const element = document.getElementById('scan-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="shrink-0 px-4 py-2.5 bg-[#0F172A] text-white font-sans font-medium text-[13px] rounded-lg hover:bg-black transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            Run New Scan
          </button>
        </div>
        <div className="border-t border-[#EAECF0]" />
      </div>

      {/* Score Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Visibility Score */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm overflow-hidden relative transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor(score) }} />
              <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">AI Visibility Score</span>
            </div>
            <div className="bg-[#F2F4F7] px-2 py-0.5 rounded-full">
              <span className="font-sans text-[10px] font-bold text-[#344054] uppercase tracking-wider">{latestBaseline?.provider?.split(' ')[0] || 'MULTI'}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display font-bold text-[48px] text-[#101828] leading-none">{score}</span>
            <span className="font-sans text-[18px] font-normal text-[#98A2B3]">/100</span>
          </div>
          <p className="font-sans text-[13px] text-[#98A2B3] font-medium leading-relaxed mb-5">
            Your brand&apos;s overall presence across AI models
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#F2F4F7]">
            <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
          </div>
        </div>

        {/* Card 2: Topic Coverage */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm overflow-hidden relative transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor(latentScore) }} />
            <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">Topic Coverage</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display font-bold text-[48px] text-[#101828] leading-none">{latentScore}</span>
            <span className="font-sans text-[18px] font-normal text-[#98A2B3]">/100</span>
          </div>
          <p className="font-sans text-[13px] text-[#98A2B3] font-medium leading-relaxed mb-5">
            How well AI understands your brand&apos;s topic area
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#F2F4F7]">
            <div className="h-full rounded-full transition-all" style={{ width: `${latentScore}%`, backgroundColor: scoreColor(latentScore) }} />
          </div>
        </div>

        {/* Card 3: Mention Frequency */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm overflow-hidden relative transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor(mentionScore) }} />
            <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">Mention Frequency</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display font-bold text-[48px] text-[#101828] leading-none">{mentionScore}</span>
            <span className="font-sans text-[18px] font-normal text-[#98A2B3]">/100</span>
          </div>
          <p className="font-sans text-[13px] text-[#98A2B3] font-medium leading-relaxed mb-5">
            How often your brand appears in AI responses
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#F2F4F7]">
            <div className="h-full rounded-full transition-all" style={{ width: `${mentionScore}%`, backgroundColor: scoreColor(mentionScore) }} />
          </div>
        </div>
      </div>

      {/* Intelligence Report Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Per-Model Scores */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
          <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-6 tracking-tight">Per-Model Scores</h4>
          <div className="grid grid-cols-3">
            {[
              { key: 'gemini', label: 'Gemini', color: '#1A73E8' },
              { key: 'openai', label: 'OpenAI', color: '#10A37F' },
              { key: 'claude', label: 'Claude', color: '#D97706' },
            ].map((provider, i) => {
              const entry = latestBaseline?.perModelScores?.[provider.key];
              const isSuccess = entry?.status === 'success';
              return (
                <div
                  key={provider.key}
                  className={cn(
                    "flex flex-col gap-2 px-4 transition-opacity",
                    i > 0 && "border-l border-[#EAECF0]",
                    !isSuccess && "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
                    <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">{provider.label}</span>
                  </div>
                  {isSuccess ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-semibold text-[28px] text-[#101828] leading-none">{entry.score}</span>
                      <span className="font-sans text-[14px] font-normal text-[#98A2B3]">/100</span>
                    </div>
                  ) : (
                    <div className="relative group cursor-help pt-2">
                      <span className="font-sans text-[12px] text-[#98A2B3]">No data</span>
                      <div className="absolute hidden group-hover:block bottom-full mb-2 left-0 bg-[#101828] text-white text-[11px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg">
                        This provider&apos;s API quota is currently exhausted
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Industry Benchmark */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] tracking-tight">Industry Benchmark</h4>
            {benchmarkDelta !== undefined && (
              <div className={cn(
                "font-sans text-[12px] font-medium px-2.5 py-1 rounded-full",
                benchmarkDelta > 0 ? "bg-[#ECFDF3] text-[#027A48]" : benchmarkDelta < 0 ? "bg-[#FEF3F2] text-[#B42318]" : "bg-[#F2F4F7] text-[#344054]"
              )}>
                {benchmarkDelta > 0
                  ? `${benchmarkDelta} points above industry average`
                  : benchmarkDelta < 0
                    ? `${Math.abs(benchmarkDelta)} points below industry average`
                    : "At industry average"}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between font-sans text-[13px] text-[#667085]">
              <span>Your Score: <strong className="text-[#101828]">{score}</strong></span>
              <span>Industry Average: <strong className="text-[#101828]">{benchmarkScore}</strong></span>
            </div>

            {/* Benchmark Bar with markers */}
            <div className="relative pt-6 pb-2">
              {/* Brand marker label */}
              <div
                className="absolute top-0 font-sans text-[10px] font-bold text-[#101828] -translate-x-1/2"
                style={{ left: `${Math.min(100, score)}%` }}
              >
                {score}
              </div>
              {/* Industry avg marker label */}
              <div
                className="absolute top-0 font-sans text-[10px] text-[#98A2B3] -translate-x-1/2"
                style={{ left: `${benchmarkScore}%` }}
              >
                avg
              </div>

              <div className="relative w-full h-[12px] bg-[#F2F4F7] rounded-full overflow-visible">
                {/* Industry avg marker dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#D0D5DD] border-2 border-white z-10"
                  style={{ left: `${benchmarkScore}%` }}
                />
                {/* Brand score bar */}
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, score)}%`,
                    backgroundColor: benchmarkDelta >= 0 ? '#101828' : '#F04438',
                    opacity: 0.85
                  }}
                />
                {/* Brand score dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#101828] border-2 border-white z-20 shadow-sm"
                  style={{ left: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Chart Card */}
      <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm transition-all hover:shadow-md">
        <div className="mb-6">
          <h3 className="font-display font-semibold text-lg text-[#101828]">Brand Visibility Over Time</h3>
          <p className="font-sans text-[13px] text-[#667085] mt-1">Track how your AI visibility score changes over time</p>
        </div>

        {!hasMultipleHistoryPoints ? (
          <div className="h-[300px] flex flex-col items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#101828]" />
            <p className="font-sans text-[12px] text-[#98A2B3] text-center">First scan — run more scans to see trends</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="visibilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#101828" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#101828" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#98A2B3', fontFamily: 'var(--font-body)' }}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#98A2B3', fontFamily: 'var(--font-body)' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <ReferenceLine y={benchmarkScore} stroke="#D0D5DD" strokeDasharray="4 4" label={{ value: `Industry Avg`, fontSize: 10, fill: '#98A2B3', position: 'insideTopRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAECF0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0F172A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#visibilityGradient)"
                  dot={{ r: 5, fill: '#0F172A', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Competitor Intelligence Section */}
      <div className="space-y-6">
        <div>
          <h3 className="font-display font-semibold text-lg text-[#101828]">Competitor Intelligence</h3>
          <p className="font-sans text-[13px] text-[#667085] mt-1">See how your brand compares to competitors</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bar Chart: Visibility Share */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-6 tracking-tight">Visibility Share</h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 30, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#F2F4F7" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#667085', fontFamily: 'var(--font-body)', fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#98A2B3', fontFamily: 'var(--font-body)' }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: '#F2F4F7' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #EAECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    label={{ position: 'top', fill: '#101828', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600 }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isBrand ? '#0F172A' : '#D1D5DB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Mention Frequency Trend */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-6 tracking-tight">Mention Frequency</h4>
            {!hasMultipleHistoryPoints ? (
              <div className="h-[280px] flex items-center justify-center">
                <p className="font-sans text-[13px] text-[#98A2B3] text-center">More data available after next scan</p>
              </div>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid vertical={false} stroke="#F2F4F7" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#667085', fontFamily: 'var(--font-body)', fontWeight: 500 }}
                      tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis hide domain={[0, 110]} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #EAECF0' }} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-body)', paddingTop: '16px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name={toTitleCase(latestBaseline?.brand || 'Brand')}
                      stroke="#101828"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#101828', strokeWidth: 0 }}
                    />
                    {competitorStats.map((c: any) => (
                      <Line
                        key={c.name}
                        type="monotone"
                        dataKey={() => c.score}
                        name={toTitleCase(c.name)}
                        stroke="#D1D5DB"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={{ r: 3, fill: '#D1D5DB', strokeWidth: 0 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Radar Chart: Model Distribution */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-6 tracking-tight">Model Distribution</h4>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="45%" outerRadius="75%" data={[
                  { subject: 'ChatGPT', A: 90, B: 70 },
                  { subject: 'Gemini', A: 85, B: 60 },
                  { subject: 'Claude', A: 95, B: 80 },
                  { subject: 'Perplexity', A: 88, B: 65 },
                  { subject: 'Overall', A: score, B: competitorStats[0]?.score || 50 },
                ]}>
                  <PolarGrid stroke="#EAECF0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#667085', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                  <Radar
                    name={toTitleCase(latestBaseline?.brand || 'Brand')}
                    dataKey="A"
                    stroke="#0F172A"
                    strokeWidth={2}
                    fill="rgba(15,23,42,0.2)"
                    fillOpacity={1}
                  />
                  {competitorStats.slice(0, 1).map((c: any) => (
                    <Radar
                      key={c.name}
                      name={toTitleCase(c.name)}
                      dataKey="B"
                      stroke="#D0D5DD"
                      fill="rgba(208,213,221,0.15)"
                      fillOpacity={1}
                      strokeWidth={1}
                    />
                  ))}
                  <Legend
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-body)', paddingTop: '12px' }}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color === '#0F172A' ? '#101828' : '#667085', fontWeight: 500 }}>{value}</span>
                    )}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Section */}
      <div id="scan-section" className="pt-6 border-t border-[#EAECF0]">
        <div className="bg-white border border-[#EAECF0] rounded-[24px] p-8 md:p-12 text-center max-w-3xl mx-auto shadow-sm">
          <div className="w-14 h-14 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#EAECF0]">
            <RefreshCw className="w-7 h-7 text-[#0F172A]" />
          </div>
          <h3 className="font-display font-bold text-2xl text-[#101828] mb-3">Run a New Scan</h3>
          <p className="font-sans text-[#667085] text-[15px] mb-8 max-w-xl mx-auto leading-relaxed">
            Update your visibility scores with fresh data from Gemini, OpenAI, and Claude.
          </p>
          <div className="max-w-md mx-auto">
            <ScanForm onScan={handleScan} isLoading={isScanning} />
          </div>
        </div>
      </div>

      <AuthOverlay isVisible={showAuthOverlay} />
    </motion.div>
  );
}
