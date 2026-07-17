import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const agents = await db.agent.findMany({
            orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
            include: { owner: true }
        });
        // Return plain array — marketplace does data.length to check if empty
        return NextResponse.json(agents);
    } catch (error: any) {
        console.error("Error fetching agents:", error);
        return NextResponse.json([], { status: 500 });
    }
}
