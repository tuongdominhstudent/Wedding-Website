# Pitfalls Research

**Domain:** mobile-first cinematic wedding invitation site
**Researched:** 2026-03-13
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Intro gating blocks the entire invitation

**What goes wrong:**
The opening video and reveal sequence become the only path into the rest of the site, so autoplay failure, stalled media, or a broken completion callback leaves guests stuck before they can see event details.

**Why it happens:**
The current app already gates downstream sections on intro completion and uses scroll locking during the sequence. Teams often treat the intro as presentation only, but in this codebase it is also navigation control.

**How to avoid:**
Add a timeout fallback, an explicit skip control, and a non-video completion path. Treat "unlock story" as separate state from "intro animation finished perfectly."

**Warning signs:**
Manual testing focuses on one modern phone, scroll remains disabled after a media hiccup, and there is no QA step for failed autoplay or reduced-motion mode.

**Phase to address:**
Phase 1: intro and boot hardening

---

### Pitfall 2: Global preload turns every new section into startup latency

**What goes wrong:**
Adding the prewedding video, extra photos, and map assets makes first interaction feel frozen because the app waits for too much content before becoming usable.

**Why it happens:**
The current bootstrap loader is sequential and global. Brownfield teams often keep adding assets to the same preload registry because it feels safe, but that couples launch speed to total story size.

**How to avoid:**
Keep only above-the-fold intro assets in critical preload. Defer late-section media, use poster images for video, and load heavy section assets on approach or on demand.

**Warning signs:**
Boot time grows after each new section, progress bars stall on one asset, and the site feels fine on desktop Wi-Fi but not on mobile data.

**Phase to address:**
Phase 1: intro and boot hardening

---

### Pitfall 3: Photobooth works locally but fails in production

**What goes wrong:**
Guests cannot access the camera, photo capture silently fails, or upload flow breaks only after deployment.

**Why it happens:**
`getUserMedia` requires HTTPS or localhost plus user permission. Teams often prototype the camera flow on localhost and assume the same behavior will hold on a public domain.

**How to avoid:**
Plan the photobooth around secure origin requirements from the start. Build a graceful fallback to file upload, add clear permission guidance, and verify the deployed domain with real mobile devices.

**Warning signs:**
Camera access is only tested on desktop localhost, there is no fallback for denied permission, and deployment planning does not mention HTTPS.

**Phase to address:**
Phase 4: photobooth capture flow

---

### Pitfall 4: Canvas export breaks because guest photos taint the canvas

**What goes wrong:**
The capture preview appears correct, but downloading or serializing the final image fails because the canvas is not origin-clean.

**Why it happens:**
Canvas export is fragile when any drawn asset comes from a source without correct CORS handling. This is easy to miss when mixing camera frames, uploaded images, decorative overlays, and remote assets.

**How to avoid:**
Keep photobooth compositing same-origin where possible. If external assets are unavoidable, set up CORS correctly and test the actual export path, not just preview rendering.

**Warning signs:**
Preview works but `toBlob` or `toDataURL` throws, export only fails on some devices, or overlays come from ad hoc remote URLs.

**Phase to address:**
Phase 4: photobooth capture flow

---

### Pitfall 5: Wish persistence accepts abuse and fake submissions

**What goes wrong:**
The public guestbook fills with spam, offensive content, or repeated junk requests that overwhelm the couple-facing experience.

**Why it happens:**
The current wishes API is public and unauthenticated with direct SQLite writes. Wedding sites are low-volume, so teams often skip abuse controls until after public sharing.

**How to avoid:**
Add rate limits, payload constraints, basic anti-automation friction, and an operational plan for hiding or deleting bad entries. Keep the launch URL private until protections are in place.

**Warning signs:**
No throttling exists, the same endpoint accepts unlimited posts, and there is no answer for "what if a guest posts garbage?"

**Phase to address:**
Phase 5: guestbook persistence and moderation guardrails

