"use client";

import Link from 'next/link';
import { Zap, Workflow, BrainCircuit, Rocket, Cpu, Globe, Sparkles, Heart, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10"
                        >
                            <Zap className="h-6 w-6 text-white fill-white" />
                        </motion.div>
                        <span className="font-bold text-2xl tracking-tighter text-black">Tracintel</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/about" className="text-sm font-bold text-black/50 hover:text-black transition-colors">About</Link>
                        <Link href="/pricing" className="text-sm font-bold text-black/50 hover:text-black transition-colors">Pricing</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="py-32 md:py-64 px-6 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-black/20 mb-12 border-l-2 border-black pl-6 inline-block mx-auto text-left">// JOIN THE MISSION</div>
                        <h1 className="text-7xl md:text-[140px] font-bold tracking-tighter text-black mb-16 leading-[0.85] italic">
                            The Next <br /><span className="text-black/10">Operating System.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-black/60 mb-20 max-w-3xl mx-auto font-light leading-relaxed">
                            We are looking for engineers, researchers, and designers who believe that LLMs are the new foundation of the internet.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Link href="#positions" className="inline-flex h-16 px-12 rounded-full bg-black text-white font-bold items-center gap-3 transition-all shadow-2xl shadow-black/20 text-lg">
                                View Open Roles <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </header>

            {/* Culture Deep Dive */}
            <section className="py-32 md:py-64 px-6 bg-soft-gray border-y border-black/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
                        <div className="max-w-xl">
                            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-16 leading-[0.95]">
                                AI-First <br /><span className="text-black/20">Engineering.</span>
                            </h2>
                            <div className="space-y-10 text-2xl text-black/70 font-light leading-relaxed">
                                <p>
                                    At Tracintel, we build our product **through** AI. Our culture is defined by "High-Bandwidth Curiosity"—an insatiable need to understand the latent space.
                                </p>
                                <p>
                                    We believe that traditional software engineering is evolving. The future belongs to the "AI-Native Engineer"—someone who views LLMs as a first-class citizen.
                                </p>
                                <p>
                                    Our stack is built for the era of generative intelligence. We don't write boilerplate; we build agents to handle it so we can focus on the hard problems.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <CultureCard
                                icon={Workflow}
                                title="Deterministic vs Probabilistic"
                                description="We live in the tension between discrete code and stochastic AI. You'll spend your days building systems that provide predictable results from unpredictable models."
                            />
                            <CultureCard
                                icon={BrainCircuit}
                                title="High-Bandwidth Curiosity"
                                description="Learning is our primary KPI. We encourage every team member to spend 20% of their week stress-testing new models and obscure research papers."
                            />
                            <CultureCard
                                icon={Rocket}
                                title="Extreme Autonomy"
                                description="We don't do middle management. We hire brilliant people and give them the space to own entire domains. You are responsible for the outcome, not just the ticket."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Challenges */}
            <section className="py-32 md:py-64 px-6 bg-black text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-32">
                        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20 mb-8">// THE CHALLENGES</div>
                        <h2 className="text-5xl md:text-9xl font-bold tracking-tighter mb-12 italic">
                            What You'll Solve
                        </h2>
                    </div>

                    <div className="space-y-24">
                        <ChallengeItem
                            number="01"
                            title="Semantic Drift Detection"
                            description="Build the pipelines that monitor how LLMs change their sentiment toward brands across model updates. Solve the problem of 'probabilistic reputation' in real-time."
                        />
                        <ChallengeItem
                            number="02"
                            title="High-Scale Prompt Orchestration"
                            description="Optimize our probe engine to query 10+ models with 50,000+ prompt variations simultaneously without sacrificing latency or token economy."
                        />
                        <ChallengeItem
                            number="03"
                            title="AI-Native Interface Design"
                            description="Design the dashboards that translate multi-dimensional AI data into actionable marketing signals. Move beyond charts into synthesized intelligence."
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-32 md:py-64 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32">
                        <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-black/20 mb-8">// THE STANDARD</div>
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
                            Global Perks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <BenefitBox icon={Cpu} title="Hardware" desc="Latest M3 Max MacBooks, high-refresh displays, and ergonomic setups of your choice." />
                        <BenefitBox icon={Globe} title="Remote" desc="We are a distributed-first team. Work from wherever you are most productive." />
                        <BenefitBox icon={Sparkles} title="AI Stipend" desc="We cover all your AI tool costs: GPT-4 Plus, Claude Pro, Perplexity, and more." />
                        <BenefitBox icon={Heart} title="Wellness" desc="Full health, dental, and vision, plus a $150/mo global wellness stipend." />
                    </div>
                </div>
            </section>

            {/* Job Openings */}
            <section id="positions" className="py-32 md:py-64 px-6 bg-soft-gray border-t border-black/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white opacity-40 rounded-full blur-3xl -ml-64 -mt-64" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex items-center justify-between mb-24">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Open Roles</h2>
                        <div className="px-6 py-2 rounded-full bg-black text-white text-[10px] font-mono font-bold uppercase tracking-[0.3em]">4 ACTIVE</div>
                    </div>

                    <div className="space-y-6">
                        <JobRow title="Senior Full Stack Engineer" dept="Engineering" type="Remote / Global" />
                        <JobRow title="AI Research Scientist" dept="Machine Learning" type="Remote / US-EU" />
                        <JobRow title="Lead Product Designer" dept="Design" type="Remote / Global" />
                        <JobRow title="Customer Success Lead" dept="Growth" type="Remote / US-EU" />
                    </div>

                    <div className="mt-32 bento-card p-12 md:p-20 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <h3 className="text-3xl font-bold mb-6 italic">Don't see your role?</h3>
                        <p className="text-xl text-black/50 mb-12 font-light leading-relaxed">We are always looking for high-bandwidth individuals. Drop us a note at <strong className="text-black">talent@tracintel.ai</strong>.</p>
                        <Link href="/contact" className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] border-b-2 border-black pb-2 hover:opacity-50 transition-opacity">Contact Us</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function CultureCard({ icon: Icon, title, description }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bento-card p-12 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white mb-8 relative z-10">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold mb-6 tracking-tight relative z-10">{title}</h3>
            <p className="text-black/60 leading-relaxed text-lg font-light relative z-10">{description}</p>
        </motion.div>
    )
}

