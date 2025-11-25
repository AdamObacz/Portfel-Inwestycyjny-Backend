"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = require("connect-redis");
const redis_1 = require("../config/redis");
// Using Redis for session storage
const store = new connect_redis_1.RedisStore({
    client: redis_1.redisClient,
    prefix: "sess:",
    ttl: 60 * 60 * 24 * 7, // 7 days
});
// Fallback to MemoryStore if needed:
// const store = new session.MemoryStore();
exports.sessionMiddleware = (0, express_session_1.default)({
    store: store,
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
        sameSite: "lax",
    },
});
exports.default = exports.sessionMiddleware;
