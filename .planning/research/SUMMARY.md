# Project Research Summary

**Project:** Wedding Card
**Domain:** Mobile-first cinematic wedding invitation website
**Researched:** 2026-03-13
**Confidence:** HIGH

## Executive Summary

This project is a brownfield wedding invitation SPA, not a greenfield product search. The repo already has the core storytelling shell, intro flow, partial long-distance sequence, and a working wishes API. The recommended approach is to finish v1 by extending the existing section-based React architecture and thin Express plus SQLite backend instead of introducing a rewrite, a CMS, or heavier infrastructure.

Roadmap priority should favor guest-critical outcomes first: reliable intro and boot behavior, complete invitation content, clear logistics, and persisted wishes. The highest-risk work is the media-heavy photobooth flow because it depends on secure-origin camera access, upload handling, mobile performance, and schema decisions. The safest path is to ship the invitation and guestbook first, then layer camera capture and gallery polish after the persistence model is stable.

## Key Findings

### Recommended Stack

Keep the current stack: React 18 plus Vite on the client, Express 4 plus better-sqlite3 on the server, GSAP and Lenis for the cinematic feel, and selective React Three Fiber only where it already adds value. For v1 additions, `multer` is the only clear backend dependency for multipart image uploads; `sharp` is optional after measuring payload size and gallery cost.

**Core technologies:**
- React + Vite: existing SPA foundation for section-based storytelling without rewrite cost.
- Express + SQLite: sufficient backend and persistence for low-volume guest submissions.
- GSAP + Lenis: preserve premium motion, but keep mobile performance ahead of spectacle.
- Browser `getUserMedia` + Canvas API: preferred photobooth path, with upload fallback for denied permission or HTTPS gaps.
- Google Maps Embed: lowest-risk venue map integration for v1.

### Expected Features

Launch value is defined by practical invitation completeness on mobile, not by extra systems. The current research consistently ranks correct content, event details, map access, smooth scroll behavior, persisted wishes, and the gift QR as the real v1 surface. Prewedding video, minimal guest gallery, and camera capture are worthwhile but must not delay stability.

**Must have:**
- Completed invitation story with finalized content and media.
- Event details, address clarity, and mobile map access.
- Smooth mobile-first performance and reliable intro progression.
- Persisted wishes that can be viewed again.
- Wedding gift QR section.

**Should have:**
- Prewedding video section using the chosen asset.
- Minimal guest gallery proving submissions are part of the experience.
- Camera photobooth flow if mobile reliability is acceptable.

**Defer:**
- Admin or CMS tooling.
- Authentication or guest accounts.
- Real-time guest wall behavior.
- Heavy custom map or expanded 3D work.

### Architecture Approach

The architecture should stay section-oriented. Use an ordered section definition list to compose story sections, keep copy and media references in section-level config instead of inline JSX, isolate camera behavior inside photobooth-specific hooks, and keep frontend API calls in service modules. On the backend, either extend the existing wishes domain or choose a single guest-entry model early, but avoid parallel text-only and photo-entry models for long.

**Major components:**
1. Story composer: owns section order, mount policy, and unlock flow.
2. Section islands: own markup, local animation, and content wiring.
3. API and persistence layer: own validation, upload handling, and guest-entry storage.

### Critical Pitfalls

1. **Intro gating blocks the whole site**: add skip, timeout, and non-video unlock paths.
2. **Global preload grows startup latency**: keep only intro-critical assets in boot preload and lazy-load later media.
3. **Photobooth fails outside localhost**: plan for HTTPS, permission denial, and file-upload fallback from the start.
4. **Public wishes endpoint attracts abuse**: add validation, throttling, and basic operational controls before launch.
5. **Polished event details are not usable**: keep address, timing, and directions readable and tappable on mobile.

## Implications for Roadmap

### Phase 1: Boot and Story Hardening
**Rationale:** The invitation is unusable if guests cannot get past the intro or if startup time grows with each new section.
**Delivers:** Intro fallback behavior, preload scoping, ordered section composition, and stable mobile progression.
**Addresses:** Smooth mobile performance, reliable intro progression, maintainable section sequencing.
**Avoids:** Intro lock and global preload pitfalls.

