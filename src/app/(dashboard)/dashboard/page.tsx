"use client";

export const dynamic = "force-dynamic";

import Link from 'next/link';
import useSWR from 'swr';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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

  if (statsLoading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#111827] mb-4" />
      <span className="text-[12px] font-medium text-[#6B7280]">Loading intelligence stream...</span>
    </div>
  );

  const { latestBaseline, latestStrategy, history } = stats;
  const latest = latestBaseline; // Default back to baseline for other metrics
  const score = latestBaseline?.score || 0;
  const strategyScore = latestStrategy?.score || 0;

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="bg-white m-0 p-0 overflow-x-hidden"
      style={{ width: '100vw !important' } as any}
    >
      {/* Simulation Banner */}
      {!user && <SimulationBanner />}

      {/* 12-Column Grid Force */}
      <div className="grid grid-cols-12 gap-0 w-full min-h-screen relative">
        {!user && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
            <div className="text-[20vw] font-black font-mono rotate-[-30deg] select-none whitespace-nowrap">
              SIMULATED DATA • SIMULATED DATA • SIMULATED DATA
            </div>
          </div>
        )}

        {/* Left Metrics Cabinet (col-span-3) */}
        <div className="col-span-12 md:col-span-3 border-r border-[#E5E7EB] p-6 md:p-8 space-y-8 bg-gray-50/30">
          <div className="space-y-6">
            <div className="p-6 bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full", score > 60 ? "bg-emerald-500" : score > 40 ? "bg-amber-500" : "bg-red-500")} />
                <h3 className="text-[11px] font-medium text-[#6B7280] uppercase">AI Visibility Score</h3>
                <ProviderBadge provider={latestBaseline?.provider} />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold tracking-tight text-[#111827]">{score}</p>
                <div className="text-xs font-bold text-emerald-500">+5.2%</div>
              </div>
              <p className="text-[12px] text-[#6B7280] mt-2 leading-tight">Your brand&apos;s overall presence across AI models</p>
            </div>

            <div className="p-6 bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full", (latest?.latentDensity || 0) * 100 > 60 ? "bg-emerald-500" : (latest?.latentDensity || 0) * 100 > 40 ? "bg-amber-500" : "bg-red-500")} />
                <p className="text-[11px] font-medium text-[#6B7280] uppercase">Topic Coverage</p>
              </div>
              <p className="text-3xl font-bold text-[#111827]">
                {latest?.latentDensity ? (latest.latentDensity * 100).toFixed(1) + '%' : '0%'}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-2 leading-tight">How well AI understands your brand&apos;s topic area</p>
            </div>

            <div className="p-6 bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full", (latest?.breakdown?.direct || 0) > 60 ? "bg-emerald-500" : (latest?.breakdown?.direct || 0) > 40 ? "bg-amber-500" : "bg-red-500")} />
                <p className="text-[11px] font-medium text-[#6B7280] uppercase">Mention Frequency</p>
              </div>
              <p className="text-3xl font-bold text-[#111827]">{latest?.breakdown?.direct || 0}</p>
              <p className="text-[12px] text-[#6B7280] mt-2 leading-tight">How often your brand is referenced in AI responses</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E5E7EB]">
            <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-4">System Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#6B7280]">AI Engine</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[#111827] font-medium uppercase">Active</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#6B7280]">Data Buffer</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[#111827] font-medium uppercase">Optimal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E5E7EB]">
            <details className="group cursor-pointer">
              <summary className="list-none flex items-center justify-between text-[11px] font-bold text-[#111827] uppercase tracking-wider hover:text-black transition-colors">
                How is this score calculated?
                <ArrowUp className="w-3 h-3 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-6 space-y-4">
                <p className="text-[12px] leading-relaxed text-[#6B7280]">
                  The Visibility Score is a weighted aggregate of four core dimensions:
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'Mention Frequency', weight: SCORE_WEIGHTS.mentionFrequency * 100, color: 'bg-[#111827]', desc: 'Share of voice among competitors.' },
                    { label: 'Topic Coverage', weight: SCORE_WEIGHTS.latentDensity * 100, color: 'bg-[#6B7280]', desc: 'Topic area prominence.' },
                    { label: 'Sentiment Score', weight: SCORE_WEIGHTS.sentimentScore * 100, color: 'bg-[#9CA3AF]', desc: 'Qualitative brand perception.' },
                    { label: 'Citation Density', weight: SCORE_WEIGHTS.citationDensity * 100, color: 'bg-[#D1D5DB]', desc: 'Direct sourcing priority.' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#111827] uppercase">{item.label}</span>
                        <span className="text-[10px] font-bold text-[#6B7280]">{item.weight}%</span>
                      </div>
                      <div className="h-1 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.weight}%` }} />
                      </div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-tight">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-12 md:col-span-9 p-6 md:p-12 space-y-12 bg-white">
          <div className="w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-[#111827] leading-none">Brand Visibility Over Time</h3>
                <p className="text-[14px] text-[#6B7280] mt-2">How often AI models mention your brand</p>
              </div>
            </div>

            <div className="w-full border border-[#E5E7EB] rounded-[16px] p-8">
              <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-[#111827]">Visibility Score History</h4>
                <p className="text-[12px] text-[#6B7280] mt-1">Track how your AI visibility changes after each scan</p>
              </div>
              <div className="w-full h-[400px] relative">
                {!user && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <span className="text-6xl font-black text-[#6B7280]/5 uppercase rotate-[-15deg] select-none">Simulated Data</span>
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history?.length > 0 ? history : [{ name: 'Jan', score: 45 }]}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111827" stopOpacity={0.05} />
                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="#E5E7EB"
                      tickFormatter={(str) => {
                        const date = new Date(str);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#E5E7EB"
                      domain={[0, 100]}
                      ticks={[0, 50, 100]}
                      tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 500 }}
                      tickFormatter={(val) => `${val}%`}
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border border-[#E5E7EB] p-4 rounded-[12px] shadow-xl space-y-2">
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-[11px] font-medium text-[#6B7280] uppercase">
                                  {new Date(data.date).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-1">
                                  <ProviderBadge provider={data.provider} />
                                </div>
                              </div>
                              <p className="text-2xl font-bold text-[#111827]">{data.score}%</p>
                              {data.provider !== 'gemini' && (
                                <p className="text-[12px] text-[#6B7280]">
                                  Score adjusted for provider consistency
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#111827"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      dot={{ fill: '#111827', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#111827' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full pt-12 border-t border-[#E5E7EB] relative">
              {!user && (
                <div className="absolute top-12 right-0 z-10 px-3 py-1 bg-amber-50 border border-amber-100 rounded text-[11px] font-medium text-amber-700 uppercase tracking-wider">
                  Simulated Dataset
                </div>
              )}
              <GenerativeAITrafficChart isSimulated={!user} />
            </div>
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
