// Google Gemini AI provider for generating brand visibility scans
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class GeminiProvider implements AiProvider {
    name = "GEMINI";

    async generateScan(input: ScanInput): Promise<ScanResult> {
        const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            tools: [{ googleSearch: {} }] as any
        });

        const prompt = `
Search the web and research the brand "${input.brand}" operating in the "${input.industry}" industry. 
Then compare it against these competitors: ${input.competitors.join(", ")}.

Based on your research, provide a detailed analysis answering:

1. BRAND RECOGNITION (score 0-10): How established and recognized is "${input.brand}" in ${input.industry}? 
   What is their website, founding year, and key products/services if findable?

2. CATEGORY LEADERSHIP: In ${input.industry}, rank these brands by AI visibility: ${[input.brand, ...input.competitors].join(", ")}
   Who would an AI most likely recommend first? Give a clear ranking 1st through ${input.competitors.length + 1}.

3. SENTIMENT: What is the online and AI sentiment around "${input.brand}"? 
   Positive/Neutral/Negative? Why?

4. COMPETITOR GAPS: What specific advantages do ${input.competitors.join(", ")} have over "${input.brand}" in terms of AI visibility and online presence?

5. INDUSTRY BENCHMARK: Is "${input.brand}" above average, average, or below average visibility for ${input.industry}? 
   Justify with specific evidence from your research.

6. VISIBILITY SCORE: Give "${input.brand}" an overall AI visibility score from 0-100 based on your research.
   Also give each competitor a score: ${input.competitors.map(c => `${c}: X/100`).join(", ")}

Be specific, cite real facts you find, and base all scores on actual research not assumptions.
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
