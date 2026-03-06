// Google Gemini AI provider for generating brand visibility scans
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class GeminiProvider implements AiProvider {
    name = "GEMINI";

    async generateScan(input: ScanInput): Promise<ScanResult> {
        const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `In the context of ${input.industry}, if someone asked about ${input.brand} compared to ${input.competitors.join(", ")}, what would you say? Be specific about which brand you would mention most and why.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const metrics = SomEngine.calculateMetrics(text, input.brand, input.competitors);

            return {
                ...metrics,
                rawText: text
            };
        } catch (error) {
            console.error(`[GeminiProvider] Failed to generate scan:`, error);
            throw error;
        }
    }
}
