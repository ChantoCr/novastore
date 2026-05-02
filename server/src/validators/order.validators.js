import { z } from 'zod';

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(6),
  status: z
    .enum(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .default('all'),
});

export const orderIdentifierSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});
