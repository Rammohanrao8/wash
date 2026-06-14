import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const userService = new UserService();

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: User profile }
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getProfile(req.user!.userId);
  ApiResponse.success(res, result);
});

/**
 * @swagger
 * /api/v1/users/me:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               avatar: { type: string, format: uri }
 *     responses:
 *       200: { description: Updated profile }
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateProfile(req.user!.userId, req.body);
  ApiResponse.success(res, result, 'Profile updated successfully');
});

/**
 * @swagger
 * /api/v1/users/addresses:
 *   get:
 *     tags: [Users]
 *     summary: Get user addresses
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of addresses }
 */
export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAddresses(req.user!.userId);
  ApiResponse.success(res, result);
});

/**
 * @swagger
 * /api/v1/users/addresses:
 *   post:
 *     tags: [Users]
 *     summary: Add a new address
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [street, city, state, zipCode]
 *             properties:
 *               label: { type: string }
 *               street: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               zipCode: { type: string }
 *               landmark: { type: string }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               isDefault: { type: boolean }
 *     responses:
 *       201: { description: Address created }
 */
export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createAddress(req.user!.userId, req.body);
  ApiResponse.created(res, result, 'Address added successfully');
});

/**
 * @swagger
 * /api/v1/users/addresses/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update an address
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Updated address }
 */
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateAddress(req.user!.userId, req.params.id, req.body);
  ApiResponse.success(res, result, 'Address updated successfully');
});

/**
 * @swagger
 * /api/v1/users/addresses/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete an address
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Address deleted }
 */
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteAddress(req.user!.userId, req.params.id);
  ApiResponse.success(res, result);
});
