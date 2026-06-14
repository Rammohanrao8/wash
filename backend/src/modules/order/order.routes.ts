import { Router } from 'express';
import * as orderController from './order.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import {
  createOrderSchema,
  orderParamsSchema,
  updateOrderStatusSchema,
  assignDeliverySchema,
  cancelOrderSchema,
  orderQuerySchema,
} from './order.validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create order (customer only)
router.post(
  '/',
  authorize('CUSTOMER'),
  validate({ body: createOrderSchema }),
  orderController.createOrder
);

// List orders (role-filtered)
router.get(
  '/',
  validate({ query: orderQuerySchema }),
  orderController.listOrders
);

// Get order details
router.get(
  '/:id',
  validate({ params: orderParamsSchema }),
  orderController.getOrder
);

// Update order status (shop owner or admin)
router.patch(
  '/:id/status',
  authorize('SHOP_OWNER', 'ADMIN'),
  validate({ params: orderParamsSchema, body: updateOrderStatusSchema }),
  orderController.updateStatus
);

// Assign delivery partner (admin or shop owner)
router.patch(
  '/:id/assign',
  authorize('SHOP_OWNER', 'ADMIN'),
  validate({ params: orderParamsSchema, body: assignDeliverySchema }),
  orderController.assignDelivery
);

// Cancel order (customer)
router.patch(
  '/:id/cancel',
  authorize('CUSTOMER'),
  validate({ params: orderParamsSchema, body: cancelOrderSchema }),
  orderController.cancelOrder
);

export default router;
