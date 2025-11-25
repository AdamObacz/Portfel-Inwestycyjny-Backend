import { z } from "zod";
export declare const reportDateRangeSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ReportDateRangeDto = z.infer<typeof reportDateRangeSchema>;
//# sourceMappingURL=report.dto.d.ts.map