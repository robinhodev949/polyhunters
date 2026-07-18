"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Prediction Market", "Crypto", "Politics", "Sports", "DeFi", "Research"];

export default function MarketplacePage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const [sortBy, setSortBy] = useState<"upvotes" | "roi" | "price_asc" | "price_desc">("upvotes");
    const [statusFilter, setStatusFilter] = useState<"all" | "live" | "beta">("all");
    const [networkFilter, setNetworkFilter] = useState<"all" | "polymarket" | "robinhood">("all");

    const selectStyle: React.CSSProperties = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #E8E8E8",
        background: "#FFFFFF",
        color: "#111111",
        fontSize: "0.85rem",
        fontWeight: 500,
        outline: "none",
        cursor: "pointer",
        transition: "border-color 0.15s",
    };

    useEffect(() => {
        async function loadAgents() {
            try {
                const res = await fetch("/api/agents");
                if (res.ok) {
                    const data = await res.json();
                    setAgents(data);
                } else {
                    setAgents([]);
                }
            } catch (err) {
                console.error(err);
                setAgents([]);
            } finally {
                setLoading(false);
            }
        }
        loadAgents();
    }, []);

    const processedAgents = agents
        .filter(agent => {
            const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  agent.tagline.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || agent.tags.includes(activeCategory);
            
            const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
            
            const matchesNetwork = networkFilter === "all" || 
                (networkFilter === "polymarket" && agent.marketSourceIds.includes("polymarket")) ||
                (networkFilter === "robinhood" && agent.marketSourceIds.includes("robinhood"));
                
            return matchesSearch && matchesCategory && matchesStatus && matchesNetwork;
        })
        .sort((a, b) => {
            if (sortBy === "upvotes") {
                return b.upvotes - a.upvotes;
            }
            if (sortBy === "roi") {
                return b.roi - a.roi;
            }
            if (sortBy === "price_asc") {
                return a.pricePerDay - b.pricePerDay;
            }
            if (sortBy === "price_desc") {
                return b.pricePerDay - a.pricePerDay;
            }
            return 0;
        });

    return (
        <div style={{ background: "#FAFAFA", minHeight: "calc(100vh - 56px)" }}>
            
            {/* Header Section */}
            <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8", padding: "48px 32px 32px" }}>
                <div style={{ maxWidth: "860px", margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111111", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                        AI Agent Feed
                    </h1>
                    <p style={{ fontSize: "1.05rem", color: "#6B6B6B", marginBottom: "32px", lineHeight: 1.6 }}>
                        Discover and deploy prediction market algorithms. Rent instantly using USDC on Robinhood Chain L2.
                    </p>

                    {/* Filters */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    fontWeight: activeCategory === cat ? 600 : 500,
                                    cursor: "pointer",
                                    border: "1px solid",
                                    transition: "all 0.15s",
                                    backgroundColor: activeCategory === cat ? "#165DFC" : "#FFFFFF",
                                    borderColor: activeCategory === cat ? "#165DFC" : "#E8E8E8",
                                    color: activeCategory === cat ? "#FFFFFF" : "#6B6B6B",
                                    boxShadow: activeCategory === cat ? "0 2px 8px rgba(22,93,252,0.15)" : "none"
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 32px" }}>
                
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: "24px", 
                    flexWrap: "wrap", 
                    gap: "16px",
                    width: "100%"
                }}>
                    <span style={{ fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 500 }}>
                        {processedAgents.length} agents {activeCategory !== "All" ? `in ${activeCategory}` : "found"}
                    </span>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        {/* Search input */}
                        <div className="market-search" style={{ position: "relative", width: "220px" }}>
                            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ 
                                    width: "100%", padding: "8px 12px 8px 34px", 
                                    borderRadius: "8px", border: "1px solid #E8E8E8", 
                                    outline: "none", fontSize: "0.85rem",
                                    transition: "all 0.15s"
                                }} 
                                onFocus={e => e.currentTarget.style.borderColor = "#CCFF00"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E8E8E8"}
                            />
                        </div>

                        {/* Status Filter */}
                        <select 
                            value={statusFilter}
                            onChange={(e: any) => setStatusFilter(e.target.value)}
                            style={selectStyle}
                            onFocus={e => e.currentTarget.style.borderColor = "#CCFF00"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E8E8E8"}
                        >
                            <option value="all">All Statuses</option>
                            <option value="live">Live Only</option>
                            <option value="beta">Beta Only</option>
                        </select>

                        {/* Network Filter */}
                        <select 
                            value={networkFilter}
                            onChange={(e: any) => setNetworkFilter(e.target.value)}
                            style={selectStyle}
                            onFocus={e => e.currentTarget.style.borderColor = "#CCFF00"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E8E8E8"}
                        >
                            <option value="all">All Networks</option>
                            <option value="polymarket">Polymarket</option>
                            <option value="robinhood">Robinhood Chain</option>
                        </select>

                        {/* Sort By */}
                        <select 
                            value={sortBy}
                            onChange={(e: any) => setSortBy(e.target.value)}
                            style={selectStyle}
                            onFocus={e => e.currentTarget.style.borderColor = "#CCFF00"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E8E8E8"}
                        >
                            <option value="upvotes">Sort: Upvotes</option>
                            <option value="roi">Sort: ROI</option>
                            <option value="price_asc">Sort: Price (Low to High)</option>
                            <option value="price_desc">Sort: Price (High to Low)</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px" }}>
                        <div className="spinner" style={{ border: "3px solid #E8E8E8", borderTopColor: "#165DFC", borderRadius: "50%", width: "24px", height: "24px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                    </div>
                ) : agents.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "80px 40px",
                        background: "#FFFFFF",
                        borderRadius: "16px",
                        border: "1px solid #E8E8E8",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "600px",
                        margin: "40px auto 0",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                    }}>
                        <div style={{ marginBottom: "32px" }}>
                            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 50 L50 20 L80 50 L50 80 Z" stroke="#E8E8E8" strokeWidth="1" />
                                <path d="M50 20 L50 80" stroke="#E8E8E8" strokeWidth="1" />
                                <path d="M20 50 L80 50" stroke="#E8E8E8" strokeWidth="1" />
                                <circle cx="20" cy="50" r="3" fill="#E8E8E8" />
                                <circle cx="50" cy="20" r="3" fill="#E8E8E8" />
                                <circle cx="80" cy="50" r="3" fill="#E8E8E8" />
                                <circle cx="50" cy="80" r="3" fill="#E8E8E8" />
                                <circle cx="50" cy="50" r="4" fill="#165DFC" />
                                <polygon points="36,36 46,32 56,36 60,46 56,56 46,60 36,56 32,46" fill="none" stroke="#CCFF00" strokeWidth="3" />
                                <line x1="53" y1="53" x2="68" y2="68" stroke="#CCFF00" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                            No agents listed yet — be the first.
                        </h2>
                        <p style={{ fontSize: "1rem", color: "#6B6B6B", margin: "0 0 32px 0", lineHeight: 1.6 }}>
                            PolyHunt is a fresh marketplace. Build an agent and earn USDC, or check back soon for what the community ships.
                        </p>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                            <Link href="/submit" style={{ textDecoration: "none" }}>
                                <button style={{
                                    background: "#CCFF00", color: "#000000", border: "1px solid #CCFF00",
                                    padding: "12px 24px", borderRadius: "8px", fontSize: "0.95rem",
                                    fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
                                    transition: "all 0.15s", boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#bfe600"; e.currentTarget.style.borderColor = "#bfe600"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#CCFF00"; e.currentTarget.style.borderColor = "#CCFF00"; }}
                                >
                                    Submit Your Agent
                                </button>
                            </Link>
                            <Link href="/docs" style={{ textDecoration: "none" }}>
                                <button style={{
                                    background: "#FFFFFF", color: "#111111", border: "1px solid #E8E8E8",
                                    padding: "12px 24px", borderRadius: "8px", fontSize: "0.95rem",
                                    fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#FAFAFA"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; }}
                                >
                                    How Renting Works
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : processedAgents.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E8E8E8" }}>
                        <p style={{ color: "#6B6B6B", fontSize: "1rem" }}>No agents found matching your criteria.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {processedAgents.map(agent => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}
