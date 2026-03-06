// Anthropic Claude AI provider for generating brand visibility scans
import Anthropic from "@anthropic-ai/sdk";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class ClaudeProvider implements AiProvider {
    name = "CLAUDE";

    async generateScan(input: ScanInput): Promise<ScanResult> {
        const anthropic = new Anthropic({
            apiKey: env.ANTHROPIC_API_KEY || "",
        });

        const prompt = `In the context of ${input.industry}, if someone asked about ${input.brand} compared to ${input.competitors.join(", ")}, what would you say? Be specific about which brand you would mention most and why.`;

        try {
            const response = await anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }],
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
