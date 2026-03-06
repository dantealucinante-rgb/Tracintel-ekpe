# Tracintel: Web Application Functional Overview

Tracintel is an enterprise-grade **Generative Engine Optimization (GEO)** platform. It enables brands to monitor, analyze, and optimize their visibility within the latent space of Large Language Models (LLMs) like ChatGPT, Gemini, and Claude.

---

## 🌟 Key Functional Pillars

### 1. Latent Visibility Monitoring
The core value proposition of Tracintel is the ability to see how AI "perceives" your brand.
- **Latent Visibility Score (0-100)**: A proprietary aggregate metric representing your brand's overall footprint across major LLMs.
- **Semantic Saturation**: Measures how deeply your brand's core value propositions are embedded in the model's training and retrieval data.
- **Signal Strength**: Quantifies individual mentions, citations, and recommendations from AI responses.

### 2. The Intelligence Engine (Scans)
Users can initiate real-time "Intelligence Scans" to refresh their data.
- **Direct Brand Check**: Verifies if the AI recognizes the brand as an industry authority.
- **Category Leadership**: Analyzes where the brand ranks when an AI is asked to list top providers in a specific industry.
- **Competitor Comparison**: Directly compares the brand against up to 3 competitors to see who the AI "recommends."

### 3. Market Truth Visualization
The dashboard provides a high-fidelity "Theater of Truth" using dynamic data visualizations:
- **Cross-Model Comparison**: An area chart showing visibility trends across OpenAI (Electric Blue), Gemini (Emerald Green), and Claude (Deep Violet).
- **Traffic Share Breakdown**: Visualizes the percentage of "generative traffic" your brand is capturing relative to the general market.
- **Vector Displacement**: (Coming Soon) A graph showing how brand sentiment shifts over time within the LLM's latent vectors.

---

## 🚀 User Experience & Journey

### 1. The Onboarding Flow
- **Auto-Provisioning**: Upon first signup via Supabase Auth, the system automatically provisions a **Personal Workspace** (Organization) with a Starter Plan logic.
- **Initial Mapping**: Users are prompted to run an "Initial Intelligence Scan" to begin their data journey.

### 2. Strategy Injection
Users can define a **Strategy Context** (e.g., "Focus on our commitment to sustainable AI"). This context is injected into every subsequent scan, guiding the AI's "attention" and allowing users to measure how well their specific messaging is resonating within the models.

### 3. Usage & Limits
- **Scans Dashboard**: Users can track their monthly scan usage against their plan limits (e.g., 120 scans/month for Starter).
- **Historical Analysis**: The dashboard displays a history of the last 10 scans, allowing users to track progress and "epochs" of intelligence.

### 4. Guest Mode (Preview)
Unauthenticated users can explore a "Simulated Dashboard" with placeholder data to understand the platform's power before signing up. Live "Intelligence Nodes" are automatically locked until a secure session is verified.

---

## 🛡️ Trust & Reliability
- **Verification Protocols**: Every scan is authenticated and verified via Supabase SSR.
- **Atomic Persistence**: Results are saved in unified transactions, ensuring that visibility scores, raw AI text, and signals are always perfectly synchronized.
- **Multi-Model Fallback**: If a primary AI provider (like Gemini) is unreachable, the system automatically falls back to OpenAI or Claude to ensure data continuity.
