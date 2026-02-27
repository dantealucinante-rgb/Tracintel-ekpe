/**
 * Unified interface for LLM Providers.
 * This ensures the core application logic remains independent of specific AI models.
 */

export type LlmMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export interface ScanPromptOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json_object';
}

export interface LlmProviderResponse {
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string; // The specific model used (e.g. gpt-4-0125-preview)
}

export interface ILlmProvider {
    /**
     * The name of the provider (e.g., 'openai', 'anthropic', 'google')
     */
    readonly providerName: string;

    /**
     * Generate a response for a given set of messages.
     */
    generateResponse(
        messages: LlmMessage[],
        options?: ScanPromptOptions
    ): Promise<LlmProviderResponse>;

    /**
     * Optional: Specific method for brand visibility analysis
     * to allow providers to optimize their prompts or use specialized models.
     */
    analyzeVisibility?(
        brandName: string,
        context: string
    ): Promise<LlmProviderResponse>;
}
