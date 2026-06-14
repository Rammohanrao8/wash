import { Router } from 'express';
import * as notificationController from './notification.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { notificationParamsSchema, notificationQuerySchema } from './notification.validation';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validate({ query: notificationQuerySchema }),
  notificationController.getNotifications
);

router.patch('/read-all', notificationController.markAllAsRead);

router.patch(
  '/:id/read',
  validate({ params: notificationParamsSchema }),
  notificationController.markAsRead
);

router.delete(
  '/:id',
  validate({ params: notificationParamsSchema }),
  notificationController.deleteNotification
);

export default router;
