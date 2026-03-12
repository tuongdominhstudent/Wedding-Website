# Phase 1: Boot and Story Hardening - Research

**Researched:** 2026-03-13
**Domain:** Brownfield React/Vite cinematic story bootstrap hardening
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

These decisions are non-negotiable for planning.

### Locked Decisions
- Guests must have a visible way to escape the opening if the video or reveal sequence misbehaves.
- The escape action should appear after a short beat, not immediately and not only after hard failure.
- The escape action should use romantic or story-aligned copy rather than blunt utilitarian copy.
- If playback fails completely, the intro should degrade into a polished still or final-frame state before guests continue.
- Only intro-critical assets should be allowed to block initial entry into the site.
- Later-section assets should load on approach rather than delaying initial entry.
- The loading screen should still feel cinematic and branded, not purely utilitarian.
- The loading moment can be noticeable on mobile, but should not depend on broad preload of downstream sections.
- Loading communication should prioritize mood first; progress can remain subtle rather than dominant.
- The rest of the story should unlock as soon as the guest exits the intro, whether by successful completion or explicit escape action.
- After intro exit, guests should drop naturally into the story start rather than being snapped abruptly forward.
- The intro should still appear on fresh visits rather than being skipped automatically on return.
- Phase 1 should keep the current section order intact; planning may harden composition behavior but should not broadly reorder the story.

### Claude's Discretion
- Exact wording for the romantic escape action
- The precise delay before the escape action appears
- The visual treatment of the failure-state still frame
- The exact threshold for when late-section assets begin loading
- The final balance between cinematic loader timing and responsiveness within the chosen direction

### Deferred Ideas (OUT OF SCOPE)
- None
</user_constraints>

<research_summary>
## Summary

Phase 1 should harden the existing opening flow instead of replacing it. The current code already has the right control points: `useAppBootstrap` owns app boot, `IntroSection` owns intro playback and document locking, `StoryRoot` owns when later sections mount, and the asset registry/loader already provides a preload surface. The problem is that all of those surfaces are currently wired as a single all-or-nothing success path.

The recommended approach is to split boot and progression into explicit stages: intro-critical preload, intro exit state, and deferred downstream hydration. Keep the branded loading screen and the current intro section, but add a bounded escape path, a still-frame fallback, and a story-unlock handshake that succeeds on either autoplay completion or user escape. Keep section order intact, but move composition toward data-driven mounting so later phases can add sections without growing bootstrap coupling.

**Primary recommendation:** Keep the current React/Vite plus GSAP/Lenis architecture, but refactor boot and intro progression into scoped stages rather than one global preload and one single intro-complete path.
</research_summary>

<standard_stack>
## Standard Stack

Use the existing stack for this phase. No new framework is needed.

### Core
| Library | Version | Purpose | Why Standard Here |
|---------|---------|---------|-------------------|
| React | 18.3.1 | Section composition and state-driven unlock flow | Already owns story rendering and is sufficient for gated progression |
| Vite | 6.2.0 | Asset graph and client bundling | Current build path already handles media imports and code splitting |
| GSAP | 3.13.0 | Intro reveal and section motion orchestration | Existing timelines and ScrollTrigger integration already depend on it |
| Lenis | 1.3.11 | Smooth scroll lifecycle control | Current intro lock/unlock and later pinned sections already depend on it |
| Zustand | 5.0.3 | Shared bootstrap and runtime state | Existing boot phase, progress, Lenis instance, and error state are already centralized here |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-three/fiber | 8.18.0 | Long-distance scene rendering | Keep isolated to downstream sections; do not let it block intro boot |
| @react-three/drei | 9.122.0 | R3F scene helpers | Keep in the long-distance section only |
| Native `video` / `Image` / `fetch` preload | browser APIs | Asset readiness checks | Use for scoped preload groups without adding another loader library |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing asset registry plus loader | Third-party preload manager | Extra abstraction without solving the real issue, which is preload scoping |
| Existing `StoryRoot` composition | Router-driven multi-page flow | Too large a change for a brownfield hardening phase |
| Existing GSAP intro timeline | CSS-only intro fallback | Simpler, but would force a redesign instead of hardening current motion |

**Installation:** No new package is required for the recommended Phase 1 direction.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
Keep the current file layout, but tighten responsibility boundaries.

```text
client/src/
├── hooks/                    # App bootstrap and shared lifecycle hooks
├── stores/                   # Boot phase, intro exit, deferred-load state
├── services/assets/          # Asset registration grouped by preload tier
├── sections/intro/           # Video, fallback still, escape CTA, reveal completion
├── sections/                 # Story composition and unlock orchestration
└── config/                   # Section order and preload thresholds
```

