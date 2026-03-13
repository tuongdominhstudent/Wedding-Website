# Phase 2: Invitation Content and Logistics - Research

**Researched:** 2026-03-13
**Domain:** Brownfield React/Vite cinematic invitation section build-out
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

These decisions are non-negotiable for planning.

### Locked Decisions
- Keep the current `long-distance` ending content as an editorial preview rather than the primary logistics section.
- Place the dedicated prewedding video section immediately after `long-distance`.
- Use the wedding-photo and calendar-date section as the bridge from cinematic story content into practical invitation information.
- Follow the calendar section with a dedicated logistics section for date, time, venue, address, and map.
- Keep the wedding gift QR in its own separate section after logistics rather than merging it into the map/address block.
- The logistics section should separate information into two clear blocks on mobile: one for date/time and one for venue/address/map.
- Address presentation should prioritize readability first, with clear line breaks and low-friction scanning over editorial styling.
- The map experience should use an embedded preview on the page plus a clear action to open an external maps app for real navigation.
- The embedded map preview should be functional first, not heavily cinematic or decorative.

### Claude's Discretion
- Exact transition treatment between `long-distance`, prewedding, calendar, and logistics sections
- Exact typography, spacing, and decorative detail inside each Phase 2 section
- The specific visual treatment for the QR gifting section as long as it remains mobile-readable and distinct from logistics
- Whether the map handoff prefers Google Maps only or conditionally supports Apple Maps based on implementation practicality

### Deferred Ideas (OUT OF SCOPE)
- None
</user_constraints>

<research_summary>
## Summary

Phase 2 should extend the existing section-based story architecture instead of inventing a parallel invitation shell. The repo already has the right seams for this: `sectionRegistry` controls order and preload tier, `StoryRoot` mounts sections from the registry, and `useAppBootstrap` can keep all new Phase 2 media deferred so the intro path stays light. The real design challenge is not architecture, but role clarity: `long-distance` already includes invitation-like visuals, so the new sections must define a cleaner progression from editorial emotion into readable logistics.

The recommended plan is to split Phase 2 into two waves. First, finish the story-side visible sections: dedicated prewedding video plus calendar/photo bridge, both registered as deferred and mounted after `long-distance`. Second, add the practical guest-facing section pair: a logistics section with functional map handoff and a separate QR gifting section. This split keeps the new content additive, reduces merge risk, and matches the user’s desire to complete the site one section at a time.

**Primary recommendation:** Treat Phase 2 as a section-composition phase built on existing registry/bootstrap seams, with one wave for cinematic content and one wave for practical logistics/gifting.
</research_summary>

<standard_stack>
## Standard Stack

Use the existing client stack for this phase. No new framework is needed.

### Core
| Library | Version | Purpose | Why Standard Here |
|---------|---------|---------|-------------------|
| React | 18.3.1 | Section composition and state-driven media behavior | Existing story structure already uses it cleanly |
| Vite | 6.2.0 | Video/image imports and fast iteration | Existing asset graph already handles section media |
| GSAP | 3.13.0 | Light section entrance/polish motion | Current storytelling stack already depends on it |
| Zustand | 5.0.3 | Shared bootstrap and deferred-load lifecycle | Existing boot/deferred asset state is already centralized |
| Native `video` + `IntersectionObserver` | browser APIs | Autoplay, in-view media control, map/QR section behavior | Enough for Phase 2 without introducing another media layer |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Modules | existing | Section-local styling | Continue the current feature-folder pattern |
| Asset registry/loader | existing | Deferred preloading for Phase 2 media | Use for all new section media so intro boot remains scoped |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Section-based additions | One monolithic invitation page rewrite | Too risky for a brownfield flow the user wants finished incrementally |
| Native/open-map handoff | Custom interactive map scene | Adds complexity without helping Phase 2 core success criteria |
| Existing CSS Modules + GSAP | Heavy UI library or animation framework | Would fight the repo’s current section architecture and increase inconsistency |

**Installation:** No new package is required for the recommended Phase 2 direction.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Registry-Driven Section Expansion
**What:** Add each new visible section through `sectionRegistry`, `StoryRoot`, and a section-local folder.
**When to use:** When growing the one-page story without re-coupling bootstrap or hard-coded mount order.
**How it fits this repo:** The registry/preload contract created in Phase 1 is now the intended seam for new sections. Phase 2 should use it instead of inserting ad hoc mounts or all-media preload logic.

