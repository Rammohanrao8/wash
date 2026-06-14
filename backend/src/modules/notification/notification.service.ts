import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination';
import { Request } from 'express';

export class NotificationService {
  /**
   * List user notifications
   */
  async getNotifications(userId: string, req: Request) {
    const { page, limit, skip } = getPaginationParams(req);
    const unreadOnly = req.query.unreadOnly === 'true';

    const where = {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, meta: getPaginationMeta(page, limit, total) };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) throw ApiError.notFound('Notification not found');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  /**
   * Delete notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) throw ApiError.notFound('Notification not found');

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted' };
  }
}