### Pattern 1: Tiered Bootstrap
**What:** Split assets into `blocking`, `intro-enhancing`, and `deferred-on-approach` tiers.
**When to use:** For any section-based story where only the opening must be guaranteed before entry.
**How it fits this repo:** `useAppBootstrap` currently registers intro, firsts, and long-distance assets, then waits for `loader.loadAll()`. Replace that with scoped registration or tier metadata so only intro-critical assets gate `BOOT_PHASE.READY`.

Practical guidance:
- Block on loading screen background, loader character, intro video metadata or playable state, intro still/final frame, and intro side cards.
- Do not block on `firsts` milestone photos or long-distance GLB files.
- Start deferred registration after boot is ready, or on section proximity via `IntersectionObserver`.

### Pattern 2: Bounded Intro Exit State Machine
**What:** Treat intro progression as explicit states instead of relying on `video ended -> reveal timeline complete`.
**When to use:** When autoplay, network, or animation failure must not dead-end the experience.
**Recommended states:** `booting`, `intro-playing`, `intro-fallback`, `intro-revealing`, `intro-exited`.
**How it fits this repo:** `IntroSection` already owns video playback, fallback imagery, and reveal sequencing. Add a single exit function that always resolves story progression regardless of which path triggered it.

Practical guidance:
- Show escape CTA after a short timer once intro UI is stable.
- On autoplay rejection or video error, switch to a polished still/final-frame mode instead of waiting forever.
- Route both successful reveal completion and manual escape through the same `completeIntroExit()` path.
- Ensure cleanup always restores `overflow`, `touchAction`, Lenis, and `ScrollTrigger`.

### Pattern 3: Story Unlock Handshake
**What:** Separate "intro section remains visible" from "rest of story can mount and scroll."
**When to use:** When the intro is cinematic but downstream content must become available reliably.
**How it fits this repo:** `StoryRoot` currently mounts `FirstsJourneySection` and `LongDistanceJourneySection` only when `isIntroComplete` flips true. Keep the order, but change the trigger to `isStoryUnlocked`, which can be reached by any valid intro exit path.

Practical guidance:
- Mount downstream sections immediately after story unlock, not only after the full reveal succeeds.
- Preserve a soft handoff by scrolling to the story start or releasing the pinned intro naturally, not by jumping far down the page.
- Keep intro-first ordering in `StoryRoot`, but consider expressing later sections through a section definition list so future phases add sections without changing bootstrap logic.

### Pattern 4: Deferred Section Hydration by Proximity
**What:** Load heavy media when the guest is near the section, not at first paint.
**When to use:** For mobile-heavy storytelling pages with media-rich lower sections.
**How it fits this repo:** `FirstsJourneySection` and `LongDistanceJourneySection` are below the intro and can tolerate delayed asset readiness.

Practical guidance:
- Use `IntersectionObserver` or a scroll-threshold hook to begin firsts asset loading shortly after intro exit.
- Begin long-distance model fetch only when the section is within a prefetch distance.
- Store deferred-load completion in the app store only if needed for UI hints; do not create a second competing preload model.

### Anti-Patterns to Avoid
- **Global blocking preload:** Registering all story assets in one synchronous queue makes every future section worsen startup latency.
- **Single success-path unlock:** If the only unlock path is `onEnded -> reveal timeline -> onComplete`, any autoplay or GSAP issue traps the guest.
- **Document-lock cleanup spread across effects:** Overflow and Lenis recovery should be centralized so failure or manual escape cannot leave scroll deadlocked.
- **Section coupling through mount side effects:** Adding new sections should not require editing bootstrap behavior each time.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scrolling lifecycle | Custom RAF scroll engine for this phase | Existing Lenis integration | The repo already depends on Lenis and the main hardening need is lifecycle cleanup, not a new scroller |
| Cinematic reveal orchestration | Ad hoc chained timeouts | Existing GSAP timelines | GSAP already coordinates intro reveal and pinned sections consistently |
| Deferred asset triggers | Manual scroll polling | `IntersectionObserver` plus existing asset loader | Browser observer APIs are simpler and cheaper than custom scroll watchers |
| Shared boot state | Local component prop chains for every preload flag | Existing Zustand app store | Boot phase, progress, errors, and Lenis instance are already centralized |

