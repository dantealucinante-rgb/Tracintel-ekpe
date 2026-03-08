// AI provider orchestrator with fallback logic and logging
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { ClaudeProvider } from "./claude";
import { ScanInput, ScanResult } from "./types";

export async function runAllProviders(input: ScanInput) {
    const providers = {
        gemini: new GeminiProvider(),
        openai: new OpenAIProvider(),
        claude: new ClaudeProvider()
    };

    const [geminiResult, openaiResult, claudeResult] = await Promise.allSettled([
        providers.gemini.generateScan(input),
        providers.openai.generateScan(input),
        providers.claude.generateScan(input)
    ]);

    return {
        gemini: geminiResult,
        openai: openaiResult,
        claude: claudeResult
    };
}
