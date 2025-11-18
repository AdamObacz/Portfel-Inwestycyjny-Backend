export enum ErrorKeys {
  INVALID_JSON_BODY = "invalid_json_body",
  INTERNAL_SERVER_ERROR = "internal_server_error",

  USER_NOT_FOUND = "user_not_found",
  WATCHLIST_USER_NOT_FOUND = "watchlist_user_not_found",
  INVALID_ARGUMENT = "invalid_argument",
  UNAUTHORIZED = "unauthorized",

  VALIDATION_ERROR = "validation_error",
  AUTH_FAIL = "auth_fail",
}

export enum ErrorCodes {
  INVALID_JSON_BODY = 400,
  INTERNAL_SERVER_ERROR = 500,
  RESOURCE_NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export class CustomError extends Error {
  statusCode: number;
  errorKey: string;
  constructor(statusCode: number, errorKey: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorKey = errorKey;
  }
}
