import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export const OtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const targetDestination = location.state?.destination || 'your profile address';
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) return;
    const computedOtp = [...otp];
    computedOtp[index] = val;
    setOtp(computedOtp);

    // Dynamic autofocus shift mechanics to speed up input
    if (val && index < 3) {
      const nextSibling = document.getElementById(`otp-node-${index + 1}`);
      nextSibling?.focus();
    }
  };

  const verifySecurePayload = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every(node => node !== '')) {
      localStorage.setItem('accessToken', 'mock_jwt_session_token');
      navigate('/shops');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl"
      >
        <div className="space-y-1.5 text-center">
          <h2 className="text-xl font-extrabold tracking-tight">Security verification</h2>
          <p className="text-xs text-slate-400 font-medium">We transmitted a 4-digit token parameters packet to <br /><span className="text-slate-900 dark:text-white font-bold">{targetDestination}</span></p>
        </div>

        <form onSubmit={verifySecurePayload} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((character, idx) => (
              <input
                key={idx}
                id={`otp-node-${idx}`}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                required
                maxLength={1}
                value={character}
                onChange={(e) => handleOtpInput(idx, e.target.value)}
                className="w-14 h-14 text-center text-xl font-black bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
              />
            ))}
          </div>

          <Button type="submit" className="w-full rounded-xl py-6 bg-slate-900 dark:bg-blue-600 font-bold hover:opacity-90 transition">
            Authorize Credentials
          </Button>
        </form>

        <p className="text-center text-xs font-semibold text-slate-400 hover:text-blue-500 cursor-pointer transition">
          Didn't receive the token? Request transmission retry
        </p>
      </motion.div>
    </div>
  );
};