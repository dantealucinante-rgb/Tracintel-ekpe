// Analytics engine for calculating brand visibility ratios (0-1) from raw LLM text
export interface SomMetrics {
    mentionFrequency: number; // 0-1
    citationDensity: number;  // 0-1
    sentimentScore: number;   // 0-1
    latentDensity: number;    // 0-1
}

export interface StrictSomJson {
    brand_detected: boolean;
    mention_frequency: number;
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    citation_density: number;
    competitor_mentions: string[];
    summary: string;
}

import { SCORE_WEIGHTS, PROVIDER_MULTIPLIERS } from './constants';

export const INDUSTRY_BENCHMARKS: Record<string, number> = {
    'technology': 45,
    'healthcare': 38,
    'finance': 42,
    'retail': 40,
    'food': 35,
    'fashion': 43,
    'education': 36,
    'default': 40
};

export class SomEngine {
    static getBenchmark(industry: string): number {
        const ind = industry.toLowerCase();
        for (const [key, val] of Object.entries(INDUSTRY_BENCHMARKS)) {
            if (ind.includes(key)) return val;
        }
        return INDUSTRY_BENCHMARKS['default'];
    }

    /**
     * Extracts an explicitly stated AI score from the raw generated text.
     */
    static extractAiProvidedScore(rawText: string): number | null {
        const match = rawText.match(/(?:visibility score|overall score|score)[:\s]+(\d+)(?:\/100)?/i);
        if (match && match[1]) {
            const score = parseInt(match[1], 10);
            if (!isNaN(score) && score >= 0 && score <= 100) {
                return score;
            }
        }
        return null;
    }

    /**
     * Extracts structured JSON data from the raw generated text.
     * Expects a strict JSON response.
     */
    static parseStructuredResponse(rawText: string): StrictSomJson | null {
        try {
            // Clean the string to find the first '{' and last '}'
            // AI models sometimes wrap JSON in markdown blocks even when told not to.
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return null;

            const cleanedJson = jsonMatch[0];
            const parsed = JSON.parse(cleanedJson);

            // Rigorous validation of the strict schema
            const requiredFields = ['brand_detected', 'mention_frequency', 'sentiment', 'citation_density', 'competitor_mentions', 'summary'];
            for (const field of requiredFields) {
                if (!(field in parsed)) {
                    console.warn(`[SomEngine] Missing required field: ${field}`);
                    return null;
                }
            }

            return parsed as StrictSomJson;
        } catch (e) {
            console.error('[SomEngine] Failed to parse strict JSON:', e, 'Raw text:', rawText);
        }
        return null;
    }

