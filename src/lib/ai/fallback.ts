import { GeminiProvider } from './providers/gemini-provider';
import { OpenAIProvider } from './providers/openai-provider';
import { AnthropicProvider } from './providers/anthropic-provider';
import { ILlmProvider, LlmMessage, ScanPromptOptions, LlmProviderResponse } from './types';

/**
 * FallbackProvider: Implements a mission-critical 3-tier fallback strategy.
 * Hierarchy: Gemini (Primary) -> OpenAI (Secondary) -> Anthropic (Tertiary)
 * Includes "Demo Mode" fallback for missing API keys.
 */
export class FallbackProvider implements ILlmProvider {
    readonly providerName = 'fallback-orchestrator';
    private primary: ILlmProvider;
    private secondary: ILlmProvider;
    private tertiary: ILlmProvider;

    constructor() {
        this.primary = new GeminiProvider();
        this.secondary = new OpenAIProvider();
        this.tertiary = new AnthropicProvider();
    }

    async generateResponse(
        messages: LlmMessage[],
        options?: ScanPromptOptions
    ): Promise<LlmProviderResponse> {
        // Try Primary (Gemini)
        try {
            return await this.primary.generateResponse(messages, options);
        } catch (error: any) {
            console.warn('Primary Provider (Gemini) failed. Cascading to OpenAI...', error.message);
        }

        // Try Secondary (OpenAI)
        try {
            return await this.secondary.generateResponse(messages, options);
        } catch (error: any) {
            console.warn('Secondary Provider (OpenAI) failed. Cascading to Anthropic...', error.message);
        }

        // Try Tertiary (Anthropic)
        try {
            return await this.tertiary.generateResponse(messages, options);
        } catch (error: any) {
            console.warn('Tertiary Provider (Anthropic) failed. Engaging SIMULATION MODE.', error.message);
        }

        // ── Demo Mode / Simulation Fallback ────────────────────────────────
        // If everything fails (likely due to missing keys), return high-fidelity mock data.
        return {
            content: JSON.stringify({
                visibilityRank: 1,
                mentionFrequency: 84,
                citationDensity: 72,
                sentimentPolarization: 90,
                latentDensity: 0.82,
                accuracyScore: 95,
                brandEntityMatch: true,
                influenceSources: ["Mock Data (Hand-curated)", "Simulation Engine v2.0"],
                summary: "This is a high-fidelity intelligence simulation. To unlock live production data, ensure all API keys (Gemini, OpenAI, Anthropic) are correctly configured in the Vercel dashboard."
            }),
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
            model: 'simulation-engine-v2',
        };
    }

    async analyzeVisibility(brandName: string, context: string): Promise<LlmProviderResponse> {
        return this.generateResponse([{
            role: 'user',
            content: `Analyze visibility for brand "${brandName}" in this context: ${context}`
        }]);
    }
}
