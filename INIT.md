# INIT - Project Rules

## 1) Project Overview

This repository is a long-term production codebase for:

**Minh Tường & Thảo Nguyên - Wedding**

Goal: build a premium, minimal, cinematic, Apple-like one-page wedding invitation experience with scroll storytelling, motion design, selective 3D, video/image-heavy sections, and smooth performance after preload.

Current phase is **scaffold-only**. Do not treat current UI as final design.

## 2) Brand Direction

- Tone: elegant, intimate, refined, emotional, modern-luxury
- Language: Vietnamese content only (when real content is added)
- Palette tokens (source of truth):
  - `#ffe6d1`
  - `#9d806e`
  - `#724032`
  - `#490018`
  - `#320010`

## 3) Visual Direction

- Minimal composition, high whitespace discipline
- Cinematic transitions over decorative noise
- Apple-like restraint: clean geometry, high polish, deliberate motion
- No section should feel generic template-like
- Visual complexity can increase only when grounded in story purpose

## 4) Technical Stack

Frontend:
- React + Vite + JavaScript (no TypeScript)
- CSS Modules + small global CSS foundation
- GSAP + ScrollTrigger
- Lenis for smooth scrolling
- Zustand for focused shared state
- React Three Fiber + Drei + Postprocessing

Backend:
- Node.js + Express
- better-sqlite3
- zod validation
- nanoid IDs
- dotenv, cors, helmet

## 5) Frontend Architecture Rules

- Keep route-less one-page architecture unless explicitly changed.
- Use `src/app` for app shell + boot orchestration only.
- Keep section code isolated in `src/sections/<SectionName>/...` when added later.
- Shared animation/motion infra stays in `src/motion`.
- Shared 3D infra stays in `src/three`.
- API clients live in `src/services/api`.
- Asset preload registration/loading stays under `src/services/assets`.
- Avoid cross-importing section internals between sections.
- Do not put section-specific timelines into global files.

## 6) Backend Architecture Rules

- Keep backend simple and modular.
- Route -> controller -> service -> db flow.
- Validation must happen before service calls.
- Return consistent JSON shape:
  - success: `{ data, meta? }`
  - failure: `{ error: { code, message, details? } }`
- Keep wishes/messages domain lightweight; do not add auth/admin unless requested.

## 7) Styling Conventions

- CSS Modules for local component/section styles.
- Global CSS only for reset/tokens/utilities/foundation.
- No Tailwind.
- No inline styles except unavoidable runtime values.
- Mobile-first media queries.
- No hard-coded magic spacing, durations, z-index values in components.
- Use CSS variables from `src/styles/tokens.css`.

## 8) Animation Conventions

- GSAP/ScrollTrigger setup belongs in shared motion infrastructure.
- Section timelines must be created and cleaned up with proper lifecycle.
- Keep animation constants centralized (`motion/constants.js`).
- Prefer composable timelines over large monolithic timeline files.
- Each section animation must degrade gracefully on lower-end mobile.
- Avoid animation logic in render paths.

## 9) 3D Conventions

- Keep reusable 3D foundations in `src/three`.
- Section-specific 3D objects/controllers should be isolated per section.
- Prepare for GLB loading via shared loader patterns.
- Maintain camera/light presets as centralized config.
- Build quality fallback strategy by device capability and viewport.
- Keep postprocessing optional and toggleable.

## 10) File and Folder Conventions

- Use clear domain-based paths (`services/wishes`, `sections/gallery`, etc).
- Keep files small and purpose-specific.
- Avoid dumping helpers into generic `utils` unless truly shared.
- Do not create placeholder files without immediate architectural value.

## 11) Naming Conventions

- React components: `PascalCase`
- Hooks: `useCamelCase`
- Stores: `use<Domain>Store`
- CSS Modules: `<Component>.module.css`
- Service functions: `verbNoun` (`getWishes`, `createWish`)
- Constants: `SCREAMING_SNAKE_CASE` for primitives, `camelCase` objects when exported as config bundles

## 12) State Management Conventions

- Zustand stores must remain focused by domain.
- No giant all-in-one global store.
- App boot/preload state in app store.
- Section progress/activation in section store.
- Persist state only when justified and explicitly requested.

## 13) Performance Expectations

- Target stable 60fps in normal scroll/animation states after preload.
- Heavy first-load is acceptable if preloader strategy is deliberate.
- Avoid unnecessary rerenders in animation-critical paths.
- Keep large media/3D assets externally managed and preload-aware.
- Use progressive quality fallbacks on lower-end devices.

## 14) Do / Don’t Rules

Do:
- Build section-by-section incrementally.
- Keep architecture modular and reusable.
- Centralize tokens and motion constants.
- Add tests/checks for backend behavior when logic grows.
- Preserve semantic HTML and accessibility basics.

Don’t:
- Don’t redesign global architecture per section request.
- Don’t add fake polished UI just for visual filler.
- Don’t hardcode scattered values for spacing/motion/z-index.
- Don’t mix section logic into global shell files.
- Don’t over-engineer CMS/auth/admin features unless requested.

## 15) Future Prompt Instructions

When requesting a new section/component, include this structure:

1. Purpose
- What this section must communicate emotionally/functionally.

2. Content
- Exact Vietnamese copy, data fields, and text hierarchy.

3. Assets
- Images/videos/GLB/audio file list, dimensions, formats.

4. Layout Intent
- Composition goals across mobile/tablet/desktop.

5. Animation Behavior
- Entry, scroll-linked, hover, exit, sequencing, intensity.

6. Mobile Behavior
- Fallbacks, reduced motion behavior, responsive priorities.

7. Acceptance Criteria
- Concrete conditions for completion and quality bar.

## 16) Delivery Discipline for Future Changes

- Any new section must plug into existing architecture with minimal global edits.
- Keep new files grouped under the section domain.
- Document any new shared token or infrastructure before usage.
- If a feature requires architectural change, explain reason and impact clearly before implementing.
