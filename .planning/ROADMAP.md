# Roadmap: Wedding Card

**Created:** 2026-03-13
**Mode:** interactive
**Granularity:** standard
**Parallelization:** true

## Overview

This roadmap completes the current brownfield v1 milestone for the wedding invitation site. It prioritizes guest-critical reliability and mobile usability before higher-risk interactive features, while preserving the existing cinematic section architecture.

## Phase Summary

| Phase | Name | Goal | Requirements |
|-------|------|------|--------------|
| 1 | Boot and Story Hardening | Make the invitation reliably enterable and maintainable as more sections are added | STORY-01, STORY-02, QUAL-01, QUAL-02 |
| 2 | Invitation Content and Logistics | Complete the guest-facing invitation sections and logistics content for v1 | STORY-03, STORY-04, EVENT-01, EVENT-02, EVENT-03, GIFT-01 |
| 3 | Guestbook Persistence Foundation | Finalize the persisted guest wish flow and backend contract for public launch | GUEST-01, GUEST-03 |
| 4 | Photobooth Capture Flow | Add in-browser photo capture with graceful fallback and submission integration | GUEST-02 |
| 5 | Polaroid Gallery and Launch Hardening | Turn persisted submissions into a polished gallery and verify launch readiness | GUEST-04 |

## Phases

### Phase 1: Boot and Story Hardening

**Goal:** Ensure guests can always enter and use the invitation on mobile even when autoplay, preload, or heavy media behave imperfectly.

**Requirements:** STORY-01, STORY-02, QUAL-01, QUAL-02

**Success Criteria:**
1. Guest can always progress past the intro through skip, fallback, or successful autoplay path.
2. Core invitation flow remains usable on mobile without scroll deadlock or blocked primary actions.
3. Initial loading is scoped so late sections do not unnecessarily delay first interaction.
4. Story composition is structured cleanly enough that remaining sections can be added without fragile cross-section coupling.

**Notes:**
- This phase reduces the known risks already identified in codebase concerns and research.
- It should happen before adding more media-heavy sections.

### Phase 2: Invitation Content and Logistics

**Goal:** Complete the remaining v1 invitation sections so guests can understand the wedding details and experience the intended story.

**Requirements:** STORY-03, STORY-04, EVENT-01, EVENT-02, EVENT-03, GIFT-01

**Success Criteria:**
1. Guest can watch the prewedding video section using the intended asset.
2. Guest can view the wedding-photo and calendar-date design section as part of the story flow.
3. Guest can read the date, time, and venue details clearly on mobile.
4. Guest can open or view map directions from the invitation without confusion.
5. Guest can access the wedding gift QR section on mobile.

**Notes:**
- This phase delivers the main visible v1 completeness.
- Prefer simple, reliable map integration over custom interaction.

### Phase 3: Guestbook Persistence Foundation

**Goal:** Make guest wishes a stable public-facing feature with real persistence and safe request handling.

**Requirements:** GUEST-01, GUEST-03

**Success Criteria:**
1. Guest can submit a name and text wish successfully through the public interface.
2. Submitted wishes persist to the backend and remain available after refresh.
3. Data validation and payload handling are clear enough to support later photo submissions.
4. Basic public-endpoint protection exists to reduce spam or abusive submissions.

**Notes:**
- This phase should decide the long-term guest-entry shape before camera capture is layered on top.
- It is the backend contract phase for the rest of guest interaction.

### Phase 4: Photobooth Capture Flow

**Goal:** Add a reliable guest photo capture flow that integrates into the existing wish submission path.

**Requirements:** GUEST-02

**Success Criteria:**
1. Guest can grant camera access and capture a photo directly in the browser on supported mobile devices.
2. Guest can still participate through an image-upload fallback if camera access is denied or unavailable.
3. Captured or uploaded photo can be submitted with the guest wish through the backend contract established earlier.
4. Permission, secure-origin, and capture failure states are handled without dead-ending the guest.

**Notes:**
- This is the highest integration-risk phase because it depends on browser APIs, device behavior, and upload handling.
- It should follow the persistence foundation rather than defining storage ad hoc.

### Phase 5: Polaroid Gallery and Launch Hardening

**Goal:** Display guest photo wishes as part of the invitation and close the final launch-readiness gaps.

**Requirements:** GUEST-04

**Success Criteria:**
1. Guest can see submitted photo wishes displayed in a polaroid-style layout on the website.
2. Gallery loading remains mobile-friendly and does not degrade the full invitation experience.
3. End-to-end guest submission flow is verified from creation to public display.
4. A launch checklist confirms invitation clarity, map access, QR usability, guestbook persistence, and cross-device mobile readiness.

**Notes:**
- This phase turns the interaction system into a polished visible outcome.
- It should use real persisted data from earlier phases, not mock-only gallery behavior.

## Coverage

- Total v1 requirements: 14
- Requirements mapped: 14
- Unmapped requirements: 0

## Ordering Rationale

1. Phase 1 comes first because the invitation is not trustworthy if guests can be trapped in intro or preload states.
2. Phase 2 comes next because event clarity and visible invitation completeness matter more than interaction extras.
3. Phase 3 must happen before camera capture so the backend contract is stable first.
4. Phase 4 depends on Phase 3 for storage and submission design.
5. Phase 5 finishes with real gallery display and launch hardening against actual end-to-end flows.

---
*Last updated: 2026-03-13 after roadmap creation*
