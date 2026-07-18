import db from "@/lib/db";
import { isHunterHolder } from "@/lib/robinhoodChain";

export type DiscountTier = "none" | "hunter_free" | "hunter_half";

export interface PricingResult {
    totalAmount: number;
    originalAmount: number;
    discountTier: DiscountTier;
    discountEndsAt: Date | null;
}

export async function priceRental(params: {
    wallet: string;
    pricePerDay?: number;
    agent?: {
        pricePerDay: number;
        pricePerDayVariantB?: number | null;
        abTestSplitPercent?: number | null;
    };
    days: number;
}): Promise<PricingResult> {
    const { wallet, pricePerDay, agent, days } = params;
    
    let selectedPricePerDay = pricePerDay ?? 5;
    if (agent) {
        selectedPricePerDay = agent.pricePerDay;
        if (agent.pricePerDayVariantB !== null && agent.pricePerDayVariantB !== undefined) {
            const splitPercent = agent.abTestSplitPercent ?? 50;
            let sum = 0;
            for (let i = 0; i < wallet.length; i++) {
                sum += wallet.charCodeAt(i);
            }
            const bucket = sum % 100;
            if (bucket < splitPercent) {
                selectedPricePerDay = agent.pricePerDayVariantB;
            }
        }
    }

    const originalAmount = selectedPricePerDay * days;

    // 1. Look up or create the user
    let user = await db.user.findUnique({
        where: { wallet }
    });

    if (!user) {
        user = await db.user.create({
            data: { wallet }
        });
    }

    // 2. Check if they are a hunter holder on-chain
    const holdingHunter = await isHunterHolder(wallet);

    if (!holdingHunter) {
        return {
            totalAmount: originalAmount,
            originalAmount,
            discountTier: "none",
            discountEndsAt: null
        };
    }

    const now = new Date();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    // 3. Stamp hunterDiscountStartedAt if not set yet
    if (!user.hunterDiscountStartedAt) {
        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: { hunterDiscountStartedAt: now }
        });
        const discountEndsAt = new Date(now.getTime() + fourteenDaysMs);
        return {
            totalAmount: 0,
            originalAmount,
            discountTier: "hunter_free",
            discountEndsAt
        };
    }

    // 4. If within the 14-day window
    const discountStartedTime = user.hunterDiscountStartedAt.getTime();
    const elapsed = now.getTime() - discountStartedTime;

    if (elapsed < fourteenDaysMs) {
        const discountEndsAt = new Date(discountStartedTime + fourteenDaysMs);
        return {
            totalAmount: 0,
            originalAmount,
            discountTier: "hunter_free",
            discountEndsAt
        };
    }

    // 5. If past 14 days, 50% discount forever
    return {
        totalAmount: originalAmount * 0.5,
        originalAmount,
        discountTier: "hunter_half",
        discountEndsAt: null
    };
}
