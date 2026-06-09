import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { Shirt, Sparkles, Clock, Compass, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Floating Header */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LAUNDRO</span>
        <Link to="/login"><Button variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-slate-800 bg-white/50 backdrop-blur-sm">Launch App</Button></Link>
      </nav>

      {/* Hero Section Container */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
        <div className="space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 fill-current" /> Next-generation laundry distribution matrix
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Smart garment care <br />managed <span className="text-blue-600">on demand</span>.
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
            Connect with top-rated commercial cleaners in your area. Get instant item pricing, tracking checkpoints, and reliable 24-hour delivery.
          </p>
          <div className="pt-2">
            <Link to="/shops">
              <Button className="rounded-xl px-8 py-6 bg-blue-600 font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition gap-2 group text-base">
                Discover Nearby Laundries <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Composition Block */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-10 max-w-md mx-auto" />
          <img 
            src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80" 
            alt="Laundro System Interface" 
            className="rounded-3xl shadow-2xl border border-slate-200/40 dark:border-slate-800/40 object-cover aspect-[4/3] w-full max-w-lg transform hover:scale-[1.01] transition duration-500"
          />
        </div>
      </section>

      {/* Structured Value Proposition Matrix */}
      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl inline-block"><Clock className="h-6 w-6" /></div>
            <h3 className="text-lg font-bold tracking-tight">Flexible Pickup</h3>
            <p className="text-xs text-slate-400 font-medium">Select explicit 30-minute processing blocks matching your schedule parameters.</p>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl inline-block"><Shirt className="h-6 w-6" /></div>
            <h3 className="text-lg font-bold tracking-tight">Premium Processing</h3>
            <p className="text-xs text-slate-400 font-medium">Certified partner stores adhere to multi-stage fabric inspection standards.</p>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl inline-block"><ShieldCheck className="h-6 w-6" /></div>
            <h3 className="text-lg font-bold tracking-tight">Garment Security</h3>
            <p className="text-xs text-slate-400 font-medium">Every item transaction batch is fully protected and monitored via digital transit seals.</p>
          </div>
        </div>
      </section>
    </div>
  );
};