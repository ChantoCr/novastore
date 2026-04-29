# Docker Skill — NOVA Store

## Purpose
Use this skill when containerizing the frontend, backend, and MySQL database.

## Required Files

```txt
Dockerfile.client
Dockerfile.server
docker-compose.yml
.env.example
```

## Services
- client
- server
- mysql

## Rules
- Use environment variables.
- Do not hardcode secrets.
- MySQL should use a named volume.
- Backend should wait for database availability when needed.
- Docker Compose should make local setup easier.
- Keep images reproducible and environment-agnostic.

## Docker Compose Should Include
- MySQL database
- Backend server
- Frontend client
- Ports
- Volumes
- Environment variables

## Avoid
- Committing real secrets.
- Building images with local machine-specific paths.
- Making Docker setup harder than manual setup.
- Coupling containers to local-only assumptions.
