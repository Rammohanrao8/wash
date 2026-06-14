import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { shopService, ShopService } from '@/services/shopService';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Star, MapPin, Phone, ArrowLeft, Clock, Info, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const ShopDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items: cartItems, addItem, removeItem, updateQuantity } = useCartStore();

  const { data: shopData, isLoading: shopLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => shopService.getShopDetails(id!),
    enabled: !!id,
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['shop-services', id],
    queryFn: () => shopService.getShopServices(id!),
    enabled: !!id,
  });

  const getQuantity = (serviceId: string) => {
    return cartItems.find((item) => item.id === serviceId)?.quantity || 0;
  };

  const handleAdd = (service: ShopService) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(id!, service);
  };

  if (shopLoading || servicesLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const shop = shopData?.data;
  const services = servicesData?.data || [];

  if (!shop) return <div>Shop not found</div>;

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Header */}
      <div className="relative -mx-4 sm:mx-0 sm:rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80"
            alt="Shop interior"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 px-6 pt-24 pb-8 sm:px-10 sm:pt-32 sm:pb-12 flex flex-col justify-end min-h-[300px]">
          <button 
            onClick={() => navigate('/shops')}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg">
                  Premium
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-sm font-medium border border-white/10">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {shop.rating ? shop.rating.toFixed(1) : 'New'} ({shop.totalReviews || 0} reviews)
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {shop.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>{shop.street}, {shop.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>{shop.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400">Status</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Accepting Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Services Menu</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Info className="h-4 w-4" /> All prices are estimated
            </div>
          </div>

          <div className="grid gap-4">
            {services.map((service: ShopService) => {
              const quantity = getQuantity(service.id);
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={service.id} 
                  className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                    quantity > 0 
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{service.name}</h3>
                        {quantity > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Added
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm font-medium mt-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg flex items-center">
                          <span className="text-sm mr-0.5 text-slate-400 font-normal">₹</span>
                          {service.price}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{service.durationHours} hrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-center shrink-0 h-full min-h-[80px]">
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAdd(service)}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all active:scale-95"
                        >
                          <Plus className="h-4 w-4" /> Add
                        </button>
                      ) : (
                        <div className="flex items-center bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(service.id, quantity - 1)}
                            className="p-3 text-blue-100 hover:text-white hover:bg-blue-700 transition-colors active:bg-blue-800"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(service.id, quantity + 1)}
                            className="p-3 text-blue-100 hover:text-white hover:bg-blue-700 transition-colors active:bg-blue-800"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Cart Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/20 dark:shadow-none">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Your Basket
            </h3>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Your basket is empty</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">Add services to start your order</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900 dark:text-white">{item.quantity}x</span>
                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Item Total</span>
                    <span className="font-medium">₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Platform Fee</span>
                    <span className="font-medium">₹20</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 20}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-6 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
                >
                  Checkout Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Floating Checkout Button */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-[72px] left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40">
          <Button 
            onClick={() => navigate('/checkout')}
            className="w-full py-6 text-lg font-bold rounded-xl flex justify-between items-center bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20"
          >
            <span>{cartItems.length} items</span>
            <span className="flex items-center gap-2">
              Proceed to Cart
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};