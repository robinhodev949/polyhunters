import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyMessage, getAddress, isAddress } from "viem";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { wallet, signature, message, username, bio, avatarUrl, email, github, twitter, discord, telegram, website } = body;

        if (!wallet || !signature || !message) {
            return NextResponse.json({ error: "Missing authentication parameters" }, { status: 400 });
        }

        if (!isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        // Verify signature via viem
        const isValid = await verifyMessage({
            address: normalizedWallet,
            message: message,
            signature: signature as `0x${string}`,
        });
        
        if (!isValid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // Validate timestamp in message to prevent replay attacks
        const timestampMatch = message.match(/Timestamp: (\d+)/);
        if (timestampMatch) {
            const timestamp = parseInt(timestampMatch[1], 10);
            if (Date.now() - timestamp > 1000 * 60 * 5) {
                return NextResponse.json({ error: "Signature expired" }, { status: 401 });
            }
        }

        const user = await prisma.user.upsert({
            where: { wallet: normalizedWallet },
            update: {
                username: username || null,
                bio: bio || null,
                avatarUrl: avatarUrl || null,
                email: email || null,
                github: github || null,
                twitter: twitter || null,
                discord: discord || null,
                telegram: telegram || null,
                website: website || null,
            },
            create: {
                wallet: normalizedWallet,
                username: username || null,
                bio: bio || null,
                avatarUrl: avatarUrl || null,
                email: email || null,
                github: github || null,
                twitter: twitter || null,
                discord: discord || null,
                telegram: telegram || null,
                website: website || null,
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("Profile update error:", error);
        if (error.code === "P2002" && error.meta?.target.includes("username")) {
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 });
    }
}
