# feat(roadmap-calendar): Add releaseplans.microsoft.com as data source (v2)

**App**: Roadmap Calendar (`apps/roadmap-calendar/`)

## Summary
Add support for the Power Platform / Dynamics 365 release plans
(releaseplans.microsoft.com) as a third data source in the **Roadmap Calendar** app.

## Context
The Roadmap Calendar app (`apps/roadmap-calendar/`) aggregates Microsoft public
roadmap features into a monthly calendar view. It currently uses two data sources:
- M365 Roadmap API (`https://www.microsoft.com/releasecommunications/api/v2/M365`)
- Azure Roadmap API (`https://www.microsoft.com/releasecommunications/api/v2/Azure`)

This issue tracks adding the Power Platform / Dynamics 365 release plans as a
third source, covering products like Power Apps, Power Automate, Copilot Studio,
Dataverse, and Dynamics 365.

## Investigation Findings (March 2026)
- `releaseplans.microsoft.com` is a JavaScript SPA that redirects page loads to
  a YouTube embed when fetched server-side — no public REST API was found.
- All API endpoint guesses returned 404: `/api/`, `/api/v1/plans`, `/api/v1/features`,
  `/api/v2/`, `/api/release/allPlans`, `/api/plans/features`
- `experience.dynamics.com/releaseplans/` also redirects to a video embed
- `learn.microsoft.com/api/releaseplans` → 404
- Content lives as static docs on `learn.microsoft.com` organized by release wave
  (e.g., `/power-platform/release-plan/2026wave1/`)
- Downloadable PDFs are available per wave

## Possible Approaches
1. Reverse-engineer the SPA's internal API calls via browser DevTools
2. Scrape structured data from learn.microsoft.com release plan pages
3. Parse the downloadable release wave PDFs
4. Monitor for a future public API from Microsoft

## Files Likely Affected
- `apps/roadmap-calendar/src/types/` — extend `RoadmapFeature` source union
- `apps/roadmap-calendar/src/api/` — new fetcher module for release plans
- `apps/roadmap-calendar/src/components/` — add "Release Plans" source toggle in filter panel

## Acceptance Criteria
- [ ] Identify a reliable data source for release plan features
- [ ] Normalize to existing `RoadmapFeature` type in `apps/roadmap-calendar/src/types/`
- [ ] Add "Release Plans" as a third source toggle in the filter panel
- [ ] Features appear in the calendar grid alongside M365/Azure features
