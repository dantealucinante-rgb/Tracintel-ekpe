// Exchange OAuth PKCE code for a session and redirect to the dashboard
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        try {
            const supabase = await createClient()
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (!error) {
                return NextResponse.redirect(`${origin}${next}`)
            }

            console.error('[Auth Callback] Error exchanging code for session:', error.message)
        } catch (err) {
            console.error('[Auth Callback] Unexpected error during session exchange:', err)
        }
    }

    // Return the user to an error page or login if something went wrong
    return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
