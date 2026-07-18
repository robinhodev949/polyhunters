import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET /api/agents/[id]
 * Fetches detail profile for a single agent, including its owner.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const agent = await db.agent.findUnique({
            where: { id },
            include: {
                owner: true
            }
        });

        if (!agent) {
            return NextResponse.json({ error: "Agent not found." }, { status: 404 });
        }

        return NextResponse.json({ agent });
    } catch (err: any) {
        console.error("Fetch agent error:", err);
        return NextResponse.json({ error: "Failed to fetch agent details." }, { status: 500 });
    }
}
