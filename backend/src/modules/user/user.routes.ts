import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  addressParamsSchema,
} from './user.validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile
router.get('/me', userController.getProfile);
router.put('/me', validate({ body: updateProfileSchema }), userController.updateProfile);

// Addresses
router.get('/addresses', userController.getAddresses);
router.post('/addresses', validate({ body: createAddressSchema }), userController.createAddress);
router.put(
  '/addresses/:id',
  validate({ params: addressParamsSchema, body: updateAddressSchema }),
  userController.updateAddress
);
router.delete(
  '/addresses/:id',
  validate({ params: addressParamsSchema }),
  userController.deleteAddress
);

export default router;
