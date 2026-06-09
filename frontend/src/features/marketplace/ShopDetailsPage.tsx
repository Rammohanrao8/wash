import React from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Star, ShoppingBag, ShieldCheck } from 'lucide-react';

const SERVICE_ITEMS = [
  { id: 'item-1', name: 'Premium Cotton Shirt', category: 'Washing & Ironing', price: 40 },
  { id: 'item-2', name: 'Denim Jeans', category: 'Washing & Ironing', price: 60 },
  { id: 'item-3', name: 'Designer Silk Saree', category: 'Dry Cleaning', price: 250 },
  { id: 'item-4', name: 'Winter Heavy Jacket', category: 'Dry Cleaning', price: 180 },
];

export const ShopDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const shopName = "Sparkle Premium Dry Cleaners"; // Typically resolved dynamically via hooks
  
  const { items, addItem, updateQuantity } = useCartStore();

  const getItemQty = (itemId: string) => {
    return items.find((i) => i.id === itemId)?.quantity || 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Store Details & Catalog Selection */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 border-none">Open Now</Badge>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Premium Care Partner</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">{shopName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Specialized deep washing, eco-friendly chemical solvents for dry cleaning, and automated low-temperature crease pressing.
          </p>
        </div>

        {/* Pricing Matrix */}
        <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800/60 overflow-hidden bg-white dark:bg-slate-900/40 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
            <CardTitle className="text-lg font-bold tracking-tight">Select Items & Treatments</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
            {SERVICE_ITEMS.map((item) => {
              const qty = getItemQty(item.id);
              return (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm md:text-base tracking-tight">{item.name}</h4>
                    <span className="inline-block text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">₹{item.price}</span>
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-2 py-1 shadow-md shadow-blue-500/20">
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-white/10" onClick={() => updateQuantity(item.id, qty - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-xs font-bold min-w-[16px] text-center">{qty}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-white/10" onClick={() => addItem(id || '1', shopName, item)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-xl font-bold border-blue-200 dark:border-blue-900/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all" onClick={() => addItem(id || '1', shopName, item)}>
                        Add +
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Mini Checkout/Cart View */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24 rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-md shadow-xl shadow-slate-100/10 dark:shadow-none overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2 tracking-tight">
              <ShoppingBag className="h-5 w-5 text-blue-600" /> Cart Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <p className="text-sm font-medium">Your basket is feeling empty.</p>
                <p className="text-xs">Add garments to compile your scheduling batch.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {i.name} <span className="text-xs text-slate-400 font-bold">x{i.quantity}</span>
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold">Subtotal</span>
                  <span className="text-lg font-black text-blue-600">
                    ₹{useCartStore.getState().getCartTotal()}
                  </span>
                </div>
                <Button className="w-full rounded-xl py-5 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold shadow-md shadow-blue-500/10 hover:opacity-95 transition">
                  Proceed to Pickup Schedule
                </Button>
                <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
                  <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" /> Multi-point inspection & safety seal standard.
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};