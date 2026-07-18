import { NextResponse } from "next/server";
import { priceRental } from "@/lib/pricing";
import { getHunterBalance } from "@/lib/robinhoodChain";
import db from "@/lib/db";

/**
 * GET /api/test-pricing
 * Regression & Integration tests for the pricing engine and holder discount program.
 */
export async function GET() {
    const results: any[] = [];
    let passed = true;

    async function assert(name: string, condition: boolean, message: string) {
        results.push({ name, passed: condition, message });
        if (!condition) passed = false;
    }

    try {
        // Test Case 1: Wallet with 0 $HUNTER (Regression test)
        // A random wallet (e.g., all 1s) has 0 balance on-chain, and should pay full price.
        const testWallet1 = "0x1111111111111111111111111111111111111111";
        
        // Ensure no leftover user record interferes
        await db.user.deleteMany({ where: { wallet: testWallet1 } });

        const balance1 = await getHunterBalance(testWallet1);
        await assert("Zero balance check", balance1 === 0, `Wallet balance should be 0, got ${balance1}`);

        const priceResult1 = await priceRental({
            wallet: testWallet1,
            pricePerDay: 10,
            days: 3
        });

        await assert(
            "Regression: Zero balance wallet pays full price",
            priceResult1.totalAmount === 30 && priceResult1.discountTier === "none",
            `Expected 30 USDC and 'none' tier. Got: ${JSON.stringify(priceResult1)}`
        );

        // Test Case 2: Verification that the User record was created on first price calculation
        const user = await db.user.findUnique({ where: { wallet: testWallet1 } });
        await assert("User record upserted", user !== null, "User record was not created during priceRental execution");

        // Clean up test users
        await db.user.deleteMany({ where: { wallet: testWallet1 } });

        return NextResponse.json({
            success: passed,
            testSuite: "PolyHunt Pricing Engine Test Suite",
            timestamp: new Date().toISOString(),
            results
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message || "Failed to execute test suite",
            results
        }, { status: 500 });
    }
}
