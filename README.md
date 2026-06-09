# Minerva — AI-Powered Course Generation Platform

> A full-stack SaaS web application that generates custom learning curricula from any topic using generative AI, YouTube curation, and adaptive quizzes.

[![Next.js](https://img.shields.io/badge/Next.js-13.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-6772E5?logo=stripe)](https://stripe.com/)

---

## 🎯 Overview

**Minerva** automates the entire process of creating structured learning content. A user enters a topic title and unit subtopics — our AI pipeline generates a detailed chapter syllabus, finds the best YouTube lectures, extracts and summarizes transcripts, and creates multiple-choice quizzes to validate comprehension.

The platform implements a **Freemium SaaS monetization model** with Stripe subscription billing, where users start with 10 free course generations and can upgrade to a Pro tier for unlimited access.

**Live Demo**: minerva-ochre.vercel.app

---

## ✨ Key Features

- 🧠 **AI Syllabus Generation** — GPT-4o-mini generates structured course outlines with units and chapters from a single topic keyword
- 📺 **Automated Video Curation** — YouTube Data API v3 searches for and embeds the most relevant lecture videos per chapter
- 📝 **Transcript Summarization** — Automatically extracts and condenses YouTube transcripts into chapter summaries using LLM
- ❓ **Adaptive Quiz Generation** — Generates 5 multiple-choice questions per chapter to reinforce learning
- 🔒 **Google OAuth Authentication** — Secure login using NextAuth.js with Prisma database adapter
- 💳 **Stripe Subscription Billing** — Free tier (10 credits) and Pro tier (unlimited) with full billing portal integration
- 🌐 **Community Gallery** — Browse and explore AI-generated syllabi from all users
- 🌗 **Dark/Light Mode** — Full theme support with smooth transitions
- 📱 **Fully Responsive** — Mobile-first layout using Tailwind CSS

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Browser                             │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTPS
┌───────────────────────────────────▼─────────────────────────────────────┐
│                         Next.js 13 (App Router)                         │
│                                                                          │
│  ┌───────────────────┐   ┌───────────────────┐   ┌──────────────────┐   │
│  │  Server Components│   │  Client Components│   │   API Routes     │   │
│  │  (SSR Pages)      │   │  (React Hooks)    │   │  (REST Handlers) │   │
│  └───────────────────┘   └───────────────────┘   └──────────────────┘   │
└──────────┬────────────────────────┬────────────────────────┬────────────┘
           │                        │                        │
┌──────────▼──────────┐  ┌─────────▼─────────┐   ┌─────────▼──────────┐
│  Supabase PostgreSQL│  │  GitHub Models API│   │    Stripe API      │
│  (via Prisma ORM)   │  │  (GPT-4o-mini)    │   │  (Billing Portal)  │
└─────────────────────┘  └───────────────────┘   └────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Third-party APIs           │
                    │  • YouTube Data API v3        │
                    │  • YouTube Transcript API     │
                    │  • Unsplash API               │
                    └──────────────────────────────┘
```

---

## 🧰 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 13.4 (App Router) | Full-stack React with SSR, API routes, file-system routing |
| Language | TypeScript 5.1 | End-to-end type safety |
| Database | PostgreSQL via Supabase | Scalable cloud-hosted relational database |
| ORM | Prisma 5 | Type-safe database queries and schema migration |
| Authentication | NextAuth.js 4 + Prisma Adapter | Google OAuth 2.0 with JWT session management |
| Styling | Tailwind CSS 3 + Shadcn/UI | Utility-first CSS with accessible component primitives |
| Animations | Framer Motion 10 | Hardware-accelerated micro-animations and transitions |
| State Management | React Query (TanStack) | Async server state, mutation loading states |
| Form Validation | React Hook Form + Zod | Client and server-side schema validation |
| AI Integration | GitHub Models (GPT-4o-mini) | Syllabus, summary, and quiz generation |
| Payments | Stripe SDK 13 | Subscription creation and lifecycle management |
| Video Content | YouTube Data API v3 | Curated video search per chapter |

---

## 📂 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── chapter/getInfo/      # Core AI pipeline endpoint
│   │   ├── course/createChapters/# Course scaffolding endpoint
│   │   ├── course/createUnits/   # AI unit generation endpoint
│   │   ├── stripe/               # Billing session creation
│   │   └── webhook/              # Stripe event handler
│   ├── course/[...slug]/         # Course playback page (SSR)
│   ├── create/[courseId]/        # Chapter generation page
│   ├── create/                   # Course creation form
│   ├── gallery/                  # Community course browser
│   ├── settings/                 # User profile & billing
│   └── page.tsx                  # Marketing landing page
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn base components
│   ├── CreateCourseForm.tsx       # Multi-step form with AI generation overlay
│   ├── ConfirmChapters.tsx        # Sequential chapter generation orchestrator
│   ├── ChapterCard.tsx            # Real-time per-chapter status tracking
│   ├── CourseSideBar.tsx          # Sticky navigation sidebar
│   ├── MainVideoSummary.tsx       # YouTube embed + AI summary display
│   └── QuizCards.tsx              # Interactive concept-check quiz
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Singleton Prisma client
│   ├── gpt.ts                    # Strict-output LLM utility
│   ├── stripe.ts                 # Stripe client instantiation
│   ├── subscription.ts           # Subscription validation helper
│   └── youtube.ts                # YouTube search + transcript utilities
└── validators/
    └── course.ts                 # Zod validation schemas
```

---

## 🔌 API Design

### `POST /api/course/createUnits`
- Accepts a course `title` string
- Queries GPT-4o-mini to generate contextually relevant unit titles
- Validates structured JSON output using a `strict_output` schema enforcer

### `POST /api/course/createChapters`
- Accepts `title` and `units` array
- Uses GPT-4o-mini to generate chapter names and YouTube search queries for each unit
- Fetches a matching course cover image from Unsplash API
- Persists `Course`, `Unit`, and `Chapter` records in PostgreSQL via Prisma

### `POST /api/chapter/getInfo`
- Core AI generation pipeline executed **per chapter**, **sequentially** to respect rate limits
- **Step 1**: Searches YouTube Data API v3 for the best matching lecture video
- **Step 2**: Fetches the English-language transcript via YouTube Transcript API
- **Step 3**: Trims transcript to 350 words to stay within token limits
- **Step 4**: Submits transcript to GPT-4o-mini for 250-word structured summary
- **Step 5**: Generates 5 adaptive MCQs — transcript sent once, remaining 4 prompts query general topic knowledge (reduces token usage by ~80%)
- **Step 6**: Randomizes answer options and persists `Question` and updated `Chapter` records
- **Graceful Degradation**: If no video or transcript is found, stores fallback summaries and returns `success: true` — never blocks the generation pipeline

### `GET /api/stripe`
- Checks user's active `UserSubscription` record
- Routes to Stripe Checkout (new subscribers) or Customer Portal (existing subscribers)

### `POST /api/webhook`
- Verifies Stripe webhook signature using `STRIPE_WEBHOOK_SECRET`
- Handles `checkout.session.completed` → Creates `UserSubscription` record
- Handles `invoice.payment_succeeded` → Updates subscription renewal date

---

## 🗃️ Database Schema

```prisma
model User {
  id       String  @id @default(cuid())
  credits  Int     @default(10)         // Free tier credit balance
  accounts Account[]
  sessions Session[]
}

model Course {
  id    String @id @default(cuid())
  name  String
  image String
  units Unit[]
}

model Unit {
  id       String    @id @default(cuid())
  name     String
  chapters Chapter[]
  course   Course    @relation(...)
}

model Chapter {
  id                 String     @id @default(cuid())
  name               String
  youtubeSearchQuery String     // Query used to search YouTube
  videoId            String?    // Embedded YouTube video ID
  summary            String?    // AI-generated transcript summary
  questions          Question[]
}

model Question {
  id      String @id @default(cuid())
  question String
  answer   String
  options  String  // JSON stringified array of 4 shuffled choices
}

model UserSubscription {
  userId                 String    @unique
  stripeCustomerId       String    @unique
  stripeSubscriptionId   String?   @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?
}
```

---

## 🔑 Environment Variables

```env
# PostgreSQL (Supabase — use port 6543 for transaction pooler)
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# GitHub Models (for GPT-4o-mini access)
GITHUB_TOKEN="github_pat_..."

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Unsplash API
UNSPLASH_API_KEY="..."
UNSPLASH_SECRET_KEY="..."

# YouTube Data API v3
YOUTUBE_API_KEY="..."
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (Supabase recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/minerva.git
cd minerva

# Install dependencies
pnpm install

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Stripe Webhooks Locally (Test Mode)

```bash
# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3000/api/webhook
# Copy the displayed whsec_... and set it as STRIPE_WEBHOOK_SECRET in .env
```

---

## ☁️ Deployment (Vercel)

1. Import repository to [Vercel](https://vercel.com/)
2. Set all environment variables in Project Settings
3. Override the Build Command to:
   ```bash
   npx prisma generate && next build
   ```
4. After deployment, register your production webhook URL in the Stripe Dashboard:
   ```
   https://your-domain.vercel.app/api/webhook
   ```
5. Add the new `whsec_...` signing secret to Vercel environment variables and redeploy

---

## 🛡️ Notable Engineering Decisions

- **Sequential API calls** over concurrent requests in `ConfirmChapters.tsx` using `for-of` with `await` to prevent GitHub Models API `429 RateLimitReached` errors.
- **Token optimization** in question generation: transcript payload sent once in a 5-element prompt array instead of repeated 5× (`~80% token reduction`).
- **Graceful degradation** for missing transcripts/videos: pipeline always returns `success: true`, stores fallback summaries, and never crashes the generation flow.
- **Singleton Prisma client** pattern in `lib/db.ts` using a global reference to prevent connection pool exhaustion in Next.js hot-reload environments.
- **Protected routes** using server-side `getAuthSession()` checks with `redirect()` to prevent unauthenticated access — middleware-less auth pattern for compatibility with Prisma Adapter.

---

## 📄 License

MIT License — feel free to fork and build on this project.
