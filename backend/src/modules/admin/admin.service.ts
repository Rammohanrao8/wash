import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination';
import { Request } from 'express';

export class AdminService {
  /**
   * Get dashboard analytics
   */
  async getDashboard() {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingShops,
      activeShops,
      activeDeliveries,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.laundryShop.count({ where: { isApproved: false } }),
      prisma.laundryShop.count({ where: { isApproved: true, isActive: true } }),
      prisma.deliveryPartner.count({ where: { isAvailable: true, isVerified: true } }),
    ]);

    return {
      users: { total: totalUsers },
      orders: { total: totalOrders },
      revenue: { total: totalRevenue._sum.amount || 0 },
      shops: { pending: pendingShops, active: activeShops },
      deliveryPartners: { active: activeDeliveries },
    };
  }

  /**
   * List all users
   */
  async listUsers(req: Request) {
    const { page, limit, skip } = getPaginationParams(req);
    const search = req.query.search as string;
    const role = req.query.role as any;

    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, phone: true, role: true,
          isActive: true, isVerified: true, createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, meta: getPaginationMeta(page, limit, total) };
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });
  }

  /**
   * Approve/Reject Shop
   */
  async approveShop(shopId: string, isApproved: boolean) {
    const shop = await prisma.laundryShop.update({
      where: { id: shopId },
      data: { isApproved },
      include: { owner: { select: { id: true, email: true } } },
    });

    // Notify shop owner
    await prisma.notification.create({
      data: {
        userId: shop.owner.id,
        title: isApproved ? 'Shop Approved! 🎉' : 'Shop Approval Rejected',
        message: isApproved ? 'Your shop has been approved and is now live!' : 'Your shop approval was rejected. Please contact support.',
        type: 'SYSTEM',
      },
    });

    return shop;
  }
}
