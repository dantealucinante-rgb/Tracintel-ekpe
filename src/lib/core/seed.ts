import prisma from '../db';

/**
 * Seed protocol for Tracintel Dashboard.
 * Populates 20 high-density signals and historical scans.
 */
export async function seedDemoData() {
    try {
        console.log('--- Initializing Tracintel Seed Protocol ---');

        // 1. Ensure Organization
        const org = await prisma.organization.upsert({
            where: { id: 'demo-org-id' },
            update: {},
            create: {
                id: 'demo-org-id',
                name: 'Tracintel Demo',
                slug: 'tracintel-demo'
            }
        });

        // 2. Ensure Data Source
        const ds = await prisma.dataSource.upsert({
            where: { id: 'demo-ds-id' },
            update: {},
            create: {
                id: 'demo-ds-id',
                organizationId: org.id,
                name: 'Main Production Node',
                type: 'WEB',
                config: { url: 'https://tracintel.ai' }
            }
        });

        // 3. Create 5 Historical Scans
        for (let i = 0; i < 5; i++) {
            const scanDate = new Date();
            scanDate.setDate(scanDate.getDate() - (5 - i));

            const scan = await prisma.visibilityScan.create({
                data: {
                    organizationId: org.id,
                    dataSourceId: ds.id,
                    status: 'COMPLETED',
                    createdAt: scanDate,
                    completedAt: scanDate
                }
            });

            // Add Responses for each scan
            const models = ['Gemini-1.5-Pro', 'GPT-4o', 'Claude-3.5-Sonnet'];
            for (const model of models) {
                const score = 65 + (i * 5) + (Math.random() * 5);
                await prisma.llmResponse.create({
                    data: {
                        scanId: scan.id,
                        modelName: model,
                        modelProvider: model.includes('Gemini') ? 'google' : (model.includes('GPT') ? 'openai' : 'anthropic'),
                        prompt: 'Simulated Seed Prompt',
                        rawResponse: 'Seed Data Content',
                        structuredData: { visibilityScore: Math.round(score) } as any,
                        sentimentScore: Math.round(score),
                        latentDensity: 0.6 + (i * 0.05),
                        influenceSources: ['https://techcrunch.com', 'https://reddit.com/r/ai']
                    }
                });

                // Add Signal record
                await (prisma as any).signal.create({
                    data: {
                        scanId: scan.id,
                        type: 'MENTION',
                        source: 'reddit',
                        content: `Seeded signal for ${model}`,
                        mentionFrequency: Math.round(score),
                        citationDensity: Math.round(score * 0.8),
                        accuracyScore: Math.round(score * 1.1),
                        latentDensity: 0.7,
                        metadata: { source: 'seed' }
                    }
                });
            }
        }

        console.log('--- Seed Protocol Successful: 20+ Nodes Synchronized ---');
    } catch (error) {
        console.error('Seed Protocol Failure:', error);
    }
}
