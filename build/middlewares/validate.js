"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errors_1 = require("../common/errors");
const validate = (schemas) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let result;
    const validatedData = {};
    try {
        if (schemas.params) {
            result = schemas.params.safeParse(req.params);
            if (!result.success) {
                throw new errors_1.CustomError(errors_1.ErrorCodes.BAD_REQUEST, errors_1.ErrorKeys.VALIDATION_ERROR, result.error.issues.map((e) => e.message).join(", "));
            }
            Object.assign(validatedData, result.data);
        }
        if (schemas.query) {
            result = schemas.query.safeParse(req.query);
            if (!result.success) {
                throw new errors_1.CustomError(errors_1.ErrorCodes.BAD_REQUEST, errors_1.ErrorKeys.VALIDATION_ERROR, result.error.issues.map((e) => e.message).join(", "));
            }
            Object.assign(validatedData, result.data);
        }
        if (schemas.body) {
            result = schemas.body.safeParse(yield req.json());
            if (!result.success) {
                throw new errors_1.CustomError(errors_1.ErrorCodes.BAD_REQUEST, errors_1.ErrorKeys.VALIDATION_ERROR, result.error.issues.map((e) => e.message).join(", "));
            }
            Object.assign(validatedData, result.data);
        }
        req.locals.validatedData = validatedData;
    }
    catch (err) {
        if (err instanceof errors_1.CustomError) {
            return res
                .status(err.statusCode)
                .json({ message: err.message, key: err.errorKey });
        }
        return res.status(400).json({
            message: (_a = err.message) !== null && _a !== void 0 ? _a : "Validation error",
            key: errors_1.ErrorKeys.VALIDATION_ERROR,
        });
    }
});
exports.validate = validate;
