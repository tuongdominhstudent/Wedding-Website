# Phase 2: Invitation Content and Logistics - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete the remaining guest-facing invitation sections for v1: a dedicated prewedding video section, a wedding-photo section with calendar-date presentation, a clear logistics section for date/time/address/map, and a separate QR gifting section. This phase is about story presentation and event clarity on mobile. It does not include guestbook, photobooth capture, backend wish persistence work, or polaroid gallery features.

</domain>

<decisions>
## Implementation Decisions

### Section order and role separation
- Keep the current `long-distance` ending content as an editorial preview rather than the primary logistics section.
- Place the dedicated prewedding video section immediately after `long-distance`.
- Use the wedding-photo and calendar-date section as the bridge from cinematic story content into practical invitation information.
- Follow the calendar section with a dedicated logistics section for date, time, venue, address, and map.
- Keep the wedding gift QR in its own separate section after logistics rather than merging it into the map/address block.

### Logistics information structure
- The logistics section should separate information into two clear blocks on mobile: one for date/time and one for venue/address/map.
- Address presentation should prioritize readability first, with clear line breaks and low-friction scanning over editorial styling.
- The map experience should use an embedded preview on the page plus a clear action to open an external maps app for real navigation.
- The embedded map preview should be functional first, not heavily cinematic or decorative.

### Claude's Discretion
- Exact transition treatment between `long-distance`, prewedding, calendar, and logistics sections
- Exact typography, spacing, and decorative detail inside each Phase 2 section
- The specific visual treatment for the QR gifting section as long as it remains mobile-readable and distinct from logistics
- Whether the map handoff prefers Google Maps only or conditionally supports Apple Maps based on implementation practicality

</decisions>

<specifics>
## Specific Ideas

- The user wants Phase 2 to read as a clear flow from story into invitation logistics rather than as disconnected standalone blocks.
- `long-distance` should stay emotionally expressive, while the later logistics section should be the place guests rely on for practical details.
- The calendar/photo section should feel like the pivot point where the wedding date becomes explicit before the site shifts fully into logistics.
- The QR gifting section should feel intentionally separate from directions and venue information, not tucked into the same card.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `client/src/sections/StoryRoot.jsx`: already composes story sections via the section registry seam and is the integration point for Phase 2 section ordering.
- `client/src/config/sectionRegistry.js`: already defines section order and deferred-vs-blocking preload behavior, so new invitation sections should continue through that contract.
- `client/src/hooks/useAppBootstrap.js`: central place for registering deferred media so new Phase 2 assets do not expand the intro boot budget.
- `client/src/sections/distance/LongDistanceJourneySection.jsx`: already contains a wedding-banner/editorial invitation moment, so Phase 2 must complement it rather than duplicate its responsibility.
- Uncommitted local draft exists under `client/src/sections/prewedding/`: useful as a starting point, but it should still be validated against the decisions in this context before being treated as final.

### Established Patterns
- Sections are organized by feature folder with co-located component, CSS module, constants, and asset registration files.
- Styling is CSS Modules and mobile-first; new sections should follow the same pattern instead of inventing a different composition system.
- Deferred media loading is already part of the architecture, and downstream story sections should keep using it to preserve responsive entry into the site.
- The story currently mixes cinematic presentation with practical invitation content, so Phase 2 planning must intentionally separate “editorial preview” from “real logistics.”

### Integration Points
- Section ordering and insertion should happen through `sectionRegistry.js` and `StoryRoot.jsx`.
- Prewedding video and later section assets should register through section-specific asset modules and `useAppBootstrap.js`.
- The logistics section will likely become the primary source of truth for `EVENT-01`, `EVENT-02`, and `EVENT-03`, while `long-distance` remains atmospheric support.
- The QR section should connect to the same story flow but remain visually and semantically separate from the logistics section.

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---
*Phase: 02-invitation-content-and-logistics*
*Context gathered: 2026-03-13*
