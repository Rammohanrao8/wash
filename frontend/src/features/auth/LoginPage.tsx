import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LoginPage: React.FC = () => {
  const [credential, setCredential] = useState('');
  const navigate = useNavigate();

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (credential.trim()) {
      // Pass the credential state forward via history state router mapping
      navigate('/verify-otp', { state: { destination: credential } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_4px_40px_rgba(0,0,0,0.02)]"
      >
        <div className="space-y-2 text-center">
          <Link to="/" className="inline-block text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            LAUNDRO
          </Link>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
          <p className="text-xs text-slate-400 font-medium">Verify your profile instantly via passwordless OTP routing.</p>
        </div>

        <form onSubmit={handleFormSubmission} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email or Mobile Number</label>
            <input
              type="text"
              required
              placeholder="name@company.com or +91 XXXXX XXXXX"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl py-6 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold shadow-lg shadow-blue-500/10 hover:opacity-95 transition flex items-center justify-center gap-2 group">
            Request Secure Token <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition" />
          </Button>
        </form>

        <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
          <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" /> Multi-factor hardware authentication layer active.
        </div>
      </motion.div>
    </div>
  );
};