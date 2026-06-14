import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { adminQuerySchema, updateUserStatusSchema, approveShopSchema, adminParamsSchema } from './admin.validation';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);

router.get('/users', validate({ query: adminQuerySchema }), adminController.listUsers);
router.patch(
  '/users/:id/status',
  validate({ params: adminParamsSchema, body: updateUserStatusSchema }),
  adminController.updateUserStatus
);

router.patch(
  '/shops/:id/approve',
  validate({ params: adminParamsSchema, body: approveShopSchema }),
  adminController.approveShop
);

export default router;
