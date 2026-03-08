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
