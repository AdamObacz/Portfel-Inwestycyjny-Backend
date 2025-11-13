import { getPortfolioForUser, getServerTime } from "./repository";
import { Portfolio } from "./types";

export async function fetchPortfolio(userId?: string): Promise<Portfolio> {
  return getPortfolioForUser(userId);
}

export async function fetchTime(): Promise<number> {
  return getServerTime();
}
