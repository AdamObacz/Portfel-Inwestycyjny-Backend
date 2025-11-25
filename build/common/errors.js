"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.ErrorCodes = exports.ErrorKeys = void 0;
var ErrorKeys;
(function (ErrorKeys) {
    ErrorKeys["INVALID_JSON_BODY"] = "invalid_json_body";
    ErrorKeys["INTERNAL_SERVER_ERROR"] = "internal_server_error";
    ErrorKeys["USER_NOT_FOUND"] = "user_not_found";
    ErrorKeys["WATCHLIST_USER_NOT_FOUND"] = "watchlist_user_not_found";
    ErrorKeys["INVALID_ARGUMENT"] = "invalid_argument";
    ErrorKeys["UNAUTHORIZED"] = "unauthorized";
    ErrorKeys["VALIDATION_ERROR"] = "validation_error";
    ErrorKeys["AUTH_FAIL"] = "auth_fail";
    ErrorKeys["USER_ALREADY_EXISTS"] = "user_already_exists";
    ErrorKeys["INVALID_CREDENTIALS"] = "invalid_credentials";
    // Portfolio & Assets
    ErrorKeys["ASSET_NOT_FOUND"] = "asset_not_found";
    ErrorKeys["PORTFOLIO_POSITION_NOT_FOUND"] = "portfolio_position_not_found";
    ErrorKeys["PORTFOLIO_POSITION_ALREADY_EXISTS"] = "portfolio_position_already_exists";
    // External API
    ErrorKeys["EXTERNAL_API_ERROR"] = "external_api_error";
    // Reports
    ErrorKeys["INSUFFICIENT_DATA"] = "insufficient_data";
})(ErrorKeys || (exports.ErrorKeys = ErrorKeys = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["INVALID_JSON_BODY"] = 400] = "INVALID_JSON_BODY";
    ErrorCodes[ErrorCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ErrorCodes[ErrorCodes["RESOURCE_NOT_FOUND"] = 404] = "RESOURCE_NOT_FOUND";
    ErrorCodes[ErrorCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorCodes[ErrorCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCodes[ErrorCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorCodes[ErrorCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCodes[ErrorCodes["CONFLICT"] = 409] = "CONFLICT";
    ErrorCodes[ErrorCodes["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
class CustomError extends Error {
    constructor(statusCode, errorKey, message) {
        super(message);
        this.statusCode = statusCode;
        this.errorKey = errorKey;
    }
}
exports.CustomError = CustomError;
