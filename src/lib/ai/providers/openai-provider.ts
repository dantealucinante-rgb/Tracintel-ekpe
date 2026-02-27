import OpenAI from 'openai';
import {
    ILlmProvider,
    LlmMessage,
    LlmProviderResponse,
    ScanPromptOptions
} from '../types';

export class OpenAIProvider implements ILlmProvider {
    readonly providerName = 'openai';
    private client: OpenAI;

    constructor(apiKey?: string) {
        this.client = new OpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY,
        });
    }

    async generateResponse(
        messages: LlmMessage[],
        options?: ScanPromptOptions
    ): Promise<LlmProviderResponse> {
        const model = options?.model || 'gpt-4o';

        // Map internal LlmMessage roles to OpenAI roles
        const openAIMessages = messages.map(m => ({
            role: m.role,
            content: m.content
        }));

        const completion = await this.client.chat.completions.create({
            model: model,
            messages: openAIMessages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens,
            response_format: options?.responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
        });

        const choice = completion.choices[0];

        return {
            content: choice.message.content || '',
            usage: {
                promptTokens: completion.usage?.prompt_tokens || 0,
                completionTokens: completion.usage?.completion_tokens || 0,
                totalTokens: completion.usage?.total_tokens || 0,
            },
            model: completion.model,
        };
    }

    async analyzeVisibility(brandName: string, context: string): Promise<LlmProviderResponse> {
        const prompt = `
      Analyze the visibility of the brand "${brandName}" in the following context:
      "${context}"
      
      Provide a sentiment score (0-100) and identify key mentions.
      Return JSON.
    `;

        return this.generateResponse(
            [{ role: 'user', content: prompt }],
            { responseFormat: 'json_object' }
        );
    }
}
