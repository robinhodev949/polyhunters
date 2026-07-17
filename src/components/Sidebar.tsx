"use client";

export function Sidebar() {
    return (
        <div style={{ padding: "24px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0 0 16px 0", color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Platform Stats
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                    <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "4px" }}>Total Volume Secured</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#000" }}>$42.8M</div>
                </div>

                <hr className="divider" />

                <div>
                    <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "4px" }}>Active OpenClaw Nodes</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#000" }}>1,248</div>
                </div>

                <hr className="divider" />

                <div>
                    <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "4px" }}>Avg. Daily ROI</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#00C853" }}>+1.4%</div>
                </div>
            </div>

            <div style={{ marginTop: "32px" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0 0 16px 0", color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Trending Tags
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["Politics", "Sports", "Crypto", "Macro", "Arbitrage", "NLP", "Low-Liquidity"].map((tag) => (
                        <span key={tag} className="tag" style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E5E7EB"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
