import bcrypt from 'bcrypt';
import { OtpType, Role } from '@prisma/client';
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { generateOTP, getOTPExpiry, isOTPExpired } from '../../utils/otp';
import { generateTokenPair, verifyRefreshToken } from '../../utils/jwt';
import { sendEmail, otpEmailTemplate, welcomeEmailTemplate } from '../../config/email';
import { logger } from '../../config/logger';
import { emitNotification } from '../../config/socket';

const SALT_ROUNDS = 12;

export class AuthService {
  /**
   * Register a new user — sends OTP to email
   */
  async register(data: {
    email: string;
    name?: string;
    phone?: string;
    password: string;
    role: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.isVerified) {
      throw ApiError.conflict('An account with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create or update user (upsert for re-registration before verification)
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: data.role as Role,
      },
      create: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: data.role as Role,
      },
    });

    // Generate and store OTP
    const otpCode = generateOTP();
    await prisma.otp.create({
      data: {
        email: data.email,
        code: otpCode,
        type: OtpType.SIGNUP,
        expiresAt: getOTPExpiry(10),
      },
    });

    // Send OTP email
    await sendEmail({
      to: data.email,
      subject: 'Verify your Wash account',
      html: otpEmailTemplate(data.name || '', otpCode, 'SIGNUP'),
    });

    logger.info(`📧 Registration OTP sent to ${data.email}`);

    return {
      message: 'Registration successful. Please verify your email with the OTP sent.',
      userId: user.id,
      email: user.email,
    };
  }

  /**
   * Verify email OTP (for signup)
   */
  async verifySignupOtp(email: string, code: string) {
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        type: OtpType.SIGNUP,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw ApiError.badRequest('Invalid OTP');
    }

    if (isOTPExpired(otp.expiresAt)) {
      throw ApiError.badRequest('OTP has expired. Please request a new one.');
    }

    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // Verify user
    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to Wash! 🧺',
      html: welcomeEmailTemplate(user.name || 'there'),
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Wash! 🎉',
        message: 'Your account has been verified. Start exploring laundry services near you!',
        type: 'WELCOME',
      },
    });

    logger.info(`✅ User verified: ${email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Login with email/password
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isVerified) {
      throw ApiError.forbidden('Please verify your email first');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Request OTP for login (passwordless)
   */
  async requestLoginOtp(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw ApiError.notFound('No account found with this email');
    }

    if (!user.isVerified) {
      throw ApiError.forbidden('Please verify your email first');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Generate OTP
    const otpCode = generateOTP();
    await prisma.otp.create({
      data: {
        email,
        code: otpCode,
        type: OtpType.LOGIN,
        expiresAt: getOTPExpiry(10),
      },
    });

    await sendEmail({
      to: email,
      subject: 'Your Wash login OTP',
      html: otpEmailTemplate(user.name || '', otpCode, 'LOGIN'),
    });

    logger.info(`📧 Login OTP sent to ${email}`);

    return { message: 'OTP sent to your email' };
  }

  /**
   * Verify login OTP (passwordless login)
   */
  async verifyLoginOtp(email: string, code: string) {
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        type: OtpType.LOGIN,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw ApiError.badRequest('Invalid OTP');
    }

    if (isOTPExpired(otp.expiresAt)) {
      throw ApiError.badRequest('OTP has expired');
    }

    await prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    // Verify token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw ApiError.unauthorized('Refresh token has expired');
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new token pair
    const tokens = generateTokenPair({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: decoded.userId,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  /**
   * Forgot password — send reset OTP
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If an account exists with this email, you will receive a reset OTP.' };
    }

    const otpCode = generateOTP();
    await prisma.otp.create({
      data: {
        email,
        code: otpCode,
        type: OtpType.RESET_PASSWORD,
        expiresAt: getOTPExpiry(10),
      },
    });

    await sendEmail({
      to: email,
      subject: 'Reset your Wash password',
      html: otpEmailTemplate(user.name || '', otpCode, 'RESET_PASSWORD'),
    });

    return { message: 'If an account exists with this email, you will receive a reset OTP.' };
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(email: string, code: string, newPassword: string) {
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        type: OtpType.RESET_PASSWORD,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw ApiError.badRequest('Invalid OTP');
    }

    if (isOTPExpired(otp.expiresAt)) {
      throw ApiError.badRequest('OTP has expired');
    }

    await prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Invalidate all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { user: { email } },
    });

    return { message: 'Password reset successful. Please login with your new password.' };
  }

  /**
   * Logout — invalidate refresh token
   */
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logged out successfully' };
  }
}
