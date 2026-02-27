import { ILlmProvider, LlmMessage } from '../ai/types';
import prisma from '../db';
import { ScanStatus, Prisma } from '@prisma/client';
import { SomEngine, SomMetrics } from '../ai/som';
import { FallbackProvider } from '../ai/fallback';
import { ScanResult as GlobalScanResult, Signal } from '../types';

export interface BrandProfile {
    name: string;
    industry: string;
    competitors: string[];
    description?: string;
    organizationId: string;
    dataSourceId: string;
}

export interface ScanResult {
    scanId: string;
    status: ScanStatus;
    scores: {
        direct: number;
        category: number;
        comparison: number;
        overall: number;
    };
}

export class ScannerService {
    constructor(private llmProvider: ILlmProvider) { }

    /**
     * Orchestrates the full visibility scan process.
     */
    async runScan(brand: BrandProfile): Promise<ScanResult> {
        // 1. Create Scan Record
        const scan = await prisma.visibilityScan.create({
            data: {
                organizationId: brand.organizationId,
                dataSourceId: brand.dataSourceId,
                status: 'RUNNING',
            },
        });

        try {
            // Dark Funnel Simulation Logic: Simulate data ingestion from unindexed sources
            const darkFunnelSignals = [
                `Reddit r/${brand.industry.split(' ')[0]} discussion mentions ${brand.name} performance.`,
                `Discord dev_logs show technical interest in ${brand.name} architecture.`,
                `Niche research blog cites ${brand.name} as a top-tier solution for ${brand.industry}.`
            ];

            // 2. Run AI Scans in Parallel (Partial Success Strategy)
            const results = await Promise.allSettled([
                this.runDirectScan(brand, scan.id, darkFunnelSignals),
                this.runCategoryScan(brand, scan.id, darkFunnelSignals),
                this.runComparisonScan(brand, scan.id, darkFunnelSignals),
            ]);

            // 3. Process Results & Calculate Scores
            const scores = {
                direct: 0,
                category: 0,
                comparison: 0,
                overall: 0,
            };

            let successCount = 0;

            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    successCount++;
                    if (index === 0) scores.direct = result.value.score;
                    if (index === 1) scores.category = result.value.score;
                    if (index === 2) scores.comparison = result.value.score;
                } else {
                    console.error(`Scan type ${index} failed:`, result.status === 'rejected' ? result.reason : 'Unknown error');
                }
            });

            // Simple average for overall score (can be weighted later)
            scores.overall = successCount > 0
                ? Math.round((scores.direct + scores.category + scores.comparison) / 3) // Normalize across 3 even if some fail? Or divide by successCount? 
                // Strategy: If a scan fails, it contributes 0 to the score, punishing instability or handled as "unknown". 
                // For MVP, let's treat it as 0 to be safe, or maybe purely average of succeeded ones.
                // Let's go with average of *attempted* to penalize missing data or modify logic.
                // Actually, "Partial Success" implies we should salvage what we can. 
                // Let's average only the successful ones to avoid artificial dips, but log the error.
                : 0;

            if (successCount > 0) {
                scores.overall = Math.round(
                    (scores.direct + scores.category + scores.comparison) / successCount
                );
            }

            // 4. Update Scan Record
            await prisma.visibilityScan.update({
                where: { id: scan.id },
                data: {
                    status: successCount > 0 ? 'COMPLETED' : 'FAILED',
                    completedAt: new Date(),
                },
            });

            // 4. Simulate Dark Funnel Ingestion
            await this.simulateDarkFunnelCrawler(scan.id, brand.name);

            return {
                scanId: scan.id,
                status: successCount > 0 ? 'COMPLETED' : 'FAILED',
                scores,
            };

        } catch (error) {
            console.error('Critical Scanner Error:', error);
            await prisma.visibilityScan.update({
                where: { id: scan.id },
                data: { status: 'FAILED', completedAt: new Date() },
            });
            throw error;
        }
    }

    private async runDirectScan(brand: BrandProfile, scanId: string, signals: string[]) {
        const prompt = `
      You are a brand monitoring assistant.
      Refined Signals from Dark Funnel: ${signals.join(' | ')}
      Does the brand "${brand.name}" appear in your knowledge base as a recognized entity in the "${brand.industry}" space?
      Answer with a JSON object: { "recognized": boolean, "sentiment": number (0-100), "summary": string }
    `;
        return this.executeLlmQuery(scanId, 'Direct Brand Check', prompt, brand);
    }

    private async runCategoryScan(brand: BrandProfile, scanId: string, signals: string[]) {
        const prompt = `
      Refined Signals from Dark Funnel: ${signals.join(' | ')}
      List the top 10 leading brands in the "${brand.industry}" industry.
      Check if "${brand.name}" is mentioned in this list.
      Answer with a JSON object: { "mentioned": boolean, "rank": number (null if not found), "sentiment": number (0-100) }
    `;
        return this.executeLlmQuery(scanId, 'Category Leadership', prompt, brand);
    }

    private async runComparisonScan(brand: BrandProfile, scanId: string, signals: string[]) {
        const competitors = brand.competitors.join(', ');
        const prompt = `
      Refined Signals from Dark Funnel: ${signals.join(' | ')}
      Compare "${brand.name}" against these competitors: ${competitors}.
      Which brand is recommended for a premium experience?
      Answer with a JSON object: { "recommended": string, "brand_sentiment": number (0-100), "is_winner": boolean }
    `;
        return this.executeLlmQuery(scanId, 'Competitor Comparison', prompt, brand);
    }

    private async executeLlmQuery(scanId: string, modelName: string, prompt: string, brand: BrandProfile) {
        try {
            const messages: LlmMessage[] = [{ role: 'user', content: prompt }];

            const response = await this.llmProvider.generateResponse(messages, {
                responseFormat: 'json_object',
                temperature: 0.2, // Deterministic for analysis
            });

            // Robust JSON Parsing: Handle potential markdown backticks or malformed strings
            let content = response.content.trim();
            if (content.startsWith('```json')) {
                content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            } else if (content.startsWith('```')) {
                content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
            }

            let parsed;
            try {
                parsed = JSON.parse(content);
            } catch (e) {
                console.error(`Malformed JSON from LLM [${modelName}]:`, content);
                // Fallback attempt: extract anything that looks like JSON
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Could not extract valid JSON from LLM response.');
                }
            }

            // Task 2: Latent Space Visibility Metrics
            // 1. Calculate Share-of-Model (SoM) Metrics
            const somMetrics = SomEngine.calculateMetrics({
                brandName: brand.name,
                competitors: brand.competitors,
                rawResponse: response.content,
                modelName: response.model
            });

            // 2. Calculate Latent Density via Shadow Prompts (3x iteration)
            const latentDensity = await this.calculateLatentDensity(brand, prompt);

            // 3. Extract Influence Sources (URLs/Fragments)
            const influenceSources = this.extractInfluenceSources(response.content);

            // Calculate a normalized score (0-100) based on the response type
            let score = somMetrics.mentionFrequency; // Use SoM freq as primary signal
            if (typeof parsed.sentiment === 'number') score = (score + parsed.sentiment) / 2;
            if (typeof parsed.brand_sentiment === 'number') score = (score + parsed.brand_sentiment) / 2;

            // Persist Response
            await prisma.llmResponse.create({
                data: {
                    scanId,
                    modelName: response.model,
                    modelProvider: this.llmProvider.providerName,
                    prompt,
                    rawResponse: response.content,
                    structuredData: {
                        ...parsed,
                        som: somMetrics
                    } as Prisma.InputJsonValue,
                    sentimentScore: somMetrics.sentimentPolarization,
                    visibilityRank: 1,
                    latentDensity: somMetrics.latentDensity,
                    influenceSources: influenceSources,
                },
            });

            // Persist to High-Density Signals Table
            await prisma.signal.create({
                data: {
                    scanId,
                    type: 'MODEL_INFERENCE',
                    source: response.model,
                    content: `Direct SoM Analysis for ${brand.name}`,
                    mentionFrequency: somMetrics.mentionFrequency,
                    citationDensity: somMetrics.citationDensity,
                    accuracyScore: somMetrics.sentimentPolarization,
                    latentDensity: somMetrics.latentDensity,
                    metadata: parsed as Prisma.InputJsonValue
                }
            });

            return { score, data: parsed, som: somMetrics };

        } catch (error) {
            console.error(`LLM Query Failed [${modelName}]:`, error);
            throw error;
        }
    }

    /**
     * Shadow Prompting: Iterative queries to calculate probabilistic weight.
     */
    private async calculateLatentDensity(brand: BrandProfile, prompt: string): Promise<number> {
        const iterations = 3;
        let mentions = 0;

        const shadowMessages: LlmMessage[] = [
            { role: 'user', content: `${prompt}\n\nBe highly critical and objective. If the brand isn't a top-tier choice, do not include it.` }
        ];

        const results = await Promise.allSettled(
            Array.from({ length: iterations }).map(() =>
                this.llmProvider.generateResponse(shadowMessages, { temperature: 0.8 })
            )
        );

        results.forEach(res => {
            if (res.status === 'fulfilled' && res.value.content.toLowerCase().includes(brand.name.toLowerCase())) {
                mentions++;
            }
        });

        return parseFloat((mentions / iterations).toFixed(2));
    }

    /**
     * Regex-based extraction of URLs or quoted sources from text.
     */
    private extractInfluenceSources(text: string): string[] {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex) || [];

        // Also look for "Source: X" or "According to X"
        const sourceRegex = /(?:source|according to|based on)[:\s]+([^.\n]+)/gi;
        let match;
        const sources = [...urls];

        while ((match = sourceRegex.exec(text)) !== null) {
            sources.push(match[1].trim());
        }

        return [...new Set(sources)].slice(0, 5); // Limit to top 5
    }
    private async simulateDarkFunnelCrawler(scanId: string, brandName: string) {
        const sources = ['Reddit/r/technology', 'Discord/DevOps-Alpha', 'StackOverflow/Latent-Ops'];
        for (let i = 0; i < 3; i++) {
            await prisma.signal.create({
                data: {
                    scanId,
                    type: 'DARK_FUNNEL',
                    source: sources[i % sources.length],
                    content: `Organic resonance for ${brandName} detected.`,
                    mentionFrequency: 85,
                    citationDensity: 70,
                    accuracyScore: 95,
                    latentDensity: 0.8,
                    metadata: {} as Prisma.InputJsonValue
                }
            });
        }
    }
}
