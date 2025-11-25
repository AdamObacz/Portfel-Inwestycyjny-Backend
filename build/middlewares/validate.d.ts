import { Request, Response, MiddlewareNext } from "hyper-express";
import { z } from "zod";
type ValidationSchemas = {
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    body?: z.ZodTypeAny;
};
export type FromSchema<S extends z.ZodTypeAny> = z.infer<S>;
export declare const validate: (schemas: ValidationSchemas) => (req: Request, res: Response, next: MiddlewareNext) => Promise<boolean>;
export {};
//# sourceMappingURL=validate.d.ts.map