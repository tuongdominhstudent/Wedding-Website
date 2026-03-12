# Testing And Verification

## Current Test Tooling

- There is no automated test framework installed in either package manifest:
  - [client/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/client/package.json#L6) has only `dev`, `build`, and `preview`.
  - [server/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json#L7) has only `dev`, `start`, and `db:init`.
- Repository search found no test files and no references to Vitest, Jest, Playwright, Cypress, Testing Library, Supertest, or `node:test`.
- There is also no lint or type-check script, so "testing" currently does not include static quality gates.

## What Verification Exists Today

- The main verification path is manual startup and browser/API exercise, as documented in [README.md](/Users/minhtuong03/Documents/Code/Wedding%20card/README.md#L60):
  - Install dependencies in `client/` and `server/`.
  - Run `npm run dev` in each package.
  - Hit the client in a browser and the API on localhost.
- Backend setup includes a manual database initialization script, [server/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json#L10), which runs [initCli.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/initCli.js). That is operational verification, not a test harness.
- The server exposes health endpoints through [app.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js#L21) and [healthRoutes.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/healthRoutes.js), which makes manual smoke testing straightforward.
- The client bootstrap path has built-in progress and failure state handling in [useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L81) and [useAppStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js#L22), but there is no automated verification of those branches.

## Test Presence And Absence By Area

### Client

- No component tests exist for app shell or section rendering, despite clear mounting boundaries in [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L14) and [StoryRoot.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx#L10).
- No store tests exist for Zustand transitions in [useAppStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js) or [useSectionStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useSectionStore.js).
- No API client tests exist for [httpClient.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/httpClient.js#L5) or [wishesApi.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js#L6), so success/error payload mapping is unverified.
- No motion or bootstrap tests exist around Lenis/GSAP setup, asset registration, or reduced-motion behavior in [useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L37).

### Server

- No unit or integration tests exist for request validation, controller response shapes, or persistence flow across:
  - [wishSchemas.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js#L4)
  - [wishController.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js#L4)
  - [wishService.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js#L18)
- No middleware tests exist for [errorHandler.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js#L3) or [notFound.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/notFound.js).
- No application-level route tests exist for [app.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js#L13), so regressions in route wiring or middleware ordering would only be caught manually.

## Scripts Relevant To Verification

- `client`: `npm run build` is the only non-runtime verification-like script ([client/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/client/package.json#L8)). It checks that the Vite bundle compiles, but it does not validate behavior.
- `server`: `npm run start` only starts the process ([server/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json#L9)).
- `server`: `npm run db:init` initializes schema/data files ([server/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json#L10)). Useful for setup, not regression detection.
- There is no root workspace script to run all checks for the repository.

## Biggest Testing Gaps

1. Backend API contracts are completely unguarded. The repo has a clear success/error envelope convention in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L66) and implements it in [wishController.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js#L9) plus [errorHandler.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js#L5), but there are no route-level tests to lock that contract.
2. Validation boundaries are untested. Zod schemas in [wishSchemas.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js#L4) are a major safety layer, yet there are no tests for boundary lengths, coercion, or malformed JSON behavior.
3. Client bootstrap is high-risk and side-effect heavy. [useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L37) orchestrates scroll restoration, motion initialization, asset loading, and store updates in one effect without tests.
4. Story flow rendering is untested. [StoryRoot.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx#L13) gates later sections behind intro completion, but there is no component test covering that progression.
5. No smoke suite exists for critical manual flows. The repo README depends on manually starting both apps ([README.md](/Users/minhtuong03/Documents/Code/Wedding%20card/README.md#L73)), but there is no codified smoke check for "server boots, database initializes, health endpoint returns 200, client builds".

## Practical Next Steps For Planning

- First add a server-focused automated layer. This repo's backend is small, synchronous, and easier to test deterministically than the animation-heavy frontend.
- Recommended minimum first wave:
  - API integration tests for `GET /api/v1/wishes` and `POST /api/v1/wishes`.
  - Validation tests covering query coercion and field limits.
  - Middleware tests for malformed JSON and unknown routes.
- Second wave:
  - Client unit tests for Zustand stores and `httpClient`.
  - A small component test for intro completion gating in `StoryRoot`.
  - A simple build-and-health smoke script from the repo root.

## Confidence Notes

- Current verification confidence is low for regressions and moderate for local bring-up only.
- The architecture is structured enough to support testing cleanly; the missing piece is tooling and script adoption, not a lack of test seams.
