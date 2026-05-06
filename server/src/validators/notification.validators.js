import { z } from 'zod';

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(10),
  status: z.enum(['all', 'read', 'unread']).default('all'),
  type: z.string().trim().max(80).optional().or(z.literal('')),
});

export const notificationIdentifierSchema = z.object({
  notificationId: z.coerce.number().int().positive(),
});
