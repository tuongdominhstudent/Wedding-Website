# Code Quality Conventions

## Scope

This repository is a split client/server JavaScript codebase with a documented architecture target in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L49) and a scaffold-first implementation described in [README.md](/Users/minhtuong03/Documents/Code/Wedding%20card/README.md#L3). The code mostly follows those rules, but several conventions are social rather than tool-enforced because there is no lint, format, or type-check step in either package manifest ([client/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/client/package.json#L6), [server/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json#L7)).

## Naming

- React components use `PascalCase` file names and default exports, for example [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L8), [StoryRoot.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx#L7), and [IntroSection.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.jsx).
- Hooks use `useCamelCase`, matching both the documented rule in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L106) and implementation such as [useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L28).
- Zustand stores use the `use<Domain>Store` pattern, for example [useAppStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js) and [useSectionStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useSectionStore.js).
- Service functions are verb-first and domain-specific, such as [getWishes](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js#L6), [createWish](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js#L20), [listWishes](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js#L18), and [createWish](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js#L27).
- Shared primitive constants are usually `SCREAMING_SNAKE_CASE` or frozen constant objects, e.g. [BOOT_PHASE](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js#L3), [PRELOADER_CONFIG](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/preloaderConfig.js), and CSS tokens in [tokens.css](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/tokens.css#L1).

## Module Patterns

### Client

- The client follows domain folders under `src/`, consistent with [README.md](/Users/minhtuong03/Documents/Code/Wedding%20card/README.md#L22) and [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L49).
- `src/app` is kept small and orchestration-only: [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L8) wires layout, story root, and loading shell.
- Sections are isolated by domain under `src/sections/<domain>/`, with each section carrying its own component, constants, assets, and CSS module, for example `client/src/sections/intro/*` and `client/src/sections/distance/*`.
- Cross-cutting behavior is intentionally centralized:
  - Motion infrastructure under `client/src/motion/*`, used from [useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L2).
  - Asset preloading under `client/src/services/assets/*`, used from [useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L73).
  - Shared state under `client/src/stores/*`, consumed via selector-based reads in [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L9).
- Imports are relative and local; there is no path-alias convention. Client ESM imports usually omit the `.js` extension, for example [wishesApi.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js#L1), while server ESM imports include `.js`, for example [app.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/app.js#L4). That split is understandable given Vite vs Node, but it is still a repo-wide inconsistency future contributors should preserve consciously rather than mix accidentally.

### Server

- The server follows a simple `route -> controller -> service -> db` flow exactly as documented in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L61).
- Routes are thin and declarative, as in [wishRoutes.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/routes/wishRoutes.js#L4).
- Controllers own request parsing and response shaping, as in [wishController.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js#L4).
- Services encapsulate persistence and record-shape decisions, as in [wishService.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/services/wishService.js#L1).
- Validation is colocated under `server/src/validation`, with Zod schemas imported explicitly by controllers ([wishSchemas.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js#L4)).

## Styling Conventions

- Local styling uses CSS Modules, with paired filenames such as [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L6) and [AppShell.module.css](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.module.css), or [IntroSection.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.jsx#L6) and [IntroSection.module.css](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.module.css).
- Global CSS is limited to foundation layers under `client/src/styles/`, matching the rule in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L71).
- Design tokens live in CSS custom properties in [tokens.css](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/tokens.css#L1). Color, typography, spacing, z-index, timing, and layout values are all defined there.
- The stated convention is mobile-first media queries ([INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L77)). Current tokens already follow that pattern with base values plus a min-width override in [tokens.css](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/styles/tokens.css#L56).
- Inline style avoidance appears to be respected in the React layer; imperative visual changes happen through GSAP or direct DOM mutation inside effects rather than JSX `style` props, e.g. [IntroSection.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.jsx#L25).

## State Management Patterns

- Zustand is the only shared client state mechanism visible in the codebase ([client/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/client/package.json#L11)).
- Stores are narrow and domain-scoped:
  - [useAppStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js#L9) holds bootstrap, reduced-motion, Lenis, and asset-loader state.
  - [useSectionStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useSectionStore.js#L3) holds active section and progress only.
- Components usually subscribe with selector functions rather than pulling whole-store objects, which reduces rerender scope, e.g. [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L9).
- Local interaction state stays in component-level `useState`, for example intro completion in [StoryRoot.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx#L8).
- The bootstrap hook is the main imperative coordinator. It mutates global browser state, initializes motion infrastructure, and populates stores in one effect ([useAppBootstrap.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/hooks/useAppBootstrap.js#L37)). This is pragmatic for a single-page experience, but it concentrates a lot of startup responsibility in one place.

## Error Handling

- Server-side error handling is centralized in [errorHandler.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js#L3).
- Validation and malformed JSON errors are translated to structured `400` responses, while unexpected errors fall through to a generic `500` plus `console.error` logging ([errorHandler.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js#L4)).
- Controllers wrap sync work in `try/catch` and forward failures with `next(error)`, for example [wishController.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js#L4).
- Client-side API failures are normalized into thrown `Error` objects with attached `status` and `payload` metadata in [httpClient.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/httpClient.js#L18).
- Boot failures are collapsed into a store-level message string via [useAppStore.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/stores/useAppStore.js#L22), which keeps the UI simple but loses structured diagnostic detail.

## Validation Patterns

- Request validation uses Zod on the server before service execution, matching the documented rule in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L65).
- Query coercion is explicit and conservative in [wishSchemas.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/validation/wishSchemas.js#L9), preventing stringly typed pagination from leaking into services.
- Response envelopes are consistent with the repo rule in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L66):
  - Success responses with `data` and optional `meta` in [wishController.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/controllers/wishController.js#L9).
  - Failure responses with `error.code` and `error.message` in [errorHandler.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js#L5).
- There is little client-side validation at present; most client modules assume valid upstream configuration and API payload shapes, as seen in [env.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/env.js#L3) and [wishesApi.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/services/api/wishesApi.js#L6).

## Notable Inconsistencies And Risks

- No automated quality gate exists. The repo documents conventions in [INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L71), but there is no ESLint, Prettier, or test script in either package manifest ([client/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/client/package.json#L6), [server/package.json](/Users/minhtuong03/Documents/Code/Wedding%20card/server/package.json#L7)).
- [AppShell.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/app/AppShell.jsx#L10) reads `bootProgress` and never uses it, leaving dead state consumption in a top-level shell.
- [sectionRegistry.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/sectionRegistry.js#L1) establishes a plugin-style registry with duplicate guards, but the current rendered section flow in [StoryRoot.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/StoryRoot.jsx#L13) hardcodes section composition directly. That suggests either unfinished infrastructure or an architectural branch that should be reconciled before more sections are added.
- The project rule says "No hard-coded magic spacing, durations, z-index values in components" ([INIT.md](/Users/minhtuong03/Documents/Code/Wedding%20card/INIT.md#L78)), but section animation code still includes many numeric literals inside [IntroSection.jsx](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/sections/intro/IntroSection.jsx#L101). Some are animation-specific and reasonable, but they are not consistently centralized yet.
- Error logging is only `console.error` on the server ([errorHandler.js](/Users/minhtuong03/Documents/Code/Wedding%20card/server/src/middleware/errorHandler.js#L23)); there is no request correlation, environment-based logging policy, or persistence.
- Client environment handling is permissive by default ([client/src/config/env.js](/Users/minhtuong03/Documents/Code/Wedding%20card/client/src/config/env.js#L3)), which is fine for local development but means misconfiguration can survive silently until runtime.

## Planning Implications

- Treat `INIT.md` as the intended standard, but verify against implementation before enforcing new rules.
- Add tooling before expanding team size or surface area; otherwise the current conventions remain best-effort only.
- Resolve whether section registration should become real architecture or be removed, because both patterns should not grow in parallel.
- If more backend domains are added, keep the current thin-controller/service/validation split; it is the clearest and most consistently followed convention in the repo today.
