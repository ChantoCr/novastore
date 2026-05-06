import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  slug: z.string().trim().min(2, 'Slug must be at least 2 characters').max(160),
  description: z
    .preprocess((value) => (value === '' ? null : value), z.string().trim().max(2000).nullable())
    .default(null),
  isActive: z.boolean(),
});

export function getCategoryFormDefaultValues(category) {
  return {
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    isActive: category?.isActive ?? true,
  };
}
