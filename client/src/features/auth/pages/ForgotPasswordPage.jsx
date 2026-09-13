import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import BrandLogo from '@/components/common/BrandLogo';
import api from '@/services/api';

const schema = z.object({
  email: z.string().email('Invalid email address')
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await api.post('/api/auth/forgot-password', data);
      setIsSuccess(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B12] blueprint-grid relative overflow-hidden py-12 px-4 sm:px-6">
      {/* Brand concentric rings & ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#0A84FF]/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-dashed border-[#0A84FF]/5 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#002366]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0A84FF]/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-4 group focus:outline-none">
            <BrandLogo
              size="xl"
              stacked
              textClassName="text-white"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-[#A8C0D8] text-xs sm:text-sm">We'll send you instructions to reset your account password</p>
        </div>

        <Card glass className="p-5 sm:p-8 bg-[#101826]/90 border border-[#22324A] shadow-2xl backdrop-blur-xl">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#0A84FF]/20 text-[#2FA8FF] rounded-2xl border border-[#0A84FF]/30 flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check Your Email</h3>
              <p className="text-[#A8C0D8] text-sm mb-6 leading-relaxed">
                Instructions have been sent to your email address. If it doesn't appear within a few minutes, please check your spam folder.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full justify-center border-[#22324A] text-white hover:bg-[#162235]">Return to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Button type="submit" variant="primary" className="w-full mt-4 justify-center shadow-lg shadow-[#0A84FF]/25" isLoading={isLoading}>
                  Send Reset Link
                </Button>
              </form>
              <div className="mt-6 text-center pt-4 border-t border-[#22324A]">
                <Link to="/login" className="inline-flex items-center text-[#A8C0D8] hover:text-[#2FA8FF] text-xs sm:text-sm transition-colors">
                  <ArrowLeft size={16} className="mr-2" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
