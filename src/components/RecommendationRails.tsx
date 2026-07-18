"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "@/components/AgentCard";
import { Zap, Target, Heart, Trophy, Cpu } from "lucide-react";

interface RecommendationRailsProps {
    wallet?: string | null;
    similarTo?: string | null;
    market?: string;
}

export function RecommendationRails({ wallet, similarTo, market = "polymarket" }: RecommendationRailsProps) {
    const [rails, setRails] = useState<{
        trending: any[];
        matching: any[];
        similar: any[];
        performers: any[];
    }>({
        trending: [],
        matching: [],
        similar: [],
        performers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let url = `/api/agents/recommendations?market=${market}`;
        if (wallet) url += `&wallet=${wallet}`;
        if (similarTo) url += `&similarTo=${similarTo}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setRails({
                        trending: data.trending || [],
                        matching: data.matching || [],
                        similar: data.similar || [],
                        performers: data.performers || []
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load recommendations:", err);
                setLoading(false);
            });
    }, [wallet, similarTo, market]);

    if (loading) {
        return (
            <div style={{ padding: "20px 0", fontSize: "0.9rem", color: "#6B6B6B", textAlign: "center" }}>
                Analyzing market signals and matching interests...
            </div>
        );
    }

    const railContainerStyle: React.CSSProperties = {
        display: "flex",
        gap: "16px",
        overflowX: "auto",
        padding: "8px 4px 20px 4px",
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none", // Hide default scrollbar for clean UI
        msOverflowStyle: "none"
    };

    const headerStyle: React.CSSProperties = {
        fontSize: "1.1rem",
        fontWeight: 800,
        margin: "0 0 12px 0",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#111111",
        letterSpacing: "-0.01em"
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "40px" }}>
            
            {/* 1. Similar Agents Rail */}
            {rails.similar.length > 0 && (
                <div>
                    <h4 style={headerStyle}>
                        <Cpu size={16} color="#165DFC" /> Similar Strategy Models
                    </h4>
                    <div style={railContainerStyle} className="hide-scrollbar">
                        {rails.similar.map(agent => (
                            <div key={agent.id} style={{ flexShrink: 0, scrollSnapAlign: "start" }}>
                                <AgentCard agent={agent} compact={true} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Trending Rail */}
            {rails.trending.length > 0 && (
                <div>
                    <h4 style={headerStyle}>
                        <Zap size={16} color="#CCFF00" fill="#CCFF00" /> Trending This Week
                    </h4>
                    <div style={railContainerStyle} className="hide-scrollbar">
                        {rails.trending.map(agent => (
                            <div key={agent.id} style={{ flexShrink: 0, scrollSnapAlign: "start" }}>
                                <AgentCard agent={agent} compact={true} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Matching Interests Rail */}
            {rails.matching.length > 0 && (
                <div>
                    <h4 style={headerStyle}>
                        <Target size={16} color="#165DFC" /> Matching Your Interests
                    </h4>
                    <div style={railContainerStyle} className="hide-scrollbar">
                        {rails.matching.map(agent => (
                            <div key={agent.id} style={{ flexShrink: 0, scrollSnapAlign: "start" }}>
                                <AgentCard agent={agent} compact={true} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Top Performers Rail */}
            {rails.performers.length > 0 && (
                <div>
                    <h4 style={headerStyle}>
                        <Trophy size={16} color="#0A7C4E" /> Top Performers in {market.toUpperCase()}
                    </h4>
                    <div style={railContainerStyle} className="hide-scrollbar">
                        {rails.performers.map(agent => (
                            <div key={agent.id} style={{ flexShrink: 0, scrollSnapAlign: "start" }}>
                                <AgentCard agent={agent} compact={true} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Injected clean scrollbar style */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
}
