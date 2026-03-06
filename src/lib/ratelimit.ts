// Upstash Redis-based rate limiting configuration for API protection
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

// Initialize Redis client
// Note: If environment variables are missing, this client will fail to initialize.
// We use a singleton pattern here.
const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL || "",
    token: env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Rate limiting configuration: 10 requests per 60 seconds (sliding window)
 * This prevents abuse of high-cost AI scan operations.
 */
export const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});
