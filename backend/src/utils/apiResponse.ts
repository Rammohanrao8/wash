import { Response } from 'express';

export interface ApiResponseData<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: PaginationMeta
  ): Response {
    const response: ApiResponseData<T> = {
      success: true,
      statusCode,
      message,
      data,
    };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response, message = 'Deleted successfully'): Response {
    return res.status(204).send();
  }

  static error(
    res: Response,
    message = 'Something went wrong',
    statusCode = 500,
    errors?: unknown[]
  ): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }
}
