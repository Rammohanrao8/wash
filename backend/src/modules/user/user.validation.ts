import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  avatar: z.string().url().optional(),
});

export const createAddressSchema = z.object({
  label: z.string().min(1).max(50).default('Home'),
  street: z.string().min(3, 'Street is required').max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zipCode: z.string().min(5).max(10),
  landmark: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressParamsSchema = z.object({
  id: z.string().uuid('Invalid address ID'),
});
