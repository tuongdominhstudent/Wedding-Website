# Stack Research

**Domain:** Brownfield cinematic wedding invitation website with mobile-first storytelling, prewedding video, venue/map info, QR gift section, and camera-based photobooth wishes
**Researched:** 2026-03-13
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 22 LTS | Runtime for client tooling and Express server | Keep the project on a current LTS runtime with strong ESM support and no architecture change. |
| React | 18.3.1 | SPA UI runtime for story sections | Already installed and matched to the current section-island architecture; sufficient for v1 without a rewrite. |
| Vite | 6.2.x | Frontend dev server and production build | Already in use, fast for media-heavy iteration, and appropriate for a single-route mobile-first experience. |
| Express | 4.21.x | JSON API for wishes and photobooth submission | Existing server already fits the v1 needs; no reason to introduce a heavier backend framework. |
| SQLite via better-sqlite3 | 11.10.x | Local persistence for wishes and photo metadata | Existing synchronous SQLite stack is simple, reliable, and enough for low-volume wedding traffic in v1. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| GSAP | 3.13.x | Cinematic motion and scroll-linked section choreography | Keep for hero transitions, pinned sections, and timeline control. |
| Lenis | 1.3.x | Smooth scroll foundation | Keep for premium scroll feel, but disable or soften behavior on weaker mobile devices if performance drops. |
| Zustand | 5.0.x | Small global state | Keep for app boot, preload, and cross-section UI state; do not expand it into a large app store. |
| @react-three/fiber + drei + postprocessing | 8.18.x / 9.122.x / 2.19.x | Selective 3D scenes | Keep only where 3D clearly adds value, such as the existing long-distance sequence. Avoid spreading 3D across every new section. |
| Zod | 3.24.x | Request validation | Keep for API boundaries, especially when extending wishes to include photo metadata. |
| nanoid | 5.1.x | Stable identifiers | Keep for wish and media record IDs. |
| Browser MediaDevices API | Browser-native | Camera capture for photobooth | Use `getUserMedia` for live camera capture; plan for permission denial, timeout, or no-response states. |
| Canvas API | Browser-native | Still image export from captured frame | Use `HTMLCanvasElement.toBlob()` to produce PNG by default, with JPEG/WebP as optional optimizations when supported. |
| Google Maps Embed API | iframe embed | Venue map display | Prefer iframe embed for v1 because it is lower risk and avoids custom JS map complexity. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Nodemon | Server iteration | Already installed; sufficient for backend v1 development. |
| npm | Package and script runner | Stay with npm for consistency unless the whole repo intentionally standardizes elsewhere later. |
| HTTPS local dev setup | Camera testing | Photobooth work must be tested on `localhost` or HTTPS because camera access requires a secure context. |

## Prescriptive Guidance For This Repo

- Keep the current split: `client/` Vite React SPA and `server/` Express API with SQLite.
- Keep JavaScript for v1. Adding TypeScript now would increase migration surface across client, server, and build config without solving a current delivery blocker.
- Keep CSS Modules and shared global tokens. They already fit the section-by-section storytelling architecture.
- Keep the API thin. Extend the existing wishes domain to accept photo-related fields instead of introducing a second backend subsystem.
- Keep media storage simple for v1: store uploaded image files on disk under the server app and persist only metadata plus relative path in SQLite.
- Keep map integration simple: use Google Maps Embed in an iframe inside a section component, with a plain address fallback link.
- Keep photobooth capture browser-native: `getUserMedia` -> canvas snapshot -> `toBlob()` -> multipart upload.

## Reasonable Additions For V1

| Addition | Version | Purpose | Why It Is Reasonable |
|----------|---------|---------|----------------------|
| multer | 1.4.x-lts | Handle multipart image uploads in Express | Small, established addition for photo upload without changing the server model. |
| sharp | 0.33.x | Resize/compress uploaded photobooth images server-side | Useful if image payloads are too large for mobile upload or gallery rendering. Add only if needed after first working flow. |
| react-use or small local hooks | latest compatible | Device/media utility hooks | Optional only if repeated camera or viewport logic becomes noisy. Prefer local hooks first. |
| Vitest | 2.x | Fast unit tests for client utilities and server validation | Reasonable first test runner because it aligns with Vite and keeps setup small. |
| supertest | 7.x | API endpoint verification | Reasonable if wish/photo endpoints expand and need regression coverage. |

## Installation

