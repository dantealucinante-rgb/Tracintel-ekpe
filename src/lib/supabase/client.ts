import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

if (!supabaseUrl || !supabaseAnonKey) {
    // Warn loudly in development; in production this will fail the first auth call gracefully
    console.warn(
        '[Tracintel] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
        'Set these in your Vercel dashboard under Environment Variables.'
    );
}

export const createClient = () =>
    createBrowserClient(
        supabaseUrl ?? '',
        supabaseAnonKey ?? '',

    )
