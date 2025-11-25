import { PortfolioSnapshot } from "../entities/PortfolioSnapshot";
/**
 * Create a snapshot of user's portfolio
 */
export declare function createSnapshot(userId: string): Promise<PortfolioSnapshot>;
/**
 * Get daily report (today vs yesterday)
 */
export declare function getDailyReport(userId: string): Promise<{
    date: Date;
    currentValue: number;
    previousValue: number;
    dailyChange: number;
    dailyChangePercentage: number;
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
}>;
/**
 * Get monthly report
 */
export declare function getMonthlyReport(userId: string): Promise<{
    month: number;
    year: number;
    startValue: number;
    endValue: number;
    monthlyChange: number;
    monthlyChangePercentage: number;
    snapshots: {
        date: Date;
        value: number;
        breakdown: {
            assetId: string;
            symbol: string;
            quantity: number;
            currentPrice: number;
            value: number;
        }[];
    }[];
}>;
/**
 * Get performance report for a custom date range
 */
export declare function getPerformanceReport(userId: string, fromDate?: string, toDate?: string): Promise<{
    period: {
        from: Date;
        to: Date;
    };
    startValue: number;
    endValue: number;
    totalChange: number;
    totalChangePercentage: number;
    snapshots: {
        date: Date;
        value: number;
    }[];
    dailyChanges: any[];
}>;
/**
 * Get all snapshots for a user
 */
export declare function getUserSnapshots(userId: string, limit?: number): Promise<{
    date: Date;
    value: number;
    breakdown: {
        assetId: string;
        symbol: string;
        quantity: number;
        currentPrice: number;
        value: number;
    }[];
}[]>;
declare const _default: {
    createSnapshot: typeof createSnapshot;
    getDailyReport: typeof getDailyReport;
    getMonthlyReport: typeof getMonthlyReport;
    getPerformanceReport: typeof getPerformanceReport;
    getUserSnapshots: typeof getUserSnapshots;
};
export default _default;
//# sourceMappingURL=ReportService.d.ts.map