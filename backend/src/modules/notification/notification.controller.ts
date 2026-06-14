import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const notificationService = new NotificationService();

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { notifications, meta } = await notificationService.getNotifications(req.user!.userId, req);
  ApiResponse.success(res, notifications, 'Notifications retrieved', 200, meta);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.markAsRead(req.user!.userId, req.params.id);
  ApiResponse.success(res, result, 'Marked as read');
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.markAllAsRead(req.user!.userId);
  ApiResponse.success(res, result);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.deleteNotification(req.user!.userId, req.params.id);
  ApiResponse.success(res, result);
});
