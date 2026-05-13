import dotenv from "dotenv";
dotenv.config();
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_DATABASE_URI!, {
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis FULL error:", err);
});

export default redis;
