import { NextResponse } from 'next/server';
import { ScanService } from '@/lib/core/scan-service';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const scanId = params.id;
        if (!scanId) {
            return NextResponse.json({ error: 'Missing Scan ID' }, { status: 400 });
        }

        const scan = await ScanService.getScanById(scanId);
        return NextResponse.json(scan);
    } catch (error: any) {
        console.error('[API Scans ID] Error:', error);
        if (error.message === 'UNAUTHORIZED') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message === 'SCAN_NOT_FOUND') {
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
