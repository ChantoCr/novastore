import { z } from 'zod';

const optionalNullableString = z.string().trim().max(5000).nullable();

export const productIdentifierSchema = z.object({
  productIdOrSlug: z.string().trim().min(1),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(160).optional(),
  sort: z
    .enum(['newest', 'oldest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
    .default('newest'),
});

export const createProductSchema = z.object({
  categoryId: z.coerce.number().int().positive().nullable().default(null),
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(220),
  sku: z.string().trim().min(2).max(80),
  description: optionalNullableString.default(null),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().nullable().default(null),
  stock: z.coerce.number().int().min(0).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = z
  .object({
    categoryId: z.coerce.number().int().positive().nullable().optional(),
    name: z.string().trim().min(2).max(180).optional(),
    slug: z.string().trim().min(2).max(220).optional(),
    sku: z.string().trim().min(2).max(80).optional(),
    description: optionalNullableString.optional(),
    price: z.coerce.number().positive().optional(),
    compareAtPrice: z.coerce.number().positive().nullable().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    lowStockThreshold: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided for update',
  });
