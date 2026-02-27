"use client";

import Link from 'next/link';
import { Zap, Terminal, Code2, Copy, Check, ChevronRight, Book, Globe, Shield, Database } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function DocsPage() {
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
                        <span className="font-bold text-2xl tracking-tighter text-black">Tracintel API</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="text-sm font-bold text-black/50 hover:text-black transition-colors">Dashboard</Link>
                        <Link href="/support" className="text-sm font-bold text-black/50 hover:text-black transition-colors">Support</Link>
                    </div>
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
                {/* Sidebar */}
                <aside className="w-full lg:w-80 border-r border-black/5 bg-soft-gray lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto hidden lg:block">
                    <div className="p-10 space-y-12">
                        <div>
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-8 font-bold">Inception</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><a href="#introduction" className="text-black transition-colors">Introduction</a></li>
                                <li><a href="#authentication" className="text-black/40 hover:text-black transition-colors">Authentication</a></li>
                                <li><a href="#quickstart" className="text-black/40 hover:text-black transition-colors">Quick Start</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-8 font-bold">Interface</h4>
                            <ul className="space-y-4 text-sm font-medium cursor-pointer">
                                <li><a href="#scan" className="text-black/40 hover:text-black transition-colors font-mono">POST /scan</a></li>
                                <li><a href="#analyze" className="text-black/40 hover:text-black transition-colors font-mono">GET /analyze</a></li>
                                <li><a href="#signals" className="text-black/40 hover:text-black transition-colors font-mono">POST /signals</a></li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10 md:p-24 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <section className="mb-32">
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12 italic leading-tight" id="introduction">Introduction</h1>
                            <p className="text-2xl text-black/60 leading-relaxed mb-12 font-light">
                                The Tracintel API allows you to programmatically monitor your brand's authority across the generative search landscape.
                            </p>
                            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest bg-black text-white px-6 py-3 rounded-full w-fit shadow-2xl shadow-black/20">
                                <Globe className="h-4 w-4" />
                                <span>Base Endpoint: <code className="font-bold">api.tracintel.ai/v1</code></span>
                            </div>
                        </section>

                        <section className="mb-32">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12" id="authentication">Authentication</h2>
                            <p className="text-xl text-black/60 leading-relaxed mb-12 font-light">
                                Include your secret key in the <code className="bg-black/5 px-2 py-0.5 rounded font-mono text-black font-medium">Authorization</code> header. Keys can be managed in your <Link href="/dashboard/settings" className="text-black font-bold border-b border-black">Security Settings</Link>.
                            </p>
                            <CodeBlock language="bash" code={`curl -H "Authorization: Bearer sk_live_..." \\
  https://api.tracintel.ai/v1/user`} />
                        </section>

                        <section className="mb-32">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12" id="quickstart">Quick Start</h2>
                            <p className="text-xl text-black/60 leading-relaxed mb-12 font-light">
                                Query multiple models simultaneously to establish your brand's baseline visibility and citation affinity.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <CodeBlock language="bash" code="pip install tracintel" title="Python SDK" />
                                <CodeBlock language="bash" code="npm install @tracintel/sdk" title="Node.js SDK" />
                            </div>

                            <CodeTabs
                                python={`import tracintel

client = tracintel.Client("sk_live_...")

# Perform a probabilistic scan
job = client.scans.create(
  brand="Tracintel",
  prompts=["Best brand optimization tool", "Tracintel pricing"],
  models=["gpt-4", "claude-3-5-sonnet"]
)

print(f"Intelligence loop active: {job.id}")`}
                                node={`import Tracintel from '@tracintel/sdk';

const client = new Tracintel('sk_live_...');

// Trigger a citation audit
const job = await client.scans.create({
  brand: 'Tracintel',
  prompts: ['Best brand optimization tool', 'Tracintel pricing'],
  models: ['gpt-4', 'claude-3-5-sonnet']
});

console.log(\`Intelligence loop active: \${job.id}\`);`}
                            />
                        </section>

                        <section className="mb-32">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12" id="scan">Endpoints</h2>

                            <div className="space-y-12">
                                <Endpoint
                                    method="POST"
                                    path="/scan"
                                    desc="Trigger a deep visibility scan across selected LLMs."
                                    params={[
                                        { name: "brand", type: "string", desc: "The name of the entity to monitor." },
                                        { name: "prompts", type: "array", desc: "List of queries to simulate search intent." },
                                        { name: "models", type: "array", desc: "List of target model IDs." }
                                    ]}
                                />

                                <Endpoint
                                    method="GET"
                                    path="/analyze/{job_id}"
                                    desc="Retrieve the sentiment analysis for a specific job."
                                    params={[
                                        { name: "job_id", type: "string", desc: "The unique ID for the intelligence job." }
                                    ]}
                                />
                            </div>
                        </section>
                    </motion.div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

function CodeBlock({ code, language, title }: any) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-[24px] overflow-hidden border border-black/5 bg-black text-white w-full mb-8 shadow-2xl shadow-black/10">
            {title && <div className="px-6 py-4 bg-white/5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/40 border-b border-white/5">{title}</div>}
            <div className="p-8 relative group">
                <pre className="font-mono text-sm overflow-x-auto leading-relaxed">
                    <code className={`language-${language}`}>{code}</code>
                </pre>
                <button
                    onClick={handleCopy}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/30" />}
                </button>
            </div>
        </div>
    )
}

function CodeTabs({ python, node }: any) {
    const [active, setActive] = useState('python');

    return (
        <div className="bento-card overflow-hidden">
            <div className="flex bg-black/5 px-4">
                <button
                    onClick={() => setActive('python')}
                    className={`px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all ${active === 'python' ? 'bg-white text-black translate-y-[1px] border-x border-black/5' : 'text-black/30 hover:text-black'}`}
                >
                    Python
                </button>
                <button
                    onClick={() => setActive('node')}
                    className={`px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all ${active === 'node' ? 'bg-white text-black translate-y-[1px] border-x border-black/5' : 'text-black/30 hover:text-black'}`}
                >
                    Node.js
                </button>
            </div>
            <div className="bg-black pt-4">
                <CodeBlock code={active === 'python' ? python : node} language={active === 'python' ? 'python' : 'javascript'} />
            </div>
        </div>
    )
}

function Endpoint({ method, path, desc, params }: any) {
    const color = method === 'GET' ? 'bg-black text-white/50' : 'bg-black text-white';

    return (
        <div className="bento-card p-10 hover:border-black/10 transition-all">
            <div className="flex items-center gap-4 mb-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest shadow-2xl shadow-black/10 ${color}`}>{method}</span>
                <span className="font-mono text-xl text-black font-bold tracking-tighter">{path}</span>
            </div>
            <p className="text-xl text-black/50 mb-10 font-light leading-relaxed">{desc}</p>

            {params && (
                <div className="bg-black/2 p-8 rounded-3xl border border-black/5">
                    <h5 className="text-[10px] font-mono font-bold text-black/20 uppercase tracking-[0.3em] mb-8">Parameters</h5>
                    <div className="space-y-6">
                        {params.map((p: any) => (
                            <div key={p.name} className="flex flex-col sm:flex-row sm:items-baseline gap-4 text-sm font-medium border-b border-black/5 pb-4 last:border-0 last:pb-0">
                                <span className="font-mono text-black w-40">{p.name}</span>
                                <span className="text-[10px] uppercase font-mono text-black/20 w-32">{p.type}</span>
                                <span className="text-black/50 font-light italic">{p.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
