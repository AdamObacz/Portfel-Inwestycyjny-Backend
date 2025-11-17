import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

redisClient.on("connect", () => {
  console.log("✓ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("✗ Redis error:", err);
});

export default redisClient;
