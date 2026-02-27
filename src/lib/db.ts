import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env.mjs'

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
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