    /**
     * Calculates visibility metrics on a 0.0 to 1.0 scale.
     */
    static calculateMetrics(text: string, brand: string, competitors: string[]): SomMetrics {
        const structured = SomEngine.parseStructuredResponse(text);

        if (structured) {
            if (!structured.brand_detected) {
                return {
                    mentionFrequency: 0,
                    citationDensity: 0,
                    sentimentScore: 0,
                    latentDensity: 0
                };
            }

            // Mapping strict JSON to SomMetrics
            const sentimentMap: Record<string, number> = {
                'positive': 1.0,
                'neutral': 0.5,
                'negative': 0.0,
                'mixed': 0.5
            };

            const mentionFrequency = Math.min(1.0, structured.mention_frequency / 10); // Normalize by 10
            const citationDensity = Math.min(1.0, structured.citation_density / 5);     // Normalize by 5
            const sentimentScore = sentimentMap[structured.sentiment] ?? 0.5;

            // For latent density, since it's not in the new schema, we'll use mention frequency as a proxy
            // or we could ask for it. But following instructions exactly.
            const latentDensity = mentionFrequency;

            return {
                mentionFrequency,
                citationDensity,
                sentimentScore,
                latentDensity
            };
        }

        // Fallback to regex-based counting
        const content = text.toLowerCase();
        const brandTerm = brand.toLowerCase();
        const compTerms = competitors.map(c => c.toLowerCase());

        // 1. Mention Frequency (Ratio 0-1)
        const brandCount = (content.match(new RegExp(`\\b${brandTerm}\\b`, 'g')) || []).length;
        let compCount = 0;
        compTerms.forEach(c => {
            compCount += (content.match(new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length;
        });
        const totalMentions = brandCount + compCount;
        const mentionFrequency = totalMentions === 0 ? 0 : brandCount / totalMentions;

        // 2. Citation Density (Normalized 0-1)
        const urlPattern = /https?:\/\/[^\s)]+/g;
        const accordingToPattern = /according to|cited by|source:|referenced|based on/g;
        const urlCount = (content.match(urlPattern) || []).length;
        const patternCount = (content.match(accordingToPattern) || []).length;
        const totalCitations = urlCount + patternCount;
        const citationDensity = Math.min(1.0, totalCitations / 5);

        // 3. Sentiment Score (Ratio 0-1)
        const positiveWords = ['leading', 'best', 'top', 'trusted', 'popular', 'excellent', 'superior', 'robust', 'innovative', 'efficient'];
        const negativeWords = ['poor', 'worst', 'bad', 'failing', 'unreliable', 'complex', 'expensive', 'outdated', 'limited'];

        let posCount = 0;
        let negCount = 0;
        positiveWords.forEach(w => { if (content.includes(w)) posCount++; });
        negativeWords.forEach(w => { if (content.includes(w)) negCount++; });

        const totalSentimentWords = posCount + negCount;
        const sentimentScore = totalSentimentWords === 0 ? 0.5 : posCount / totalSentimentWords;

        // 4. Latent Density (Weighted Avg 0-1)
        const checkLimit = Math.floor(content.length * 0.25);
        const firstSegment = content.substring(0, checkLimit);
        const appearsEarly = firstSegment.includes(brandTerm) ? 1.0 : 0.0;
        const latentDensity = (mentionFrequency * 0.6) + (appearsEarly * 0.4);

        return {
            mentionFrequency: parseFloat(mentionFrequency.toFixed(2)),
            citationDensity: parseFloat(citationDensity.toFixed(2)),
            sentimentScore: parseFloat(sentimentScore.toFixed(2)),
            latentDensity: parseFloat(latentDensity.toFixed(2))
        };
    }

    /**
     * Aggregates three passes from a single model into one final result.
     */
    static aggregateMultiPassResults(results: StrictSomJson[]): StrictSomJson {
        if (results.length === 0) throw new Error("No results to aggregate");

        // 1. brand_detected: true if detected in at least 2 out of 3 passes.
        const brandDetectedCount = results.filter(r => r.brand_detected).length;
        const brand_detected = brandDetectedCount >= 2;

        // 2. mention_frequency: calculate the average across all 3 passes. Round to the nearest integer.
        const avgMentionFreq = Math.round(results.reduce((sum, r) => sum + r.mention_frequency, 0) / results.length);

        // 3. sentiment: take the majority value. If all three differ, use "mixed".
        const sentimentCounts: Record<string, number> = {};
        results.forEach(r => {
            sentimentCounts[r.sentiment] = (sentimentCounts[r.sentiment] || 0) + 1;
        });

        let sentiment: StrictSomJson['sentiment'] = 'mixed';
        const sortedSentiments = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1]);
        if (sortedSentiments[0][1] >= 2) {
            sentiment = sortedSentiments[0][0] as StrictSomJson['sentiment'];
        } else if (results.length === 3) {
            sentiment = 'mixed';
        } else if (results.length === 1) {
            sentiment = results[0].sentiment;
        }

        // 4. citation_density: calculate the average across all 3 passes. Round to the nearest integer.
        const avgCitationDensity = Math.round(results.reduce((sum, r) => sum + r.citation_density, 0) / results.length);

        // 5. competitor_mentions: combine all competitors mentioned into one deduplicated array.
        const competitor_mentions = Array.from(new Set(results.flatMap(r => r.competitor_mentions)));

        // 6. summary: use the summary from whichever pass returned the highest mention_frequency.
        const summary = results.reduce((prev, current) => (prev.mention_frequency >= current.mention_frequency) ? prev : current).summary;

        return {
            brand_detected,
            mention_frequency: avgMentionFreq,
            sentiment,
            citation_density: avgCitationDensity,
            competitor_mentions,
            summary
        };
    }

    /**
     * Combines granular metrics into a single 0-100 Latent Visibility Score.
     */
    static calculateAggregateScore(metrics: SomMetrics, provider?: string, rawText?: string): number {
        if (rawText) {
            const extracted = SomEngine.extractAiProvidedScore(rawText);
            if (extracted !== null) return extracted;
        }

        const multiplier = provider ? (PROVIDER_MULTIPLIERS[provider as keyof typeof PROVIDER_MULTIPLIERS] || 1.0) : 1.0;

        const rawScore =
            (metrics.mentionFrequency * SCORE_WEIGHTS.mentionFrequency) +
            (metrics.citationDensity * SCORE_WEIGHTS.citationDensity) +
            (metrics.sentimentScore * SCORE_WEIGHTS.sentimentScore) +
            (metrics.latentDensity * SCORE_WEIGHTS.latentDensity);

        return Math.min(100, Math.round(rawScore * multiplier * 100));
    }
}
