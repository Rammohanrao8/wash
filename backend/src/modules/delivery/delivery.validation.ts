import { z } from 'zod';

export const registerDeliverySchema = z.object({
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'VAN']),
  vehicleNumber: z.string().min(4).max(20).optional(),
  licenseNumber: z.string().min(5).max(30).optional(),
});

export const updateDeliveryProfileSchema = z.object({
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'VAN']).optional(),
  vehicleNumber: z.string().min(4).max(20).optional(),
  licenseNumber: z.string().min(5).max(30).optional(),
});

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const deliveryOrderParamsSchema = z.object({
  id: z.string().uuid('Invalid order ID'),
});
