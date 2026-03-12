# Architecture

## System shape

This repository is split into two deployable applications:

- `client/`: a Vite-built React single-page application that renders a cinematic wedding story with layered DOM, animation, and WebGL scenes.
- `server/`: an Express API backed by SQLite for guest wishes and health checks.

At the repo root, [`README.md`](/Users/minhtuong03/Documents/Code/Wedding%20card/README.md) describes the intended scaffold-first direction: shared infrastructure first, then incremental section delivery.

## Runtime topology

### Frontend runtime

- Browser entry point: [`client/src/main.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/main.jsx)
- App handoff: [`client/src/App.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/App.jsx)
- Shell composition: [`client/src/app/AppShell.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx)
- Global bootstrap side effects: [`client/src/app/providers/AppProviders.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/providers/AppProviders.jsx), [`client/src/hooks/useAppBootstrap.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js)

The client is a single-route SPA with no router. `AppShell` renders the layout immediately, but gates the story experience through global boot state:

- `idle` -> initial render
- `preloading` -> asset/motion bootstrap in progress
- `ready` -> story sections and scrolling fully enabled
- `error` -> bootstrap failure state stored, but not yet surfaced in a dedicated UI

`AppProviders` is intentionally thin. It does not provide React context; instead it triggers the bootstrap hook, which initializes browser-wide animation infrastructure and hydrates Zustand stores.

### Backend runtime

- Process entry point: [`server/src/server.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/server.js)
- Express composition root: [`server/src/app.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js)
- DB startup side effect: [`server/src/db/index.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/index.js)

Importing `server/src/server.js` eagerly imports `./db/index.js`, so database directory creation, SQLite connection, PRAGMA setup, and schema application happen at process startup before the server begins listening.

## Layers

### Client layers

1. Entry/bootstrap layer
   - [`client/src/main.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/main.jsx)
   - [`client/src/app/providers/AppProviders.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/providers/AppProviders.jsx)
   - [`client/src/hooks/useAppBootstrap.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js)
   - Responsibility: initialize GSAP, Lenis, asset preloading, reduced-motion detection, and boot state.

2. App shell and layout layer
   - [`client/src/app/AppShell.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx)
   - [`client/src/layouts/StoryLayout.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/layouts/StoryLayout.jsx)
   - Responsibility: mount the persistent canvas layer, DOM story layer, and loading overlay.

3. Section composition layer
   - [`client/src/sections/StoryRoot.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx)
   - [`client/src/sections/intro/IntroSection.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.jsx)
   - [`client/src/sections/firsts/FirstsJourneySection.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/firsts/FirstsJourneySection.jsx)
   - [`client/src/sections/distance/LongDistanceJourneySection.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance/LongDistanceJourneySection.jsx)
   - Responsibility: implement story-specific UI, animation timelines, and localized content/state.

4. Shared motion/rendering infrastructure
   - [`client/src/motion/gsap/gsapConfig.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/gsap/gsapConfig.js)
   - [`client/src/motion/scroll/createLenis.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/scroll/createLenis.js)
   - [`client/src/three/CanvasStage.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/CanvasStage.jsx)
   - [`client/src/three/scene/BaseScene.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/scene/BaseScene.jsx)
   - Responsibility: GSAP defaults, ScrollTrigger registration, smooth scrolling, shared 3D camera/light baseline.

5. Application services/state
   - [`client/src/stores/useAppStore.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js)
   - [`client/src/stores/useSectionStore.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useSectionStore.js)
   - [`client/src/services/assets/assetRegistry.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/assets/assetRegistry.js)
   - [`client/src/services/assets/assetLoader.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/assets/assetLoader.js)
   - [`client/src/services/api/httpClient.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/httpClient.js)
   - [`client/src/services/api/wishesApi.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js)
   - Responsibility: shared state, asset loading, and HTTP integration.

### Server layers

1. Startup/config
   - [`server/src/server.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/server.js)
   - [`server/src/config/env.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/config/env.js)
   - [`server/src/config/constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/config/constants.js)

2. HTTP composition
   - [`server/src/app.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js)
   - [`server/src/routes/healthRoutes.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/healthRoutes.js)
   - [`server/src/routes/wishRoutes.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/wishRoutes.js)

3. Request handling and validation
   - [`server/src/controllers/wishController.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js)
   - [`server/src/validation/wishSchemas.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js)

4. Persistence/service layer
   - [`server/src/services/wishService.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js)
   - [`server/src/db/index.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/index.js)
   - [`server/src/db/schema.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/schema.js)

