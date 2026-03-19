// Core service for orchestrating visibility scans, usage validation, and data persistence
import { createClient as createSupabaseServer } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { runAllProviders } from '@/lib/ai/providers'
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
            const results = await runAllProviders({
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

                // Create LLM Responses
                const providerMap: Record<string, LlmProvider> = {
                    gemini: 'GEMINI',
                    openai: 'GPT4',
                    claude: 'CLAUDE'
                };

                const perModelScores: Record<string, any> = {};
                let totalScore = 0;
                let successCount = 0;

                let aggregatedMetrics = {
                    mentionFrequency: 0,
                    citationDensity: 0,
                    sentimentScore: 0,
                    latentDensity: 0
                };

                for (const [providerName, result] of Object.entries(results as Record<string, any>)) {
                    if (result.status === 'fulfilled') {
                        const val = result.value;

                        // If multi-pass data is present, store it on the scan record
                        if (val.raw_passes) {
                            await tx.visibilityScan.update({
                                where: { id: scan.id },
                                data: { raw_passes: val.raw_passes }
                            });
                        }

                        const structured = SomEngine.parseStructuredResponse(val.rawText);

                        if (!structured) {
                            console.error(`[ScanService] Provider ${providerName} returned malformed JSON or missing fields.`);
                            perModelScores[providerName] = { score: 0, status: 'parse_failed' };
                            continue;
                        }

                        // Use the strictly validated metrics
                        const metrics = SomEngine.calculateMetrics(val.rawText, input.brand, input.competitors);
                        const score = SomEngine.calculateAggregateScore(metrics, providerName, val.rawText);

                        perModelScores[providerName] = { score, status: 'success' };
                        totalScore += score;
                        successCount++;

                        // Add to aggregate metrics
                        aggregatedMetrics.mentionFrequency += metrics.mentionFrequency;
                        aggregatedMetrics.citationDensity += metrics.citationDensity;
                        aggregatedMetrics.sentimentScore += metrics.sentimentScore;
                        aggregatedMetrics.latentDensity += metrics.latentDensity;

                        await tx.llmResponse.create({
                            data: {
                                scanId: scan.id,
                                provider: providerMap[providerName] || 'GEMINI' as LlmProvider,
                                providerUsed: providerName,
                                rawText: val.rawText
                            }
                        });
                    } else {
                        console.error(`[ScanService] Provider ${providerName} failed:`, result.reason);
                        perModelScores[providerName] = { score: 0, status: 'failed' };
                    }
                }

                if (successCount === 0) {
                    await tx.visibilityScan.update({
                        where: { id: scan.id },
                        data: { status: 'FAILED' }
                    });
                    throw new Error("All AI providers failed or returned malformed data. Scan marked as FAILED.");
                }

                // Average the metrics
                aggregatedMetrics = {
                    mentionFrequency: aggregatedMetrics.mentionFrequency / successCount,
                    citationDensity: aggregatedMetrics.citationDensity / successCount,
                    sentimentScore: aggregatedMetrics.sentimentScore / successCount,
                    latentDensity: aggregatedMetrics.latentDensity / successCount,
                };

                const finalAverageScore = Math.round(totalScore / successCount);

                // Create Signal
                await tx.signal.create({
                    data: {
                        scanId: scan.id,
                        mentionFrequency: aggregatedMetrics.mentionFrequency,
                        citationDensity: aggregatedMetrics.citationDensity,
                        sentimentScore: aggregatedMetrics.sentimentScore,
                        latentDensity: aggregatedMetrics.latentDensity
                    }
                })

                // Increment scansUsed
                await tx.organization.update({
                    where: { id: org.id },
                    data: { scansUsed: { increment: 1 } }
                })

                const benchmarkScore = SomEngine.getBenchmark(input.industry);
                const benchmarkDelta = finalAverageScore - benchmarkScore;

                return {
                    scanId: scan.id,
                    strategyInjected: !!strategyContext,
                    provider: 'multi-model',
                    metrics: {
                        score: finalAverageScore,
                        mentionFrequency: aggregatedMetrics.mentionFrequency,
                        citationDensity: aggregatedMetrics.citationDensity,
                        sentimentScore: aggregatedMetrics.sentimentScore,
                        latentDensity: aggregatedMetrics.latentDensity
                    },
                    perModelScores,
                    benchmarkScore,
                    benchmarkDelta
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
                        rawText: true,
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
                const score = signal ? SomEngine.calculateAggregateScore(signal, providerUsed, s.llmResponses[0]?.rawText) : 0;

                // Calculate competitor scores for historical trend
                const compScores: Record<string, number> = {};
                const rawText = s.llmResponses[0]?.rawText || '';
                if (rawText && s.competitors) {
                    const metrics = SomEngine.calculateMetrics(rawText, s.brand, s.competitors);
                    const structured = SomEngine.parseStructuredResponse(rawText);

                    s.competitors.forEach((comp: string) => {
                        if (structured && structured.competitor_mentions && structured.competitor_mentions.includes(comp)) {
                            // If mentioned in strict JSON, give it a baseline visibility relative to the brand
                            compScores[comp] = Math.min(100, Math.round(score * 0.8));
                        } else {
                            // Simple fallback calculation for history
                            const compLower = comp.toLowerCase();
                            const brandLower = s.brand.toLowerCase();
                            const compMentions = (rawText.toLowerCase().match(new RegExp(`\\b${compLower}\\b`, 'g')) || []).length;
                            const brandMentions = (rawText.toLowerCase().match(new RegExp(`\\b${brandLower}\\b`, 'g')) || []).length;
                            compScores[comp] = brandMentions > 0
                                ? Math.min(100, Math.round((compMentions / brandMentions) * score))
                                : Math.min(100, compMentions * 10);
                        }
                    });
                }

                return {
                    date: s.createdAt.toISOString(),
                    score: score,
                    mentionFrequency: signal?.mentionFrequency || 0,
                    citationDensity: signal?.citationDensity || 0,
                    provider: providerUsed,
                    competitors: compScores
                };
            })
            .reverse()
            .slice(-10)

        const formatScan = (scan?: any) => {
            if (!scan) return null
            const signal = scan.signals[0]
            const providerUsed = scan.llmResponses.length > 1 ? 'multi-model' : (scan.llmResponses[0]?.providerUsed || 'gemini');

            const metrics = signal ? {
                mentionFrequency: signal.mentionFrequency,
                citationDensity: signal.citationDensity,
                sentimentScore: signal.sentimentScore,
                latentDensity: signal.latentDensity
            } : { mentionFrequency: 0, citationDensity: 0, sentimentScore: 0, latentDensity: 0 };

            const overallScore = SomEngine.calculateAggregateScore(metrics, providerUsed, scan.llmResponses[0]?.rawText);
            const benchmarkScore = SomEngine.getBenchmark(scan.industry);
            const benchmarkDelta = overallScore - benchmarkScore;

            // Reconstruct perModelScores
            const perModelScores: Record<string, any> = {};
            if (scan.llmResponses.length > 1) {
                // It's a parallel multi-model scan
                perModelScores['gemini'] = { score: 0, status: 'failed' };
                perModelScores['openai'] = { score: 0, status: 'failed' };
                perModelScores['claude'] = { score: 0, status: 'failed' };

                scan.llmResponses.forEach((r: any) => {
                    const p = r.providerUsed;
                    const modelMetrics = SomEngine.calculateMetrics(r.rawText, scan.brand, scan.competitors);
                    const modelScore = SomEngine.calculateAggregateScore(modelMetrics, p, r.rawText);
                    perModelScores[p] = { score: modelScore, status: 'success' };
                });
            } else if (scan.llmResponses.length === 1) {
                // Legacy scan
                const p = scan.llmResponses[0].providerUsed || 'gemini';
                perModelScores[p] = { score: overallScore, status: 'success' };
            }

            return {
                id: scan.id,
                brand: scan.brand,
                industry: scan.industry,
                competitors: scan.competitors,
                score: overallScore,
                mentionFrequency: metrics.mentionFrequency,
                citationDensity: metrics.citationDensity,
                sentimentScore: metrics.sentimentScore,
                latentDensity: metrics.latentDensity,
                rawText: scan.llmResponses[0]?.rawText || '',
                date: scan.createdAt,
                breakdown: {
                    direct: Math.round(metrics.mentionFrequency * 100),
                    som: {}
                },
                signals: scan.signals,
                provider: providerUsed,
                perModelScores,
                benchmarkScore,
                benchmarkDelta
            }
        }

        return {
            latestBaseline: formatScan(latestBaseline),
            latestStrategy: formatScan(latestStrategy),
            history
        }
    }

    /**
     * Fetches a single scan by ID for the authenticated user's organization.
     */
    static async getScanById(id: string) {
        // 1. Verify Session
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('UNAUTHORIZED')
        }

        // 2. Fetch Profile
        const profile = await prisma.profile.findFirst({
            where: { userId: user.id }
        })

        if (!profile) {
            throw new Error('ORG_NOT_FOUND')
        }

        // 3. Fetch Scan
        const scan = await prisma.visibilityScan.findFirst({
            where: {
                id,
                organizationId: profile.organizationId
            },
            include: {
                signals: true,
                llmResponses: true
            }
        })

        if (!scan) {
            throw new Error('SCAN_NOT_FOUND')
        }

        // 4. Format Result (Reuse logic from getDashboardData but for single item)
        const signal = scan.signals[0]
        const metrics = signal ? {
            mentionFrequency: signal.mentionFrequency,
            citationDensity: signal.citationDensity,
            sentimentScore: signal.sentimentScore,
            latentDensity: signal.latentDensity
        } : { mentionFrequency: 0, citationDensity: 0, sentimentScore: 0, latentDensity: 0 };

        const providerUsed = scan.llmResponses.length > 1 ? 'multi-model' : (scan.llmResponses[0]?.providerUsed || 'gemini');
        const overallScore = SomEngine.calculateAggregateScore(metrics, providerUsed, scan.llmResponses[0]?.rawText);
        const benchmarkScore = SomEngine.getBenchmark(scan.industry);
        const benchmarkDelta = overallScore - benchmarkScore;

        const perModelScores: Record<string, any> = {};
        scan.llmResponses.forEach((r: any) => {
            const p = r.providerUsed;
            const modelMetrics = SomEngine.calculateMetrics(r.rawText, scan.brand, scan.competitors);
            const modelScore = SomEngine.calculateAggregateScore(modelMetrics, p, r.rawText);
            perModelScores[p] = { score: modelScore, status: 'success', rawText: r.rawText };
        });

        return {
            id: scan.id,
            brand: scan.brand,
            industry: scan.industry,
            competitors: scan.competitors,
            score: overallScore,
            metrics,
            date: scan.createdAt,
            provider: providerUsed,
            perModelScores,
            benchmarkScore,
            benchmarkDelta,
            strategyInjected: scan.strategyInjected
        }
    }
}
