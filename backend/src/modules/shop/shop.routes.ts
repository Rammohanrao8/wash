import { Router } from 'express';
import * as shopController from './shop.controller';
import { authenticate, optionalAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import {
  createShopSchema,
  updateShopSchema,
  shopParamsSchema,
  createServiceSchema,
  updateServiceSchema,
  serviceParamsSchema,
  createReviewSchema,
  shopQuerySchema,
  availabilitySchema,
} from './shop.validation';

const router = Router();

// Public routes
router.get('/', validate({ query: shopQuerySchema }), shopController.listShops);
router.get('/:id', validate({ params: shopParamsSchema }), shopController.getShop);
router.get('/:id/services', validate({ params: shopParamsSchema }), shopController.getServices);
router.get('/:id/reviews', validate({ params: shopParamsSchema }), shopController.getReviews);

// Shop owner routes
router.post(
  '/',
  authenticate,
  authorize('SHOP_OWNER'),
  validate({ body: createShopSchema }),
  shopController.createShop
);

router.put(
  '/:id',
  authenticate,
  authorize('SHOP_OWNER'),
  validate({ params: shopParamsSchema, body: updateShopSchema }),
  shopController.updateShop
);

router.patch(
  '/:id/availability',
  authenticate,
  authorize('SHOP_OWNER'),
  validate({ params: shopParamsSchema, body: availabilitySchema }),
  shopController.toggleAvailability
);

// Service management (shop owner)
router.post(
  '/:id/services',
  authenticate,
  authorize('SHOP_OWNER'),
  validate({ params: shopParamsSchema, body: createServiceSchema }),
  shopController.addService
);

router.put(
  '/:id/services/:serviceId',
  authenticate,
  authorize('SHOP_OWNER'),
  validate({ params: serviceParamsSchema, body: updateServiceSchema }),
  shopController.updateService
);

router.delete(
  '/:id/services/:serviceId',
  authenticate,
  authorize('SHOP_OWNER'),
  validate({ params: serviceParamsSchema }),
  shopController.deleteService
);

// Reviews (authenticated customers)
router.post(
  '/:id/reviews',
  authenticate,
  authorize('CUSTOMER'),
  validate({ params: shopParamsSchema, body: createReviewSchema }),
  shopController.addReview
);

export default router;
