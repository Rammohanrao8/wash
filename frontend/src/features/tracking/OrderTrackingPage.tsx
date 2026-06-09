import React from 'react';
import { CheckCircle2, Circle, Truck, Sparkles, Shirt, Box, KanbanSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define the operational tracking sequence
const TIMELINE_STEPS = [
  { id: '1', title: 'Order Confirmed', desc: 'Shop has registered your batch', status: 'completed', icon: CheckCircle2 },
  { id: '2', title: 'Driver Assigned', desc: 'Rider moving toward pickup coordinate', status: 'completed', icon: Truck },
  { id: '3', title: 'Picked Up', desc: 'Items locked in transition transit bags', status: 'active', icon: Box },
  { id: '4', title: 'In Washing Cycle', desc: 'Deep washing process executed', status: 'pending', icon: Shirt },
  { id: '5', title: 'Quality Inspection', desc: 'Garment verification checks', status: 'pending', icon: Sparkles },
  { id: '6', title: 'Out for Delivery', desc: 'Clean items headed home', status: 'pending', icon: Truck },
];

export const OrderTrackingPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden bg-white dark:bg-slate-900/40 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-blue-950 p-6 text-white flex flex-row items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Live Tracking Matrix</span>
            <CardTitle className="text-xl font-extrabold tracking-tight">Order #LND-83921</CardTitle>
          </div>
          <Badge className="bg-blue-500 text-white border-none py-1 px-3 rounded-full font-bold text-xs animate-pulse">
            Processing
          </Badge>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex gap-4 items-start">
                  {/* Timeline Node Icon Indicator */}
                  <div className={`absolute -left-6 transform -translate-x-0.5 z-10 p-1 rounded-full transition-all ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400' :
                    step.status === 'active' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' :
                    'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 fill-current text-white dark:text-green-950" />
                    ) : (
                      <div className="h-4 w-4 flex items-center justify-center font-black text-[10px]">{idx + 1}</div>
                    )}
                  </div>

                  {/* Operational Metrics Text Block */}
                  <div className="space-y-1">
                    <h3 className={`font-bold text-sm md:text-base tracking-tight ${
                      step.status === 'active' ? 'text-blue-600 dark:text-blue-400' : 
                      step.status === 'pending' ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};