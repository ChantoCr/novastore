# Database Skill — NOVA Store

## Purpose
Use this skill when designing or modifying MySQL tables, relationships, schema files, seed files, indexes, and database rules.

## Database
- MySQL
- MySQL Workbench

## Core Tables

```txt
users
roles
user_roles
categories
products
product_images
cart_items
orders
order_items
payments_simulated
wishlist_items
reviews
coupons
coupon_usages
notifications
audit_logs
stock_movements
refresh_tokens
```

## Rules
- Use relational design.
- Use foreign keys where appropriate.
- Use indexes for frequently queried columns.
- Use created_at and updated_at.
- Use soft delete fields when needed.
- Avoid permanently deleting important business records.
- Use clear naming conventions.
- Prefer integer primary keys and unique slugs where useful.

## Important Fields

### users
- id
- name
- email
- password_hash
- is_active
- created_at
- updated_at

### products
- id
- category_id
- name
- slug
- description
- price
- stock
- is_active
- deleted_at
- created_at
- updated_at

### orders
- id
- user_id
- status
- subtotal
- discount_total
- tax_total
- total
- payment_status
- created_at
- updated_at

### audit_logs
- id
- admin_user_id
- action
- entity_type
- entity_id
- old_value
- new_value
- created_at

## Suggested Relationship Notes
- A user can have one or more roles, but start with one effective role if implementation is simpler.
- A category has many products.
- A product can have many product_images.
- An order belongs to one user and has many order_items.
- A review belongs to a user and a product.
- A coupon can have many coupon_usages.
- Audit logs should reference the admin who performed the action.

## Seed Data
Include:
- Admin user
- Normal user
- Categories
- Products
- Coupons
- Sample orders

## Migration & Schema Expectations
- Keep schema files versioned and readable.
- Make destructive changes explicit.
- Update seeds if a schema change affects demo flows.
- Document enum-like fields such as order_status and payment_status.

## Avoid
- Storing plain-text passwords.
- Deleting orders permanently.
- Using vague column names.
- Ignoring relationships.
- Forgetting indexes on email, slug, foreign keys, and common filters.
