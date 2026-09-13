import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  CheckCircle2,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  Award,
  AlertCircle,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/common/BrandLogo';
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator';
import api from '@/services/api';
import { setCredentials } from '@/store/slices/authSlice';

// Zod Validation Schema for Registration Form
const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, or hyphens'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address')
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^(\+91[\-\s]?)?[6789]\d{9}$/.test(val),
        'Please enter a valid 10-digit Indian phone number (e.g. +91 9876543210)'
      ),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms and Privacy Policy to continue' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

// Floating Label Input Component with Icon, Focus States & Live Validation
function FloatingInput({
  id,
  type = 'text',
  label,
  icon: Icon,
  register,
  error,
  touched,
  value,
  rightElement,
  autoComplete,
  placeholder = ' ',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || Boolean(value);

  return (
    <div className="space-y-1">
      <div className="relative">
        {/* Left Input Icon */}
        <div
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 z-10 ${
            error
              ? 'text-rose-500'
              : isFocused
              ? 'text-[#0A84FF]'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Icon size={18} />
        </div>

        {/* Input Element */}
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...register}
          onFocus={(e) => {
            setIsFocused(true);
            register.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            register.onBlur?.(e);
          }}
          className={`peer w-full h-[52px] pt-4 pb-1 pl-11 pr-11 rounded-2xl text-xs sm:text-sm bg-white dark:bg-[#162235] border transition-all duration-200 outline-none font-medium text-slate-900 dark:text-white ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15'
              : touched && !error && value
              ? 'border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15'
              : 'border-slate-200 dark:border-[#22324A] hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20'
          }`}
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute left-11 transition-all duration-200 pointer-events-none select-none ${
            isFloating
              ? 'top-1.5 text-[10px] sm:text-[11px] font-bold text-[#0A84FF] dark:text-[#2FA8FF]'
              : 'top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500'
          }`}
        >
          {label}
        </label>

        {/* Right Element (Status Icon or Password Toggle) */}
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center z-10">
            {rightElement}
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && (
        <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1 pt-0.5 pl-1">
          <span>• {error.message}</span>
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState('freelancer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const nameValue = watch('name');
  const emailValue = watch('email');
  const phoneValue = watch('phone');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  const agreeToTermsValue = watch('agreeToTerms');

  const onSubmit = async (data) => {
    if (!role) {
      toast.error('Please select an account type (Client or Freelancer)');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role,
      };

      if (data.phone && data.phone.trim()) {
        payload.phone = data.phone.trim();
      }

      const res = await api.post('/auth/register', payload);
      dispatch(setCredentials(res.data.data));
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#080B12] text-slate-900 dark:text-[#F5F9FF] blueprint-grid relative overflow-hidden transition-colors duration-300 flex flex-col justify-between">
      
      {/* Decorative Ambient Background Glows & Concentric Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-br from-[#002366]/20 via-[#0A84FF]/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-[#2FA8FF]/15 via-[#0A84FF]/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[#0A84FF]/10 pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[1150px] h-[1150px] rounded-full border border-dashed border-[#2FA8FF]/5 pointer-events-none hidden lg:block" />
      </div>

      {/* Top Header Bar with WorkStation Logo & Login Switcher */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none">
          <BrandLogo size="md" />
        </Link>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-500 dark:text-[#A8C0D8] hidden sm:inline">Already have an account?</span>
          <Link
            to="/login"
            className="px-4 py-2 rounded-full bg-white dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] font-semibold hover:border-[#0A84FF] hover:shadow-sm transition-all"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Two-Column Split Layout (42% Left Hero / 58% Right Registration Form on Desktop) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: Large Hero Section (40–45% on Desktop, Stacked on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-5 w-full order-1 flex flex-col"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/10 dark:shadow-black/50 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full min-h-[480px] lg:min-h-[660px] group select-none">
              
              {/* Background Project Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/projects/fintech-saas-dashboard.webp')" }}
              />

              {/* Dark Gradient Overlay for Maximum Readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#00173D]/95 via-[#0A162B]/90 to-[#002366]/95 backdrop-blur-[2px]" />
              
              {/* Subtle Blueprint Grid Accent */}
              <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

              {/* Top Row: Brand & Verified Pill */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Marketplace</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-blue-200/80 uppercase tracking-widest">
                    Next-Gen WorkSpace
                  </span>
                </div>
              </div>

              {/* Middle Section: Headline, Subtitle & 3 Feature Highlights */}
              <div className="relative z-10 py-6 sm:py-8 space-y-6">
                <div className="space-y-2.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.14]">
                    Build Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2FA8FF] via-[#70BFFF] to-white">
                      Freelancing Career.
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                    Connect with ambitious clients worldwide, collaborate inside verified workspaces, and receive guaranteed escrow payouts across modern tech stacks.
                  </p>
                </div>

                {/* 3 Required Feature Highlights with Lucide Icons */}
                <div className="space-y-3 pt-2">
                  {/* 1. Verified Clients */}
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#002366] to-[#0A84FF] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                      <Award size={18} className="text-[#2FA8FF]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">Verified Clients</h4>
                      <p className="text-[11px] text-blue-200/80 leading-tight mt-0.5">
                        Direct collaboration with pre-vetted enterprise teams, founders, and funded tech startups.
                      </p>
                    </div>
                  </div>

                  {/* 2. Secure Payments */}
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                      <ShieldCheck size={18} className="text-emerald-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">Secure Payments</h4>
                      <p className="text-[11px] text-blue-200/80 leading-tight mt-0.5">
                        Funds deposited upfront into milestone escrow and automatically disbursed upon your approval.
                      </p>
                    </div>
                  </div>

                  {/* 3. Real Projects */}
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                      <Briefcase size={18} className="text-indigo-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">Real Projects</h4>
                      <p className="text-[11px] text-blue-200/80 leading-tight mt-0.5">
                        Active, high-budget opportunities tailored specifically to your specialized skillset.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Real Freelancer Avatars & Rating Banner */}
              <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                {/* Real Project Avatar Stack */}
                <div className="flex items-center -space-x-2">
                  <img
                    src="/freelancers/aarav-sharma.webp"
                    alt="Aarav Sharma"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00173D]"
                  />
                  <img
                    src="/freelancers/mayank-joshi.png"
                    alt="Mayank Joshi"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00173D]"
                  />
                  <img
                    src="/freelancers/sakshi-rawat.png"
                    alt="Sakshi Rawat"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00173D]"
                  />
                  <img
                    src="/freelancers/neha-singh.webp"
                    alt="Neha Singh"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00173D]"
                  />
                  <img
                    src="/freelancers/abhishek-nayak.png"
                    alt="Abhishek Nayak"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00173D]"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span>4.96/5</span>
                  <span className="text-blue-200/70 font-normal">from 10k+ reviews</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT COLUMN: Premium Glassmorphism Registration Card (55–60% on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7 w-full order-2 flex flex-col justify-center"
          >
            <div className="rounded-3xl p-6 sm:p-8 lg:p-9 bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-2xl transition-all duration-300 relative">
              
              {/* Card Header */}
              <div className="mb-6 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EAF6FF] dark:bg-[#0A84FF]/15 text-[#002366] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#0A84FF]/30">
                  <Sparkles size={12} className="text-[#0A84FF]" />
                  <span>Free Registration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create Your Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8C0D8]">
                  Select whether you want to work on projects or hire specialists.
                </p>
              </div>

              {/* Interactive Account Type Selector (Freelancer vs Client) */}
              <div className="mb-5 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Account Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Freelancer Role */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole('freelancer')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                      role === 'freelancer'
                        ? 'border-[#0A84FF] bg-[#0A84FF]/10 shadow-[0_0_20px_rgba(10,132,255,0.18)] scale-[1.01]'
                        : 'border-slate-200 dark:border-[#22324A] bg-slate-50/70 dark:bg-[#162235]/60 hover:border-[#0A84FF]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          role === 'freelancer'
                            ? 'bg-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/25'
                            : 'bg-slate-200 dark:bg-[#1f314d] text-slate-600 dark:text-[#A8C0D8]'
                        }`}
                      >
                        <Briefcase size={16} />
                      </div>
                      {role === 'freelancer' && (
                        <div className="w-5 h-5 rounded-full bg-[#0A84FF] text-white flex items-center justify-center shadow-sm">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Freelancer</h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8] leading-tight mt-0.5">
                        Find projects & get paid
                      </p>
                    </div>
                  </motion.div>

                  {/* Client Role */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole('client')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                      role === 'client'
                        ? 'border-[#0A84FF] bg-[#0A84FF]/10 shadow-[0_0_20px_rgba(10,132,255,0.18)] scale-[1.01]'
                        : 'border-slate-200 dark:border-[#22324A] bg-slate-50/70 dark:bg-[#162235]/60 hover:border-[#0A84FF]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          role === 'client'
                            ? 'bg-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/25'
                            : 'bg-slate-200 dark:bg-[#1f314d] text-slate-600 dark:text-[#A8C0D8]'
                        }`}
                      >
                        <Building2 size={16} />
                      </div>
                      {role === 'client' && (
                        <div className="w-5 h-5 rounded-full bg-[#0A84FF] text-white flex items-center justify-center shadow-sm">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Client / Employer</h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8] leading-tight mt-0.5">
                        Post jobs & hire talent
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Registration Form with Floating Labels */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                {/* 1. Full Name */}
                <FloatingInput
                  id="register-name"
                  type="text"
                  label="Full Name"
                  icon={User}
                  autoComplete="name"
                  register={register('name')}
                  error={errors.name}
                  touched={touchedFields.name}
                  value={nameValue}
                  rightElement={
                    touchedFields.name && !errors.name && nameValue ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : errors.name ? (
                      <AlertCircle size={16} className="text-rose-500" />
                    ) : null
                  }
                />

                {/* 2. Email Address */}
                <FloatingInput
                  id="register-email"
                  type="email"
                  label="Email Address"
                  icon={Mail}
                  autoComplete="email"
                  register={register('email')}
                  error={errors.email}
                  touched={touchedFields.email}
                  value={emailValue}
                  rightElement={
                    touchedFields.email && !errors.email && emailValue ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : errors.email ? (
                      <AlertCircle size={16} className="text-rose-500" />
                    ) : null
                  }
                />

                {/* 3. Phone Number (Optional) */}
                <FloatingInput
                  id="register-phone"
                  type="tel"
                  label="Phone Number (Optional - e.g. +91 9876543210)"
                  icon={Phone}
                  autoComplete="tel"
                  register={register('phone')}
                  error={errors.phone}
                  touched={touchedFields.phone}
                  value={phoneValue}
                  rightElement={
                    touchedFields.phone && !errors.phone && phoneValue ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : errors.phone ? (
                      <AlertCircle size={16} className="text-rose-500" />
                    ) : null
                  }
                />

                {/* 4. Password with Strength Indicator */}
                <div>
                  <FloatingInput
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password (min 6 characters)"
                    icon={Lock}
                    autoComplete="new-password"
                    register={register('password')}
                    error={errors.password}
                    touched={touchedFields.password}
                    value={passwordValue}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  <PasswordStrengthIndicator password={passwordValue} />
                </div>

                {/* 5. Confirm Password */}
                <FloatingInput
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  icon={Lock}
                  autoComplete="new-password"
                  register={register('confirmPassword')}
                  error={errors.confirmPassword}
                  touched={touchedFields.confirmPassword}
                  value={confirmPasswordValue}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                {/* 6. Terms of Service & Privacy Policy Checkbox */}
                <div className="pt-1 pb-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                    <div
                      onClick={() => setValue('agreeToTerms', !agreeToTermsValue, { shouldValidate: true })}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-200 mt-0.5 flex-shrink-0 ${
                        agreeToTermsValue
                          ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-sm shadow-[#0A84FF]/30'
                          : errors.agreeToTerms
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500'
                          : 'bg-white dark:bg-[#162235] border-slate-300 dark:border-[#22324A] group-hover:border-[#0A84FF]'
                      }`}
                    >
                      {agreeToTermsValue && <Check size={14} className="stroke-[3]" />}
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-[#A8C0D8] leading-normal">
                      I agree to the{' '}
                      <Link to="/terms" target="_blank" className="font-semibold text-[#0A84FF] dark:text-[#2FA8FF] hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" target="_blank" className="font-semibold text-[#0A84FF] dark:text-[#2FA8FF] hover:underline">
                        Privacy Policy
                      </Link>.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1 pt-1 pl-1">
                      <span>• {errors.agreeToTerms.message}</span>
                    </p>
                  )}
                </div>

                {/* 7. Primary CTA Submit Button */}
                <motion.button
                  whileHover={!isLoading ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 sm:h-13 rounded-2xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#0A84FF]/25 hover:shadow-xl hover:shadow-[#0A84FF]/35 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#0A84FF]/40 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create WorkStation Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* 8. Small Trust Badges Strip */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#22324A] grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                <div className="px-1.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-0.5">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-700 dark:text-[#A8C0D8] leading-tight">Escrow Safe</span>
                </div>
                <div className="px-1.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-0.5">
                  <Award size={13} className="text-[#0A84FF]" />
                  <span className="text-[9px] font-bold text-slate-700 dark:text-[#A8C0D8] leading-tight">Verified Clients</span>
                </div>
                <div className="px-1.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-0.5">
                  <Lock size={13} className="text-amber-500" />
                  <span className="text-[9px] font-bold text-slate-700 dark:text-[#A8C0D8] leading-tight">256-Bit SSL</span>
                </div>
                <div className="px-1.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex flex-col items-center gap-0.5">
                  <Sparkles size={13} className="text-teal-500" />
                  <span className="text-[9px] font-bold text-slate-700 dark:text-[#A8C0D8] leading-tight">Free To Join</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </main>

      {/* Minimal Footer Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500 dark:text-[#A8C0D8]/60">
        © {new Date().getFullYear()} WorkStation Technologies Inc. All rights reserved. • Escrow Protected Marketplace.
      </footer>
    </div>
  );
}
