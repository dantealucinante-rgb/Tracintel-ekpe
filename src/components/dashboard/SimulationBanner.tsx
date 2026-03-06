"use client";

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimulationBanner() {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="w-full bg-amber-400/10 border-b border-amber-400/20 py-3 px-12 flex items-center justify-center gap-3 overflow-hidden"
        >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
                You're viewing simulated data. Sign up to run real Intelligence Scans for your brand.
            </p>
        </motion.div>
    );
}
