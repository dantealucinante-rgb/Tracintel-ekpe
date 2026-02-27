/**
 * Share-of-Model (SoM) Analytics Engine
 * Calculates brand visibility metrics across Large Language Models.
 */

export interface SomMetrics {
    mentionFrequency: number;     // 0-100: How often brand is mentioned vs competitors
    citationDensity: number;      // 0-100: Frequency of specific URL/Source citations
    sentimentPolarization: number; // 0-100: Technical accuracy and sentiment alignment
    latentDensity: number;        // 0.0-1.0: Semantic "weight" in model's latent space
}

export interface SomCalculationInput {
    brandName: string;
    competitors: string[];
    rawResponse: string;
    modelName: string;
}

export class SomEngine {
    /**
     * Executes the SoM calculation logic based on raw LLM output.
     */
    static calculateMetrics(input: SomCalculationInput): SomMetrics {
        const { brandName, competitors, rawResponse } = input;
        const text = rawResponse.toLowerCase();
        const brand = brandName.toLowerCase();

        // 1. Mention Frequency Calculation
        // Count brand vs competitor mentions
        const brandCount = (text.match(new RegExp(brand, 'g')) || []).length;
        let totalCompetitorCount = 0;
        competitors.forEach(comp => {
            totalCompetitorCount += (text.match(new RegExp(comp.toLowerCase(), 'g')) || []).length;
        });

        const mentionFrequency = totalCompetitorCount === 0 && brandCount > 0
            ? 100
            : (brandCount / (brandCount + totalCompetitorCount || 1)) * 100;

        // 2. Citation Density (Mock logic for identifying reference patterns)
        // In a real scenario, we'd look for markdown links or specific domain citations
        const citationPatterns = [
            /https?:\/\/[^\s)]+/g,
            /\[.*?\]\(.*?\)/g,
            /source:/g,
            /referenced:/g
        ];

        let citationCount = 0;
        citationPatterns.forEach(pattern => {
            citationCount += (text.match(pattern) || []).length;
        });

        // Brand citation density is scaled by mention freq
        const citationDensity = Math.min(100, (citationCount * 20) * (mentionFrequency / 100));

        // 3. Sentiment Polarization (Technical Accuracy Score)
        // We look for "technical" keywords and positive modifiers
        const techKeywords = ['performance', 'architecture', 'integration', 'latency', 'specs', 'api', 'enterprise'];
        const positiveModifiers = ['excellent', 'superior', 'leading', 'robust', 'accurate', 'efficient'];

        let techScore = 0;
        techKeywords.forEach(word => { if (text.includes(word)) techScore += 10; });
        positiveModifiers.forEach(word => { if (text.includes(word)) techScore += 5; });

        const sentimentPolarization = Math.min(100, techScore);

        // 4. Latent Density
        // Derived from a combination of frequency and positioning (mocked for this logic)
        const latentDensity = Math.min(1.0, (mentionFrequency / 100) * 0.8 + (sentimentPolarization / 100) * 0.2);

        return {
            mentionFrequency: Math.round(mentionFrequency),
            citationDensity: Math.round(citationDensity),
            sentimentPolarization: Math.round(sentimentPolarization),
            latentDensity: parseFloat(latentDensity.toFixed(2))
        };
    }
}