**Key insight:** Phase 1 should simplify orchestration, not expand infrastructure. Most of the risk comes from how existing tools are connected, not from missing libraries.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Scroll Deadlock After a Partial Intro Failure
**What goes wrong:** The page remains non-scrollable because document overflow is hidden and Lenis is stopped, but the success callback never fires.
**Why it happens:** `IntroSection` currently restores scroll only in its reveal timeline completion or unmount cleanup.
**How to avoid:** Use one shared intro-exit cleanup path that runs for autoplay failure, manual escape, reveal success, and component unmount.
**Warning signs:** Video error or skipped playback leaves the page stuck at the top with no scroll.

### Pitfall 2: Late Sections Quietly Re-Introduce Long Boot Times
**What goes wrong:** New assets added in later phases make initial loading slower because `useAppBootstrap` keeps registering everything globally.
**Why it happens:** The current registry has no preload tiers, and `AssetLoader.loadAll()` is sequential.
**How to avoid:** Define preload scope up front in Phase 1 and require new sections to declare whether their assets are blocking or deferred.
**Warning signs:** Boot time increases every time a new section is added, even when that section is far below the fold.

### Pitfall 3: Escape CTA Appears Too Early or Too Late
**What goes wrong:** The CTA either ruins the cinematic opening immediately or shows up so late that it fails its reliability job.
**Why it happens:** Skip timing is treated as visual polish instead of a recovery requirement.
**How to avoid:** Tie CTA visibility to a short explicit timer after intro readiness, and ensure it still appears if video events never fire.
**Warning signs:** CTA is gated by `loadeddata` or `ended`, or is absent when autoplay fails.

### Pitfall 4: Story Unlock Feels Abrupt
**What goes wrong:** Guests escape the intro and are snapped into a different scroll position or see sections pop in harshly.
**Why it happens:** Unlock is treated as a boolean mount event with no transition design.
**How to avoid:** Preserve the intro shell long enough to hand off naturally, then release scroll and reveal the next section with continuity.
**Warning signs:** `scrollTo` jump hacks or immediate unmount of the intro shell.

### Pitfall 5: Mobile Rendering Costs Move from Boot to Scroll Jank
**What goes wrong:** Initial entry becomes faster, but pinned sections and heavy assets still create stutter once the guest scrolls.
**Why it happens:** Deferred loading is added without checking downstream section readiness on mobile.
**How to avoid:** Pair preload scoping with mobile smoke tests through intro, firsts, and long-distance, and preload slightly ahead of approach rather than exactly on intersection.
**Warning signs:** First visit becomes fast, but the first entry into `FirstsJourneySection` or `LongDistanceJourneySection` stalls.
</common_pitfalls>

<code_examples>
## Code Examples

These are repo-native patterns to preserve while hardening the flow.

### Scoped Bootstrap Ownership
```js
// Existing pattern in client/src/hooks/useAppBootstrap.js
const registry = new AssetRegistry();
registerIntroAssets(registry);
registerFirstsAssets(registry);
registerLongDistanceAssets(registry);
const loader = new AssetLoader(registry);
```

Planning implication:
- Keep `useAppBootstrap` as the orchestration owner.
- Change what gets registered before `BOOT_PHASE.READY`, not where bootstrap lives.

### Existing Story Gate
```jsx
// Existing pattern in client/src/sections/StoryRoot.jsx
<IntroSection
  isBootReady={isBootReady}
  onSequenceComplete={() => {
    setIsIntroComplete(true);
  }}
/>
{isIntroComplete ? <FirstsJourneySection /> : null}
{isIntroComplete ? <LongDistanceJourneySection /> : null}
```

Planning implication:
- Keep `StoryRoot` as the gatekeeper.
- Replace `isIntroComplete` with a broader unlock state that covers manual escape and fallback completion.

### Existing Intro Lock Surface
```js
// Existing pattern in client/src/sections/intro/IntroSection.jsx
lenisInstance.stop();
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';
document.body.style.touchAction = 'none';
```

Planning implication:
- Keep lock control local to the intro.
- Centralize the unlock cleanup path so every exit mode restores the page safely.
</code_examples>

## Validation Architecture

Phase 1 needs both interaction verification and regression protection. The plan should include lightweight automated checks where feasible and explicit manual/mobile scenarios for the cinematic flow.

### Required user journeys
- **STORY-01:** Fresh visit, autoplay works, reveal completes, guest reaches firsts and long-distance sections.
- **STORY-01:** Fresh visit, autoplay fails or video errors, polished fallback appears, guest can still continue.
- **STORY-01:** Fresh visit, guest uses escape CTA after the short delay, story unlocks without deadlock.
- **STORY-02 / QUAL-01:** Mobile viewport walkthrough from loading screen through intro, firsts, and long-distance without blocked scrolling or inaccessible primary content.
- **QUAL-02:** Compare initial entry before and after scoping preload to confirm lower-section assets no longer gate `BOOT_PHASE.READY`.

