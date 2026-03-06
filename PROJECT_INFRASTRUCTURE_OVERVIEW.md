# Tracintel: Project Infrastructure Overview

This document provides a comprehensive technical overview of the refactored Tracintel backend, AI integration, and automated infrastructure implemented during this session.

---

## 🏗️ Core Architecture

### 1. Standardized Supabase (SSR)
We transitioned from standalone Supabase clients to a centralized, server-side-first approach using `@supabase/ssr`.
- **Server Client**: `src/lib/supabase/server.ts` handles cookie-based authentication, ensuring sessions persist across API routes and Server Actions.
- **Client Components**: `src/lib/supabase/client.ts` enables secure, authenticated interactions from the browser.
- **Middleware**: `src/middleware.ts` was refactored to use the centralized server client, providing unified route protection and session refreshing.

### 2. Database Layer (Prisma)
The database interaction was hardened to ensure performance and prevent connection leaks.
- **Singleton Pattern**: `src/lib/db.ts` implements a strict singleton for the `PrismaClient` using `globalThis`, preventing multiple instances during development hot-reloads.
- **Optimized Schema**: The `prisma/schema.prisma` was completely overhauled to support the new intelligence-centric data model.

---

## 📊 Data Model (Schema)

The new schema is designed for high-density brand visibility analysis:

| Model | Description |
| :--- | :--- |
| **Organization** | The primary tenant. Stores subscription plans, scan limits, usage counts, and strategic context. |
| **Profile** | User metadata. Maps Supabase `userId` to an `Organization`. |
| **VisibilityScan** | A single execution of the intelligence engine for a brand/industry pair. |
| **LlmResponse** | Raw responses from different providers, keyed to a specific scan. |
| **Signal** | Extracted visibility metrics (`mentionFrequency`, `citationDensity`, etc.) derived from AI responses. |

---

## 🤖 AI Intelligence Layer

The "Brain" of Tracintel is now highly reliable and metrics-driven.

### 1. Provider Orchestration (Fallback)
The system uses a hierarchical fallback chain to ensure reliability:
1.  **Gemini 1.5/2.0 Pro** (Primary)
2.  **OpenAI GPT-4o-mini** (Secondary)
3.  **Claude 3.5 Sonnet** (Tertiary)

This logic is centralized in `src/lib/ai/providers/index.ts` via the `runWithFallback` function.

### 2. SoM Logic Engine
The new `som-engine.ts` calculates precise visibility metrics using a 0-1 ratio system:
- **Mention Frequency**: Volume of brand presence in LLM training/retrieval context.
- **Citation Density**: Strength of URLs or sources provided by the model.
- **Sentiment Score**: Polarity analysis of the brand mentions.
- **Latent Density**: Depth of brand association within the model's latent space.

---

## 🛠️ Business Logic & API

### 1. Scan Service (`src/lib/core/scan-service.ts`)
A dedicated service layer that decouples business logic from HTTP handlers:
- **Authenticated Execution**: Verifies user sessions and maps them to organizations.
- **Limit Enforcement**: Automatically checks `scansUsed` vs `scanLimit`.
- **Atomic Transactions**: Uses Prisma `$transaction` to ensure `VisibilityScan`, `LlmResponse`, and `Signal` records are saved together.

### 2. API Routes
- **`/api/scan`**: POST endpoint that validates input with Zod and triggers the Scan Service.
- **`/api/dashboard`**: GET endpoint that retrieves the last 10 scans with nested signals for reporting.
- **`/auth/callback`**: Handles OAuth state/code exchange for Supabase authentication.

---

## ⚡ Automated Infrastructure

### Auth-to-DB Sync (Trigger)
We implemented a Supabase database trigger (`supabase/migrations/001_create_profile_on_signup.sql`):
- **Function**: `handle_new_user()`
- **Trigger**: `on_auth_user_created`
- **Effect**: Automatically creates an `Organization` (Starter Plan) and a `Profile` whenever a user signs up via Supabase Auth.

---

## ⚙️ Environment Configuration

The system is designed to be "Simulation-First". If AI keys are missing from `.env`, it will automatically enter a simulation mode, allowing for UI/UX testing without API costs.

**Required Keys**:
- `DATABASE_URL`: Supabase Connection String.
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Auth & Client SDK.
- `GOOGLE_GEMINI_API_KEY`: Primary AI engine.

---

## 🧪 Verification & Reliability
- **Type Safety**: Full TypeScript coverage for Scan Inputs, Results, and Prisma Models.
- **Manual Check**: Verification script `debug-prisma.ts` (now removed) was used to ensure connection stability.
- **Performance**: Database transactions minimize round-trips and ensure data integrity.
