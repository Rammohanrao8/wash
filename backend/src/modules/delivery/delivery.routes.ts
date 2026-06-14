import { Router } from 'express';
import * as deliveryController from './delivery.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import {
  registerDeliverySchema,
  updateDeliveryProfileSchema,
  availabilitySchema,
  updateLocationSchema,
  deliveryOrderParamsSchema,
} from './delivery.validation';

const router = Router();

router.use(authenticate);

// Register as delivery partner
router.post(
  '/register',
  validate({ body: registerDeliverySchema }),
  deliveryController.register
);

// Profile management
router.get('/profile', authorize('DELIVERY_PARTNER'), deliveryController.getProfile);
router.put(
  '/profile',
  authorize('DELIVERY_PARTNER'),
  validate({ body: updateDeliveryProfileSchema }),
  deliveryController.updateProfile
);

// Availability
router.patch(
  '/availability',
  authorize('DELIVERY_PARTNER'),
  validate({ body: availabilitySchema }),
  deliveryController.toggleAvailability
);

// Orders
router.get('/orders', authorize('DELIVERY_PARTNER'), deliveryController.getOrders);
router.patch(
  '/orders/:id/pickup',
  authorize('DELIVERY_PARTNER'),
  validate({ params: deliveryOrderParamsSchema }),
  deliveryController.confirmPickup
);
router.patch(
  '/orders/:id/deliver',
  authorize('DELIVERY_PARTNER'),
  validate({ params: deliveryOrderParamsSchema }),
  deliveryController.confirmDelivery
);

// Earnings
router.get('/earnings', authorize('DELIVERY_PARTNER'), deliveryController.getEarnings);

// Location
router.patch(
  '/location',
  authorize('DELIVERY_PARTNER'),
  validate({ body: updateLocationSchema }),
  deliveryController.updateLocation
);

export default router;
