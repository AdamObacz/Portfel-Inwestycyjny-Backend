import { z } from "zod";
export declare const createTransactionSchema: z.ZodObject<{
    assetId: z.ZodString;
    type: z.ZodEnum<{
        buy: "buy";
        sell: "sell";
    }>;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const transactionFilterSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        buy: "buy";
        sell: "sell";
    }>>;
    assetId: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type TransactionFilterDto = z.infer<typeof transactionFilterSchema>;
//# sourceMappingURL=transaction.dto.d.ts.map