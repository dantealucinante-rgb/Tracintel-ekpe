'use server'

// Server action to update organization strategy context for future visibility scans
import { createClient as createSupabaseServer } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function saveStrategy(context: string) {
    try {
        // 1. Verify Session
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        // 2. Fetch Profile and Organization
        const profile = await prisma.profile.findFirst({
            where: { userId: user.id }
        })

        if (!profile) {
            return { success: false, error: 'Organization not found' }
        }

        // 3. Update Organization
        await prisma.organization.update({
            where: { id: profile.organizationId },
            data: { strategyContext: context }
        })

        revalidatePath('/dashboard')
        return { success: true }

    } catch (error: any) {
        console.error('[Action Strategy] Unexpected error:', error)
        return { success: false, error: error.message || 'Internal server error' }
    }
}
