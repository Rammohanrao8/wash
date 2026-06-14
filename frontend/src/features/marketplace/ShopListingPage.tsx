import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { shopService } from '@/services/shopService';
import { MapPin, Star, Search, Filter, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export const ShopListingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['shops', searchTerm],
    queryFn: () => shopService.getShops({ search: searchTerm }),
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <section className="relative rounded-3xl overflow-hidden bg-blue-600 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium border border-white/10 shadow-sm">
            <Compass className="h-4 w-4" />
            Discover Local Services
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Premium Laundry,<br />Delivered to You.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-lg leading-relaxed">
            Find the best-rated laundry shops in your area with real-time tracking and professional care.
          </p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-2 md:p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
            placeholder="Search by shop name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button className="px-4 py-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-900 dark:text-white">All</button>
            <button className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Top Rated</button>
            <button className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Nearest</button>
          </div>
        </div>
      </section>

      {/* Grid List */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Top Rated Shops
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs py-1 px-2.5 rounded-full font-semibold">
              {data?.data?.length || 0}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load shops. Please try again.</p>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No shops found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((shop: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={shop.id}
                className="group flex flex-col rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Area */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3`}
                    alt={shop.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm text-slate-900 dark:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-bold border border-white/20">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    {shop.rating ? shop.rating.toFixed(1) : 'New'}
                    <span className="text-slate-400 font-normal text-xs ml-0.5">({shop.totalReviews || 0})</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {shop.name}
                    </h3>
                    
                    <div className="mt-2.5 flex items-start gap-1.5 text-slate-500 dark:text-slate-400">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                      <p className="text-sm line-clamp-2 leading-relaxed">
                        {shop.street}, {shop.city}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <div className="flex -space-x-2">
                      {/* Fake avatars for "recent customers" */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden z-[${4-i}]`}>
                          <img src={`https://i.pravatar.cc/100?img=${i + index * 3}`} alt="User" />
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      to={`/shops/${shop.id}`}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-500/10 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white rounded-xl text-sm font-semibold transition-colors duration-300"
                    >
                      View Services
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};