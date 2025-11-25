"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAssetsSchema = exports.updatePortfolioSchema = exports.addToPortfolioSchema = void 0;
const zod_1 = require("zod");
// Schema for adding asset to portfolio
exports.addToPortfolioSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid("Invalid asset ID"),
    quantity: zod_1.z.number().positive("Quantity must be positive"),
    purchasePrice: zod_1.z.number().positive("Purchase price must be positive"),
});
// Schema for updating portfolio position
exports.updatePortfolioSchema = zod_1.z.object({
    quantity: zod_1.z.number().positive("Quantity must be positive").optional(),
    purchasePrice: zod_1.z.number().positive("Purchase price must be positive").optional(),
});
// Schema for searching assets
exports.searchAssetsSchema = zod_1.z.object({
    query: zod_1.z.string().min(1, "Search query is required"),
});
