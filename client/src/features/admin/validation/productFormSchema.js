import { z } from 'zod';

function toOptionalNullableNumber(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null;
  }

  return Number(value);
}

export const productFormSchema = z.object({
  categoryId: z.preprocess(toOptionalNullableNumber, z.number().int().positive().nullable()),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(180),
  slug: z.string().trim().min(2, 'Slug must be at least 2 characters').max(220),
  sku: z.string().trim().min(2, 'SKU must be at least 2 characters').max(80),
  description: z
    .preprocess((value) => (value === '' ? null : value), z.string().trim().max(5000).nullable())
    .default(null),
  price: z.preprocess((value) => Number(value), z.number().positive('Price must be greater than 0')),
  compareAtPrice: z.preprocess(toOptionalNullableNumber, z.number().positive().nullable()),
  stock: z.preprocess((value) => Number(value), z.number().int().min(0, 'Stock cannot be negative')),
  lowStockThreshold: z.preprocess(
    (value) => Number(value),
    z.number().int().min(0, 'Low stock threshold cannot be negative'),
  ),
  isActive: z.boolean(),
});

export function getProductFormDefaultValues(product) {
  return {
    categoryId: product?.categoryId ? String(product.categoryId) : '',
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    sku: product?.sku ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    compareAtPrice: product?.compareAtPrice ?? '',
    stock: product?.stock ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 5,
    isActive: product?.isActive ?? true,
  };
}
