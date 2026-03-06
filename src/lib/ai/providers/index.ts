// AI provider orchestrator with fallback logic and logging
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { ClaudeProvider } from "./claude";
import { ScanInput, ScanResult } from "./types";

/**
 * Executes a visibility scan trying Gemini first, then GPT-4, then Claude.
 */
export async function runWithFallback(input: ScanInput): Promise<ScanResult & { provider: string }> {
    const providers = [
        new GeminiProvider(),
        new OpenAIProvider(),
        new ClaudeProvider()
    ];

    let lastError: any = null;

    for (const provider of providers) {
        try {
            const result = await provider.generateScan(input);
            return {
                ...result,
                provider: provider.name.toLowerCase()
            };
        } catch (error) {
            lastError = error;
            continue; // Try next provider
        }
    }

    console.error(`[AI Orchestrator] All AI providers failed.`);
    throw lastError || new Error("All AI providers failed to generate a response.");
}
