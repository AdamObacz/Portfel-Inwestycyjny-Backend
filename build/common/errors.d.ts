export declare enum ErrorKeys {
    INVALID_JSON_BODY = "invalid_json_body",
    INTERNAL_SERVER_ERROR = "internal_server_error",
    USER_NOT_FOUND = "user_not_found",
    WATCHLIST_USER_NOT_FOUND = "watchlist_user_not_found",
    INVALID_ARGUMENT = "invalid_argument",
    UNAUTHORIZED = "unauthorized",
    VALIDATION_ERROR = "validation_error",
    AUTH_FAIL = "auth_fail",
    USER_ALREADY_EXISTS = "user_already_exists",
    INVALID_CREDENTIALS = "invalid_credentials",
    ASSET_NOT_FOUND = "asset_not_found",
    PORTFOLIO_POSITION_NOT_FOUND = "portfolio_position_not_found",
    PORTFOLIO_POSITION_ALREADY_EXISTS = "portfolio_position_already_exists",
    TRANSACTION_NOT_FOUND = "transaction_not_found",
    EXTERNAL_API_ERROR = "external_api_error",
    INSUFFICIENT_DATA = "insufficient_data"
}
export declare enum ErrorCodes {
    INVALID_JSON_BODY = 400,
    INTERNAL_SERVER_ERROR = 500,
    RESOURCE_NOT_FOUND = 404,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500
}
export declare class CustomError extends Error {
    statusCode: number;
    errorKey: string;
    constructor(statusCode: number, errorKey: string, message: string);
}
//# sourceMappingURL=errors.d.ts.map