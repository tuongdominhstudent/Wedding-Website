---
task_id: 260325-k2c
type: quick
status: complete
completed_date: 2026-03-25
duration_minutes: ~5
files_created:
  - client/src/components/SectionBand/SectionBand.jsx
  - client/src/components/SectionBand/SectionBand.module.css
files_modified:
  - client/src/sections/StoryRoot.jsx
key_decisions:
  - Added React import to SectionBand.jsx because project test environment (Vitest + jsdom) requires explicit React in scope for JSX components
  - Used two identical track spans with translateX(-50%) CSS animation for seamless loop without JS
  - Used React.Fragment keyed on section id to insert the Yeu Xa band before long-distance without breaking the map key requirement
---

# Phase quick Plan k2c: Add Moving Marquee Section Bands Summary

**One-liner:** Reusable CSS marquee band component rendering scrolling uppercase serif text inserted between intro/firsts and firsts/long-distance story sections.

## What Was Built

A `SectionBand` component renders a 72px white horizontal band containing a seamlessly looping marquee of uppercase text. Two instances are wired into `StoryRoot.jsx`:

1. `"Những Cái Đầu Tiên"` — appears after IntroSection once `isStoryUnlocked` is true
2. `"Yêu Xa"` — appears immediately before the `long-distance` section via `React.Fragment` inside `storySections.map`

The marquee technique uses two identical `<span>` elements side-by-side inside a flex track, animated with `translateX(-50%)`. When the track has shifted by exactly half its width (one full span), it snaps back to 0 — creating an infinite seamless loop with no JavaScript timing required.

## Files Modified

| File | Change |
|------|--------|
| `client/src/components/SectionBand/SectionBand.jsx` | Created — reusable marquee band component |
| `client/src/components/SectionBand/SectionBand.module.css` | Created — CSS module with @keyframes marquee + reduced-motion support |
| `client/src/sections/StoryRoot.jsx` | Modified — import + two SectionBand instances in story flow |

## Key Decisions

1. **Explicit React import in SectionBand.jsx** — The project's Vitest environment does not use the automatic JSX runtime transform. All other existing components in the codebase (e.g., StoryRoot.jsx) have `import React from 'react'` at the top. Adding it to SectionBand.jsx was required to prevent a `ReferenceError: React is not defined` crash in tests.

2. **CSS-only animation** — No GSAP used. The marquee is a pure CSS `@keyframes` loop. This keeps the band lightweight and outside the GSAP ScrollTrigger lifecycle, appropriate since bands are static divs between sections rather than scroll-driven scenes.

3. **`React.Fragment` keyed on section id** — The `storySections.map` already uses `key={id}`. Wrapping `[SectionBand + Component]` in `<React.Fragment key={id}>` keeps the key where React expects it (on the outermost element of each map iteration) without adding an extra DOM wrapper element.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Missing React import in SectionBand.jsx**
- **Found during:** Task 2 verification (test run)
- **Issue:** SectionBand.jsx used JSX without `import React from 'react'`, causing `ReferenceError: React is not defined` in Vitest/jsdom environment
- **Fix:** Added `import React from 'react'` as the first line of SectionBand.jsx
- **Files modified:** `client/src/components/SectionBand/SectionBand.jsx`
- **Commit:** included in final commit

## Self-Check: PASSED

- `client/src/components/SectionBand/SectionBand.jsx` — FOUND
- `client/src/components/SectionBand/SectionBand.module.css` — FOUND
- StoryRoot tests: 1 passed
