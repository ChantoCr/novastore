# Next Task Prompt — NOVA Store

## Objective
Implement reviews groundwork for authenticated users within the current product and order architecture.

## Why
The repository now supports category management, product management, coupon management, advanced catalog filters, notification visibility, wishlist behavior, and upload-ready product image handling. The next strong commerce layer is product reviews so shoppers can leave feedback and future reviewers can see trust signals on product detail pages.

This task matters because it will:
- enrich product-detail experience with user-generated feedback
- connect the shopping flow to post-purchase behavior
- strengthen the portfolio story around business rules and relational data
- align naturally with the planned wishlist and reviews phase

## Scope
Include:
1. backend review listing and creation flows
2. validation for review payloads
3. purchase-aware restrictions if feasible with the current order schema
4. frontend review UI on product detail and/or account-adjacent flows
5. loading, empty, error, and success states where relevant
6. documentation updates if routes, architecture notes, or capabilities change

## Out of Scope
Do not include yet:
- a complex moderation dashboard unless clearly needed
- broad redesigns of the product catalog unrelated to reviews
- fake frontend-only purchase checks
- advanced rating analytics
- unrelated image-upload or notification work unless absolutely necessary

## Files / Areas Likely Involved
- `server/src/routes/`
- `server/src/controllers/`
- `server/src/services/`
- `server/src/repositories/`
- `server/src/validators/`
- `client/src/features/reviews/`
- `client/src/pages/`
- `client/src/features/products/`
- `README.md`
- `CHAT_CONTEXT_HANDOFF.md`

## Acceptance Criteria
- [ ] Backend review routes exist for relevant product/user flows
- [ ] Review creation is protected on the backend
- [ ] Validation protects review payloads
- [ ] Frontend exposes review listing and submission UI cleanly
- [ ] Loading, empty, error, and success states are present where relevant
- [ ] Documentation stays aligned if routes or capabilities change

## Constraints / Preferences
- keep the layered backend architecture intact
- keep the frontend feature-based and RTK Query based
- prefer explicit review business rules over clever abstractions
- do not trust purchase eligibility from the frontend
- assume Docker is available when the environment supports it, but treat this as feature development work

## Notes
Current important context:
- auth/session bootstrap persistence is implemented
- category management, wishlist groundwork, advanced filters, coupon management, notification visibility, and image-upload groundwork are already in place
- product detail pages support add-to-cart and wishlist actions, while admin product management now has a first-step upload-ready media flow
- the next strong user-facing commerce gap is reviews and ratings
- read `NEXT_CHAT_INSTRUCTIONS.md` first in the next chat before making changes
