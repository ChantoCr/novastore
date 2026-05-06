import { z } from 'zod';

const optionalNullableString = z.string().trim().max(5000).nullable();

function toBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    return normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'on';
  }

  return Boolean(value);
}

export const productIdentifierSchema = z.object({
  productIdOrSlug: z.string().trim().min(1),
});

export const listProductsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    search: z.string().trim().max(120).optional(),
    category: z.string().trim().max(160).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    stockStatus: z.enum(['all', 'in_stock', 'low_stock', 'out_of_stock']).default('all'),
    sort: z
      .enum(['newest', 'oldest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
      .default('newest'),
  })
  .refine(
    (value) =>
      typeof value.minPrice === 'undefined' ||
      typeof value.maxPrice === 'undefined' ||
      value.maxPrice >= value.minPrice,
    {
      message: 'Maximum price must be greater than or equal to minimum price',
      path: ['maxPrice'],
    },
  );

export const listManagedProductsQuerySchema = listProductsQuerySchema.extend({
  status: z.enum(['all', 'active', 'inactive']).default('all'),
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
    stockChangeReason: z.string().trim().max(255).optional(),
  })
  .refine((value) => Object.keys(value).some((key) => key !== 'stockChangeReason'), {
    message: 'At least one field must be provided for update',
  });

export const adjustStockSchema = z.object({
  quantityChange: z.coerce.number().int().refine((value) => value !== 0, {
    message: 'Quantity change must be different from zero',
  }),
  reason: z.string().trim().min(3).max(255).optional().or(z.literal('')),
});

export const uploadProductImageSchema = z.object({
  altText: z.string().trim().max(180).optional().or(z.literal('')),
  makePrimary: z.preprocess(toBoolean, z.boolean().default(false)),
});
