import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, Clock, MapPin, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Decoupled Static Dummy Data Structure representing multi-service shops
const SHOPS_DATA = [
  {
    id: '1',
    name: 'Sparkle Premium Dry Cleaners',
    rating: 4.8,
    reviewsCount: 120,
    distance: '1.2 km',
    deliveryTime: '24-48 hrs',
    startingPrice: 49,
    services: ['Dry Cleaning', 'Premium Care', 'Ironing'],
    image: 'https://images.unsplash.com/photo-1545173168-9f1947e8b943?auto=format&fit=crop&w=600&q=80',
    featured: true,
  },
  {
    id: '2',
    name: 'Express Wash & Fold',
    rating: 4.5,
    reviewsCount: 84,
    distance: '2.5 km',
    deliveryTime: '12-24 hrs',
    startingPrice: 19,
    services: ['Washing', 'Ironing'],
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    featured: false,
  },
];

export const ShopListingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Washing', 'Ironing', 'Dry Cleaning', 'Premium Care'];

  return (
    <div className="space-y-6">
      {/* Premium Discovery Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 md:p-10 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=1200&q=80')] mix-blend-overlay opacity-10 bg-cover bg-center" />
        <div className="relative max-w-2xl space-y-4">
          <Badge className="bg-white/20 text-white backdrop-blur-md border-none gap-1 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 fill-white" /> Free pickup on orders above ₹299
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            Expert clothing care, <br />delivered to your doorstep.
          </h1>
        </div>
      </div>

      {/* Floating Interactive Controls Container */}
      <div className="sticky top-16 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for clothes cleaners or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
        </div>

        {/* Dynamic Category Scrollbar */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Button variant="outline" size="sm" className="gap-2 shrink-0 rounded-xl border-slate-200 dark:border-slate-800">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-xl shrink-0 border-slate-200 dark:border-slate-800 font-medium transition-all"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Optimized Grid Layout */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {SHOPS_DATA.map((shop) => (
            <motion.div
              key={shop.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/shops/${shop.id}`}>
                <Card className="group overflow-hidden rounded-2xl border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900/40 backdrop-blur-sm cursor-pointer flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    {shop.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 border-none shadow-md">
                        Top Rated
                      </Badge>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="h-3.5 w-3.5 text-blue-500" /> {shop.deliveryTime}
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition tracking-tight">
                          {shop.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                          <Star className="h-3.5 w-3.5 fill-current" /> {shop.rating}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5" /> {shop.distance} Away
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {shop.services.map((srv) => (
                        <Badge key={srv} variant="secondary" className="text-[10px] font-medium tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none">
                          {srv}
                        </Badge>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400 font-medium">Starts from</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ₹{shop.startingPrice}<span className="text-xs font-normal text-slate-400">/item</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};