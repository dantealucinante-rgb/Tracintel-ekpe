import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { SignalsService } from '@/lib/core/signals';

export async function GET() {
    try {
        // 1. Get Latest Scan & Org (Mocking single org for MVP)
        const latestScan = await prisma.visibilityScan.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { llmResponses: true, signals: true }
        });

        const org = await prisma.organization.findFirst();

        if (!latestScan || !org) {
            return NextResponse.json({ error: 'No scan data found' }, { status: 404 });
        }

        // 2. Generate Signals
        const signalsService = new SignalsService();
        const data = await signalsService.generateSignals(latestScan, org);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Signals API Error:', error);
        return NextResponse.json({ error: 'Failed to generate signals' }, { status: 500 });
    }
}
