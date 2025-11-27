import { AppDataSource } from "../config/database";
import { PortfolioSnapshot } from "../entities/PortfolioSnapshot";
import { Portfolio } from "../entities/Portfolio";
import { CustomError, ErrorCodes, ErrorKeys } from "../common/errors";
import * as PortfolioService from "./PortfolioService";
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

const snapshotRepository = AppDataSource.getRepository(PortfolioSnapshot);

/**
 * Create a snapshot of user's portfolio
 */
export async function createSnapshot(userId: string) {
  const portfolioData = await PortfolioService.getUserPortfolio(userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if snapshot already exists for today
  const existingSnapshot = await snapshotRepository.findOne({
    where: {
      userId,
      snapshotDate: today,
    },
  });

  if (existingSnapshot) {
    // Update existing snapshot
    existingSnapshot.totalValue = portfolioData.totalValue;
    existingSnapshot.breakdown = portfolioData.positions.map((p) => ({
      assetId: p.asset.id,
      symbol: p.asset.symbol,
      quantity: p.quantity,
      currentPrice: p.currentPrice,
      value: p.currentValue,
    }));

    await snapshotRepository.save(existingSnapshot);
    return existingSnapshot;
  }

  // Create new snapshot
  const snapshot = snapshotRepository.create({
    userId,
    snapshotDate: today,
    totalValue: portfolioData.totalValue,
    breakdown: portfolioData.positions.map((p) => ({
      assetId: p.asset.id,
      symbol: p.asset.symbol,
      quantity: p.quantity,
      currentPrice: p.currentPrice,
      value: p.currentValue,
    })),
  });

  await snapshotRepository.save(snapshot);
  return snapshot;
}

/**
 * Get daily report (today vs yesterday)
 */
export async function getDailyReport(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [todaySnapshot, yesterdaySnapshot] = await Promise.all([
    snapshotRepository.findOne({
      where: { userId, snapshotDate: today },
    }),
    snapshotRepository.findOne({
      where: { userId, snapshotDate: yesterday },
    }),
  ]);

  // Get current portfolio data
  const currentPortfolio = await PortfolioService.getUserPortfolio(userId);

  const currentValue = currentPortfolio.totalValue;
  const previousValue = yesterdaySnapshot ? Number(yesterdaySnapshot.totalValue) : currentValue;
  const dailyChange = currentValue - previousValue;
  const dailyChangePercentage = previousValue > 0 ? (dailyChange / previousValue) * 100 : 0;

  return {
    date: today,
    currentValue,
    previousValue,
    dailyChange,
    dailyChangePercentage,
    positions: currentPortfolio.positions,
  };
}

/**
 * Get monthly report
 */
export async function getMonthlyReport(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const snapshots = await snapshotRepository.find({
    where: {
      userId,
      snapshotDate: Between(startOfMonth, endOfMonth),
    },
    order: {
      snapshotDate: "ASC",
    },
  });

  if (snapshots.length === 0) {
    const currentPortfolio = await PortfolioService.getUserPortfolio(userId);
    return {
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      startValue: currentPortfolio.totalValue,
      endValue: currentPortfolio.totalValue,
      monthlyChange: 0,
      monthlyChangePercentage: 0,
      snapshots: [],
    };
  }

  const startValue = Number(snapshots[0].totalValue);
  const endValue = Number(snapshots[snapshots.length - 1].totalValue);
  const monthlyChange = endValue - startValue;
  const monthlyChangePercentage = startValue > 0 ? (monthlyChange / startValue) * 100 : 0;

  return {
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    startValue,
    endValue,
    monthlyChange,
    monthlyChangePercentage,
    snapshots: snapshots.map((s) => ({
      date: s.snapshotDate,
      value: Number(s.totalValue),
      breakdown: s.breakdown,
    })),
  };
}

/**
 * Get performance report for a custom date range
 */
export async function getPerformanceReport(userId: string, fromDate?: string, toDate?: string) {
  const from = fromDate ? new Date(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
  const to = toDate ? new Date(toDate) : new Date();

  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const snapshots = await snapshotRepository.find({
    where: {
      userId,
      snapshotDate: Between(from, to),
    },
    order: {
      snapshotDate: "ASC",
    },
  });

  if (snapshots.length < 2) {
    throw new CustomError(ErrorCodes.BAD_REQUEST, ErrorKeys.INSUFFICIENT_DATA, "Not enough data for the selected period. Need at least 2 snapshots.");
  }

  const startValue = Number(snapshots[0].totalValue);
  const endValue = Number(snapshots[snapshots.length - 1].totalValue);
  const totalChange = endValue - startValue;
  const totalChangePercentage = startValue > 0 ? (totalChange / startValue) * 100 : 0;

  // Calculate daily changes
  const dailyChanges = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prevValue = Number(snapshots[i - 1].totalValue);
    const currValue = Number(snapshots[i].totalValue);
    const change = currValue - prevValue;
    const changePercentage = prevValue > 0 ? (change / prevValue) * 100 : 0;

    dailyChanges.push({
      date: snapshots[i].snapshotDate,
      value: currValue,
      change,
      changePercentage,
    });
  }

  return {
    period: {
      from,
      to,
    },
    startValue,
    endValue,
    totalChange,
    totalChangePercentage,
    snapshots: snapshots.map((s) => ({
      date: s.snapshotDate,
      value: Number(s.totalValue),
    })),
    dailyChanges,
  };
}

/**
 * Get all snapshots for a user
 */
export async function getUserSnapshots(userId: string, limit: number = 30) {
  const snapshots = await snapshotRepository.find({
    where: { userId },
    order: {
      snapshotDate: "DESC",
    },
    take: limit,
  });

  return snapshots.map((s) => ({
    date: s.snapshotDate,
    value: Number(s.totalValue),
    breakdown: s.breakdown,
  }));
}

/**
 * Calculate portfolio volatility (standard deviation of daily returns)
 */
export async function calculateVolatility(userId: string, days: number = 30) {
  const toDate = new Date();
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await snapshotRepository.find({
    where: {
      userId,
      snapshotDate: Between(fromDate, toDate),
    },
    order: {
      snapshotDate: "ASC",
    },
  });

  if (snapshots.length < 2) {
    return 0;
  }

  // Calculate daily returns
  const dailyReturns: number[] = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prevValue = Number(snapshots[i - 1].totalValue);
    const currValue = Number(snapshots[i].totalValue);
    if (prevValue > 0) {
      const dailyReturn = (currValue - prevValue) / prevValue;
      dailyReturns.push(dailyReturn);
    }
  }

  if (dailyReturns.length === 0) {
    return 0;
  }

  // Calculate mean
  const mean = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;

  // Calculate variance
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / dailyReturns.length;

  // Standard deviation (volatility)
  const volatility = Math.sqrt(variance);

  // Annualize volatility (assuming 365 trading days)
  const annualizedVolatility = volatility * Math.sqrt(365);

  return annualizedVolatility * 100; // Return as percentage
}

