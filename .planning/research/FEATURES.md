# Feature Research

**Domain:** cinematic wedding invitation site for wedding guests
**Researched:** 2026-03-13
**Confidence:** HIGH

## Feature Landscape

This milestone is a brownfield v1 completion effort, not a greenfield product search. The core requirement is clear from [PROJECT.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md): v1 is done when the core sections are live, the content is correct, and the mobile experience is smooth. Existing implementation context from [ARCHITECTURE.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/ARCHITECTURE.md) shows the intro flow, story sections, and wishes API already exist in partial form, so prioritization should favor finishing the guest journey over adding new systems.

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Complete story sections with finalized couple content | A wedding invitation site must tell the couple's story and clearly present the intended flow; unfinished sections make the page feel broken | MEDIUM | Existing intro, firsts, and long-distance sections already provide the pattern; remaining sections should extend the current section-based architecture from [ARCHITECTURE.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/ARCHITECTURE.md) |
| Accurate event details | Guests primarily need date, time, venue, and address information to attend confidently | LOW | This is mandatory launch content, not optional polish; incorrect or missing details invalidate the invitation value |
| Venue map access on mobile | Guests expect quick location confirmation and navigation help from their phone | LOW | Embed or link cleanly; optimize for tap-to-open maps rather than heavy custom mapping |
| Smooth mobile-first scrolling and section transitions | Guests will mostly open the invitation on mobile, and [PROJECT.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md) explicitly defines smooth mobile experience as a v1 success condition | MEDIUM | [CONCERNS.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/CONCERNS.md) identifies intro lock and preload bottlenecks as launch risks |
| Wedding gift QR section | Digital gifting is a common expectation for modern wedding invitations, especially when attendance logistics are mobile-led | LOW | Keep it clear, respectful, and secondary to the event details |
| Wish submission backed by persistence | Guests expect their wishes to be saved if the site invites them to participate | MEDIUM | Existing Express + SQLite wish flow already exists per [PROJECT.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md) and [ARCHITECTURE.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/ARCHITECTURE.md) |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cinematic story presentation | Makes the invitation feel premium and memorable rather than like a static event page | MEDIUM | Already a core product direction in [PROJECT.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md); should be preserved, but not at the expense of usability |
| Prewedding video section | Adds emotional payoff and perceived production value for guests | LOW | Specific asset already chosen in [PROJECT.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md): `preweddingVideo.webm` |
| Camera photobooth + message flow | Turns passive viewing into a guest contribution moment, which is more distinctive than text-only wishes | HIGH | Valuable differentiator, but implementation must stay reliable on mobile cameras and degrade gracefully |
| Polaroid-style guest gallery | Lets submitted wishes become part of the invitation story, extending emotional engagement after initial viewing | MEDIUM | Depends on working persistence and moderation posture; presentation can be lightweight for v1 |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Admin dashboard or CMS for v1 | Seems useful because wedding content changes late | Adds a whole management product that the milestone does not require; slows launch and expands backend scope | Keep content editable in existing code/data structures and update directly during milestone delivery |
| Guest accounts or authentication | Sounds like a way to personalize wishes and gallery submissions | Creates friction for guests and introduces auth complexity that contradicts invitation simplicity | Allow lightweight guest submission with validation and basic abuse controls |
| Real-time guest wall updates | Feels modern and interactive | Adds polling or socket complexity without being necessary for invitation success | Use simple fetch-on-view or manual refresh for gallery visibility |
| Heavy custom map experience | Seems more cinematic than linking to maps | Increases mobile performance cost and duplicates native navigation behavior | Use concise map embed or direct map handoff for directions |
| Over-expanding 3D scenes across all sections | Feels aligned with the cinematic brand | [CONCERNS.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/CONCERNS.md) already highlights preload and scene complexity risks; this threatens smooth mobile delivery | Reserve 3D for targeted moments and prefer performant DOM/video presentation elsewhere |

## Feature Dependencies

