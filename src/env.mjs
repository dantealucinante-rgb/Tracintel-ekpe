import { z } from "zod";

const envSchema = z.object({
    // Database — required for the app to function
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    // AI Keys — all optional; missing keys trigger simulation mode
    GOOGLE_GEMINI_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    SIMULATION_MODE: z.string().optional(),

    // Supabase — optional here because they are NEXT_PUBLIC_ and do not
    // need to be in server-side env validation (the client checks at runtime)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

    // Canonical site URL — used for Supabase auth redirectTo
    // Set to https://your-app.vercel.app in the Vercel dashboard
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
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
});

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables — check your Vercel dashboard.");
}

export const env = _env.data;
