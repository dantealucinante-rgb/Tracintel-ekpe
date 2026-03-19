"use client";

import { motion } from 'framer-motion';
import {
    Settings,
    Shield,
    Key,
    Save,
    Globe,
    RefreshCcw,
    Database,
    CheckCircle2,
    Loader2,
    Building2,
    CreditCard,
    Plus,
    Trash2,
    Lock,
    ChevronRight,
    Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [org, setOrg] = useState<any>({
        name: 'Enterprise Organization',
        plan: 'Scale',
        scansUsed: 42,
        scanLimit: 100
    });
    const [brands, setBrands] = useState(['Tracintel', 'Acme Corp', 'Global Dynamics']);
    const [newBrand, setNewBrand] = useState('');

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, [supabase.auth]);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        toast.success("Settings saved successfully");
    };

    const addBrand = () => {
        if (newBrand && !brands.includes(newBrand)) {
            setBrands([...brands, newBrand]);
            setNewBrand('');
            toast.success("Brand added");
        }
    };

    const removeBrand = (brand: string) => {
        setBrands(brands.filter(b => b !== brand));
        toast.info("Brand removed");
    };

    const [isSimulationEnabled, setIsSimulationEnabled] = useState(true);
    const [team, setTeam] = useState([
        { name: 'Marcus Sterling', email: 'm.sterling@enterprise.ai', role: 'Admin', status: 'Active' },
        { name: 'Sarah Chen', email: 's.chen@enterprise.ai', role: 'Member', status: 'Active' },
        { name: 'David Miller', email: 'd.miller@enterprise.ai', role: 'Member', status: 'Invited' },
    ]);

    const apiKeys = [
        { name: 'Production Key', key: 'sk-proj-••••••••vQ78', lastUsed: '2 hours ago' },
        { name: 'Development Key', key: 'sk-proj-••••••••aX21', lastUsed: 'Yesterday' },
    ];

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight">Organization Settings</h1>
                    <p className="text-[#6B7280] mt-1 text-[14px] font-medium">Manage your workspace, team access, and API orchestration.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-11 px-6 bg-[#2563EB] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#1D4ED8] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Protocol Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Settings Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* API Orchestration */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-[#2563EB]" />
                                <h2 className="text-[17px] font-semibold text-[#111827]">API Key Management</h2>
                            </div>
                            <button className="text-[11px] font-bold text-[#2563EB] uppercase tracking-widest hover:underline">+ Generate New Key</button>
                        </div>
                        <div className="space-y-4">
                            {apiKeys.map((key, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] group hover:border-[#2563EB]/20 hover:bg-white transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[14px] font-bold text-[#111827]">{key.name}</p>
                                        <div className="flex items-center gap-3">
                                            <code className="text-[12px] text-[#6B7280] font-mono">{key.key}</code>
                                            <button className="text-[#94A3B8] hover:text-[#2563EB] transition-colors">
                                                <RefreshCcw className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Last Used</p>
                                        <p className="text-[12px] font-bold text-[#111827]">{key.lastUsed}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Management */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-[#2563EB]" />
                                <h2 className="text-[17px] font-semibold text-[#111827]">Team Protocol</h2>
                            </div>
                            <button className="h-9 px-4 bg-[#111827] text-white text-[11px] font-bold rounded-[6px] uppercase tracking-widest hover:bg-black transition-all">Add Member</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#F7F8FA]">
                                        <th className="py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Name</th>
                                        <th className="py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Role</th>
                                        <th className="py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Status</th>
                                        <th className="py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.map((member, i) => (
                                        <tr key={i} className="border-b border-[#F7F8FA] last:border-0 group">
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-bold text-[#111827]">{member.name}</span>
                                                    <span className="text-[12px] text-[#6B7280]">{member.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-[13px] font-medium text-[#111827]">{member.role}</span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'Active' ? 'bg-[#16A34A]' : 'bg-[#D97706]')} />
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", member.status === 'Active' ? 'text-[#16A34A]' : 'text-[#D97706]')}>
                                                        {member.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button className="text-[11px] font-bold text-[#6B7280] hover:text-[#DC2626] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Simulation Console */}
                    <div className="bg-[#111827] rounded-[10px] p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Activity className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">Simulation Layer</h3>
                                <div
                                    onClick={() => setIsSimulationEnabled(!isSimulationEnabled)}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300",
                                        isSimulationEnabled ? "bg-[#2563EB]" : "bg-[#374151]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-all duration-300",
                                        isSimulationEnabled ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </div>
                            </div>
                            <p className="text-[14px] text-white leading-relaxed font-medium mb-6">
                                Simulation mode generates synthetic brand signals for testing platform response without consuming API production credits.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", isSimulationEnabled ? "bg-[#16A34A] animate-pulse" : "bg-[#6B7280]")} />
                                <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                                    {isSimulationEnabled ? "Live Simulation Active" : "Production Mode Only"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Hardening */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[10px] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <CreditCard className="w-5 h-5 text-[#2563EB]" />
                            <h3 className="text-[15px] font-bold text-[#111827]">Subscription</h3>
                        </div>
                        <div className="p-4 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] mb-8">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[13px] font-bold text-[#111827]">{org.plan} Tier</span>
                                <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-widest">Active</span>
                            </div>
                            <p className="text-[12px] text-[#6B7280] font-medium leading-relaxed">
                                Full access to Triad Calibration and deterministic manifold mapping.
                            </p>
                        </div>
                        <button className="w-full h-11 bg-white border border-[#E5E7EB] text-[#111827] text-[13px] font-bold rounded-[8px] shadow-sm hover:bg-[#F7F8FA] transition-all">
                            Manage Billing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
