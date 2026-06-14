import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { emitOrderUpdate, emitNotification } from '../../config/socket';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination';
import { Request } from 'express';

export class DeliveryService {
  /**
   * Register as delivery partner
   */
  async register(userId: string, data: {
    vehicleType: string;
    vehicleNumber?: string;
    licenseNumber?: string;
  }) {
    const existing = await prisma.deliveryPartner.findUnique({
      where: { userId },
    });

    if (existing) {
      throw ApiError.conflict('You are already registered as a delivery partner');
    }

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'DELIVERY_PARTNER' },
    });

    return prisma.deliveryPartner.create({
      data: {
        userId,
        vehicleType: data.vehicleType as any,
        vehicleNumber: data.vehicleNumber,
        licenseNumber: data.licenseNumber,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Get delivery partner profile
   */
  async getProfile(userId: string) {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        _count: { select: { orders: true } },
      },
    });

    if (!dp) {
      throw ApiError.notFound('Delivery partner profile not found');
    }

    return dp;
  }

  /**
   * Update delivery partner profile
   */
  async updateProfile(userId: string, data: any) {
    const dp = await prisma.deliveryPartner.findUnique({ where: { userId } });
    if (!dp) throw ApiError.notFound('Profile not found');

    return prisma.deliveryPartner.update({
      where: { userId },
      data,
    });
  }

  /**
   * Toggle availability
   */
  async toggleAvailability(userId: string, isAvailable: boolean) {
    return prisma.deliveryPartner.update({
      where: { userId },
      data: { isAvailable },
    });
  }

  /**
   * Get assigned orders
   */
  async getAssignedOrders(userId: string, req: Request) {
    const { page, limit, skip } = getPaginationParams(req);

    const dp = await prisma.deliveryPartner.findUnique({ where: { userId } });
    if (!dp) throw ApiError.notFound('Profile not found');

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { deliveryPartnerId: dp.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          shop: { select: { id: true, name: true, phone: true, street: true, city: true } },
          items: { include: { service: { select: { name: true } } } },
        },
      }),
      prisma.order.count({ where: { deliveryPartnerId: dp.id } }),
    ]);

    return { orders, meta: getPaginationMeta(page, limit, total) };
  }

  /**
   * Confirm pickup
   */
  async confirmPickup(userId: string, orderId: string) {
    const dp = await prisma.deliveryPartner.findUnique({ where: { userId } });
    if (!dp) throw ApiError.notFound('Profile not found');

    const order = await prisma.order.findFirst({
      where: { id: orderId, deliveryPartnerId: dp.id },
    });

    if (!order) throw ApiError.notFound('Order not found or not assigned to you');
    if (order.status !== 'PICKUP_ASSIGNED') throw ApiError.badRequest('Order not ready for pickup');

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PICKED_UP' },
    });

    emitOrderUpdate(orderId, { orderId, status: 'PICKED_UP' });
    emitNotification(order.customerId, {
      type: 'ORDER_STATUS',
      orderId,
      status: 'PICKED_UP',
      message: 'Your clothes have been picked up!',
    });

    return updated;
  }

  /**
   * Confirm delivery
   */
  async confirmDelivery(userId: string, orderId: string) {
    const dp = await prisma.deliveryPartner.findUnique({ where: { userId } });
    if (!dp) throw ApiError.notFound('Profile not found');

    const order = await prisma.order.findFirst({
      where: { id: orderId, deliveryPartnerId: dp.id },
    });

    if (!order) throw ApiError.notFound('Order not found or not assigned to you');
    if (order.status !== 'OUT_FOR_DELIVERY') throw ApiError.badRequest('Order not out for delivery');

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });

    // Update payment and earnings
    await prisma.payment.update({
      where: { orderId },
      data: { status: 'COMPLETED', paidAt: new Date() },
    });

    await prisma.deliveryPartner.update({
      where: { id: dp.id },
      data: {
        totalEarnings: { increment: order.totalAmount * 0.1 },
        totalDeliveries: { increment: 1 },
      },
    });

    emitOrderUpdate(orderId, { orderId, status: 'DELIVERED' });

    return updated;
  }

  /**
   * Get earnings summary
   */
  async getEarnings(userId: string) {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId },
      select: { totalEarnings: true, totalDeliveries: true },
    });

    if (!dp) throw ApiError.notFound('Profile not found');

    return {
      totalEarnings: dp.totalEarnings,
      totalDeliveries: dp.totalDeliveries,
      averagePerDelivery: dp.totalDeliveries > 0 ? dp.totalEarnings / dp.totalDeliveries : 0,
    };
  }

  /**
   * Update live location
   */
  async updateLocation(userId: string, lat: number, lng: number) {
    return prisma.deliveryPartner.update({
      where: { userId },
      data: { currentLat: lat, currentLng: lng },
    });
  }
}
