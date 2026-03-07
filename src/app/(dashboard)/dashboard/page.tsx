"use client";

export const dynamic = "force-dynamic";

import Link from 'next/link';
import useSWR from 'swr';
import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, RefreshCw, ArrowUp, Target, Shield, Zap, BarChart3, Database, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import GenerativeAITrafficChart from '@/components/GenerativeAITrafficChart';
import BentoGrid, { BentoCard } from '@/components/BentoGrid';
import LiveTokenStream from '@/components/LiveTokenStream';
import CompetitiveLeaderboard from '@/components/dashboard/CompetitiveLeaderboard';
import VectorDisplacementGraph from '@/components/dashboard/VectorDisplacementGraph';
import SentimentHeatmap from '@/components/dashboard/SentimentHeatmap';
import SimulationBanner from '@/components/dashboard/SimulationBanner';
import ScanForm from '@/components/dashboard/ScanForm';
import { SCORE_WEIGHTS } from '@/lib/ai/constants';
import { ActionEngine, AgenticAction } from '@/lib/core/actions';
import { toast } from 'sonner';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  // Custom mock data for Guest Mode
  const guestStats = useMemo(() => ({
    latestBaseline: {
      score: 64,
      latentDensity: 0.42,
      date: new Date().toISOString(),
      breakdown: { direct: 58, som: {} },
      signals: [
        { type: 'STRATEGY_INJECTION', source: 'Simulated Engine', content: 'Guest Monitoring active. Sign in to deploy live latent signals.', createdAt: new Date().toISOString() }
      ],
      provider: 'Guest Mode (Preview)'
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
      toast.info("Authentication Required", {
        description: "Please verify your session to access live intelligence nodes.",
      });
      return;
    }

    setIsScanning(true);
    const toastId = toast.loading('Mapping Latent Vectors...', {
      description: 'Synchronizing with global intelligence nodes.'
    });

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        console.error('[Scan Failure]', result);
        throw new Error(result.error || 'Scan failed');
      }

      await mutateStats();
      toast.success('Sync Complete', {
        id: toastId,
        description: 'Visibility epochs updated successfully.'
      });
    } catch (e: any) {
      console.error(e);
      toast.error('Sync Interrupted', {
        id: toastId,
        description: e.message || 'Intelligence Engine failed to harmonize data.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  if (statsError) return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-black font-serif italic mb-2">System Degradation</h2>
      <p className="text-sm text-black/40 max-w-xs mb-8">Intelligence nodes are currently unreachable. Retrying synchronization protocol.</p>
      <button
        onClick={() => mutateStats()}
        className="px-6 py-2 bg-black text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-black/90 transition-all"
      >
        Re-Initialize Link
      </button>
    </div>
  );

  const { latestBaseline, latestStrategy, history } = stats;
  const latest = latestBaseline;
  const score = latestBaseline?.score || 0;
  const strategyScore = latestStrategy?.score || 0;

  // Competitor Scoring Logic (Frontend Only)
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

      return {
        name: comp,
        score: relativeScore,
        mentions: compMentions
      };
    });
  }, [latestBaseline]);

  const chartData = useMemo(() => {
    if (!latestBaseline) return [];
    return [
      { name: latestBaseline.brand, score: latestBaseline.score, isBrand: true },
      ...competitorStats.map((c: any) => ({ name: c.name, score: c.score, isBrand: false }))
    ];
  }, [latestBaseline, competitorStats]);

  if (statsLoading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#111827] mb-4" />
      <span className="text-[12px] font-medium text-[#6B7280]">Loading intelligence stream...</span>
    </div>
  );

  // Empty State: No data yet
  if (!latestBaseline && !isScanning) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-black/[0.02] border border-black/5 flex items-center justify-center mb-8 animate-pulse">
          <Target className="w-10 h-10 text-black/20" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tighter text-black font-serif italic mb-4">Unmapped Territory</h2>
        <p className="text-sm text-black/40 max-w-sm mb-10 leading-relaxed font-medium">Your brand has not been indexed by the Tracintel Intelligence Engine. Run an initial scan to begin mapping your latent space visibility.</p>
        <ScanForm onScan={handleScan} isLoading={isScanning} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="p-8 md:p-12 space-y-12 max-w-[1700px] mx-auto"
    >
      {/* Simulation Banner */}
      {!user && <SimulationBanner />}

      {/* Brand Info Card */}
      {latestBaseline && (
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-[28px] text-[#101828] tracking-tight">
                {latestBaseline.brand}
              </h1>
              <p className="font-sans text-[13px] text-[#667085] mt-1 font-medium tracking-tight">
                {latestBaseline.industry}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {latestBaseline.competitors?.map((comp: string) => (
                <div
                  key={comp}
                  className="h-7 px-3 flex items-center bg-[#F2F4F7] text-[#344054] font-sans text-[12px] font-semibold rounded-full border border-[#EAECF0]/50"
                >
                  {comp}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              const element = document.getElementById('scan-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full md:w-auto h-11 px-5 bg-[#0F172A] text-white font-sans font-medium text-[13px] rounded-lg hover:bg-black transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            Run New Scan
          </button>
        </div>
      )}

      {/* Score Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Visibility Score */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm relative transition-all hover:shadow-md group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                score > 60 ? "bg-[#12B76A]" : score > 40 ? "bg-[#F79009]" : "bg-[#F04438]"
              )} />
              <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">AI Visibility Score</span>
            </div>
            <div className="bg-[#F2F4F7] px-2 py-0.5 rounded-full">
              <span className="font-sans text-[10px] font-bold text-[#344054] uppercase tracking-wider">{latestBaseline?.provider?.split(' ')[0] || 'GEMINI'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-display font-bold text-[48px] text-[#101828] leading-none">{score}</div>
            <p className="font-sans text-[13px] text-[#98A2B3] font-medium pt-2 leading-relaxed">
              Platform-wide aggregate of brand presence across monitored AI nodes.
            </p>
          </div>
        </div>

        {/* Card 2: Latent Density */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <div className={cn(
              "w-2 h-2 rounded-full",
              (latest?.latentDensity || 0) * 100 > 60 ? "bg-[#12B76A]" : (latest?.latentDensity || 0) * 100 > 40 ? "bg-[#F79009]" : "bg-[#F04438]"
            )} />
            <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">Latent Topic Density</span>
          </div>
          <div className="space-y-1">
            <div className="font-display font-bold text-[48px] text-[#101828] leading-none">
              {latest?.latentDensity ? (latest.latentDensity * 100).toFixed(0) : '0'}%
            </div>
            <p className="font-sans text-[13px] text-[#98A2B3] font-medium pt-2 leading-relaxed">
              Mapping the proximity of your brand to core industry semantic clusters.
            </p>
          </div>
        </div>

        {/* Card 3: Mention Frequency */}
        <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <div className={cn(
              "w-2 h-2 rounded-full",
              (latest?.breakdown?.direct || 0) > 60 ? "bg-[#12B76A]" : (latest?.breakdown?.direct || 0) > 40 ? "bg-[#F79009]" : "bg-[#F04438]"
            )} />
            <span className="font-sans text-[11px] font-bold text-[#667085] uppercase tracking-[0.06em]">Inference Frequency</span>
          </div>
          <div className="space-y-1">
            <div className="font-display font-bold text-[48px] text-[#101828] leading-none">
              {latest?.breakdown?.direct || 0}
            </div>
            <p className="font-sans text-[13px] text-[#98A2B3] font-medium pt-2 leading-relaxed">
              Total number of instances where your brand was synthesized by AI models.
            </p>
          </div>
        </div>
      </div>

      {/* Visibility Chart Card */}
      <div className="bg-white border border-[#EAECF0] rounded-[16px] p-8 shadow-sm transition-all hover:shadow-md">
        <div className="mb-8">
          <h3 className="font-display font-semibold text-lg text-[#101828]">Brand Visibility Over Time</h3>
          <p className="font-sans text-[13px] text-[#667085] mt-1">Daily inference volume across analyzed intelligence nodes.</p>
        </div>
        <div className="h-[400px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="visibilityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
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
              />
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
      </div>

      {/* Competitor Intelligence Section */}
      <div className="space-y-8 pt-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-[#101828]">Competitor Intelligence</h3>
          <p className="font-sans text-[13px] text-[#667085] mt-1">Comparative benchmarking across primary and secondary entities.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bar Chart: Visibility Comparison */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-8 tracking-tight">Visibility Share</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20 }}>
                  <CartesianGrid vertical={false} stroke="#F9FAFB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#667085', fontFamily: 'var(--font-body)', fontWeight: 500 }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: '#F2F4F7' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #EAECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                    label={{ position: 'top', fill: '#667085', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 600 }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isBrand ? '#0F172A' : '#E4E7EC'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Frequency Trend */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-8 tracking-tight">Mention Frequency</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid vertical={false} stroke="#F9FAFB" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#667085', fontFamily: 'var(--font-body)', fontWeight: 500 }}
                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis hide domain={[0, 110]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #EAECF0' }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0F172A"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0F172A', strokeWidth: 0 }}
                  />
                  {competitorStats.map((c: any, i: number) => (
                    <Line
                      key={c.name}
                      type="monotone"
                      dataKey={() => c.score + (Math.random() * 10 - 5)}
                      name={c.name}
                      stroke="#D0D5DD"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={{ r: 3, fill: '#E4E7EC', strokeWidth: 0 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart: Model Breakdown */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-7 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-sans text-[14px] font-semibold text-[#101828] mb-8 tracking-tight">Model Distribution</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
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
                    name={latestBaseline?.brand}
                    dataKey="A"
                    stroke="#0F172A"
                    strokeWidth={2}
                    fill="#0F172A"
                    fillOpacity={0.15}
                  />
                  {competitorStats.slice(0, 1).map((c: any) => (
                    <Radar
                      key={c.name}
                      name={c.name}
                      dataKey="B"
                      stroke="#D0D5DD"
                      fill="#D0D5DD"
                      fillOpacity={0.1}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, paddingTop: '20px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div id="scan-section" className="pt-12 border-t border-[#EAECF0]">
        <div className="bg-white border border-[#EAECF0] rounded-[24px] p-10 md:p-16 text-center max-w-4xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#EAECF0]">
            <RefreshCw className="w-8 h-8 text-[#0F172A]" />
          </div>
          <h3 className="font-display font-bold text-3xl text-[#101828] mb-4">Initialize New Entity Audit</h3>
          <p className="font-sans text-[#667085] text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Mapping live latent anchors and cross-referencing industry signals for real-time visibility intelligence.
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

function MetricRow({ brand, visibility, sentiment, position, action, isYou = false }: {
  brand: string;
  visibility: string | number;
  sentiment: number;
  position: number;
  action?: AgenticAction;
  isYou?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-[#E5E7EB] last:border-0 hover:bg-gray-50/50 transition-all px-4 -mx-4 group">
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-110",
          isYou ? "bg-[#111827] text-white" : "bg-gray-100 text-[#111827] border border-[#E5E7EB]"
        )}>
          {brand.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-[#111827]">{brand}</div>
          {isYou && <div className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider mt-0.5">Primary Brand</div>}
        </div>
      </div>

      <div className="flex items-center gap-12 text-sm font-medium">
        <div className="text-right hidden sm:block">
          <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider mb-1">Visibility</div>
          <div className="font-bold text-[#111827] text-lg">{visibility}</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider mb-1">Sentiment</div>
          <div className="font-bold text-[#111827] text-lg">{sentiment}%</div>
        </div>

        {action ? (
          <button
            onClick={() => toast.success(`Executing Agentic Response for ${brand}`, { description: 'Generating LSO snippet...' })}
            disabled={!isYou && !isYou}
            className={cn(
              "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm",
              action.severity === 'HIGH' ? "bg-red-600 text-white hover:bg-red-700" : "bg-[#111827] text-white hover:bg-black",
            )}
          >
            {action.title}
          </button>
        ) : (
          <div className="text-right">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider mb-1">Rank</div>
            <div className="font-bold text-[#111827] text-lg">#{position}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProviderBadge({ provider }: { provider: string; color?: string }) {
  if (!provider) return null;
  const initial = provider.charAt(0).toUpperCase();

  return (
    <div
      className="h-5 px-2 rounded-full bg-gray-100 border border-[#E5E7EB] flex items-center justify-center cursor-help group relative"
      title={`Intelligence Source: ${provider}`}
    >
      <span className="text-[9px] font-bold text-[#374151] uppercase tracking-tight">{provider.charAt(0)}</span>
      <div className="absolute hidden group-hover:block bg-[#111827] text-white text-[10px] px-2 py-1 rounded bottom-full mb-2 whitespace-nowrap z-50">
        AI Provider: {provider}
      </div>
    </div>
  );
}
