// Core service for orchestrating visibility scans, usage validation, and data persistence
import { createClient as createSupabaseServer } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { runWithFallback } from '@/lib/ai/providers'
import { ScanInput } from '@/lib/ai/providers/types'
import { LlmProvider } from '@prisma/client'
import { SomEngine } from '@/lib/ai/som-engine'

export class ScanService {
    /**
     * Executes a brand visibility scan, verifies limits, and persists results.
     */
    static async executeScan(input: ScanInput) {
        // 1. Verify Session
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('UNAUTHORIZED')
        }

        // 2. Fetch Profile and Organization
        const profile = await prisma.profile.findFirst({
            where: { userId: user.id },
            include: { organization: true }
        })

        if (!profile || !profile.organization) {
            throw new Error('ORG_NOT_FOUND')
        }

        const org = profile.organization

        // 3. Check Usage Limits
        // Note: For dual scans, we might want to check if they have at least 2 remaining if context is present.
        // But for now, we'll just check if they are over the limit.
        if (org.scansUsed >= org.scanLimit) {
            throw new Error('LIMIT_EXCEEDED')
        }

        const runScan = async (strategyContext?: string) => {
            const result = await runWithFallback({
                ...input,
                strategyContext
            })

            return await prisma.$transaction(async (tx) => {
                // Create Visibility Scan
                const scan = await tx.visibilityScan.create({
                    data: {
                        organizationId: org.id,
                        brand: input.brand,
                        industry: input.industry,
                        competitors: input.competitors,
                        status: 'COMPLETED',
                        strategyInjected: !!strategyContext
                    }
                })

                // Create LLM Response
                const providerMap: Record<string, LlmProvider> = {
                    gemini: 'GEMINI',
                    openai: 'GPT4',
                    claude: 'CLAUDE'
                };

                await tx.llmResponse.create({
                    data: {
                        scanId: scan.id,
                        provider: providerMap[result.provider] || 'GEMINI' as LlmProvider,
                        providerUsed: result.provider,
                        rawText: result.rawText
                    }
                })

                // Create Signal
                await tx.signal.create({
                    data: {
                        scanId: scan.id,
                        mentionFrequency: result.mentionFrequency,
                        citationDensity: result.citationDensity,
                        sentimentScore: result.sentimentScore,
                        latentDensity: result.latentDensity
                    }
                })

                // Increment scansUsed
                await tx.organization.update({
                    where: { id: org.id },
                    data: { scansUsed: { increment: 1 } }
                })

                return {
                    scanId: scan.id,
                    strategyInjected: !!strategyContext,
                    provider: result.provider,
                    metrics: {
                        score: SomEngine.calculateAggregateScore(result, result.provider),
                        mentionFrequency: result.mentionFrequency,
                        citationDensity: result.citationDensity,
                        sentimentScore: result.sentimentScore,
                        latentDensity: result.latentDensity
                    }
                }
            })
        }

        // 4. Determine Scans to Run
        const results = []

        // Always run a Neutral Scan (Baseline)
        results.push(await runScan())

        // If strategy context exists, run the Injected Scan
        if (org.strategyContext) {
            results.push(await runScan(org.strategyContext))
        }

        return results
    }

    /**
     * Fetches the last 10 scans for the authenticated user's organization.
     */
    static async getDashboardData() {
        // 1. Verify Session
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('UNAUTHORIZED')
        }

        // 2. Fetch Profile and Organization
        const profile = await prisma.profile.findFirst({
            where: { userId: user.id }
        })

        if (!profile) {
            throw new Error('ORG_NOT_FOUND')
        }

        const organizationId = profile.organizationId

        // 3. Fetch Recent Scans with Signals
        const scans = await prisma.visibilityScan.findMany({
            where: { organizationId },
            include: {
                signals: true,
                llmResponses: {
                    select: {
                        provider: true,
                        providerUsed: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20 // Take more to find recent pairs
        })

        // 4. Extract Latest Baseline and Strategy scans
        const latestBaseline = scans.find((s: any) => !s.strategyInjected)
        const latestStrategy = scans.find((s: any) => s.strategyInjected)

        // 5. Construct history (using baseline scans for consistency, or all)
        // For the chart, we'll use baseline scans to show natural progression
        const history = scans
            .filter((s: any) => !s.strategyInjected)
            .map((s: any) => {
                const signal = s.signals[0];
                const providerUsed = s.llmResponses[0]?.providerUsed || 'gemini';
                return {
                    date: s.createdAt.toISOString(),
                    score: signal ? SomEngine.calculateAggregateScore(signal, providerUsed) : 0,
                    provider: providerUsed
                };
            })
            .reverse()
            .slice(-10)

        const formatScan = (scan?: any) => {
            if (!scan) return null
            const signal = scan.signals[0]
            const providerUsed = scan.llmResponses[0]?.providerUsed || 'gemini'
            const metrics = signal ? {
                mentionFrequency: signal.mentionFrequency,
                citationDensity: signal.citationDensity,
                sentimentScore: signal.sentimentScore,
                latentDensity: signal.latentDensity
            } : { mentionFrequency: 0, citationDensity: 0, sentimentScore: 0, latentDensity: 0 };

            return {
                id: scan.id,
                score: SomEngine.calculateAggregateScore(metrics, providerUsed),
                latentDensity: metrics.latentDensity,
                date: scan.createdAt,
                breakdown: {
                    direct: Math.round(metrics.mentionFrequency * 100),
                    som: {}
                },
                signals: scan.signals,
                provider: providerUsed
            }
        }

        return {
            latestBaseline: formatScan(latestBaseline),
            latestStrategy: formatScan(latestStrategy),
            history
        }
    }
}
