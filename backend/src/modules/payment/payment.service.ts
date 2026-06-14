import { prisma } from '../../config/database';
import { ApiError } from '../../utils/apiError';

export class PaymentService {
  /**
   * Create an online payment intent/record (Placeholder for Stripe/Razorpay)
   */
  async createPaymentRecord(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw ApiError.notFound('Order not found');
    if (order.customerId !== userId) throw ApiError.forbidden('Not your order');

    if (order.payment?.method === 'COD') {
      throw ApiError.badRequest('Order is already set to Cash on Delivery');
    }

    if (order.payment?.status === 'COMPLETED') {
      throw ApiError.badRequest('Payment is already completed');
    }

    // This is where you would integrate Stripe/Razorpay:
    // const session = await stripe.checkout.sessions.create({...})
    // return { clientSecret: session.client_secret }

    return {
      message: 'Online payment gateway integration pending',
      amount: order.totalAmount,
      orderId,
    };
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(orderId: string, userId: string, role: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw ApiError.notFound('Order not found');

    if (role === 'CUSTOMER' && order.customerId !== userId) {
      throw ApiError.forbidden('Not authorized');
    }

    return order.payment;
  }

  /**
   * Update payment status (e.g. webhook from gateway or admin action)
   */
  async updatePaymentStatus(paymentId: string, status: string, transactionId?: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw ApiError.notFound('Payment record not found');

    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status as any,
        transactionId,
        paidAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });
  }
}
