import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * POST /api/agents/[id]/upvote
 * Increments the upvote count for an agent in the database.
 * Next.js 15+: params is a Promise and must be awaited.
 */
export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const agent = await db.agent.update({
            where:  { id },
            data:   { upvotes: { increment: 1 } },
            select: { id: true, upvotes: true },
        });
        return NextResponse.json({ success: true, upvotes: agent.upvotes });
    } catch (err: any) {
        console.error("upvote error:", err);
        return NextResponse.json({ error: "Failed to upvote." }, { status: 500 });
    }
}
