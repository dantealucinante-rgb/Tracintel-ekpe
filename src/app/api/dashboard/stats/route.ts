import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DashboardStats, Signal } from '@/lib/types';

// ─── Mock Intelligence payload ────────────────────────────────────────────────
// Shown when the database has no scans yet, so the dashboard looks "full"
// immediately after a client logs in for the first time.
const MOCK_INTELLIGENCE = {
    latest: {
        id: 'demo-scan-001',
        score: 74,
        latentDensity: 0.68,
        date: new Date().toISOString(),
        breakdown: { direct: 71, som: { openai: 0.74, perplexity: 0.68, gemini: 0.72 } },
        signals: [
            {
                type: 'STRATEGY_INJECTION',
                source: 'Tracintel Engine (Demo)',
                content: 'Brand centroid mapped at 0.78 cosine similarity to high-intent GEO queries. Citation density is 23% above sector average.',
                createdAt: new Date().toISOString(),
            },
            {
                type: 'STRATEGY_INJECTION',
                source: 'RAG Audit Layer',
                content: 'Perplexity reranker pass-through rate at 91.4%. Schema.org entity coverage verified across 14 key product pages.',
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            },
            {
                type: 'STRATEGY_INJECTION',
                source: 'Hallucination Shield',
                content: 'Zero ground-truth divergence events in the last 48h across GPT-4o and Claude 3.5 Sonnet.',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
        ] as Signal[],
        provider: 'Demo Mode — Run a scan to see live data',
    },
    history: [
        { date: new Date(Date.now() - 4 * 86400000).toISOString(), score: 52 },
        { date: new Date(Date.now() - 3 * 86400000).toISOString(), score: 61 },
        { date: new Date(Date.now() - 2 * 86400000).toISOString(), score: 68 },
        { date: new Date(Date.now() - 1 * 86400000).toISOString(), score: 72 },
        { date: new Date().toISOString(), score: 74 },
    ],
} satisfies DashboardStats;

// ─── SWR cache headers ────────────────────────────────────────────────────────
// 60s fresh, then serve stale while revalidating in the background for 5 min.
// Keeps the dashboard snappy for the client on Vercel's edge.
const SWR_HEADERS = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET() {
    try {
        let latestScan;
        try {
            latestScan = await prisma.visibilityScan.findFirst({
                orderBy: { createdAt: 'desc' },
                include: {
                    responses: { orderBy: { createdAt: 'desc' } },
                    signals: true,
                },
            });
        } catch (dbError: any) {
            console.error('Database Connection Error during Stats fetch:', dbError);
            if (dbError.code === 'P1001' || dbError.message?.includes("Can't reach database server")) {
                // Return mock data with a degraded flag so the UI still renders
                return NextResponse.json(
                    { ...MOCK_INTELLIGENCE, _source: 'mock:db_unreachable' },
                    { status: 200, headers: SWR_HEADERS }
                );
            }
            throw dbError;
        }

        // ── Empty state: no scans yet → return rich demo data ──────────────────
        if (!latestScan) {
            return NextResponse.json(
                { ...MOCK_INTELLIGENCE, _source: 'mock:empty_db' },
                { status: 200, headers: { ...SWR_HEADERS, 'X-Data-Source': 'mock' } }
            );
        }

        // ── Live data path ──────────────────────────────────────────────────────
        const calculateScore = (scan: any): number => {
            const responses = (scan.responses || []) as Array<{ sentimentScore?: number }>;
            if (responses.length === 0) return 0;
            const total = responses.reduce((sum: number, r) => sum + (r.sentimentScore || 0), 0);
            return Math.round(total / responses.length);
        };

        const latestScore = calculateScore(latestScan);
        const responses = (latestScan.responses || []) as Array<{
            latentDensity?: number;
            modelName?: string;
            structuredData?: any;
        }>;

        const latentDensity =
            responses.length > 0
                ? responses.reduce((sum, r) => sum + (r.latentDensity || 0), 0) / responses.length
                : 0;

        const breakdown = responses.reduce(
            (acc, response) => {
                const data = (response.structuredData as any) || {};
                return {
                    direct: (acc.direct || 0) + (data.visibilityScore || 0),
                    som: (data.som || acc.som || {}) as Record<string, number>,
                };
            },
            { direct: 0, som: {} as Record<string, number> }
        );

        const historyScans = await prisma.visibilityScan.findMany({
            take: 5,
            orderBy: { createdAt: 'asc' },
            include: { responses: true },
        });

        const history = historyScans.map((scan) => ({
            date: scan.createdAt.toISOString(),
            score: calculateScore(scan),
        }));

        return NextResponse.json(
            {
                latest: {
                    id: latestScan.id,
                    score: latestScore,
                    latentDensity,
                    date: latestScan.createdAt,
                    breakdown,
                    signals: (latestScan.signals as unknown as Signal[]) || [],
                    provider: responses[0]?.modelName || 'Unknown',
                },
                history,
                _source: 'live',
            } as DashboardStats & { _source: string },
            { status: 200, headers: SWR_HEADERS }
        );
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
