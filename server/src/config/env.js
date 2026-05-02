import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { z } from 'zod';

const rootEnvPath = fileURLToPath(new URL('../../../.env', import.meta.url));
const rootTestEnvPath = fileURLToPath(new URL('../../../.env.test', import.meta.url));

dotenv.config({
  path: rootEnvPath,
});

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: rootTestEnvPath,
    override: true,
  });
}

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVER_PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default('nova_store'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('root'),
  JWT_ACCESS_SECRET: z.string().min(16).default('change-me-access-secret'),
  JWT_REFRESH_SECRET: z.string().min(16).default('change-me-refresh-secret'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
