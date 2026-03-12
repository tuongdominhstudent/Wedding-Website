# External Integrations

## Integration Summary
- The repository currently has one application-facing integration boundary: the browser client calls the local Express JSON API under `/api/v1`, and the server persists to a local SQLite database. References: `client/src/services/api/wishesApi.js:1-28`, `server/src/app.js:27-28`, `server/src/db/index.js:20-27`.
- No third-party SaaS APIs, OAuth providers, payment gateways, email services, analytics SDKs, or webhook consumers are present in the tracked source.

## Frontend To Backend Boundary
- The frontend resolves its API base URL from `VITE_API_BASE_URL`, defaulting to `http://localhost:4000/api/v1`. Reference: `client/src/config/env.js:1-6`.
- Network calls go through a small shared `httpClient` wrapper around browser `fetch`, expecting JSON responses and normalizing error payloads. Reference: `client/src/services/api/httpClient.js:1-26`.
- The only defined API client module is `wishesApi`, which exposes:
  - `GET {apiBaseUrl}/wishes?limit&offset`
  - `POST {apiBaseUrl}/wishes`
  References: `client/src/services/api/wishesApi.js:4-28`.
- There is no auth token injection, cookie/session management, retry logic, or refresh-token flow in the client API layer. Reference: `client/src/services/api/httpClient.js:1-26`.

## Backend HTTP Surface
- The Express app mounts a root health endpoint at `/health` plus versioned routes at `/api/v1/health` and `/api/v1/wishes`. References: `server/src/app.js:23-28`, `server/src/config/constants.js:1-3`, `server/src/routes/healthRoutes.js:1-11`, `server/src/routes/wishRoutes.js:1-8`.
- `GET /api/v1/wishes` validates `limit` and `offset` query params via Zod, then returns `{ data, meta }`. References: `server/src/controllers/wishController.js:4-20`, `server/src/validation/wishSchemas.js:9-12`.
- `POST /api/v1/wishes` validates `{ name, message }`, inserts a row, and returns `{ data }`. References: `server/src/controllers/wishController.js:22-32`, `server/src/validation/wishSchemas.js:4-7`, `server/src/services/wishService.js:34-43`.
- Error responses are standardized for validation errors, invalid JSON, unknown routes, and generic server failures. References: `server/src/middleware/errorHandler.js:3-30`, `server/src/middleware/notFound.js:1-8`.

## Persistence Integration
- Persistence is direct SQLite access through `better-sqlite3`; there is no ORM or remote database adapter. Reference: `server/src/db/index.js:1-28`.
- Database path is environment-configured through `DB_PATH`, defaulting to `./data/wedding.sqlite`. Reference: `server/src/config/env.js:13-18`.
- Startup ensures the database directory exists, opens the SQLite file, enables WAL mode and foreign keys, and executes bootstrap schema SQL. References: `server/src/db/index.js:15-26`, `server/src/db/schema.js:1-8`.
- Current stored domain model is a single `wishes` table with indexed `created_at`, consumed by prepared statements in `wishService`. References: `server/src/db/schema.js:1-8`, `server/src/services/wishService.js:4-43`.

## Env-Configured Services And Deployment Inputs
- Client env surface:
  - `VITE_APP_NAME` for display naming.
  - `VITE_API_BASE_URL` for API routing.
  Reference: `client/src/config/env.js:3-6`.
- Server env surface:
  - `NODE_ENV`
  - `PORT`
  - `CLIENT_ORIGIN`
  - `DB_PATH`
  Reference: `server/src/config/env.js:13-18`.
- `CLIENT_ORIGIN` feeds CORS origin configuration; if omitted, the server falls back to default `cors()` behavior. Reference: `server/src/app.js:13-20`.

## Other Network And Asset Fetches
- The frontend also performs same-origin asset fetches for preloading GLB files and extracting embedded textures in the long-distance scene. These are static asset requests, not external APIs. References: `client/src/sections/distance/longDistanceJourneyAssets.js:9-29`, `client/src/sections/distance/LongDistanceGlobeScene.jsx:92-139`.
- Asset preloading is orchestrated during bootstrap through `AssetRegistry` and `AssetLoader`. References: `client/src/hooks/useAppBootstrap.js:73-86`, `client/src/services/assets/assetRegistry.js:1-29`, `client/src/services/assets/assetLoader.js:1-33`.

## Auth, Webhooks, And Security Surfaces
- No authentication or authorization layer exists. There are no login routes, user models, sessions, JWT handling, API keys, or protected middleware in the current codebase.
- No webhook producers or consumers exist. There are no signed callback handlers, message queues, cron integrations, or background workers.
- Security posture is basic API hardening through `helmet`, CORS configuration, request size limiting, and schema validation. References: `server/src/app.js:19-21`, `server/src/validation/wishSchemas.js:1-12`, `server/src/middleware/errorHandler.js:3-30`.

## Planning Notes
- The client/server contract is narrow and easy to expand, but it is not yet strongly typed across the boundary; request and response shapes live separately in frontend API helpers and backend Zod/controller code.
- The persistence layer is synchronous SQLite, which is simple for a low-traffic guestbook flow but will become a scaling constraint if the project adds multi-user admin features, remote hosting, or heavier write throughput.
