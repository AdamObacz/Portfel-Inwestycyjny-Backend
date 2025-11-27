import session from "express-session";
import { RedisStore } from "connect-redis";
import { redisClient } from "../config/redis";

// Using Redis for session storage
const store = new RedisStore({
  client: redisClient as any,
  prefix: "sess:",
  ttl: 60 * 60 * 24 * 7, // 7 days
});

// Fallback to MemoryStore if needed:
// const store = new session.MemoryStore();

//FIX: Do naprawy
export const sessionMiddleware = session({
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

export default sessionMiddleware;
