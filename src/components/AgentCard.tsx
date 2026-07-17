"use client";

import { useState } from "react";
import { ArrowUp, Play } from "lucide-react";
import type { Agent } from "@prisma/client";
import { RentModal } from "@/components/RentModal";

interface AgentCardProps {
    agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
    const [upvotes, setUpvotes] = useState(agent.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
            padding: "24px", 
            gap: "24px", 
            background: "#FFFFFF", 
            border: "1px solid #E8E8E8",
            borderRadius: "12px",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            transition: "all 0.2s ease"
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
                    width: "80px",
                    height: "80px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "1px solid #E8E8E8",
                }}
            >
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#165DFC", fontFamily: "Outfit, sans-serif" }}>
                    {agent.name.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Content */}
            <div className="agent-card-content" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#000000" }}>
                        {agent.name}
                    </h3>
                    {agent.id.startsWith("example-") && (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, background: "#FAFAFA", color: "#9CA3AF", padding: "2px 6px", borderRadius: "4px", border: "1px solid #E8E8E8" }}>EXAMPLE</span>
                    )}
                    {agent.status === "live" ? (
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0A7C4E", background: "rgba(10,124,78,0.1)", padding: "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>Live</span>
                    ) : (
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#DA552F", background: "rgba(218,85,47,0.1)", padding: "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>Beta</span>
                    )}
                </div>

                <p style={{ margin: 0, fontSize: "1rem", color: "#6B6B6B", lineHeight: 1.5, fontWeight: 400 }}>
                    {agent.tagline}
                </p>

                <div style={{ display: "flex", gap: "8px", marginTop: "4px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.85rem", color: "#165DFC", fontWeight: 600, background: "rgba(22,93,252,0.08)", padding: "4px 10px", borderRadius: "6px" }}>
                        {agent.pricePerDay} USDC/day
                    </span>
                    <span style={{ color: "#E8E8E8" }}>•</span>
                    {agent.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ fontSize: "0.85rem", color: "#6B6B6B", background: "#FFFFFF", padding: "4px 10px", borderRadius: "6px", border: "1px solid #E8E8E8" }}>
                            {tag}
                        </span>
                    ))}
                    {agent.roi > 0 && (
                        <>
                            <span style={{ color: "#E8E8E8" }}>•</span>
                            <span style={{ fontSize: "0.85rem", color: "#0A7C4E", fontWeight: 600 }}>
                                +{agent.roi}% ROI
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions: Upvote & Install */}
            <div className="agent-card-actions" style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0, marginLeft: "16px" }}>
                
                {/* Upvote Column */}
                <button
                    onClick={handleUpvote}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "60px",
                        height: "60px",
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
                    <ArrowUp size={20} strokeWidth={hasUpvoted ? 3 : 2} color={hasUpvoted ? "#165DFC" : "#000000"} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "4px", color: hasUpvoted ? "#165DFC" : "#000000" }}>
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
                        padding: "12px 24px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                    <Play size={16} fill="currentColor" />
                    Install & Run
                </button>
            </div>
        </div>
        {showModal && <RentModal agent={agent} onClose={() => setShowModal(false)} />}
        </>
    );
}
