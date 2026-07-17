"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { Terminal, Activity, Server, Database, Copy, Check, ExternalLink, RefreshCw, Wallet } from "lucide-react";

interface Rental {
    id: string;
    rentalCode: string;
    totalAmount: number;
    paymentStatus: string;
    containerStatus: string;
    startedAt: string | null;
    expiresAt: string;
    agent: {
        id: string;
        name: string;
        tagline: string;
        dockerImageUrl: string | null;
        webhookUrl: string | null;
    };
}

function RentalCard({ rental }: { rental: Rental }) {
    const [copied, setCopied] = useState(false);
    const isRunning = rental.containerStatus === "running";
    const isExpired = new Date(rental.expiresAt) < new Date();

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusColor = isExpired ? "#9CA3AF" : isRunning ? "#0A7C4E" : "#DA552F";
    const statusLabel = isExpired ? "Expired" : isRunning ? "Running" : "Pending";

    return (
        <div style={{
            background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px",
            padding: "20px", display: "flex", flexDirection: "column", gap: "16px"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111111", margin: "0 0 4px 0" }}>
                        {rental.agent.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#6B6B6B", margin: 0 }}>{rental.agent.tagline}</p>
                </div>
                <span style={{
                    fontSize: "0.75rem", fontWeight: 700, color: statusColor,
                    background: `${statusColor}15`, padding: "3px 10px",
                    borderRadius: "12px", textTransform: "uppercase"
                }}>
                    ● {statusLabel}
                </span>
            </div>

            {/* Rental Code */}
            <div style={{ background: "rgba(22,93,252,0.04)", border: "1px solid rgba(22,93,252,0.1)", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Your Rental Code
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <code style={{ fontSize: "1rem", fontWeight: 700, color: "#165DFC", fontFamily: "monospace" }}>
                        {rental.rentalCode}
                    </code>
                    <button onClick={() => copy(rental.rentalCode)} style={{
                        background: "none", border: "none", cursor: "pointer", padding: "4px"
                    }}>
                        {copied ? <Check size={16} color="#0A7C4E" /> : <Copy size={16} color="#6B6B6B" />}
                    </button>
                </div>
                <p style={{ fontSize: "0.72rem", color: "#9CA3AF", margin: "6px 0 0 0" }}>
                    Use this code to authenticate via the PolyHunt API
                </p>
            </div>

            {/* Details row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <div style={{ textAlign: "center", background: "#FAFAFA", borderRadius: "6px", padding: "10px", border: "1px solid #E8E8E8" }}>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginBottom: "2px" }}>Paid</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111111" }}>{rental.totalAmount} USDC</div>
                </div>
                <div style={{ textAlign: "center", background: "#FAFAFA", borderRadius: "6px", padding: "10px", border: "1px solid #E8E8E8" }}>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginBottom: "2px" }}>Started</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111111" }}>
                        {rental.startedAt ? new Date(rental.startedAt).toLocaleDateString() : "—"}
                    </div>
                </div>
                <div style={{ textAlign: "center", background: "#FAFAFA", borderRadius: "6px", padding: "10px", border: "1px solid #E8E8E8" }}>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginBottom: "2px" }}>Expires</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: isExpired ? "#DC2626" : "#111111" }}>
                        {new Date(rental.expiresAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* API access link */}
            <div style={{ display: "flex", gap: "8px" }}>
                <a href="/marketplace" style={{ textDecoration: "none", flex: 1 }}>
                    <button style={{
                        width: "100%", padding: "8px", background: "#165DFC", color: "#FFFFFF",
                        border: "none", borderRadius: "6px", fontSize: "0.8rem",
                        fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0047ca"}
                    onMouseLeave={e => e.currentTarget.style.background = "#165DFC"}
                    >
                        <ExternalLink size={14} /> View Marketplace
                    </button>
                </a>
                <a href="/docs" style={{ textDecoration: "none", flex: 1 }}>
                    <button style={{
                        width: "100%", padding: "8px", background: "#FFFFFF", color: "#111111",
                        border: "1px solid #E8E8E8", borderRadius: "6px", fontSize: "0.8rem",
                        fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#E8E8E8"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E8E8E8"; }}
                    >
                        API Docs
                    </button>
                </a>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(false);

    const handleConnect = () => {
        const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
        if (injectedConnector) {
            connect({ connector: injectedConnector });
        }
    };

    const loadRentals = () => {
        if (!isConnected || !address) return;
        setLoading(true);
        fetch(`/api/rentals/my?wallet=${address}`)
            .then(r => r.json())
            .then(data => setRentals(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRentals();
    }, [isConnected, address]);

    if (!isConnected) {
        return (
            <div style={{ background: "#FAFAFA", minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px",
                    padding: "48px", maxWidth: "440px", width: "100%", textAlign: "center",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.02)"
                }}>
                    <div style={{
                        width: "48px", height: "48px", background: "rgba(204,255,0,0.1)",
                        borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 24px"
                    }}>
                        <Server size={24} color="#111111" />
                    </div>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111111", marginBottom: "12px", fontFamily: "Inter, sans-serif" }}>
                        Connect Your Wallet
                    </h1>
                    <p style={{ fontSize: "0.9rem", color: "#6B6B6B", marginBottom: "32px", lineHeight: 1.6 }}>
                        Connect your EVM wallet to view your active prediction agents, rental codes, and node status on Robinhood Chain.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                            onClick={handleConnect}
                            style={{
                                background: "#CCFF00",
                                color: "#000000",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.15s",
                                boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <Wallet size={16} />
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#FAFAFA", minHeight: "calc(100vh - 56px)" }}>
            {/* Header */}
            <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <Activity size={14} color="#0A7C4E" />
                                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0A7C4E", textTransform: "uppercase" }}>Connected</span>
                            </div>
                            <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
                                My Dashboard
                            </h1>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "0.7rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px", fontWeight: 600 }}>Wallet Address</p>
                            <p style={{ fontSize: "0.85rem", color: "#111111", fontFamily: "monospace", margin: 0 }}>
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px" }}>

                {/* Active Rentals */}
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111111", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <Terminal size={16} color="#6B6B6B" /> Active Agents
                            <span style={{ fontSize: "0.75rem", background: "#FAFAFA", color: "#6B6B6B", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                                {loading ? "..." : rentals.length}
                            </span>
                        </h2>
                        <button onClick={loadRentals} style={{
                            background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "6px",
                            padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                            fontSize: "0.8rem", color: "#6B6B6B", transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8E8E8"; e.currentTarget.style.color = "#111111"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E8E8"; e.currentTarget.style.color = "#6B6B6B"; }}
                        >
                            <RefreshCw size={13} /> Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "80px", color: "#9CA3AF" }}>Loading your agents...</div>
                    ) : rentals.length === 0 ? (
                        <div style={{
                            background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px",
                            padding: "56px 32px", textAlign: "center"
                        }}>
                            <Database size={32} color="#E8E8E8" style={{ margin: "0 auto 16px", display: "block" }} />
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "8px" }}>
                                No active agents
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "#6B6B6B", marginBottom: "24px", maxWidth: "360px", margin: "0 auto 24px" }}>
                                Deploy an agent from the marketplace to start automating prediction strategies.
                            </p>
                            <a href="/marketplace" style={{ textDecoration: "none" }}>
                                <button style={{
                                    background: "#CCFF00", color: "#000000", border: "none",
                                    padding: "10px 24px", borderRadius: "6px", fontSize: "0.9rem",
                                    fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                                    boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#bfe600"}
                                onMouseLeave={e => e.currentTarget.style.background = "#CCFF00"}
                                >
                                    Browse Marketplace
                                </button>
                            </a>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                            {rentals.map(rental => (
                                <RentalCard key={rental.id} rental={rental} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Protocol info strip */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center" }}>
                        <div>
                            <div style={{ fontSize: "0.72rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Escrow Contract</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111111" }}>USDC on Robinhood Chain L2</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.72rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Platform Fee</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111111" }}>2% per rental</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.72rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Owner Payout</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0A7C4E" }}>98% in USDC</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
