// src/lib/markets/types.ts

export interface PredictionMarket {
  id: string;
  sourceId: string;
  question: string;
  outcomes: { name: string; price: number }[];
  volume: number;
  liquidity: number;
  endDate: string;
  url: string;
}

export interface PredictionMarketSource {
  id: string;                // e.g. "polymarket"
  name: string;              // e.g. "Polymarket"
  logoUrl: string;
  fetchMarkets(): Promise<PredictionMarket[]>;
  getMarket(marketId: string): Promise<PredictionMarket | null>;
}
