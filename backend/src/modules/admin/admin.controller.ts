import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const adminService = new AdminService();

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.getDashboard();
  ApiResponse.success(res, result);
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { users, meta } = await adminService.listUsers(req);
  ApiResponse.success(res, users, 'Users retrieved', 200, meta);
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.updateUserStatus(req.params.id, req.body.isActive);
  ApiResponse.success(res, result, `User ${req.body.isActive ? 'activated' : 'deactivated'}`);
});

export const approveShop = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.approveShop(req.params.id, req.body.isApproved);
  ApiResponse.success(res, result, `Shop ${req.body.isApproved ? 'approved' : 'rejected'}`);
});
