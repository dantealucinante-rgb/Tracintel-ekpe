# Tracintel | AI Search Intelligence & GEO Platform

**The Searchable-Killer GEO Infrastructure.** Tracintel is an enterprise-grade intelligence dashboard designed for the Generative Engine Optimization (GEO) era. It allows brands to track, analyze, and improve their visibility within AI search models (GPT-4o, Claude 3.5, Gemini, Perplexity).

## 🚀 Vision
As the internet transitions from "Browse" to "Inference," visibility is determined by latent space density, not just search rankings. Tracintel provides the data layer to map this new frontier.

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Prisma ORM
- **Security**: Supabase Auth (SSR), Zod Environment Validation
- **Intelligence**: Multi-LLM Fallback Strategy (Gemini > OpenAI > Anthropic)
- **E-commerce**: Shopify Admin API Integration (Demo Ready)

## 📦 Quick Start

### 1. Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)

### 2. Environment Setup
Create a `.env.local` file in the root directory and populate it with the following:

```bash
# Database
DATABASE_URL="your_postgresql_url"
DIRECT_URL="your_direct_url"

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# AI Intelligence (Optional - Simulation mode will engage if missing)
GOOGLE_GEMINI_API_KEY="your_gemini_key"
OPENAI_API_KEY="your_openai_key"
ANTHROPIC_API_KEY="your_anthropic_key"

# E-commerce (Coming Soon)
SHOPIFY_SHOP_DOMAIN="your-shop.myshopify.com"
SHOPIFY_ADMIN_API_ACCESS_TOKEN="your_token"
```

### 3. Initialize
```bash
npm install
npx prisma generate
npm run dev
```

## 🔐 Production Readiness
This platform is optimized for Vercel deployment:
- **Build Checked**: Zero-failure TypeScript and Linting.
- **Resilient Fallbacks**: Automated "Demo Mode" for missing API tokens.
- **Edge Metrics**: Cached API responses for sub-200ms dashboard loads.

---

*Built with precision for the AI Economy.*
