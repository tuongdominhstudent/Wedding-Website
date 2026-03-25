# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A premium, cinematic single-page wedding invitation website for Minh Tường & Thảo Nguyên. Built as a storytelling experience with GSAP animations, React Three Fiber 3D scenes, and a Node.js/SQLite backend for guest wishes.

## Commands

### Client (Vite + React)
```bash
cd client
npm run dev        # Dev server on :5173
npm run build      # Production build
npm run test       # Run all tests (Vitest)
```

### Server (Express + SQLite)
```bash
cd server
npm run dev        # Dev server on :4000 (nodemon)
npm run db:init    # Initialize SQLite schema
```

### Run a single test file
```bash
cd client
npx vitest run src/test/LogisticsSection.test.jsx
```

### First-time setup
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
cd server && npm run db:init
```

## Architecture

### Section-Based Frontend

Sections are self-contained storytelling units. The rendering pipeline is:

1. **`sectionRegistry.js`** — Registers sections with `{ id, order, preloadStrategy }`. Strategies: `BLOCKING` (must load before interaction) or `DEFERRED` (lazy-loaded).
2. **`StoryRoot.jsx`** — Maps registered sections to component implementations via `SECTION_COMPONENTS`. The intro section unlocks the rest of the story on completion.
3. **`StoryLayout.jsx`** — Two-layer structure: canvas layer (z-index 10) for R3F + story layer (z-index 20) for HTML content.
4. **`AppShell.jsx`** — Controls boot phases (`IDLE → PRELOADING → READY`) and shows loading screen until ready.

To add a new section: register it in `sectionRegistry.js`, implement the component, add it to `SECTION_COMPONENTS` in `StoryRoot.jsx`.

### State Management (Zustand)

- **`useAppStore`** — Boot phase, preload progress, Lenis instance, asset registry/loader, reduced motion preference.
- **`useSectionStore`** — Active section ID, per-section progress.

### Motion Infrastructure

All animation values come from `motion/constants.js` — never hardcode durations, easings, or scroll values:
```js
MOTION.durations.cinematic   // 1.4s
MOTION.easings.dramaticOut   // 'power4.out'
MOTION.scroll.scrub          // 1
```

Use section-local GSAP timelines (created and killed within the section's lifecycle). ScrollTrigger pins/scrubs are scoped to the section element.

### 3D Scenes (React Three Fiber)

- Shared canvas via `CanvasStage` — rendered once at app level in the canvas layer.
- Section-specific 3D objects live inside their section directory (e.g., `distance/LongDistanceGlobeScene.jsx`).

### Styling

- **CSS Modules** for all components (`Component.module.css`)
- **No Tailwind** — use CSS variables from `styles/tokens.css`
- Brand palette: `--color-brand-mist` (cream) → `--color-brand-burgundy` (darkest)
- Typography: serif display + sans-serif body

### Backend

Request flow: `Route → Controller → Service → DB`

- Zod validation in `validation/wishSchemas.js` runs before service calls.
- All IDs generated with `nanoid`.
- API prefix: `/api/v1`. Key endpoints: `GET /wishes`, `POST /wishes`.

## Key Conventions

- Keep sections self-contained — no cross-section imports.
- All CSS values (colors, spacing, z-index, durations) must reference tokens from `tokens.css`.
- JS/JSX only — no TypeScript.
- Tests live in `client/src/test/` and use Vitest + React Testing Library.
- Planning docs are in `.planning/`; `INIT.md` contains full project rules and design conventions.
