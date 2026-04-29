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
- This repository already contains auth and products scaffolding.
- Demo credentials are documented in `README.md` and `CHAT_CONTEXT_HANDOFF.md`.
- Docker was not available in the user's PowerShell session during the last chat.
- For manual local MySQL runs, verify whether `.env` uses `DB_HOST=localhost`.
