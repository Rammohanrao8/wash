import { z } from 'zod';

export const createOrderSchema = z.object({
  shopId: z.string().uuid(),
  items: z.array(z.object({
    serviceId: z.string().uuid(),
    quantity: z.number().positive(),
  })).min(1, 'At least one item is required'),
  pickupAddress: z.string().min(5),
  deliveryAddress: z.string().min(5),
  pickupScheduledAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['COD', 'ONLINE']).default('COD'),
});

export const orderParamsSchema = z.object({
  id: z.string().uuid('Invalid order ID'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'CONFIRMED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'PROCESSING',
    'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
  ]),
});

export const assignDeliverySchema = z.object({
  deliveryPartnerId: z.string().uuid(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason').max(500),
});

export const orderQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(['createdAt', 'totalAmount', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
