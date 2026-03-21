# spike(roadmap-calendar): Test CORS for M365 and Azure roadmap APIs from Power Apps sandbox

**App**: Roadmap Calendar (`apps/roadmap-calendar/`)

## Summary
The Roadmap Calendar app fetches data client-side from the M365 and Azure public
roadmap APIs. These APIs may block CORS requests when the app runs inside the
Power Apps Code App sandbox. This needs to be tested early to determine if a proxy
is required.

## Context
The Roadmap Calendar app (`apps/roadmap-calendar/`) makes client-side `fetch()`
calls to:
- `https://www.microsoft.com/releasecommunications/api/v2/M365`
- `https://www.microsoft.com/releasecommunications/api/v2/Azure`

These are public APIs (no auth required) but may not include CORS headers
allowing requests from the Power Apps sandbox origin.

## Investigation Steps
- [ ] Run `apps/roadmap-calendar/` locally with `npm run dev` and verify API calls succeed from localhost
- [ ] Deploy to Power Apps via `pac code push` and test API calls from the sandbox origin
- [ ] Check response headers for `Access-Control-Allow-Origin`
- [ ] If CORS is blocked, implement one of the fallback options below

## Fallback Options (if CORS blocked)
1. **Lightweight Azure Function proxy** — simple passthrough function that adds CORS headers.
   Minimal cost, easy to deploy, keeps client-side data fetching pattern.
2. **Power Apps connector** — use a custom connector to proxy the API call through
   the Power Apps platform. More complex but stays within the platform.
3. **Static data snapshot** — pre-fetch and cache data in a static JSON file, updated
   on a schedule. Simplest but data becomes stale.

**Recommendation**: Option 1 (Azure Function proxy) for lowest friction.

## Files Likely Affected
- `apps/roadmap-calendar/src/api/` — update fetch URLs to proxy if needed
- New: proxy Azure Function (if required, in a separate `infra/` or `proxy/` directory)

## Acceptance Criteria
- [ ] CORS behavior documented for both APIs from Power Apps sandbox
- [ ] If blocked: proxy solution implemented and tested
- [ ] API data renders correctly in the Roadmap Calendar within Power Apps sandbox
