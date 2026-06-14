import { z } from 'zod';

export const paymentParamsSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  transactionId: z.string().optional(),
});

export const updatePaymentParamsSchema = z.object({
  id: z.string().uuid('Invalid payment ID'),
});
