import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAddress, isAddress } from "viem";

const ESCROW_WALLET = process.env.ESCROW_WALLET_ADDRESS || "";

/**
 * POST /api/rent/initiate
 * Creates a pending rental record and returns the escrow address + USDC amount.
 * Body: { agentId, renterWallet, days }
 */
export async function POST(req: Request) {
    try {
        const { agentId, renterWallet, days } = await req.json();

        if (!agentId || !renterWallet || !days) {
            return NextResponse.json({ error: "agentId, renterWallet, and days are required." }, { status: 400 });
        }
        if (!ESCROW_WALLET) {
            return NextResponse.json({ error: "Escrow wallet is not configured on server." }, { status: 500 });
        }
        if (!isAddress(renterWallet)) {
            return NextResponse.json({ error: "Invalid renter wallet address format." }, { status: 400 });
        }

        const normalizedRenter = getAddress(renterWallet);

        const agent = await db.agent.findUnique({ where: { id: agentId } });
        if (!agent) {
            return NextResponse.json({ error: "Agent not found." }, { status: 404 });
        }

        const totalAmount = agent.pricePerDay * days;
        const expiresAt   = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        // Upsert the renter user
        const user = await db.user.upsert({
            where:  { wallet: normalizedRenter },
            create: { wallet: normalizedRenter },
            update: {},
        });

        // Create the rental in pending state
        const rental = await db.rental.create({
            data: {
                userId:        user.id,
                agentId:       agent.id,
                totalAmount,
                expiresAt,
                paymentStatus: "pending",
                payoutStatus:  "unpaid",
            },
        });

        return NextResponse.json({
            rentalId:     rental.id,
            escrowWallet: ESCROW_WALLET,
            totalAmount,
            days,
            expiresAt,
            message:      `Send exactly ${totalAmount} USDC to the escrow wallet, then call /api/rent/verify with your transaction hash.`,
        });
    } catch (err: any) {
        console.error("rent/initiate error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