### Phase 2: Invitation Content and Logistics
**Rationale:** Event clarity is the core product job and should ship before guest interaction extras.
**Delivers:** Prewedding video, remaining story sections, calendar/date section, event details, map embed/link, and gift QR.
**Uses:** Existing React/Vite section folders, GSAP, CSS modules, Google Maps Embed.
**Implements:** Section-island pattern with content/config split.

### Phase 3: Guestbook Persistence Foundation
**Rationale:** The photobooth and gallery should not start until the backend record model and safe submission path are stable.
**Delivers:** Final guest-entry schema decision, validation updates, persisted wish flow, and basic anti-abuse controls.
**Uses:** Express, better-sqlite3, Zod, optional `multer` if photo-capable endpoints are introduced here.
**Implements:** Thin route/controller/service chain with stable guest-entry storage.

### Phase 4: Photobooth Capture and Submission UX
**Rationale:** This is the highest integration-risk phase and depends on Phase 3 decisions.
**Delivers:** Camera capture flow, permission handling, secure-origin validation, file-upload fallback, and photo submission wiring.
**Uses:** Browser `getUserMedia`, Canvas `toBlob`, multipart upload handling.
**Implements:** Photobooth-specific hooks and API adapters.

### Phase 5: Guest Gallery and Launch Hardening
**Rationale:** Gallery behavior and final polish should be tuned against real persisted data and real-device testing.
**Delivers:** Minimal polaroid gallery, lazy loading, upload/image bounds, cross-device smoke verification, and launch checklist closure.
**Addresses:** Submission visibility, mobile performance, and launch confidence.
**Avoids:** Gallery jank, oversized uploads, and "looks done but isn't" launch failure.

### Phase Ordering Rationale

- Phase 1 comes first because section growth without boot hardening will worsen the current known failure modes.
- Phase 2 is independent of camera and backend upload complexity, so it provides visible v1 progress with low integration risk.
- Phase 3 must precede Phase 4 because camera capture is only useful once the guest-entry contract and protections are stable.
- Phase 5 belongs last because gallery tuning and device verification need the real end-to-end path in place.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4:** Camera support, permission behavior, secure-origin deployment, and image upload bounds need explicit implementation choices.
- **Phase 5:** Gallery performance strategy may need concrete limits based on expected submission volume and device testing.

Phases with standard patterns:
- **Phase 1:** Intro fallback, preload trimming, and section ordering follow established brownfield SPA patterns.
- **Phase 2:** Static invitation sections, maps embed, and QR presentation are straightforward within the current stack.
- **Phase 3:** Validation and SQLite-backed submission hardening are standard incremental backend work.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Recommendation stays close to installed tooling and avoids unnecessary platform change. |
| Features | HIGH | Project scope is explicit and the distinction between launch-critical and optional features is clear. |
| Architecture | HIGH | Section-based extension of the current repo is consistent with both codebase shape and milestone needs. |
| Pitfalls | HIGH | The main risks are concrete, near-term, and directly tied to known browser and mobile constraints. |

**Overall confidence:** HIGH

### Gaps to Address

- Final deployment assumptions for HTTPS and upload storage need confirmation before photobooth planning.
- The roadmap should decide early whether photos extend the existing wishes model or introduce a single guest-entry model.
- Expected gallery size and desired moderation posture should be confirmed before final launch-hardening scope is fixed.

## Sources

### Primary
- `.planning/PROJECT.md` - milestone scope, constraints, and current-state requirements.
- `.planning/research/STACK.md` - recommended stack and dependency guidance.
- `.planning/research/FEATURES.md` - launch priorities, dependencies, and MVP split.
- `.planning/research/ARCHITECTURE.md` - section boundaries, build order, and backend shape.
- `.planning/research/PITFALLS.md` - major launch and integration risks.

---
*Research completed: 2026-03-13*
*Ready for roadmap: yes*
