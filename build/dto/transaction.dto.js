"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionFilterSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
// Schema for creating transaction
exports.createTransactionSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid("Invalid asset ID"),
    type: zod_1.z.enum(["buy", "sell"], { message: "Type must be 'buy' or 'sell'" }),
    quantity: zod_1.z.number().positive("Quantity must be positive"),
    price: zod_1.z.number().positive("Price must be positive"),
    note: zod_1.z.string().optional(),
});
// Schema for filtering transactions
exports.transactionFilterSchema = zod_1.z.object({
    type: zod_1.z.enum(["buy", "sell"]).optional(),
    assetId: zod_1.z.string().uuid().optional(),
    limit: zod_1.z.number().int().positive().max(100).optional(),
    offset: zod_1.z.number().int().nonnegative().optional(),
});
