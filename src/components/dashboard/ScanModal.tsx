"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ScanForm from './ScanForm';

interface ScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (data: { brand: string; industry: string; competitors: string[] }) => Promise<void>;
    isLoading: boolean;
}

export default function ScanModal({ isOpen, onClose, onScan, isLoading }: ScanModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[520px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-[#E5E7EB]"
                    >
                        <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between">
                            <div>
                                <h2 className="text-[20px] font-semibold text-[#0F172A] tracking-tight">Run New Brand Scan</h2>
                                <p className="text-[14px] text-[#64748B] mt-1">AI models will analyze your brand across the web.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-10">
                            <ScanForm onScan={async (data) => {
                                await onScan(data);
                                onClose();
                            }} isLoading={isLoading} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
