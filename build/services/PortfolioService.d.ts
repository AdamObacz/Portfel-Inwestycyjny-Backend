import { Portfolio } from "../entities/Portfolio";
/**
 * Add asset to user's portfolio
 */
export declare function addToPortfolio(userId: string, assetId: string, quantity: number, purchasePrice: number): Promise<Portfolio>;
/**
 * Get user's entire portfolio with current prices
 */
export declare function getUserPortfolio(userId: string): Promise<{
    positions: {
        id: string;
        asset: {
            id: string;
            symbol: string;
            name: string;
            imageUrl: string;
        };
        quantity: number;
        averagePurchasePrice: number;
        currentPrice: number;
        currentValue: number;
        costBasis: number;
        profitLoss: number;
        profitLossPercentage: number;
        updatedAt: Date;
    }[];
    totalValue: number;
    totalCost: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
}>;
/**
 * Update portfolio position
 */
export declare function updatePosition(userId: string, positionId: string, quantity?: number, purchasePrice?: number): Promise<Portfolio>;
/**
 * Remove asset from portfolio
 */
export declare function removeFromPortfolio(userId: string, positionId: string): Promise<{
    message: string;
}>;
/**
 * Get single position by ID
 */
export declare function getPositionById(userId: string, positionId: string): Promise<Portfolio>;
declare const _default: {
    addToPortfolio: typeof addToPortfolio;
    getUserPortfolio: typeof getUserPortfolio;
    updatePosition: typeof updatePosition;
    removeFromPortfolio: typeof removeFromPortfolio;
    getPositionById: typeof getPositionById;
};
export default _default;
//# sourceMappingURL=PortfolioService.d.ts.map