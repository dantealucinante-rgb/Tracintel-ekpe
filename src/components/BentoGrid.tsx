"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BentoCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    className?: string;
    isSimulated?: boolean;
}

export function BentoCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendType = 'neutral',
    className = "",
    isSimulated = false
}: BentoCardProps) {
    return (
        <motion.div
            layout
            whileHover={{ y: -4, borderColor: '#E5E7EB', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)' }}
            className={`bg-white border border-[#E5E7EB] rounded-[24px] p-8 md:p-10 transition-all group flex flex-col min-h-[400px] w-full relative ${className}`}
        >
            <div>
                <div className="flex items-center justify-between mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-[#E5E7EB]">
                        <Icon className="h-6 w-6 text-[#111827]" />
                    </div>
                    {trend && (
                        <div className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            trendType === 'down' ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-gray-50 text-gray-500 border border-gray-100'
                            }`}>
                            {trend}
                        </div>
                    )}
                    {isSimulated && (
                        <div className="absolute top-8 right-8 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded text-[10px] font-bold text-amber-600 tracking-wider uppercase">
                            Simulated
                        </div>
                    )}
                </div>

                <h3 className="text-4xl font-bold tracking-tight text-[#111827] mb-2">{value}</h3>
                <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-6">{title}</div>
            </div>

            <p className="text-[14px] leading-relaxed text-[#6B7280] font-medium border-t border-[#E5E7EB] pt-6 group-hover:text-[#111827] transition-colors">
                {description}
            </p>
        </motion.div>
    );
}

export default function BentoGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
            {children}
        </div>
    );
}
