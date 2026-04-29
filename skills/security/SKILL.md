# Security Skill — NOVA Store

## Purpose
Use this skill when working on authentication, authorization, passwords, JWT, refresh tokens, protected routes, input validation, file uploads, and backend security.

## Security Requirements
- Passwords must be hashed with bcrypt.
- Use JWT access tokens.
- Use refresh tokens.
- Store refresh tokens securely in the database.
- Use role-based authorization.
- Validate all user input.
- Use Helmet.
- Configure CORS carefully.
- Use rate limiting on auth routes.
- Never expose password hashes.
- Never hardcode secrets.
- Sanitize uploaded file handling and validate mime types.

## Auth Flow
1. User registers.
2. Password is hashed.
3. User logs in.
4. Backend returns access token and refresh token.
5. Frontend stores auth state safely.
6. Protected routes check authentication.
7. Backend validates access token on protected APIs.
8. Refresh token can issue a new access token.
9. Logout invalidates refresh token.

## Role Rules

### user
Can access shopping and profile routes.

### admin
Can access admin dashboard and management endpoints.

## Middleware Needed
- authenticateToken
- authorizeRoles
- validateRequest
- rateLimiter
- errorHandler

## Additional Security Checklist
- Keep access tokens short-lived.
- Rotate refresh tokens when practical.
- Never trust role data from the frontend.
- Validate coupon, stock, and price logic on the backend.
- Prevent users from reviewing products they did not purchase, unless explicitly allowed.
- Avoid exposing internal IDs unnecessarily in admin-sensitive flows.

## Avoid
- Frontend-only security.
- Plain-text passwords.
- Long-lived access tokens.
- Returning sensitive user data.
- Trusting role data from the frontend.
- Using upload endpoints without size and type limits.
