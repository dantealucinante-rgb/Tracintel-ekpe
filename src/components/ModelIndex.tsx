"use client"

export function ModelIndex() {
    const models = [
        {
            name: "GPT-4o",
            provider: "OpenAI",
            accentColor: "#16A34A",
            score: 94.2,
            trend: "+4.2% Citation Growth",
            trendPositive: true,
            description:
                "Demonstrates high affinity for structured data and technical documentation. Retail brands with strong Schema.org implementations see a 12% higher mindshare ranking in direct product comparisons.",
        },
        {
            name: "Gemini 1.5 Pro",
            provider: "Google",
            accentColor: "#2563EB",
            score: 94.2,
            trend: "High Recommendation Consistency",
            trendPositive: true,
            description:
                "Heavily weights authority signals from verified news sources and first-party case studies. Tech brands utilizing RAG-friendly whitepapers currently dominate recommendation loops.",
        },
        {
            name: "Claude 3.5 Sonnet",
            provider: "Anthropic",
            accentColor: "#7C3AED",
            score: 94.2,
            trend: "Improved Sentiment Precision",
            trendPositive: true,
            description:
                "Prioritizes nuanced, conversational value propositions. Brands with clear, non-generic brand voices are 3x more likely to be featured in top choice summaries during complex user queries.",
        },
    ]

    return (
        <section style={{ background: "#F7F8FA", padding: "96px 0" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

                {/* Section header */}
                <div style={{ textAlign: "center", marginBottom: "64px" }}>
                    <p style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#6B7280",
                        marginBottom: "16px",
                    }}>
                        Model Intelligence Index
                    </p>
                    <h2 style={{
                        fontSize: "36px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#111827",
                        margin: "0 auto",
                        maxWidth: "600px",
                        lineHeight: 1.25,
                    }}>
                        Understand how each AI model perceives and recommends brands
                    </h2>
                    <p style={{
                        fontSize: "16px",
                        color: "#6B7280",
                        marginTop: "16px",
                        maxWidth: "520px",
                        margin: "16px auto 0",
                        lineHeight: 1.6,
                    }}>
                        Real-time monitoring of model update cycles and their direct impact on brand citation volatility across the global generative landscape.
                    </p>
                </div>

                {/* Model cards */}
                <div className="model-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                }}>
                    {models.map((model) => (
                        <div
                            key={model.name}
                            style={{
                                background: "#ffffff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px",
                                borderLeft: `4px solid ${model.accentColor}`,
                                padding: "32px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            {/* Card header */}
                            <div>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    letterSpacing: "-0.01em",
                                    color: "#111827",
                                    margin: "0 0 4px",
                                }}>
                                    {model.name}
                                </h3>
                                <p style={{
                                    fontSize: "13px",
                                    color: "#6B7280",
                                    margin: 0,
                                }}>
                                    {model.provider}
                                </p>
                            </div>

                            {/* Description */}
                            <p style={{
                                fontSize: "14px",
                                color: "#6B7280",
                                lineHeight: 1.7,
                                margin: 0,
                                flex: 1,
                            }}>
                                {model.description}
                            </p>

                            {/* Footer */}
                            <div style={{
                                borderTop: "1px solid #F3F4F6",
                                paddingTop: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                                <div>
                                    <p style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: "#9CA3AF",
                                        margin: "0 0 4px",
                                    }}>
                                        Model Index Score
                                    </p>
                                    <p style={{
                                        fontSize: "24px",
                                        fontWeight: 700,
                                        letterSpacing: "-0.02em",
                                        color: "#111827",
                                        margin: 0,
                                    }}>
                                        {model.score}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: model.trendPositive ? "#16A34A" : "#DC2626",
                                    background: model.trendPositive ? "#DCFCE7" : "#FEE2E2",
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                    maxWidth: "140px",
                                    textAlign: "right",
                                    lineHeight: 1.4,
                                }}>
                                    {model.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
