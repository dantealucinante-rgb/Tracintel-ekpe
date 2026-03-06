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
            whileHover={{ y: -4, borderColor: 'rgba(0,122,255,0.2)', boxShadow: '0 20px 40px -20px rgba(0,122,255,0.1)' }}
            className={`bg-white border border-black/5 rounded-[3rem] p-8 md:p-10 transition-all group flex flex-col min-h-[420px] w-full ${className}`}
        >
            <div>
                <div className="flex items-center justify-between mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Icon className="h-6 w-6 text-[#007AFF] fill-[#007AFF]/20" />
                    </div>
                    {trend && (
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${trendType === 'up' ? 'bg-[#34C759]/10 text-[#34C759]' :
                            trendType === 'down' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                                'bg-black/5 text-black/40'
                            }`}>
                            {trend}
                        </div>
                    )}
                    {isSimulated && (
                        <div className="absolute top-8 right-8 px-2 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded text-[8px] font-mono font-bold text-amber-600 tracking-widest uppercase">
                            Simulated
                        </div>
                    )}
                </div>

                <h3 className="text-4xl font-extrabold tracking-tighter text-black mb-2 font-sans">{value}</h3>
                <div className="text-[10px] font-bold text-black/30 uppercase tracking-[0.3em] mb-6">{title}</div>
            </div>

            <p className="text-[14px] leading-relaxed text-black/40 font-medium border-t border-black/5 pt-6 group-hover:text-black/60 transition-colors">
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
