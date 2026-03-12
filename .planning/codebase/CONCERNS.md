# Codebase Concerns

## Scope

This document captures practical risks in the current repository with emphasis on bugs, technical debt, performance, security, and maintainability. File references use repository-relative paths with line numbers.

## Highest Priority Concerns

### 1. Intro flow can leave the experience hard-locked

- `client/src/sections/intro/IntroSection.jsx:30-46` disables page scrolling as soon as the app is boot-ready.
- The lock is only released by the reveal timeline completion path in `client/src/sections/intro/IntroSection.jsx:203-218` or by component unmount cleanup.
- If the intro video fails to autoplay, stalls, or never reaches `onEnded` (`client/src/sections/intro/IntroSection.jsx:390-398`), the user can get stuck with scrolling disabled and no obvious recovery path.
- This is a production UX failure mode, not just a polish issue, because downstream sections are gated by `StoryRoot` waiting for `onSequenceComplete` in `client/src/sections/StoryRoot.jsx:13-20`.

Planning direction:
- Add a timeout/fallback completion path.
- Add explicit skip/replay controls.
- Separate "intro modal lock" state from the only progression trigger being video completion.

### 2. Boot preloading is sequential and blocks first interaction

- `client/src/hooks/useAppBootstrap.js:81-86` waits for all preloads before marking the app ready.
- `client/src/services/assets/assetLoader.js:21-29` loads assets strictly one at a time with `await` inside a loop.
- This means one slow video or model blocks the entire shell, even when other assets are already available.
- The risk grows as more storytelling sections are added because startup cost is coupled to total asset count.

Planning direction:
- Load critical intro assets first and defer later sections.
- Parallelize non-dependent asset fetches with bounded concurrency.
- Treat late-section assets as section-local readiness instead of global boot readiness.

### 3. Long-distance 3D assets are fetched more than once

- `client/src/sections/distance/longDistanceJourneyAssets.js:9-16` preloads both GLB files via `fetch(...).blob()`.
- `client/src/sections/distance/LongDistanceGlobeScene.jsx:100-127` fetches the earth GLB again to extract the embedded texture.
- `client/src/sections/distance/LongDistanceGlobeScene.jsx:187` also loads the same models through `useGLTF`, and the file preloads them again at `client/src/sections/distance/LongDistanceGlobeScene.jsx:404-405`.
- This increases bandwidth, boot time, and memory pressure for the heaviest assets in the app.

Planning direction:
- Consolidate model loading behind one cache path.
- Avoid custom re-fetching when `useGLTF` or a shared loader can supply parsed assets and textures.

### 4. Wishes API has no abuse controls

- `server/src/routes/wishRoutes.js:6-7` exposes unauthenticated read/write endpoints.
- `server/src/app.js:19-21` enables basic middleware only; there is no rate limiting, bot protection, captcha, IP throttling, or content moderation layer.
- `server/src/services/wishService.js:34-43` writes directly to SQLite on every POST.
- For a public wedding page, spam and nuisance traffic are a realistic operational risk.

Planning direction:
- Add request throttling and simple anti-automation controls before public launch.
- Decide whether moderation, deletion, or approval workflow is required.

## Medium Priority Concerns

### 5. CORS falls back to permissive behavior when `CLIENT_ORIGIN` is unset

- `server/src/app.js:13-20` passes `undefined` to `cors()` when `CLIENT_ORIGIN` is empty.
- In practice this becomes an allow-all origin policy, which is broader than the README implies for a site that accepts guest-submitted content.

Planning direction:
- Fail closed in production when `CLIENT_ORIGIN` is missing.
- Make development and production defaults explicit.

### 6. Server lifecycle handling is minimal

- `server/src/server.js:5-7` starts listening with no startup error handling, shutdown hooks, or database close logic.
- `server/src/db/index.js:23-26` opens SQLite immediately at import time and never closes it.
- This is manageable for local development, but it raises restart and deployment fragility once the app is hosted behind a process manager or container runtime.

Planning direction:
- Add structured startup failure handling.
- Add SIGTERM/SIGINT shutdown flow and close the database cleanly.

### 7. No automated tests or quality gates are present

- `client/package.json:6-9` has only `dev`, `build`, and `preview`.
- `server/package.json:7-10` has only `dev`, `start`, and `db:init`.
- Repository search found no test files or test tooling under `client/` or `server/`.
- Animation-heavy flows, preload logic, and request validation currently depend on manual verification only.

Planning direction:
- Add at least smoke coverage for boot flow and API validation.
- Add one end-to-end happy path that catches scroll-lock and section progression regressions.

## Maintainability Hotspots

### 8. Intro and story progression are tightly coupled through implicit UI state

- `client/src/sections/StoryRoot.jsx:8-20` only mounts later sections after intro completion.
- `client/src/sections/intro/IntroSection.jsx` owns video playback, scroll locking, reveal choreography, and progression signaling in one component.
- This makes future changes risky because intro presentation logic and application navigation are not separated.

Planning direction:
- Move progression state into a clearer flow controller or store.
- Keep animation internals separate from section unlock rules.

### 9. 3D scene code mixes rendering, asset parsing, and camera choreography

- `client/src/sections/distance/LongDistanceGlobeScene.jsx:54-140` contains custom GLB parsing and texture extraction.
- `client/src/sections/distance/LongDistanceGlobeScene.jsx:180-241` handles model normalization and material mutation.
- `client/src/sections/distance/LongDistanceGlobeScene.jsx:274-329` contains per-frame camera logic.
- The scene works as a single large unit, but it will be difficult to debug or optimize incrementally.

Planning direction:
- Split asset processing, model presentation, and camera behavior into separate modules/hooks.
- Add explicit performance budgets for scene updates.

### 10. API client assumes JSON and lacks resilience features

- `client/src/services/api/httpClient.js:5-25` has no timeout, retry, cancellation, or offline handling.
- It also sets `Content-Type: application/json` for every request, including requests that do not send a body.
- This is not a launch blocker, but it becomes a repeated source of edge-case behavior as more endpoints are added.

Planning direction:
- Introduce abortable requests and consistent request helpers before the client API surface expands.

## Watchlist

- `client/src/app/AppShell.jsx:10` reads `bootProgress` but does not use it, which suggests unfinished loading-state wiring.
- `client/src/sections/distance/LongDistanceGlobeScene.jsx:308-327` still allocates new vectors inside `useFrame`, despite comments about avoiding frame-time GC.
- `server/src/services/wishService.js:24-26` runs a full `COUNT(*)` on every list request; acceptable now, but worth revisiting if wish volume grows.
