import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
      },
    });

    return user;
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Create new address
   */
  async createAddress(userId: string, data: {
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    isDefault: boolean;
  }) {
    // If this is the default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default
    const count = await prisma.address.count({ where: { userId } });
    if (count === 0) {
      data.isDefault = true;
    }

    return prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  /**
   * Update address
   */
  async updateAddress(userId: string, addressId: string, data: Record<string, unknown>) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    // Handle default toggle
    if (data.isDefault === true) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted was default, make the most recent address default
    if (address.isDefault) {
      const latestAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (latestAddress) {
        await prisma.address.update({
          where: { id: latestAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }
}
