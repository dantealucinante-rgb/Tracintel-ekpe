import { Skeleton } from "@/components/ui/skeleton"; // I'll inline this if it doesn't exist, but let's assume I need to create a simple one or duplicate code
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-zinc-900 rounded-lg"></div>
                    <div className="h-4 w-48 bg-zinc-900 rounded-lg"></div>
                </div>
                <div className="h-12 w-40 bg-zinc-900 rounded-lg"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-48 bg-zinc-900 rounded-2xl border border-white/5"></div>
                <div className="md:col-span-2 h-48 bg-zinc-900 rounded-2xl border border-white/5"></div>
            </div>

            {/* Graph Skeleton */}
            <div className="h-[400px] bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-zinc-800 animate-spin" />
            </div>
        </div>
    );
}
