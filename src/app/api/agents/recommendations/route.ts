import { NextResponse } from "next/server";
import db from "@/lib/db";

// Helper for Jaccard similarity between two tag arrays
function getJaccardSimilarity(tagsA: string[], tagsB: string[]): number {
    if (tagsA.length === 0 || tagsB.length === 0) return 0;
    const setA = new Set(tagsA.map(t => t.toLowerCase()));
    const setB = new Set(tagsB.map(t => t.toLowerCase()));
    
    let intersection = 0;
    setA.forEach(item => {
        if (setB.has(item)) intersection++;
    });
    
    const union = setA.size + setB.size - intersection;
    return union > 0 ? intersection / union : 0;
}

/**
 * GET /api/agents/recommendations
 * Returns smart product-recommendation lists grouped in rails:
 * 1. Trending (upvotes + rentals * 3)
 * 2. Matching Interests (overlap with user's top interest tags)
 * 3. Similar to a specific agent (Jaccard similarity)
 * 4. Top Performers (sorted by ROI in active prediction market)
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const wallet = searchParams.get("wallet");
        const similarTo = searchParams.get("similarTo");
        const market = searchParams.get("market") || "polymarket";

        // Query all live agents
        const allAgents = await db.agent.findMany({
            where: {
                status: "live"
            }
        });

        // 1. 🔥 Trending This Week
        // TODO(real-trending-deltas): Fetch real deltas using AgentStatSnapshot table when created.
        const trending = [...allAgents]
            .map(agent => ({
                agent,
                score: agent.upvotes + agent.totalRentals * 3
            }))
            .sort((a, b) => b.score - a.score)
            .map(x => x.agent)
            .slice(0, 8);

        // 2. 🎯 Matching Your Interests
        let matching: any[] = [];
        if (wallet) {
            const user = await db.user.findUnique({
                where: { wallet }
            });
            
            if (user && user.interestTags && user.interestTags.length > 0) {
                // Find top 3 most frequent tags in user's interest history
                const tagCounts: { [key: string]: number } = {};
                user.interestTags.forEach(t => {
                    tagCounts[t] = (tagCounts[t] || 0) + 1;
                });
                
                const topTags = Object.entries(tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(x => x[0].toLowerCase());

                matching = allAgents
                    .map(agent => {
                        const overlap = agent.tags.filter(t => topTags.includes(t.toLowerCase())).length;
                        return { agent, overlap };
                    })
                    .filter(x => x.overlap > 0)
                    .sort((a, b) => b.overlap - a.overlap)
                    .map(x => x.agent)
                    .slice(0, 8);
            }
        }

        // 3. 🧩 Similar to {{agentName}}
        let similar: any[] = [];
        if (similarTo) {
            const targetAgent = allAgents.find(a => a.id === similarTo);
            if (targetAgent) {
                similar = allAgents
                    .filter(a => a.id !== similarTo)
                    .map(agent => ({
                        agent,
                        similarity: getJaccardSimilarity(targetAgent.tags, agent.tags)
                    }))
                    .filter(x => x.similarity > 0)
                    .sort((a, b) => b.similarity - a.similarity || b.agent.upvotes - a.agent.upvotes)
                    .map(x => x.agent)
                    .slice(0, 8);
            }
        }

        // 4. 🏆 Top Performers in outcome markets
        const performers = allAgents
            .filter(a => a.marketSourceIds.map(m => m.toLowerCase()).includes(market.toLowerCase()))
            .sort((a, b) => b.roi - a.roi)
            .slice(0, 8);

        return NextResponse.json({
            trending,
            matching,
            similar,
            performers
        });
    } catch (err: any) {
        console.error("recommendations API error:", err);
        return NextResponse.json({ error: "Failed to fetch agent recommendations." }, { status: 500 });
    }
}
