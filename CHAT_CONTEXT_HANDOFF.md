# Chat Context Handoff — NOVA Store

## Purpose
This file summarizes the important project history and the latest completed work so a new chat can continue without losing context.

---

## Project Overview
NOVA Store is a fullstack e-commerce portfolio project with:
- React + Vite frontend
- Node + Express backend
- MySQL database
- JWT auth with refresh tokens
- Role-based access control
- Admin and e-commerce architecture
- Docker support
- Professional project documentation

The main architecture and working rules are defined in:
- `README.md`
- `AGENTS.md`
- `skills/`

---

## Historical Foundation Already In The Repo
These were already created in earlier work and remain part of the current project state.

### 1) AI project guidance and architecture docs
Created:
- `AGENTS.md`
- `skills/frontend/SKILL.md`
- `skills/backend/SKILL.md`
- `skills/database/SKILL.md`
- `skills/security/SKILL.md`
- `skills/redux/SKILL.md`
- `skills/admin/SKILL.md`
- `skills/ecommerce/SKILL.md`
- `skills/testing/SKILL.md`
- `skills/docker/SKILL.md`
- `skills/documentation/SKILL.md`

### 2) Base project scaffolding
Created root structure:
- `client/`
- `server/`
- `database/`

### 3) Documentation and starter setup
Created:
- `README.md`
- `.env.example`
- `.gitignore`
- `.dockerignore`
- `Dockerfile.client`
- `Dockerfile.server`
- `docker-compose.yml`

### 4) Frontend base scaffold
Created:
- `client/package.json`
- `client/index.html`
- `client/vite.config.js`
- `client/tailwind.config.js`
- `client/postcss.config.js`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/app/store.js`
- `client/src/app/themeSlice.js`
- `client/src/app/hooks.js`
- `client/src/layouts/PublicLayout.jsx`
- `client/src/router/index.jsx`
- `client/src/pages/HomePage.jsx`
- `client/src/styles/index.css`

### 5) Backend base scaffold
Created:
- `server/package.json`
- `server/src/app.js`
- `server/src/server.js`
- `server/src/config/env.js`
- `server/src/config/db.js`
- `server/src/controllers/health.controller.js`
- `server/src/routes/health.routes.js`
- `server/src/routes/index.js`
- `server/src/middlewares/errorHandler.js`
- `server/src/utils/apiResponse.js`

### 6) Database schema and seed files
Created:
- `database/init/01-schema.sql`
- `database/init/02-seed.sql`
- `database/migrations/001_initial_schema.sql`
- `database/seeds/001_demo_seed.sql`
- `database/README.md`

### 7) Auth module skeleton
Backend:
- `server/src/controllers/auth.controller.js`
- `server/src/routes/auth.routes.js`
- `server/src/services/auth.service.js`
- `server/src/repositories/user.repository.js`
- `server/src/repositories/refreshToken.repository.js`
- `server/src/validators/auth.validators.js`
- `server/src/middlewares/authenticateToken.js`
- `server/src/middlewares/authorizeRoles.js`
- `server/src/middlewares/validateRequest.js`
- `server/src/utils/appError.js`
- `server/src/utils/asyncHandler.js`
- `server/src/utils/jwt.js`

Frontend:
- `client/src/features/auth/authSlice.js`
- `client/src/features/auth/api/authApi.js`
- `client/src/features/auth/components/AuthSection.jsx`
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/RegisterPage.jsx`
- `client/src/components/layout/ProtectedRoute.jsx`
- `client/src/components/layout/RoleProtectedRoute.jsx`

### 8) Products module skeleton
Backend:
- `server/src/controllers/product.controller.js`
- `server/src/routes/product.routes.js`
- `server/src/services/product.service.js`
- `server/src/repositories/product.repository.js`
- `server/src/validators/product.validators.js`

Frontend:
- `client/src/features/products/api/productsApi.js`
- `client/src/features/products/components/ProductCard.jsx`
- `client/src/features/products/components/ProductGrid.jsx`
- `client/src/pages/ProductsPage.jsx`
- `client/src/pages/ProductDetailPage.jsx`
- `client/src/utils/currency.js`

