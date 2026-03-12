# Wedding Card

## What This Is

This is a mobile-first cinematic wedding invitation website for wedding guests, built as a one-page story experience with layered animation, video, imagery, and selective 3D. The current product already has the opening story flow and part of the long-distance section; the current milestone is to complete version 1 with the remaining invitation content, guest interaction, and polished mobile delivery.

## Core Value

Guests can smoothly experience a premium wedding invitation on mobile, understand the event details clearly, and leave a personal photo wish that becomes part of the story.

## Requirements

### Validated

- ✓ Intro loading and opening video flow already exist in the client experience — existing
- ✓ Story sections for first photo reveal and "firsts" journey are already implemented — existing
- ✓ Long-distance journey section exists and is partially implemented through the wedding banner stage — existing
- ✓ Backend API for creating and listing wishes already exists with SQLite persistence — existing

### Active

- [ ] Complete the remaining v1 sections one by one instead of attempting a large simultaneous rebuild
- [ ] Add a prewedding video section using `preweddingVideo.webm` from the assets folder
- [ ] Add additional wedding photo sections with an elegant wedding-date calendar design
- [ ] Add clear event information for the wedding ceremony or reception, including address details
- [ ] Add an embedded or clearly integrated map section so guests can locate the venue easily on mobile
- [ ] Build a web photobooth flow where guests can take a photo, write a wish, and submit it
- [ ] Persist photobooth submissions and wishes to the backend so other guests can see them later
- [ ] Display submitted guest photos and wishes as a polaroid-style showcase on the website
- [ ] Add a wedding gift QR section
- [ ] Keep the overall experience mobile-first, smooth, luxurious, and easy to update with new content later

### Out of Scope

- Admin moderation or back-office tooling for managing wishes — not requested for v1
- Authentication or guest accounts — not needed for the invitation experience
- Social sharing or broader platform/community features — outside the core wedding invitation goal

## Context

The repository is a brownfield project with a Vite/React frontend and an Express/SQLite backend. The frontend already uses GSAP, Lenis, React Three Fiber, and section-based composition to deliver a cinematic one-page story, while the backend already supports a lightweight wishes domain. The active milestone is not to redesign the whole product, but to finish version 1 by completing the missing invitation sections and connecting guest interaction to real persistence. Content will likely keep changing throughout development, so section architecture and copy/media wiring should stay easy to edit after launch prep.

## Constraints

- **Tech stack**: Keep the existing React + Vite frontend and Express + SQLite backend — the repo already has working patterns and persistence for wishes
- **Delivery approach**: Build section by section — the user explicitly wants incremental completion rather than a full rewrite
- **Experience**: Mobile-first presentation is mandatory — most guests will likely view the invitation on phones
- **Visual quality**: Animations should feel smooth and luxurious — this is a core product expectation, not optional polish
- **Content operations**: Content must remain easy to adjust later — section data and media integration should avoid hard-to-edit implementation
- **Scope discipline**: v1 should focus on the invitation, event information, wishes, and QR flow — avoid expanding into non-essential systems

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize v1 around guest-facing invitation clarity on mobile | The main audience is wedding guests, and v1 is considered done when core sections are live and usable on mobile | - Pending |
| Complete the remaining experience section by section | The user wants controlled incremental delivery and easier iteration | - Pending |
| Include a real photobooth-to-wish flow with backend persistence | Guest interaction is part of the target v1 scope, and wishes must be saved for later viewing | - Pending |
| Use `preweddingVideo.webm` as the prewedding video asset | The content source is already chosen and should anchor the prewedding section implementation | - Pending |

---
*Last updated: 2026-03-13 after initialization*
