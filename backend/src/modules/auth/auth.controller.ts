import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const authService = new AuthService();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               name: { type: string }
 *               phone: { type: string }
 *               password: { type: string, minLength: 8 }
 *               role: { type: string, enum: [CUSTOMER, SHOP_OWNER, DELIVERY_PARTNER] }
 *     responses:
 *       201: { description: Registration successful, OTP sent }
 *       409: { description: User already exists }
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, result, 'Registration successful. Please check your email for OTP.');
});

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email OTP for signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, type]
 *             properties:
 *               email: { type: string, format: email }
 *               code: { type: string, minLength: 6, maxLength: 6 }
 *               type: { type: string, enum: [SIGNUP, LOGIN, RESET_PASSWORD] }
 *     responses:
 *       200: { description: OTP verified, returns tokens }
 *       400: { description: Invalid or expired OTP }
 */
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const result = await authService.verifySignupOtp(email, code);
  ApiResponse.success(res, result, 'Email verified successfully');
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns tokens }
 *       401: { description: Invalid credentials }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  ApiResponse.success(res, result, 'Login successful');
});

/**
 * @swagger
 * /api/v1/auth/login-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Request OTP for passwordless login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: OTP sent to email }
 */
export const requestLoginOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.requestLoginOtp(email);
  ApiResponse.success(res, result, 'Login OTP sent to your email');
});

/**
 * @swagger
 * /api/v1/auth/verify-login-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP for passwordless login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email: { type: string, format: email }
 *               code: { type: string, minLength: 6, maxLength: 6 }
 *     responses:
 *       200: { description: Login successful, returns tokens }
 */
export const verifyLoginOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const result = await authService.verifyLoginOtp(email, code);
  ApiResponse.success(res, result, 'Login successful');
});

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: New token pair }
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.body.refreshToken);
  ApiResponse.success(res, result, 'Token refreshed');
});

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Reset OTP sent }
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  ApiResponse.success(res, result);
});

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, newPassword]
 *             properties:
 *               email: { type: string, format: email }
 *               code: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password reset successful }
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  const result = await authService.resetPassword(email, code, newPassword);
  ApiResponse.success(res, result, 'Password reset successful');
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout (invalidate refresh token)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Logged out }
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logout(req.body.refreshToken);
  ApiResponse.success(res, result, 'Logged out successfully');
});
