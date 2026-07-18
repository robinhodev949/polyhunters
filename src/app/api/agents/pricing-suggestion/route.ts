import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET /api/agents/pricing-suggestion
 * Computes suggested rental price per day based on category tags of existing live agents.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tagsParam = searchParams.get("tags");

        if (!tagsParam) {
            return NextResponse.json({ 
                suggestedPricePerDay: 5, 
                sampleSize: 0, 
                p25: 3, 
                p75: 8, 
                note: "Default platform average (no tags provided)" 
            });
        }

        const tagsList = tagsParam.split(",").map(t => t.trim()).filter(Boolean);

        if (tagsList.length === 0) {
            return NextResponse.json({ 
                suggestedPricePerDay: 5, 
                sampleSize: 0, 
                p25: 3, 
                p75: 8, 
                note: "Default platform average (empty tags list)" 
            });
        }

        // Query live agents containing at least one of these tags
        const agents = await db.agent.findMany({
            where: {
                status: "live",
                tags: {
                    hasSome: tagsList
                }
            },
            select: {
                pricePerDay: true
            }
        });

        const sampleSize = agents.length;

        if (sampleSize === 0) {
            return NextResponse.json({
                suggestedPricePerDay: 5,
                sampleSize: 0,
                p25: 3,
                p75: 8,
                note: "Not enough data yet in this category — here's the platform average"
            });
        }

        const prices = agents.map(a => a.pricePerDay).sort((a, b) => a - b);
        
        // Calculate median
        let median = 5;
        const mid = Math.floor(prices.length / 2);
        if (prices.length % 2 !== 0) {
            median = prices[mid];
        } else {
            median = (prices[mid - 1] + prices[mid]) / 2;
        }

        // Calculate 25th and 75th percentiles (p25 / p75)
        const p25Index = Math.floor(prices.length * 0.25);
        const p75Index = Math.floor(prices.length * 0.75);
        const p25 = prices[p25Index];
        const p75 = prices[p75Index];

        return NextResponse.json({
            suggestedPricePerDay: Math.round(median * 10) / 10,
            sampleSize,
            p25: Math.round(p25 * 10) / 10,
            p75: Math.round(p75 * 10) / 10
        });
    } catch (err: any) {
        console.error("pricing-suggestion error:", err);
        return NextResponse.json({ error: "Failed to calculate pricing suggestion." }, { status: 500 });
    }
}
