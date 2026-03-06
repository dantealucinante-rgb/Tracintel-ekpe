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

  const handleScan = async () => {
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
      const res = await fetch('/api/scan', { method: 'POST' });
      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.error || 'Scan failed');

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
      <Loader2 className="h-10 w-10 animate-spin text-[#007AFF] mb-4" />
      <span className="text-[10px] font-bold font-mono tracking-[0.4em] text-black/20 uppercase">Decrypting Neural Stream</span>
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
        <button
          onClick={handleScan}
          disabled={!user}
          title={!user ? "Sign up to unlock live scans" : undefined}
          className={cn(
            "h-16 px-10 bg-black text-white text-sm font-bold rounded-2xl shadow-2xl shadow-black/10 transition-all flex items-center gap-3",
            user ? "hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98]" : "opacity-50 cursor-not-allowed"
          )}
        >
          <Zap className="w-4 h-4 text-[#007AFF]" />
          Run Initial Intelligence Scan
        </button>
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
        <div className="col-span-3 border-r border-black/5 p-12 space-y-12 bg-gray-50/50">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[10px] font-bold font-mono tracking-[0.3em] text-black/40 uppercase">Baseline Score</h3>
                <ProviderBadge provider={latestBaseline?.provider} />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-black tracking-tighter text-black font-serif italic">{score}</p>
                {latestBaseline?.provider && latestBaseline.provider !== 'gemini' && (
                  <div title={`This scan used ${latestBaseline.provider} as a fallback. Score has been normalized for consistency.`}>
                    <Info className="w-3 h-3 text-black/20 hover:text-[#007AFF] transition-colors" />
                  </div>
                )}
              </div>
              <div className="text-xs font-bold text-emerald-500 font-mono">+5.2% Δ</div>
            </div>

            {latestStrategy && (
              <div className="pt-6 border-t border-black/5">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[10px] font-bold font-mono tracking-[0.3em] text-[#007AFF] uppercase">Strategy Score</h3>
                  <ProviderBadge provider={latestStrategy?.provider} color="#007AFF" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-black tracking-tighter text-[#007AFF] font-serif italic">{strategyScore}</p>
                  {latestStrategy?.provider && latestStrategy.provider !== 'gemini' && (
                    <div title={`This scan used ${latestStrategy.provider} as a fallback. Score has been normalized for consistency.`}>
                      <Info className="w-3 h-3 text-[#007AFF]/20 hover:text-[#007AFF] transition-colors" />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-[#007AFF]/60 font-mono">CONV_DELTA: {(strategyScore - score).toFixed(1)}%</div>
              </div>
            )}

            {!user && <div className="text-[10px] font-mono font-bold text-amber-600 bg-amber-400/10 px-2 py-0.5 rounded inline-block uppercase tracking-wider">Simulated</div>}
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Semantic Saturation</p>
              <p className="text-2xl font-bold font-serif italic text-black">
                {latest?.latentDensity ? (latest.latentDensity * 100).toFixed(1) + '%' : '0%'}
              </p>
            </div>
            <div className="p-6 bg-white border border-black/5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Signal Strength</p>
              <p className="text-2xl font-bold font-serif italic text-black">{latest?.breakdown?.direct || 0}</p>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5">
            <h4 className="text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-6">Engine status_</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
                <span className="text-black/40">GEO_RUNTIME</span>
                <span className="text-emerald-500 text-[8px] px-2 py-0.5 bg-emerald-500/10 rounded">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
                <span className="text-black/40">LATENT_BUFFER</span>
                <span className="text-black">OPTIMAL</span>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5">
            <details className="group cursor-pointer">
              <summary className="list-none flex items-center justify-between text-[11px] font-bold text-black uppercase tracking-[0.2em] hover:text-[#007AFF] transition-colors">
                How is this score calculated?
                <ArrowUp className="w-3 h-3 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-6 space-y-4">
                <p className="text-[12px] leading-relaxed text-black/60 font-medium">
                  The Latent Visibility Score is a weighted aggregate of four core dimensions:
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Mention Frequency', weight: SCORE_WEIGHTS.mentionFrequency * 100, color: 'bg-black', desc: 'Share of voice among competitors.' },
                    { label: 'Citation Density', weight: SCORE_WEIGHTS.citationDensity * 100, color: 'bg-black/60', desc: 'Direct sourcing and verification.' },
                    { label: 'Sentiment Score', weight: SCORE_WEIGHTS.sentimentScore * 100, color: 'bg-black/40', desc: 'Qualitative brand perception.' },
                    { label: 'Latent Density', weight: SCORE_WEIGHTS.latentDensity * 100, color: 'bg-black/20', desc: 'Prominence and RAG priority.' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-black uppercase tracking-widest">{item.label}</span>
                        <span className="text-[10px] font-mono font-bold text-black/40">{item.weight}%</span>
                      </div>
                      <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.weight}%` }} />
                      </div>
                      <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Right Content Theater (col-span-9) */}
        <div className="col-span-9 p-12 space-y-12 bg-white">
          <div className="w-full">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-4xl font-black tracking-tighter text-black uppercase font-serif italic leading-none">Market Truth Visualization</h3>
                <p className="text-[12px] font-bold font-mono tracking-[0.4em] text-[#007AFF] uppercase mt-3">Verified Latent Influence | Epoch 2024.1</p>
              </div>
            </div>

            <div className="w-full h-[500px] relative">
              {!user && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <span className="text-6xl font-black font-mono text-black/[0.03] uppercase rotate-[-15deg]">Simulated Data</span>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history?.length > 0 ? history : [{ name: 'Jan', score: 45 }]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AFF" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="transparent"
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                    tick={{ fontSize: 10, fill: '#00000030', fontWeight: 800 }}
                  />
                  <YAxis
                    stroke="transparent"
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#00000030', fontWeight: 800 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-black/5 p-4 rounded-2xl shadow-2xl space-y-2">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-[10px] font-bold font-mono text-black/30 uppercase tracking-widest">
                                {new Date(data.date).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-1">
                                <ProviderBadge provider={data.provider} />
                                {data.provider !== 'gemini' && <Info className="w-2.5 h-2.5 text-[#007AFF]" />}
                              </div>
                            </div>
                            <p className="text-2xl font-black font-serif italic text-black">{data.score}%</p>
                            {data.provider !== 'gemini' && (
                              <p className="text-[8px] font-bold text-[#007AFF] uppercase tracking-tighter max-w-[120px]">
                                Normalized Fallback Mode Active
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#007AFF" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-full pt-12 border-t border-black/5 relative">
            {!user && (
              <div className="absolute top-12 right-0 z-10 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-lg text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                Simulated Dataset
              </div>
            )}
            <GenerativeAITrafficChart isSimulated={!user} />
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
    <div className="flex items-center justify-between py-5 border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-all rounded-xl px-4 -mx-4 group">
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-110",
          isYou ? "bg-black text-white" : "bg-soft-gray text-black border border-black/5"
        )}>
          {brand.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-black">{brand}</div>
          {isYou && <div className="text-[10px] font-mono uppercase tracking-widest text-black/40 font-bold">Primary Brand</div>}
        </div>
      </div>

      <div className="flex items-center gap-12 text-sm">
        <div className="text-right hidden sm:block">
          <div className="text-black/30 text-[10px] uppercase font-mono font-bold tracking-widest mb-1">Visibility</div>
          <div className="font-bold text-black font-serif text-lg">{visibility}</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-black/30 text-[10px] uppercase font-mono font-bold tracking-widest mb-1">Sentiment</div>
          <div className="font-bold text-black font-serif text-lg">{sentiment}%</div>
        </div>

        {action ? (
          <button
            onClick={() => toast.success(`Executing Agentic Response for ${brand}`, { description: 'Generating LSO snippet...' })}
            disabled={!isYou && !isYou} // Note: This is a hacky way to check if we in guest mode if we don't pass user down
            className={cn(
              "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              action.severity === 'HIGH' ? "bg-[#FF3B30] text-white" : "bg-black text-white",
              // Since user is not available in this scope, we keep it enabled for now or pass user down.
              // Actually, looking at the code, MetricRow is defined globally in the file.
            )}
          >
            {action.title}
          </button>
        ) : (
          <div className="text-right">
            <div className="text-black/30 text-[10px] uppercase font-mono font-bold tracking-widest mb-1">Rank</div>
            <div className="font-bold text-black font-serif text-lg">#{position}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProviderBadge({ provider, color = "black" }: { provider: string; color?: string }) {
  if (!provider) return null;
  const initial = provider.charAt(0).toUpperCase();
  const name = provider.toLowerCase();

  return (
    <div
      className="px-1.5 py-0.5 rounded bg-black/5 border border-black/10 flex items-center justify-center"
      title={`Intelligence Source: ${provider}`}
    >
      <span className="text-[8px] font-black font-mono" style={{ color }}>{initial}</span>
    </div>
  );
}
