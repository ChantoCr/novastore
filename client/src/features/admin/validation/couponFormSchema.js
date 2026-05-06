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

function isValidDateRange(values) {
  if (!values.startsAt || !values.expiresAt) {
    return true;
  }

  return new Date(values.expiresAt) > new Date(values.startsAt);
}

export const couponFormSchema = z
  .object({
    code: z.string().trim().min(3, 'Code must be at least 3 characters').max(60),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.preprocess(
      (value) => Number(value),
      z.number().positive('Discount value must be greater than 0'),
    ),
    minPurchaseAmount: z.preprocess(
      (value) => Number(value),
      z.number().min(0, 'Minimum purchase cannot be negative'),
    ),
    usageLimit: z.preprocess(toOptionalNullableNumber, z.number().int().positive().nullable()),
    startsAt: z.preprocess(toOptionalNullableString, z.string().nullable()),
    expiresAt: z.preprocess(toOptionalNullableString, z.string().nullable()),
    isActive: z.boolean(),
  })
  .refine(isValidDateRange, {
    message: 'Expiration date must be later than the start date',
    path: ['expiresAt'],
  });

function formatDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getCouponFormDefaultValues(coupon) {
  return {
    code: coupon?.code ?? '',
    discountType: coupon?.discountType ?? 'fixed',
    discountValue: coupon?.discountValue ?? '',
    minPurchaseAmount: coupon?.minPurchaseAmount ?? 0,
    usageLimit: coupon?.usageLimit ?? '',
    startsAt: formatDateTimeLocal(coupon?.startsAt),
    expiresAt: formatDateTimeLocal(coupon?.expiresAt),
    isActive: coupon?.isActive ?? true,
  };
}
