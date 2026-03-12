# Copilot Instructions — Minh Tường & Thảo Nguyên Wedding

## Commands

**Client** (`cd client`):
```bash
npm run dev       # start Vite dev server on :5173
npm run build     # production build
npm run preview   # preview production build on :4173
```

**Server** (`cd server`):
```bash
npm run dev       # start Express with nodemon on :4000
npm run start     # production start
npm run db:init   # initialize SQLite schema and log tables
```

No test runner is configured — the backend relies on manual validation and zod schema checks.

## Architecture

This is a **single-page, route-less** React wedding invitation website with a separate Node/Express API.

### Client (`client/src/`)

- **`app/`** — App shell, providers, boot orchestration only. No section logic here.
- **`sections/<SectionName>/`** — Each storytelling section is fully self-contained: JSX, CSS Module, and GSAP timeline. Sections must not cross-import each other's internals.
- **`motion/`** — Shared GSAP/Lenis infrastructure. Centralized animation constants in `motion/constants.js` (use `MOTION` object — never inline durations/easings).
- **`three/`** — Reusable R3F scene foundations (camera/light presets, loaders). Section-specific 3D objects are isolated per section.
- **`stores/`** — Zustand: `useAppStore` (boot/preload state), `useSectionStore` (section progress/activation). No all-in-one global store.
- **`services/api/`** — API clients. **`services/assets/`** — Asset preload registration/loading.
- **`styles/tokens.css`** — Source of truth for all CSS variables (colors, spacing, z-index, durations, easings, radii, fonts). Always use these; never hardcode values.
- **`config/`** — Env vars and section registration. **`constants/`** — Token mirrors as JS constants.

### Server (`server/src/`)

Request flow: **route → controller → service → db**

- Validation (zod) happens in `validation/` before service calls.
- `db/` holds better-sqlite3 init and schema. SQLite file lives in `data/`.
- IDs generated with `nanoid`.

### API

- `GET /api/v1/wishes?limit=20&offset=0`
- `POST /api/v1/wishes` — body: `{ "name": string, "message": string }`
- `GET /health`

## Key Conventions

### Language & Stack

- **JavaScript only — no TypeScript.**
- **No Tailwind.** CSS Modules for all component/section styles. Global CSS only for reset, tokens, utilities.
- All user-facing copy is **Vietnamese**.

### Naming

| Thing | Convention |
|---|---|
| React components | `PascalCase` |
| Hooks | `useCamelCase` |
| Zustand stores | `use<Domain>Store` |
| CSS Module files | `<Component>.module.css` |
| Service functions | `verbNoun` (`getWishes`, `createWish`) |
| Primitive constants | `SCREAMING_SNAKE_CASE` |
| Exported config objects | `camelCase` |

### Styling

- All spacing, z-index, durations, and color values come from CSS variables in `src/styles/tokens.css`.
- No inline styles except unavoidable runtime values.
- Mobile-first media queries.

### Brand Palette

```
--color-brand-mist:     #ffe6d1
--color-brand-taupe:    #9d806e
--color-brand-clay:     #724032
--color-brand-wine:     #490018
--color-brand-burgundy: #320010
```

### Animation

- Use values from `MOTION` in `motion/constants.js` for all GSAP timelines.
- Section timelines must be created **and cleaned up** in the component lifecycle (return cleanup in `useEffect`/`useLayoutEffect`).
- Keep ScrollTrigger setup in shared motion infrastructure; section-specific timelines stay in the section.
- No animation logic in render paths.

### API Response Shape

```js
// success
{ data: ..., meta?: ... }

// failure
{ error: { code: string, message: string, details?: ... } }
```

### Adding a New Section

Place all files under `src/sections/<SectionName>/` — JSX component, CSS Module, and any section-local GSAP timeline. Use the prompt structure from `INIT.md §15` (Purpose, Content, Assets, Layout Intent, Animation Behavior, Mobile Behavior, Acceptance Criteria) when requesting new sections.

### Environment Variables

| File | Variable | Default |
|---|---|---|
| `client/.env` | `VITE_API_BASE_URL` | `http://localhost:4000/api/v1` |
| `client/.env` | `VITE_APP_NAME` | — |
| `server/.env` | `PORT` | `4000` |
| `server/.env` | `CLIENT_ORIGIN` | `http://localhost:5173` |
| `server/.env` | `DB_PATH` | `./data/wedding.sqlite` |
