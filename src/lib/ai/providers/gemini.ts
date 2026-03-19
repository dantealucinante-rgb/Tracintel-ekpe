// Google Gemini AI provider for generating brand visibility scans
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiProvider, ScanInput, ScanResult } from "./types";
import { SomEngine } from "../som-engine";
import { env } from "@/env";

export class GeminiProvider implements AiProvider {
  name = "GEMINI";

  async generateScan(input: ScanInput, options?: { temperature?: number; customPrompt?: string }): Promise<ScanResult> {
    const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      tools: [{ googleSearch: {} }] as any,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
      }
    });

    const prompt = options?.customPrompt || `
You are analyzing AI perception of the brand "${input.brand}" (also known as: ${input.brand}).
...
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
