---
phase: quick
plan: 260325-jw9
subsystem: client/sections
tags: [css, animation, blend, intro, firsts, gradient]
dependency_graph:
  requires: []
  provides: [seamless-intro-firsts-transition]
  affects: [client/src/sections/intro/IntroSection.module.css, client/src/sections/firsts/FirstsJourneySection.module.css]
tech_stack:
  added: []
  patterns: [CSS mask-image fade, gradient boundary matching]
key_files:
  created: []
  modified:
    - client/src/sections/intro/IntroSection.module.css
decisions:
  - Fade DarkVeil .backgroundEffect bottom with mask-image rather than adjusting shader opacity to preserve visual above the fold
  - Match bottom gradient stop to firsts section top color (#3a0817) as the single source of truth for boundary color
metrics:
  duration: ~5 minutes
  completed: 2026-03-25
  tasks_completed: 1
  files_changed: 1
---

# Phase quick Plan 260325-jw9: Blend Intro and Firsts Section Background Summary

CSS-only gradient boundary match and DarkVeil fade-out so the intro-to-firsts scroll feels like one continuous dark scene.

## What Was Done

The intro section ended at `#2d000f` while the firsts section started at `#3a0817`, creating a perceptible color jump on scroll. The DarkVeil shader overlay (`.backgroundEffect`) also had a hard rectangular boundary at the bottom of the intro.

Two targeted CSS changes in `IntroSection.module.css`:

1. **Gradient bottom stop updated** — Changed `linear-gradient(180deg, #2a0010 0%, #3a0214 52%, #2d000f 100%)` to `linear-gradient(180deg, #2a0010 0%, #3a0214 52%, #3a0817 100%)`. The intro now exits at exactly the same color the firsts section enters at.

2. **DarkVeil mask-image fade added** — Added `mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%)` and `-webkit-mask-image` vendor prefix to `.backgroundEffect`. The shader is fully opaque through 70% of the section then fades out, letting the underlying gradient show through at the bottom — eliminating the hard rectangular edge.

`FirstsJourneySection.module.css` required no changes; its top stop was already `#3a0817`.

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Task | Description | Hash |
|------|-------------|------|
| 1 | Harmonize intro-firsts gradient boundary and fade DarkVeil edge | 84bdff3 |

## Self-Check: PASSED

- `client/src/sections/intro/IntroSection.module.css` modified: FOUND
- Commit `84bdff3` exists: FOUND
- Build succeeds: CONFIRMED (built in 5.76s)
