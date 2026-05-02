# Next Task Prompt — NOVA Store

## Objective
Implement improved auth/session bootstrap persistence for the current frontend and backend auth flow.

## Why
The application now has meaningful authenticated value across account, checkout, order history, and admin product management. The biggest remaining UX and architecture gap is that auth still mainly lives in Redux memory state, so a refresh can drop the active session experience even though refresh tokens and backend auth endpoints already exist.

This task matters because it will:
- make login state feel more production-like across page refreshes
- improve role-aware route behavior for `/account`, `/checkout`, and `/admin/products`
- better align the frontend with the existing backend refresh/me capabilities
- strengthen portfolio quality by showing realistic session bootstrap handling

## Scope
Include:
1. frontend auth bootstrap strategy on app load
2. safe persistence of only the minimum auth data needed for bootstrap
3. refresh-token or equivalent existing-auth-flow reuse instead of a major auth rewrite
4. graceful handling for expired or invalid persisted auth state
5. keeping role-aware redirects and protected routes working after refresh
6. any small supporting utilities/hooks/components needed to keep the architecture clean
7. documentation updates if setup, behavior, or auth expectations change

## Out of Scope
Do not include yet:
- cookie-based auth refactor
- OAuth or social login
- major backend auth redesign unrelated to bootstrap persistence
- wishlist, reviews, coupons, or checkout refactors unrelated to auth persistence
- broad frontend test expansion unless a very small supporting test is clearly needed

## Files / Areas Likely Involved
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/app/store.js`
- `client/src/features/auth/authSlice.js`
- `client/src/features/auth/api/authApi.js`
- `client/src/components/layout/ProtectedRoute.jsx`
- `client/src/components/layout/RoleProtectedRoute.jsx`
- `client/src/router/index.jsx`
- optional small auth bootstrap utility files
- `README.md`
- `CHAT_CONTEXT_HANDOFF.md`

## Acceptance Criteria
- [ ] Refreshing the page does not immediately lose the intended authenticated experience when valid auth state can be restored
- [ ] The bootstrap logic reuses the existing backend auth flow cleanly
- [ ] Invalid or expired persisted auth state is cleared safely without broken UI loops
- [ ] Protected user routes still require valid auth after bootstrap completes
- [ ] Admin role-aware routing still behaves correctly after refresh/bootstrap
- [ ] Persistence avoids unnecessary or overly unsafe auth storage decisions
- [ ] Any important auth behavior changes are documented

## Constraints / Preferences
- keep the current layered and feature-based architecture
- prefer small, explicit auth bootstrap utilities over clever abstractions
- avoid unsafe persistence patterns for sensitive data when a safer minimal approach works
- do not introduce a major backend refactor if the current refresh/me flow can support the goal
- keep route/loading behavior understandable for recruiters and reviewers reading the code
- assume Docker is available, but this task is feature development, not Docker troubleshooting

## Notes
Current important context:
- Docker is working now
- demo credentials are:
  - Admin: `admin@novastore.dev`
  - User: `user@novastore.dev`
  - Password: `NovaStore123!`
- the repo now already includes:
  - cart and checkout simulation
  - authenticated order history and order detail
  - admin stock adjustment flow
  - audit logging groundwork for admin product actions
- auth persistence is explicitly called out in `CHAT_CONTEXT_HANDOFF.md` as the next important gap
- read `NEXT_CHAT_INSTRUCTIONS.md` first in the next chat before making changes
