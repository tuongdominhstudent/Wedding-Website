# Minh Tường & Thảo Nguyên - Wedding

Scaffold-first production foundation for a premium, minimal, cinematic wedding invitation website.

This phase intentionally ships architecture only. The UI is intentionally near-empty so future prompts can build sections incrementally without refactoring core systems.

## Stack

- Client: React + Vite + JavaScript + CSS Modules + GSAP/ScrollTrigger + Lenis + Zustand + React Three Fiber/Drei/Postprocessing
- Server: Node.js + Express + better-sqlite3 + zod + nanoid + dotenv + cors + helmet

## Top-Level Structure

```txt
.
├── client
├── server
├── INIT.md
└── README.md
```

## Client Structure

```txt
client/
├── src/
│   ├── app/                # app shell and providers
│   ├── components/         # shared UI pieces
│   ├── config/             # env + section registration foundations
│   ├── constants/          # centralized token mirrors
│   ├── hooks/              # app bootstrap and reusable hooks
│   ├── layouts/            # structural page layers
│   ├── motion/             # GSAP/Lenis shared infrastructure
│   ├── sections/           # future storytelling sections
│   ├── services/           # API + asset loading services
│   ├── stores/             # focused Zustand stores
│   ├── styles/             # reset/tokens/utilities/global
│   └── three/              # reusable 3D foundations
└── package.json
```

## Server Structure

```txt
server/
├── data/                   # sqlite file location
├── src/
│   ├── config/             # env + server constants
│   ├── controllers/        # route handlers
│   ├── db/                 # sqlite init + schema
│   ├── middleware/         # not-found + error handlers
│   ├── routes/             # endpoint routing
│   ├── services/           # database business logic
│   ├── validation/         # zod schemas
│   ├── app.js              # express app composition
│   └── server.js           # entrypoint
└── package.json
```

## Setup

1. Install dependencies:
```bash
cd client && npm install
cd ../server && npm install
```
2. Configure environment files:
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

## Run

1. Start API server:
```bash
cd server
npm run dev
```
2. Start client:
```bash
cd client
npm run dev
```

Client defaults to `http://localhost:5173` and server defaults to `http://localhost:4000`.

## API (Current)

- `GET /api/v1/wishes?limit=20&offset=0`
- `POST /api/v1/wishes`
  - body:
```json
{
  "name": "Guest name",
  "message": "Wedding wish message"
}
```

## Environment Variables

Client (`client/.env`):
- `VITE_API_BASE_URL` (default: `http://localhost:4000/api/v1`)
- `VITE_APP_NAME`

Server (`server/.env`):
- `PORT` (default: `4000`)
- `CLIENT_ORIGIN` (default: `http://localhost:5173`)
- `DB_PATH` (default: `./data/wedding.sqlite`)

## Evolution Strategy

- Build one storytelling section per prompt.
- Keep animation logic section-local and infrastructure shared.
- Reuse tokens and centralized motion values.
- Keep 3D scene logic reusable and decoupled from content sections.
- Expand backend only as needed (wishes/messages first).

For strict implementation rules and future prompt format, read `INIT.md` before adding any new section/component.
# Wedding-Website
