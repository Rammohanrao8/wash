import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const orderService = new OrderService();

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shopId, items, pickupAddress, deliveryAddress]
 *             properties:
 *               shopId: { type: string, format: uuid }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId: { type: string, format: uuid }
 *                     quantity: { type: number }
 *               pickupAddress: { type: string }
 *               deliveryAddress: { type: string }
 *               pickupScheduledAt: { type: string, format: date-time }
 *               notes: { type: string }
 *               paymentMethod: { type: string, enum: [COD, ONLINE] }
 *     responses:
 *       201: { description: Order created }
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.createOrder(req.user!.userId, req.body);
  ApiResponse.created(res, result, 'Order placed successfully');
});

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     tags: [Orders]
 *     summary: List orders (filtered by role)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of orders }
 */
export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const { orders, meta } = await orderService.listOrders(req.user!.userId, req.user!.role, req);
  ApiResponse.success(res, orders, 'Orders retrieved', 200, meta);
});

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Order details }
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.getOrderById(req.params.id, req.user!.userId, req.user!.role);
  ApiResponse.success(res, result);
});

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Status updated }
 */
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.updateOrderStatus(
    req.params.id, req.body.status, req.user!.userId, req.user!.role
  );
  ApiResponse.success(res, result, 'Order status updated');
});

/**
 * @swagger
 * /api/v1/orders/{id}/assign:
 *   patch:
 *     tags: [Orders]
 *     summary: Assign delivery partner
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Delivery partner assigned }
 */
export const assignDelivery = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.assignDeliveryPartner(req.params.id, req.body.deliveryPartnerId);
  ApiResponse.success(res, result, 'Delivery partner assigned');
});

/**
 * @swagger
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     tags: [Orders]
 *     summary: Cancel order
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Order cancelled }
 */
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.cancelOrder(req.params.id, req.user!.userId, req.body.reason);
  ApiResponse.success(res, result, 'Order cancelled');
});
