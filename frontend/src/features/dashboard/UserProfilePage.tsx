import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Identity Management</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">Administer security clearance settings, account vectors, and global variables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Aspect Side Profile Metadata */}
        <Card className="md:col-span-1 rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 overflow-hidden text-center p-6 space-y-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto shadow-md">
            AR
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-lg">Ananya Rao</h3>
            <p className="text-xs text-slate-400 font-medium">Verified Customer Level 2</p>
          </div>
          <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs">Revise Profile Metadata</Button>
        </Card>

        {/* Right Aspect Workspace Parameter Blocks */}
        <div className="md:col-span-2 space-y-4">
          <Card className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /> Saved Operational Nodes</CardTitle></CardHeader>
            <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm font-medium">
              <div className="py-2.5">
                <span className="font-bold text-slate-900 dark:text-white block text-xs uppercase tracking-wide text-blue-500">Primary Residence</span>
                Flat 402, Signature Towers, Jubilee Hills, Hyderabad - 500033
              </div>
              <div className="py-2.5 pt-3">
                <span className="font-bold text-slate-900 dark:text-white block text-xs uppercase tracking-wide text-indigo-500">Corporate HQ Office</span>
                Level 9, Tech Hub Catalyst, HITEC City, Hyderabad - 500081
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Platform Compliance Security</CardTitle></CardHeader>
            <CardContent className="text-xs text-slate-400 font-medium space-y-2">
              <p>Hardware Cryptography Session Layer: <span className="text-green-500 font-bold">Active</span></p>
              <p>Registered Interface Footprint: <span className="text-slate-900 dark:text-white font-bold">Apple Safari V19.2 (macOS)</span></p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};