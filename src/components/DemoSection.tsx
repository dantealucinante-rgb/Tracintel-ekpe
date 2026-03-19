"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

const mockData = [
    { date: "Jan", visibility: 61, sentiment: 72, citations: 45 },
    { date: "Feb", visibility: 65, sentiment: 75, citations: 50 },
    { date: "Mar", visibility: 70, sentiment: 78, citations: 58 },
    { date: "Apr", visibility: 74, sentiment: 80, citations: 63 },
    { date: "May", visibility: 78, sentiment: 85, citations: 70 },
    { date: "Jun", visibility: 82, sentiment: 90, citations: 94 },
]

const brands = [
    { name: "Tracintel", color: "#2563EB" },
    { name: "OpenAI", color: "#16A34A" },
    { name: "Gemini", color: "#D97706" },
    { name: "Claude", color: "#7C3AED" },
    { name: "Llama", color: "#DC2626" },
    { name: "Mistral", color: "#0891B2" },
]

const pills = [
    { label: "Visibility Vector", value: "+12%", positive: true },
    { label: "Trust Score", value: "+5%", positive: true },
    { label: "Latent Position", value: "-0.4%", positive: false },
    { label: "Citation Peak", value: "+8%", positive: true },
]

export function DemoSection() {
    return (
        <section style={{ background: "#F7F8FA", padding: "80px 0" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

                {/* Section header */}
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280", marginBottom: "12px" }}>
                        Live Dashboard Preview
                    </p>
                    <h2 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", color: "#111827", margin: 0 }}>
                        See exactly how AI perceives your brand
                    </h2>
                </div>

                {/* Demo panel */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", gap: "32px", flexWrap: "wrap" }}>

                    {/* Left column */}
                    <div style={{ flex: "0 0 260px", minWidth: "200px" }}>
                        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "8px" }}>
                            Visibility Epoch
                        </p>
                        <p style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.02em", color: "#111827", margin: "0 0 12px" }}>
                            82.2%
                        </p>
                        <span style={{ background: "#DCFCE7", color: "#16A34A", borderRadius: "20px", padding: "4px 10px", fontSize: "12px", fontWeight: 500 }}>
                            ↑ +5.1%
                        </span>

                        <div style={{ marginTop: "32px", borderTop: "1px solid #F3F4F6", paddingTop: "24px" }}>
                            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "16px" }}>
                                Signal Integrity
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                <span style={{ fontSize: "13px", color: "#6B7280" }}>Latent State</span>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>Locked</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "13px", color: "#6B7280" }}>Vector Sync</span>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#16A34A" }}>Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={{ flex: 1, minWidth: "300px" }}>

                        {/* Metric pills */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                            {pills.map((pill) => (
                                <div key={pill.label} style={{ background: "#F7F8FA", borderRadius: "8px", padding: "8px 12px", fontSize: "13px" }}>
                                    <span style={{ color: pill.positive ? "#16A34A" : "#DC2626", fontWeight: 600, marginRight: "6px" }}>
                                        {pill.value}
                                    </span>
                                    <span style={{ color: "#6B7280" }}>{pill.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div style={{ height: "240px", width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
                                    <Line type="monotone" dataKey="visibility" stroke="#2563EB" strokeWidth={2} dot={false} name="Visibility" />
                                    <Line type="monotone" dataKey="sentiment" stroke="#16A34A" strokeWidth={2} dot={false} name="Sentiment" />
                                    <Line type="monotone" dataKey="citations" stroke="#D97706" strokeWidth={2} dot={false} name="Citations" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Brand legend */}
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #F3F4F6" }}>
                            {brands.map((brand) => (
                                <div key={brand.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: brand.color }} />
                                    <span style={{ fontSize: "12px", color: "#6B7280" }}>{brand.name}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
