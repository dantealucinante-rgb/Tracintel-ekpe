"use client";

import Link from 'next/link';
import useSWR from 'swr';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, RefreshCw, ArrowUp, Target, Shield, Zap, BarChart3, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import GenerativeAITrafficChart from '@/components/GenerativeAITrafficChart';
import BentoGrid, { BentoCard } from '@/components/BentoGrid';
import LiveTokenStream from '@/components/LiveTokenStream';
import CompetitiveLeaderboard from '@/components/dashboard/CompetitiveLeaderboard';
import VectorDisplacementGraph from '@/components/dashboard/VectorDisplacementGraph';
import SentimentHeatmap from '@/components/dashboard/SentimentHeatmap';
import { ActionEngine, AgenticAction } from '@/lib/core/actions';
import { toast } from 'sonner';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { createClient } from '@/lib/supabase/client';
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
    latest: {
      score: 64,
      latentDensity: 0.42,
      date: new Date().toISOString(),
      breakdown: { direct: 58, som: {} },
      signals: [
        { type: 'STRATEGY_INJECTION', source: 'Simulated Engine', content: 'Guest Monitoring active. Sign in to deploy live latent signals.', createdAt: new Date().toISOString() }
      ],
      provider: 'Guest Mode (Preview)'
    },
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

  const { latest, history } = stats;
  const score = latest?.score || 0;

  // Empty State: No data yet
  if (!latest && !isScanning) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-black/[0.02] border border-black/5 flex items-center justify-center mb-8 animate-pulse">
          <Target className="w-10 h-10 text-black/20" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tighter text-black font-serif italic mb-4">Unmapped Territory</h2>
        <p className="text-sm text-black/40 max-w-sm mb-10 leading-relaxed font-medium">Your brand has not been indexed by the Tracintel Intelligence Engine. Run an initial scan to begin mapping your latent space visibility.</p>
        <button
          onClick={handleScan}
          className="h-16 px-10 bg-black text-white text-sm font-bold rounded-2xl shadow-2xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
        >
          <Zap className="w-4 h-4 text-[#007AFF]" />
          Run Initial Intelligence Scan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="text-[10px] font-bold font-mono tracking-[0.3em] text-black/40 uppercase">Intelligence Loop Active</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-black font-serif italic">Tracintel Command</h1>
          <p className="text-xs font-medium text-black/40 mt-3 max-w-sm">Autonomous Generative Engine Optimization (GEO) {"&"} Latent Space Monitoring System.</p>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={cn(
            "h-14 px-8 rounded-2xl text-sm font-bold transition-all shadow-2xl flex items-center justify-center gap-3",
            isScanning
              ? "bg-black/5 text-black/20 cursor-not-allowed border border-black/5 shadow-none"
              : "bg-black hover:bg-black/90 text-white shadow-[#007AFF]/20 hover:shadow-[#007AFF]/40"
          )}
        >
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#007AFF]" />
              Initializing Scan...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 text-[#007AFF]" />
              Trigger Global Sync
            </>
          )}
        </button>
      </div>

      {/* Live Stream Overlay during scanning */}
      {isScanning && (
        <div className="h-[200px]">
          <LiveTokenStream
            rawText="Analyzing latent space distribution... Calculating token probability... Extracting influence sources... Scanning for RAG-compliant citations... GEO Score calculation in progress..."
            isScanning={true}
          />
        </div>
      )}

      {/* Metrics Grid - High Density */}
      <BentoGrid className="lg:grid-cols-4">
        <BentoCard
          title="Latent Visibility Coefficient"
          value={score}
          description="Aggregated mention frequency and citation weight across 128B+ parameter neural networks."
          icon={Target}
          trend="+5.2%"
          trendType="up"
          className="lg:col-span-2"
        />
        <BentoCard
          title="Semantic Saturation"
          value={latest?.latentDensity ? (latest.latentDensity * 100).toFixed(1) + '%' : '0%'}
          description="The probabilistic weight of brand tokens within model architecture."
          icon={Shield}
          trend="+2.1%"
          trendType="up"
        />
        <BentoCard
          title="Signal Strength"
          value={latest?.breakdown?.direct || 0}
          description="Consistent recommendation weight."
          icon={Zap}
          trend="-1.2%"
          trendType="down"
        />
      </BentoGrid>

      {/* Strategy Stream Section */}
      <div className="bg-black text-white rounded-[3rem] border border-white/5 p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
          <Zap className="h-64 w-64 text-[#007AFF]" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-sm font-bold font-mono tracking-[0.3em] text-[#007AFF] uppercase mb-2">Live Strategy Stream</h3>
              <h2 className="text-3xl font-bold tracking-tighter font-serif italic">Manifold Injections</h2>
            </div>
            <Link href="/dashboard/prompts" className="text-[10px] font-bold font-mono tracking-widest text-white/20 hover:text-[#007AFF] transition-colors uppercase border-b border-white/5 pb-1">Deploy New Strategy</Link>
          </div>

          <div className="space-y-4">
            {latest?.signals?.filter((s: any) => s.type === 'STRATEGY_INJECTION').length > 0 ? (
              latest.signals.filter((s: any) => s.type === 'STRATEGY_INJECTION').slice(0, 3).map((s: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.08] transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 text-[#007AFF]" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold font-mono text-white/40 uppercase mb-1">Source: {s.source}</div>
                      <p className="text-xs font-medium text-white/80 line-clamp-1">{s.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/20">{new Date(s.createdAt).toLocaleTimeString()}</span>
                    <div className="px-2 py-0.5 rounded bg-[#34C759]/10 text-[#34C759] text-[8px] font-bold uppercase tracking-widest">Deployed</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                <p className="text-xs font-medium text-white/20 italic">No strategies deployed in current epoch.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Visibility Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-black/5 p-10 flex flex-col hover:border-black/20 transition-all group">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-bold tracking-tighter text-black uppercase font-serif">Visibility Epochs</h3>
              <p className="text-[10px] font-bold font-mono tracking-[0.2em] text-[#007AFF] uppercase mt-1">Live Variance Stream</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history?.length ? history : [{ date: 'Now', score: 0 }]}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="transparent"
                  tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  tick={{ fontSize: 10, fill: '#00000020', fontWeight: 700 }}
                />
                <YAxis
                  stroke="transparent"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#00000020', fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ stroke: '#007AFF', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: '#000',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#fff',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)'
                  }}
                  itemStyle={{ color: '#007AFF' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#007AFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Generative AI Traffic Share Chart */}
        <div className="h-full">
          <GenerativeAITrafficChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <CompetitiveLeaderboard
          data={[
            { model: 'Gemini 1.5 Pro', visibility: score, brand: 'Tracintel' },
            { model: 'GPT-4o', visibility: 72, brand: 'Tracintel' },
            { model: 'Claude 3.5 Sonnet', visibility: 65, brand: 'Tracintel' },
            { model: 'Perplexity', visibility: 88, brand: 'Tracintel' }
          ]}
        />
        <VectorDisplacementGraph
          data={[
            { x: 85, y: 12, z: 92, keyword: 'GEO Strategy' },
            { x: 45, y: 45, z: 20, keyword: 'SEO' },
            { x: 70, y: 25, z: 60, keyword: 'AEO' },
            { x: 92, y: 8, z: 98, keyword: 'Inference' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <SentimentHeatmap
            data={Array.from({ length: 40 }).map((_, i) => ({
              day: `Day ${i}`,
              trust: Math.floor(Math.random() * 40) + 60
            }))}
          />
        </div>
        <div className="bg-black text-white rounded-[2rem] border border-white/5 p-10 flex flex-col justify-center">
          <h4 className="text-xl font-serif italic text-[#007AFF] mb-4 uppercase tracking-tighter">Engine Status</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
              <span className="text-white/40">Fallback Mode</span>
              <span className="text-[#34C759]">Ready</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
              <span className="text-white/40">Edge Runtime</span>
              <span className="text-[#34C759]">Active</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
              <span className="text-white/40">Latent Buffer</span>
              <span className="text-[#FFCC00]">Optimal</span>
            </div>
          </div>
          <button className="mt-8 py-3 bg-white text-black text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-white/90 transition-all">
            Export Evidence
          </button>
        </div>
      </div>

      {/* AI Search Metrics Table */}
      <div className="bg-white rounded-[2rem] border border-black/5 p-10 hover:border-black/20 transition-all relative overflow-hidden">
        {!user && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-md flex items-center justify-center">
            <div className="text-center p-6 bg-black text-white rounded-2xl shadow-xl">
              <Shield className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <p className="text-sm font-bold tracking-tight">Access Protocol Required</p>
              <p className="text-[10px] text-white/40 font-mono mt-1">Verify session to unlock Live Inference Ranking</p>
              <button
                onClick={() => setShowAuthOverlay(true)}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
              >
                Authorize Access
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold tracking-tighter text-black uppercase font-serif">Inference Ranking</h3>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#FF3B30] uppercase animate-pulse">3 Gaps Detected</span>
            <Link href="/dashboard/prompts" className="text-[10px] font-bold font-mono tracking-widest text-black/30 hover:text-[#007AFF] transition-colors uppercase">View Full Matrix →</Link>
          </div>
        </div>
        <div className="space-y-2">
          <MetricRow
            brand="Your Brand"
            visibility={score}
            sentiment={latest?.breakdown?.direct || 0}
            position={1}
            isYou={true}
            action={{ title: 'Fix Citation Gap', severity: 'HIGH' }}
          />
          <MetricRow
            brand="Competitor A"
            visibility={75}
            sentiment={68}
            position={2}
          />
          <MetricRow
            brand="Competitor B"
            visibility={62}
            sentiment={71}
            position={3}
          />
        </div>
      </div>

      <AuthOverlay isVisible={showAuthOverlay} />
    </div>
  );
}

function MetricRow({ brand, visibility, sentiment, position, action, isYou = false }: any) {
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
            className={cn(
              "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              action.severity === 'HIGH' ? "bg-[#FF3B30] text-white hover:shadow-[0_0_15px_rgba(255,59,48,0.4)]" : "bg-black text-white"
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
