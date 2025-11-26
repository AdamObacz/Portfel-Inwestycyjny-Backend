"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const test_1 = __importDefault(require("./test"));
const auth_1 = __importDefault(require("./auth"));
const portfolio_1 = __importDefault(require("./portfolio"));
const reports_1 = __importDefault(require("./reports"));
const transaction_1 = __importDefault(require("./transaction"));
const market_1 = __importDefault(require("./market"));
function registerRoutes(app) {
    app.use("/api/auth", auth_1.default);
    app.use("/api/portfolio", portfolio_1.default);
    app.use("/api/reports", reports_1.default);
    app.use("/api/transactions", transaction_1.default);
    app.use("/api/market", market_1.default);
    app.use("/api", test_1.default);
}
