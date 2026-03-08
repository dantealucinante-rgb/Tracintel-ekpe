// Google Gemini AI provider for generating brand visibility scans
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class GeminiProvider implements AiProvider {
    name = "GEMINI";

    async generateScan(input: ScanInput): Promise<ScanResult> {
        const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
You are an AI visibility analyst. Analyze the brand "${input.brand}" in the "${input.industry}" industry compared to competitors: ${input.competitors.join(", ")}.

Answer the following questions in order, clearly labeling each answer:

1. BRAND RECOGNITION: On a scale of 0-10, how well do you recognize "${input.brand}" as an authority in ${input.industry}? Explain why.

2. CATEGORY LEADERSHIP: If someone asked you to recommend the top 3 companies in ${input.industry}, would "${input.brand}" be mentioned? Where would it rank compared to ${input.competitors.join(", ")}?

3. SENTIMENT: What is the general sentiment when "${input.brand}" is mentioned in the context of ${input.industry}? (Positive/Neutral/Negative) Explain.

4. COMPETITOR COMPARISON: Compare "${input.brand}" directly against each of these competitors: ${input.competitors.join(", ")}. For each competitor, state which brand an AI would more likely recommend and why.

5. VISIBILITY GAPS: What topics or keywords in ${input.industry} is "${input.brand}" NOT strongly associated with that its competitors are? List up to 3 gaps.

6. INDUSTRY BENCHMARK: Compared to the average brand visibility in ${input.industry}, how would you rate "${input.brand}"? (Above average / Average / Below average) Explain.
`.trim();

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
