import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            '[Tracintel] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. ' +
            'Add them to your Vercel Environment Variables dashboard.'
        );
    }

    const cookieStore = await cookies()

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch {
                        // Called from a Server Component — safe to ignore.
                        // Middleware handles session refresh.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch {
                        // Called from a Server Component — safe to ignore.
                    }
                },
            },
        }
    )
}

// Admin client — initialised on-demand to prevent module-level env crashes
export const getSupabaseAdmin = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error(
            '[Tracintel] SUPABASE_SERVICE_ROLE_KEY is required for admin operations. ' +
            'Add it to your Vercel Environment Variables dashboard.'
        );
    }
    if (!supabaseUrl) {
        throw new Error('[Tracintel] NEXT_PUBLIC_SUPABASE_URL must be set.');
    }
    return createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
};
