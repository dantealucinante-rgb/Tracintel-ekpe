import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { ClaudeProvider } from "./claude";
import { ScanInput, ScanResult } from "./types";
import { env } from "@/env";
import { SomEngine, StrictSomJson } from "../som-engine";

const JSON_SCHEMA_REMINDER = `
Every scan must return this exact schema:
{
  "brand_detected": true | false,
  "mention_frequency": <integer>,
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "citation_density": <integer>,
  "competitor_mentions": ["CompetitorA", "CompetitorB"],
  "summary": "<2-sentence plain text summary>"
}
`;

export async function runAllProviders(input: ScanInput) {
    const availableProviders: Record<string, any> = {};
    if (env.GOOGLE_GEMINI_API_KEY) availableProviders.gemini = new GeminiProvider();
    if (env.OPENAI_API_KEY) availableProviders.openai = new OpenAIProvider();
    if (env.ANTHROPIC_API_KEY) availableProviders.claude = new ClaudeProvider();

    const providerCount = Object.keys(availableProviders).length;
    const isSimulationEnabled = process.env.ENABLE_SIMULATION_MODE === 'true';

    // Simulation Mode Lockdown logic
    if (providerCount === 0 && isSimulationEnabled) {
        console.log("[runAllProviders] Simulation mode active. Returning mock data.");
        return {
            gemini: { status: 'fulfilled', value: getMockResult(input, 'gemini') },
            openai: { status: 'fulfilled', value: getMockResult(input, 'openai') },
            claude: { status: 'fulfilled', value: getMockResult(input, 'claude') }
        } as any;
    }

    // SINGLE MODEL MODE: Trigger Multi-Pass
    if (providerCount === 1) {
        const [name, provider] = Object.entries(availableProviders)[0];
        console.log(`[runAllProviders] Single model detected (${name}). Triggering Multi-Pass mode.`);

        const passes = [
            {
                temperature: 0.3,
                prompt: `You are an independent analyst reviewing how AI systems perceive the brand ${input.brand} (also known as: ${input.brand}). Known competitors: ${input.competitors.join(", ")}. Respond ONLY with valid JSON, no explanation, no markdown. ${JSON_SCHEMA_REMINDER}`
            },
            {
                temperature: 0.5,
                prompt: `A user has asked an AI assistant about solutions in the ${input.industry} space. Based on how AI models typically respond to such queries, assess the brand ${input.brand} (also known as: ${input.brand}). Known competitors: ${input.competitors.join(", ")}. Respond ONLY with valid JSON, no explanation, no markdown. ${JSON_SCHEMA_REMINDER}`
            },
            {
                temperature: 0.7,
                prompt: `Compare ${input.brand} (also known as: ${input.brand}) against the following competitors in the context of AI-generated recommendations: ${input.competitors.join(", ")}. Assess how an AI model would position this brand. Respond ONLY with valid JSON, no explanation, no markdown. ${JSON_SCHEMA_REMINDER}`
            }
        ];

        const passResults = await Promise.allSettled(passes.map(p =>
            provider.generateScan(input, { temperature: p.temperature, customPrompt: p.prompt })
        ));

        const successfulPasses: StrictSomJson[] = [];
        const rawPasses: any[] = [];

        passResults.forEach((res, i) => {
            if (res.status === 'fulfilled') {
                const parsed = SomEngine.parseStructuredResponse(res.value.rawText);
                if (parsed) {
                    successfulPasses.push(parsed);
                }
                rawPasses.push({
                    pass: i + 1,
                    status: 'success',
                    data: parsed,
                    rawText: res.value.rawText
                });
            } else {
                rawPasses.push({
                    pass: i + 1,
                    status: 'failed',
                    error: res.reason
                });
            }
        });

        if (successfulPasses.length < 2) {
            throw new Error(`Multi-pass scan failed: Only ${successfulPasses.length} passes succeeded. At least 2 are required.`);
        }

        const aggregated = SomEngine.aggregateMultiPassResults(successfulPasses);
        const metrics = SomEngine.calculateMetrics(JSON.stringify(aggregated), input.brand, input.competitors);

        return {
            [name]: {
                status: 'fulfilled',
                value: {
                    ...metrics,
                    rawText: JSON.stringify(aggregated),
                    raw_passes: rawPasses // Attach for persistence in ScanService
                }
            }
        };
    }

    // MULTI MODEL MODE: Standard Parallel execution
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

function getMockResult(input: ScanInput, provider: string) {
    const baseScore = 65 + Math.floor(Math.random() * 20);
    return {
        mentionFrequency: 0.7,
        citationDensity: 0.5,
        sentimentScore: 0.8,
        latentDensity: 0.7,
        rawText: JSON.stringify({
            brand_detected: true,
            mention_frequency: 7,
            sentiment: "positive",
            citation_density: 3,
            competitor_mentions: input.competitors.slice(0, 2),
            summary: `Simulated result for ${input.brand}. Strong visibility detected in ${input.industry}.`
        })
    };
}
