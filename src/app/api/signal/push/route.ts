import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SignalsService } from '@/lib/core/signals';
import prisma from '@/lib/db';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch organization context
        const organizationId = (await prisma.organization.findFirst())?.id;

        if (!organizationId) {
            return NextResponse.json({ error: 'Organization context missing' }, { status: 400 });
        }

        const { pushId } = await req.json();

        if (!pushId) {
            return NextResponse.json({ error: 'Missing pushId' }, { status: 400 });
        }

        const signalsService = new SignalsService();
        await signalsService.executeSignalPush(pushId, organizationId);

        return NextResponse.json({ success: true, message: 'Signal executed successfully' });

    } catch (error: any) {
        console.error('Signal Push Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to execute signal' }, { status: 500 });
    }
}
