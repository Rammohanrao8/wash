import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, MapPin, User, Star, Compass, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { ModeToggle } from '@/components/ModeToggle';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      {/* Dynamic Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              LAUNDRO
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 cursor-pointer transition">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium max-w-[200px] truncate">Jubilee Hills, Hyderabad</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/shops" className={`text-sm font-medium transition ${isActive('/shops') ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}>Explore</Link>
            <Link to="/orders" className={`text-sm font-medium transition ${isActive('/orders') ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}>Track Orders</Link>
            <ModeToggle />
            <Link to="/cart">
              <Button variant="outline" className="relative gap-2 border-slate-200 dark:border-slate-800">
                <ShoppingBag className="h-4 w-4" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="icon" variant="ghost" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Primary Context Container */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Ergonomic Mobile App Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg z-50 px-4 py-2 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <Link to="/shops" className={`flex flex-col items-center gap-1 p-2 transition ${isActive('/shops') ? 'text-blue-600' : 'text-slate-400'}`}>
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </Link>
        <Link to="/orders" className={`flex flex-col items-center gap-1 p-2 transition ${isActive('/orders') ? 'text-blue-600' : 'text-slate-400'}`}>
          <History className="h-5 w-5" />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link to="/cart" className={`relative flex flex-col items-center gap-1 p-2 transition ${isActive('/cart') ? 'text-blue-600' : 'text-slate-400'}`}>
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-medium">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 p-2 transition ${isActive('/dashboard') ? 'text-blue-600' : 'text-slate-400'}`}>
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};