### 9) Code quality tooling
Created:
- root `package.json` with npm workspaces
- `eslint.config.js`
- `.prettierrc.json`
- `.prettierignore`

### 10) Password hash helper
Created:
- `server/scripts/generate-password-hash.js`

---

## Latest Chat — What Was Added / Updated
This is the most recent implementation work and should be treated as the current working baseline.

### 1) Role-aware authentication UX is now working
Implemented:
- login redirect based on backend role
- admin users go to `/admin/products`
- normal users go to `/account`
- authenticated header state in the public layout
- logout button in the header
- role-aware protected route behavior

Updated files:
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/RegisterPage.jsx`
- `client/src/layouts/PublicLayout.jsx`
- `client/src/components/layout/RoleProtectedRoute.jsx`
- `client/src/router/index.jsx`

### 2) Auth forms now use React Hook Form + Zod
Added reusable validated forms:
- `client/src/features/auth/components/LoginForm.jsx`
- `client/src/features/auth/components/RegisterForm.jsx`
- `client/src/features/auth/validation/authFormSchemas.js`

Notes:
- validation messages now render in the UI
- form state is no longer managed manually in page components

### 3) Categories module was implemented
Backend:
- `server/src/routes/category.routes.js`
- `server/src/controllers/category.controller.js`
- `server/src/services/category.service.js`
- `server/src/repositories/category.repository.js`

Frontend:
- `client/src/features/categories/api/categoriesApi.js`
- `client/src/pages/ProductsPage.jsx`

Behavior:
- public catalog now loads real categories from `/api/categories`
- category filter uses seeded category data

### 4) Admin product management UI was added
New files:
- `client/src/layouts/AdminLayout.jsx`
- `client/src/pages/AdminProductsPage.jsx`
- `client/src/features/admin/components/AdminProductForm.jsx`
- `client/src/features/admin/components/AdminProductsTable.jsx`
- `client/src/features/admin/validation/productFormSchema.js`

Behavior:
- admin-only route at `/admin/products`
- admin product list supports search, category filter, status filter, sort, and pagination
- admin can create products
- admin can update products
- admin can toggle active/inactive status
- public and admin product lists use separate RTK Query tags

### 5) Backend support for managed product listing was added
Updated files:
- `server/src/controllers/product.controller.js`
- `server/src/services/product.service.js`
- `server/src/repositories/product.repository.js`
- `server/src/routes/product.routes.js`
- `server/src/validators/product.validators.js`
- `server/src/routes/index.js`

New backend behavior:
- `GET /api/products/manage` for admin-only managed catalog access
- status filtering for `all`, `active`, and `inactive`
- public product list still only returns active, non-deleted products

### 6) Auth and product frontend tests were added
Created:
- `client/src/features/auth/components/LoginForm.test.jsx`
- `client/src/features/products/components/ProductCard.test.jsx`
- `client/src/test/setup.js`
- `client/src/test/test-utils.jsx`

Updated:
- `client/package.json`
- `client/vite.config.js`

Current frontend test coverage includes:
- login form validation
- login form submit behavior
- product card rendering

### 7) Account page was added
Created:
- `client/src/pages/AccountPage.jsx`

Behavior:
- shows authenticated user data from Redux auth state
- confirms the current role and access level

### 8) Docker issue was diagnosed and fixed
Problem encountered:
- Vite inside Docker could not resolve `@hookform/resolvers/zod`
- root cause was stale named Docker volumes for `node_modules`
- the container had updated source code but outdated installed dependencies

Fix applied:
- updated `docker-compose.yml`
- client and server now run `npm install && npm run dev` on startup

Effect:
- bind-mounted development containers are less likely to break after adding dependencies

Important Docker recovery commands:
```bash
docker compose restart client server
```

If named volumes are stale:
```bash
docker compose down -v
docker compose up --build
```

### 9) Documentation was updated
Updated:
- `README.md`
- `database/README.md`
- `database/init/02-seed.sql`
- `database/seeds/001_demo_seed.sql`

Notes:
- outdated placeholder-password wording was corrected
- Docker guidance was updated to reflect the new dependency-sync behavior

### 10) Backend integration test setup was added
Created:
- `server/tests/auth.test.js`
- `server/tests/product.test.js`
- `server/tests/helpers/auth.js`
- `server/tests/helpers/db.js`
- `server/scripts/run-tests.js`
- `.env.test.example`

Updated:
- `.gitignore`
- `server/package.json`
- `server/src/config/env.js`
- root `package.json`
- `README.md`

Behavior:
- backend now has a Supertest integration test setup using the Node.js test runner
- tests cover login success, login failure, authenticated `/api/auth/me`, admin-only product protection, and invalid product mutation payloads
- root command: `npm run test:server`
- Docker shortcut: `npm run test:server:docker`
- server workspace command: `npm run test:run`
- backend env loading now supports a root `.env.test` override during tests, which helps host-machine test runs use `DB_HOST=localhost` without breaking the default Docker `.env`

---

## Current Demo Credentials
These are valid and documented.

- Admin: `admin@novastore.dev`
- User: `user@novastore.dev`
- Password for both: `NovaStore123!`

---

## Current Working Application State

### Frontend routes
Public:
- `/`
- `/login`
- `/register`
- `/products`
- `/products/:productIdOrSlug`

Authenticated:
- `/account`

Admin:
- `/admin/products`

### Backend routes
Health:
- `GET /api/health`
- `GET /api/health/db`

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Categories:
- `GET /api/categories`

Products:
- `GET /api/products`
- `GET /api/products/manage` admin-only
- `GET /api/products/:productIdOrSlug`
- `POST /api/products` admin-only
- `PATCH /api/products/:productIdOrSlug` admin-only
- `DELETE /api/products/:productIdOrSlug` admin-only scaffold / soft-delete path

---

## Validation Completed Successfully
Completed and passing after the latest work:
- `npm run lint`
- `npm run build -w client`
- `npm run test:run -w client`
- selected server-side `node --check` syntax validation

---

## Important Technical Notes / Constraints

### 1) Docker is now working
This is different from earlier context.

Current state:
- Docker is available
- the app is running with Docker
- use Docker as the primary local dev path unless the user explicitly asks for manual MySQL support

### 2) `.env` host expectations depend on runtime
For Docker runs:
```env
DB_HOST=mysql
```

For manual local MySQL runs:
```env
DB_HOST=localhost
```

### 3) Auth persistence is still basic
Important limitation:
- auth state is still primarily Redux memory state
- role-aware login and routing work
- longer-term session persistence/bootstrap strategy can still be improved later

### 4) Admin deactivate vs delete behavior
Current admin UI uses `PATCH` with `isActive` toggling.
That was intentional because the `DELETE` endpoint soft-deletes products by setting `deleted_at`, which removes them from normal managed listings.

### 5) Keep architecture aligned with skill files
Do not break these patterns:
- backend: routes -> controllers -> services -> repositories
- frontend: feature-based structure, RTK Query for server data
- validation in validators / schemas, not ad-hoc inside routes/pages

---

## Recommended Next Task
The recommended next implementation is:

### Backend auth/product integration tests with Supertest
Reason:
- auth and admin product flows are now important and security-sensitive
- backend verification will give the strongest quality improvement for the current state of the app
- this aligns directly with `skills/testing/SKILL.md` and `skills/security/SKILL.md`

Recommended scope:
1. test setup for server
2. auth login and `/api/auth/me` tests
3. admin product authorization tests
4. product validation tests

---

## Suggested Implementation Priorities After That
After backend integration tests, the next strong options are:
1. audit logs for admin product actions
2. improved session bootstrap / persistence strategy
3. categories admin CRUD
4. stock and audit-log focused admin improvements

---

## Caution For The Next Assistant
Before coding in the next chat:
- read files in the exact order defined by `NEXT_CHAT_INSTRUCTIONS.md`
- execute the task from `NEXT_TASK_PROMPT.md`
- assume Docker is available unless the user says otherwise
- if a Docker-only dependency import issue appears, check the named `node_modules` volumes first
- keep documentation in sync when architecture or setup changes
- do not introduce quick hacks that bypass the layered backend or RTK Query frontend patterns
