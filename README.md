# Nore Sensei — AI Singing Teacher

Nore Sensei uses your browser's camera and microphone to teach vocal technique — not just pitch. It detects posture, breathing patterns, jaw opening, and tension (video) alongside vocal quality analysis (audio), then combines both signals into real-time coaching feedback.

**Nore** = song (Korean) | **Sensei** = teacher (Japanese)

## Why

Current singing apps only measure pitch accuracy. But the real skill of singing — breath support, projection, resonance, singing with power and ease — is about physical technique. Nore Sensei is the first tool that watches your body *and* listens to your voice to teach you how to sing properly.

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS 4 + Radix UI |
| Backend + DB | Convex |
| Auth | Better Auth + @convex-dev/better-auth |
| Video ML | MediaPipe (PoseLandmarker + FaceLandmarker) |
| Audio | Web Audio API, pitchy (pitch detection), Meyda (spectral features) |
| AI Feedback | LLM API via Convex actions |

## Getting Started

### Prerequisites

- Node.js 22.14+ (see `.nvmrc`)
- pnpm
- A [Convex](https://convex.dev) account

### Setup

```bash
# Install dependencies
pnpm install

# Start Convex dev server (will prompt for login on first run)
npx convex dev

# In another terminal, start the Vite dev server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
VITE_CONVEX_URL=           # Your Convex deployment URL (*.convex.cloud)
VITE_CONVEX_SITE_URL=      # Your Convex site URL (*.convex.site)
CONVEX_DEPLOYMENT=         # Your Convex deployment name
LLM_API_KEY=               # Anthropic API key for AI coaching (optional)
```

### Seed Lessons

After Convex is running:

```bash
npx convex run lessons:seed
```

## Architecture

```
Browser (React SPA)
├── Camera → MediaPipe → pose/face metrics ─┐
│                                           ├→ Feature Aggregator
├── Mic → Web Audio → pitchy/Meyda ────────┘         │
│                                                     │
├── Instant client-side feedback (<100ms)    FeatureSnapshot
│   (threshold-based, 1 correction at a time)         │
│                                                     ▼
└─────────────────────────────────────── Convex action (server)
                                                      │
                                                 LLM API
                                                      │
                                         Coaching text + persist
```

Two parallel feedback loops:
1. **Instant (client, <100ms):** Threshold checks — "Shoulders rising." "Jaw too closed." "Pitch drifting sharp."
2. **AI coaching (Convex action, 1-3s):** After each exercise rep. LLM synthesizes all signals into 2-3 sentences of pedagogical feedback.

## MVP Lessons

1. **Breathing & Posture** — No singing, just breathe correctly with proper alignment
2. **Sustained Single Note** — Hold a note with steady airflow, open jaw, relaxed posture
3. **Simple Intervals** — Pitch accuracy while maintaining technique

## Project Structure

```
src/
├── routes/              # TanStack Router file-based routes
├── features/
│   ├── audio/           # Microphone, pitch detection, spectral features
│   ├── video/           # Camera, pose detection, face mesh
│   ├── feedback/        # Instant cues, feature aggregation, AI coaching
│   ├── practice/        # Practice view, overlays, exercise controls
│   └── progress/        # Dashboard, charts
├── components/          # Shared UI (Button, Card, Meter, Layout)
└── lib/                 # Auth client, lesson types, AI prompts

convex/
├── schema.ts            # DB schema
├── auth.ts              # Better Auth configuration
├── auth.config.ts       # Convex JWT validation config
├── http.ts              # HTTP routes for auth
├── lessons.ts           # Lesson queries + seed data
├── sessions.ts          # Practice session mutations
├── progress.ts          # Progress queries
└── feedback.ts          # AI coaching action (LLM API)
```

## License

MIT
