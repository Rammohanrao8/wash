import { OrderStatus, Prisma } from '@prisma/client';
import { Request } from 'express';
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { getPaginationParams, getPaginationMeta, getSortParams } from '../../utils/pagination';
import { ORDER_STATUS_TRANSITIONS } from '../../types';
import { emitOrderUpdate, emitNotification } from '../../config/socket';
import { sendEmail, orderNotificationTemplate } from '../../config/email';
import { logger } from '../../config/logger';
import { v4 as uuidv4 } from 'uuid';

// Simple order number generator
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WSH-${timestamp}-${random}`;
}

export class OrderService {
  /**
   * Create a new order
   */
  async createOrder(customerId: string, data: {
    shopId: string;
    items: { serviceId: string; quantity: number }[];
    pickupAddress: string;
    deliveryAddress: string;
    pickupScheduledAt?: string;
    notes?: string;
    paymentMethod?: string;
  }) {
    // Verify shop exists and is active
    const shop = await prisma.laundryShop.findUnique({
      where: { id: data.shopId },
      include: { services: { where: { isActive: true } } },
    });

    if (!shop || !shop.isApproved || !shop.isActive) {
      throw ApiError.badRequest('Shop is not available');
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems: { serviceId: string; quantity: number; price: number; subtotal: number }[] = [];

    for (const item of data.items) {
      const service = shop.services.find((s) => s.id === item.serviceId);
      if (!service) {
        throw ApiError.badRequest(`Service ${item.serviceId} not found or inactive`);
      }
      const subtotal = service.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: service.price,
        subtotal,
      });
    }

    // Create order with items and payment
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId,
        shopId: data.shopId,
        totalAmount,
        pickupAddress: data.pickupAddress,
        deliveryAddress: data.deliveryAddress,
        pickupScheduledAt: data.pickupScheduledAt ? new Date(data.pickupScheduledAt) : null,
        notes: data.notes,
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            amount: totalAmount,
            method: (data.paymentMethod as any) || 'COD',
          },
        },
      },
      include: {
        items: { include: { service: true } },
        shop: { select: { id: true, name: true, phone: true } },
        payment: true,
      },
    });

    // Create notification for shop owner
    await prisma.notification.create({
      data: {
        userId: shop.ownerId,
        title: 'New Order! 🎉',
        message: `You have a new order #${order.orderNumber} worth ₹${totalAmount}`,
        type: 'ORDER_UPDATE',
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      },
    });

    // Emit real-time notification
    emitNotification(shop.ownerId, {
      type: 'NEW_ORDER',
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount,
    });

    logger.info(`📦 Order created: ${order.orderNumber} by ${customerId}`);

    return order;
  }

  /**
   * List orders (filtered by user role)
   */
  async listOrders(userId: string, role: string, req: Request) {
    const { page, limit, skip } = getPaginationParams(req);
    const { field, order } = getSortParams(req, ['createdAt', 'totalAmount', 'status']);
    const statusFilter = req.query.status as string | undefined;

    let where: Prisma.OrderWhereInput = {};

    // Role-based filtering
    switch (role) {
      case 'CUSTOMER':
        where.customerId = userId;
        break;
      case 'SHOP_OWNER':
        where.shop = { ownerId: userId };
        break;
      case 'DELIVERY_PARTNER':
        where.deliveryPartnerId = (await prisma.deliveryPartner.findUnique({
          where: { userId },
        }))?.id;
        break;
      case 'ADMIN':
        // No filter — admin sees all
        break;
    }

    if (statusFilter) {
      where.status = statusFilter as OrderStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [field]: order },
        include: {
          items: { include: { service: { select: { name: true } } } },
          shop: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true, email: true } },
          payment: { select: { method: true, status: true } },
          deliveryPartner: { select: { id: true, user: { select: { name: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, meta: getPaginationMeta(page, limit, total) };
  }

  /**
   * Get order details
   */
  async getOrderById(orderId: string, userId: string, role: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { service: true } },
        shop: { select: { id: true, name: true, phone: true, street: true, city: true } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
        payment: true,
        deliveryPartner: {
          select: {
            id: true,
            vehicleType: true,
            vehicleNumber: true,
            currentLat: true,
            currentLng: true,
            user: { select: { name: true, phone: true } },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Authorization check
    if (role === 'CUSTOMER' && order.customerId !== userId) {
      throw ApiError.forbidden('You can only view your own orders');
    }

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string, userId: string, role: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shop: { select: { ownerId: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Verify permission
    if (role === 'SHOP_OWNER' && order.shop.ownerId !== userId) {
      throw ApiError.forbidden('Not authorized');
    }

    // Validate status transition
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions?.includes(status)) {
      throw ApiError.badRequest(
        `Cannot transition from ${order.status} to ${status}. Allowed: ${allowedTransitions?.join(', ') || 'none'}`
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
      include: {
        items: { include: { service: true } },
        shop: { select: { id: true, name: true } },
        payment: true,
      },
    });

    // Update payment status on delivery
    if (status === 'DELIVERED') {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'COMPLETED', paidAt: new Date() },
      });

      // Update delivery partner earnings
      if (order.deliveryPartnerId) {
        await prisma.deliveryPartner.update({
          where: { id: order.deliveryPartnerId },
          data: {
            totalEarnings: { increment: order.totalAmount * 0.1 }, // 10% delivery fee
            totalDeliveries: { increment: 1 },
          },
        });
      }
    }

    // Create notification for customer
    const statusMessages: Record<string, string> = {
      CONFIRMED: 'Your order has been confirmed by the shop!',
      PICKUP_ASSIGNED: 'A delivery partner has been assigned for pickup.',
      PICKED_UP: 'Your clothes have been picked up!',
      PROCESSING: 'Your laundry is being processed.',
      READY: 'Your laundry is ready!',
      OUT_FOR_DELIVERY: 'Your laundry is out for delivery!',
      DELIVERED: 'Your laundry has been delivered. Enjoy! 🎉',
      CANCELLED: 'Your order has been cancelled.',
    };

    await prisma.notification.create({
      data: {
        userId: order.customer.id,
        title: `Order #${order.orderNumber} — ${status.replace(/_/g, ' ')}`,
        message: statusMessages[status] || `Order status updated to ${status}`,
        type: 'ORDER_UPDATE',
        metadata: { orderId: order.id, status },
      },
    });

    // Real-time updates
    emitOrderUpdate(orderId, { orderId, status, orderNumber: order.orderNumber });
    emitNotification(order.customer.id, {
      type: 'ORDER_STATUS',
      orderId: order.id,
      status,
      message: statusMessages[status],
    });

    // Email notification
    await sendEmail({
      to: order.customer.email!,
      subject: `Order #${order.orderNumber} — ${status.replace(/_/g, ' ')}`,
      html: orderNotificationTemplate(
        order.customer.name || 'Customer',
        order.orderNumber,
        status,
        statusMessages[status] || ''
      ),
    });

    return updatedOrder;
  }

  /**
   * Assign delivery partner to order
   */
  async assignDeliveryPartner(orderId: string, deliveryPartnerId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound('Order not found');

    if (order.status !== 'CONFIRMED') {
      throw ApiError.badRequest('Order must be confirmed before assigning delivery');
    }

    const dp = await prisma.deliveryPartner.findUnique({
      where: { id: deliveryPartnerId },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!dp || !dp.isVerified || !dp.isAvailable) {
      throw ApiError.badRequest('Delivery partner not available');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryPartnerId,
        status: 'PICKUP_ASSIGNED',
      },
      include: {
        deliveryPartner: {
          select: { id: true, user: { select: { name: true, phone: true } } },
        },
      },
    });

    // Notify delivery partner
    emitNotification(dp.user.id, {
      type: 'DELIVERY_ASSIGNMENT',
      orderId,
      message: `New pickup assignment: Order #${order.orderNumber}`,
    });

    return updated;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, userId: string, reason: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound('Order not found');

    if (order.customerId !== userId) {
      throw ApiError.forbidden('You can only cancel your own orders');
    }

    const cancellableStatuses = ['PLACED', 'CONFIRMED'];
    if (!cancellableStatuses.includes(order.status)) {
      throw ApiError.badRequest('Order cannot be cancelled at this stage');
    }

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelReason: reason,
      },
    });
  }
}
