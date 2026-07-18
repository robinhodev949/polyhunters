import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAddress, isAddress } from "viem";

/**
 * GET /api/agents/[id]/comments
 * Returns the threaded comments/Q&A list for a single agent.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id: agentId } = resolvedParams;

        // Fetch parent-level comments with their immediate replies
        const comments = await db.comment.findMany({
            where: { 
                agentId,
                parentId: null
            },
            include: {
                replies: {
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ comments });
    } catch (err: any) {
        console.error("Fetch comments error:", err);
        return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
    }
}

/**
 * POST /api/agents/[id]/comments
 * Adds a new comment or threaded reply.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id: agentId } = resolvedParams;
        const { wallet, content, parentId, isQA } = await req.json();

        if (!wallet || !content) {
            return NextResponse.json({ error: "Wallet address and comment content are required." }, { status: 400 });
        }
        if (!isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid wallet address format." }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        // Retrieve user profile to populate author metadata
        let user = await db.user.findUnique({
            where: { wallet: normalizedWallet }
        });
        if (!user) {
            user = await db.user.create({
                data: { wallet: normalizedWallet }
            });
        }

        const comment = await db.comment.create({
            data: {
                agentId,
                wallet: normalizedWallet,
                username: user.username || `hunter_${normalizedWallet.slice(2, 8)}`,
                avatarUrl: user.avatarUrl || null,
                content,
                parentId: parentId || null,
                isQA: !!isQA
            }
        });

        return NextResponse.json({ success: true, comment });
    } catch (err: any) {
        console.error("Create comment error:", err);
        return NextResponse.json({ error: "Failed to add comment." }, { status: 500 });
    }
}
