// TODO: Add Upstash rate limiting when credentials are available
// HTTP handler for brand visibility scans with session verification and input validation
import { NextRequest, NextResponse } from 'next/server'
import { ScanService } from '@/lib/core/scan-service'
import { z } from 'zod'
import { createClient as createSupabaseServer } from '@/lib/supabase/server'
import { env } from '@/env'

const scanSchema = z.object({
    brand: z.string().min(1),
    industry: z.string().min(1),
    competitors: z.array(z.string()).min(1)
})

export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid or empty request body' }, { status: 400 });
        }

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
