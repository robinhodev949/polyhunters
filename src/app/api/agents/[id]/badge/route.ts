import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET /api/agents/[id]/badge
 * Returns a dynamic SVG badge for developers to embed in their READMEs/sites.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const agent = await db.agent.findUnique({
            where: { id }
        });

        const name = agent ? agent.name : "AI Agent";
        const upvotes = agent ? agent.upvotes : 0;

        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="250" height="54" viewBox="0 0 250 54">
  <!-- Outer Border & Background -->
  <rect width="248" height="52" x="1" y="1" rx="8" fill="#FFFFFF" stroke="#E8E8E8" stroke-width="1.5"/>
  
  <!-- Left Accent Bar (PolyHunt blue) -->
  <path d="M 1,9 A 8,8 0 0,1 9,1 L 80,1 L 80,53 L 9,53 A 8,8 0 0,1 1,45 Z" fill="#165DFC"/>
  
  <!-- Polygon Accent Logo -->
  <polygon points="18,16 32,12 40,24 28,34 18,16" fill="#CCFF00" opacity="0.95"/>
  
  <!-- Left Label -->
  <text x="44" y="27" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="900" letter-spacing="1">POLY</text>
  <text x="44" y="38" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="900" letter-spacing="1">HUNT</text>
  
  <!-- Right Content -->
  <text x="92" y="22" fill="#6B6B6B" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="800" letter-spacing="0.5">FEATURED ON POLYHUNT</text>
  <text x="92" y="40" fill="#111111" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" clip-path="url(#name-clip)">${name}</text>
  
  <!-- Upvote indicator -->
  <g transform="translate(192, 12)">
    <rect width="48" height="30" rx="6" fill="rgba(22,93,252,0.06)" stroke="rgba(22,93,252,0.15)" stroke-width="1"/>
    <path d="M 15,19 L 24,11 L 33,19" stroke="#165DFC" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="24" y="25" fill="#165DFC" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="900" text-anchor="middle">${upvotes}</text>
  </g>

  <clipPath id="name-clip">
    <rect x="92" y="26" width="95" height="18" />
  </clipPath>
</svg>
`.trim();

        return new Response(svg, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "max-age=60, s-maxage=60, stale-while-revalidate"
            }
        });
    } catch (err: any) {
        console.error("Embed badge error:", err);
        return NextResponse.json({ error: "Failed to render badge." }, { status: 500 });
    }
}
