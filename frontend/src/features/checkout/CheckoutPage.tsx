import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useCartStore } from '@/store/useCartStore';
import { MapPin, Calendar, CreditCard, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, shopId, getTotalAmount, clearCart } = useCartStore();
  
  const [address, setAddress] = useState('123 Test Street, Hyderabad'); // Default for demo
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const orderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      clearCart();
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to place order');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    if (!address) {
      setError('Please provide a delivery address');
      return;
    }

    orderMutation.mutate({
      shopId,
      items: items.map(i => ({ serviceId: i.id, quantity: i.quantity })),
      pickupAddress: address,
      deliveryAddress: address,
      pickupScheduledAt: scheduledAt || undefined,
      notes,
      paymentMethod,
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
          Your laundry is in good hands. A delivery partner will be assigned shortly.
        </p>
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to tracking...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/shops')}>Explore Shops</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Address Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" /> Pickup & Delivery Details
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter your full address"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Scheduled Pickup Date (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Special Instructions</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Call before arrival"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Cash on Delivery</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pay when delivered</div>
                </div>
                <div 
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Online Payment</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Card, UPI, Netbanking</div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">Order Summary</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{item.quantity}x {item.name}</span>
                  <span className="font-medium text-slate-900 dark:text-white">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">₹{getTotalAmount()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Platform Fee</span>
                <span className="font-medium">₹20</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{getTotalAmount() + 20}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              disabled={orderMutation.isPending}
              className="w-full mt-6 py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {orderMutation.isPending ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin"/> Processing...</span>
              ) : (
                `Place Order • ₹${getTotalAmount() + 20}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};