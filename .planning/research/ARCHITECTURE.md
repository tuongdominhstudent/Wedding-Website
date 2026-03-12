# Architecture Research

**Domain:** Cinematic wedding invitation SPA with guest submissions
**Researched:** 2026-03-13
**Confidence:** HIGH

## Goal

Add the missing v1 invitation sections and guest submission flow into the existing React + Express + SQLite app without turning the one-page story into a single oversized component or forcing a rewrite of the current animation stack.

## Recommended Architecture

### System Overview

```text
client/src
├── app shell
│   ├── boot and preload
│   ├── global layout
│   └── story composition
├── section islands
│   ├── intro
│   ├── firsts
│   ├── distance
│   ├── prewedding
│   ├── calendar
│   ├── event-details
│   ├── map
│   ├── photobooth
│   ├── wishes-gallery
│   └── gift-qr
├── shared section support
│   ├── section registry
│   ├── section data
│   ├── motion helpers
│   └── api clients
└── services
    ├── assets
    └── guest entries API

server/src
├── routes
├── controllers
├── validation
├── services
└── db
    ├── schema
    └── guest entry persistence
```

### Boundaries

| Boundary | Owns | Should not own |
|----------|------|----------------|
| `StoryRoot` or successor composer | Section order, section mounting, unlock rules between sections | Detailed copy, section-specific animation logic, API calls |
| Section folder | Markup, section-local motion, local content config, asset registration | Cross-section state, direct database knowledge |
| Shared section support | Registry, common section types, reusable cards/forms/media primitives | Section-specific story decisions |
| API client modules | Request shaping, response parsing, upload helpers | UI state, DOM concerns |
| Express route/controller/service chain | Validation, request mapping, persistence | Frontend formatting decisions |
| DB schema | Stable storage for guest entries and metadata | Presentation-specific fields |

## Component and Data Flow

### Frontend flow

1. Boot only critical intro assets globally.
2. Compose story sections from a registry or ordered definition list.
3. Let each section render as an island with local refs and motion state.
4. When a section needs data, call a feature API module from a local hook or action helper.
5. Keep high-frequency animation state local; only put coarse app state in Zustand.

### Guest submission flow

```text
[Photobooth Section]
    -> request camera permission
    -> capture image blob
    -> collect guest name and wish
    -> submit through guestEntriesApi
    -> API validates payload
    -> service stores metadata and image reference
    -> gallery section fetches paginated entries
    -> polaroid cards render from API data
```

### Camera and map integration notes

- `getUserMedia` should be isolated behind a photobooth-specific hook because it requires HTTPS or `localhost` and explicit permission handling.
- Google Maps should start with an Embed API iframe section because it is the lowest-maintenance integration path and keeps map complexity out of the main app runtime.

## Project Structure Within Current Repo Shape

### Frontend

Keep the current `client/src/sections/<feature>` pattern and extend it rather than introducing a new architecture layer.

```text
client/src/sections/
├── intro/
├── firsts/
├── distance/
├── prewedding/
├── calendar/
├── event-details/
├── map/
├── photobooth/
└── wishes-gallery/

client/src/services/api/
├── httpClient.js
├── wishesApi.js
└── guestEntriesApi.js

client/src/config/
└── sectionRegistry.js
```

Recommended section folder contents:

- `FeatureSection.jsx`
- `FeatureSection.module.css`
- `feature.constants.js`
- `featureAssets.js` when preload registration is needed
- `feature.hooks.js` only when camera, upload, or viewport logic becomes non-trivial

### Backend

Keep the existing server layering and add a new guest-entry domain only if photo support makes the current wishes domain too narrow.

Preferred shape:

```text
server/src/
├── routes/
│   ├── wishRoutes.js
│   └── guestEntryRoutes.js
├── controllers/
├── validation/
├── services/
└── db/
    └── schema.js
```

If the team wants the smallest change set, extend the existing wishes domain into a more general guest-entry record and keep route naming stable at the API edge. If the team wants cleaner semantics, add a new guest-entry domain and let the current wishes endpoint remain text-only until migration is complete. The roadmap should choose one path early to avoid duplicate frontend work.

## Patterns To Keep

### 1. Section-as-island composition

Keep each major story block in its own folder with co-located styles, content constants, and asset registration. This is already the cleanest boundary in the repo and is the main reason the v1 sections can be added incrementally.

