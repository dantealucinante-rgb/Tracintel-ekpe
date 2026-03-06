import { z } from "zod";

const envSchema = z.object({
    // Database — required for the app to function
    DATABASE_URL: z.string().url().optional().or(z.literal("")),
    DIRECT_URL: z.string().url().optional(),

    // AI Keys — all optional; missing keys trigger simulation mode
    GOOGLE_GEMINI_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    SIMULATION_MODE: z.string().optional(),

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),

    // Canonical site URL
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

    // Upstash Redis (for rate limiting)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const _env = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    SIMULATION_MODE: process.env.SIMULATION_MODE,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
});

if (!_env.success) {
    console.warn("⚠️ [Tracintel] Environment validation failed. This is acceptable during build-time if keys are injected at runtime:", _env.error.format());
}

export const env = (_env.data || {}) as any;
