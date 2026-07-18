"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Play } from "lucide-react";
import Link from "next/link";
import type { Agent } from "@prisma/client";
import { RentModal } from "@/components/RentModal";

interface AgentCardProps {
    agent: Agent;
    compact?: boolean;
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
    const [upvotes, setUpvotes] = useState(agent.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // 24h Launch Countdown timer for newly-submitted agents
    const [launchTimeLeft, setLaunchTimeLeft] = useState("");
    const [isLaunchActive, setIsLaunchActive] = useState(false);

    useEffect(() => {
        if (!agent.createdAt) return;
        const createdTime = new Date(agent.createdAt).getTime();
        const launchEndTime = createdTime + 24 * 60 * 60 * 1000;

        const updateLaunchTimer = () => {
            const now = Date.now();
            const diffMs = launchEndTime - now;
            if (diffMs <= 0) {
                setIsLaunchActive(false);
                return;
            }
            setIsLaunchActive(true);
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const format = (n: number) => String(n).padStart(2, "0");
            setLaunchTimeLeft(`${format(hours)}h ${format(mins)}m`);
        };

        updateLaunchTimer();
        const interval = setInterval(updateLaunchTimer, 30000);
        return () => clearInterval(interval);
    }, [agent.createdAt]);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasUpvoted) {
            setUpvotes((prev) => prev - 1);
            setHasUpvoted(false);
            return;
        }
        setUpvotes((prev) => prev + 1);
        setHasUpvoted(true);
        try {
            await fetch(`/api/agents/${agent.id}/upvote`, { method: "POST" });
        } catch {
            setUpvotes((prev) => prev - 1);
            setHasUpvoted(false);
        }
    };

    const handleRent = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (agent.id.startsWith("example-")) {
            alert("This is an example agent. Real deployments are disabled for this demo.");
            return;
        }
        setShowModal(true);
    };

    return (
        <>
        <div className="agent-card" style={{ 
            display: "flex", 
            padding: compact ? "14px 18px" : "24px", 
            gap: compact ? "16px" : "24px", 
            background: "#FFFFFF", 
            border: "1px solid #E8E8E8",
            borderRadius: "12px",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            transition: "all 0.2s ease",
            minWidth: compact ? "320px" : "auto",
            maxWidth: compact ? "400px" : "auto"
        }}
        onMouseEnter={(e) => { 
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(204,255,0,0.12)"; 
            e.currentTarget.style.borderColor = "#CCFF00"; 
        }}
        onMouseLeave={(e) => { 
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"; 
            e.currentTarget.style.borderColor = "#E8E8E8"; 
        }}
        >
            {/* Logo */}
            <div
                style={{
                    width: compact ? "50px" : "80px",
                    height: compact ? "50px" : "80px",
                    borderRadius: compact ? "10px" : "14px",
                    background: "linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "1px solid #E8E8E8",
                }}
            >
                <span style={{ fontSize: compact ? "1.6rem" : "2.5rem", fontWeight: 800, color: "#165DFC", fontFamily: "Outfit, sans-serif" }}>
                    {agent.name.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Content */}
            <div className="agent-card-content" style={{ flex: 1, display: "flex", flexDirection: "column", gap: compact ? "4px" : "8px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: compact ? "1.05rem" : "1.2rem", fontWeight: 700, margin: 0, color: "#000000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Link href={`/marketplace/${agent.id}`} style={{ color: "inherit", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "#165DFC"} onMouseLeave={e => e.currentTarget.style.color = "inherit"}>
                            {agent.name}
                        </Link>
                    </h3>
                    {!compact && agent.id.startsWith("example-") && (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, background: "#FAFAFA", color: "#9CA3AF", padding: "2px 6px", borderRadius: "4px", border: "1px solid #E8E8E8" }}>EXAMPLE</span>
                    )}
                    {agent.status === "live" ? (
                        <span style={{ fontSize: compact ? "0.6rem" : "0.7rem", fontWeight: 700, color: "#0A7C4E", background: "rgba(10,124,78,0.1)", padding: compact ? "1px 6px" : "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>Live</span>
                    ) : (
                        <span style={{ fontSize: compact ? "0.6rem" : "0.7rem", fontWeight: 700, color: "#DA552F", background: "rgba(218,85,47,0.1)", padding: compact ? "1px 6px" : "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>Beta</span>
                    )}
                    {isLaunchActive && (
                        <span style={{ 
                            fontSize: compact ? "0.6rem" : "0.7rem", 
                            fontWeight: 700, 
                            color: "#165DFC", 
                            background: "rgba(22,93,252,0.08)", 
                            padding: compact ? "1px 6px" : "2px 8px", 
                            borderRadius: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                        }}>
                            🚀 Launch ends: {launchTimeLeft}
                        </span>
                    )}
                </div>

                <p style={{ 
                    margin: 0, 
                    fontSize: compact ? "0.85rem" : "1rem", 
                    color: "#6B6B6B", 
                    lineHeight: 1.4, 
                    fontWeight: 400,
                    whiteSpace: compact ? "nowrap" : "normal",
                    overflow: compact ? "hidden" : "visible",
                    textOverflow: compact ? "ellipsis" : "clip"
                }}>
                    {agent.tagline}
                </p>

                <div style={{ display: "flex", gap: "6px", marginTop: compact ? "2px" : "4px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: compact ? "0.75rem" : "0.85rem", color: "#165DFC", fontWeight: 600, background: "rgba(22,93,252,0.08)", padding: compact ? "2px 6px" : "4px 10px", borderRadius: "6px" }}>
                        {agent.pricePerDay} USDC/day
                    </span>
                    {!compact && (
                        <>
                            <span style={{ color: "#E8E8E8" }}>•</span>
                            {agent.tags.slice(0, 3).map((tag) => (
                                <span key={tag} style={{ fontSize: "0.85rem", color: "#6B6B6B", background: "#FFFFFF", padding: "4px 10px", borderRadius: "6px", border: "1px solid #E8E8E8" }}>
                                    {tag}
                                </span>
                            ))}
                        </>
                    )}
                    {agent.roi > 0 && (
                        <>
                            <span style={{ color: "#E8E8E8" }}>•</span>
                            <span style={{ fontSize: compact ? "0.75rem" : "0.85rem", color: "#0A7C4E", fontWeight: 600 }}>
                                +{agent.roi}% ROI
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions: Upvote & Install */}
            <div className="agent-card-actions" style={{ display: "flex", alignItems: "center", gap: compact ? "10px" : "24px", flexShrink: 0, marginLeft: compact ? "8px" : "16px" }}>
                
                {/* Upvote Column */}
                <button
                    onClick={handleUpvote}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: compact ? "44px" : "60px",
                        height: compact ? "44px" : "60px",
                        borderRadius: "8px",
                        border: `1px solid ${hasUpvoted ? "#165DFC" : "#E8E8E8"}`,
                        background: hasUpvoted ? "rgba(22,93,252,0.05)" : "#FFFFFF",
                        color: hasUpvoted ? "#165DFC" : "#000000",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        if (!hasUpvoted) e.currentTarget.style.borderColor = "#9CA3AF";
                    }}
                    onMouseLeave={(e) => {
                        if (!hasUpvoted) e.currentTarget.style.borderColor = "#E8E8E8";
                    }}
                >
                    <ArrowUp size={compact ? 16 : 20} strokeWidth={hasUpvoted ? 3 : 2} color={hasUpvoted ? "#165DFC" : "#000000"} />
                    <span style={{ fontSize: compact ? "0.75rem" : "0.85rem", fontWeight: 700, marginTop: compact ? "1px" : "4px", color: hasUpvoted ? "#165DFC" : "#000000" }}>
                        {upvotes}
                    </span>
                </button>

                {/* Install & Run */}
                <button
                    onClick={handleRent}
                    style={{
                        background: "#CCFF00",
                        color: "#000000",
                        border: "none",
                        borderRadius: "8px",
                        padding: compact ? "10px 14px" : "12px 24px",
                        fontSize: compact ? "0.85rem" : "0.95rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                    <Play size={compact ? 12 : 16} fill="currentColor" />
                    {compact ? "Run" : "Install & Run"}
                </button>
            </div>
        </div>
        {showModal && <RentModal agent={agent} onClose={() => setShowModal(false)} />}
        </>
    );
}
