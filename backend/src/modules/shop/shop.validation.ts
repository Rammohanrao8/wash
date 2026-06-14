import { z } from 'zod';

export const createShopSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  street: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zipCode: z.string().min(5).max(10),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM').default('08:00'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM').default('20:00'),
  coverImage: z.string().url().optional(),
});

export const updateShopSchema = createShopSchema.partial();

export const shopParamsSchema = z.object({
  id: z.string().uuid('Invalid shop ID'),
});

export const createServiceSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(500).optional(),
  price: z.number().positive('Price must be positive'),
  unit: z.string().default('per_kg'),
  estimatedDuration: z.number().int().positive().default(24),
});

export const updateServiceSchema = createServiceSchema.partial();

export const serviceParamsSchema = z.object({
  id: z.string().uuid('Invalid shop ID'),
  serviceId: z.string().uuid('Invalid service ID'),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  orderId: z.string().uuid().optional(),
});

export const shopQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  sortBy: z.enum(['rating', 'name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const availabilitySchema = z.object({
  isActive: z.boolean(),
});
