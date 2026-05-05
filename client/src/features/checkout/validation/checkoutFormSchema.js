import { z } from 'zod';

const currentYear = new Date().getFullYear();

const addressSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the full name').max(120),
  country: z.string().trim().min(2, 'Enter the country').max(120),
  city: z.string().trim().min(2, 'Enter the city').max(120),
  line1: z.string().trim().min(3, 'Enter the address line').max(180),
  line2: z.string().trim().max(180).optional(),
  state: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(40).optional(),
  phone: z.string().trim().max(30).optional(),
});

const relaxedBillingAddressSchema = z
  .object({
    fullName: z.string().trim().max(120).optional().or(z.literal('')),
    country: z.string().trim().max(120).optional().or(z.literal('')),
    city: z.string().trim().max(120).optional().or(z.literal('')),
    line1: z.string().trim().max(180).optional().or(z.literal('')),
    line2: z.string().trim().max(180).optional().or(z.literal('')),
    state: z.string().trim().max(120).optional().or(z.literal('')),
    postalCode: z.string().trim().max(40).optional().or(z.literal('')),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
  })
  .optional();

const paymentMethodSchema = z.object({
  cardholderName: z.string().trim().min(2, 'Enter the cardholder name').max(120),
  cardNumber: z
    .string()
    .trim()
    .min(12, 'Enter a demo card number')
    .max(32)
    .regex(/^[\d\s-]+$/, 'Use digits only for the demo card number'),
  expiryMonth: z.coerce.number().int().min(1, 'Use a valid month').max(12, 'Use a valid month'),
  expiryYear: z.coerce
    .number()
    .int()
    .min(currentYear, 'Use a valid expiry year')
    .max(currentYear + 15, 'Use a valid expiry year'),
  cvv: z.string().trim().min(3, 'Enter a CVV').max(4),
});

export const checkoutFormSchema = z
  .object({
    shippingAddress: addressSchema,
    billingSameAsShipping: z.boolean().default(true),
    billingAddress: relaxedBillingAddressSchema,
    couponCode: z.string().trim().max(60).optional(),
    notes: z.string().trim().max(2000).optional(),
    paymentMethod: paymentMethodSchema,
  })
  .superRefine((value, context) => {
    if (!value.billingSameAsShipping) {
      const parsed = addressSchema.safeParse(value.billingAddress);

      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['billingAddress', ...issue.path],
            message: issue.message,
          });
        }
      }
    }
  });
