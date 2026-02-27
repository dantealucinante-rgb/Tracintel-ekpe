import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('Testing DB connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    try {
        const prisma = new PrismaClient();
        console.log('Client initialized');

        await prisma.$connect();
        console.log('Connected successfully!');

        const count = await prisma.visibilityScan.count();
        console.log('Scan count:', count);

        await prisma.$disconnect();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

main();
