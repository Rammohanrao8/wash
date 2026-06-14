import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Extract pagination parameters from request query
 */
export function getPaginationParams(req: Request, defaultLimit = 10, maxLimit = 100): PaginationParams {
  let page = parseInt(req.query.page as string, 10) || 1;
  let limit = parseInt(req.query.limit as string, 10) || defaultLimit;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Build pagination result meta object
 */
export function getPaginationMeta(page: number, limit: number, total: number): PaginationResult {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Extract sorting parameters from request query
 */
export function getSortParams(
  req: Request,
  allowedFields: string[],
  defaultField = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): { field: string; order: 'asc' | 'desc' } {
  const sortBy = (req.query.sortBy as string) || defaultField;
  const sortOrder = ((req.query.sortOrder as string) || defaultOrder).toLowerCase();

  const field = allowedFields.includes(sortBy) ? sortBy : defaultField;
  const order = sortOrder === 'asc' ? 'asc' : 'desc';

  return { field, order };
}
