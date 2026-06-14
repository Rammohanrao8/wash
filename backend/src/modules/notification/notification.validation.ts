import { z } from 'zod';

export const notificationParamsSchema = z.object({
  id: z.string().uuid('Invalid notification ID'),
});

export const notificationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  unreadOnly: z.string().optional(), // 'true' or 'false'
});
