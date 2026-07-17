export interface Agent {
    id: string;
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    tags: string[];
    roi: number;
    pricePerDay: number;
    upvotes: number;
    openClawHash: string;
    developer: string;
    status: "live" | "beta" | "paused";
    marketsActive: number;
    totalVolume: number;
    winRate: number;
    createdAt: string;
}

export const AGENTS: Agent[] = [
    {
        id: "alpha-oracle",
        name: "[EXAMPLE] AlphaOracle",
        tagline: "GPT-4 powered sentiment analysis bot for political prediction markets",
        description:
            "AlphaOracle ingests Twitter/X, Reddit, and news feeds in real-time, applies transformer-based sentiment scoring, and executes positions on Polymarket political markets. Uses Kelly Criterion for bankroll management.",
        logoUrl: "/logos/alpha-oracle.svg",
        tags: ["Politics", "NLP", "Sentiment"],
        roi: 34.7,
        pricePerDay: 8,
        upvotes: 412,
        openClawHash: "0xa1b2c3d4e5f6789012345678901234567890abcd",
        developer: "0x7F...4aD",
        status: "live",
        marketsActive: 23,
        totalVolume: 142000,
        winRate: 71.2,
        createdAt: "2025-11-02",
    }
];

export function getAgentById(id: string): Agent | undefined {
    return AGENTS.find((a) => a.id === id);
}
