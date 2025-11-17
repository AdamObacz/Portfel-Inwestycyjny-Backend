"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieParserMiddleware = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.cookieParserMiddleware = (0, cookie_parser_1.default)(process.env.COOKIE_SECRET || "your-cookie-secret");
exports.default = exports.cookieParserMiddleware;