```text
[Complete core invitation sections]
    ├──requires──> [Finalized content and media]
    ├──requires──> [Reliable mobile scrolling and intro progression]
    └──enables──> [v1 launch acceptance]

[Event details]
    └──requires──> [Confirmed venue/date/address content]

[Venue map section]
    └──requires──> [Event details]

[Wish submission]
    └──requires──> [Working API persistence]
            └──requires──> [Validation and basic abuse controls]

[Photobooth capture]
    └──requires──> [Wish submission]
            └──enhances──> [Polaroid guest gallery]

[Polaroid guest gallery]
    └──requires──> [Stored guest wishes and photos]

[Cinematic motion density]
    ──conflicts──> [Smooth mobile performance]
```

### Dependency Notes

- **Complete core invitation sections requires finalized content and media:** This milestone cannot be considered done if sections exist structurally but ship with placeholder copy or incorrect event details.
- **Complete core invitation sections requires reliable mobile scrolling and intro progression:** [CONCERNS.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/CONCERNS.md) identifies hard-lock and preload risks that directly threaten the user's v1 success criteria.
- **Venue map section requires event details:** Map UX only works once the final venue and address are confirmed.
- **Wish submission requires working API persistence:** The guest interaction promise is only valid if messages survive refreshes and can be listed again, which the current backend is positioned to support.
- **Wish submission requires validation and basic abuse controls:** Public write endpoints are a known launch risk in [CONCERNS.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/CONCERNS.md); minimal throttling and validation are part of a safe public release.
- **Photobooth capture requires wish submission:** The camera flow is an extension of the guest-wish funnel, not a separate product surface.
- **Cinematic motion density conflicts with smooth mobile performance:** Wedding invitation expectations reward elegance, but guests penalize stutter, lockups, and delayed load more than they reward extra spectacle.

## MVP Definition

### Launch With (v1)

- [ ] Completed guest-facing story flow from intro through final invitation sections with correct copy and media
- [ ] Final event details section with correct date, time, venue, and address
- [ ] Mobile-usable venue map handoff or embed
- [ ] Wedding gift QR section
- [ ] Stable mobile-first performance, including no intro dead-end and no unacceptable preload delay
- [ ] Guest wish submission persisted to the backend and viewable again on the site
- [ ] A minimal guest gallery or wish display that proves submissions are part of the experience

### Add After Validation (v1.x)

- [ ] Full camera photobooth capture flow if mobile reliability and permissions UX are acceptable
- [ ] More expressive polaroid gallery layout and browsing behavior once enough submissions exist
- [ ] Stronger anti-abuse and moderation tooling if public traffic warrants it

### Future Consideration (v2+)

- [ ] Back-office moderation UI or content management tools
- [ ] RSVP workflow, seat coordination, or logistics management features
- [ ] Social sharing mechanics or public guestbook expansion beyond the wedding site itself
- [ ] More ambitious 3D or live-interaction features that increase performance and maintenance cost

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Correct invitation content across core sections | HIGH | MEDIUM | P1 |
| Event details and address clarity | HIGH | LOW | P1 |
| Smooth mobile performance and scroll reliability | HIGH | MEDIUM | P1 |
| Venue map access | HIGH | LOW | P1 |
| Backend-persisted wishes | HIGH | MEDIUM | P1 |
| Wedding gift QR section | MEDIUM | LOW | P1 |
| Minimal guest gallery display | MEDIUM | MEDIUM | P2 |
| Prewedding video section | MEDIUM | LOW | P2 |
| Camera photobooth capture | MEDIUM | HIGH | P2 |
| Expanded gallery polish and richer motion flourishes | LOW | MEDIUM | P3 |
| CMS/admin tooling | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have if it does not delay launch stability
- P3: Defer unless launch requirements are already satisfied

## Sources

- [PROJECT.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/PROJECT.md)
- [ARCHITECTURE.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/ARCHITECTURE.md)
- [CONCERNS.md](/Users/minhtuong03/Documents/Code/Wedding card/.planning/codebase/CONCERNS.md)
- [FEATURES template](/Users/minhtuong03/Documents/Code/Wedding card/.codex/get-shit-done/templates/research-project/FEATURES.md)
- Reasoning from standard wedding invitation expectations: guests need immediate event clarity, mobile map access, low-friction gifting, and trustworthy submission behavior; premium presentation helps, but only after usability and correctness are secure.

---
*Feature research for: cinematic wedding invitation site*
*Researched: 2026-03-13*
