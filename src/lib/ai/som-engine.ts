// Analytics engine for calculating brand visibility ratios (0-1) from raw LLM text
export interface SomMetrics {
    mentionFrequency: number; // 0-1: brand mentions / (brand + competitor mentions)
    citationDensity: number;  // 0-1: count of URLs and "according to" patterns (normalized)
    sentimentScore: number;   // 0-1: positive words / total sentiment words
    latentDensity: number;    // 0-1: weighted avg of mentionFreq + early placement
}

import { SCORE_WEIGHTS, PROVIDER_MULTIPLIERS } from './constants';

export class SomEngine {
    /**
     * Calculates visibility metrics on a 0.0 to 1.0 scale.
     */
    static calculateMetrics(text: string, brand: string, competitors: string[]): SomMetrics {
        const content = text.toLowerCase();
        const brandTerm = brand.toLowerCase();
        const compTerms = competitors.map(c => c.toLowerCase());

        // 1. Mention Frequency (Ratio 0-1)
        const brandCount = (content.match(new RegExp(brandTerm, 'g')) || []).length;
        let compCount = 0;
        compTerms.forEach(c => {
            compCount += (content.match(new RegExp(c, 'g')) || []).length;
        });
        const totalMentions = brandCount + compCount;
        const mentionFrequency = totalMentions === 0 ? 0 : brandCount / totalMentions;

        // 2. Citation Density (Normalized 0-1)
        const urlPattern = /https?:\/\/[^\s)]+/g;
        const accordingToPattern = /according to|cited by|source:|referenced/g;
        const urlCount = (content.match(urlPattern) || []).length;
        const patternCount = (content.match(accordingToPattern) || []).length;
        const totalCitations = urlCount + patternCount;
        const citationDensity = Math.min(1.0, totalCitations / 5);

        // 3. Sentiment Score (Ratio 0-1)
        const positiveWords = ['leading', 'best', 'top', 'trusted', 'popular', 'excellent', 'superior', 'robust'];
        const negativeWords = ['poor', 'worst', 'bad', 'failing', 'unreliable', 'complex', 'expensive'];

        let posCount = 0;
        let negCount = 0;
        positiveWords.forEach(w => { if (content.includes(w)) posCount++; });
        negativeWords.forEach(w => { if (content.includes(w)) negCount++; });

        const totalSentimentWords = posCount + negCount;
        const sentimentScore = totalSentimentWords === 0 ? 0.5 : posCount / totalSentimentWords;

        // 4. Latent Density (Weighted Avg 0-1)
        const checkLimit = Math.floor(content.length * 0.2);
        const firstSegment = content.substring(0, checkLimit);
        const appearsEarly = firstSegment.includes(brandTerm) ? 1.0 : 0.0;
        const latentDensity = (mentionFrequency * 0.5) + (appearsEarly * 0.5);

        return {
            mentionFrequency: parseFloat(mentionFrequency.toFixed(2)),
            citationDensity: parseFloat(citationDensity.toFixed(2)),
            sentimentScore: parseFloat(sentimentScore.toFixed(2)),
            latentDensity: parseFloat(latentDensity.toFixed(2))
        };
    }

    /**
     * Combines granular metrics into a single 0-100 Latent Visibility Score.
     * 
     * Formula Rationale:
     * - Mention Frequency (35%): Absolute mindshare is the strongest predictor of visibility.
     * - Citation Density (25%): Trust signals ensure the brand isn't just mentioned, but verified.
     * - Latent Density (15%): Early-text placement reflects RAG priority and retrieval rank.
     * 
     * @param metrics - Object containing granular 0-1 visibility ratios
     * @param provider - Lowercase identifier of the LLM provider for normalization
     * @returns A rounded integer score between 0 and 100
     */
    static calculateAggregateScore(metrics: SomMetrics, provider?: string): number {
        const multiplier = provider ? (PROVIDER_MULTIPLIERS[provider as keyof typeof PROVIDER_MULTIPLIERS] || 1.0) : 1.0;

        const rawScore =
            (metrics.mentionFrequency * SCORE_WEIGHTS.mentionFrequency) +
            (metrics.citationDensity * SCORE_WEIGHTS.citationDensity) +
            (metrics.sentimentScore * SCORE_WEIGHTS.sentimentScore) +
            (metrics.latentDensity * SCORE_WEIGHTS.latentDensity);

        return Math.round(rawScore * multiplier * 100);
    }
}
