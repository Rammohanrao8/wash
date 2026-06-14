import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const paymentService = new PaymentService();

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentRecord(req.params.orderId, req.user!.userId);
  ApiResponse.created(res, result, 'Payment initiated');
});

export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentDetails(req.params.orderId, req.user!.userId, req.user!.role);
  ApiResponse.success(res, result);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.updatePaymentStatus(
    req.params.id, req.body.status, req.body.transactionId
  );
  ApiResponse.success(res, result, 'Payment status updated');
});
