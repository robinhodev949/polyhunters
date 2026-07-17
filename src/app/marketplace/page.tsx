"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "@/components/AgentCard";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Prediction Market", "Crypto", "Politics", "Sports", "DeFi", "Research"];

const EXAMPLE_AGENTS: any[] = [
    {
        id: "example-alpha-oracle",
        name: "AlphaOracle",
        tagline: "GPT-4 political sentiment agent for Polymarket prediction markets",
        description: "Ingests Twitter/X, Reddit, and news in real-time.",
        pricePerDay: 8,
        status: "live",
        roi: 34.7,
        tags: ["Politics", "Prediction Market"],
        upvotes: 412,
        marketSourceIds: ["polymarket"]
    },
    {
        id: "example-crypto-hawk",
        name: "CryptoHawk",
        tagline: "On-chain signal aggregator trained on 18 months of prediction market crypto data",
        description: "Analyzes on-chain velocity and exchange flows.",
        pricePerDay: 12,
        status: "live",
        roi: 28.3,
        tags: ["Crypto", "DeFi"],
        upvotes: 287,
        marketSourceIds: ["polymarket"]
    },
    {
        id: "example-sports-oracle",
        name: "SportsOracle",
        tagline: "ML model trained on 5 years of sports outcomes for prediction markets",
        description: "Evaluates player stats, weather, and injury reports.",
        pricePerDay: 6,
        status: "beta",
        roi: 19.1,
        tags: ["Sports", "Prediction Market"],
        upvotes: 134,
        marketSourceIds: ["polymarket"]
    }
];

export default function MarketplacePage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        async function loadAgents() {
            try {
                const res = await fetch("/api/agents");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setAgents(data);
                    } else {
                        setAgents(EXAMPLE_AGENTS);
                    }
                } else {
                    setAgents(EXAMPLE_AGENTS);
                }
            } catch (err) {
                console.error(err);
                setAgents(EXAMPLE_AGENTS);
            } finally {
                setLoading(false);
            }
        }
        loadAgents();
    }, []);

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              agent.tagline.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || agent.tags.includes(activeCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-bg-secondary min-h-[calc(100vh-56px)]">
            
            {/* Header Section */}
            <div className="bg-bg-secondary border-b border-border py-12 px-8">
                <div className="max-w-[860px] mx-auto">
                    <h1 className="text-[2rem] font-extrabold text-text-primary mb-3 tracking-tight">
                        AI Agent Feed
                    </h1>
                    <p className="text-[1.05rem] text-text-secondary mb-8 leading-relaxed">
                        Discover and deploy prediction market algorithms. Rent instantly using USDC on Robinhood Chain L2.
                    </p>

                    {/* Filters */}
                    <div className="flex gap-2.5 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-[0.85rem] transition-all duration-150 border cursor-pointer ${
                                    activeCategory === cat 
                                        ? "bg-brand border-brand text-white shadow-[0_2px_8px_rgba(22,93,252,0.15)] font-semibold" 
                                        : "bg-bg-secondary border-border text-text-secondary font-medium hover:border-text-muted"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="max-w-[860px] mx-auto py-12 px-8">
                
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <span className="text-[0.9rem] text-text-secondary font-medium">
                        {filteredAgents.length} agents {activeCategory !== "All" ? `in ${activeCategory}` : "found"}
                    </span>
                    <div className="market-search relative w-[260px]">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search agents..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border outline-none text-[0.9rem] transition-colors duration-200 focus:border-brand"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="spinner border-2 border-border border-t-brand rounded-full w-6 h-6 animate-spin mx-auto"></div>
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <div className="text-center py-20 bg-bg-secondary rounded-xl border border-border">
                        <p className="text-text-secondary text-[1rem]">No agents found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredAgents.map(agent => (
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
