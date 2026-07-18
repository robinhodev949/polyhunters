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
