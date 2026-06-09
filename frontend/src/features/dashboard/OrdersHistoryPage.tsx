import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, Calendar, ArrowUpRight } from 'lucide-react';

const HISTORIC_BATCH_DATA = [
  { id: 'LND-83921', shop: 'Sparkle Premium Dry Cleaners', price: '₹415', date: 'June 08, 2026', status: 'In Transit' },
  { id: 'LND-72104', shop: 'Express Wash & Fold', price: '₹180', date: 'May 24, 2026', status: 'Delivered' },
];

export const OrdersHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-black tracking-tight">Order Architecture Logs</h1>

      <div className="space-y-4">
        {HISTORIC_BATCH_DATA.map((manifest) => (
          <Card key={manifest.id} className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-sm">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight">{manifest.id}</span>
                  <Badge variant="secondary" className={`text-[10px] font-bold ${manifest.status === 'Delivered' ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'}`}>
                    {manifest.status}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">{manifest.shop}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {manifest.date}</span>
                  <span className="font-bold text-slate-900 dark:text-white">Amount: {manifest.price}</span>
                </div>
              </div>

              <Button onClick={() => navigate(`/tracking/${manifest.id}`)} variant="outline" size="sm" className="rounded-xl font-bold gap-1 self-start sm:self-center border-slate-200 dark:border-slate-800">
                Inspect Lifecycle <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};