import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  quantityChange: z.preprocess(
    (value) => Number(value),
    z.number().int().refine((value) => value !== 0, {
      message: 'Quantity change must be different from zero',
    }),
  ),
  reason: z.string().trim().min(3, 'Reason must be at least 3 characters').max(255),
});

export function getStockAdjustmentDefaultValues(product) {
  return {
    quantityChange: 0,
    reason: product ? `Manual stock adjustment for ${product.name}` : '',
  };
}
