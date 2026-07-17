// src/lib/markets/polymarket.ts

import { PredictionMarket, PredictionMarketSource } from "./types";
import { registerMarketSource } from "./registry";

export const PolymarketSource: PredictionMarketSource = {
  id: "polymarket",
  name: "Polymarket",
  logoUrl: "/logos/polymarket.svg",
  
  async fetchMarkets(): Promise<PredictionMarket[]> {
    try {
      const res = await fetch("https://gamma-api.polymarket.com/markets?limit=10&active=true&closed=false");
      if (!res.ok) throw new Error("Failed to fetch Polymarket markets");
      const data = await res.json();
      return data.map((m: any) => {
        const outcomesStr = typeof m.outcomes === "string" ? JSON.parse(m.outcomes) : m.outcomes;
        const pricesStr = typeof m.outcomePrices === "string" ? JSON.parse(m.outcomePrices) : m.outcomePrices;
        
        const outcomes = (outcomesStr || []).map((name: string, index: number) => ({
          name,
          price: pricesStr && pricesStr[index] ? parseFloat(pricesStr[index]) : 0,
        }));

        return {
          id: m.id || String(m.clobTokenIds?.[0] || Math.random()),
          sourceId: "polymarket",
          question: m.question || "Unknown Question",
          outcomes,
          volume: m.volume ? parseFloat(m.volume) : 0,
          liquidity: m.liquidity ? parseFloat(m.liquidity) : 0,
          endDate: m.endDate || new Date().toISOString(),
          url: `https://polymarket.com/event/${m.marketSlug || ""}`,
        };
      });
    } catch (error) {
      console.error("Error in PolymarketSource.fetchMarkets:", error);
      // Resilient fallbacks
      return [
        {
          id: "pm-mock-1",
          sourceId: "polymarket",
          question: "Will Robinhood Chain TVL cross $100M by end of 2026?",
          outcomes: [{ name: "Yes", price: 0.65 }, { name: "No", price: 0.35 }],
          volume: 245000,
          liquidity: 12000,
          endDate: "2026-12-31T23:59:59Z",
          url: "https://polymarket.com",
        },
        {
          id: "pm-mock-2",
          sourceId: "polymarket",
          question: "Will Arbitrum Orbit L3 release next major version this quarter?",
          outcomes: [{ name: "Yes", price: 0.42 }, { name: "No", price: 0.58 }],
          volume: 180000,
          liquidity: 8500,
          endDate: "2026-09-30T23:59:59Z",
          url: "https://polymarket.com",
        }
      ];
    }
  },

  async getMarket(marketId: string): Promise<PredictionMarket | null> {
    try {
      const res = await fetch(`https://gamma-api.polymarket.com/markets/${marketId}`);
      if (!res.ok) return null;
      const m = await res.json();
      
      const outcomesStr = typeof m.outcomes === "string" ? JSON.parse(m.outcomes) : m.outcomes;
      const pricesStr = typeof m.outcomePrices === "string" ? JSON.parse(m.outcomePrices) : m.outcomePrices;
      
      const outcomes = (outcomesStr || []).map((name: string, index: number) => ({
        name,
        price: pricesStr && pricesStr[index] ? parseFloat(pricesStr[index]) : 0,
      }));

      return {
        id: m.id,
        sourceId: "polymarket",
        question: m.question,
        outcomes,
        volume: m.volume ? parseFloat(m.volume) : 0,
        liquidity: m.liquidity ? parseFloat(m.liquidity) : 0,
        endDate: m.endDate,
        url: `https://polymarket.com/event/${m.marketSlug || ""}`,
      };
    } catch {
      return null;
    }
  }
};

// Register Polymarket by default in the pluggable registry
registerMarketSource(PolymarketSource);

/**
 * Helper to instantiate the official Polymarket CLOB client using `@polymarket/clob-client`
 * for order placement. This client implements the Builder Program order attribution.
 */
export async function createPolymarketClobClient(privateKey: string, walletAddress: string) {
  const { ClobClient } = await import("@polymarket/clob-client");
  const { createWalletClient, http } = await import("viem");
  const { privateKeyToAccount } = await import("viem/accounts");
  const { polygon } = await import("viem/chains");

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: http(),
  });

  const builderCodeStr = process.env.POLYMARKET_BUILDER_CODE || "0";
  const builderCode = parseInt(builderCodeStr, 10) || 0;

  // ClobClient constructor parameters:
  // (host, chainId, signer, creds, signatureType, funderAddress, geoBlockToken, useServerTime, builderConfig)
  const { BuilderConfig } = await import("@polymarket/builder-signing-sdk");
  let builderConfig: any = undefined;
  if (process.env.POLYMARKET_BUILDER_KEY && process.env.POLYMARKET_BUILDER_SECRET && process.env.POLYMARKET_BUILDER_PASSPHRASE) {
    builderConfig = new BuilderConfig({
      localBuilderCreds: {
        key: process.env.POLYMARKET_BUILDER_KEY,
        secret: process.env.POLYMARKET_BUILDER_SECRET,
        passphrase: process.env.POLYMARKET_BUILDER_PASSPHRASE,
      }
    });
  }

  return new ClobClient(
    "https://clob.polymarket.com",
    137, // Polygon chain ID
    walletClient,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    builderConfig
  );
}
