# Admin Skill — NOVA Store

## Purpose
Use this skill when working on admin dashboard, product management, stock management, users, orders, coupons, metrics, and audit logs.

## Admin Features
- Dashboard overview
- Product CRUD
- Product activation/deactivation
- Stock management
- Price management
- Order management
- User management
- Coupon management
- Audit logs
- Low stock alerts

## Dashboard Metrics
Show:
- Total simulated revenue
- Total orders
- Active products
- Low stock products
- Registered users
- Best-selling products
- Recent orders
- Recent admin actions

## Rules
- Admin routes must be protected both in frontend and backend.
- Every important admin action should create an audit log.
- Product delete should be soft delete.
- Admin UI should be clean and dashboard-like.
- Use tables, cards, filters, and search.
- Show confirmation for sensitive actions.
- Admin order status changes should be explicit, constrained, and audit logged.
- Audit log screens should be read-only unless a future requirement says otherwise.

## Suggested Admin Modules
- Dashboard
- Products
- Orders
- Users
- Coupons
- Audit Logs
- Settings (optional later)

## Order Management Notes
- Admins should be able to inspect any order, customer identity, item-level pricing, totals, and payment metadata.
- Status updates should be handled with controlled options, not free-form editing.
- Important order state changes should appear in audit logs.

## Avoid
- Giving admin powers to normal users.
- Trusting frontend role checks only.
- Permanent destructive actions unless explicitly required.
- Hiding critical stock or order changes from audit tracking.
