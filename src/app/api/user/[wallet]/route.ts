import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAddress, isAddress } from "viem";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ wallet: string }> }
) {
    try {
        const resolvedParams = await params;
        const wallet = resolvedParams.wallet;

        if (!isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        const user = await prisma.user.findUnique({
            where: { wallet: normalizedWallet },
            include: {
                agents: { orderBy: { upvotes: 'desc' } }, // Built agents
                hunted: { 
                    orderBy: { upvotes: 'desc' },
                    include: { owner: true } // Include owner info for cards
                }  // Hunted agents
            }
        });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        // Calculate badges dynamically
        const totalUpvotes = user.agents.reduce((sum, a) => sum + a.upvotes, 0);
        
        // Fetch rentals count
        const rentalsCount = await prisma.rental.count({
            where: { userId: user.id, paymentStatus: "confirmed" }
        });

        const badges = [];
        if (user.hunted.length > 0) {
            badges.push({
                id: "genesis-hunter",
                name: "Genesis Hunter",
                description: "Hunted (submitted) at least 1 AI agent to the marketplace",
                icon: "🏹",
                color: "#CCFF00"
            });
        }
        if (user.agents.length > 0) {
            badges.push({
                id: "elite-builder",
                name: "Elite Builder",
                description: "Successfully registered and deployed at least 1 agent on PolyHunt",
                icon: "🛠️",
                color: "#165DFC"
            });
        }
        if (rentalsCount > 0) {
            badges.push({
                id: "escrow-pioneer",
                name: "Escrow Pioneer",
                description: "Deposited USDC into Robinhood Chain escrow to secure a rental",
                icon: "🛡️",
                color: "#0A7C4E"
            });
        }
        if (totalUpvotes >= 10) {
            badges.push({
                id: "community-champion",
                name: "Community Champion",
                description: "Received 10+ total upvotes across all registered agents",
                icon: "⭐",
                color: "#FBBF24"
            });
        }

        return NextResponse.json({ 
            user: {
                ...user,
                badges
            }
        });
    } catch (error: any) {
        console.error("Fetch profile error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
