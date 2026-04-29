# E-commerce Skill — NOVA Store

## Purpose
Use this skill when working on shopping flows, products, cart, checkout, orders, coupons, reviews, wishlist, and user experience.

## Shopping Flow
1. User browses products.
2. User filters/searches products.
3. User opens product details.
4. User adds product to cart.
5. User applies coupon if available.
6. User checks out using simulated payment.
7. Backend creates order.
8. Stock is reduced.
9. Notification is created.
10. User can view order history.

## Simulated Payment
Payment can return:
- approved
- rejected
- pending

Use fake card examples for demo purposes only.

## Product Experience
Include:
- Product images
- Price
- Stock status
- Category
- Rating average
- Reviews
- Wishlist button
- Add to cart button

## Coupons
Support:
- Percentage discount
- Fixed discount
- Expiration date
- Usage limit
- Minimum purchase amount

## Rules
- Never allow checkout with empty cart.
- Never allow checkout if stock is insufficient.
- Always calculate final totals on the backend.
- Do not trust frontend totals.
- Reduce stock only after order/payment simulation succeeds.
- Keep order history immutable except for controlled status updates.

## Avoid
- Trusting cart total from frontend.
- Allowing negative stock.
- Allowing reviews from users who never purchased the product, unless intentionally allowed.
- Applying expired or overused coupons.
