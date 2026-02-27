import Anthropic from '@anthropic-ai/sdk';
import {
    ILlmProvider,
    LlmMessage,
    LlmProviderResponse,
    ScanPromptOptions
} from '../types';

export class AnthropicProvider implements ILlmProvider {
    readonly providerName = 'anthropic';
    private client: Anthropic;

    constructor(apiKey?: string) {
        this.client = new Anthropic({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY || '',
        });
    }

    async generateResponse(
        messages: LlmMessage[],
        options?: ScanPromptOptions
    ): Promise<LlmProviderResponse> {
        const model = options?.model || 'claude-3-5-sonnet-20240620';

        // Extract system message if present
        const systemMessage = messages.find(m => m.role === 'system');
        const anthropicMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
                content: m.content
            }));

        const response = await this.client.messages.create({
            model: model,
            max_tokens: options?.maxTokens || 4096,
            system: systemMessage?.content,
            messages: anthropicMessages,
            temperature: options?.temperature ?? 0.7,
        });

        // Claude returns content as an array of blocks
        const text = response.content
            .filter(block => block.type === 'text')
            .map(block => (block as any).text)
            .join('\n');

        return {
            content: text,
            usage: {
                promptTokens: response.usage.input_tokens,
                completionTokens: response.usage.output_tokens,
                totalTokens: response.usage.input_tokens + response.usage.output_tokens,
            },
            model: response.model,
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
