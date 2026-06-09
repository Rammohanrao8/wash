import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Navigation, CheckCircle, MapPin, PhoneCall } from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500 p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Logistics Operator Console</h1>
          <p className="text-xs text-slate-400 font-medium">Agent: <span className="text-blue-400 font-bold">Rider-749 (Active Status)</span></p>
        </div>
        <Badge className="bg-emerald-500 text-slate-950 border-none font-extrabold px-3 py-1 text-xs">
          On-Duty
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Action Manifest Task Deck */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Assigned Transit Manifests</h3>
          
          <Card className="bg-slate-850 border-slate-800 rounded-xl overflow-hidden text-white shadow-xl">
            <CardHeader className="bg-slate-800/40 border-b border-slate-800/80 p-4 flex flex-row justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">Task Block A</span>
                <CardTitle className="text-base font-extrabold">Manifest #LND-83921</CardTitle>
              </div>
              <Badge className="bg-amber-500/10 text-amber-400 border-none text-[11px] font-bold">Pickup Stage</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs md:text-sm font-medium">
              <div className="space-y-2 text-slate-300">
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" /> <span><strong className="text-white">Origin Location:</strong> Flat 402, Signature Towers, Jubilee Hills</span></p>
                <p className="flex items-start gap-2"><Truck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" /> <span><strong className="text-white">Merchant Drop:</strong> Sparkle Dry Cleaners Facility Complex B</span></p>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10">
                  <Navigation className="h-3.5 w-3.5" /> Stream Route Map
                </button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 border border-slate-700">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" /> Log Bags Picked Up
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Metric Earnings Deck Panel */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Shift Efficiency Logs</h3>
          <Card className="bg-slate-850 border-slate-800 text-white p-4 space-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold">Shift Payout Subtotal</span>
              <span className="text-lg font-black text-emerald-400">₹1,240.00</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Manifest Completions Count</span>
              <span className="font-bold text-white">8 Cycles</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};