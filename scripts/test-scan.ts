import 'dotenv/config';
import { GeminiProvider } from '../src/lib/ai/providers/gemini-provider';
import { ScannerService, BrandProfile } from '../src/lib/core/scanner';
import prisma from '../src/lib/db';

async function main() {
    console.log('🚀 Starting Test Scan...');

    // 1. Setup
    const provider = new GeminiProvider();
    const scanner = new ScannerService(provider);

    // 2. Create Mock Data
    console.log('📝 Creating mock organization and data source...');
    const org = await prisma.organization.create({
        data: {
            name: 'Test Org',
            slug: `test-org-${Date.now()}`,
        },
    });

    const ds = await prisma.dataSource.create({
        data: {
            type: 'WEB',
            name: 'Manual Test',
            config: {},
            organizationId: org.id,
        },
    });

    const profile: BrandProfile = {
        name: "Linear",
        industry: "Project Management Software",
        competitors: ["Jira", "Asana", "Monday.com"],
        organizationId: org.id,
        dataSourceId: ds.id
    };

    // 3. Run Scan
    console.log('running scan for:', profile.name);
    try {
        const result = await scanner.runScan(profile);

        console.log('\n✅ Scan Completed!');
        console.log('Status:', result.status);
        console.log('Scores:', JSON.stringify(result.scores, null, 2));

        // 4. Verify DB
        const scanRecord = await prisma.visibilityScan.findUnique({
            where: { id: result.scanId },
            include: { responses: true }
        });

        console.log('\n💾 Database Verification:');
        console.log('Scan ID:', scanRecord?.id);
        console.log('Responses saved:', scanRecord?.responses.length);
        scanRecord?.responses.forEach(r => {
            console.log(`- [${r.modelName}] ${r.prompt.substring(0, 50)}... -> Score: ${r.sentimentScore}`);
        });

    } catch (error) {
        console.error('❌ Scan Failed:', error);
    } finally {
        // Cleanup
        await prisma.llmResponse.deleteMany({ where: { scan: { organizationId: org.id } } });
        await prisma.visibilityScan.deleteMany({ where: { organizationId: org.id } });
        await prisma.dataSource.deleteMany({ where: { organizationId: org.id } });
        await prisma.organization.deleteMany({ where: { id: org.id } });
        console.log('\n🧹 Cleanup complete');
    }
}

main();
