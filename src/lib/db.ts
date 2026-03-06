// Centralized Prisma client singleton for database access with connection pooling
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env'

const prismaClientSingleton = () => {
    const connectionString = env.DIRECT_URL || env.DATABASE_URL
    const pool = new Pool({
        connectionString,
        ssl: connectionString.includes('supabase.co') || connectionString.includes('localhost') === false
            ? { rejectUnauthorized: false }
            : undefined
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

declare global {
    var prismaInstance: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaInstance ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaInstance = prisma
