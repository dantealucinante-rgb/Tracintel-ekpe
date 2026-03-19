"use client";

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimulationBanner() {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="w-full bg-[#D97706]/[0.08] border-b border-[#D97706]/[0.1] py-3 px-12 flex items-center justify-center gap-4 overflow-hidden"
        >
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            <p className="text-[11px] font-bold text-[#D97706] uppercase tracking-widest">
                Viewing simulated intelligence. Sign up to run live vector scans for your brand.
            </p>
        </motion.div>
    );
}
