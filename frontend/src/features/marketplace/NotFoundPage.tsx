import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6 selection:bg-blue-500 selection:text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl w-24 h-24 mx-auto" />
        <div className="p-5 bg-white dark:bg-slate-900 rounded-full border border-slate-200/60 dark:border-slate-800/60 inline-block shadow-md text-slate-400 relative z-10">
          <Compass className="h-10 w-10 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Coordinate Malfunction</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          The view path parameter requested does not mapping configuration points. It may have moved or been decommissioned.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => navigate('/shops')} className="rounded-xl px-5 py-5 bg-blue-600 font-bold text-white text-xs shadow-md shadow-blue-500/10">
          Return to Marketplace Base
        </Button>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl px-5 py-5 border-slate-200 dark:border-slate-800 font-bold text-xs bg-white dark:bg-slate-900">
          Step Back
        </Button>
      </div>
    </div>
  );
};