Practical guidance:
- Register `prewedding`, `calendar`, `logistics`, and `gift-qr` as deferred sections.
- Keep folder-level ownership: component, CSS module, constants/data, and assets file per section.
- Avoid hiding business content in `long-distance`; treat it as the handoff into Phase 2 sections.

### Pattern 2: Cinematic-To-Readable Progression
**What:** Let section density increase gradually from atmospheric story content to practical logistics.
**When to use:** When a guest-facing experience must stay elegant while still delivering actionable details.
**How it fits this repo:** `Intro`, `firsts`, and `long-distance` are cinematic already. Phase 2 should not abruptly jump into a dense utility page; it should pivot through a calendar/photo bridge before clear logistics.

Practical guidance:
- `Prewedding` can remain media-led with sparse copy.
- `Calendar/photo` should surface the wedding date visually and prepare the guest for practical information.
- `Logistics` should drop most decorative ambiguity and become scan-friendly.
- `Gift QR` should be clear and self-contained, not mixed into venue directions.

### Pattern 3: Deferred Media With Viewport Awareness
**What:** Keep heavy media as deferred assets and control playback based on viewport intersection.
**When to use:** For video/photo-rich sections below the fold on mobile.
**How it fits this repo:** The current bootstrap already supports deferred loading; the user also prioritizes mobile smoothness over maximal preload.

Practical guidance:
- Preload prewedding video metadata only, not full eager buffering.
- Pause offscreen video sections so they do not keep decoding after the user scrolls away.
- Prefer still imagery for logistics and QR sections unless motion is doing real storytelling work.

### Pattern 4: Functional Logistics Presentation
**What:** Treat date/time/address/map as a mobile utility surface first, then layer branding around it.
**When to use:** Whenever guests need to act on the information, not just admire it.
**How it fits this repo:** The user explicitly wants readability-first address handling and a functional embedded map preview plus external maps handoff.

Practical guidance:
- Split logistics into two blocks: date/time and venue/address/map.
- Keep a direct CTA for opening external maps.
- Do not rely on animation to reveal essential venue details.
- Reserve editorial typography for headings and keep address details plain enough to scan quickly.

### Anti-Patterns to Avoid
- **Reusing `long-distance` as the final logistics source of truth:** it already contains invitation flavor, but Phase 2 needs a separate readable section for actual guest action.
- **Making Phase 2 media blocking:** prewedding or wedding-photo assets should not be promoted back into intro-critical preload.
- **Packing logistics and gifting into one dense card:** guests will scan directions and gifting for different reasons; combining them increases cognitive load.
- **Over-animating actionable details:** venue address, map entry points, and QR access should not depend on scroll timing to become understandable.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Section insertion | Custom page router or hidden mount flags | Existing `sectionRegistry` + `StoryRoot` flow | The repo already has the seam for story order and preload assignment |
| Video orchestration | New player abstraction | Native `<video>` plus viewport-aware play/pause | Phase 2 needs simple reliable playback, not a custom media framework |
| Map interaction | Custom draggable map implementation | Embedded preview + external maps CTA | This matches the requirement and reduces mobile complexity |
| Content storage for invitation details | New CMS/config system | Co-located constants/data in section folders | User explicitly wants content easy to edit in code for now |

**Key insight:** Phase 2 is about composing clear visible sections, not introducing new infrastructure. The repo already has enough architecture to support it.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Prewedding Section Feels Detached From Story
**What goes wrong:** The prewedding video reads like a random inserted video block rather than the next chapter after `long-distance`.
**Why it happens:** Section content is added without a deliberate transition in pacing or copy.
**How to avoid:** Use prewedding as the immediate post-`long-distance` continuation, with copy and spacing that feel like an emotional follow-on rather than a utility card.
**Warning signs:** Hard cut from banner/invitation mood into a generic labeled video box.