---

### Pitfall 6: Event details look polished but are not actually usable

**What goes wrong:**
Guests see beautiful ceremony information but cannot reliably copy the address, open directions, or distinguish ceremony versus reception details on a phone.

**Why it happens:**
Storytelling layouts prioritize aesthetics over operational clarity. Wedding sites fail when the event information is treated as another decorative section instead of the core job to be done.

**How to avoid:**
Make time, address, call-to-action buttons, and venue distinctions explicit. Use tap-friendly actions for map opening and copying details. Keep the key logistics readable without animation dependence.

**Warning signs:**
Address text is embedded in art, event CTA buttons are missing, and testers ask "where exactly do I tap for directions?"

**Phase to address:**
Phase 2: event details and logistics sections

---

### Pitfall 7: Map embed choice creates unnecessary integration work

**What goes wrong:**
The team burns time on a custom maps integration, billing setup, or JS SDK complexity when a simple venue-direction solution would have been enough for v1.

**Why it happens:**
Map features are easy to overbuild. For a wedding invitation, the requirement is usually "help guests reach the venue," not "build an interactive location product."

**How to avoid:**
Use Google Maps Embed API or a direct map link as the low-friction default path. Only add richer map behavior if there is a concrete guest need that the embed cannot satisfy.

**Warning signs:**
Discussion drifts into custom markers, live directions, or SDK event handling before the basic address section is finished.

**Phase to address:**
Phase 2: event details and logistics sections

---

### Pitfall 8: Polaroid gallery becomes a mobile performance sink

**What goes wrong:**
Guest submissions render nicely with a small seed dataset, then become janky as image count grows, causing layout thrash, memory spikes, and long main-thread stalls on phones.

**Why it happens:**
A polaroid wall encourages many layered images, transforms, shadows, and animation. Combined with React re-renders and full-image payloads, this can overwhelm low-end mobile devices quickly.

**How to avoid:**
Limit initial items, lazy-load images, cap image dimensions at upload time, and avoid animating every card at once. Treat the gallery as progressive content, not part of first paint.

**Warning signs:**
Scrolling slows after a few submissions, images are stored at camera-original size, and the gallery mounts all cards immediately.

**Phase to address:**
Phase 6: guest photo showcase and gallery optimization

---

### Pitfall 9: Content wiring becomes hard-coded and painful to update

**What goes wrong:**
Late copy, venue, QR, or media updates require code edits in multiple components right before launch, increasing regression risk and slowing iteration.

**Why it happens:**
Brownfield section builds often start with inline constants because content is still moving. That is fine temporarily, but wedding content changes frequently until the last week.

**How to avoid:**
Centralize section content and asset references per section. Keep copy, dates, addresses, and media IDs easy to replace without touching animation logic.

**Warning signs:**
The same date or address appears in multiple files, section components mix storytelling logic with raw content strings, and a simple text change needs a developer search sweep.

**Phase to address:**
Phase 3: content completion and maintainable section wiring

---

### Pitfall 10: No verification path for cross-device launch quality

**What goes wrong:**
The site appears complete in local demos but breaks on real guest devices through autoplay differences, safe-area issues, camera permission prompts, or API edge cases.

**Why it happens:**
The repo has no automated tests and the product depends heavily on browser behavior, media playback, scroll choreography, and mobile hardware.

**How to avoid:**
Define a launch checklist, add minimum smoke tests for API and story gating, and do real-device checks on iPhone and Android before calling v1 done.

**Warning signs:**
Verification is only "build passes" plus one local browser walkthrough, and no one can answer which phones have been tested end to end.

