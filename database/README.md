# Database Notes — NOVA Store

## Folders
- `init/` — SQL files used by Docker MySQL bootstrap
- `migrations/` — ordered schema migrations for manual or tool-based execution
- `seeds/` — demo data for local development

## Suggested Apply Order
1. `migrations/001_initial_schema.sql`
2. `seeds/001_demo_seed.sql`

## Important Note
The seed file includes placeholder password hashes for demo users.
Replace them with valid bcrypt hashes before testing real authentication flows.
