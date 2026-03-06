// Core TypeScript interfaces for AI provider integration and scan results
export interface ScanInput {
    brand: string;
    industry: string;
    competitors: string[];
    strategyContext?: string;
}

export interface ScanResult {
    mentionFrequency: number;
    citationDensity: number;
    sentimentScore: number;
    latentDensity: number;
    rawText: string;
}

export interface AiProvider {
    name: string;
    generateScan(input: ScanInput): Promise<ScanResult>;
}
