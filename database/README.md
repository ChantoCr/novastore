# Database Notes — NOVA Store

## Folders
- `init/` — SQL files used by Docker MySQL bootstrap
- `migrations/` — ordered schema migrations for manual or tool-based execution
- `seeds/` — demo data for local development

## Suggested Apply Order
1. `migrations/001_initial_schema.sql`
2. `seeds/001_demo_seed.sql`

## Important Note
The current demo seed already includes valid bcrypt password hashes for the documented demo accounts.
If you rotate those passwords later, regenerate hashes before testing real authentication flows.
