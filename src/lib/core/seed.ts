import { Prisma } from '@prisma/client';
import prisma from '../db';

/**
 * Seed protocol for Tracintel Dashboard.
 * Populates 20 high-density signals and historical scans.
 */
export async function seedDemoData() {
    try {
        console.log('--- Initializing Tracintel Seed Protocol ---');

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Ensure Organization
            const org = await tx.organization.upsert({
                where: { id: 'demo-org-id' },
                update: {},
                create: {
                    id: 'demo-org-id',
                    name: 'Tracintel Demo',
                    strategyContext: 'Demo context'
                }
            });

            // 2. Ensure Profile
            await tx.profile.upsert({
                where: { userId: 'demo-user-id' },
                update: {},
                create: {
                    userId: 'demo-user-id',
                    organizationId: org.id,
                    email: 'demo@tracintel.ai'
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

                const scan = await tx.visibilityScan.create({
                    data: {
                        organizationId: org.id,
                        dataSourceId: ds.id,
                        brand: 'Tracintel',
                        industry: 'Generative Engine Optimization',
                        competitors: ['OpenAI', 'Google', 'Anthropic'],
                        status: 'COMPLETED',
                        createdAt: scanDate,
                        completedAt: scanDate
                    }
                });

                // Add Responses for each scan
                const models = ['Gemini-1.5-Pro', 'GPT-4o', 'Claude-3.5-Sonnet'];
                for (const model of models) {
                    const score = 0.65 + (i * 0.05) + (Math.random() * 0.05);
                    await tx.llmResponse.create({
                        data: {
                            scanId: scan.id,
                            provider: model.includes('Gemini') ? 'GEMINI' : (model.includes('GPT') ? 'GPT4' : 'CLAUDE'),
                            providerUsed: model.toLowerCase().includes('gemini') ? 'gemini' : (model.toLowerCase().includes('gpt') ? 'openai' : 'claude'),
                            rawText: 'Seed Data Content'
                        }
                    });

                    // Add Signal record
                    await tx.signal.create({
                        data: {
                            scanId: scan.id,
                            mentionFrequency: score,
                            citationDensity: score * 0.8,
                            sentimentScore: score * 0.5, // Seed range 0-1
                            latentDensity: 0.7
                        }
                    });
                }
            }
        });

        console.log('--- Seed Protocol Successful: 20+ Nodes Synchronized ---');
    } catch (error) {
        console.error('Seed Protocol Failure:', error);
    }
}