### Pitfall 2: Calendar Section Duplicates Logistics Instead of Bridging Into It
**What goes wrong:** The calendar/photo section and logistics section repeat the same date/time/address content, making the story feel redundant.
**Why it happens:** The calendar section is allowed to become another plain invitation card.
**How to avoid:** Let calendar emphasize the wedding date visually, while logistics owns practical reading and map interaction.
**Warning signs:** Two adjacent sections both present the full venue/time copy with only styling differences.

### Pitfall 3: Logistics Looks Beautiful but Is Hard To Use
**What goes wrong:** Guests admire the section but still struggle to extract address lines, event timing, or where to tap for directions.
**Why it happens:** Editorial styling overwhelms functional hierarchy.
**How to avoid:** Keep two-block structure, readable text sizing, and clear map CTA hierarchy on mobile.
**Warning signs:** Address broken into decorative typography, or primary CTA hidden below folds/overlays.

### Pitfall 4: New Sections Regress Mobile Smoothness
**What goes wrong:** The site technically has all sections, but scroll stutters or video keeps consuming resources offscreen.
**Why it happens:** Heavy assets are eager-loaded or videos continue playing after leaving the viewport.
**How to avoid:** Use deferred asset registration, metadata preload for video, and viewport-aware pause/resume behavior.
**Warning signs:** Memory spikes or visible scroll hitch when the prewedding section enters.

### Pitfall 5: Gift QR Gets Lost Inside Logistics
**What goes wrong:** Guests looking for gifting must parse map and address information first, or the QR is visually buried.
**Why it happens:** Gifting is treated as a sub-card of logistics instead of its own section.
**How to avoid:** Give QR a dedicated section with distinct visual identity and straightforward mobile access.
**Warning signs:** QR appears as a small add-on below venue details rather than a clear destination.
</common_pitfalls>

<code_examples>
## Code Examples

### Existing Section Registry Seam
```js
// Current pattern in client/src/config/sectionRegistry.js
Object.freeze({
  id: 'long-distance',
  order: 20,
  preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
})
```

Planning implication:
- Phase 2 sections should join this same contract with explicit order and deferred strategy.

### Existing Story Composition Seam
```jsx
// Current pattern in client/src/sections/StoryRoot.jsx
const storySections = getRegisteredSections()
  .filter((section) => section.id !== 'intro')
  .map((section) => ({
    ...section,
    Component: SECTION_COMPONENTS[section.id]
  }))
```

Planning implication:
- New sections should be mounted here through registry/component mapping rather than custom branching.

### Existing Deferred Asset Registration Pattern
```js
// Current pattern in client/src/hooks/useAppBootstrap.js
registerIntroAssets(registry);
registerFirstsAssets(registry);
registerLongDistanceAssets(registry);
```

Planning implication:
- Phase 2 media should follow the same section-local registration pattern and stay out of blocking boot work.
</code_examples>

## Validation Architecture

Phase 2 needs both automated regression checks and manual mobile review because the main deliverables are visual story sections plus readable logistics content.

### Required user journeys
- **STORY-03:** Guest reaches and watches the dedicated prewedding section using `preweddingVideo.webm`.
- **STORY-04:** Guest reaches the wedding-photo/calendar section and understands the wedding date as a visual bridge into invitation details.
- **EVENT-01 / EVENT-02:** Guest can clearly read date, time, and venue address on mobile without relying on motion to decode the content.
- **EVENT-03:** Guest can use the map preview or open an external maps app from the logistics section.
- **GIFT-01:** Guest can reach and use the QR gifting section as a distinct destination after logistics.

### Practical verification hooks
- Add registry/bootstrap tests that prove new Phase 2 media remains deferred rather than expanding the blocking queue.
- Add `StoryRoot` coverage that confirms Phase 2 sections render in the intended order after `long-distance`.
- Add component tests for any viewport-aware prewedding video behavior so offscreen pause/resume stays deterministic.
- Keep map links deterministic in tests by asserting href/CTA contract rather than live map rendering.

### Suggested test split
- **Manual mobile smoke tests:** scroll through `long-distance -> prewedding -> calendar -> logistics -> QR`, verify visual continuity and readability on a phone-sized viewport.
- **Component/integration checks:** section order, deferred asset registration, prewedding video behavior, and logistics CTA/link rendering.
</validation_architecture>
