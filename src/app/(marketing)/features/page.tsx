import Link from "next/link"

export default function FeaturesPage() {
    const upcoming = [
        {
            label: "Advanced Analytics Dashboard",
            description: "Deep metric breakdowns per brand, per model, per time period.",
        },
        {
            label: "Real-time Signal Tracking",
            description: "Live monitoring of brand mentions as they happen across LLMs.",
        },
        {
            label: "Customizable Reporting",
            description: "Export scan data into branded reports for clients and stakeholders.",
        },
        {
            label: "Competitor Benchmarking",
            description: "Side-by-side visibility comparison against any tracked competitor.",
        },
    ]

    return (
        <main style={{
            minHeight: "100vh",
            background: "#F7F8FA",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        }}>

            {/* Badge */}
            <div style={{
                background: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6B7280",
                letterSpacing: "0.04em",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563EB" }} />
                In Development
            </div>

            {/* Heading */}
            <h1 style={{
                fontSize: "48px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#111827",
                textAlign: "center",
                margin: "0 0 16px",
                maxWidth: "600px",
                lineHeight: 1.15,
            }}>
                Features are being built
            </h1>

            <p style={{
                fontSize: "16px",
                color: "#6B7280",
                textAlign: "center",
                maxWidth: "480px",
                lineHeight: 1.6,
                margin: "0 0 64px",
            }}>
                Tracintel is actively in development. Here is what is coming in the next release.
            </p>

            {/* Feature list */}
            <div style={{
                width: "100%",
                maxWidth: "640px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "64px",
            }}>
                {upcoming.map((item, i) => (
                    <div key={i} style={{
                        background: "#ffffff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                    }}>
                        <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: "#EFF6FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#2563EB",
                        }}>
                            {String(i + 1).padStart(2, "0")}
                        </div>
                        <div>
                            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>
                                {item.label}
                            </p>
                            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/" style={{
                    background: "#ffffff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#374151",
                    textDecoration: "none",
                }}>
                    ← Back to Home
                </Link>
                <Link href="/dashboard" style={{
                    background: "#111827",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#ffffff",
                    textDecoration: "none",
                }}>
                    Go to Dashboard
                </Link>
            </div>

        </main>
    )
}
