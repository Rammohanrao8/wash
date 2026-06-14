import { Request, Response } from 'express';
import { DeliveryService } from './delivery.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const deliveryService = new DeliveryService();

/**
 * @swagger
 * /api/v1/delivery/register:
 *   post:
 *     tags: [Delivery]
 *     summary: Register as a delivery partner
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Registered }
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.register(req.user!.userId, req.body);
  ApiResponse.created(res, result, 'Registered as delivery partner. Pending verification.');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.getProfile(req.user!.userId);
  ApiResponse.success(res, result);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.updateProfile(req.user!.userId, req.body);
  ApiResponse.success(res, result, 'Profile updated');
});

export const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.toggleAvailability(req.user!.userId, req.body.isAvailable);
  ApiResponse.success(res, result, 'Availability updated');
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { orders, meta } = await deliveryService.getAssignedOrders(req.user!.userId, req);
  ApiResponse.success(res, orders, 'Orders retrieved', 200, meta);
});

export const confirmPickup = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.confirmPickup(req.user!.userId, req.params.id);
  ApiResponse.success(res, result, 'Pickup confirmed');
});

export const confirmDelivery = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.confirmDelivery(req.user!.userId, req.params.id);
  ApiResponse.success(res, result, 'Delivery confirmed');
});

export const getEarnings = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.getEarnings(req.user!.userId);
  ApiResponse.success(res, result);
});

export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const result = await deliveryService.updateLocation(
    req.user!.userId, req.body.latitude, req.body.longitude
  );
  ApiResponse.success(res, result, 'Location updated');
});
