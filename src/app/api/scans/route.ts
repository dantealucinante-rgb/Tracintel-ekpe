import { NextResponse } from 'next/server';
import { ScanService } from '@/lib/core/scan-service';

export async function GET() {
    try {
        const data = await ScanService.getDashboardData();
        // Return all scans from history + latest
        const allScans = data.latestBaseline ? [data.latestBaseline, ...data.history] : data.history;

        // Ensure consistency with the frontend's expectation
        const formatted = allScans.map((s: any) => ({
            id: s.id || Math.random().toString(),
            createdAt: s.date || s.createdAt,
            brand: s.brand || 'Your Brand',
            industry: s.industry || 'Tech',
            score: s.score,
            sentimentScore: s.sentimentScore,
            mentionFrequency: s.mentionFrequency,
            citationDensity: s.citationDensity,
            competitors: s.competitors || [],
            status: 'COMPLETED',
            benchmarkDelta: s.benchmarkDelta || 0,
            signals: s.signals || []
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error('[API Scans] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 500 });
    }
}
