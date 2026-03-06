import { SomMetrics } from '../ai/som-engine';

export interface AgenticAction {
    id: string;
    type: 'OPTIMIZATION' | 'CITATION_FIX' | 'CONTENT_INJECTION';
    title: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'PENDING' | 'EXECUTED';
}

/**
 * Tracintel Action Engine
 * Analyzes visibility gaps and generates "Agentic Responses"
 */
export class ActionEngine {
    static detectGaps(metrics: SomMetrics): AgenticAction[] {
        const actions: AgenticAction[] = [];

        // 1. Citation Gap Detection
        if (metrics.citationDensity < 0.4) {
            actions.push({
                id: `cit-${Date.now()}`,
                type: 'CITATION_FIX',
                title: 'Insufficient Citation Density',
                description: 'Brand is mentioned but rarely cited. Inject Schema.org JSON-LD to force model attribution.',
                severity: 'HIGH',
                status: 'PENDING'
            });
        }

        // 2. Latent Positioning Gap
        if (metrics.latentDensity < 0.5) {
            actions.push({
                id: `lat-${Date.now()}`,
                type: 'OPTIMIZATION',
                title: 'Semantic Drift Detected',
                description: 'Token proximity to core industry keywords is low. Update technical documentation to align with model training weights.',
                severity: 'MEDIUM',
                status: 'PENDING'
            });
        }

        // 3. Sentiment Polarization (Accuracy) Gap
        if (metrics.sentimentScore < 0.6) {
            actions.push({
                id: `acc-${Date.now()}`,
                type: 'CONTENT_INJECTION',
                title: 'Low Model Accuracy',
                description: 'Models are hallucinating or misrepresenting product specs. Execute high-density content saturation on Reddit/Discord nodes.',
                severity: 'HIGH',
                status: 'PENDING'
            });
        }

        return actions;
    }
}
