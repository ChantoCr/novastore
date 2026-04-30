# Next Task Prompt — NOVA Store

## Objective
Implement backend auth and product integration tests with Supertest for the current Express API.

## Why
The project now has working authentication flows, role-aware frontend routing, categories, and an admin product management UI. The highest-value next improvement is backend integration coverage for security-sensitive and business-critical endpoints.

This task matters because it will:
- validate login and authenticated-user behavior against the real API
- confirm admin-only product access is enforced on the backend
- verify request validation behavior for product mutations
- strengthen portfolio quality by showing real API test discipline

## Scope
Include:
1. server-side test setup for integration testing
2. auth login success test
3. auth login failure test
4. authenticated `/api/auth/me` test
5. admin-only product route protection tests
6. product create or update validation tests for invalid payloads
7. any minimal supporting test utilities or scripts needed to run the tests cleanly

## Out of Scope
Do not include yet:
- frontend test expansion beyond what already exists
- cookie-based auth refactor
- audit log feature implementation
- checkout, orders, coupons, wishlist, or reviews tests
- major production refactors unrelated to testability

## Files / Areas Likely Involved
- `server/package.json`
- `server/src/app.js`
- `server/src/routes/auth.routes.js`
- `server/src/routes/product.routes.js`
- `server/src/services/...`
- `server/src/repositories/...`
- `server/src/middlewares/...`
- `server/tests/...` or a similarly clean backend test folder
- optional test env/setup files

## Acceptance Criteria
- [ ] Backend test runner and Supertest setup exists and is documented if needed
- [ ] A passing integration test verifies successful login with seeded demo credentials
- [ ] A passing integration test verifies invalid login is rejected safely
- [ ] A passing integration test verifies `/api/auth/me` requires valid auth and returns the authenticated user
- [ ] A passing integration test verifies non-admin access is blocked from admin product routes
- [ ] A passing integration test verifies invalid product payloads return validation errors
- [ ] Tests can be run with a clear command from the server workspace or repository root

## Constraints / Preferences
- keep the current layered backend architecture
- prefer small, focused test utilities
- do not hardcode secrets beyond documented demo credentials already used by the project
- avoid unnecessary libraries beyond a normal backend test stack
- keep security behavior explicit in tests
- document important test commands if setup changes
- assume Docker is available, but keep tests understandable for local runs too

## Notes
Current important context:
- Docker is working now
- the project already has valid seeded demo users
- demo credentials are:
  - Admin: `admin@novastore.dev`
  - User: `user@novastore.dev`
  - Password: `NovaStore123!`
- auth and admin product flows already exist and should be the first backend-tested surfaces
- read `NEXT_CHAT_INSTRUCTIONS.md` first in the next chat before making changes
