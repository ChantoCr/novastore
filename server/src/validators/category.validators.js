import { z } from 'zod';

const optionalNullableString = z.string().trim().max(2000).nullable();

export const categoryIdentifierSchema = z.object({
  categoryIdOrSlug: z.string().trim().min(1),
});

export const listManagedCategoriesQuerySchema = z.object({
  search: z.string().trim().max(120).optional().or(z.literal('')),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160),
  description: optionalNullableString.default(null),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    slug: z.string().trim().min(2).max(160).optional(),
    description: optionalNullableString.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided for update',
  });
