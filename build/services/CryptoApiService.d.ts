import { Asset } from "../entities/Asset";
/**
 * Search for cryptocurrencies by name or symbol
 */
export declare function searchCryptoAssets(query: string): Promise<Asset[]>;
/**
 * Get or create asset in database
 */
export declare function getOrCreateAsset(symbol: string, name: string, apiId: string, imageUrl?: string): Promise<Asset>;
/**
 * Get current price for a single asset
 */
export declare function getCurrentPrice(apiId: string): Promise<number>;
/**
 * Get current prices for multiple assets
 */
export declare function getCurrentPrices(apiIds: string[]): Promise<{
    [apiId: string]: number;
}>;
/**
 * Get asset by ID from database
 */
export declare function getAssetById(assetId: string): Promise<Asset>;
declare const _default: {
    searchCryptoAssets: typeof searchCryptoAssets;
    getOrCreateAsset: typeof getOrCreateAsset;
    getCurrentPrice: typeof getCurrentPrice;
    getCurrentPrices: typeof getCurrentPrices;
    getAssetById: typeof getAssetById;
};
export default _default;
//# sourceMappingURL=CryptoApiService.d.ts.map