import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, getCartTotal, shopName } = useCartStore();
  const navigate = useNavigate();
  const totalCost = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400"><ShoppingCart className="h-8 w-8" /></div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Your cart is empty</h2>
          <p className="text-xs text-slate-400 max-w-xs">Explore top facilities nearby to assign clean care parameters to your garments.</p>
        </div>
        <Link to="/shops"><Button className="rounded-xl bg-blue-600 font-bold">Browse Cleaners</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-black tracking-tight">Review Processing Batch</h1>
      <p className="text-xs text-slate-400 font-bold uppercase -mt-4">Sourced from: <span className="text-blue-600">{shopName}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Active Line Items Ledger */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.category}</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white mt-1">₹{item.price} <span className="text-[10px] text-slate-400 font-medium">per item</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md text-slate-500 hover:bg-white dark:hover:bg-slate-700" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md text-slate-500 hover:bg-white dark:hover:bg-slate-700" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-500 rounded-lg" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic Aggregated Cost Ledger Panel */}
        <div className="md:col-span-1">
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-sm p-4 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Bill Details</h3>
            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex justify-between"><span>Item Total</span><span className="text-slate-900 dark:text-white font-bold">₹{totalCost}</span></div>
              <div className="flex justify-between"><span>Partner Delivery</span><span className="text-slate-900 dark:text-white font-bold text-green-500">FREE</span></div>
              <div className="flex justify-between"><span>Platform Surcharge</span><span className="text-slate-900 dark:text-white font-bold">₹15</span></div>
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>Total Payable</span><span className="text-blue-600">₹{totalCost + 15}</span>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} className="w-full rounded-xl py-5 bg-blue-600 font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition flex items-center justify-center gap-1.5 text-sm">
              Confirm Logistics <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};