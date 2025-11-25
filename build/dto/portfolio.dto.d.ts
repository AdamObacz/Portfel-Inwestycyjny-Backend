import { z } from "zod";
export declare const addToPortfolioSchema: z.ZodObject<{
    assetId: z.ZodString;
    quantity: z.ZodNumber;
    purchasePrice: z.ZodNumber;
}, z.core.$strip>;
export declare const updatePortfolioSchema: z.ZodObject<{
    quantity: z.ZodOptional<z.ZodNumber>;
    purchasePrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const searchAssetsSchema: z.ZodObject<{
    query: z.ZodString;
}, z.core.$strip>;
export type AddToPortfolioDto = z.infer<typeof addToPortfolioSchema>;
export type UpdatePortfolioDto = z.infer<typeof updatePortfolioSchema>;
export type SearchAssetsDto = z.infer<typeof searchAssetsSchema>;
//# sourceMappingURL=portfolio.dto.d.ts.map