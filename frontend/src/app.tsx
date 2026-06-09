import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ShopListingPage } from '@/features/marketplace/ShopListingPage';
import { ShopDetailsPage } from '@/features/marketplace/ShopDetailsPage';
import { OrderTrackingPage } from '@/features/tracking/OrderTrackingPage';
import { AdminDashboard } from '@/features/admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Redirect root to shops listing */}
        <Route path="/" element={<Navigate to="/shops" replace />} />
        <Route path="/shops" element={<ShopListingPage />} />
        <Route path="/shops/:id" element={<ShopDetailsPage />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
