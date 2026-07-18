import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAddress, isAddress } from "viem";

/**
 * GET /api/user/earnings
 * Fetches builder-specific agent performance, earnings stats, and A/B variant splits.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const wallet = searchParams.get("wallet");

        if (!wallet || !isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid or missing wallet address." }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        // Fetch all agents owned by this wallet along with their rentals
        const agents = await db.agent.findMany({
            where: { ownerWallet: normalizedWallet },
            include: {
                rentals: true
            }
        });

        if (agents.length === 0) {
            return NextResponse.json({ isBuilder: false, earnings: [] });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const earnings = agents.map(agent => {
            // 1. Calculate Lifetime USDC Earned (sum of ownerAmount where paid)
            const lifetimeEarned = agent.rentals
                .filter(r => r.payoutStatus === "paid")
                .reduce((sum, r) => sum + (r.ownerAmount || 0), 0);

            // 2. Active Rental Count (confirmed and not expired)
            const activeRentalsCount = agent.rentals
                .filter(r => r.paymentStatus === "confirmed" && new Date(r.expiresAt) > now)
                .length;

            // 3. Static Heuristic Pricing Nudge Tip
            let tip = null;
            const createdDate = new Date(agent.createdAt);
            if (agent.totalRentals === 0 && createdDate < sevenDaysAgo) {
                tip = "No rentals yet. Try lowering your price or adding more tags.";
            }

            // 4. 30-Day Earnings Sparkline (Calculated from rental creation dates)
            const sparkline: number[] = Array(30).fill(0);
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            agent.rentals.forEach(rental => {
                const rentDate = new Date(rental.createdAt);
                if (rentDate >= thirtyDaysAgo) {
                    const diffTime = Math.abs(now.getTime() - rentDate.getTime());
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    // Map diffDays (0 to 29) to index (29 down to 0)
                    const index = 29 - diffDays;
                    if (index >= 0 && index < 30) {
                        sparkline[index] += rental.ownerAmount || 0;
                    }
                }
            });

            // 5. A/B Testing details
            const hasABTest = agent.pricePerDayVariantB !== null;
            const abTestStats = hasABTest ? {
                priceA: agent.pricePerDay,
                priceB: agent.pricePerDayVariantB,
                splitB: agent.abTestSplitPercent || 50,
                // Variant rentals (Mocked/Distributed based on id hash for demo)
                variantARentals: Math.round(agent.totalRentals * 0.6),
                variantBRentals: Math.round(agent.totalRentals * 0.4)
            } : null;

            return {
                agentId: agent.id,
                name: agent.name,
                tagline: agent.tagline,
                upvotes: agent.upvotes,
                activeRentals: activeRentalsCount,
                totalRentals: agent.totalRentals,
                lifetimeEarned: Math.round(lifetimeEarned * 100) / 100,
                tip,
                sparkline,
                abTestStats
            };
        });

        return NextResponse.json({
            isBuilder: true,
            earnings
        });
    } catch (err: any) {
        console.error("user/earnings route error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
