import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

const articles = [
    {
        title: "The Rise of Generative Engine Optimization (GEO)",
        excerpt: "How AI search is transforming the way brands need to think about visibility and why traditional SEO is no longer enough.",
        date: "Feb 15, 2026",
        readTime: "5 min read",
        category: "Strategy"
    },
    {
        title: "Understanding LLM Citation Frequency",
        excerpt: "A deep dive into how large language models decide which brands to recommend and how you can influence these decisions.",
        date: "Feb 12, 2026",
        readTime: "7 min read",
        category: "Technical"
    },
    {
        title: "Measuring Your AI Share of Voice",
        excerpt: "Learn how to quantify your brand's presence in AI-generated responses and track changes over time.",
        date: "Feb 10, 2026",
        readTime: "4 min read",
        category: "Analytics"
    },
    {
        title: "Case Study: Improving Visibility Score by 40%",
        excerpt: "How one B2B SaaS company used Signal Lab to dramatically improve their AI search performance in 30 days.",
        date: "Feb 8, 2026",
        readTime: "6 min read",
        category: "Case Study"
    },
    {
        title: "The Future of AI Search: What Marketers Need to Know",
        excerpt: "Predictions and insights on how AI search will evolve and what brands should do to prepare.",
        date: "Feb 5, 2026",
        readTime: "8 min read",
        category: "Trends"
    },
    {
        title: "Structured Data for AI: Beyond Schema.org",
        excerpt: "Advanced techniques for optimizing your content to be more discoverable and accurately represented by AI models.",
        date: "Feb 1, 2026",
        readTime: "5 min read",
        category: "Technical"
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="border-b border-black/5 bg-white">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white fill-white" />
                        </div>
                        <span className="font-bold tracking-tight text-black">Tracintel</span>
                    </Link>
                    <Link href="/sign-in" className="text-sm font-medium text-black/60 hover:text-black transition-colors">
                        Log In
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6">
                        AI Search Insights
                    </h1>
                    <p className="text-xl text-black/60 font-light leading-relaxed">
                        Thought leadership on Generative Engine Optimization and AI visibility.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <ArticleCard key={index} {...article} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArticleCard({ title, excerpt, date, readTime, category }: any) {
    return (
        <article className="bg-white border border-black/5 rounded-2xl overflow-hidden hover:border-black/20 hover:shadow-xl hover:shadow-black/5 transition-all group">
            <div className="h-48 bg-black/5" />
            <div className="p-8">
                <div className="flex items-center gap-3 text-xs font-mono text-black/40 mb-6 uppercase tracking-widest">
                    <span className="px-2 py-1 bg-black/5 text-black rounded font-bold">{category}</span>
                    <span>{date}</span>
                    <span>·</span>
                    <span>{readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-4 tracking-tight group-hover:text-black/70 transition-colors">
                    {title}
                </h2>
                <p className="text-black/60 text-sm leading-relaxed mb-6 font-light">
                    {excerpt}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-black hover:gap-3 transition-all">
                    READ_FULL_ARTICLE <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}
