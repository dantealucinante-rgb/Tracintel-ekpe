import { NextRequest, NextResponse } from 'next/server';
import { FallbackProvider } from '@/lib/ai/fallback';
import { ScannerService, BrandProfile } from '@/lib/core/scanner';
import prisma from '@/lib/db';
import {
    PLAN_LIMITS,
    RESTRICTED_MODELS_STARTER,
    RESTRICTED_MODELS_GROWTH,
    type PlanTierId,
} from '@/lib/constants/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { name, industry, competitors, requestedModels = [] } = body;

        // ── Org bootstrap ──────────────────────────────────────────────────
        let org: any = null;
        try {
            org = await prisma.organization.findFirst();
            if (!org) {
                org = await prisma.organization.create({
                    data: {
                        name: 'Demo Org',
                        slug: 'demo',
                        planTier: 'STARTER' as any,
                        usageCount: 0,
                        monthlyAnalysisLimit: 120
                    }
                });
            }
        } catch (dbError: any) {
            console.error('Database Connection Error during Org check:', dbError);
            if (dbError.code === 'P1001' || dbError.message?.includes("Can't reach database server")) {
                return NextResponse.json({
                    success: false,
                    error: 'Database Connection Required: The intelligence engine could not establish a secure handshake with the neural vault.',
                    code: 'DATABASE_UNREACHABLE'
                }, { status: 503 });
            }
            throw dbError;
        }

        if (!org) {
            throw new Error('Failed to resolve Organization context.');
        }

        const planTier: PlanTierId = (org.planTier as PlanTierId) ?? 'STARTER';
        const planLimits = PLAN_LIMITS[planTier];

        // ── Guard A: Model Access ──────────────────────────────────────────
        if (planTier === 'STARTER' && requestedModels.some((m: string) => RESTRICTED_MODELS_STARTER.includes(m))) {
            return NextResponse.json({
                success: false,
                error: 'Upgrade Required: Your Starter plan only supports single-model execution (ChatGPT). Upgrade to Growth or above to unlock Perplexity and additional models.',
                code: 'MODEL_ACCESS_DENIED',
                upgradeUrl: '/pricing',
            }, { status: 403 });
        }

        if (planTier === 'GROWTH' && requestedModels.some((m: string) => RESTRICTED_MODELS_GROWTH.includes(m))) {
            return NextResponse.json({
                success: false,
                error: 'Upgrade Required: Your Growth plan supports ChatGPT and Perplexity. Upgrade to Pro or Scale to unlock Claude and AIO models.',
                code: 'MODEL_ACCESS_DENIED',
                upgradeUrl: '/pricing',
            }, { status: 403 });
        }

        // ── Guard B: Usage Cap ────────────────────────────────────────────
        const currentUsage = (org as any).usageCount ?? 0;
        const monthlyLimit = (org as any).monthlyAnalysisLimit ?? planLimits.monthlyLimit;

        if (currentUsage >= monthlyLimit) {
            return NextResponse.json({
                success: false,
                error: `Monthly limit reached: Your ${planTier} plan allows ${monthlyLimit} AI answers per month. Upgrade your plan or wait for the next billing cycle.`,
                code: 'USAGE_LIMIT_EXCEEDED',
                usageCount: currentUsage,
                limit: monthlyLimit,
                upgradeUrl: '/pricing',
            }, { status: 429 });
        }

        // ── Scale Tier: Priority Queue placeholder ────────────────────────
        if (planTier === 'SCALE') {
            console.log('[SCALE] Priority queue routing – to be implemented in next sprint');
        }

        // ── Data source bootstrap ─────────────────────────────────────────
        let ds = await prisma.dataSource.findFirst({ where: { organizationId: org.id } });
        if (!ds) {
            ds = await prisma.dataSource.create({
                data: {
                    type: 'WEB',
                    name: 'Default Web Intel',
                    config: {},
                    organizationId: org.id
                }
            });
        }

        const profile: BrandProfile = {
            name: name || 'Tracintel',
            industry: industry || 'Generative Engine Optimization (GEO)',
            competitors: competitors || ['Google Search', 'Perplexity', 'OpenAI Search'],
            organizationId: org.id,
            dataSourceId: (ds as any).id
        };

        // ── Simulation mode ───────────────────────────────────────────────
        if (process.env.SIMULATION_MODE === 'true' || !process.env.GOOGLE_GEMINI_API_KEY) {
            console.log('--- ENTERING SIMULATION MODE ---');

            await prisma.organization.update({
                where: { id: org.id },
                data: { usageCount: { increment: 1 } }
            });

            return NextResponse.json({
                success: true,
                data: {
                    id: `sim-${Date.now()}`,
                    status: 'COMPLETED',
                    brand: profile.name,
                    industry: profile.industry,
                    metrics: {
                        visibilityRank: 1,
                        mentionFrequency: 88,
                        citationDensity: 74,
                        sentimentPolarization: 92,
                        latentDensity: 0.85,
                        accuracyScore: 98
                    },
                    gaps: [
                        { id: 'sim-gap-1', type: 'CITATION_FIX', title: 'Simulated Gap: Citation Density', severity: 'HIGH' }
                    ]
                },
                meta: {
                    usageCount: currentUsage + 1,
                    limit: monthlyLimit,
                    planTier,
                },
                message: 'Intelligence scan completed successfully (SIMULATION MODE).'
            });
        }

        // ── Live scan ─────────────────────────────────────────────────────
        const provider = new FallbackProvider();
        const scanner = new ScannerService(provider);
        const result = await scanner.runScan(profile);

        await prisma.organization.update({
            where: { id: org.id },
            data: { usageCount: { increment: 1 } }
        });

        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                usageCount: currentUsage + 1,
                limit: monthlyLimit,
                planTier,
            },
            message: 'Intelligence scan completed successfully.'
        });

    } catch (error: any) {
        console.error('Scan Execution Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Intelligence Engine failed to process the request.',
            code: 'SCAN_FAILURE',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