```bash
# Keep existing core stack; no replacement installs recommended for v1

# Reasonable additions for photobooth uploads
cd server && npm install multer

# Optional after measuring payload size
cd server && npm install sharp

# Optional first-pass testing setup
cd client && npm install -D vitest
cd server && npm install -D vitest supertest
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| React SPA on Vite | Next.js | Use Next.js only if SEO, server rendering, or route-heavy content becomes important. That is not the current v1 need. |
| Express + SQLite | Supabase/Firebase | Use a hosted backend only if the project needs remote admin tooling, auth, or hands-off deployment workflows later. |
| Google Maps Embed iframe | Full Google Maps JavaScript SDK | Use custom JS maps only if the product needs markers, route logic, or custom map interactions beyond venue display. |
| Browser camera + canvas capture | Third-party camera SDK | Use an SDK only if browser-native capture proves unreliable for a required device matrix, which is unlikely for this v1 scope. |

## What NOT To Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Full frontend rewrite to Next.js, Nuxt, or Astro | The codebase already has working section infrastructure, animation setup, and app bootstrap. A rewrite would burn schedule without improving v1 delivery. | Keep React + Vite. |
| Full backend rewrite to NestJS, Prisma, or a hosted BaaS | Current API is small and already layered. Extra abstraction adds migration cost and deployment complexity. | Keep Express + better-sqlite3. |
| Base64 image blobs stored directly in SQLite rows | This inflates database size, slows payloads, and complicates rendering. | Store image files on disk and keep only metadata/path in SQLite. |
| Heavy client state frameworks such as Redux Toolkit | The app is section-driven and mostly local-state animation code. A larger global state model is unnecessary. | Keep Zustand small and local state dominant. |
| Custom interactive map implementation for v1 | It adds JS weight and implementation surface for little guest value. | Use Google Maps Embed iframe. |
| Mandatory 3D in every new section | WebGL cost on mobile will hurt battery, thermal behavior, and frame stability. | Use DOM, video, and GSAP first; reserve 3D for standout moments. |

## Stack Patterns By Variant

**If the photobooth only needs one still photo per guest:**
- Use `getUserMedia` with a front-camera preference when available.
- Export through canvas `toBlob()` and upload a compressed still image.
- Keep the server contract close to the existing wish creation flow.

**If photo upload reliability on mobile is poor:**
- Add a file-input fallback using `accept="image/*"` and `capture="user"`.
- Keep this fallback in the same section so guests can continue without live camera permissions.

**If the deployed site is not yet on HTTPS:**
- Do not ship the camera flow as primary UX.
- Launch with upload fallback first, because `getUserMedia` requires secure context except on localhost.

**If image moderation becomes necessary later:**
- Add an approval state to the SQLite schema and simple hidden/admin review tooling.
- Do not add that complexity to v1 unless there is a clear operational need.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `react@18.3.1` | `react-dom@18.3.1` | Keep these matched exactly. |
| `vite@6.2.x` | `@vitejs/plugin-react@4.3.x` | Current repo versions are aligned. |
| `@react-three/fiber@8.18.x` | `react@18.3.1` and `three` via transitive deps | Avoid upgrading Fiber in isolation during v1 delivery. |
| `express@4.21.x` | `multer@1.4.x-lts` | Safe incremental upload handling path for the existing server. |
| `better-sqlite3@11.10.x` | Node.js 22 LTS | Stay on an active Node LTS to reduce native module friction. |

## Recommended Milestone Stack

- Frontend: React 18.3.1, Vite 6.2.x, GSAP 3.13.x, Lenis 1.3.x, Zustand 5.0.x, CSS Modules, selective React Three Fiber use.
- Backend: Node.js 22 LTS, Express 4.21.x, better-sqlite3 11.10.x, Zod 3.24.x, nanoid 5.1.x.
- V1 additions: `multer` for multipart uploads, optional `sharp` only after measuring real payload problems.
- Delivery rule: favor browser-native APIs and repo-local patterns over new platforms or rewrites.

## Sources

- Local repo: `/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md` - milestone scope, product goals, and constraints.
- Local repo: `/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/STACK.md` - installed stack and runtime inventory.
- Local repo: `/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/ARCHITECTURE.md` - brownfield architecture and section/backend patterns.
- Local repo: `/Users/minhtuong03/Documents/Code/Wedding card/README.md` - repo structure, current stack, and local operations.
- Local repo: `/Users/minhtuong03/Documents/Code/Wedding card/client/package.json` - exact frontend package versions.
- Local repo: `/Users/minhtuong03/Documents/Code/Wedding card/server/package.json` - exact backend package versions.
- MDN Web Docs, `MediaDevices.getUserMedia()` - secure context, permission, and failure/stall behavior for browser camera access.
- MDN Web Docs, `HTMLCanvasElement.toBlob()` - supported canvas export flow and default PNG behavior.
- Google Maps Platform, Maps Embed API overview - iframe-based embed as the lowest-friction venue map integration.

---
*Stack research for: brownfield cinematic wedding invitation website*
*Researched: 2026-03-13*
