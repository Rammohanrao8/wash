import { z } from 'zod';

export const adminQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export const approveShopSchema = z.object({
  isApproved: z.boolean(),
});

export const adminParamsSchema = z.object({
  id: z.string().uuid('Invalid ID'),
});
