"use client";

import Link from 'next/link';
import { Check, Zap, X, ArrowRight, ShieldCheck, Globe, Database, Cpu, Info } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { PLAN_CONFIGS, type PlanConfig } from '@/lib/constants/pricing';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

const TOOLTIP_DEFS: Record<string, string> = {
    'Citation Clustering':
        'Groups related AI citations by semantic proximity, so you can see which brand-attribute clusters are referenced together in model outputs.',
    'Deduplication':
        'Removes redundant mention records from different crawl runs that refer to the same underlying source, ensuring clean analytics.',
    'Latent Density':
        'A 0–1 score measuring how prominently your brand exists in the high-dimensional representational space of a given LLM.',
    'RAG Pipeline':
        'Retrieval-Augmented Generation — a runtime architecture where the model fetches live documents before generating an answer. Your content must score above the reranker threshold to appear.',
    'Reranker':
        'A secondary model that scores retrieved document chunks for relevance and discards low-scoring ones before they enter the final context window.',
    'Priority Queue':
        'Scale-tier scans are routed through a dedicated execution lane that bypasses standard rate limits, guaranteeing sub-200ms response SLA.',
};

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const plans = Object.values(PLAN_CONFIGS);

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-zinc-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center"
                        >
                            <Zap className="h-4 w-4 text-white fill-white" />
                        </motion.div>
                        <span className="font-bold text-lg tracking-tighter text-zinc-900">Tracintel</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/contact" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Contact Sales</Link>
                        <Link href="/sign-in" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Log In</Link>
                        <Link href="/sign-up" className="text-sm font-bold bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="py-24 px-6 text-center bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-400 mb-6">// INVESTMENT TIERS</div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-900 mb-8 leading-[0.9] italic">
                            Authority<br /><span className="text-zinc-200">at Scale.</span>
                        </h1>
                        <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Stop spending on vanity SEO. Invest in the intelligence signals that drive recommendations in ChatGPT, Perplexity, and Gemini.
                        </p>

                        {/* Billing toggle */}
                        <div className="inline-flex items-center gap-1 bg-zinc-100 p-1.5 rounded-full mb-4">
                            <button
                                onClick={() => setIsYearly(false)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!isYearly ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-700'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsYearly(true)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isYearly ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
                            >
                                Yearly <span className="text-emerald-400 ml-1">−25%</span>
                            </button>
                        </div>
                        {isYearly && (
                            <p className="text-xs text-emerald-600 font-mono">Billed annually — save up to €444/year on Scale</p>
                        )}
                    </motion.div>
                </div>
            </header>

            {/* 4-Tier Pricing Grid */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
                    {plans.map((plan, i) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isYearly={isYearly}
                            delay={i * 0.08}
                        />
                    ))}
                </div>
            </section>

            {/* Technical Annotation Bar */}
            <section className="py-16 px-6 border-t border-zinc-100 bg-slate-50/60">
                <div className="max-w-7xl mx-auto">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 mb-8 text-center">// TECHNICAL GLOSSARY</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.entries(TOOLTIP_DEFS).map(([term, explanation]) => (
                            <div key={term} className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-1.5">
                                    <Info className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                                    <span className="text-[11px] font-bold text-zinc-700 leading-tight">{term}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 leading-relaxed">{explanation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-6 bg-white border-t border-zinc-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-400 mb-4">// FEATURE MATRIX</div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900">
                            Compare Plans
                        </h2>
                    </div>
                    <div className="overflow-x-auto border border-zinc-200 rounded-2xl bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-6 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-200">Capability</th>
                                    <th className="p-6 text-sm font-bold text-center border-b border-zinc-200 text-zinc-900">Starter</th>
                                    <th className="p-6 text-sm font-bold text-center border-b border-zinc-200 text-zinc-900">Growth</th>
                                    <th className="p-6 text-sm font-bold text-center border-b border-zinc-200 bg-zinc-50 text-zinc-900">Pro ★</th>
                                    <th className="p-6 text-sm font-bold text-center border-b border-zinc-200 text-zinc-900">Scale</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm">
                                <CompRow label={<InfoTooltip term="Monthly Answers" explanation="Total AI-generated answers the system retrieves across all models within a calendar month." />} s="120" g="500" p="2,000" sc="10,000" />
                                <CompRow label="AI Models" s="ChatGPT" g="ChatGPT + Perplexity" p="3 Models" sc="Full Suite (5)" />
                                <CompRow label="Scan Interval" s="Weekly" g="Bi-weekly" p="Daily (adaptive)" sc="Real-time" />
                                <CompRow label={<InfoTooltip term="Citation Clustering" explanation={TOOLTIP_DEFS['Citation Clustering']} />} s={<XIcon />} g={<CheckIcon />} p={<CheckIcon />} sc={<CheckIcon />} />
                                <CompRow label={<InfoTooltip term="RAG Pipeline" explanation={TOOLTIP_DEFS['RAG Pipeline']} />} s={<XIcon />} g={<XIcon />} p={<CheckIcon />} sc={<CheckIcon />} />
                                <CompRow label="Signal Lab (GEO)" s={<XIcon />} g={<XIcon />} p={<CheckIcon />} sc={<CheckIcon />} />
                                <CompRow label={<InfoTooltip term="Deduplication" explanation={TOOLTIP_DEFS['Deduplication']} />} s={<XIcon />} g={<CheckIcon />} p={<CheckIcon />} sc={<CheckIcon />} />
                                <CompRow label="API Access" s={<XIcon />} g={<XIcon />} p="Standard" sc="Uncapped" />
                                <CompRow label={<InfoTooltip term="Priority Queue" explanation={TOOLTIP_DEFS['Priority Queue']} />} s={<XIcon />} g={<XIcon />} p={<XIcon />} sc={<CheckIcon />} />
                                <CompRow label="Competitor Tracking" s="—" g="3 brands" p="10 brands" sc="Unlimited" />
                                <CompRow label="Support" s="Email" g="Priority email" p="Priority engineer" sc="Dedicated CSM" />
                                <CompRow label="Data Retention" s="30 days" g="60 days" p="90 days" sc="Unlimited" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Value section */}
            <section className="py-24 px-6 bg-slate-50 border-t border-zinc-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 mb-8">
                        Intelligence,<br /><span className="text-zinc-300">not a cost.</span>
                    </h2>
                    <p className="text-xl text-zinc-500 mb-6 font-light leading-relaxed max-w-2xl mx-auto">
                        In the generative era, the cost of <strong className="text-zinc-700">invisibility</strong> is higher than the cost of intelligence. When an AI model fails to recommend your brand, that's not a missed click—it's a structural loss of authority.
                    </p>
                    <p className="text-base text-zinc-400 max-w-2xl mx-auto">
                        Tracintel customers typically see a <strong className="text-zinc-700">40% increase in citation frequency</strong> within the first two model update epochs.
                    </p>
                </div>
            </section>

            {/* Support pillars */}
            <section className="py-24 px-6 border-t border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    <SupportPillar icon={ShieldCheck} title="Data Privacy" desc="Your scan data is never used to train internal models. We respect the operational perimeter." />
                    <SupportPillar icon={Cpu} title="API First" desc="Integrate Tracintel intelligence directly into your existing marketing tech stack via REST." />
                    <SupportPillar icon={Globe} title="Regional Tuning" desc="Monitor sentiment shifts across geographic LLM clusters and regional training corpora." />
                    <SupportPillar icon={Database} title="Historical Archival" desc="Trace your brand's authority evolution across years of model iterations and epochs." />
                </div>
            </section>

            <Footer />
        </div>
    );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function PricingCard({ plan, isYearly, delay }: { plan: PlanConfig; isYearly: boolean; delay: number }) {
    const price = isYearly ? plan.yearlyPrice : plan.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`
                relative flex flex-col bg-white border rounded-2xl overflow-hidden
                ${plan.highlighted
                    ? 'border-zinc-900 ring-2 ring-zinc-900 shadow-xl shadow-zinc-900/10'
                    : 'border-zinc-200 hover:border-zinc-400 hover:shadow-lg'
                }
                transition-all duration-300
            `}
        >
            {plan.badge && (
                <div className="bg-zinc-900 text-white text-[10px] font-mono font-bold uppercase tracking-widest text-center py-1.5">
                    {plan.badge}
                </div>
            )}

            <div className="p-7 flex flex-col flex-1">
                {/* Tier name + price */}
                <div className="mb-6">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl font-bold tracking-tighter text-zinc-900">€{price % 1 === 0 ? price : price.toFixed(2)}</span>
                        <span className="text-xs font-mono text-zinc-400">/mo</span>
                    </div>
                    {isYearly && (
                        <p className="text-[10px] text-emerald-600 font-mono mt-1">billed annually</p>
                    )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                            <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-zinc-900' : 'text-zinc-400'}`} />
                            <span className="text-zinc-600 leading-snug">{f}</span>
                        </li>
                    ))}
                </ul>

                {/* Technical Implications */}
                <div className="mb-6">
                    <div className="bg-slate-50 rounded-xl px-3 py-2 mb-3">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                            Technical Implications
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {plan.technicalImplications.map((impl) => (
                            <li key={impl} className="flex items-start gap-2 text-[11px] text-zinc-500 leading-relaxed">
                                <div className="w-1 h-1 rounded-full bg-zinc-300 mt-1.5 flex-shrink-0" />
                                <TechnicalImplicationText text={impl} />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA button */}
                <Link
                    href="/sign-up"
                    className={`
                        block w-full py-3.5 rounded-full text-center font-bold text-sm transition-all
                        ${plan.highlighted
                            ? 'bg-zinc-900 text-white hover:bg-zinc-700'
                            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                        }
                    `}
                >
                    {plan.cta} <ArrowRight className="inline h-4 w-4 ml-1" />
                </Link>
            </div>
        </motion.div>
    );
}

