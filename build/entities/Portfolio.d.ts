import { User } from "./User";
import { Asset } from "./Asset";
export declare class Portfolio {
    id: string;
    userId: string;
    user: User;
    assetId: string;
    asset: Asset;
    quantity: number;
    averagePurchasePrice: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Portfolio.d.ts.map