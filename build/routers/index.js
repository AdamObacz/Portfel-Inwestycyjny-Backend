"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const test_1 = __importDefault(require("./test"));
const auth_1 = __importDefault(require("./auth"));
function registerRoutes(app) {
    app.use("/api/auth", auth_1.default);
    app.use("/api", test_1.default);
}
