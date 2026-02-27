/**
 * Tracintel – 4-Tier Pricing Constants
 * Single source of truth for plan limits, model access, and pricing.
 * Keep in sync with schema.prisma PlanTier enum.
 */

export type PlanTierId = 'STARTER' | 'GROWTH' | 'PRO' | 'SCALE';

export interface PlanConfig {
    id: PlanTierId;
    name: string;
    price: number; // EUR, monthly
    yearlyPrice: number; // EUR, yearly (≈ -25%)
    monthlyLimit: number; // AI answers / month
    models: string[]; // allowed model identifiers
    interval: string; // scan interval description
    highlighted: boolean;
    badge?: string;
    technicalImplications: string[];
    features: string[];
    cta: string;
}

export const PLAN_CONFIGS: Record<PlanTierId, PlanConfig> = {
    STARTER: {
        id: 'STARTER',
        name: 'Starter',
        price: 9.99,
        yearlyPrice: 7.49,
        monthlyLimit: 120,
        models: ['chatgpt'],
        interval: 'weekly',
        highlighted: false,
        technicalImplications: [
            'Single-model execution (ChatGPT only)',
            'Weekly scan interval',
            'Standard retrieval pipeline',
            'No multi-model cross-referencing',
        ],
        features: [
            '120 AI answers / month',
            'ChatGPT-only coverage',
            'Weekly scan reports',
            'Citation Frequency Baseline',
            'Brand sentiment overview',
            'Email support',
        ],
        cta: 'Start Free Trial',
    },

    GROWTH: {
        id: 'GROWTH',
        name: 'Growth',
        price: 39,
        yearlyPrice: 29,
        monthlyLimit: 500,
        models: ['chatgpt', 'perplexity'],
        interval: 'bi-weekly',
        highlighted: false,
        technicalImplications: [
            'Multi-model execution (ChatGPT + Perplexity)',
            'Bi-weekly scan interval',
            'Cross-model citation delta',
            'RAG pipeline coverage for Perplexity',
        ],
        features: [
            '500 AI answers / month',
            'ChatGPT + Perplexity coverage',
            'Bi-weekly scan reports',
            'Cross-model citation delta',
            'Competitor share tracking (3 brands)',
            'Priority email support',
        ],
        cta: 'Scale Your Reach',
    },

    PRO: {
        id: 'PRO',
        name: 'Pro',
        price: 79,
        yearlyPrice: 59,
        monthlyLimit: 2000,
        models: ['chatgpt', 'perplexity', 'gemini'],
        interval: 'daily',
        highlighted: true,
        badge: 'Most Popular',
        technicalImplications: [
            '3-model orchestration (ChatGPT + Perplexity + Gemini)',
            'Adaptive daily monitoring',
            'Latent space centroid tracking',
            'Reranker pass-through optimization',
        ],
        features: [
            '2,000 AI answers / month',
            'ChatGPT, Perplexity & Gemini coverage',
            'Adaptive daily monitoring',
            'Signal Lab GEO optimization',
            'Competitor SOV delta (10 brands)',
            'Advanced RAG auditing',
            'Priority engineer support',
            '90-day data retention',
        ],
        cta: 'Maximize Visibility',
    },

    SCALE: {
        id: 'SCALE',
        name: 'Scale',
        price: 149,
        yearlyPrice: 112,
        monthlyLimit: 10000,
        models: ['chatgpt', 'perplexity', 'gemini', 'claude', 'aio'],
        interval: 'real-time',
        highlighted: false,
        technicalImplications: [
            'Full model suite (5 models)',
            'API Access with uncapped rate limits',
            'Queue Management & priority routing',
            // TODO [Sprint X]: Priority Queueing for SCALE tier to be fully implemented in the next sprint.
            // When planTier === SCALE, route all scan requests through a dedicated high-priority queue
            // to guarantee sub-200ms response SLA and bypass standard rate limits.
            'Real-time adaptive scanning',
        ],
        features: [
            '10,000 AI answers / month',
            'Full model suite (5 AI models)',
            'Real-time continuous monitoring',
            'Dedicated API access (uncapped)',
            'Queue Management & priority routing',
            'Unlimited competitor auditing',
            'Custom model integration',
            'Dedicated success engineer',
            'Unlimited data archival',
            'SSO & audit logging',
        ],
        cta: 'Go Enterprise',
    },
};

/** Flat limits array keyed by plan ID – for use in backend guards */
export const PLAN_LIMITS: Record<PlanTierId, { monthlyLimit: number; models: string[] }> = {
    STARTER: { monthlyLimit: 120, models: PLAN_CONFIGS.STARTER.models },
    GROWTH: { monthlyLimit: 500, models: PLAN_CONFIGS.GROWTH.models },
    PRO: { monthlyLimit: 2000, models: PLAN_CONFIGS.PRO.models },
    SCALE: { monthlyLimit: 10000, models: PLAN_CONFIGS.SCALE.models },
};

/** Models that require GROWTH plan or above */
export const RESTRICTED_MODELS_STARTER = ['perplexity', 'aio', 'claude'];

/** Models that require PRO plan or above */
export const RESTRICTED_MODELS_GROWTH = ['claude', 'aio'];
