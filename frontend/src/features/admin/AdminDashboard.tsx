import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard: React.FC = () => {
  // Analytical Core Configuration Definitions
  const systemMetrics = [
    { title: 'Gross Revenue', value: '₹4,82,900', delta: '+14.2% MoM', icon: IndianRupee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Active Dispatches', value: '342 Orders', delta: '42 pending assignment', icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
    { title: 'Platform Merchants', value: '84 Shops', delta: '6 onboarded today', icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Escalations Open', value: '3 Tickets', delta: 'Critical Priority SLA', icon: AlertTriangle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">System Control Matrix</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Global snapshot overview monitoring fulfillment velocity and marketplace metrics.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Operational Cluster: HYD-WEST
        </Badge>
      </div>

      {/* Grid Dashboard Aggregator Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {systemMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${metric.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" /> {metric.delta}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live Transaction Execution Log */}
      <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 p-4 bg-slate-50/50 dark:bg-slate-900/20">
          <CardTitle className="text-base font-bold tracking-tight">Active Core Exceptions Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/30 dark:bg-slate-900/10">
                <th className="p-4">Incident ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Merchant Entity</th>
                <th className="p-4">SLA Violations Clock</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                <td className="p-4 font-bold text-blue-600">#INC-0492</td>
                <td className="p-4 text-slate-700 dark:text-slate-300">Ananya R.</td>
                <td className="p-4">Sparkle Cleaners</td>
                <td className="p-4">
                  <Badge className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-none font-bold">
                    +18 Min Overdue
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:opacity-90 px-3 py-1.5 rounded-lg transition">
                    Dispatch Agent
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};