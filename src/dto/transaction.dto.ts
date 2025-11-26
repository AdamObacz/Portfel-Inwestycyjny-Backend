import { z } from "zod";

// Schema for creating transaction
export const createTransactionSchema = z.object({
  assetId: z.string().uuid("Invalid asset ID"),
  type: z.enum(["buy", "sell"], { message: "Type must be 'buy' or 'sell'" }),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  note: z.string().optional(),
});

// Schema for filtering transactions
export const transactionFilterSchema = z.object({
  type: z.enum(["buy", "sell"]).optional(),
  assetId: z.string().uuid().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type TransactionFilterDto = z.infer<typeof transactionFilterSchema>;
