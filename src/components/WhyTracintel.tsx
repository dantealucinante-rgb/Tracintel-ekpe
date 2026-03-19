"use client"

export function WhyTracintel() {
    const features = [
        {
            number: "01",
            title: "The Attribution Problem",
            description:
                "Over 70% of brand mentions inside generative interfaces go untracked by legacy analytics. Tracintel captures these signals before they are lost to the inference loop.",
        },
        {
            number: "02",
            title: "The Sentiment Engine",
            description:
                "Legacy sentiment tools rely on shallow keyword matching. Tracintel uses semantic analysis to understand how models interpret your brand value prop across multi-dimensional latent space.",
        },
        {
            number: "03",
            title: "The Future of Search",
            description:
                "The transition from SERPs to synthetic answers is absolute. Tracintel lets you audit the training origins of these answers and claim your share of generative citations.",
        },
    ]

    return (
        <section style={{ background: "#ffffff", padding: "96px 0" }}>
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
                        Why Tracintel
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
                        Built for the era where AI answers replace search results
                    </h2>
                </div>

                {/* Feature cards */}
                <div className="feature-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                }}>
                    {features.map((feature) => (
                        <div
                            key={feature.number}
                            style={{
                                background: "#ffffff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px",
                                padding: "32px",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Background number */}
                            <span style={{
                                position: "absolute",
                                top: "-16px",
                                right: "16px",
                                fontSize: "96px",
                                fontWeight: 800,
                                color: "#F3F4F6",
                                lineHeight: 1,
                                userSelect: "none",
                                letterSpacing: "-0.04em",
                            }}>
                                {feature.number}
                            </span>

                            {/* Number label */}
                            <p style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#2563EB",
                                marginBottom: "12px",
                            }}>
                                {feature.number}
                            </p>

                            {/* Title */}
                            <h3 style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                letterSpacing: "-0.01em",
                                color: "#111827",
                                marginBottom: "16px",
                                lineHeight: 1.3,
                            }}>
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontSize: "14px",
                                color: "#6B7280",
                                lineHeight: 1.7,
                                margin: 0,
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
