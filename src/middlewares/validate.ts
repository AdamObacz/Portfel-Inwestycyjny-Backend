import { Request, Response, MiddlewareNext } from "hyper-express";
import { z } from "zod";
import { CustomError, ErrorCodes, ErrorKeys } from "../common/errors";

type ValidationSchemas = {
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  body?: z.ZodTypeAny;
};
export type FromSchema<S extends z.ZodTypeAny> = z.infer<S>;
export const validate =
  (schemas: ValidationSchemas) =>
  async (req: Request, res: Response, next: MiddlewareNext) => {
    let result;
    const validatedData: any = {};
    try {
      if (schemas.params) {
        result = schemas.params.safeParse(req.params);
        if (!result.success) {
          throw new CustomError(
            ErrorCodes.BAD_REQUEST,
            ErrorKeys.VALIDATION_ERROR,
            result.error.issues.map((e) => e.message).join(", ")
          );
        }
        Object.assign(validatedData, result.data);
      }

      if (schemas.query) {
        result = schemas.query.safeParse(req.query);
        if (!result.success) {
          throw new CustomError(
            ErrorCodes.BAD_REQUEST,
            ErrorKeys.VALIDATION_ERROR,
            result.error.issues.map((e) => e.message).join(", ")
          );
        }
        Object.assign(validatedData, result.data);
      }

      if (schemas.body) {
        result = schemas.body.safeParse(await req.json());
        if (!result.success) {
          throw new CustomError(
            ErrorCodes.BAD_REQUEST,
            ErrorKeys.VALIDATION_ERROR,
            result.error.issues.map((e) => e.message).join(", ")
          );
        }
        Object.assign(validatedData, result.data);
      }
      req.locals.validatedData = validatedData;
    } catch (err: any) {
      if (err instanceof CustomError) {
        return res
          .status(err.statusCode)
          .json({ message: err.message, key: err.errorKey });
      }

      return res.status(400).json({
        message: err.message ?? "Validation error",
        key: ErrorKeys.VALIDATION_ERROR,
      });
    }
  };
