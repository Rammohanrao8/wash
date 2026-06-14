import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter';
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  loginOtpRequestSchema,
  verifyLoginOtpSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

const router = Router();

// Registration
router.post(
  '/register',
  authLimiter,
  validate({ body: registerSchema }),
  authController.register
);

// Verify signup OTP
router.post(
  '/verify-otp',
  otpLimiter,
  validate({ body: verifyOtpSchema }),
  authController.verifyOtp
);

// Login with password
router.post(
  '/login',
  authLimiter,
  validate({ body: loginSchema }),
  authController.login
);

// Request login OTP (passwordless)
router.post(
  '/login-otp',
  otpLimiter,
  validate({ body: loginOtpRequestSchema }),
  authController.requestLoginOtp
);

// Verify login OTP
router.post(
  '/verify-login-otp',
  otpLimiter,
  validate({ body: verifyLoginOtpSchema }),
  authController.verifyLoginOtp
);

// Refresh token
router.post(
  '/refresh-token',
  validate({ body: refreshTokenSchema }),
  authController.refreshToken
);

// Forgot password
router.post(
  '/forgot-password',
  otpLimiter,
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  otpLimiter,
  validate({ body: resetPasswordSchema }),
  authController.resetPassword
);

// Logout
router.post(
  '/logout',
  authenticate,
  validate({ body: refreshTokenSchema }),
  authController.logout
);

export default router;
