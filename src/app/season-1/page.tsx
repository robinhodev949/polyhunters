"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Shield, Cpu, ArrowRight, CheckCircle, Search, Gift, Trophy, Zap, Copy, Check } from "lucide-react";
import { useAccount } from "wagmi";

export default function Season1Page() {
    const { isConnected, address } = useAccount();
    const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

    const handleCopy = (wallet: string) => {
        navigator.clipboard.writeText(wallet);
        setCopiedWallet(wallet);
        setTimeout(() => setCopiedWallet(null), 2000);
    };

    useEffect(() => {
        fetch("/api/leaderboard/hunters")
            .then(res => res.json())
            .then(data => {
                if (data.hunters) {
                    setLeaderboard(data.hunters);
                }
                setLoadingLeaderboard(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingLeaderboard(false);
            });
    }, []);

    return (
        <div style={{ background: "#FAFAFA", minHeight: "calc(100vh - 56px)", padding: "100px 24px 80px", color: "#111111", fontFamily: "var(--font-sans)" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                
                {/* ── Cool Hero Banner ── */}
                <div style={{
                    background: "linear-gradient(135deg, #090D1A 0%, #020617 100%)",
                    borderRadius: "16px",
                    padding: "48px 40px",
                    border: "1px solid #1E293B",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    marginBottom: "40px"
                }}>
                    {/* Glowing background accent */}
                    <div style={{
                        position: "absolute",
                        top: "-50%",
                        right: "-10%",
                        width: "350px",
                        height: "350px",
                        background: "rgba(204,255,0,0.1)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                        pointerEvents: "none"
                    }} />

                    {/* Season Badge */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#CCFF00",
                        color: "#000000",
                        padding: "6px 14px",
                        borderRadius: "30px",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "24px",
                        boxShadow: "0 2px 8px rgba(204,255,0,0.2)"
                    }}>
                        <Zap size={14} fill="currentColor" /> Season 1 Active
                    </div>

                    <h1 style={{
                        fontSize: "3.2rem",
                        fontWeight: 800,
                        color: "#FFFFFF",
                        margin: "0 0 16px 0",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1
                    }}>
                        Hunter Season 1:<br />Prediction Agent Hunt
                    </h1>
                    
                    <p style={{
                        fontSize: "1.15rem",
                        color: "#94A3B8",
                        margin: "0 0 32px 0",
                        maxWidth: "600px",
                        lineHeight: 1.6
                    }}>
                        Discover profitable AI trading models, deploy them as market agents on Robinhood Chain, and secure a share of the platform's revenue.
                    </p>

                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <Link href="/submit" style={{ textDecoration: "none" }}>
                            <button style={{
                                background: "#CCFF00",
                                color: "#000000",
                                border: "none",
                                padding: "14px 28px",
                                borderRadius: "8px",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.15s",
                                boxShadow: "0 4px 14px rgba(204,255,0,0.25)"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                Hunt an Agent <ArrowRight size={16} />
                            </button>
                        </Link>
                        <Link href="/docs" style={{ textDecoration: "none" }}>
                            <button style={{
                                background: "rgba(255,255,255,0.06)",
                                color: "#FFFFFF",
                                border: "1px solid rgba(255,255,255,0.15)",
                                padding: "14px 28px",
                                borderRadius: "8px",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                            >
                                How it Works
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "48px" }}>
                    
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                        <div style={{ color: "#6B6B6B", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "8px" }}>
                            Total Rewards Pool
                        </div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#165DFC" }}>
                            $2,000
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "4px" }}>
                            Funded by platform protocol fees
                        </div>
                    </div>

                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                        <div style={{ color: "#6B6B6B", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "8px" }}>
                            Revenue Share allocation
                        </div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0A7C4E" }}>
                            20% of Rental Fees
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "4px" }}>
                            Distributed to top hunters & holders
                        </div>
                    </div>

                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                        <div style={{ color: "#6B6B6B", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "8px" }}>
                            Season Ends In
                        </div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111111" }}>
                            30d : 00h : 00m
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "4px" }}>
                            Ends: August 18, 2026
                        </div>
                    </div>

                </div>

                {/* ── Season Mechanics & Flywheel ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "56px", alignItems: "start" }}>
                    
                    {/* Left: How to earn points */}
                    <div>
                        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111111", marginBottom: "20px", letterSpacing: "-0.01em" }}>
                            How to Earn Hunt Points
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            
                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(22,93,252,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Cpu size={18} color="#165DFC" />
                                </div>
                                <div>
                                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 700 }}>Submit AI Agents (+500 pts)</h4>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.5 }}>
                                        Hunt profitable prediction models, write their docker configuration, and list them in the marketplace.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(10,124,78,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Trophy size={18} color="#0A7C4E" />
                                </div>
                                <div>
                                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 700 }}>Upvotes Reward (+10 pts per upvote)</h4>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.5 }}>
                                        Every time community members upvote your hunted agent, your rank climbs.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(204,255,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Zap size={18} color="#99b200" />
                                </div>
                                <div>
                                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 700 }}>Rental Vol. Multiplier (+100 pts / day)</h4>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.5 }}>
                                        Earn high points dynamically when users deploy and rent the agents you discovered.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right: Reward allocation & Flywheel */}
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Gift size={20} color="#165DFC" /> Season 1 Reward Incentives
                        </h3>
                        
                        <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.5, margin: "0 0 24px 0" }}>
                            Platform fees are split transparently. Our smart-contracts allocate 2% fees collected from rentals into two pools:
                        </p>

                        <div style={{ borderLeft: "3px solid #CCFF00", paddingLeft: "16px", marginBottom: "20px" }}>
                            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111111", marginBottom: "4px" }}>
                                ETH Pool (Development & Marketing)
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.4 }}>
                                Dedicated to expanding the web3 hosting layer and attracting elite algorithm creators.
                            </div>
                        </div>

                        <div style={{ borderLeft: "3px solid #165DFC", paddingLeft: "16px" }}>
                            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111111", marginBottom: "4px" }}>
                                $HUNTER Pool (Treasury & Staker Payouts)
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.4 }}>
                                $HUNTER stakers and active hunters share passive revenue based on point score and token holdings.
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Leaderboard Section ── */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
                        <div>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
                                Season 1 Hunters Leaderboard
                            </h2>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6B6B6B" }}>
                                Top hunters earning point allocations this cycle
                            </p>
                        </div>
                        <div style={{ background: "#FAFAFA", border: "1px solid #E8E8E8", padding: "6px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
                            Updated Live
                        </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #E8E8E8" }}>
                                    <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Rank</th>
                                    <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Hunter Wallet</th>
                                    <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Agents Hunted</th>
                                    <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Points</th>
                                    <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Badge Award</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingLeaderboard ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#6B6B6B", fontSize: "0.95rem" }}>
                                            Loading leaderboard data...
                                        </td>
                                    </tr>
                                ) : leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#6B6B6B", fontSize: "0.95rem" }}>
                                            No hunters have registered points yet this season. Be the first to hunt an agent!
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((entry, index) => (
                                        <tr key={entry.wallet} style={{ 
                                            borderBottom: "1px solid #FAFAFA",
                                            background: index === 0 ? "rgba(204,255,0,0.03)" : "none",
                                            transition: "background 0.15s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                        onMouseLeave={e => e.currentTarget.style.background = index === 0 ? "rgba(204,255,0,0.03)" : "none"}
                                        >
                                            <td style={{ padding: "16px", fontWeight: 700, fontSize: "0.95rem" }}>
                                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                            </td>
                                            <td style={{ padding: "16px", fontFamily: "monospace", fontSize: "0.9rem", color: "#111111" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span>{entry.wallet.slice(0, 8)}...{entry.wallet.slice(-6)}</span>
                                                    <button onClick={() => handleCopy(entry.wallet)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px", color: copiedWallet === entry.wallet ? "#0A7C4E" : "#9CA3AF" }}>
                                                        {copiedWallet === entry.wallet ? <Check size={14} /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px", fontSize: "0.95rem" }}>{entry.huntedCount}</td>
                                            <td style={{ padding: "16px", fontWeight: 700, color: "#165DFC", fontSize: "0.95rem" }}>{entry.score} pts</td>
                                            <td style={{ padding: "16px" }}>
                                                <span style={{ 
                                                    fontSize: "0.75rem", 
                                                    fontWeight: 600, 
                                                    color: entry.huntedCount >= 3 ? "#165DFC" : "#6B6B6B",
                                                    background: entry.huntedCount >= 3 ? "rgba(22,93,252,0.08)" : "#FAFAFA",
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    border: `1px solid ${entry.huntedCount >= 3 ? "rgba(22,93,252,0.15)" : "#E8E8E8"}`
                                                }}>
                                                    {entry.huntedCount >= 3 ? "Elite Builder" : "Genesis Hunter"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
