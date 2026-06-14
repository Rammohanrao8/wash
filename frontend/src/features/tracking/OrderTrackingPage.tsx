import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { Package, Truck, CheckCircle2, Clock, MapPin, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OrderTrackingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getOrders(),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => orderService.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const orders = data?.data || [];

  const getStatusDetails = (status: string) => {
    switch(status) {
      case 'PLACED': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', text: 'Order Placed' };
      case 'CONFIRMED': return { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100', text: 'Confirmed by Shop' };
      case 'PICKUP_ASSIGNED': return { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-100', text: 'Pickup Assigned' };
      case 'PICKED_UP': return { icon: Package, color: 'text-purple-500', bg: 'bg-purple-100', text: 'Picked Up' };
      case 'PROCESSING': return { icon: Clock, color: 'text-pink-500', bg: 'bg-pink-100', text: 'In Wash' };
      case 'READY': return { icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-100', text: 'Ready for Delivery' };
      case 'OUT_FOR_DELIVERY': return { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Out for Delivery' };
      case 'DELIVERED': return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100', text: 'Delivered' };
      case 'CANCELLED': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', text: 'Cancelled' };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', text: status };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Track the status of your laundry</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Package className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-bold">No orders yet</h2>
          <p className="text-slate-500 mt-2">Looks like you haven't placed any laundry orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const statusInfo = getStatusDetails(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-sm font-semibold text-slate-500">Order #{order.orderNumber}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{order.shop?.name || 'Laundry Shop'}</h3>
                    <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${statusInfo.bg} dark:bg-slate-800`}>
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                    </div>
                    <span className={`font-bold ${statusInfo.color}`}>{statusInfo.text}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">{item.quantity}x {item.service?.name || 'Item'}</span>
                          <span className="font-medium text-slate-900 dark:text-white">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" /> Delivery Address
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{order.deliveryAddress}</p>
                    </div>

                    {['PLACED', 'CONFIRMED'].includes(order.status) && (
                      <Button 
                        variant="outline" 
                        onClick={() => cancelMutation.mutate({ id: order.id, reason: 'Customer changed mind' })}
                        disabled={cancelMutation.isPending}
                        className="w-full text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};