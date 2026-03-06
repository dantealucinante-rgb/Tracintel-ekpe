import { NextResponse } from 'next/server';
import { ScanService } from '@/lib/core/scan-service';

// ─── SWR cache headers ────────────────────────────────────────────────────────
const SWR_HEADERS = {
    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
};

export async function GET() {
    try {
        const stats = await ScanService.getDashboardData();

        return NextResponse.json(
            { ...stats, _source: 'live' },
            { status: 200, headers: SWR_HEADERS }
        );
    } catch (error: any) {
        console.error('API Error:', error);

        if (error.message === 'UNAUTHORIZED') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Handle DB connection issues or other service errors
        return NextResponse.json(
            { error: 'Failed to fetch stats', message: error.message },
            { status: 500 }
        );
    }
}
