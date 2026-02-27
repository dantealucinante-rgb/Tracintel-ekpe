import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Gemini
export const getGemini = () => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
};

// Initialize OpenAI
export const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return new OpenAI({ apiKey });
};

// Initialize Anthropic
export const getAnthropic = () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;
    return new Anthropic({ apiKey });
};

export type ModelStatus = "Active" | "Inactive";

export interface ModelHealth {
    gemini: ModelStatus;
    openai: ModelStatus;
    anthropic: ModelStatus;
}

/**
 * Performs a lightweight health check on the configured AI models.
 * For this implementation, "Active" means the API key is present.
 * A more robust check could involve a minimal API call.
 */
export async function checkModelHealth(): Promise<ModelHealth> {
    return {
        gemini: process.env.GOOGLE_GEMINI_API_KEY ? "Active" : "Inactive",
        openai: process.env.OPENAI_API_KEY ? "Active" : "Inactive",
        anthropic: process.env.ANTHROPIC_API_KEY ? "Active" : "Inactive",
    };
}
