import { Transaction } from "../entities/Transaction";
/**
 * Create a new transaction
 */
export declare function createTransaction(userId: string, assetId: string, type: "buy" | "sell", quantity: number, price: number, note?: string): Promise<Transaction>;
/**
 * Get all transactions for a user
 */
export declare function getUserTransactions(userId: string, filters?: {
    type?: "buy" | "sell";
    assetId?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    id: string;
    type: "buy" | "sell";
    asset: {
        id: string;
        symbol: string;
        name: string;
        imageUrl: string;
    };
    quantity: number;
    price: number;
    totalValue: number;
    note: string;
    createdAt: Date;
}[]>;
/**
 * Get recent transactions (last 10 by default)
 */
export declare function getRecentTransactions(userId: string, limit?: number): Promise<{
    id: string;
    type: "buy" | "sell";
    asset: {
        id: string;
        symbol: string;
        name: string;
        imageUrl: string;
    };
    quantity: number;
    price: number;
    totalValue: number;
    note: string;
    createdAt: Date;
}[]>;
/**
 * Get transaction summary (total spent, total received)
 */
export declare function getTransactionSummary(userId: string): Promise<{
    totalSpent: number;
    totalReceived: number;
    netProfit: number;
    totalTransactions: number;
    buyCount: number;
    sellCount: number;
}>;
/**
 * Get single transaction by ID
 */
export declare function getTransactionById(userId: string, transactionId: string): Promise<{
    id: string;
    type: "buy" | "sell";
    asset: {
        id: string;
        symbol: string;
        name: string;
        imageUrl: string;
    };
    quantity: number;
    price: number;
    totalValue: number;
    note: string;
    createdAt: Date;
}>;
/**
 * Delete transaction
 */
export declare function deleteTransaction(userId: string, transactionId: string): Promise<{
    message: string;
}>;
declare const _default: {
    createTransaction: typeof createTransaction;
    getUserTransactions: typeof getUserTransactions;
    getRecentTransactions: typeof getRecentTransactions;
    getTransactionSummary: typeof getTransactionSummary;
    getTransactionById: typeof getTransactionById;
    deleteTransaction: typeof deleteTransaction;
};
export default _default;
//# sourceMappingURL=TransactionService.d.ts.map