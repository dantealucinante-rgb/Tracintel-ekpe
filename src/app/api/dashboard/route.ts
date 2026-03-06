// HTTP handler for fetching organization dashboard analytics and recent scan history
import { NextRequest, NextResponse } from 'next/server'
import { ScanService } from '@/lib/core/scan-service'

export async function GET(request: NextRequest) {
    try {
        // 1. Execute Data Fetching via Service
        const scans = await ScanService.getDashboardData()

        return NextResponse.json({
            success: true,
            data: scans
        })

    } catch (error: any) {
        if (error.message === 'UNAUTHORIZED') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error.message === 'ORG_NOT_FOUND') {
            return NextResponse.json({ error: 'Organization profile not found' }, { status: 404 })
        }

        console.error('[API Dashboard] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 })
    }
}
