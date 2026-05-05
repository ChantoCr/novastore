# Next Task Prompt — NOVA Store

## Objective
Implement a read-only admin audit log listing flow using the existing backend audit-log groundwork.

## Why
The project already records important admin product actions on the backend, but that auditability is not yet visible in the admin experience. Exposing audit logs in a protected, reviewer-friendly way would turn the current groundwork into a clear portfolio feature.

This task matters because it will:
- demonstrate realistic admin observability and accountability
- make the existing audit logging backend work visible in the UI
- align with the admin and backend architecture goals documented in `AGENTS.md`
- strengthen the project’s production-minded story around traceability

## Scope
Include:
1. a protected backend audit-log listing endpoint
2. pagination and simple useful filters if they fit cleanly
3. an admin frontend data flow for loading audit logs with RTK Query
4. a read-only admin audit-log screen or panel with loading, empty, and error states
5. documentation updates if routes, architecture notes, or admin capabilities change

## Out of Scope
Do not include yet:
- destructive audit-log actions
- editing audit logs
- major analytics dashboards
- unrelated checkout, wishlist, or reviews work
- a broad admin redesign unrelated to listing audit entries

## Files / Areas Likely Involved
- `server/src/routes/`
- `server/src/controllers/`
- `server/src/services/`
- `server/src/repositories/audit.repository.js`
- `server/src/validators/`
- `client/src/features/admin/`
- `client/src/pages/AdminProductsPage.jsx` or a new admin audit-log page
- `client/src/router/index.jsx`
- `client/src/services/baseApi.js`
- `README.md`
- `CHAT_CONTEXT_HANDOFF.md`

## Acceptance Criteria
- [ ] Admin-only backend route exists for listing audit logs
- [ ] Audit-log data is loaded through the frontend architecture cleanly
- [ ] Admin users can view audit entries in a readable UI
- [ ] Non-admin users cannot access the endpoint or admin audit-log UI
- [ ] Loading, empty, and error states are present where relevant
- [ ] Documentation stays aligned if routes or admin capabilities change

## Constraints / Preferences
- keep the layered backend architecture intact
- keep the admin UI read-only for now
- avoid exposing unnecessary sensitive metadata
- prefer clear filters and pagination over complex analytics
- assume Docker is available when the environment supports it, but treat this as feature development work

## Notes
Current important context:
- auth/session bootstrap persistence has been implemented
- checkout-focused backend integration tests have been added
- audit logging groundwork for admin product actions already exists on the backend
- Docker was not available in the latest environment validation attempt, so if runtime verification is needed later, re-check Docker or local MySQL availability first
- read `NEXT_CHAT_INSTRUCTIONS.md` first in the next chat before making changes
