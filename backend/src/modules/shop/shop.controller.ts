import { Request, Response } from 'express';
import { ShopService } from './shop.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const shopService = new ShopService();

/**
 * @swagger
 * /api/v1/shops:
 *   post:
 *     tags: [Shops]
 *     summary: Create a new laundry shop
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Shop created }
 */
export const createShop = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.createShop(req.user!.userId, req.body);
  ApiResponse.created(res, result, 'Shop created successfully. Pending admin approval.');
});

/**
 * @swagger
 * /api/v1/shops:
 *   get:
 *     tags: [Shops]
 *     summary: List all approved shops
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [rating, name, createdAt] }
 *     responses:
 *       200: { description: List of shops }
 */
export const listShops = asyncHandler(async (req: Request, res: Response) => {
  const { shops, meta } = await shopService.listShops(req);
  ApiResponse.success(res, shops, 'Shops retrieved', 200, meta);
});

/**
 * @swagger
 * /api/v1/shops/{id}:
 *   get:
 *     tags: [Shops]
 *     summary: Get shop details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Shop details }
 */
export const getShop = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.getShopById(req.params.id);
  ApiResponse.success(res, result);
});

/**
 * @swagger
 * /api/v1/shops/{id}:
 *   put:
 *     tags: [Shops]
 *     summary: Update shop (owner only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated shop }
 */
export const updateShop = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.updateShop(req.user!.userId, req.params.id, req.body);
  ApiResponse.success(res, result, 'Shop updated successfully');
});

/**
 * @swagger
 * /api/v1/shops/{id}/availability:
 *   patch:
 *     tags: [Shops]
 *     summary: Toggle shop availability
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Availability updated }
 */
export const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.toggleAvailability(req.user!.userId, req.params.id, req.body.isActive);
  ApiResponse.success(res, result, 'Availability updated');
});

// ─── Services ───────────────────────────────────────────

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.getShopServices(req.params.id);
  ApiResponse.success(res, result);
});

export const addService = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.addService(req.user!.userId, req.params.id, req.body);
  ApiResponse.created(res, result, 'Service added successfully');
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.updateService(req.user!.userId, req.params.id, req.params.serviceId, req.body);
  ApiResponse.success(res, result, 'Service updated');
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.deleteService(req.user!.userId, req.params.id, req.params.serviceId);
  ApiResponse.success(res, result);
});

// ─── Reviews ────────────────────────────────────────────

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { reviews, meta } = await shopService.getShopReviews(req.params.id, req);
  ApiResponse.success(res, reviews, 'Reviews retrieved', 200, meta);
});

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const result = await shopService.addReview(req.user!.userId, req.params.id, req.body);
  ApiResponse.created(res, result, 'Review added');
});