/**
 * Calculate Sharpe Ratio (risk-adjusted return)
 * Assumes risk-free rate of 2% annually
 */
export async function calculateSharpeRatio(userId: string, days: number = 30, riskFreeRate: number = 0.02) {
  const toDate = new Date();
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await snapshotRepository.find({
    where: {
      userId,
      snapshotDate: Between(fromDate, toDate),
    },
    order: {
      snapshotDate: "ASC",
    },
  });

  if (snapshots.length < 2) {
    return 0;
  }

  // Calculate annualized return
  const startValue = Number(snapshots[0].totalValue);
  const endValue = Number(snapshots[snapshots.length - 1].totalValue);
  const totalReturn = (endValue - startValue) / startValue;
  const annualizedReturn = (totalReturn / days) * 365;

  // Calculate volatility
  const volatility = await calculateVolatility(userId, days);
  const volatilityDecimal = volatility / 100;

  if (volatilityDecimal === 0) {
    return 0;
  }

  // Sharpe Ratio = (Portfolio Return - Risk Free Rate) / Volatility
  const sharpeRatio = (annualizedReturn - riskFreeRate) / volatilityDecimal;

  return sharpeRatio;
}

/**
 * Calculate Maximum Drawdown (largest peak-to-trough decline)
 */
export async function calculateMaxDrawdown(userId: string, days: number = 30) {
  const toDate = new Date();
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await snapshotRepository.find({
    where: {
      userId,
      snapshotDate: Between(fromDate, toDate),
    },
    order: {
      snapshotDate: "ASC",
    },
  });

  if (snapshots.length < 2) {
    return 0;
  }

  let maxDrawdown = 0;
  let peak = Number(snapshots[0].totalValue);

  for (const snapshot of snapshots) {
    const value = Number(snapshot.totalValue);
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown * 100; // Return as percentage
}

/**
 * Calculate annualized return
 */
export async function calculateAnnualReturn(userId: string, days: number = 365) {
  const toDate = new Date();
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await snapshotRepository.find({
    where: {
      userId,
      snapshotDate: Between(fromDate, toDate),
    },
    order: {
      snapshotDate: "ASC",
    },
  });

  if (snapshots.length < 2) {
    return 0;
  }

  const startValue = Number(snapshots[0].totalValue);
  const endValue = Number(snapshots[snapshots.length - 1].totalValue);
  const totalReturn = (endValue - startValue) / startValue;

  // Annualize based on actual period
  const actualDays = snapshots.length;
  const annualizedReturn = (totalReturn / actualDays) * 365;

  return annualizedReturn * 100; // Return as percentage
}

/**
 * Get advanced portfolio metrics
 */
export async function getAdvancedMetrics(userId: string, days: number = 30) {
  const [volatility, sharpeRatio, maxDrawdown, annualReturn] = await Promise.all([calculateVolatility(userId, days), calculateSharpeRatio(userId, days), calculateMaxDrawdown(userId, days), calculateAnnualReturn(userId, days)]);

  return {
    period: days,
    volatility,
    sharpeRatio,
    maxDrawdown,
    annualReturn,
  };
}

export default {
  createSnapshot,
  getDailyReport,
  getMonthlyReport,
  getPerformanceReport,
  getUserSnapshots,
  calculateVolatility,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateAnnualReturn,
  getAdvancedMetrics,
};
