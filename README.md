# Artéum — The Emotional Canvas

An immersive Vite + React + TypeScript experience for browsing, uploading, and exploring emotion-driven digital art. The app ships with mobile-first layouts, shadcn-ui components, framer-motion interactions, and sample gallery data so you can preview the experience without wiring up backends.

## Quick Start

- Prerequisites: Node 18+ and npm.
- Install dependencies: `npm install`
- Run the dev server: `npm run dev` (Vite opens on http://localhost:8080/ by default)
- Lint the code: `npm run lint`
- Production build: `npm run build` and preview with `npm run preview`

## Core Features

- Emotion-driven gallery with masonry grid and animated splash entry on the home feed [src/pages/Index.tsx](src/pages/Index.tsx).
- Search with trending and recent suggestions, inline filtering, and artwork detail modal [src/pages/Search.tsx](src/pages/Search.tsx).
- Trending leaderboard with impact scores and animated hero card [src/pages/Trending.tsx](src/pages/Trending.tsx).
- Supabase-authenticated profile with gallery tabs and sign-out flow [src/pages/Profile.tsx](src/pages/Profile.tsx).
- Upload workflow with image preview, emotion tagging, premium toggle, and Supabase storage insert [src/pages/Upload.tsx](src/pages/Upload.tsx).
- Force-directed “Invisible Network” visualization linking artworks, artists, and emotions [src/pages/Network.tsx](src/pages/Network.tsx).
- Notification feed with typed variants and “mark all read” control [src/pages/Notifications.tsx](src/pages/Notifications.tsx).
- Bottom navigation, header, and shared UI primitives from shadcn-ui under [src/components](src/components) and [src/components/ui](src/components/ui).

## Environment Variables

Supabase is initialized in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts) and expects:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Create a `.env.local` (or `.env`) at the project root and restart the dev server after changes.

## Project Structure

- App shell and routing: [src/App.tsx](src/App.tsx), [src/main.tsx](src/main.tsx)
- Pages: home, search, trending, notifications, profile, upload, network, auth, 404 under [src/pages](src/pages)
- UI and layout: header, bottom nav, cards, masonry grid, dialogs under [src/components](src/components)
- Hooks: shared toast and mobile detection under [src/hooks](src/hooks)
- Styling: Tailwind configuration and global styles in [tailwind.config.ts](tailwind.config.ts) and [src/index.css](src/index.css)
- Supabase types and client: [src/integrations/supabase](src/integrations/supabase)

## Supabase Notes

- Auth flows use `supabase.auth` (email/password). Profile fetching in the profile page reads from a `profiles` table; ensure your schema matches or adjust the queries.
- Upload uses the `artworks` storage bucket and inserts into an `artworks` table. Update the bucket/table names if your Supabase setup differs.
- Local development requires the publishable key only; secure operations should happen via RLS/server-side rules in production.

## Design System

- Tailwind CSS with custom theme tokens (champagne, sapphire, cranberry) and glassmorphism accents.
- shadcn-ui primitives (buttons, inputs, dialogs, tooltips, toasts) extended in [src/components/ui](src/components/ui).
- Motion via framer-motion for page and component transitions.
- Visual direction aligns with our selected 5/6/10 theme palette from design exploration.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run build:dev` — development-mode build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Troubleshooting

- If `vite` is not found, ensure dependencies are installed (`npm install`).
- Supabase errors during auth or upload usually indicate missing env vars or schema differences; verify your `.env` and database tables/buckets.

## Roadmap Ideas

- Replace sample artwork arrays with live Supabase data.
- Add pagination/filters for large galleries.
- Wire notifications to Supabase realtime.
- Introduce tests (React Testing Library, Vitest) and CI lint/build checks.
