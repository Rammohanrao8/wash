import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError';
import { logger } from '../config/logger';

/**
 * Global error handler middleware
 * Must be registered LAST in Express middleware chain
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown[] = [];
  let isOperational = false;

  // ─── ApiError (our custom errors) ─────────────────────
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
    isOperational = err.isOperational;
  }

  // ─── Zod Validation Error ─────────────────────────────
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    isOperational = true;
  }

  // ─── Prisma Errors ────────────────────────────────────
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    isOperational = true;
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        message = `A record with this ${target} already exists`;
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Related record not found';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid relation data';
        break;
      default:
        statusCode = 400;
        message = `Database error: ${err.message}`;
    }
  }

  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
    isOperational = true;
  }

  // ─── JWT Errors ───────────────────────────────────────
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }

  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
    isOperational = true;
  }

  // ─── Syntax Error (bad JSON) ──────────────────────────
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
    isOperational = true;
  }

  // ─── Logging ──────────────────────────────────────────
  if (!isOperational) {
    logger.error('💥 Unhandled error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn(`⚠️  ${statusCode} ${message}`, {
      url: req.originalUrl,
      method: req.method,
    });
  }

  // ─── Response ─────────────────────────────────────────
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};
