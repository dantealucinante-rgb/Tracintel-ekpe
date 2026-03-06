// HTTP handler for brand visibility scans with session verification and input validation
import { NextRequest, NextResponse } from 'next/server'
import { ScanService } from '@/lib/core/scan-service'
import { z } from 'zod'
import { createClient as createSupabaseServer } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/ratelimit'
import { env } from '@/env'

const scanSchema = z.object({
    brand: z.string().min(1),
    industry: z.string().min(1),
    competitors: z.array(z.string()).min(1)
})

export async function POST(request: NextRequest) {
    try {
        // 1. Rate Limiting Check (by Supabase User ID)
        // sliding window: 10 requests per 60 seconds
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()

        if (user && env.UPSTASH_REDIS_REST_URL) {
            const { success } = await ratelimit.limit(`ratelimit_scan_${user.id}`)
            if (!success) {
                return NextResponse.json(
                    { error: "Too many requests. Please wait before scanning again." },
                    { status: 429 }
                )
            }
        }

        const body = await request.json()

        // 1. Validate Input with Zod
        const validated = scanSchema.safeParse(body)
        if (!validated.success) {
            return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 })
        }

        // 2. Execute Scan Logic via Service
        const result = await ScanService.executeScan(validated.data)

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('[API Scan] Unexpected error:', error.message)
            return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
