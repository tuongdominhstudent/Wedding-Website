# Structure

## Top-level layout

The repository is organized as a two-application workspace with planning and workflow support files at the root:

- [`client`](/Users/minhtuong03/Documents/Code/Wedding%20card/client): frontend app
- [`server`](/Users/minhtuong03/Documents/Code/Wedding%20card/server): backend API
- [`README.md`](/Users/minhtuong03/Documents/Code/Wedding%20card/README.md): project overview, stack, setup, and intended evolution
- [`INIT.md`](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md): project-specific implementation guidance
- [`.planning`](/Users/minhtuong03/Documents/Code/Wedding%20card/.planning): generated planning/codebase artifacts
- [`.codex`](/Users/minhtuong03/Documents/Code/Wedding%20card/.codex): local workflow automation and skills

Practical planning focus should stay on `client/src` and `server/src`. Root workflow directories are support infrastructure rather than product code.

## Frontend structure

### Frontend app root

- [`client/package.json`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/package.json): Vite scripts and frontend dependencies
- [`client/vite.config.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/vite.config.js): dev/preview host and port configuration
- [`client/index.html`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/index.html): browser mount document
- [`client/src/main.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/main.jsx): React entry point

### `client/src` directory layout

- [`client/src/app`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app): application shell and provider entry wiring
- [`client/src/assets`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/assets): static media imported by components and preloaders
- [`client/src/components`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components): reusable UI/effect components not tied to one story section
- [`client/src/config`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config): environment values and cross-cutting configuration
- [`client/src/constants`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/constants): design token mirrors and static app-wide constants
- [`client/src/hooks`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks): reusable hooks, currently dominated by app bootstrap
- [`client/src/layouts`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/layouts): page-level visual layering
- [`client/src/motion`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion): GSAP and Lenis infrastructure
- [`client/src/sections`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections): major storytelling modules
- [`client/src/services`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services): API and asset-loading services
- [`client/src/stores`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores): Zustand stores
- [`client/src/styles`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles): reset, tokens, utilities, and global styling
- [`client/src/three`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three): shared React Three Fiber foundations

There is also a [`client/src/utils`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/utils) directory in the tree, but no tracked source files were present in the file inventory. It is either reserved for future use or currently empty.

## Frontend module patterns

### App shell pattern

The app bootstraps through a narrow chain:

- [`client/src/main.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/main.jsx)
- [`client/src/App.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/App.jsx)
- [`client/src/app/AppShell.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx)
- [`client/src/app/providers/AppProviders.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/providers/AppProviders.jsx)

This indicates a convention of keeping entry files thin and pushing real behavior into shell/provider/hook modules.

### Section folder pattern

Each implemented storytelling area is grouped by feature folder under [`client/src/sections`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections):

- [`client/src/sections/intro`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro)
- [`client/src/sections/firsts`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/firsts)
- [`client/src/sections/distance`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance)

Within each section folder, the same layout repeats:

- `SectionName.jsx`: main section component
- `SectionName.module.css`: section-local styles
- `*.constants.js`: configuration and story data
- `*Assets.js`: preload registration or asset lookup
- optional scene/helper modules when the section needs extra complexity

Examples:

- [`client/src/sections/intro/IntroSection.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.jsx)
- [`client/src/sections/intro/intro.constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/intro.constants.js)
- [`client/src/sections/intro/introAssets.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/introAssets.js)
- [`client/src/sections/distance/LongDistanceGlobeScene.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance/LongDistanceGlobeScene.jsx)

This is the main organizational convention for frontend feature work.

### Co-located style pattern

Most React components use CSS Modules with the same basename:

- [`client/src/app/AppShell.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx) + [`client/src/app/AppShell.module.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.module.css)
- [`client/src/layouts/StoryLayout.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/layouts/StoryLayout.jsx) + [`client/src/layouts/StoryLayout.module.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/layouts/StoryLayout.module.css)
- [`client/src/components/loading/LoadingScreen.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components/loading/LoadingScreen.jsx) + [`client/src/components/loading/LoadingScreen.module.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components/loading/LoadingScreen.module.css)

Shared design primitives are centralized instead of repeated:

- [`client/src/styles/reset.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/reset.css)
- [`client/src/styles/tokens.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/tokens.css)
- [`client/src/styles/utilities.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/utilities.css)
- [`client/src/styles/global.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/global.css)

### Service and store separation

Cross-cutting logic that is not presentation-focused lives outside components:

- API adapters in [`client/src/services/api`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api)
- asset preload infrastructure in [`client/src/services/assets`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/assets)
- application state in [`client/src/stores`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores)

This keeps section components from owning environment, transport, or preload orchestration concerns.

### Three.js split

The repository uses two distinct locations for 3D code:

