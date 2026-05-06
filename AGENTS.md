# AGENTS.md — NOVA Store

## Project Name
NOVA Store

## Project Type
Fullstack e-commerce portfolio project built to demonstrate senior-level architecture, security, frontend state management, backend structure, database design, admin workflows, DevOps readiness, and professional documentation.

## Main Goal
Build a professional fullstack virtual store that feels like a real production-grade e-commerce platform, not just a simple shopping cart demo.

The system must include:

- React.js frontend
- Node.js backend
- MySQL local database
- Authentication and authorization
- User roles
- Admin dashboard
- Product management
- Cart and checkout simulation
- Orders
- Wishlist
- Reviews and ratings
- Coupons
- Advanced filters
- Image upload
- Notifications
- Audit logs
- Testing
- Docker
- Professional documentation

## Product Vision
NOVA Store is an advanced e-commerce dashboard and shopping platform where users can browse, buy with simulated payments, review products, save favorites, and manage their profile.

Admins can manage products, stock, orders, users, coupons, and audit logs.

The project must be visually impressive, technically clean, secure, scalable, and understandable for senior developers reviewing the portfolio.

## Technology Stack

### Frontend
- React.js
- JavaScript
- Vite
- React Router
- Redux Toolkit
- RTK Query
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- Lucide React
- Recharts

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- Refresh tokens
- bcrypt
- Zod or Joi
- Helmet
- CORS
- Express Rate Limit
- Multer or Cloudinary-style local upload abstraction

### Database
- MySQL
- MySQL Workbench
- SQL migrations or schema files
- Seed files

### DevOps / Quality
- Docker
- Docker Compose
- ESLint
- Prettier
- Jest or Vitest
- Supertest
- React Testing Library
- Professional README

## High-Level Repository Structure

```txt
nova-store/
├── AGENTS.md
├── skills/
│   ├── frontend/SKILL.md
│   ├── backend/SKILL.md
│   ├── database/SKILL.md
│   ├── security/SKILL.md
│   ├── redux/SKILL.md
│   ├── admin/SKILL.md
│   ├── ecommerce/SKILL.md
│   ├── testing/SKILL.md
│   ├── docker/SKILL.md
│   └── documentation/SKILL.md
├── client/
├── server/
└── database/
```

## Architecture Rules

### General Rules
- Keep frontend and backend separated.
- Use clear folder structure.
- Avoid placing business logic directly inside route files or React components.
- Prefer reusable services, hooks, components, and utilities.
- Code must be readable for a junior/mid developer but structured like a senior project.
- Every major feature must have a clear responsibility.
- Do not create oversized files.
- Avoid duplicated logic.
- Prioritize maintainability over quick hacks.
- Prefer explicit naming over clever abstractions.
- Keep decisions consistent across features.

### Frontend Rules
- Use feature-based structure.
- Use Redux Toolkit for global state.
- Use RTK Query for API communication.
- Use React Router for navigation and protected routes.
- Use layouts for public, user, and admin sections.
- Use reusable UI components.
- Use Tailwind CSS and shadcn/ui for professional UI.
- Use dark mode.
- Use loading, empty, error, and success states.
- Avoid direct API calls inside components when RTK Query is available.
- Keep page components focused on composition, not complex logic.

### Backend Rules
- Use controllers, services, routes, middlewares, validators, and models/repositories.
- Controllers should handle request/response only.
- Services should contain business logic.
- Middlewares should handle authentication, authorization, validation, and errors.
- Never store plain-text passwords.
- Use bcrypt for password hashing.
- Use JWT access tokens and refresh tokens.
- Use role-based authorization.
- Validate incoming data.
- Use centralized error handling.
- Use environment variables.
- Log operational errors safely without leaking secrets.

### Database Rules
- Use relational design.
- Use foreign keys where appropriate.
- Include created_at and updated_at fields.
- Use soft delete for products.
- Track stock changes.
- Track admin actions with audit logs.
- Seed the database with demo users, categories, products, coupons, and orders.
- Use indexes for common filters such as category, slug, email, and order status.

## User Roles

### Guest
Can:
- Visit landing page
- Browse public products
- View product details
- Register
- Login

Cannot:
- Checkout
- Add reviews
- Access user dashboard
- Access admin routes

### User
Can:
- Browse products
- Add to cart
- Use wishlist
- Checkout with simulated payment
- View order history
- Add reviews and ratings
- Edit profile
- Receive notifications

Cannot:
- Access admin dashboard
- Modify products
- Modify users
- Modify orders

### Admin
Can:
- Access admin dashboard
- Create, update, activate, deactivate products
- Manage prices
- Manage stock
- View users
- View orders
- View order detail with item-level pricing and payment metadata
- Update order fulfillment status
- Manage coupons
- View audit logs
- View metrics

## Main Features

### 1. Auth & Security
- Register
- Login
- Logout
- Refresh token
- Protected routes
- Role-based access
- Password hashing
- Rate limiting
- Validation
- Secure HTTP headers

### 2. Product Catalog
- Product listing
- Product details
- Categories
- Search
- Filters
- Sorting
- Pagination
- Stock status

### 3. Cart & Checkout
- Add to cart
- Update quantity
- Remove item
- Cart summary
- Simulated checkout
- Payment approved/rejected simulation
- Order creation

### 4. Orders
- User order history
- Order detail
- Admin order list
- Admin order detail
- Order status management

### 5. Admin Dashboard
- Sales simulation metrics
- Orders summary
- Best-selling products
- Low stock products
- Recent users
- Recent admin actions

