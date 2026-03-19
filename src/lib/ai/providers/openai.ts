// OpenAI GPT-4 AI provider for generating brand visibility scans
import OpenAI from "openai";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class OpenAIProvider implements AiProvider {
    name = "GPT4";

    async generateScan(input: ScanInput, options?: { temperature?: number; customPrompt?: string }): Promise<ScanResult> {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY || "",
        });

        const prompt = options?.customPrompt || `
You are analyzing AI perception of the brand "${input.brand}" (also known as: ${input.brand}).
...
`.trim();

        try {
            // @ts-ignore - Using new responses API with web search
            const response = await (openai as any).responses.create({
                model: "gpt-4o-mini",
                tools: [{ type: "web_search_preview" }],
                input: prompt,
                temperature: options?.temperature ?? 0.7,
            });

            const messageOutput = response.output?.find((o: any) => o.type === "message" || o.type === "message_completion");
            const text = messageOutput?.content?.[0]?.text || messageOutput?.content || "";

            const metrics = SomEngine.calculateMetrics(text, input.brand, input.competitors);

            return {
                ...metrics,
                rawText: text
            };
        } catch (error) {
            console.error(`[OpenAIProvider] Failed to generate scan:`, error);
            throw error;
        }
    }
}
