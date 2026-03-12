# Phase 1: Boot and Story Hardening - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the invitation reliably enterable and maintainable as more sections are added. This phase covers intro escape behavior, preload scope, story unlock behavior, and mobile-first hardening of the existing opening flow. It does not add new invitation sections, guestbook capabilities, or photobooth functionality.

</domain>

<decisions>
## Implementation Decisions

### Intro escape path
- Guests must have a visible way to escape the opening if the video or reveal sequence misbehaves.
- The escape action should appear after a short beat, not immediately and not only after hard failure.
- The escape action should use romantic or story-aligned copy rather than blunt utilitarian copy.
- If playback fails completely, the intro should degrade into a polished still or final-frame state before guests continue.

### Loading budget
- Only intro-critical assets should be allowed to block initial entry into the site.
- Later-section assets should load on approach rather than delaying initial entry.
- The loading screen should still feel cinematic and branded, not purely utilitarian.
- The loading moment can be noticeable on mobile, but should not depend on broad preload of downstream sections.
- Loading communication should prioritize mood first; progress can remain subtle rather than dominant.

### Story unlock behavior
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

</decisions>

<specifics>
## Specific Ideas

- The opening should remain branded and emotionally intentional, not become a raw technical fallback.
- A visible escape path matters because the current app hard-locks scroll and waits for intro completion to reveal the rest of the site.
- The loading experience should stay atmospheric even after reducing the amount of critical preload.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `client/src/hooks/useAppBootstrap.js`: central bootstrap flow for Lenis startup, GSAP initialization, asset registration, and preload completion.
- `client/src/sections/intro/IntroSection.jsx`: owns intro playback, reveal sequencing, scroll lock, and `onSequenceComplete` handoff.
- `client/src/sections/StoryRoot.jsx`: gates later sections behind intro completion, so it is the main integration point for story unlock changes.
- `client/src/components/loading/LoadingScreen.jsx`: existing loading-screen surface for branded preload behavior.
- `client/src/services/assets/assetRegistry.js` and `client/src/services/assets/assetLoader.js`: existing asset registration and loading mechanism that can be re-scoped.

### Established Patterns
- Bootstrap state is centralized in `useAppStore` and already tracks `bootPhase`, `bootProgress`, Lenis instance, and error state.
- The current preload path registers intro, firsts, and long-distance assets up front and waits for all of them before setting `BOOT_PHASE.READY`.
- `IntroSection` currently stops Lenis, locks document overflow, and only releases the rest of the experience when the reveal timeline completes.
- `StoryRoot` currently preserves a strict ordering: intro first, then firsts and long-distance only after intro completion.

### Integration Points
- Intro escape handling will need to connect `IntroSection` and `StoryRoot` so explicit exit can unlock the story without requiring the full reveal path.
- Preload hardening will likely touch `registerIntroAssets`, `registerFirstsAssets`, `registerLongDistanceAssets`, and the timing logic in `useAppBootstrap`.
- Loading-screen behavior should continue to read from the existing boot store rather than inventing a second preload state model.
- Any story-unlock adjustment should preserve compatibility with the existing `FirstsJourneySection` and `LongDistanceJourneySection` mount assumptions.

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---
*Phase: 01-boot-and-story-hardening*
*Context gathered: 2026-03-13*
