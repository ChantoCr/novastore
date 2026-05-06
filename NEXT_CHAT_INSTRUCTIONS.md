# Next Chat Instructions — NOVA Store

Use this file as the starting instruction for a new chat.

## Instruction For The Next Assistant
Please read the following files in this exact order before making changes:

1. `README.md`
2. `AGENTS.md`
3. `CHAT_CONTEXT_HANDOFF.md`
4. `database/README.md`
5. `skills/documentation/SKILL.md`
6. `skills/frontend/SKILL.md`
7. `skills/backend/SKILL.md`
8. `skills/database/SKILL.md`
9. `skills/security/SKILL.md`
10. `skills/redux/SKILL.md`
11. `skills/admin/SKILL.md`
12. `skills/ecommerce/SKILL.md`
13. `skills/testing/SKILL.md`
14. `skills/docker/SKILL.md`
15. `NEXT_TASK_PROMPT.md`

## What To Do After Reading
1. Summarize your understanding of the project state.
2. Mention any important constraints or risks.
3. State the implementation plan in small steps.
4. Then execute the task described in `NEXT_TASK_PROMPT.md`.
5. Keep changes modular and aligned with the current architecture.
6. Update documentation if architecture or setup changes.

## Special Note
Before implementing new features, check whether the current need is:
- feature development
- local environment setup help
- Docker troubleshooting
- database import/setup support

## Important Context
- This repository now already contains:
  - auth and role-aware routing
  - auth/session bootstrap persistence across refreshes
  - products and categories
  - cart and checkout simulation with clearer result UX and add-to-cart toast feedback
  - authenticated order history, wishlist visibility, a protected wishlist page, and notifications visibility
  - admin category management
  - admin product management UI with local image-upload groundwork
  - admin coupon management UI
  - admin stock adjustment flow
  - admin order history, order status updates, and read-only audit-log visibility
  - checkout-focused backend integration tests
  - stronger public catalog filtering by price and stock state
  - authenticated notification visibility and read-state updates
- Demo credentials are documented in `README.md` and `CHAT_CONTEXT_HANDOFF.md`.
- Docker is working now and should be treated as the default local run path unless the user asks for manual MySQL help.
- If a Docker-only dependency import error appears, check stale named `node_modules` volumes first, then restart containers or use `docker compose down -v`.
- This is especially relevant now after the new server-side upload dependency (`multer`) and local upload groundwork.
- For manual local MySQL runs, verify whether `.env` uses `DB_HOST=localhost`.
- The current next implementation target is reviews groundwork, and the latest details are in `CHAT_CONTEXT_HANDOFF.md` and `NEXT_TASK_PROMPT.md`.
- Upload-related runtime context now also depends on `.env` values such as `UPLOAD_DIR`, `SERVER_PUBLIC_URL`, and `PRODUCT_IMAGE_MAX_FILE_SIZE_MB`.
- Do not skip the required `.md` files above; they now contain the latest phase progression and handoff details needed to continue correctly.
