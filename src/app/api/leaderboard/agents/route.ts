import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        // Fetch all active agents
        const agents = await prisma.agent.findMany({
            where: { status: "live" },
            include: { 
                owner: true,
                hunter: true 
            }
        });

        // Calculate blended score: (Upvotes * 1.5) + (TotalRentals * 2) + ROI
        const ranked = agents.map((agent: any) => ({
            ...agent,
            score: (agent.upvotes * 1.5) + (agent.totalRentals * 2) + agent.roi
        })).sort((a: any, b: any) => b.score - a.score).slice(0, 50);

        return NextResponse.json({ agents: ranked });
    } catch (error: any) {
        console.error("Agent Leaderboard Error:", error);
        return NextResponse.json({ error: "Failed to fetch agent leaderboard" }, { status: 500 });
    }
}
