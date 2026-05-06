# Testing Skill — NOVA Store

## Purpose
Use this skill when adding tests for frontend, backend, APIs, auth, cart, orders, and admin behavior.

## Tools
- Vitest or Jest
- React Testing Library
- Supertest

## Backend Tests
Test:
- Auth register
- Auth login
- Protected routes
- Role authorization
- Product endpoints
- Cart/checkout logic
- Coupon validation
- Order creation

## Frontend Tests
Test:
- Login form
- Product card
- Cart behavior
- Protected route behavior
- Admin-only route blocking

## Rules
- Test critical business logic first.
- Test security-sensitive behavior.
- Test checkout calculations.
- Use meaningful test names.
- Prefer deterministic data and isolated setups.

## Suggested Priorities
1. Auth and authorization
2. Checkout total calculation
3. Stock validation
4. Order creation flow
5. Admin restrictions
6. Admin order status update rules and audit-log access restrictions

## Avoid
- Testing only visual rendering.
- Ignoring auth and authorization tests.
- Writing tests that depend on random data.
- Relying only on manual testing for critical flows.
