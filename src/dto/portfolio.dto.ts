import { z } from "zod";

// Schema for adding asset to portfolio
export const addToPortfolioSchema = z.object({
  assetId: z.string().uuid("Invalid asset ID"),
  quantity: z.number().positive("Quantity must be positive"),
  purchasePrice: z.number().positive("Purchase price must be positive"),
});

// Schema for updating portfolio position
export const updatePortfolioSchema = z.object({
  quantity: z.number().positive("Quantity must be positive").optional(),
  purchasePrice: z.number().positive("Purchase price must be positive").optional(),
});

// Schema for searching assets
export const searchAssetsSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export type AddToPortfolioDto = z.infer<typeof addToPortfolioSchema>;
export type UpdatePortfolioDto = z.infer<typeof updatePortfolioSchema>;
export type SearchAssetsDto = z.infer<typeof searchAssetsSchema>;
