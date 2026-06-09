import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LandingPage } from '@/features/marketplace/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { OtpPage } from '@/features/auth/OtpPage';
import { ShopListingPage } from '@/features/marketplace/ShopListingPage';
import { ShopDetailsPage } from '@/features/marketplace/ShopDetailsPage';
import { CartPage } from '@/features/checkout/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { OrdersHistoryPage } from '@/features/dashboard/OrdersHistoryPage';
import { OrderTrackingPage } from '@/features/tracking/OrderTrackingPage';
import { UserProfilePage } from '@/features/dashboard/UserProfilePage';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { DeliveryDashboard } from '@/features/delivery/DeliveryDashboard';
import { NotFoundPage } from '@/features/marketplace/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Absolute Landing / Context Entrance */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Standalone Authentication Modules */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

      {/* Main Core Marketplace Routes Shell */}
      <Route element={<MainLayout />}>
        <Route path="/shops" element={<ShopListingPage />} />
        <Route path="/shops/:id" element={<ShopDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersHistoryPage />} />
        <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />
        <Route path="/dashboard" element={<UserProfilePage />} />
      </Route>

      {/* Control Dashboard Portals */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/delivery/*" element={<DeliveryDashboard />} />

      {/* Wildcard 404 Route */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};