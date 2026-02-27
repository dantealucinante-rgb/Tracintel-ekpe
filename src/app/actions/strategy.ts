"use server";

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveStrategy(content: string) {
    if (!content || content.length < 10) {
        throw new Error('Strategy content is too short for meaningful optimization.');
    }

    try {
        // Find or create a default org/scan to link to
        let org = await prisma.organization.findFirst();
        if (!org) {
            org = await prisma.organization.create({
                data: { name: 'Demo Org', slug: 'demo' }
            });
        }

        let scan = await prisma.visibilityScan.findFirst({
            where: { organizationId: org.id },
            orderBy: { createdAt: 'desc' }
        });

        if (!scan) {
            // Create a scan record if none exists
            const ds = await prisma.dataSource.create({
                data: {
                    type: 'WEB',
                    name: 'Initial Seeding',
                    organizationId: org.id,
                    config: {}
                }
            });
            scan = await prisma.visibilityScan.create({
                data: {
                    organizationId: org.id,
                    dataSourceId: ds.id,
                    status: 'COMPLETED'
                }
            });
        }

        // Save strategy as a special Signal type
        await prisma.signal.create({
            data: {
                scanId: scan.id,
                type: 'STRATEGY_INJECTION',
                source: 'Tracintel_Command',
                content: content,
                metadata: {
                    priority: 'HIGH',
                    origin: 'Prompts_Page_Optimization'
                }
            }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save strategy:', error);
        return { success: false, error: error.message };
    }
}