### 2. Thin entry points

Keep `main`, app shell, server boot, and routes thin. New v1 work should not push business logic into `StoryRoot`, `AppShell`, or Express route files.

### 3. Local animation state

GSAP timelines, refs, and scroll progress should stay inside each section. Global stores should remain limited to boot lifecycle, coarse section activation, and shared infrastructure.

### 4. Feature API adapters

Frontend networking should continue to go through `services/api/*` modules. The photobooth UI should not build fetch requests inline.

## Patterns To Add

### 1. Ordered section definition list

The current hardcoded `StoryRoot` sequencing is acceptable for three sections but will become brittle for v1 completion. Move toward an ordered definition list using the existing section registry idea or a plain exported array.

Minimum fields:

- `id`
- `order`
- `component`
- `preloadPolicy` such as `boot` or `lazy`
- `unlockAfter` when a section depends on intro completion

This keeps roadmap work incremental while making section insertion low risk.

### 2. Content/config split inside each new section

Static text, dates, venue details, map URL, and QR asset references should live in constants or content modules, not inside JSX branches. Wedding content is likely to change late.

### 3. Guest entry domain model

Model guest submissions as one coherent record even if the first release only stores local image metadata.

Suggested logical fields:

- `id`
- `name`
- `message`
- `photo_url` or `photo_path`
- `photo_width`
- `photo_height`
- `created_at`

That shape supports the polaroid gallery without tying storage to one frontend card design.

### 4. Split boot preload from section preload

Only the intro and immediately visible assets should block app readiness. Later sections such as prewedding video, gallery images, and map iframe should load when nearby or when mounted.

## Build Order

1. Refactor story composition to support a clear ordered section list without changing current visuals.
2. Add purely presentational sections first: prewedding, calendar, event details, gift QR.
3. Add the map section with iframe embed and content wiring.
4. Extend backend schema and API for guest entries with photo metadata.
5. Build the photobooth section with camera fallback states and submission wiring.
6. Build the wishes gallery section against real API data.
7. Optimize preload strategy and mobile polish after the full v1 path exists.

This order keeps user-visible progress steady while avoiding an early commitment to unstable media-upload details.

## Anti-Patterns To Avoid

### 1. One giant story component

Do not keep appending JSX and scroll logic into `StoryRoot`. It should compose sections, not become the implementation site for all sections.

### 2. Globalizing every section state

Do not move per-section animation state into Zustand. That would increase coupling and make motion debugging harder.

### 3. Treating all assets as boot-critical

Do not preload every video and image before the app becomes interactive. The current sequential preload concern will get worse with the missing v1 sections.

### 4. Storing presentation-shaped data in SQLite

Do not store fields such as `polaroid_rotation` or section-specific copy in the backend schema. Persist guest entry facts, not UI decoration choices.

### 5. Embedding browser APIs directly in reusable shell code

Camera permission and media capture should stay inside photobooth-specific hooks/components. Do not leak `getUserMedia` concerns into app bootstrap or shared layout layers.

### 6. Jumping to a heavy map SDK

Do not add a full interactive map stack unless v1 proves it is needed. The iframe embed path is simpler, safer, and easier to maintain.

## Roadmap Implications

### Phase shaping

The roadmap should split v1 completion into at least three architecture-aligned phases:

1. Story composition and static content sections
2. Venue discovery and guest interaction backend
3. Photobooth capture, submission UX, and gallery polish

### Dependency notes

- Photobooth depends on schema/API decisions, so it should not be scheduled before the guest-entry model is chosen.
- Gallery work depends on real persisted photo metadata, not just text wishes.
- Map work is independent and can ship earlier.
- Section registry refactoring is a force multiplier and should happen before adding many new sections.

### Verification implications

Each roadmap phase should include mobile checks for:

- boot readiness not blocked by late-section media
- intro completion still unlocking downstream sections
- camera denied flow
- submission success and failure states
- gallery rendering with empty and populated data

## Recommendation

Use the existing section-island architecture as the backbone, add a light ordered section registry, keep backend growth inside the current route-controller-service-db layers, and treat photobooth plus gallery as a separate guest-entry domain concern rather than mixing it into story composition code.

This preserves maintainability because section delivery stays incremental, content stays editable, and the riskiest browser features remain isolated behind small feature boundaries.
