import { z } from 'zod';

function toOptionalNullableNumber(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null;
  }

  return Number(value);
}

function toOptionalNullableString(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null;
  }

  return String(value).trim();
}

const couponBaseSchema = z.object({
  code: z.string().trim().min(3).max(60),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().positive(),
  minPurchaseAmount: z.coerce.number().min(0).default(0),
  usageLimit: z.preprocess(toOptionalNullableNumber, z.number().int().positive().nullable()).default(null),
  startsAt: z.preprocess(toOptionalNullableString, z.string().max(40).nullable()).default(null),
  expiresAt: z.preprocess(toOptionalNullableString, z.string().max(40).nullable()).default(null),
  isActive: z.boolean().default(true),
});

function validateCouponDateRange(payload) {
  if (!payload.startsAt || !payload.expiresAt) {
    return true;
  }

  return new Date(payload.expiresAt) > new Date(payload.startsAt);
}

export const listCouponsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(10),
  search: z.string().trim().max(120).optional().or(z.literal('')),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  discountType: z.enum(['all', 'percentage', 'fixed']).default('all'),
});

export const couponIdentifierSchema = z.object({
  couponId: z.coerce.number().int().positive(),
});

export const createCouponSchema = couponBaseSchema.refine(validateCouponDateRange, {
  message: 'Expiration date must be later than the start date',
  path: ['expiresAt'],
});

export const updateCouponSchema = couponBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided for update',
  })
  .refine(validateCouponDateRange, {
    message: 'Expiration date must be later than the start date',
    path: ['expiresAt'],
  });