### 6. Product Management
- Create product
- Edit product
- Update price
- Manage stock
- Upload image
- Soft delete / deactivate product

### 7. Wishlist
- Add product to favorites
- Remove from favorites
- View wishlist

### 8. Reviews & Ratings
- User can review purchased products
- Product average rating
- Admin can moderate reviews if needed

### 9. Coupons
- Create coupons
- Validate coupon
- Apply discount
- Expiration date
- Usage limit

### 10. Notifications
- User notifications for orders
- Admin notifications for low stock
- Notification read/unread state

### 11. Audit Logs
Track important admin actions:
- Product created
- Product updated
- Price changed
- Product deactivated
- Stock changed
- Coupon created
- Order status changed
- Audit log listing should be protected and read-only by default

### 12. Testing
- Backend unit tests
- Backend integration tests
- Frontend component tests
- Auth flow tests
- Cart flow tests

### 13. Docker
- Dockerfile for frontend
- Dockerfile for backend
- Docker Compose with MySQL
- Environment variables example

### 14. Documentation
- Professional README
- Project architecture explanation
- Setup instructions
- API endpoints
- Database schema
- Screenshots
- Demo users
- Roadmap

## Development Phases

### Phase 1 — Setup & Base Architecture
- Create monorepo structure
- Setup frontend with Vite
- Setup backend with Express
- Setup MySQL database files
- Setup environment variables
- Setup ESLint and Prettier

### Phase 2 — Auth, Roles & Security
- User registration
- User login
- Password hashing
- JWT access token
- Refresh token
- Auth middleware
- Role middleware
- Protected frontend routes

### Phase 3 — Products & Categories
- Product database schema
- Category schema
- Product API
- Product listing page
- Product detail page
- Search and basic filters

### Phase 4 — Cart & Checkout Simulation
- Redux cart slice
- Cart page
- Checkout page
- Simulated payment logic
- Order creation

### Phase 5 — Orders & User Profile
- User orders
- Order detail
- Profile page
- Edit user profile

### Phase 6 — Admin Panel
- Admin layout
- Admin dashboard
- Product management
- User list
- Order list

### Phase 7 — Stock & Audit Logs
- Stock management
- Low stock indicators
- Audit log table
- Audit log API
- Admin audit log screen

### Phase 8 — Wishlist & Reviews
- Wishlist API
- Wishlist UI
- Reviews API
- Reviews UI
- Rating average

### Phase 9 — Coupons & Advanced Filters
- Coupons API
- Coupon validation
- Discount calculation
- Advanced filters
- Sorting
- Pagination

### Phase 10 — Image Upload & Notifications
- Product image upload
- Local upload handling
- User notifications
- Admin notifications

### Phase 11 — Testing
- Backend tests
- Frontend tests
- Auth tests
- Cart tests
- API tests

### Phase 12 — Docker & Professional README
- Docker setup
- Docker Compose
- Final README
- Screenshots
- Portfolio presentation notes

## Suggested API Domains
- `/api/auth`
- `/api/users`
- `/api/products`
- `/api/categories`
- `/api/cart`
- `/api/checkout`
- `/api/orders`
- `/api/wishlist`
- `/api/reviews`
- `/api/coupons`
- `/api/notifications`
- `/api/admin`
- `/api/audit-logs`

## Definition of Done
A feature should be considered complete only when:
- The architecture follows the relevant skill file.
- Validation and error handling are included.
- Security implications were considered.
- Loading and empty states exist where relevant.
- Database changes include schema and seed updates when needed.
- Documentation is updated when behavior or structure changes.
- The feature is testable and critical flows are covered.

## AI Agent Instructions

When working on this project, always:

1. Check the relevant skill file before coding.
2. Keep the architecture consistent.
3. Respect the current development phase.
4. Do not skip security decisions.
5. Do not create quick hacks if a clean architecture is possible.
6. Explain important decisions clearly.
7. Prefer small, focused changes.
8. Keep code modular.
9. Update documentation when architecture changes.
10. Avoid introducing libraries unless they clearly improve the project.
11. Favor realistic portfolio-quality implementations over unnecessary complexity.

## Preferred Implementation Style

The agent should work like a senior mentor:

- Explain what will be changed.
- Provide clean code.
- Mention where each file goes.
- Explain why the decision was made.
- Warn about security or architecture risks.
- Keep the project impressive but realistic.

## Forbidden Practices

Do not:

- Store passwords in plain text.
- Put all backend logic inside route files.
- Put all frontend logic inside pages.
- Skip validation.
- Skip error handling.
- Mix admin and user logic carelessly.
- Use fake security only on the frontend.
- Hardcode secrets.
- Ignore environment variables.
- Delete products permanently unless explicitly required.
- Build features without considering database structure.
- Trust money, stock, or role values coming from the frontend.

## Skill Usage Map
- Use `skills/frontend/SKILL.md` for React, UI, routing, and layouts.
- Use `skills/backend/SKILL.md` for Express, controllers, services, and APIs.
- Use `skills/database/SKILL.md` for MySQL schema, relations, and seed design.
- Use `skills/security/SKILL.md` for auth, authorization, and validation-sensitive work.
- Use `skills/redux/SKILL.md` for global state and RTK Query.
- Use `skills/admin/SKILL.md` for admin workflows and auditability.
- Use `skills/ecommerce/SKILL.md` for shopping, checkout, and order rules.
- Use `skills/testing/SKILL.md` for test strategy and critical coverage.
- Use `skills/docker/SKILL.md` for containerization.
- Use `skills/documentation/SKILL.md` for README and portfolio explanation.
