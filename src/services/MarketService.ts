import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const FEAR_GREED_API = "https://api.alternative.me/fng/";

interface MarketData {
  bitcoinDominance: number;
  totalMarketCap: number;
  totalVolume24h: number;
  marketCapChangePercentage24h: number;
}

interface FearGreedData {
  value: number;
  classification: string;
}

/**
 * Get global cryptocurrency market data
 */
export async function getGlobalMarketData(): Promise<MarketData> {
  try {
    const response = await axios.get(`${COINGECKO_API}/global`, {
      timeout: 10000,
    });

    const data = response.data.data;

    return {
      bitcoinDominance: data.market_cap_percentage?.btc || 0,
      totalMarketCap: data.total_market_cap?.usd || 0,
      totalVolume24h: data.total_volume?.usd || 0,
      marketCapChangePercentage24h: data.market_cap_change_percentage_24h_usd || 0,
    };
  } catch (error) {
    console.error("Error fetching global market data:", error);
    throw new Error("Failed to fetch global market data");
  }
}

/**
 * Get Fear & Greed Index
 */
export async function getFearGreedIndex(): Promise<FearGreedData> {
  try {
    const response = await axios.get(`${FEAR_GREED_API}?limit=1`, {
      timeout: 10000,
    });

    const data = response.data.data[0];

    return {
      value: parseInt(data.value),
      classification: data.value_classification,
    };
  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error);
    throw new Error("Failed to fetch Fear & Greed Index");
  }
}

/**
 * Get all market indicators
 */
export async function getMarketIndicators() {
  const [marketData, fearGreed] = await Promise.all([getGlobalMarketData(), getFearGreedIndex()]);

  return {
    bitcoinDominance: marketData.bitcoinDominance,
    totalMarketCap: marketData.totalMarketCap,
    totalVolume24h: marketData.totalVolume24h,
    marketCapChangePercentage24h: marketData.marketCapChangePercentage24h,
    fearGreedIndex: {
      value: fearGreed.value,
      classification: fearGreed.classification,
    },
  };
}

export default {
  getGlobalMarketData,
  getFearGreedIndex,
  getMarketIndicators,
};
