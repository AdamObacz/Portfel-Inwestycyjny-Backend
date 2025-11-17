import session from "express-session";
import { redisClient } from "../config/redis";

// Simple in-memory store for now (Redis store issues with types)
// TODO: Replace with proper RedisStore when connect-redis types are fixed
const memoryStore = new session.MemoryStore();

export const sessionMiddleware = session({
  store: memoryStore,
  secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
  },
});

export default sessionMiddleware;
