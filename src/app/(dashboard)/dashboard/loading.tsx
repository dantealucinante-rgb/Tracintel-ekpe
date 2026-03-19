import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#F7F8FA] p-8 md:p-12 space-y-12 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3">
                    <div className="h-8 w-80 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="h-12 w-44 bg-slate-200 rounded-lg"></div>
            </div>

            {/* Metrics Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-white border border-[#E5E7EB] rounded-[10px]"></div>
                <div className="h-32 bg-white border border-[#E5E7EB] rounded-[10px]"></div>
                <div className="h-32 bg-white border border-[#E5E7EB] rounded-[10px]"></div>
            </div>

            {/* Main Graph Skeleton */}
            <div className="h-[400px] bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#3B4EFF] animate-spin opacity-20" />
            </div>

            {/* Table Skeleton */}
            <div className="space-y-4">
                <div className="h-12 bg-white border border-[#E5E7EB] rounded-[12px]"></div>
                <div className="h-64 bg-white border border-[#E5E7EB] rounded-[12px]"></div>
            </div>
        </div>
    );
}
