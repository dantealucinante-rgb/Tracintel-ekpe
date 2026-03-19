"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Eye, Shield, Crosshair, Quote } from "lucide-react";

const mockData = [
    { date: "Jan", visibility: 61, sentiment: 72, citations: 45 },
    { date: "Feb", visibility: 65, sentiment: 75, citations: 50 },
    { date: "Mar", visibility: 70, sentiment: 78, citations: 58 },
    { date: "Apr", visibility: 74, sentiment: 80, citations: 63 },
    { date: "May", visibility: 78, sentiment: 85, citations: 70 },
    { date: "Jun", visibility: 82, sentiment: 90, citations: 94 },
];

const metricPills = [
    { icon: Eye, label: "Visibility Vector", value: "+12%", positive: true },
    { icon: Shield, label: "Trust Score", value: "+5%", positive: true },
    { icon: Crosshair, label: "Latent Position", value: "-0.4%", positive: false },
    { icon: Quote, label: "Citation Peak", value: "+8%", positive: true },
];

const brandLegend = [
    { name: "Tracintel", color: "#2563EB" },
    { name: "OpenAI", color: "#10b981" },
    { name: "Gemini", color: "#fbbf24" },
    { name: "Claude", color: "#6366f1" },
    { name: "Llama", color: "#f43f5e" },
    { name: "Mistral", color: "#0ea5e9" },
];

export default function DashboardPreview() {
    return (
        <section
            style={{
                width: "100%",
                background: "#F7F8FA",
                padding: "80px 0",
            }}
            className="dashboard-preview-section"
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "0 24px",
                }}
            >
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <p
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#6B7280",
                            marginBottom: 12,
                        }}
                    >
                        Live Dashboard Preview
                    </p>
                    <h2
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: "#111827",
                            lineHeight: 1.2,
                            margin: 0,
                        }}
                    >
                        See exactly how AI perceives your brand
                    </h2>
                </div>

                {/* Demo Panel Card */}
                <div
                    style={{
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: 16,
                        padding: 32,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    }}
                    className="demo-panel"
                >
                    <div className="demo-panel-grid">
                        {/* ─── Left Column: Metrics ─── */}
                        <div className="demo-panel-left">
                            {/* Visibility Epoch */}
                            <div style={{ marginBottom: 32 }}>
                                <p
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        fontFamily: "var(--font-mono, monospace)",
                                        letterSpacing: "0.4em",
                                        color: "rgba(0,0,0,0.3)",
                                        textTransform: "uppercase",
                                        marginBottom: 8,
                                    }}
                                >
                                    Visibility Epoch
                                </p>
                                <p
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 700,
                                        letterSpacing: "-0.02em",
                                        color: "#111827",
                                        lineHeight: 1,
                                        margin: 0,
                                    }}
                                >
                                    82.2%
                                </p>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        background: "#DCFCE7",
                                        color: "#16A34A",
                                        borderRadius: 20,
                                        padding: "4px 10px",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        marginTop: 8,
                                    }}
                                >
                                    <TrendingUp style={{ width: 12, height: 12 }} />
                                    +5.1%
                                </div>
                            </div>

                            {/* Signal Integrity */}
                            <div
                                style={{
                                    paddingTop: 24,
                                    borderTop: "1px solid #F3F4F6",
                                }}
                            >
                                <h4
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        fontFamily: "var(--font-mono, monospace)",
                                        letterSpacing: "0.3em",
                                        color: "rgba(0,0,0,0.4)",
                                        textTransform: "uppercase",
                                        marginBottom: 16,
                                    }}
                                >
                                    Signal Integrity
                                </h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: "#9CA3AF" }}>Latent_State</span>
                                        <span style={{ fontWeight: 700, color: "#111827" }}>LOCKED</span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: "#9CA3AF" }}>Vector_Sync</span>
                                        <span style={{ fontWeight: 700, color: "#16A34A" }}>ACTIVE</span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: "#9CA3AF" }}>Model_Coverage</span>
                                        <span style={{ fontWeight: 700, color: "#111827" }}>3 / 3</span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: "#9CA3AF" }}>Drift_Alert</span>
                                        <span style={{ fontWeight: 700, color: "#D97706" }}>NOMINAL</span>
                                    </div>
                                </div>

                                <p
                                    style={{
                                        fontSize: 11,
                                        color: "rgba(0,0,0,0.4)",
                                        fontStyle: "italic",
                                        lineHeight: 1.6,
                                        marginTop: 20,
                                    }}
                                >
                                    Brand intelligence vectors have achieved mathematical parity across all major generative nodes.
                                </p>
                            </div>
                        </div>

                        {/* ─── Right Column: Chart & Metrics ─── */}
                        <div className="demo-panel-right">
                            {/* Metric Pills Row */}
                            <div className="metric-pills-grid">
                                {metricPills.map((pill) => {
                                    const PillIcon = pill.icon;
                                    return (
                                        <div
                                            key={pill.label}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                background: "#F7F8FA",
                                                borderRadius: 8,
                                                padding: "8px 12px",
                                                fontSize: 13,
                                            }}
                                        >
                                            <PillIcon
                                                style={{
                                                    width: 14,
                                                    height: 14,
                                                    color: "#6B7280",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontWeight: 700,
                                                    color: pill.positive ? "#16A34A" : "#DC2626",
                                                }}
                                            >
                                                {pill.value}
                                            </span>
                                            <span style={{ color: "#6B7280", whiteSpace: "nowrap" }}>
                                                {pill.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chart */}
                            <div style={{ marginTop: 20, marginBottom: 20 }}>
                                <ResponsiveContainer width="100%" height={280} className="chart-responsive">
                                    <AreaChart
                                        data={mockData}
                                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="gradVisibility" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gradSentiment" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gradCitations" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D97706" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#F3F4F6"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                            domain={[30, 100]}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#fff",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: 8,
                                                fontSize: 12,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="top"
                                            align="left"
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{
                                                fontSize: 12,
                                                paddingBottom: 12,
                                                textTransform: "lowercase" as const,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="visibility"
                                            stroke="#2563EB"
                                            strokeWidth={2}
                                            fill="url(#gradVisibility)"
                                            dot={false}
                                            activeDot={{ r: 4, strokeWidth: 0 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sentiment"
                                            stroke="#16A34A"
                                            strokeWidth={2}
                                            fill="url(#gradSentiment)"
                                            dot={false}
                                            activeDot={{ r: 4, strokeWidth: 0 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="citations"
                                            stroke="#D97706"
                                            strokeWidth={2}
                                            fill="url(#gradCitations)"
                                            dot={false}
                                            activeDot={{ r: 4, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Brand Legend Row */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 16,
                                    paddingTop: 16,
                                    borderTop: "1px solid #F3F4F6",
                                }}
                            >
                                {brandLegend.map((brand) => (
                                    <div
                                        key={brand.name}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                background: brand.color,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                                            {brand.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scoped responsive styles */}
            <style jsx>{`
        .demo-panel-grid {
          display: grid;
          grid-template-columns: 30% 1fr;
          gap: 32px;
        }
        .metric-pills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .dashboard-preview-section {
            padding: 48px 0 !important;
          }
          .demo-panel {
            padding: 20px !important;
          }
          .demo-panel-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .metric-pills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
        }
      `}</style>
        </section>
    );
}
