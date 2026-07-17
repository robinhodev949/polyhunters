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
        <div className="min-h-screen bg-bg-secondary py-10 px-6">
            <div className="max-w-[860px] mx-auto">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                        <Trophy size={32} className="text-amber-700" />
                    </div>
                    <h1 className="text-[2.5rem] font-extrabold m-0 text-text-primary tracking-tight">
                        The Leaderboard
                    </h1>
                    <p className="text-[1.1rem] text-text-secondary mt-3 max-w-[500px] mx-auto">
                        Discover the most profitable algorithms and the elite Polyhunters who found them.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex bg-bg-secondary p-1.5 rounded-xl border border-border shadow-sm">
                        <button
                            onClick={() => setActiveTab("agents")}
                            className={`px-6 py-2.5 text-[0.95rem] font-semibold rounded-lg border-none cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                                activeTab === "agents" ? "bg-brand text-white" : "bg-transparent text-text-secondary"
                            }`}
                        >
                            <TrendingUp size={18} />
                            Top Agents
                        </button>
                        <button
                            onClick={() => setActiveTab("hunters")}
                            className={`px-6 py-2.5 text-[0.95rem] font-semibold rounded-lg border-none cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                                activeTab === "hunters" ? "bg-brand text-white" : "bg-transparent text-text-secondary"
                            }`}
                        >
                            <Users size={18} />
                            Top Hunters
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="spinner border-3 border-border border-t-brand rounded-full w-8 h-8 animate-spin mx-auto"></div>
                    </div>
                ) : activeTab === "agents" ? (
                    <div className="flex flex-col gap-4">
                        {agents.length === 0 ? (
                            <div className="text-center py-15 bg-bg-secondary rounded-xl border border-border text-text-secondary">
                                No agents currently ranked.
                            </div>
                        ) : (
                            agents.map((agent, index) => (
                                <div key={agent.id} className="relative">
                                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-10">
                                        {index === 0 && <Crown size={32} className="text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]" />}
                                        {index === 1 && <Medal size={28} className="text-text-muted fill-bg-primary drop-shadow-[0_2px_4px_rgba(156,163,175,0.3)]" />}
                                        {index === 2 && <Award size={28} className="text-amber-700 fill-amber-100 drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)]" />}
                                        {index > 2 && <div className="w-6 h-6 bg-bg-secondary border border-border rounded-full flex items-center justify-center text-[0.8rem] font-bold text-text-muted shadow-sm">{index + 1}</div>}
                                    </div>
                                    <AgentCard agent={agent} />
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden">
                        {hunters.length === 0 ? (
                            <div className="text-center py-15 text-text-secondary">
                                No hunters have discovered agents yet.
                            </div>
                        ) : (
                            hunters.map((hunter, index) => (
                                <Link href={`/profile/${hunter.wallet}`} key={hunter.wallet} className="no-underline">
                                    <div className={`flex items-center p-5 px-6 border-b border-border transition-colors duration-150 cursor-pointer ${
                                        index === hunters.length - 1 ? "border-none" : ""
                                    } hover:bg-bg-primary`}
                                    >
                                        <div className={`w-10 text-[1.2rem] font-bold ${index < 3 ? "text-text-primary" : "text-text-muted"}`}>
                                            #{index + 1}
                                        </div>
                                        
                                        <div className="w-12 h-12 rounded-full bg-bg-primary overflow-hidden mr-4 flex items-center justify-center border border-border">
                                            {hunter.avatarUrl ? (
                                                <img src={hunter.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon size={24} className="text-text-muted" />
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="m-0 text-[1.1rem] font-bold text-text-primary">
                                                {hunter.username || "Anonymous Hunter"}
                                            </h3>
                                            <p className="m-0 mt-1 text-[0.85rem] text-text-secondary font-mono">
                                                {hunter.wallet.slice(0, 6)}...{hunter.wallet.slice(-4)}
                                            </p>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="text-[1.2rem] font-extrabold text-brand">
                                                {hunter.score.toFixed(1)} <span className="text-[0.8rem] text-text-secondary font-medium">SCORE</span>
                                            </div>
                                            <div className="text-[0.85rem] text-text-muted mt-0.5">
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
