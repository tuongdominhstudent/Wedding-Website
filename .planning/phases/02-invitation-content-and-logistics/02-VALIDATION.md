---
phase: 2
slug: invitation-content-and-logistics
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-13
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + jsdom + React Testing Library |
| **Config file** | `client/vitest.config.js` |
| **Quick run command** | `npm --prefix client run test -- --run --pool=threads` |
| **Full suite command** | `npm --prefix client run test -- --run` |
| **Estimated runtime** | ~20-45 seconds |

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
| 02-01-01 | 01 | 1 | STORY-03 | component/integration | `npm --prefix client run test -- --run --pool=threads` | ✅ | pending |
| 02-01-02 | 01 | 1 | STORY-03, STORY-04 | unit/integration | `npm --prefix client run test -- --run` | ✅ | pending |
| 02-01-03 | 01 | 1 | STORY-03, STORY-04 | regression | `npm --prefix client run test -- --run --pool=threads` | ✅ | pending |
| 02-02-01 | 02 | 2 | EVENT-01, EVENT-02, EVENT-03 | component/integration + manual | `npm --prefix client run test -- --run --pool=threads` | ✅ | pending |
| 02-02-02 | 02 | 2 | GIFT-01, EVENT-03 | component/integration + manual | `npm --prefix client run test -- --run --pool=threads` | ✅ | pending |
| 02-02-03 | 02 | 2 | EVENT-01, EVENT-02, EVENT-03, GIFT-01 | full regression + build | `npm --prefix client run test -- --run && npm --prefix client run build` | ✅ | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Prewedding section feels like a natural continuation after `long-distance` | STORY-03 | Story pacing and emotional continuity are visual/subjective | Scroll from `long-distance` into prewedding on a mobile viewport and confirm the transition feels intentional rather than like a detached media block |
| Calendar/photo section clearly bridges cinematic content into invitation information | STORY-04 | The effectiveness of the visual bridge depends on human reading and pacing | On a phone-sized viewport, verify the wedding date is visually obvious and the section prepares the guest for logistics rather than duplicating it |
| Logistics section is easy to scan and use on mobile | EVENT-01, EVENT-02, EVENT-03 | Readability, hierarchy, and tap clarity are best judged directly | Check that date/time and venue/address/map read as two clear blocks and that the map CTA is immediately understandable |
| QR gifting section feels distinct from logistics and remains easy to access | GIFT-01 | Section separation and emotional tone are product-feel concerns | Scroll from logistics into QR and verify the gifting section reads as its own destination rather than a footer add-on |

---

## Validation Sign-Off

- [x] All tasks have automated verify or existing infrastructure coverage
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-13
