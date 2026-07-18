"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { AgentCard } from "@/components/AgentCard";
import { RecommendationRails } from "@/components/RecommendationRails";
import { Search, FolderOpen } from "lucide-react";

const CATEGORIES = ["All", "Prediction Market", "Crypto", "Politics", "Sports", "DeFi", "Research"];

const CURATED_COLLECTIONS = [
    { id: "defi-bots", name: "DeFi Yield Bots", tags: ["DeFi", "Crypto"], description: "Maximize liquidity pool fees and interest rates." },
    { id: "nlp-oracles", name: "Sentiment & News Oracles", tags: ["Politics", "Research"], description: "Trade on political outcomes and current events." },
    { id: "sports-forecasters", name: "Sports Analytics Forecasters", tags: ["Sports", "Research"], description: "Predict match margins, scoring volumes, and stats." }
];

function DailyCycleTimer() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() + 1,
                0, 0, 0, 0
            ));
            const diffMs = tomorrow.getTime() - now.getTime();
            
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

            const format = (n: number) => String(n).padStart(2, "0");
            setTimeLeft(`${format(hours)}h ${format(mins)}m ${format(secs)}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            background: "rgba(22,93,252,0.04)", border: "1px solid rgba(22,93,252,0.12)",
            padding: "8px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700,
            color: "#165DFC", display: "inline-flex", alignItems: "center", gap: "6px"
        }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Cycle Resets In: <span style={{ fontFamily: "monospace" }}>{timeLeft}</span>
        </div>
    );
}

function CategoryPolygonIcon({ category, active }: { category: string; active: boolean }) {
    const color = active ? "#CCFF00" : "#165DFC";
    
    // SVG points mappings for low-poly geometry structures
    let points = "12,4 20,8 20,16 12,20 4,16 4,8"; // Hexagon for default/All
    if (category === "Prediction Market") {
        points = "12,4 20,18 4,18"; // Triangle
    } else if (category === "Crypto") {
        points = "12,4 20,12 12,20 4,12"; // Rhombus/Diamond
    } else if (category === "Politics") {
        points = "12,4 20,10 17,19 7,19 4,10"; // Pentagon
    } else if (category === "Sports") {
        points = "12,4 18,6 20,12 18,18 12,20 6,18 4,12 6,6"; // Octagon
    } else if (category === "DeFi") {
        points = "5,5 19,5 19,19 5,19"; // Square
    } else if (category === "Research") {
        points = "12,4 15,10 21,11 16,15 18,21 12,18 6,21 8,15 3,11 9,10"; // Star/Heptagon
    }

    return (
        <svg width="14" height="14" viewBox="0 0 24 24" style={{ overflow: "visible" }}>
            <polygon
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner" style={{ border: "3px solid #E8E8E8", borderTopColor: "#165DFC", borderRadius: "50%", width: "24px", height: "24px", animation: "spin 1s linear infinite" }}></div>
                <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
            </div>
        }>
            <MarketplaceContent />
        </Suspense>
    );
}

function MarketplaceContent() {
    const searchParams = useSearchParams();
    const similarTo = searchParams.get("similarTo");
    const { address } = useAccount();

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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
                        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
                            AI Agent Feed
                        </h1>
                        <DailyCycleTimer />
                    </div>
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
                                    boxShadow: activeCategory === cat ? "0 2px 8px rgba(22,93,252,0.15)" : "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                <CategoryPolygonIcon category={cat} active={activeCategory === cat} />
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 32px" }}>
                
                <RecommendationRails wallet={address} similarTo={similarTo} market={networkFilter === "all" ? "polymarket" : networkFilter} />

                {/* Curated Thematic Collections */}
                <div style={{ marginBottom: "40px" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 12px 0", color: "#111111", display: "flex", alignItems: "center", gap: "8px", letterSpacing: "-0.01em" }}>
                        <FolderOpen size={16} color="#165DFC" /> Curated Agent Collections
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                        {CURATED_COLLECTIONS.map(col => (
                            <div 
                                key={col.id}
                                onClick={() => {
                                    setActiveCategory("All");
                                    setSearchQuery(col.tags[0]);
                                }}
                                style={{
                                    background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "10px",
                                    padding: "16px", cursor: "pointer", transition: "all 0.15s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#CCFF00"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(204,255,0,0.06)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E8E8"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>{col.name}</div>
                                <div style={{ fontSize: "0.8rem", color: "#6B6B6B", lineHeight: 1.4, marginBottom: "8px" }}>{col.description}</div>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    {col.tags.map(t => (
                                        <span key={t} style={{ fontSize: "0.72rem", background: "rgba(22,93,252,0.06)", color: "#165DFC", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
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
