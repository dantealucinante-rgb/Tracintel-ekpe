import { ScanService } from '@/lib/core/scan-service';
import DashboardClient from './DashboardClient';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Get Session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch Data
  let dashboardData = null;
  try {
    if (user) {
      dashboardData = await ScanService.getDashboardData();
    }
  } catch (error) {
    console.error('[DashboardPage] Error fetching dashboard data:', error);
    // We'll allow it to render with null data, which will trigger the empty state in the client
  }

  return (
    <DashboardClient
      initialData={dashboardData}
      user={user}
    />
  );
}
