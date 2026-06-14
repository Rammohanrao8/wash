import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const OtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const email = location.state?.email;
  const type = location.state?.type || 'SIGNUP'; // 'SIGNUP' | 'LOGIN'

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  const verifyMutation = useMutation({
    mutationFn: type === 'LOGIN' 
      ? (codeStr: string) => authService.verifyLoginOtp(email, codeStr)
      : (codeStr: string) => authService.verifyOtp({ email, code: codeStr, type }),
    onSuccess: (data) => {
      // If the response contains tokens, log them in
      if (data.data?.accessToken) {
        login(data.data.user, data.data.accessToken, data.data.refreshToken);
        const role = data.data.user.role;
        if (role === 'CUSTOMER') navigate('/shops');
        else if (role === 'SHOP_OWNER') navigate('/dashboard/shop');
        else if (role === 'DELIVERY_PARTNER') navigate('/dashboard/delivery');
        else if (role === 'ADMIN') navigate('/dashboard/admin');
        else navigate('/');
      } else {
        // If just verification succeeded, navigate to login
        navigate('/login', { state: { message: 'Verification successful. Please login.' } });
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    },
  });

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeStr = code.join('');
    if (codeStr.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    verifyMutation.mutate(codeStr);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a 6-digit verification code to <br />
            <span className="font-medium text-gray-900 dark:text-white">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifyMutation.isPending || code.some(d => !d)}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-md"
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};