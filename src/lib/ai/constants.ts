/**
 * Standardized weights for calculating the Latent Visibility Score.
 */
export const SCORE_WEIGHTS = {
    mentionFrequency: 0.35, // 35% weight: Share of voice among competitors
    citationDensity: 0.25,  // 25% weight: Verification via URLs and sources
    sentimentScore: 0.25,   // 25% weight: Qualitative brand perception
    latentDensity: 0.15     // 15% weight: Prominence and early-text placement
} as const;

/**
 * Normalization multipliers to harmonize scores across different LLM behaviors.
 */
export const PROVIDER_MULTIPLIERS = {
    gemini: 1.00,  // Baseline
    openai: 0.97,  // Slightly more conservative
    claude: 0.95   // Most conservative
} as const;
