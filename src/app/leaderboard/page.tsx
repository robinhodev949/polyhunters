"use client";

import { useState, useEffect } from "react";
import { Trophy, TrendingUp, Users, Crown, Medal, Award, User as UserIcon } from "lucide-react";
import { AgentCard } from "@/components/AgentCard";
import type { Agent } from "@prisma/client";
import Link from "next/link";

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<"agents" | "hunters">("agents");
    const [agents, setAgents] = useState<Agent[]>([]);
    const [hunters, setHunters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (activeTab === "agents") {
            fetch("/api/leaderboard/agents")
                .then(res => res.json())
                .then(data => {
                    setAgents(data.agents || []);
                    setLoading(false);
                });
        } else {
            fetch("/api/leaderboard/hunters")
                .then(res => res.json())
                .then(data => {
                    setHunters(data.hunters || []);
                    setLoading(false);
                });
        }
    }, [activeTab]);

    return (
        <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 24px" }}>
            <div style={{ maxWidth: "860px", margin: "0 auto" }}>
                
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "#FEF3C7", marginBottom: "16px" }}>
                        <Trophy size={32} color="#D97706" />
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0, color: "#111111", letterSpacing: "-0.02em" }}>
                        The Leaderboard
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "#6B6B6B", marginTop: "12px", maxWidth: "500px", margin: "12px auto 0" }}>
                        Discover the most profitable algorithms and the elite Polyhunters who found them.
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                    <div style={{ display: "flex", background: "#FFFFFF", padding: "6px", borderRadius: "12px", border: "1px solid #E8E8E8", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                        <button
                            onClick={() => setActiveTab("agents")}
                            style={{
                                padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600, borderRadius: "8px", border: "none", cursor: "pointer", transition: "all 0.15s",
                                display: "flex", alignItems: "center", gap: "8px",
                                background: activeTab === "agents" ? "#165DFC" : "transparent",
                                color: activeTab === "agents" ? "#FFFFFF" : "#6B6B6B"
                            }}
                        >
                            <TrendingUp size={18} />
                            Top Agents
                        </button>
                        <button
                            onClick={() => setActiveTab("hunters")}
                            style={{
                                padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600, borderRadius: "8px", border: "none", cursor: "pointer", transition: "all 0.15s",
                                display: "flex", alignItems: "center", gap: "8px",
                                background: activeTab === "hunters" ? "#165DFC" : "transparent",
                                color: activeTab === "hunters" ? "#FFFFFF" : "#6B6B6B"
                            }}
                        >
                            <Users size={18} />
                            Top Hunters
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px" }}>
                        <div style={{ border: "3px solid #E8E8E8", borderTopColor: "#165DFC", borderRadius: "50%", width: "32px", height: "32px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                    </div>
                ) : activeTab === "agents" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {agents.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E8E8E8", color: "#6B6B6B" }}>
                                No agents currently ranked.
                            </div>
                        ) : (
                            agents.map((agent, index) => (
                                <div key={agent.id} style={{ position: "relative" }}>
                                    <div style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
                                        {index === 0 && <Crown size={32} color="#FBBF24" fill="#FBBF24" style={{ filter: "drop-shadow(0 2px 4px rgba(251,191,36,0.3))" }} />}
                                        {index === 1 && <Medal size={28} color="#9CA3AF" fill="#E8E8E8" style={{ filter: "drop-shadow(0 2px 4px rgba(156,163,175,0.3))" }} />}
                                        {index === 2 && <Award size={28} color="#D97706" fill="#FDE68A" style={{ filter: "drop-shadow(0 2px 4px rgba(217,119,6,0.3))" }} />}
                                        {index > 2 && <div style={{ width: "24px", height: "24px", background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#9CA3AF", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>{index + 1}</div>}
                                    </div>
                                    <AgentCard agent={agent} />
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E8E8E8", overflow: "hidden" }}>
                        {hunters.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px", color: "#6B6B6B" }}>
                                No hunters have discovered agents yet.
                            </div>
                        ) : (
                            hunters.map((hunter, index) => (
                                <Link href={`/profile/${hunter.wallet}`} key={hunter.wallet} style={{ textDecoration: "none" }}>
                                    <div style={{ 
                                        display: "flex", alignItems: "center", padding: "20px 24px", 
                                        borderBottom: index !== hunters.length - 1 ? "1px solid #E8E8E8" : "none",
                                        transition: "background 0.15s", cursor: "pointer"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <div style={{ width: "40px", fontSize: "1.2rem", fontWeight: 700, color: index < 3 ? "#111111" : "#9CA3AF" }}>
                                            #{index + 1}
                                        </div>
                                        
                                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FAFAFA", overflow: "hidden", marginRight: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {hunter.avatarUrl ? (
                                                <img src={hunter.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <UserIcon size={24} color="#E8E8E8" />
                                            )}
                                        </div>
                                        
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111111" }}>
                                                {hunter.username || "Anonymous Hunter"}
                                            </h3>
                                            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6B6B6B", fontFamily: "monospace" }}>
                                                {hunter.wallet.slice(0, 6)}...{hunter.wallet.slice(-4)}
                                            </p>
                                        </div>
                                        
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#165DFC" }}>
                                                {hunter.score.toFixed(1)} <span style={{ fontSize: "0.8rem", color: "#6B6B6B", fontWeight: 500 }}>SCORE</span>
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "#9CA3AF", marginTop: "2px" }}>
                                                {hunter.huntedCount} Agents Found
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}
