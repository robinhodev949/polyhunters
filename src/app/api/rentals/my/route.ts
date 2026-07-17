import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAddress, isAddress } from "viem";

/**
 * GET /api/rentals/my?wallet=WALLET_ADDRESS
 * Returns all confirmed rentals for a given EVM wallet address on Robinhood Chain.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const wallet = searchParams.get("wallet");

        if (!wallet) {
            return NextResponse.json({ error: "wallet query param required." }, { status: 400 });
        }

        if (!isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid wallet address format." }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        const user = await db.user.findUnique({
            where: { wallet: normalizedWallet },
        });

        if (!user) {
            return NextResponse.json([]);
        }

        const rentals = await db.rental.findMany({
            where:   { userId: user.id, paymentStatus: "confirmed" },
            orderBy: { startedAt: "desc" },
            include: { agent: { select: { id: true, name: true, tagline: true, dockerImageUrl: true, webhookUrl: true } } },
        });

        return NextResponse.json(rentals);
    } catch (err: any) {
        console.error("rentals/my error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
