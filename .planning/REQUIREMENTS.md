# Requirements: Wedding Card

**Defined:** 2026-03-13
**Core Value:** Guests can smoothly experience a premium wedding invitation on mobile, understand the event details clearly, and leave a personal photo wish that becomes part of the story.

## v1 Requirements

### Story Experience

- [ ] **STORY-01**: Guest can progress from the opening experience into the rest of the invitation even if video autoplay fails or is skipped
- [ ] **STORY-02**: Guest can view the completed story flow on mobile, including the existing intro, firsts, and long-distance sections plus the remaining v1 sections
- [ ] **STORY-03**: Guest can view a dedicated prewedding video section using `preweddingVideo.webm`
- [ ] **STORY-04**: Guest can view additional wedding-photo content presented with an elegant wedding-date calendar design

### Event Details

- [ ] **EVENT-01**: Guest can see the wedding date, time, and primary celebration details in a clear mobile-readable section
- [ ] **EVENT-02**: Guest can see the wedding venue address in text form without depending on animation to read it
- [ ] **EVENT-03**: Guest can open or view a venue map from the invitation on mobile

### Guestbook

- [ ] **GUEST-01**: Guest can enter their name and a written wedding wish and submit it successfully
- [ ] **GUEST-02**: Guest can capture a photo directly in the browser for their wish, or use a fallback image-input flow if camera permission is unavailable
- [ ] **GUEST-03**: Guest submissions are persisted to the backend and remain visible after page refresh or later visits
- [ ] **GUEST-04**: Guest can see submitted photo wishes displayed on the website in a polaroid-style presentation

### Gifting

- [ ] **GIFT-01**: Guest can view a wedding gift QR section that is easy to access on mobile

### Quality

- [ ] **QUAL-01**: Guest can use the full invitation on mobile with smooth scrolling and transitions that do not block core actions
- [ ] **QUAL-02**: Guest-facing media loading keeps initial entry responsive enough that the invitation does not feel stalled before use

## v2 Requirements

### Operations

- **OPS-01**: Couple can moderate, hide, or remove guest submissions through an admin workflow
- **OPS-02**: Couple can update invitation content through a CMS-style editing interface instead of code changes

### Guest Experience

- **GEXP-01**: Guest can see real-time updates when new wishes are submitted
- **GEXP-02**: Guest can sign in or manage a personal guest profile
- **GEXP-03**: Guest can access expanded 3D or highly interactive showcase experiences beyond the core invitation flow

## Out of Scope

| Feature | Reason |
|---------|--------|
| Admin dashboard for v1 | Not requested for the milestone and would expand backend scope too far |
| Authentication or guest accounts | Adds friction and is not necessary for a wedding invitation experience |
| Real-time guest wall updates | Extra complexity without being required for the core v1 launch |
| Heavy custom map interactions | A simple map embed or handoff is enough for guest logistics |
| Full CMS/content management system | Content should stay easy to edit in code for now rather than introducing a new product surface |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| STORY-01 | Phase TBD | Pending |
| STORY-02 | Phase TBD | Pending |
| STORY-03 | Phase TBD | Pending |
| STORY-04 | Phase TBD | Pending |
| EVENT-01 | Phase TBD | Pending |
| EVENT-02 | Phase TBD | Pending |
| EVENT-03 | Phase TBD | Pending |
| GUEST-01 | Phase TBD | Pending |
| GUEST-02 | Phase TBD | Pending |
| GUEST-03 | Phase TBD | Pending |
| GUEST-04 | Phase TBD | Pending |
| GIFT-01 | Phase TBD | Pending |
| QUAL-01 | Phase TBD | Pending |
| QUAL-02 | Phase TBD | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 0
- Unmapped: 14

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-03-13 after initialization*
