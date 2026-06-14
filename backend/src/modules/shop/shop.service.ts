import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { getPaginationParams, getPaginationMeta, getSortParams } from '../../utils/pagination';
import { Request } from 'express';

export class ShopService {
  /**
   * Create a new laundry shop
   */
  async createShop(ownerId: string, data: any) {
    // Check if user already has a shop (optional: allow multiple)
    const existingShop = await prisma.laundryShop.findFirst({
      where: { ownerId },
    });

    if (existingShop) {
      throw ApiError.conflict('You already have a registered shop. Contact admin for additional shops.');
    }

    const shop = await prisma.laundryShop.create({
      data: {
        ownerId,
        ...data,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return shop;
  }

  /**
   * List shops with filtering, search, pagination, sorting
   */
  async listShops(req: Request) {
    const { page, limit, skip } = getPaginationParams(req);
    const { field, order } = getSortParams(req, ['rating', 'name', 'createdAt']);
    const search = req.query.search as string | undefined;
    const city = req.query.city as string | undefined;

    const where: Prisma.LaundryShopWhereInput = {
      isApproved: true,
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }

    const [shops, total] = await Promise.all([
      prisma.laundryShop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [field]: order },
        include: {
          owner: { select: { id: true, name: true } },
          services: { where: { isActive: true }, select: { id: true, name: true, price: true, unit: true } },
          _count: { select: { reviews: true, orders: true } },
        },
      }),
      prisma.laundryShop.count({ where }),
    ]);

    return {
      shops,
      meta: getPaginationMeta(page, limit, total),
    };
  }

  /**
   * Get shop by ID with full details
   */
  async getShopById(shopId: string) {
    const shop = await prisma.laundryShop.findUnique({
      where: { id: shopId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        services: { where: { isActive: true }, orderBy: { name: 'asc' } },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        _count: { select: { reviews: true, orders: true } },
      },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found');
    }

    return shop;
  }

  /**
   * Update shop (owner only)
   */
  async updateShop(ownerId: string, shopId: string, data: any) {
    const shop = await prisma.laundryShop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found or you are not the owner');
    }

    return prisma.laundryShop.update({
      where: { id: shopId },
      data,
      include: {
        owner: { select: { id: true, name: true } },
        services: { where: { isActive: true } },
      },
    });
  }

  /**
   * Toggle shop availability
   */
  async toggleAvailability(ownerId: string, shopId: string, isActive: boolean) {
    const shop = await prisma.laundryShop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found or you are not the owner');
    }

    return prisma.laundryShop.update({
      where: { id: shopId },
      data: { isActive },
    });
  }

  // ─── Service Management ───────────────────────────────

  /**
   * Add service to shop
   */
  async addService(ownerId: string, shopId: string, data: any) {
    const shop = await prisma.laundryShop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found or you are not the owner');
    }

    return prisma.service.create({
      data: {
        shopId,
        ...data,
      },
    });
  }

  /**
   * Update service
   */
  async updateService(ownerId: string, shopId: string, serviceId: string, data: any) {
    const shop = await prisma.laundryShop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found or you are not the owner');
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, shopId },
    });

    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    return prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }

  /**
   * Delete (soft) service
   */
  async deleteService(ownerId: string, shopId: string, serviceId: string) {
    const shop = await prisma.laundryShop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      throw ApiError.notFound('Shop not found or you are not the owner');
    }

    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });

    return { message: 'Service deleted successfully' };
  }

  /**
   * List services for a shop
   */
  async getShopServices(shopId: string) {
    return prisma.service.findMany({
      where: { shopId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // ─── Reviews ──────────────────────────────────────────

  /**
   * Add review to shop
   */
  async addReview(userId: string, shopId: string, data: { rating: number; comment?: string; orderId?: string }) {
    const shop = await prisma.laundryShop.findUnique({ where: { id: shopId } });
    if (!shop) throw ApiError.notFound('Shop not found');

    // Check for duplicate review on same order
    if (data.orderId) {
      const existing = await prisma.review.findUnique({
        where: { userId_orderId: { userId, orderId: data.orderId } },
      });
      if (existing) throw ApiError.conflict('You already reviewed this order');
    }

    const review = await prisma.review.create({
      data: { userId, shopId, ...data },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    // Update shop rating
    const stats = await prisma.review.aggregate({
      where: { shopId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.laundryShop.update({
      where: { id: shopId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        totalRatings: stats._count.rating,
      },
    });

    return review;
  }

  /**
   * Get reviews for a shop
   */
  async getShopReviews(shopId: string, req: Request) {
    const { page, limit, skip } = getPaginationParams(req);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { shopId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.review.count({ where: { shopId } }),
    ]);

    return { reviews, meta: getPaginationMeta(page, limit, total) };
  }
}
