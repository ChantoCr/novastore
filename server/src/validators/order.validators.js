import { z } from 'zod';

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(6),
  status: z
    .enum(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .default('all'),
});

export const listAdminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(10),
  status: z
    .enum(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .default('all'),
  paymentStatus: z.enum(['all', 'pending', 'approved', 'rejected', 'refunded']).default('all'),
  search: z.string().trim().max(120).optional().or(z.literal('')),
});

export const orderIdentifierSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

export const updateAdminOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  note: z.string().trim().max(500).optional().or(z.literal('')),
});
