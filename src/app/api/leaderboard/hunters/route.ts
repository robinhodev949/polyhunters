import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        // Fetch all users who have hunted at least one agent
        const users = await prisma.user.findMany({
            where: {
                hunted: { some: {} }
            },
            include: {
                hunted: true
            }
        });

        // Sum the blended score of all their hunted agents to find the top Polyhunters
        const ranked = users.map((user: any) => {
            const hunterScore = user.hunted.reduce((acc: number, agent: any) => {
                return acc + (agent.upvotes * 1.5) + (agent.totalRentals * 2) + agent.roi;
            }, 0);
            return {
                wallet: user.wallet,
                username: user.username,
                avatarUrl: user.avatarUrl,
                score: hunterScore,
                huntedCount: user.hunted.length
            };
        }).sort((a: any, b: any) => b.score - a.score).slice(0, 50);

        return NextResponse.json({ hunters: ranked });
    } catch (error: any) {
        console.error("Hunter Leaderboard Error:", error);
        return NextResponse.json({ error: "Failed to fetch hunter leaderboard" }, { status: 500 });
    }
}
