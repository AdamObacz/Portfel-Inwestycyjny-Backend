"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
    db: 0,
    retryStrategy(times) {
        // Stop retrying after 3 attempts
        if (times > 3) {
            return null;
        }
        return Math.min(times * 1000, 3000);
    },
});
let errorLogged = false;
exports.redisClient.on("connect", () => {
    console.log("✓ Redis connected");
    errorLogged = false; // Reset flag when connected
});
exports.redisClient.on("error", (err) => {
    if (!errorLogged) {
        console.error("✗ Redis error:", err.message);
        errorLogged = true; // Log only once
    }
});
exports.default = exports.redisClient;
