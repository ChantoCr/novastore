# NOVA Store

Professional fullstack e-commerce portfolio project designed to showcase senior-level architecture, secure backend design, modern frontend patterns, admin workflows, and production-minded documentation.

## Overview
NOVA Store is being built as a realistic virtual store and admin dashboard experience, not just a basic cart demo. The goal is to present a portfolio project that looks polished, feels scalable, and demonstrates strong engineering decisions across the frontend, backend, database, security, testing, and DevOps layers.

## Current Status
This repository currently includes:
- AI project guidance in `AGENTS.md`
- Specialized skill files in `skills/`
- Base frontend and backend scaffolding
- Starter Docker setup
- Starter MySQL schema and seed files
- Initial project documentation

Implementation of full business features will follow the development phases defined in `AGENTS.md`.

## Core Goals
- Build a premium fullstack e-commerce application
- Demonstrate clean frontend and backend separation
- Implement secure authentication and role-based authorization
- Support admin product, stock, order, and coupon management
- Show real-world architecture and documentation quality
- Keep the project portfolio-ready and recruiter-friendly

## Main Features Planned
- Authentication and authorization
- Product catalog with search, filters, sorting, and pagination
- Cart and simulated checkout
- Orders and order history
- Wishlist
- Reviews and ratings
- Coupons and discount handling
- Notifications
- Admin dashboard and metrics
- Audit logs
- Testing strategy for critical flows
- Docker-based local development

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Redux Toolkit
- RTK Query
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- Zod or Joi
- Helmet
- CORS
- Express Rate Limit

### Database
- MySQL
- SQL schema files
- Seed files

### Quality / DevOps
- Docker
- Docker Compose
- ESLint
- Prettier
- Vitest or Jest
- Supertest
- React Testing Library

## Project Structure

```txt
nova-store/
├── AGENTS.md
├── README.md
├── .env.example
├── Dockerfile.client
├── Dockerfile.server
├── docker-compose.yml
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── shared/
│       │   └── layout/
│       ├── features/
│       │   ├── auth/
│       │   ├── products/
│       │   ├── cart/
│       │   ├── orders/
│       │   ├── wishlist/
│       │   ├── reviews/
│       │   └── admin/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── router/
│       ├── services/
│       ├── styles/
│       └── utils/
├── server/
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       ├── app.js
│       └── server.js
├── database/
│   └── init/
│       ├── 01-schema.sql
│       └── 02-seed.sql
└── skills/
    ├── admin/SKILL.md
    ├── backend/SKILL.md
    ├── database/SKILL.md
    ├── docker/SKILL.md
    ├── documentation/SKILL.md
    ├── ecommerce/SKILL.md
    ├── frontend/SKILL.md
    ├── redux/SKILL.md
    ├── security/SKILL.md
    └── testing/SKILL.md
```

## Architecture Direction

### Frontend
- Feature-based structure
- Shared layouts for public, user, auth, and admin flows
- Redux Toolkit for global client state
- RTK Query for server communication
- Reusable UI components and premium dashboard styling

### Backend
- Layered architecture
- Routes -> controllers -> services -> repositories
- Centralized validation and error handling
- Secure auth and role checks
- Environment-based configuration

### Database
- Relational design with foreign keys
- Auditability for sensitive admin actions
- Soft delete for products
- Stock movement tracking
- Seed data for local demos

## Security Decisions
- Passwords must be hashed, never stored in plain text
- Access control must be enforced on the backend
- Rate limiting will protect auth-sensitive endpoints
- Helmet and CORS must be configured intentionally
- Checkout totals and stock validation must be calculated on the backend
- Refresh tokens should be stored and invalidated safely

## Local Development

### Prerequisites
- Node.js 20+
- npm 10+
- MySQL 8+ or Docker Desktop

### 1) Environment variables
Copy the example file and adjust values as needed:

```bash
cp .env.example .env
```

If you are on Windows PowerShell, you can also create `.env` manually from `.env.example`.

### 2) Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3) Database setup
Option A — Docker:
```bash
docker compose up --build
```

Option B — Manual MySQL import:
1. Create a database named `nova_store`
2. Run `database/init/01-schema.sql`
3. Run `database/init/02-seed.sql`

### 4) Run the apps manually
Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## Docker Setup
The project includes starter container files:
- `Dockerfile.client`
- `Dockerfile.server`
- `docker-compose.yml`

Start the stack:

```bash
docker compose up --build
```

Expected services:
- Client: `http://localhost:5173`
- Server: `http://localhost:5000`
- API health route: `http://localhost:5000/api/health`
- MySQL: `localhost:3306`

## Environment Variables
See `.env.example` for the full list.

Important values include:
- `SERVER_PORT`
- `CLIENT_PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `VITE_API_URL`

## Demo Data Notes
The seed file includes starter roles, categories, products, coupons, and demo users.

Important:
- Demo user password hashes are placeholders in the SQL seed.
- Before using end-to-end authentication, replace them with real bcrypt hashes generated by the backend.

Suggested demo accounts:
- Admin: `admin@novastore.dev`
- User: `user@novastore.dev`

## API Domains Planned
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

## Development Phases
The phased implementation roadmap is documented in `AGENTS.md`.

High-level phases:
1. Setup and architecture
2. Auth, roles, and security
3. Products and categories
4. Cart and checkout simulation
5. Orders and profile
6. Admin panel
7. Stock and audit logs
8. Wishlist and reviews
9. Coupons and advanced filters
10. Uploads and notifications
11. Testing
12. Docker and final portfolio polish

## Testing Strategy
Planned test coverage includes:
- Auth flows
- Protected routes
- Role authorization
- Product endpoints
- Checkout calculations
- Coupon validation
- Order creation
- Frontend route protection and cart behavior

## What Makes NOVA Store Different
This project is intentionally structured to go beyond a beginner e-commerce demo by focusing on:
- maintainable architecture
- realistic admin workflows
- auditability
- security-first decisions
- scalable frontend state management
- portfolio-quality documentation

## Screenshots
Add screenshots here as implementation progresses:
- Home page
- Product listing
- Product detail
- Cart and checkout
- User dashboard
- Admin dashboard

## Roadmap / Future Improvements
- Real payment provider integration later
- Email notification simulation or provider integration
- Image storage abstraction
- Advanced analytics dashboards
- Internationalization
- Background jobs for notifications and maintenance tasks
- CI pipeline and automated quality checks

## Related Project Guidance
- Main architecture rules: `AGENTS.md`
- Frontend guidance: `skills/frontend/SKILL.md`
- Backend guidance: `skills/backend/SKILL.md`
- Database guidance: `skills/database/SKILL.md`
- Security guidance: `skills/security/SKILL.md`

## License
This repository is intended as a portfolio and learning project. Add a license if you plan to distribute it publicly.
