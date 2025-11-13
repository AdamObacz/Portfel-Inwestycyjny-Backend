import { Portfolio } from "./types";

// Simple in-memory repository stub — replace with DB access later
const mockPortfolio: Portfolio = {
  owner: "demo",
  items: [
    { symbol: "BTC", quantity: 1, avgPrice: 102000 },
    { symbol: "ETH", quantity: 1, avgPrice: 3000 },
  ],
};

export async function getPortfolioForUser(_userId?: string): Promise<Portfolio> {
  // simulate async I/O
  return new Promise((resolve) => setTimeout(() => resolve(mockPortfolio), 20));
}

export async function getServerTime(): Promise<number> {
  return Date.now();
}
