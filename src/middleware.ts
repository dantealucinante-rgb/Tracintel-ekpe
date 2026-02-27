import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export async function middleware(request: NextRequest) {
    // Bail early if env vars are missing — prevents cryptic Supabase client crashes on Vercel
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error(
            '[Tracintel Middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
            'Add them in the Vercel Environment Variables dashboard.'
        );
        return NextResponse.next({ request: { headers: request.headers } });
    }

    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // Refresh the session — keeps the auth cookie alive on the response
    await supabase.auth.getUser()

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/scan/:path*',
        '/api/signal/:path*',
    ],
}
