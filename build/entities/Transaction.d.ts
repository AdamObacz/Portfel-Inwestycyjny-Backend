import { User } from "./User";
import { Asset } from "./Asset";
export declare class Transaction {
    id: string;
    userId: string;
    user: User;
    assetId: string;
    asset: Asset;
    type: "buy" | "sell";
    quantity: number;
    price: number;
    totalValue: number;
    note: string;
    createdAt: Date;
}
//# sourceMappingURL=Transaction.d.ts.map