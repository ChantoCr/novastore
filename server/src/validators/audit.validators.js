import { z } from 'zod';

export const listAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(12),
  action: z.string().trim().max(120).default('all'),
  entityType: z.string().trim().max(80).default('all'),
  search: z.string().trim().max(120).optional().or(z.literal('')),
});
