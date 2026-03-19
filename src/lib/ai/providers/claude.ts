// Anthropic Claude AI provider for generating brand visibility scans
import Anthropic from "@anthropic-ai/sdk";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class ClaudeProvider implements AiProvider {
    name = "CLAUDE";

    async generateScan(input: ScanInput, options?: { temperature?: number; customPrompt?: string }): Promise<ScanResult> {
        const anthropic = new Anthropic({
            apiKey: env.ANTHROPIC_API_KEY || "",
        });

        const prompt = options?.customPrompt || `
You are analyzing AI perception of the brand "${input.brand}" (also known as: ${input.brand}).
...
`.trim();

        try {
            const response = await anthropic.messages.create({
                model: "claude-sonnet-4-6",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }],
                temperature: options?.temperature ?? 0.7,
            });

            const text = response.content[0].type === 'text' ? response.content[0].text : "";

            const metrics = SomEngine.calculateMetrics(text, input.brand, input.competitors);

            return {
                ...metrics,
                rawText: text
            };
        } catch (error) {
            console.error(`[ClaudeProvider] Failed to generate scan:`, error);
            throw error;
        }
    }
}
