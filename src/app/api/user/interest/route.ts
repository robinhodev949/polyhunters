import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAddress, isAddress } from "viem";

/**
 * POST /api/user/interest
 * Appends/bumps an interest tag to a user's tag history.
 * Body: { wallet, tag }
 */
export async function POST(req: Request) {
    try {
        const { wallet, tag } = await req.json();

        if (!wallet || !tag) {
            return NextResponse.json({ error: "wallet and tag are required." }, { status: 400 });
        }

        if (!isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid wallet address format." }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        // Fetch or create the user first
        const user = await db.user.upsert({
            where: { wallet: normalizedWallet },
            create: { wallet: normalizedWallet, interestTags: [tag] },
            update: {},
        });

        // Append tag and cap array size to prevent infinite database growth
        const updatedTags = [...user.interestTags, tag].slice(-30);

        await db.user.update({
            where: { wallet: normalizedWallet },
            data: { interestTags: updatedTags }
        });

        return NextResponse.json({ success: true, tags: updatedTags });
    } catch (err: any) {
        console.error("user/interest error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
