import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import api from '@/services/api';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    
    try {
      setIsLoading(true);
      await api.post('/api/auth/verify-email', { otp: otpValue });
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post('/api/auth/resend-verification');
      toast.success('New code sent!');
      setCountdown(60);
    } catch (error) {
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md z-10">
        <Card glass className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
          <p className="text-slate-400 mb-8">We sent a 6-digit verification code to your email address.</p>
          
          <form onSubmit={onSubmit}>
            <div className="flex justify-center gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-slate-800 border border-slate-700 text-white rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              ))}
            </div>

            <Button type="submit" variant="primary" className="w-full mb-6" isLoading={isLoading}>
              Verify Email
            </Button>
          </form>

          <p className="text-sm text-slate-400">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-slate-500">Resend in {countdown}s</span>
            ) : (
              <button onClick={resendOtp} className="text-indigo-400 hover:text-indigo-300">
                Resend now
              </button>
            )}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
