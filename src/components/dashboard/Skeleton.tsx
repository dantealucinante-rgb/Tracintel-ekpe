"use client";

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-black/5",
                className
            )}
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-14 w-48 rounded-2xl" />
            </div>

            {/* Metrics Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-[280px] rounded-[2rem] lg:col-span-2" />
                <Skeleton className="h-[280px] rounded-[2rem]" />
                <Skeleton className="h-[280px] rounded-[2rem]" />
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Skeleton className="h-[500px] rounded-[2rem] lg:col-span-2" />
                <Skeleton className="h-[500px] rounded-[2rem]" />
            </div>
        </div>
    );
}