**Phase to address:**
Phase 7: launch hardening and verification

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Put new section copy, dates, and venue strings directly inside JSX | Fastest path to visible progress | Last-minute content edits become multi-file regression work | Only for a short-lived spike before section content is centralized |
| Add every new media file to the global preload list | Fewer visible asset pop-ins during development | Startup time grows with every section and mobile bounce rate rises | Only for assets needed before the first interaction |
| Reuse the existing wish schema for photobooth without image-specific constraints | Faster API delivery | Oversized payloads, storage bloat, and weak validation | Never for image upload fields |
| Skip abuse controls because the site is "just for guests" | Less backend work in v1 | Spam, harassment, and operational cleanup during launch week | Never for a public write endpoint |
| Render the full gallery in one pass | Simpler frontend code | Jank, memory spikes, and slow image decoding on phones | Only if the gallery is capped to a very small number of items |
| Ship map details as a static screenshot | Easy visual polish | Guests cannot open navigation, copy address, or use accessibility tools | Only as a decorative companion to real directions links |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Browser camera via `getUserMedia` | Building the flow on localhost and forgetting secure-origin and permission requirements | Test on deployed HTTPS early and provide a fallback when permission is denied |
| Canvas export | Mixing guest uploads or remote overlays into canvas without origin-clean guarantees | Keep assets same-origin where possible and verify the actual export path with CORS-aware assets |
| Google Maps embed or map link | Reaching for the full JS SDK before the address section is stable | Start with Google Maps Embed API or a direct venue link as the v1 default |
| Frontend to wishes API | Assuming JSON fetches always succeed and return the expected envelope | Handle timeouts, malformed responses, and user-facing retry states in the client |
| SQLite-backed guest submissions | Treating local-dev persistence characteristics as production behavior | Bound payload sizes, control write frequency, and plan data cleanup before public launch |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Sequential global asset preload | Long loading screen, stalled progress, no interaction until late assets finish | Preload only critical assets and defer section-local media | Breaks as soon as a second heavy video or model is added |
| Double-fetching 3D and media assets | High bandwidth use, memory pressure, inconsistent boot timing | Consolidate loaders and reuse caches for heavy assets | Breaks on mobile networks and low-memory phones first |
| Uploading original-size guest photos | Slow submissions, large storage growth, laggy gallery rendering | Resize and compress at capture or before upload, then store bounded derivatives | Breaks after the first batch of real guest photos |
| Rendering every polaroid card with animation on mount | Scroll hitching and long frame times in the showcase section | Paginate or window the list and stagger only visible items | Breaks once the gallery has more than a small launch set |
| Keeping camera, canvas, and gallery state alive after submit | Device heat, battery drain, and tab instability | Tear down streams, release blobs, and clear temporary canvas state promptly | Breaks on older phones during repeated capture attempts |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Public guestbook without rate limiting | Spam and nuisance content dominate the experience | Add IP and request throttling plus simple anti-bot friction before launch |
| Storing or rendering guest-submitted text without strict output handling | Defacement or script injection into a celebratory public page | Keep validation strict and render all guest content as escaped text only |
| Accepting arbitrary image types or oversized uploads | Storage abuse, crashes, and image parsing risk | Restrict MIME types, dimensions, and payload sizes, then validate server-side |
| Permissive CORS in production | Unintended third-party origins can post or read guest data | Fail closed when `CLIENT_ORIGIN` is missing in production |
| Exposing private operational details in event content or QR flows | Sensitive personal information spreads beyond intended guests | Minimize exposed data and keep QR and venue copy to what guests truly need |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Treating the site as a film instead of an invitation | Guests enjoy visuals but miss the practical details | Put event essentials in a readable, tappable section that works without animation |
| Relying on autoplay audio or video behavior | Some guests hear nothing or cannot progress | Design the intro to degrade gracefully with mute, pause, and skip paths |
| Camera permission denial with no fallback | Guests abandon the photobooth immediately | Offer file upload or text-only wish submission when camera access is unavailable |
| Decorative typography for addresses and times | Guests misread or cannot copy logistics | Use display styling for mood, but keep key details in high-contrast readable text |
| Dense scrolling sections with no progress cues | Guests stop before reaching the RSVP-adjacent content, map, or QR | Use pacing, section separation, and clear affordances for "keep going" |