5. Terminal middleware
   - [`server/src/middleware/notFound.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/notFound.js)
   - [`server/src/middleware/errorHandler.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js)

## Data flow

### Client boot flow

1. [`client/src/main.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/main.jsx) mounts `AppProviders` and `App`.
2. [`client/src/app/providers/AppProviders.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/providers/AppProviders.jsx) invokes `useAppBootstrap()`.
3. [`client/src/hooks/useAppBootstrap.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js):
   - reads `prefers-reduced-motion`
   - registers GSAP plugins/defaults
   - creates and temporarily stops Lenis
   - forces scroll position to top
   - builds an `AssetRegistry`
   - registers section-owned assets from intro, firsts, and distance modules
   - loads assets sequentially through `AssetLoader`
   - updates `bootProgress` in [`client/src/stores/useAppStore.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js)
4. [`client/src/app/AppShell.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx) reads the store and:
   - keeps [`client/src/components/loading/LoadingScreen.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components/loading/LoadingScreen.jsx) visible during `idle` and `preloading`
   - passes `isBootReady` down to the story tree once ready

This is the only application-wide initialization pipeline. All later interactions are section-local.

### Story rendering flow

1. [`client/src/layouts/StoryLayout.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/layouts/StoryLayout.jsx) renders:
   - a persistent background WebGL layer via `CanvasStage`
   - a foreground DOM layer via `main#story-layout`
2. [`client/src/three/CanvasStage.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/CanvasStage.jsx) mounts a global React Three Fiber canvas with stable camera settings and a placeholder `future-scene-root`.
3. [`client/src/sections/StoryRoot.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx) serializes story progression:
   - `IntroSection` mounts first
   - `FirstsJourneySection` and `LongDistanceJourneySection` mount only after the intro sequence completes

The client architecture currently uses explicit component ordering rather than a dynamic section registry. [`client/src/config/sectionRegistry.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/sectionRegistry.js) exists as an unfinished abstraction for future extensibility but is not wired into the render path.

### Section interaction model

- `IntroSection` takes control of the whole viewport, pauses scrolling, plays a video-first reveal, then enables scrolling and signals completion upward.
- `FirstsJourneySection` is a pinned GSAP/ScrollTrigger section that scrubs SVG path progression and local UI state based on scroll progress.
- `LongDistanceJourneySection` is a pinned DOM + nested R3F hybrid section. Scroll progress drives:
  - text reveal state in the DOM
  - the R3F globe scene via a `progress` prop
  - a DOM overlay clipped around the projected Moscow position reported by the scene

The dominant pattern is "scroll position -> GSAP timeline or local React state -> visual update". Global stores are used only for app-wide infrastructure, not per-section storytelling state.

### Backend request flow

For `GET /api/v1/wishes` and `POST /api/v1/wishes`:

1. Express app mounts [`server/src/routes/wishRoutes.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/wishRoutes.js) under `API_PREFIX` from [`server/src/config/constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/config/constants.js).
2. Route handlers delegate to [`server/src/controllers/wishController.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js).
3. Controller parses request data with Zod schemas from [`server/src/validation/wishSchemas.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js).
4. Controller calls [`server/src/services/wishService.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js).
5. Service executes prepared SQLite statements through `better-sqlite3` from [`server/src/db/index.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/index.js).
6. Success responses are shaped in the controller. Validation failures and JSON parse failures are normalized by [`server/src/middleware/errorHandler.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js). Unknown routes fall through to [`server/src/middleware/notFound.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/notFound.js).

The server is synchronous by design because `better-sqlite3` is synchronous. There is no service abstraction for external integrations yet.

## State management

### Global client state

State is managed with small, focused Zustand stores:

- [`client/src/stores/useAppStore.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js)
  - boot lifecycle
  - preload progress
  - reduced-motion flag
  - Lenis instance
  - asset registry/loader handles
  - boot error text
- [`client/src/stores/useSectionStore.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useSectionStore.js)
  - active section id
  - per-section progress map

Only `useAppStore` is actively used in the current implementation. `useSectionStore` appears to be a future coordination hook for cross-section progress, but current sections keep their progress in local React state and refs.

### Local state

The section components favor local state plus mutable refs for animation performance:

- `IntroSection`: local phase flags, completion state, UI visibility flags, GSAP timeline ref, media refs.
- `FirstsJourneySection`: local active story id, measured milestone positions, many DOM/SVG refs, GSAP-managed progress object.
- `LongDistanceJourneySection`: local scroll progress and visibility flags, plus refs for projected 3D-to-DOM coordinate bridging.

This keeps high-frequency animation updates close to the section that owns them and avoids global re-renders.

## Rendering and runtime model

### Client rendering model

- Build tool: Vite in [`client/vite.config.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/vite.config.js)
- UI runtime: React 18 in strict mode
- Styling: CSS Modules per component/section plus shared global CSS in [`client/src/styles/global.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/global.css)
- Animation: GSAP + ScrollTrigger initialized once in [`client/src/motion/gsap/gsapConfig.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/gsap/gsapConfig.js)
- Scroll engine: Lenis created in [`client/src/motion/scroll/createLenis.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/scroll/createLenis.js)
- 3D runtime: React Three Fiber with Drei helpers in [`client/src/three/CanvasStage.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/CanvasStage.jsx) and [`client/src/sections/distance/LongDistanceGlobeScene.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance/LongDistanceGlobeScene.jsx)

The app uses a hybrid rendering model:

- global R3F canvas for persistent scene infrastructure
- section-specific R3F canvas embedded inside the long-distance section
- DOM sections for text, images, and SVG choreography
- GSAP/ScrollTrigger for timeline control across both DOM and stateful render layers

There is no SSR, no router, and no code splitting visible in the current app entry path.

### Backend runtime model

- Module format: ESM on Node.js
- API style: JSON-only Express service
- Persistence: local SQLite file, auto-created from `DB_PATH`
- Security middleware: `helmet`, `cors`, JSON body size cap

The backend is a simple process-local monolith. Routes, validation, business logic, and persistence are separated into folders, but all execution remains in a single Node process with direct database access.

## Key abstractions

### Asset preloading boundary

- [`client/src/services/assets/assetRegistry.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/assets/assetRegistry.js)
- [`client/src/services/assets/assetLoader.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/assets/assetLoader.js)
- section asset registration modules such as [`client/src/sections/intro/introAssets.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/introAssets.js)

The abstraction is intentionally simple:

- section modules register assets into a registry
- registry stores loader descriptors keyed by id
- loader executes `asset.load()` sequentially and reports normalized progress

This centralizes preload progress while keeping actual asset ownership near each section.

### Section-as-island pattern

Each major story segment lives in its own folder with:

- component
- CSS module
- constants
- asset registration module

This pattern is visible in:

- [`client/src/sections/intro`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro)
- [`client/src/sections/firsts`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/firsts)
- [`client/src/sections/distance`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance)

It is the most important frontend organization rule in the current codebase.

### API client boundary

- [`client/src/services/api/httpClient.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/httpClient.js)
- [`client/src/services/api/wishesApi.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js)

`httpClient` normalizes JSON handling and error shaping. Feature-specific API modules build URLs and payloads on top of it. The wishes API is implemented even though no visible client UI currently consumes it.

### Request validation boundary

- [`server/src/validation/wishSchemas.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js)
- [`server/src/controllers/wishController.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js)

Controllers are thin and depend on schema parsing to reject invalid requests early. Validation errors are translated into a uniform JSON error envelope by middleware.

### Persistence boundary

- [`server/src/services/wishService.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js)
- [`server/src/db/schema.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/schema.js)

Prepared SQL statements are created at module load and reused across requests. This keeps controllers free of SQL and makes the service layer the persistence boundary, even though the logic is still minimal.

## Architectural constraints and planning implications

- The frontend depends heavily on browser-only APIs (`window`, `document`, `matchMedia`, `IntersectionObserver`, video playback), so SSR would require major refactoring.
- Story sequencing is currently hardcoded in [`client/src/sections/StoryRoot.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx), which is simple now but will become a scaling pressure point as more sections are added.
- The global section registry and section store are only partially adopted, indicating an intended future architecture that has not yet replaced explicit composition.
- The backend already has a clear controller/service/validation split, so extending the wishes domain or adding RSVP-style endpoints should fit the existing flow without structural change.
- The repository is still infrastructure-heavy relative to features: many abstractions are future-facing, but only a subset are wired into the current runtime.