/**
 * Wraps known technical terms in tooltips inline within a plain text string.
 */
function TechnicalImplicationText({ text }: { text: string }) {
    const TOOLTIP_TERMS = Object.keys(TOOLTIP_DEFS);

    for (const term of TOOLTIP_TERMS) {
        if (text.includes(term)) {
            const parts = text.split(term);
            return (
                <span>
                    {parts[0]}
                    <InfoTooltip term={term} explanation={TOOLTIP_DEFS[term]} />
                    {parts[1]}
                </span>
            );
        }
    }
    return <span>{text}</span>;
}

function CompRow({ label, s, g, p, sc }: { label: React.ReactNode; s: React.ReactNode; g: React.ReactNode; p: React.ReactNode; sc: React.ReactNode }) {
    return (
        <tr className="hover:bg-slate-50/60 transition-colors text-sm">
            <td className="px-6 py-4 font-medium text-zinc-700">{label}</td>
            <td className="px-6 py-4 text-center text-zinc-500">{s}</td>
            <td className="px-6 py-4 text-center text-zinc-500">{g}</td>
            <td className="px-6 py-4 text-center font-semibold text-zinc-900 bg-zinc-50/60">{p}</td>
            <td className="px-6 py-4 text-center text-zinc-500">{sc}</td>
        </tr>
    );
}

function CheckIcon() {
    return <Check className="h-4 w-4 text-emerald-500 mx-auto" />;
}

function XIcon() {
    return <X className="h-4 w-4 text-zinc-200 mx-auto" />;
}

function SupportPillar({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="text-left">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-zinc-700" />
            </div>
            <h4 className="font-bold text-base mb-2 tracking-tight text-zinc-900">{title}</h4>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">{desc}</p>
        </div>
    );
}
