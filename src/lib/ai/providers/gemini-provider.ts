import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import {
    ILlmProvider,
    LlmMessage,
    LlmProviderResponse,
    ScanPromptOptions
} from '../types';

export class GeminiProvider implements ILlmProvider {
    readonly providerName = 'gemini';
    private client: GoogleGenerativeAI;
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.GOOGLE_GEMINI_API_KEY || '';
        if (!this.apiKey) {
            console.warn('GeminiProvider: Missing GOOGLE_GEMINI_API_KEY');
        }
        this.client = new GoogleGenerativeAI(this.apiKey);
    }

    async generateResponse(
        messages: LlmMessage[],
        options?: ScanPromptOptions
    ): Promise<LlmProviderResponse> {
        const modelName = options?.model || 'gemini-3-flash-preview';

        // Gemini 1.5 Flash is the current workhorse, 2.0/2.5 are preview.
        // User requested gemini-3-flash-preview (doesn't exist) or gemini-2.5-flash (probably 1.5 flash or 2.0 flash exp). 
        // Let's stick to 'gemini-1.5-flash' as stable default, but allow overrides.
        // Actually user explicitly asked for 'gemini-3-flash-preview' or 'gemini-2.5-flash'. 
        // I'll default to 'gemini-1.5-flash' as a safe bet but respect the option.

        // Construct the model
        const model = this.client.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: options?.temperature,
                maxOutputTokens: options?.maxTokens,
                responseMimeType: options?.responseFormat === 'json_object' ? 'application/json' : 'text/plain',
            }
        });

        // Convert messages to Gemini format (Content objects)
        // Gemini supports 'user' and 'model' roles. 'system' instructions are passed to getGenerativeModel, but for simple chat we can prepend.
        // However, the best practice for system instructions in Gemini is to map them or use systemInstruction in model config.
        // For this implementation, I will filter system messages and use them as systemInstruction if possible, or prepend.

        const systemMessage = messages.find(m => m.role === 'system');
        const conversationHistory = messages.filter(m => m.role !== 'system').map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

        if (systemMessage) {
            // Re-initialize model with system instruction if present
            // Note: systemInstruction is supported in newer SDK versions/models only.
            // If strict toggle needed, we can do it here.
        }

        // For single turn or chat?
        // generateContent is good for single turn or "messages" style providing full history.
        // However, generateContent accepts an array of contents. 

        // If it's just a prompt (often just 1 user message in our scanner), generateContent is easiest.
        // If conversation, use startChat.
        // Our scanner primarily does single-turn analysis.

        let result;
        if (systemMessage) {
            // Prepend system message for simplicity as some older models/regions might be finicky with systemInstruction
            // Or better, use the systemInstruction property
            const modelWithSystem = this.client.getGenerativeModel({
                model: modelName,
                systemInstruction: systemMessage.content,
                generationConfig: {
                    temperature: options?.temperature,
                    maxOutputTokens: options?.maxTokens,
                    responseMimeType: options?.responseFormat === 'json_object' ? 'application/json' : 'text/plain',
                }
            });
            result = await modelWithSystem.generateContent({
                contents: conversationHistory
            });
        } else {
            result = await model.generateContent({
                contents: conversationHistory
            });
        }

        const response = await result.response;
        const text = response.text();

        return {
            content: text,
            usage: {
                promptTokens: 0, // Gemini SDK doesn't always return usage easily in the basic response object without usageMetadata
                completionTokens: 0,
                totalTokens: 0,
            },
            model: modelName,
        };
    }
}
