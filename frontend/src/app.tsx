import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';

// Auth Pages
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { OtpPage } from '@/features/auth/OtpPage';

// Customer Pages
import { ShopListingPage } from '@/features/marketplace/ShopListingPage';
import { ShopDetailsPage } from '@/features/marketplace/ShopDetailsPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { OrderTrackingPage } from '@/features/tracking/OrderTrackingPage';

// Shared
import { ProtectedRoute } from '@/components/ProtectedRoute';

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

      <Route element={<MainLayout />}>
        {/* Redirect Root */}
        <Route path="/" element={<Navigate to="/shops" replace />} />

        {/* Public/Customer Marketplace */}
        <Route path="/shops" element={<ShopListingPage />} />
        <Route path="/shops/:id" element={<ShopDetailsPage />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
        </Route>

        {/* Protected Shop Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SHOP_OWNER']} />}>
          <Route path="/dashboard/shop" element={<div className="p-8">Shop Dashboard coming soon</div>} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/dashboard/admin" element={<div className="p-8">Admin Dashboard coming soon</div>} />
        </Route>
        
        {/* Protected Delivery Routes */}
        <Route element={<ProtectedRoute allowedRoles={['DELIVERY_PARTNER']} />}>
          <Route path="/dashboard/delivery" element={<div className="p-8">Delivery Dashboard coming soon</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