function ChallengeItem({ number, title, description }: any) {
    return (
        <div className="flex gap-10 group">
            <span className="text-xl font-mono text-white/20 pt-1 tracking-widest">{number}</span>
            <div>
                <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter group-hover:text-white/40 transition-colors leading-tight">{title}</h3>
                <p className="text-xl text-white/50 leading-relaxed max-w-2xl font-light">{description}</p>
            </div>
        </div>
    )
}

function BenefitBox({ icon: Icon, title, desc }: any) {
    return (
        <div className="bento-card p-10 hover:bg-black group transition-colors duration-500">
            <Icon className="h-10 w-10 text-black group-hover:text-white mb-10 transition-colors" />
            <h3 className="font-bold text-xl mb-4 group-hover:text-white transition-colors tracking-tight">{title}</h3>
            <p className="text-sm text-black/40 group-hover:text-white/40 leading-relaxed font-light transition-colors">{desc}</p>
        </div>
    )
}

function JobRow({ title, dept, type }: any) {
    return (
        <div className="bento-card flex flex-col sm:flex-row sm:items-center justify-between p-10 hover:border-black/2 transition-all cursor-pointer group">
            <div className="mb-6 sm:mb-0">
                <h4 className="text-2xl font-bold group-hover:text-black transition-colors italic tracking-tight">{title}</h4>
                <div className="flex items-center gap-6 mt-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-black/30 tracking-widest">{dept}</span>
                    <span className="text-[10px] font-mono uppercase text-black/10 tracking-widest">•</span>
                    <span className="text-[10px] font-mono font-bold uppercase text-black/30 tracking-widest">{type}</span>
                </div>
            </div>
            <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Apply <ArrowRight className="h-5 w-5" />
            </div>
        </div>
    )
}

