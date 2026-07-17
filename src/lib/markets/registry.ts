// src/lib/markets/registry.ts

import { PredictionMarketSource } from "./types";

const registry = new Map<string, PredictionMarketSource>();

export function registerMarketSource(source: PredictionMarketSource) {
  registry.set(source.id, source);
}

export function getMarketSource(id: string): PredictionMarketSource | undefined {
  return registry.get(id);
}

export function getAllMarketSources(): PredictionMarketSource[] {
  return Array.from(registry.values());
}
