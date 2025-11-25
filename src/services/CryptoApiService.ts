import axios from "axios";
import { AppDataSource } from "../config/database";
import { Asset } from "../entities/Asset";
import { CustomError, ErrorCodes, ErrorKeys } from "../common/errors";

const assetRepository = AppDataSource.getRepository(Asset);

// Using CoinGecko API (free tier)
const COINGECKO_API_URL = process.env.CRYPTO_API_URL || "https://api.coingecko.com/api/v3";
const API_KEY = process.env.CRYPTO_API_KEY || ""; // Optional for free tier

interface CoinGeckoSearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
}

interface CoinGeckoPriceData {
  [key: string]: {
    usd: number;
  };
}

/**
 * Search for cryptocurrencies by name or symbol
 */
export async function searchCryptoAssets(query: string): Promise<Asset[]> {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/search`, {
      params: { query },
      headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {},
    });

    const coins = response.data.coins.slice(0, 10); // Limit to 10 results

    // Map to our Asset structure
    const assets: Asset[] = coins.map((coin: CoinGeckoSearchResult) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      type: "cryptocurrency",
      apiId: coin.id,
      imageUrl: coin.thumb,
    }));

    return assets;
  } catch (error: any) {
    console.error("CoinGecko search error:", error.message);
    throw new CustomError(ErrorCodes.INTERNAL_ERROR, ErrorKeys.EXTERNAL_API_ERROR, "Failed to search cryptocurrencies");
  }
}

/**
 * Get or create asset in database
 */
export async function getOrCreateAsset(symbol: string, name: string, apiId: string, imageUrl?: string): Promise<Asset> {
  let asset = await assetRepository.findOne({ where: { symbol } });

  if (!asset) {
    asset = assetRepository.create({
      symbol,
      name,
      type: "cryptocurrency",
      apiId,
      imageUrl,
    });
    await assetRepository.save(asset);
  }

  return asset;
}

/**
 * Get current price for a single asset
 */
export async function getCurrentPrice(apiId: string): Promise<number> {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: apiId,
        vs_currencies: "usd",
      },
      headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {},
    });

    const priceData: CoinGeckoPriceData = response.data;

    if (!priceData[apiId]) {
      throw new Error("Price data not found");
    }

    return priceData[apiId].usd;
  } catch (error: any) {
    console.error("CoinGecko price fetch error:", error.message);
    throw new CustomError(ErrorCodes.INTERNAL_ERROR, ErrorKeys.EXTERNAL_API_ERROR, "Failed to fetch current price");
  }
}

/**
 * Get current prices for multiple assets
 */
export async function getCurrentPrices(apiIds: string[]): Promise<{ [apiId: string]: number }> {
  if (apiIds.length === 0) {
    return {};
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: apiIds.join(","),
        vs_currencies: "usd",
      },
      headers: API_KEY ? { "x-cg-demo-api-key": API_KEY } : {},
    });

    const priceData: CoinGeckoPriceData = response.data;
    const prices: { [apiId: string]: number } = {};

    for (const apiId of apiIds) {
      if (priceData[apiId]) {
        prices[apiId] = priceData[apiId].usd;
      }
    }

    return prices;
  } catch (error: any) {
    console.error("CoinGecko bulk price fetch error:", error.message);
    throw new CustomError(ErrorCodes.INTERNAL_ERROR, ErrorKeys.EXTERNAL_API_ERROR, "Failed to fetch current prices");
  }
}

/**
 * Get asset by ID from database
 */
export async function getAssetById(assetId: string): Promise<Asset> {
  const asset = await assetRepository.findOne({ where: { id: assetId } });

  if (!asset) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.ASSET_NOT_FOUND, "Asset not found");
  }

  return asset;
}

export default {
  searchCryptoAssets,
  getOrCreateAsset,
  getCurrentPrice,
  getCurrentPrices,
  getAssetById,
};
