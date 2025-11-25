import { AppDataSource } from "../config/database";
import { Portfolio } from "../entities/Portfolio";
import { Asset } from "../entities/Asset";
import { CustomError, ErrorCodes, ErrorKeys } from "../common/errors";
import * as CryptoApiService from "./CryptoApiService";

const portfolioRepository = AppDataSource.getRepository(Portfolio);

/**
 * Add asset to user's portfolio
 */
export async function addToPortfolio(userId: string, assetId: string, quantity: number, purchasePrice: number) {
  // Verify asset exists
  const asset = await CryptoApiService.getAssetById(assetId);

  // Check if position already exists
  const existingPosition = await portfolioRepository.findOne({
    where: { userId, assetId },
  });

  if (existingPosition) {
    // Update existing position - calculate new average price
    const totalQuantity = Number(existingPosition.quantity) + quantity;
    const totalCost = Number(existingPosition.quantity) * Number(existingPosition.averagePurchasePrice) + quantity * purchasePrice;
    const newAveragePrice = totalCost / totalQuantity;

    existingPosition.quantity = totalQuantity;
    existingPosition.averagePurchasePrice = newAveragePrice;

    await portfolioRepository.save(existingPosition);
    return existingPosition;
  }

  // Create new position
  const position = portfolioRepository.create({
    userId,
    assetId,
    quantity,
    averagePurchasePrice: purchasePrice,
  });

  await portfolioRepository.save(position);
  return position;
}

/**
 * Get user's entire portfolio with current prices
 */
export async function getUserPortfolio(userId: string) {
  const positions = await portfolioRepository.find({
    where: { userId },
    relations: ["asset"],
  });

  if (positions.length === 0) {
    return {
      positions: [],
      totalValue: 0,
      totalCost: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
    };
  }

  // Get current prices for all assets
  const apiIds = positions.map((p) => p.asset.apiId);
  const currentPrices = await CryptoApiService.getCurrentPrices(apiIds);

  // Calculate values
  let totalValue = 0;
  let totalCost = 0;

  const enrichedPositions = positions.map((position) => {
    const currentPrice = currentPrices[position.asset.apiId] || 0;
    const quantity = Number(position.quantity);
    const avgPrice = Number(position.averagePurchasePrice);

    const currentValue = quantity * currentPrice;
    const costBasis = quantity * avgPrice;
    const profitLoss = currentValue - costBasis;
    const profitLossPercentage = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

    totalValue += currentValue;
    totalCost += costBasis;

    return {
      id: position.id,
      asset: {
        id: position.asset.id,
        symbol: position.asset.symbol,
        name: position.asset.name,
        imageUrl: position.asset.imageUrl,
      },
      quantity,
      averagePurchasePrice: avgPrice,
      currentPrice,
      currentValue,
      costBasis,
      profitLoss,
      profitLossPercentage,
      updatedAt: position.updatedAt,
    };
  });

  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  return {
    positions: enrichedPositions,
    totalValue,
    totalCost,
    totalProfitLoss,
    totalProfitLossPercentage,
  };
}

/**
 * Update portfolio position
 */
export async function updatePosition(userId: string, positionId: string, quantity?: number, purchasePrice?: number) {
  const position = await portfolioRepository.findOne({
    where: { id: positionId, userId },
  });

  if (!position) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.PORTFOLIO_POSITION_NOT_FOUND, "Portfolio position not found");
  }

  if (quantity !== undefined) {
    position.quantity = quantity;
  }

  if (purchasePrice !== undefined) {
    position.averagePurchasePrice = purchasePrice;
  }

  await portfolioRepository.save(position);
  return position;
}

/**
 * Remove asset from portfolio
 */
export async function removeFromPortfolio(userId: string, positionId: string) {
  const position = await portfolioRepository.findOne({
    where: { id: positionId, userId },
  });

  if (!position) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.PORTFOLIO_POSITION_NOT_FOUND, "Portfolio position not found");
  }

  await portfolioRepository.remove(position);
  return { message: "Position removed successfully" };
}

/**
 * Get single position by ID
 */
export async function getPositionById(userId: string, positionId: string) {
  const position = await portfolioRepository.findOne({
    where: { id: positionId, userId },
    relations: ["asset"],
  });

  if (!position) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.PORTFOLIO_POSITION_NOT_FOUND, "Portfolio position not found");
  }

  return position;
}

export default {
  addToPortfolio,
  getUserPortfolio,
  updatePosition,
  removeFromPortfolio,
  getPositionById,
};
