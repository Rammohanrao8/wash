import { Router } from 'express';
import * as paymentController from './payment.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import {
  paymentParamsSchema,
  updatePaymentStatusSchema,
  updatePaymentParamsSchema,
} from './payment.validation';

const router = Router();

router.use(authenticate);

// Create/Initiate online payment
router.post(
  '/:orderId',
  authorize('CUSTOMER'),
  validate({ params: paymentParamsSchema }),
  paymentController.createPayment
);

// Get payment details
router.get(
  '/:orderId',
  validate({ params: paymentParamsSchema }),
  paymentController.getPayment
);

// Update status (Admin)
router.patch(
  '/:id/status',
  authorize('ADMIN'),
  validate({ params: updatePaymentParamsSchema, body: updatePaymentStatusSchema }),
  paymentController.updateStatus
);

export default router;