### Practical verification hooks
- Add deterministic intro states that can be forced in development, such as autoplay failure and video error, so planners can test escape and fallback paths without changing production code.
- Instrument bootstrap timing around `BOOT_PHASE.PRELOADING` to `BOOT_PHASE.READY` and log which asset group is responsible for blocking.
- Verify that document overflow, touch action, and Lenis state are restored after every intro exit path.
- Verify that downstream sections can mount after unlock even if deferred media is still loading.

### Suggested test split
- **Manual mobile smoke tests:** iPhone-size and Android-size viewport, fresh load, slow network emulation, autoplay failure path, rotate-device check, scroll continuity after intro exit.
- **Component/integration checks:** Intro exit handler calls unlock and cleanup on video end, manual escape, and error/fallback paths.
- **Performance checks:** Measure boot duration and confirm GLB and lower-section image requests start after boot or on approach instead of in the critical preload.

### Exit criteria for this phase
- No intro failure mode leaves the page permanently locked.
- The story can always be entered by successful playback, fallback completion, or visible manual escape.
- Initial boot only depends on intro-critical assets.
- Mobile walkthrough across current story sections remains usable and visually coherent.

<open_questions>
## Open Questions

1. **Should intro blocking require full video data or only enough readiness to attempt playback?**
   - What we know: The current intro preloader waits on `loadeddata` for the intro video.
   - What's unclear: Whether a lighter readiness target would preserve polish while reducing entry delay on mobile.
   - Recommendation: Decide during planning whether the blocking contract is "video playable enough to start" or "video fully ready for the existing reveal timing," then keep fallback still available either way.

2. **Where should deferred loading begin for firsts and long-distance?**
   - What we know: User direction says later assets should load on approach, not at initial boot.
   - What's unclear: The exact threshold that balances responsiveness with mobile bandwidth.
   - Recommendation: Plan for one configurable proximity threshold per section and validate it on real mobile hardware or throttled devtools before locking numbers.

3. **Should story composition move fully into `sectionRegistry` in this phase or only be prepared for it?**
   - What we know: A registry utility already exists, but `StoryRoot` still mounts sections manually.
   - What's unclear: Whether Phase 1 needs full registry adoption to satisfy maintainability, or only a lighter refactor that separates unlock logic from section wiring.
   - Recommendation: Prefer the smallest change that reduces fragile coupling now, with full section-registry composition only if planning shows it is low-risk.
</open_questions>

<sources>
## Sources

### Primary
- `.planning/phases/01-boot-and-story-hardening/01-CONTEXT.md` - locked phase decisions and boundaries
- `.planning/REQUIREMENTS.md` - STORY-01, STORY-02, QUAL-01, QUAL-02 targets
- `.planning/ROADMAP.md` - phase goal and success criteria
- `.planning/research/SUMMARY.md` - project-wide brownfield guidance and known risks
- `client/src/hooks/useAppBootstrap.js` - current global preload and boot readiness flow
- `client/src/sections/intro/IntroSection.jsx` - current intro playback, lock, and reveal lifecycle
- `client/src/sections/StoryRoot.jsx` - current story unlock and mount behavior
- `client/src/components/loading/LoadingScreen.jsx` - branded loading screen behavior
- `client/src/services/assets/assetRegistry.js` - preload registration surface
- `client/src/services/assets/assetLoader.js` - current sequential asset loading behavior
- `client/src/sections/intro/introAssets.js` - intro-critical asset definitions
- `client/src/sections/firsts/firstsJourneyAssets.js` - currently over-scoped preload assets
- `client/src/sections/distance/longDistanceJourneyAssets.js` - currently over-scoped preload assets
- `client/package.json` - installed library versions
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: React/Vite boot orchestration with GSAP and Lenis
- Ecosystem: Existing client stack only
- Patterns: Tiered preload, intro fallback state machine, unlock handshake, deferred section hydration
- Pitfalls: Scroll deadlock, preload creep, abrupt unlock, mobile jank

**Confidence breakdown:**
- Standard stack: HIGH - the phase stays within installed dependencies
- Architecture: HIGH - the main integration points are already present in the brownfield codebase
- Pitfalls: HIGH - failure modes are directly visible in current code
- Code examples: HIGH - examples come from the local implementation

**Research date:** 2026-03-13
**Valid until:** 2026-04-12
</metadata>

---
*Phase: 01-boot-and-story-hardening*
*Research completed: 2026-03-13*
*Ready for planning: yes*
