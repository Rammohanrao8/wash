import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { MapPin, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState('online');

  const executeOrderSubmission = () => {
    clearCart();
    // Simulate navigation redirect targeting transactional verification id mapping
    navigate('/tracking/LND-83921');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-black tracking-tight">Finalize Logistics Manifest</h1>

      <div className="space-y-4">
        {/* Component 1: Route Coordinates */}
        <Card className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /> Collection & Delivery Coordinate</CardTitle></CardHeader>
          <CardContent className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300">
            Flat 402, Signature Towers, Jubilee Hills, Hyderabad, Telangana - 500033
          </CardContent>
        </Card>

        {/* Component 2: Chrono Processing Node */}
        <Card className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-indigo-500" /> Operational Timing Window</CardTitle></CardHeader>
          <CardContent className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300">
            Pickup Assigned: <span className="font-bold text-slate-900 dark:text-white">Tomorrow, 09:00 AM - 11:00 AM</span>
          </CardContent>
        </Card>

        {/* Component 3: Financial Routing Infrastructure */}
        <Card className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold flex items-center gap-2"><CreditCard className="h-4 w-4 text-emerald-500" /> Payment Gateway Routing</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition text-center space-y-1 ${paymentMethod === 'online' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <h4 className="text-sm font-bold">Instant Online Routing</h4>
              <p className="text-[10px] text-slate-400 font-medium">UPI, Cards, NetBanking protocol handles</p>
            </div>
            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition text-center space-y-1 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <h4 className="text-sm font-bold">Cash / Pay on Pickup</h4>
              <p className="text-[10px] text-slate-400 font-medium">Settle parameters directly with agent field runner</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={executeOrderSubmission} className="w-full rounded-xl py-6 bg-gradient-to-r from-blue-600 to-indigo-600 font-black text-white text-base shadow-xl shadow-blue-500/10">
          Commit Order Protocols
        </Button>
      </div>
    </div>
  );
};