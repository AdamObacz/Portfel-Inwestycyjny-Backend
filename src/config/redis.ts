import Redis from "ioredis";

export const redisClient = new Redis({
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

redisClient.on("connect", () => {
  console.log("✓ Redis connected");
  errorLogged = false; // Reset flag when connected
});

redisClient.on("error", (err) => {
  if (!errorLogged) {
    console.error("✗ Redis error:", err.message);
    errorLogged = true; // Log only once
  }
});

export default redisClient;
