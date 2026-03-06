import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { env } from '@/env';

export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

export async function GET() {
    const health: any = {
        database: 'Checking...',
        ai_services: {
            gemini: 'Checking...',
            openai: 'Checking...',
            anthropic: 'Checking...'
        },
        timestamp: new Date().toISOString(),
        status: 'PENDING'
    };

    try {
        // 1. Database Check
        await prisma.$queryRaw`SELECT 1`;
        health.database = 'OK';
    } catch (e: any) {
        console.error('Health Check DB Error:', e);
        health.database = e.code === 'P1001' ? 'ERROR (UNREACHABLE)' : 'ERROR';
        health.status = 'DEGRADED';
        health.error_details = e.message;
    }

    // 2. Secret Audit (Check if env vars exist)
    const providers = {
        gemini: !!env.GOOGLE_GEMINI_API_KEY,
        openai: !!env.OPENAI_API_KEY,
        anthropic: !!env.ANTHROPIC_API_KEY
    };

    health.ai_services.gemini = providers.gemini ? 'CONFIGURED' : 'MISSING';
    health.ai_services.openai = providers.openai ? 'CONFIGURED' : 'MISSING';
    health.ai_services.anthropic = providers.anthropic ? 'CONFIGURED' : 'MISSING';

    if (!providers.gemini && !providers.openai && !providers.anthropic) {
        health.status = 'CRITICAL';
    } else if (health.status !== 'DEGRADED') {
        health.status = 'HEALTHY';
    }

    return NextResponse.json(health);
}
