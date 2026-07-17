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
        <div className="agent-card flex p-6 gap-6 bg-bg-secondary border border-border rounded-xl items-center shadow-card hover:shadow-card-hover transition-shadow duration-200">
            {/* Logo */}
            <div className="w-[80px] h-[80px] rounded-[14px] bg-gradient-to-br from-bg-secondary to-bg-primary flex items-center justify-center flex-shrink-0 border border-border">
                <span className="text-[2.5rem] font-extrabold text-brand font-sans">
                    {agent.name.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Content */}
            <div className="agent-card-content flex-1 flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-[1.2rem] font-bold m-0 text-text-primary">
                        {agent.name}
                    </h3>
                    {agent.id.startsWith("example-") && (
                        <span className="text-[0.65rem] font-bold bg-bg-primary text-text-secondary px-1.5 py-0.5 rounded-sm border border-border">EXAMPLE</span>
                    )}
                    {agent.status === "live" ? (
                        <span className="text-[0.7rem] font-bold text-success bg-[rgba(10,124,78,0.1)] px-2 py-0.5 rounded-xl uppercase">Live</span>
                    ) : (
                        <span className="text-[0.7rem] font-bold text-error bg-[rgba(239,68,68,0.1)] px-2 py-0.5 rounded-xl uppercase">Beta</span>
                    )}
                </div>

                <p className="m-0 text-[1rem] text-text-secondary leading-normal font-normal">
                    {agent.tagline}
                </p>

                <div className="flex gap-2 mt-1 items-center flex-wrap">
                    <span className="text-[0.85rem] text-brand font-semibold bg-[rgba(22,93,252,0.08)] px-2.5 py-1 rounded-md">
                        {agent.pricePerDay} USDC/day
                    </span>
                    <span className="text-text-muted">•</span>
                    {agent.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[0.85rem] text-text-secondary bg-bg-secondary px-2.5 py-1 rounded-md border border-border">
                            {tag}
                        </span>
                    ))}
                    {agent.roi > 0 && (
                        <>
                            <span className="text-text-muted">•</span>
                            <span className="text-[0.85rem] text-success font-semibold">
                                +{agent.roi}% ROI
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions: Upvote & Install */}
            <div className="agent-card-actions flex items-center gap-6 flex-shrink-0 ml-4">
                
                {/* Upvote Column */}
                <button
                    onClick={handleUpvote}
                    className={`flex flex-col items-center justify-center w-[60px] h-[60px] rounded-lg border cursor-pointer transition-all duration-150 ease-in-out ${
                        hasUpvoted 
                            ? "border-brand bg-[rgba(22,93,252,0.05)] text-brand" 
                            : "border-border bg-bg-secondary text-text-primary hover:border-text-muted"
                    }`}
                >
                    <ArrowUp size={20} strokeWidth={hasUpvoted ? 3 : 2} className={hasUpvoted ? "text-brand" : "text-text-primary"} />
                    <span className={`text-[0.85rem] font-bold mt-1 ${hasUpvoted ? "text-brand" : "text-text-primary"}`}>
                        {upvotes}
                    </span>
                </button>

                {/* Install & Run */}
                <button
                    onClick={handleRent}
                    className="bg-brand-lime text-text-primary border-none rounded-lg px-6 py-3 text-[0.95rem] font-semibold flex items-center gap-2 cursor-pointer transition-all duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] hover:bg-[#bfe600] hover:-translate-y-0.5 active:translate-y-0"
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
