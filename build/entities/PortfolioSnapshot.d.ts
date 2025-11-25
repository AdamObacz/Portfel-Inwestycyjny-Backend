import { User } from "./User";
export declare class PortfolioSnapshot {
    id: string;
    userId: string;
    user: User;
    snapshotDate: Date;
    totalValue: number;
    breakdown: {
        assetId: string;
        symbol: string;
        quantity: number;
        currentPrice: number;
        value: number;
    }[];
    createdAt: Date;
}
//# sourceMappingURL=PortfolioSnapshot.d.ts.map