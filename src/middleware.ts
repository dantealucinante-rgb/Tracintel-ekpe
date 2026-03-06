// Middleware for session management and route protection using Supabase
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createMiddlewareClient(request, response)

    // Refresh the session — keeps the auth cookie alive on the response
    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes logic
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/api/scan') ||
        request.nextUrl.pathname.startsWith('/api/strategy')

    if (isProtectedRoute && !user) {
        // Redirect to login if user is not authenticated
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/scan/:path*',
        '/api/strategy/:path*',
    ],
}
