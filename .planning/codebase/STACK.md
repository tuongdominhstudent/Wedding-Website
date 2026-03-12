# Technology Stack

## Overview
- Monorepo-style split between a Vite/React client in `client/` and an Express API server in `server/`; the top-level README documents this structure and local run model. References: `README.md`, `client/package.json`, `server/package.json`.
- Both client and server use modern ES modules (`"type": "module"`), so imports/exports are native ESM on both sides. References: `client/package.json:5`, `server/package.json:5`.

## Languages And Runtime
- Primary language is JavaScript. Frontend source is `.jsx` and `.js` under `client/src/`; backend source is `.js` under `server/src/`. References: `client/src/main.jsx`, `client/src/App.jsx`, `server/src/app.js`, `server/src/server.js`.
- Frontend runtime is the browser, bootstrapped through React 18 root rendering. Reference: `client/src/main.jsx:1-12`.
- Backend runtime is Node.js, with Express listening from `src/server.js`. Reference: `server/src/server.js:1-6`.

## Frontend Stack
- Build tool and dev server are Vite plus `@vitejs/plugin-react`, with explicit dev/preview ports and host binding. References: `client/package.json:6-23`, `client/vite.config.js`.
- UI framework is React 18 with `react-dom` for root mounting. References: `client/package.json:17-18`, `client/src/main.jsx:1-12`.
- Styling uses plain CSS, global stylesheets, and CSS Modules rather than a utility framework. References: `client/src/styles/global.css`, `client/src/styles/reset.css`, `client/src/styles/tokens.css`, `client/src/layouts/StoryLayout.module.css`, `client/src/app/AppShell.module.css`.
- State management uses Zustand for app bootstrap state and section progress state. References: `client/package.json:19`, `client/src/stores/useAppStore.js:1-31`, `client/src/stores/useSectionStore.js:1-15`.
- Motion/scroll stack is GSAP plus `ScrollTrigger` and Lenis. GSAP is initialized centrally, and Lenis is created during app bootstrap. References: `client/package.json:15-16`, `client/src/motion/gsap/gsapConfig.js:1-25`, `client/src/motion/scroll/createLenis.js:1-13`, `client/src/hooks/useAppBootstrap.js:50-71`.
- 3D rendering uses React Three Fiber with Drei and postprocessing support declared in dependencies; canvas setup is centralized in `CanvasStage`. References: `client/package.json:12-14`, `client/src/three/CanvasStage.jsx:1-30`, `client/src/sections/distance/LongDistanceGlobeScene.jsx:1-4`.

## Frontend Architecture And Notable Libraries
- App bootstrap is provider-driven: `AppProviders` runs `useAppBootstrap`, which initializes reduced-motion handling, GSAP, Lenis, and the asset registry/loader before marking the app ready. References: `client/src/app/providers/AppProviders.jsx:1-7`, `client/src/hooks/useAppBootstrap.js:28-123`.
- Asset preloading is custom, using `AssetRegistry` plus `AssetLoader` abstractions rather than a third-party data loader. References: `client/src/services/assets/assetRegistry.js:1-29`, `client/src/services/assets/assetLoader.js:1-33`.
- 3D scene content uses `three` primitives indirectly via Fiber/Drei and manually fetches GLB assets for texture extraction in the long-distance section. Reference: `client/src/sections/distance/LongDistanceGlobeScene.jsx:54-139`.
- API access is intentionally thin: a shared `httpClient` wraps browser `fetch`, and `wishesApi` builds URLs from env config. References: `client/src/services/api/httpClient.js:1-26`, `client/src/services/api/wishesApi.js:1-28`, `client/src/config/env.js:1-6`.

## Backend Stack
- HTTP server framework is Express 4. References: `server/package.json:12-19`, `server/src/app.js:1-33`.
- Security and HTTP middleware include `helmet`, `cors`, and built-in JSON parsing with a 32kb body limit. Reference: `server/src/app.js:19-21`.
- Environment loading uses `dotenv`, with normalization for `PORT` and defaults for origin and database path. References: `server/package.json:15`, `server/src/config/env.js:1-18`.
- Persistence uses `better-sqlite3` against a local SQLite file, with schema bootstrapped on startup. References: `server/package.json:13`, `server/src/db/index.js:1-28`, `server/src/db/schema.js:1-8`.
- Validation uses Zod at the controller boundary. References: `server/package.json:19`, `server/src/validation/wishSchemas.js:1-12`, `server/src/controllers/wishController.js:4-32`.
- Identifier generation for persisted wishes uses Nano ID. References: `server/package.json:18`, `server/src/services/wishService.js:1-44`.

## Backend Architecture
- Server composition is layered as routes -> controllers -> services -> database. References: `server/src/routes/wishRoutes.js`, `server/src/controllers/wishController.js`, `server/src/services/wishService.js`, `server/src/db/index.js`.
- API versioning is centralized through `API_PREFIX = '/api/v1'`. Reference: `server/src/config/constants.js:1-3`.
- Error handling is standardized for validation errors, malformed JSON, unknown routes, and generic 500s. References: `server/src/middleware/errorHandler.js:1-31`, `server/src/middleware/notFound.js:1-8`.

## Build, Run, And Operational Notes
- Client scripts cover `dev`, `build`, and `preview`; there is no frontend test or lint script yet. Reference: `client/package.json:6-23`.
- Server scripts cover `dev` via Nodemon, `start`, and `db:init`; there is no server test script yet. Reference: `server/package.json:7-22`.
- The database initializes automatically at process start because `server/src/server.js` imports `./db/index.js` before listening. Reference: `server/src/server.js:1-6`.
- The stack is currently self-hosted and local-first: browser app + Node API + SQLite file, with no cloud SDKs, ORMs, queues, or external SaaS dependencies present in the codebase.
