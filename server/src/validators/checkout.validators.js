import { z } from 'zod';

const checkoutItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(20),
});

const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  country: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  line1: z.string().trim().min(3).max(180),
  line2: z.string().trim().max(180).optional().or(z.literal('')),
  state: z.string().trim().max(120).optional().or(z.literal('')),
  postalCode: z.string().trim().max(40).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
});

const paymentMethodSchema = z.object({
  cardholderName: z.string().trim().min(2).max(120),
  cardNumber: z.string().trim().min(12).max(32),
  expiryMonth: z.coerce.number().int().min(1).max(12),
  expiryYear: z.coerce.number().int().min(new Date().getFullYear()).max(new Date().getFullYear() + 15),
  cvv: z.string().trim().min(3).max(4),
});

export const createCheckoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(25),
  couponCode: z.string().trim().min(3).max(60).optional().or(z.literal('')),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: paymentMethodSchema,
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});
