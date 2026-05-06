# Next Task Prompt — NOVA Store

## Objective
Implement wishlist groundwork for authenticated users across the existing catalog architecture.

## Why
The repository already supports product browsing, cart flows, checkout simulation, order history, and a solid admin back office. The next strong user-facing gap is wishlist support so shoppers can save products without committing them to the cart immediately.

This task matters because it will:
- extend the shopping journey beyond immediate purchase intent
- use the existing `wishlist_items` schema in a realistic way
- strengthen the account-area and product-experience story
- align naturally with the planned wishlist and reviews phase

## Scope
Include:
1. protected backend wishlist list, add, and remove flows
2. validation for wishlist payloads where relevant
3. RTK Query wishlist integration on the frontend
4. user-facing wishlist UI actions from product cards, product detail, and/or a dedicated wishlist view
5. loading, empty, error, and success states where relevant
6. documentation updates if routes, architecture notes, or capabilities change

## Out of Scope
Do not include yet:
- a full reviews system unless absolutely necessary
- major cart or checkout rewrites unrelated to wishlist behavior
- guest wishlist persistence across devices
- complex recommendation logic
- broad account dashboard redesign unrelated to wishlist support

## Files / Areas Likely Involved
- `server/src/routes/`
- `server/src/controllers/`
- `server/src/services/`
- `server/src/repositories/`
- `server/src/validators/`
- `client/src/features/wishlist/`
- `client/src/features/products/`
- `client/src/pages/`
- `client/src/router/index.jsx`
- `client/src/services/baseApi.js`
- `README.md`
- `CHAT_CONTEXT_HANDOFF.md`

## Acceptance Criteria
- [ ] Authenticated wishlist backend routes exist
- [ ] Wishlist add/remove behavior is protected on the backend
- [ ] Frontend wishlist data flow uses RTK Query cleanly
- [ ] Users can save and remove products from a visible wishlist UI
- [ ] Loading, empty, error, and success states are present where relevant
- [ ] Documentation stays aligned if routes or capabilities change

## Constraints / Preferences
- keep the layered backend architecture intact
- keep the frontend feature-based and RTK Query based
- prefer explicit wishlist state handling over clever abstractions
- do not trust product ownership or user identity from the frontend
- assume Docker is available when the environment supports it, but treat this as feature development work

## Notes
Current important context:
- auth/session bootstrap persistence is implemented
- checkout flow has clearer UX, result states, and add-to-cart toast feedback
- admins can manage categories and products, inspect platform-wide orders, update order statuses, and review read-only audit logs
- category management is now in place, so the next strong user-facing phase gap is wishlist support
- read `NEXT_CHAT_INSTRUCTIONS.md` first in the next chat before making changes
