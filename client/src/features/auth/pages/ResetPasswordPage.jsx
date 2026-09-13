import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import BrandLogo from '@/components/common/BrandLogo';
import api from '@/services/api';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password: data.password });
      toast.success('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B12] blueprint-grid relative overflow-hidden py-12 px-4">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Set New Password</h1>
          <p className="text-[#A8C0D8] text-xs sm:text-sm">Enter your new secure password below</p>
        </div>

        <Card glass className="p-5 sm:p-8 bg-[#101826]/90 border border-[#22324A] shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <Button type="submit" variant="primary" className="w-full mt-4 justify-center shadow-lg shadow-[#0A84FF]/25" isLoading={isLoading}>
              Update Password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
