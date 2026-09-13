import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  KeyRound,
  Check,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/common/BrandLogo';
import LoginShowcaseIllustration from '../components/LoginShowcaseIllustration';
import api from '@/services/api';
import { setCredentials } from '@/store/slices/authSlice';
import { loginSchema } from '@/utils/validationSchemas';

// Smooth Animated Counter for mini metric statistics
function AnimatedCounter({ to, duration = 1.6, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const target = Number(to) || 0;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(target * ease));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return (
    <span className="font-mono">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        rememberMe,
      };
      const res = await api.post('/auth/login', payload);
      dispatch(setCredentials(res.data.data));
      toast.success('Logged in successfully!');
      const role = res.data.data.user?.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'client') navigate('/dashboard/client');
      else navigate('/dashboard/freelancer');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
    setValue('password', password, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B12] text-slate-900 dark:text-[#F5F9FF] blueprint-grid relative overflow-hidden transition-colors duration-300 flex flex-col justify-between">
      
      {/* 1. Ambient Background Lighting & Concentric Brand Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] bg-gradient-to-br from-[#002366]/25 via-[#0A84FF]/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-tl from-[#2FA8FF]/20 via-[#0A84FF]/15 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#0A84FF]/10 pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-dashed border-[#2FA8FF]/5 pointer-events-none hidden lg:block" />
      </div>

      {/* 2. Top Header Bar with Brand Logo */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none">
          <BrandLogo size="md" />
        </Link>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-500 dark:text-[#A8C0D8] hidden sm:inline">New to WorkStation?</span>
          <Link
            to="/register"
            className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] font-semibold hover:border-[#0A84FF] transition-all shadow-sm"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* 3. Main Split-Screen Authentication Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* LEFT COLUMN: Brand Showcase & Marketplace Teaser (60% Desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-md shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#0A84FF] animate-ping" />
                <span className="text-xs font-bold text-slate-800 dark:text-[#EAF4FF] tracking-wide uppercase">
                  Global Talent Marketplace
                </span>
              </div>

              {/* High Impact Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                Build Your Career.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#2FA8FF] dark:via-[#0A84FF] dark:to-white">
                  Hire Exceptional Talent.
                </span>
              </h1>

              {/* Supporting Value Proposition */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8C0D8] max-w-xl leading-relaxed">
                Connect with vetted clients and world-class specialists. Experience seamless milestone-based contracts, protected escrow deposits, and collaborative workspaces.
              </p>

              {/* Interactive Marketplace Illustration */}
              <div className="pt-2 pb-2">
                <LoginShowcaseIllustration />
              </div>

              {/* Live Platform Statistics Strip */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-[#1E2C42]/80">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
                  <div className="space-y-1">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      <AnimatedCounter to={40000} suffix="+" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#A8C0D8] font-medium">
                      Modern Teams
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      <AnimatedCounter to={120000} suffix="+" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#A8C0D8] font-medium">
                      Verified Specialists
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl sm:text-2xl font-black text-[#0A84FF] dark:text-[#2FA8FF] tracking-tight">
                      <AnimatedCounter to={98} suffix="%" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#A8C0D8] font-medium">
                      Job Success Rate
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Premium Floating Glass Login Card (40% Desktop) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-[32px] bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/10 dark:shadow-black/60 backdrop-blur-2xl p-6 sm:p-8 overflow-hidden"
            >
              {/* Subtle Glowing Gradient Rim */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]" />

              {/* Login Card Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] text-[11px] font-bold uppercase tracking-wider">
                    WorkStation Auth
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8C0D8] mt-1">
                  Sign in to your account to continue building.
                </p>
              </div>

              {/* 1-Click Demo Accounts Autofill Bar */}
              <div className="mb-6 p-3 rounded-2xl bg-[#F0F7FF] dark:bg-[#0D1524] border border-[#D6EFFF] dark:border-[#1E2C42]">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-[#2FA8FF] text-xs mb-2">
                  <Sparkles size={14} className="text-[#0A84FF] dark:text-[#2FA8FF]" />
                  <span>Demo Accounts (1-click fill):</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillCredentials('rajesh.sharma@email.com', 'password123')}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#162235] hover:bg-[#EAF6FF] dark:hover:bg-[#1f314d] text-slate-800 dark:text-[#F5F9FF] text-xs font-semibold transition-all border border-slate-200 dark:border-[#22324A] hover:border-[#0A84FF] shadow-sm active:scale-95"
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCredentials('aarav.desai@email.com', 'password123')}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#162235] hover:bg-[#EAF6FF] dark:hover:bg-[#1f314d] text-slate-800 dark:text-[#F5F9FF] text-xs font-semibold transition-all border border-slate-200 dark:border-[#22324A] hover:border-[#0A84FF] shadow-sm active:scale-95"
                  >
                    Freelancer
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCredentials('punittak2005@gmail.com', 'admin123')}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#162235] hover:bg-[#EAF6FF] dark:hover:bg-[#1f314d] text-slate-800 dark:text-[#F5F9FF] text-xs font-semibold transition-all border border-slate-200 dark:border-[#22324A] hover:border-[#0A84FF] shadow-sm active:scale-95"
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Main Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                
                {/* 1. Email Address Field (56px, Rounded-2xl, Left Icon, Status Accents) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-email"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    {touchedFields.email && !errors.email && emailValue && (
                      <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center">
                      <Mail size={19} className={errors.email ? 'text-rose-500' : 'text-[#0A84FF]'} />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      className={`w-full h-14 pl-12 pr-4 rounded-2xl text-sm bg-white dark:bg-[#162235] border transition-all duration-200 outline-none font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        errors.email
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 text-rose-900 dark:text-rose-200'
                          : touchedFields.email && !errors.email && emailValue
                          ? 'border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-[#22324A] hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 text-slate-900 dark:text-white'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1 pt-0.5">
                      <span>• {errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* 2. Password Field (56px, Rounded-2xl, Left Icon, Eye Toggle) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-[#0A84FF] dark:text-[#2FA8FF] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center">
                      <Lock size={19} className={errors.password ? 'text-rose-500' : 'text-[#0A84FF]'} />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className={`w-full h-14 pl-12 pr-12 rounded-2xl text-sm bg-white dark:bg-[#162235] border transition-all duration-200 outline-none font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        errors.password
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-[#22324A] hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 text-slate-900 dark:text-white'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/30"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1 pt-0.5">
                      <span>• {errors.password.message}</span>
                    </p>
                  )}
                </div>

                {/* 3. Modern Checkbox for Remember Me */}
                <div className="flex items-center pt-1 pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                        rememberMe
                          ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-sm shadow-[#0A84FF]/30'
                          : 'bg-white dark:bg-[#162235] border-slate-300 dark:border-[#22324A] group-hover:border-[#0A84FF]'
                      }`}
                    >
                      {rememberMe && <Check size={14} className="stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-[#A8C0D8] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      Remember me on this browser
                    </span>
                  </label>
                </div>

                {/* 4. Primary CTA Button (Blue Gradient, 56px, Hover Lift & Glow) */}
                <motion.button
                  whileHover={!isLoading ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#0A84FF]/25 hover:shadow-xl hover:shadow-[#0A84FF]/35 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#0A84FF]/40 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to WorkStation</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Trust Elements Strip (3 Pills) */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#22324A] grid grid-cols-3 gap-1.5 text-center">
                <div className="px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-[#A8C0D8]">Escrow Safe</span>
                </div>
                <div className="px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-1">
                  <Users size={14} className="text-[#0A84FF]" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-[#A8C0D8]">Verified</span>
                </div>
                <div className="px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-1">
                  <KeyRound size={14} className="text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-[#A8C0D8]">Secure 256-bit</span>
                </div>
              </div>

              {/* 8. Bottom Register Prompt */}
              <div className="mt-5 text-center text-xs text-slate-500 dark:text-[#A8C0D8]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#0A84FF] dark:text-[#2FA8FF] font-bold hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* 4. Footer Minimal Links */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2">
        <p>© {new Date().getFullYear()} WorkStation Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Support</Link>
        </div>
      </footer>

    </div>
  );
}
