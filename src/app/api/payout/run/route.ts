import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendUSDC } from "@/lib/robinhoodChain";

const CRON_SECRET = process.env.CRON_SECRET || "";

/**
 * POST /api/payout/run
 * Processes all expired confirmed rentals and sends USDC to agent owners on Robinhood Chain L2.
 * Call this from a cron job (Vercel Cron, GitHub Actions, etc.)
 * Requires header: Authorization: Bearer <CRON_SECRET>
 */
export async function POST(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        // Find all confirmed rentals that have expired and haven't been paid out yet
        const expiredRentals = await db.rental.findMany({
            where: {
                paymentStatus: "confirmed",
                payoutStatus:  "unpaid",
                expiresAt:     { lte: new Date() },
            },
            include: { agent: true, user: true },
        });

        if (expiredRentals.length === 0) {
            return NextResponse.json({ message: "No rentals due for payout.", processed: 0 });
        }

        const results: any[] = [];

        for (const rental of expiredRentals) {
            const ownerWallet = rental.agent.ownerWallet;
            const ownerAmount = rental.ownerAmount;

            if (!ownerWallet || !ownerAmount || ownerAmount <= 0) {
                results.push({ rentalId: rental.id, status: "skipped", reason: "No owner wallet or amount." });
                continue;
            }

            try {
                // Send USDC to agent owner on Robinhood Chain L2
                const txSig = await sendUSDC(ownerWallet, ownerAmount);

                // Mark rental as paid
                await db.rental.update({
                    where: { id: rental.id },
                    data: {
                        payoutStatus:    "paid",
                        payoutTxSig:     txSig,
                        containerStatus: "stopped",
                    },
                });

                results.push({
                    rentalId:  rental.id,
                    status:    "paid",
                    amount:    ownerAmount,
                    owner:     ownerWallet,
                    txSig,
                });
            } catch (err: any) {
                results.push({ rentalId: rental.id, status: "failed", error: err.message });
            }
        }

        const paid   = results.filter(r => r.status === "paid").length;
        const failed = results.filter(r => r.status === "failed").length;

        return NextResponse.json({
            message:   `Payout run complete. ${paid} paid, ${failed} failed.`,
            processed: expiredRentals.length,
            results,
        });
    } catch (err: any) {
        console.error("payout/run error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/**
 * GET /api/payout/run
 * Returns payout status summary (for admin dashboard use)
 */
export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [pending, paid, total] = await Promise.all([
        db.rental.count({ where: { paymentStatus: "confirmed", payoutStatus: "unpaid" } }),
        db.rental.count({ where: { payoutStatus: "paid" } }),
        db.rental.count({ where: { paymentStatus: "confirmed" } }),
    ]);

    return NextResponse.json({ pending, paid, total });
}
