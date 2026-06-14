import { apiClient } from './apiClient';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'DELIVERY_PARTNER';
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
  type: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD';
}

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterPayload) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  requestLoginOtp: async (email: string) => {
    const response = await apiClient.post('/auth/login-otp', { email });
    return response.data;
  },

  verifyLoginOtp: async (email: string, code: string) => {
    const response = await apiClient.post('/auth/verify-login-otp', { email, code });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  }
};
