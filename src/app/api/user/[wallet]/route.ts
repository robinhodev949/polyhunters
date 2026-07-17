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
        
        return NextResponse.json({ user });
    } catch (error: any) {
        console.error("Fetch profile error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
