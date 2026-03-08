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

        const prompt = `
You are an AI visibility analyst with comprehensive knowledge about brands and industries. Research what you know about the brand "${input.brand}" operating in the "${input.industry}" industry. 
Then compare it against these competitors: ${input.competitors.join(", ")}.

Based on your knowledge, provide a detailed analysis answering:

1. BRAND RECOGNITION (score 0-10): How established and recognized is "${input.brand}" in ${input.industry}? 
   What is their website, founding year, and key products/services if you know them?

2. CATEGORY LEADERSHIP: In ${input.industry}, rank these brands by AI visibility: ${[input.brand, ...input.competitors].join(", ")}
   Who would an AI most likely recommend first? Give a clear ranking 1st through ${input.competitors.length + 1}.

3. SENTIMENT: What is the online and AI sentiment around "${input.brand}"? 
   Positive/Neutral/Negative? Why?

4. COMPETITOR GAPS: What specific advantages do ${input.competitors.join(", ")} have over "${input.brand}" in terms of AI visibility and online presence?

5. INDUSTRY BENCHMARK: Is "${input.brand}" above average, average, or below average visibility for ${input.industry}? 
   Justify with specific evidence from your knowledge.

6. VISIBILITY SCORE: Give "${input.brand}" an overall AI visibility score from 0-100 based on your knowledge.
   Also give each competitor a score: ${input.competitors.map(c => `${c}: X/100`).join(", ")}

Be as specific as possible, citing real facts you know. Base all scores on evidence, not assumptions.
`.trim();

        try {
            const response = await anthropic.messages.create({
                model: "claude-sonnet-4-6",
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
