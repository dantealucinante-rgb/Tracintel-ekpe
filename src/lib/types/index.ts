export type ScanStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface ScanResult {
    id: string;
    brand: string;
    industry: string;
    status: ScanStatus;
    metrics: {
        visibilityRank: number;
        mentionFrequency: number;
        citationDensity: number;
        sentimentPolarization: number;
        latentDensity: number;
        accuracyScore: number;
    };
    gaps: ScanGap[];
    history?: { date: string; score: number }[];
}

export interface ScanGap {
    id: string;
    type: string;
    title: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description?: string;
}

export interface Signal {
    id: string;
    type: string;
    source: string;
    content: string;
    createdAt: string | Date;
    metadata?: any;
}

export interface DashboardStats {
    latest: {
        id: string;
        score: number;
        latentDensity: number;
        date: string | Date;
        breakdown: {
            direct: number;
            som: Record<string, number>;
        };
        signals: Signal[];
        provider: string;
    } | null;
    history: { date: string; score: number }[];
}
