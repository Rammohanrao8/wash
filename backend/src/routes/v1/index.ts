import { Router } from 'express';
import authRoutes from '../../modules/auth/auth.routes';
import userRoutes from '../../modules/user/user.routes';
import shopRoutes from '../../modules/shop/shop.routes';
import orderRoutes from '../../modules/order/order.routes';
import deliveryRoutes from '../../modules/delivery/delivery.routes';
import paymentRoutes from '../../modules/payment/payment.routes';
import notificationRoutes from '../../modules/notification/notification.routes';
import adminRoutes from '../../modules/admin/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shops', shopRoutes);
router.use('/orders', orderRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