## "Looks Done But Isn't" Checklist

- [ ] **Intro flow:** Often missing failure recovery - verify the story unlocks if autoplay, buffering, or reduced-motion paths fail.
- [ ] **Event details:** Often missing actionable logistics - verify guests can read, copy, and open the venue location on mobile.
- [ ] **Map section:** Often missing real navigation behavior - verify the embedded map or link opens correct directions on a phone.
- [ ] **Photobooth:** Often missing denied-permission fallback - verify submission still works when camera access is blocked.
- [ ] **Canvas export:** Often missing origin-clean validation - verify the final image can actually be exported on production-like assets.
- [ ] **Wish submission:** Often missing abuse protection - verify repeated post attempts are throttled and invalid payloads fail cleanly.
- [ ] **Gallery:** Often missing bounded image sizing - verify large guest photos are resized and do not tank scrolling performance.
- [ ] **QR gift section:** Often missing scannability and context - verify the code is readable on another phone and the surrounding instructions are clear.
- [ ] **Mobile layout:** Often missing safe-area and viewport checks - verify iPhone and Android devices do not crop controls or text.
- [ ] **Launch readiness:** Often missing cross-device rehearsal - verify one full end-to-end pass on real phones against the deployed environment.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Intro gating lock | MEDIUM | Hotfix a skip path, disable strict scroll lock, and temporarily bypass video gating until root cause is fixed |
| Camera access failure in production | MEDIUM | Switch the photobooth CTA to file upload or text-only fallback and update guest copy immediately |
| Canvas export failure | MEDIUM | Remove cross-origin overlays, fall back to raw photo submission, and patch asset hosting or CORS headers |
| Guestbook spam wave | HIGH | Enable throttling, hide bad entries, rotate the public URL if necessary, and backfill moderation tools later |
| Gallery performance collapse | MEDIUM | Cap visible entries, lazy-load images, compress stored media, and disable nonessential card animation |
| Incorrect or unusable venue information | HIGH | Patch copy immediately, replace map target, and re-run the mobile directions check on the deployed site |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Intro gating blocks the invitation | Phase 1: intro and boot hardening | Simulate autoplay failure and confirm guests can still reach the next section |
| Global preload becomes startup latency | Phase 1: intro and boot hardening | Measure time to first interaction after adding late-story media |
| Event details are polished but unusable | Phase 2: event details and logistics sections | Complete the logistics task flow on a phone without needing verbal explanation |
| Map embed is overbuilt or unreliable | Phase 2: event details and logistics sections | Open the venue from the site into a map app from real mobile devices |
| Content wiring becomes hard-coded | Phase 3: content completion and maintainable section wiring | Change copy, venue, and media references without editing animation logic |
| Photobooth fails outside localhost | Phase 4: photobooth capture flow | Test HTTPS deployment with camera allow, deny, and no-camera scenarios |
| Canvas export breaks on guest media | Phase 4: photobooth capture flow | Export the composed image using production-like assets and uploaded photos |
| Public wish persistence accepts abuse | Phase 5: guestbook persistence and moderation guardrails | Attempt burst posting and invalid payloads, then confirm throttling and validation behavior |
| Polaroid gallery becomes a performance sink | Phase 6: guest photo showcase and gallery optimization | Load a representative submission set on mobile and confirm acceptable scrolling and memory use |
| Launch quality is unverified across devices | Phase 7: launch hardening and verification | Run an end-to-end checklist on deployed iPhone and Android paths before release |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/TESTING.md`
- `.planning/codebase/INTEGRATIONS.md`
- Project note: `getUserMedia` requires HTTPS or localhost plus permission
- Project note: canvas export fails when the canvas is not origin-clean
- Project note: Google Maps Embed API is the low-friction default map path

---
*Pitfalls research for: mobile-first cinematic wedding invitation site*
*Researched: 2026-03-13*
