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
export declare function getGlobalMarketData(): Promise<MarketData>;
/**
 * Get Fear & Greed Index
 */
export declare function getFearGreedIndex(): Promise<FearGreedData>;
/**
 * Get all market indicators
 */
export declare function getMarketIndicators(): Promise<{
    bitcoinDominance: number;
    totalMarketCap: number;
    totalVolume24h: number;
    marketCapChangePercentage24h: number;
    fearGreedIndex: {
        value: number;
        classification: string;
    };
}>;
declare const _default: {
    getGlobalMarketData: typeof getGlobalMarketData;
    getFearGreedIndex: typeof getFearGreedIndex;
    getMarketIndicators: typeof getMarketIndicators;
};
export default _default;
//# sourceMappingURL=MarketService.d.ts.map