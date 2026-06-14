import { apiClient } from './apiClient';

export interface OrderItemPayload {
  serviceId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shopId: string;
  items: OrderItemPayload[];
  pickupAddress: string;
  deliveryAddress: string;
  pickupScheduledAt?: string;
  notes?: string;
  paymentMethod?: 'COD' | 'ONLINE';
}

export const orderService = {
  createOrder: async (data: CreateOrderPayload) => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  getOrders: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: string, reason: string) => {
    const response = await apiClient.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  }
};
