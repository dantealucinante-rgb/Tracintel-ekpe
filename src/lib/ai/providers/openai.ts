// OpenAI GPT-4 AI provider for generating brand visibility scans
import OpenAI from "openai";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class OpenAIProvider implements AiProvider {
    name = "GPT4";

    async generateScan(input: ScanInput): Promise<ScanResult> {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY || "",
        });

        const prompt = `In the context of ${input.industry}, if someone asked about ${input.brand} compared to ${input.competitors.join(", ")}, what would you say? Be specific about which brand you would mention most and why.`;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });

            const text = response.choices[0]?.message?.content || "";

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
