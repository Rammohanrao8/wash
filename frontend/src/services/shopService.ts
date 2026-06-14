import { apiClient } from './apiClient';

export interface Shop {
  id: string;
  name: string;
  street: string;
  city: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  services?: ShopService[];
}

export interface ShopService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationHours: number;
  isActive: boolean;
}

export const shopService = {
  getShops: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get('/shops', { params });
    return response.data;
  },

  getShopDetails: async (id: string) => {
    const response = await apiClient.get(`/shops/${id}`);
    return response.data;
  },

  getShopServices: async (id: string) => {
    const response = await apiClient.get(`/shops/${id}/services`);
    return response.data;
  },
  
  getShopReviews: async (id: string) => {
    const response = await apiClient.get(`/shops/${id}/reviews`);
    return response.data;
  }
};
