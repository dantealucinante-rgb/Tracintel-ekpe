// Server-side Supabase client for API routes, server actions, and server components
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Soft guard: return a mock/unauthenticated client if keys are missing during build/init
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[Tracintel] Server Client initialized with missing keys.');
        return createServerClient(
            'https://placeholder.supabase.co',
            'placeholder-key',
            { cookies: { get() { return undefined } } }
        )
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
                        // This can be ignored if the component is being rendered on the server
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch {
                        // This can be ignored if the component is being rendered on the server
                    }
                },
            },
        }
    )
}

/**
 * Specialized client for Next.js Middleware.
 * Middleware doesn't support the 'cookies()' helper for writing, so we must pass req/res.
 */
export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return createServerClient(
            'https://placeholder.supabase.co',
            'placeholder-key',
            { cookies: { get() { return undefined } } }
        )
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )
}

export const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey || !supabaseUrl) {
        console.warn('[Tracintel] Admin Client missing keys.');
        return null as any;
    }
    return createSupabaseClient(supabaseUrl, serviceRoleKey);
};
