---
phase: 1
slug: boot-and-story-hardening
status: ready
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-13
---

# Phase 1 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none - Wave 0 installs `vitest` + jsdom + React Testing Library in `client/` |
| **Config file** | none - Wave 0 creates client Vitest config and setup |
| **Quick run command** | `npm --prefix client run test -- --run --pool=threads` |
| **Full suite command** | `npm --prefix client run test -- --run` |
| **Estimated runtime** | ~20-40 seconds after Wave 0 setup |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix client run test -- --run --pool=threads`
- **After every plan wave:** Run `npm --prefix client run test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | QUAL-02 | setup verification | `npm --prefix client run test -- --run --pool=threads` | ❌ W0 | pending |
| 01-01-02 | 01 | 1 | QUAL-02, STORY-02 | unit/integration | `npm --prefix client run test -- --run` | ❌ W0 | pending |
| 01-01-03 | 01 | 1 | QUAL-02, STORY-02 | unit/integration | `npm --prefix client run test -- --run --pool=threads` | ❌ W0 | pending |
| 01-02-01 | 02 | 2 | STORY-01, QUAL-01 | unit/integration + manual | `npm --prefix client run test -- --run --pool=threads` | ❌ W0 | pending |
| 01-02-02 | 02 | 2 | STORY-02, QUAL-01 | manual smoke + targeted automated checks | `npm --prefix client run test -- --run --pool=threads StoryRoot` | ❌ W0 | pending |
| 01-02-03 | 02 | 2 | STORY-01, STORY-02, QUAL-01, QUAL-02 | regression suite | `npm --prefix client run test -- --run` | ❌ W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `client/package.json` - add `test` script for Vitest
- [ ] `client/vitest.config.js` or equivalent - configure jsdom test environment
- [ ] `client/src/test/setup.js` or equivalent - shared testing setup
- [ ] `client/src/**/*.test.*` - initial coverage for intro exit logic and bootstrap gating
- [ ] `client/` install `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/jest-dom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Loading screen still feels cinematic without delaying all downstream assets | QUAL-02 | Visual timing and emotional feel are subjective | Open the site on a mobile viewport, compare first entry timing and confirm the loading moment remains branded but not blocked by lower sections |
| Romantic escape CTA appears after a short beat and feels intentional | STORY-01 | Tone and timing cannot be judged well by automated tests | Load the intro on mobile viewport, wait for CTA appearance, confirm it is visible, readable, and tonally aligned |
| Video failure degrades to a polished still/final-frame state | STORY-01 | Requires visual confirmation of fallback design | Force autoplay/video failure in development and confirm fallback state looks intentional before continuing |
| Story unlock drops naturally into the story start without abrupt snap | STORY-02, QUAL-01 | Scroll continuity is best judged by human interaction | Exit the intro through both autoplay completion and manual escape, then verify firsts section becomes available without jarring jump |
| Long-distance and firsts remain usable after deferred asset loading changes | STORY-02, QUAL-01 | Downstream performance and motion continuity need end-to-end observation | Scroll through the invitation on phone-sized viewports after hardening changes and confirm pinned sections still behave correctly |

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-13