- shared R3F setup in [`client/src/three`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three)
- section-specific 3D logic in [`client/src/sections/distance/LongDistanceGlobeScene.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance/LongDistanceGlobeScene.jsx)

The convention is:

- generic camera/light/quality concerns go in `three/`
- story-specific 3D scenes stay with the owning section

## Backend structure

### Backend app root

- [`server/package.json`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json): runtime scripts and dependencies
- [`server/src/server.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/server.js): process entry
- [`server/src/app.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js): Express app assembly

### `server/src` directory layout

- [`server/src/config`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/config): environment parsing and API constants
- [`server/src/controllers`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers): request handlers that shape HTTP responses
- [`server/src/db`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db): SQLite connection, schema, and DB initialization tooling
- [`server/src/middleware`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware): terminal middleware for not-found and error handling
- [`server/src/routes`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes): Express routers grouped by endpoint area
- [`server/src/services`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services): business logic and SQL execution
- [`server/src/validation`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation): Zod schemas for request parsing

There is also a [`server/src/utils`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/utils) directory in the tree, but no tracked files appeared in the repository file list.

### Backend request organization pattern

The backend follows a standard vertical flow:

1. route file
2. controller
3. validation
4. service
5. database

Concrete example for wishes:

- [`server/src/routes/wishRoutes.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/wishRoutes.js)
- [`server/src/controllers/wishController.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js)
- [`server/src/validation/wishSchemas.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js)
- [`server/src/services/wishService.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js)
- [`server/src/db/index.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/index.js)

Health checks follow the same routing convention but skip service and validation layers because the endpoint is static:

- [`server/src/routes/healthRoutes.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/healthRoutes.js)

## Naming and layout conventions

### Naming conventions

- React components use PascalCase filenames: [`client/src/components/effects/DarkVeil.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components/effects/DarkVeil.jsx)
- CSS Modules use the component basename plus `.module.css`: [`client/src/components/effects/DarkVeil.module.css`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components/effects/DarkVeil.module.css)
- Hooks use `useX` naming: [`client/src/hooks/useAppBootstrap.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js), [`client/src/motion/gsap/useGsapContext.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/gsap/useGsapContext.js)
- Zustand stores use `useXStore` naming: [`client/src/stores/useAppStore.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js)
- Constants/config files use camelCase or descriptive suffixes: [`client/src/config/preloaderConfig.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/preloaderConfig.js), [`client/src/three/config/cameraPresets.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/config/cameraPresets.js)
- Backend modules use lower camel case with suffixes by role: `Routes`, `Controller`, `Service`, `Schemas`, `Handler`

### Responsibility placement

Where responsibilities currently live:

- app boot lifecycle: [`client/src/hooks/useAppBootstrap.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js)
- loading overlay UX: [`client/src/components/loading/LoadingScreen.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/components/loading/LoadingScreen.jsx)
- global layout layering: [`client/src/layouts/StoryLayout.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/layouts/StoryLayout.jsx)
- story sequencing: [`client/src/sections/StoryRoot.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx)
- reusable motion setup: [`client/src/motion/gsap/gsapConfig.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/gsap/gsapConfig.js), [`client/src/motion/scroll/createLenis.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/scroll/createLenis.js)
- shared 3D base scene: [`client/src/three/scene/BaseScene.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/scene/BaseScene.jsx)
- API transport: [`client/src/services/api/httpClient.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/httpClient.js)
- API feature module: [`client/src/services/api/wishesApi.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js)
- server composition: [`server/src/app.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js)
- persistence setup: [`server/src/db/index.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/index.js)
- schema definition: [`server/src/db/schema.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/db/schema.js)

## File organization patterns worth preserving

### Thin entry points

Top-level entry files stay very small and delegate immediately:

- [`client/src/main.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/main.jsx)
- [`client/src/App.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/App.jsx)
- [`server/src/server.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/server.js)

This is a good convention to preserve because it keeps runtime startup easy to trace.

### Co-located feature assets and constants

Feature folders store their own content definitions and preload declarations. Examples:

- [`client/src/sections/firsts/firstsJourney.constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/firsts/firstsJourney.constants.js)
- [`client/src/sections/firsts/firstsJourneyAssets.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/firsts/firstsJourneyAssets.js)
- [`client/src/sections/distance/longDistanceJourney.constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance/longDistanceJourney.constants.js)
- [`client/src/sections/distance/longDistanceJourneyAssets.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/distance/longDistanceJourneyAssets.js)

This reduces cross-folder coupling when sections evolve independently.

### Shared configuration buckets

Cross-cutting configuration is grouped by domain rather than duplicated:

- app/env config in [`client/src/config/env.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/env.js) and [`server/src/config/env.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/config/env.js)
- motion constants in [`client/src/motion/constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/motion/constants.js)
- 3D presets in [`client/src/three/config`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/three/config)
- server API limits/prefixes in [`server/src/config/constants.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/config/constants.js)

## Structural observations for future planning

- The frontend has a clear intended extension point in [`client/src/config/sectionRegistry.js`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/sectionRegistry.js), but the current section tree is still hardcoded in [`client/src/sections/StoryRoot.jsx`](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx).
- The repository already separates infrastructure code from content-heavy section code, so new story sections should fit naturally under `client/src/sections/<feature>/`.
- The backend folder structure is ready for more domains beyond wishes; new resources should mirror the existing `routes -> controllers -> validation -> services` layout.
- Build artifacts (`client/dist`) and installed dependencies (`client/node_modules`, `server/node_modules`) exist in the workspace, but they should not inform future source organization decisions.
