# Tracintel: Project Brief & Technical Blueprint

Tracintel is a specialized **Generative Engine Optimization (GEO)** platform designed for the AI-first era. It provides enterprise-grade intelligence to track, analyze, and optimize brand visibility within Corporate and Consumer Large Language Models (LLMs).

---

## 🌍 Functional Overview ("Normal" Brief)

### 1. Mission
As the internet moves from "Search" to "Inference," brands are no longer found via links but via **Latent Space Density**. Tracintel's mission is to provide the data layer that maps how AI perceives and recommends brands.

### 2. Core Value Pillars
*   **Latent Visibility Monitoring**: Real-time tracking of brand "footprint" across ChatGPT, Gemini, and Claude.
*   **Intelligence Scans**: Automated probes that check for brand authority, category leadership, and competitor perception.
*   **The "Theater of Truth"**: A high-fidelity dashboard that visualizes AI sentiment, citation density, and market share.
*   **Strategy Injection**: A unique feature allowing brands to "inject" specific messaging into scans to measure resonance and reach within AI models.

### 3. Target Audience
*   **CMOs & Marketing Teams**: To protect brand reputation in AI answers.
*   **SEO/GEO Strategists**: To optimize for the "Answer Engine" era.
*   **Product Owners**: To understand competitor positioning in automated recommendations.

---

## 🛠 Technical Blueprint ("Technical" Brief)

### 1. Modern Full-Stack Architecture
*   **Frontend**: Next.js 16 (App Router) utilizing React 19 server components for high performance.
*   **Styling**: Tailwind CSS 4 with a "High-Density Enterprise" aesthetic (glassmorphism, grid textures, precise typography).
*   **Animations**: Framer Motion for subtle, premium micro-interactions.
*   **Visualizations**: Recharts for dynamic, multi-modal data plotting.

### 2. Intelligence Layer & Orchestration
The "Brain" of Tracintel uses a sophisticated **Multi-LLM Fallback Strategy**:
1.  **Primary**: Google Gemini 1.5/2.0 Pro (Optimized for speed/multimodality).
2.  **Secondary**: OpenAI GPT-4o-mini (Cost-efficient, high-reliability).
3.  **Tertiary**: Claude 3.5 Sonnet (Deep reasoning & nuanced sentiment).

The system features an **Automated Simulation Mode**: If API keys are missing, the platform engages a simulation engine to allow for full UI/UX testing without incurring costs.

### 3. Data Infrastructure (Prisma + Supabase)
*   **Database**: PostgreSQL hosted on Supabase.
*   **ORM**: Prisma for type-safe database interactions and complex transactions.
*   **Auth**: Supabase SSR for secure, cookie-based session management across the App Router.
*   **Schema Highlights**:
    *   `Organization`: Multi-tenant structure with specific `PlanTier` (Starter to Scale).
    *   `VisibilityScan`: Atomic records linking AI responses to calculated `Signal` metrics.
    *   `Signal`: High-precision metrics including `mentionFrequency`, `citationDensity`, and `latentDensity`.
    *   `SignalPush`: (Beta) Integration layer for pushing intelligence directly into platforms like Shopify.

### 4. Security & Performance
*   **Zod**: Strict environment variable and API request validation.
*   **Server Actions**: Clean decoupling of client-side UI and server-side logic.
*   **Atomic Transactions**: Database operations are wrapped in transactions to ensure data integrity between AI responses and metric calculations.

---

## 🚀 Deployment & Integrity
*   **Hosting**: Optimized for Vercel/Next.js edge deployment.
*   **Reliability**: Multi-model fallback ensures zero-downtime for intelligence operations.
*   **Scalability**: Headless service layer (`ScanService`) allows for future CLI or external API integrations.
