# Backend Skill — NOVA Store

## Purpose
Use this skill when working on Node.js, Express.js, APIs, controllers, services, routes, middlewares, validators, and backend architecture.

## Stack
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- Zod or Joi
- Helmet
- CORS
- Express Rate Limit

## Rules
- Use layered architecture.
- Routes define endpoints only.
- Controllers handle request and response.
- Services contain business logic.
- Repositories or models handle database access.
- Middlewares handle auth, roles, validation, errors, and security.
- Use centralized error handling.
- Validate all incoming data.
- Never expose sensitive data.
- Keep functions focused and testable.

## Recommended Structure

```txt
server/src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── repositories/
├── validators/
├── utils/
└── app.js
```

## API Standards
Use REST-style endpoints.

Example:

```txt
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
```

## Response Format
Prefer consistent responses:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

For errors:

```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": []
}
```

## Service Responsibilities
- Auth service manages credentials, token issuance, refresh rotation, and logout.
- Product service manages catalog rules, stock checks, and activation status.
- Order service calculates totals on the backend and creates order records.
- Coupon service validates applicability, expiry, and usage limits.
- Audit service records important admin actions.

## Error Handling Expectations
- Convert database and validation failures into safe API responses.
- Do not leak SQL details to clients.
- Use a centralized error format.
- Distinguish between expected business errors and unexpected server errors.

## Avoid
- Business logic inside routes.
- Returning password hashes.
- Hardcoded secrets.
- Unvalidated request bodies.
- Silent errors.
- Trusting prices, totals, or roles sent by the frontend.
