import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Briefcase,
  Star,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Users,
  Award,
  Check
} from 'lucide-react';

export default function RegisterShowcaseIllustration() {
  return (
    <div className="relative w-full max-w-2xl mx-auto select-none flex items-center justify-center min-h-[460px] lg:min-h-[520px]">
      
      {/* 1. Ambient Glow Layers & Geometric Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#002366]/20 via-[#0A84FF]/20 to-[#2FA8FF]/15 blur-3xl opacity-75 animate-pulse-slow" />
        <div className="w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] rounded-full border border-[#0A84FF]/15 dark:border-[#0A84FF]/25" />
        <div className="w-[490px] h-[490px] sm:w-[640px] sm:h-[640px] rounded-full border border-dashed border-[#2FA8FF]/10 dark:border-[#2FA8FF]/20 animate-spin-slow" />
      </div>

      {/* 2. Main Central Hiring & Escrow Workspace Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#10192A]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/10 dark:shadow-black/60 backdrop-blur-2xl p-5 sm:p-6 overflow-hidden"
      >
        {/* Subtle Top Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]" />

        {/* Dashboard Top Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-[#1E2C42]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-[#EAF4FF] tracking-tight">
              WorkStation Live Workspace
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Escrow Funded</span>
          </div>
        </div>

        {/* Active Project Details Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#F4F9FF] to-white dark:from-[#131F33] dark:to-[#0F1827] border border-[#D6EFFF] dark:border-[#1F2F47] mb-4">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A84FF] dark:text-[#2FA8FF]">
                Verified Milestone Contract
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                FinTech Escrow & Web3 Payment Engine
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] font-mono font-bold text-xs flex-shrink-0">
              ₹1,25,000
            </span>
          </div>

          {/* Milestone Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-[#A8C0D8]">Milestone 2 of 3: Smart Contract Security</span>
              <span className="font-bold text-[#0A84FF] dark:text-[#2FA8FF]">65% Done</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#1E2C42] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] w-[65%]" />
            </div>
          </div>
        </div>

        {/* Matched Talent Row */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-[#152238]/60 border border-slate-100 dark:border-[#1F2F47] mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/freelancers/aarav-desai.webp"
                alt="Talent"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0A84FF]/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#152238]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Aarav Desai</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#0A84FF]/10 text-[#0A84FF]">
                  Verified Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8]">
                Senior Full-Stack Architect • Mumbai
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star size={13} className="fill-current" />
            <span>4.9</span>
            <span className="text-[10px] text-slate-400">(48)</span>
          </div>
        </div>

        {/* Mini Status Grid */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-[#F5F9FF]">₹45,000 Protected</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A] flex items-center justify-center gap-2">
            <Zap size={16} className="text-[#0A84FF]" />
            <span className="font-semibold text-slate-800 dark:text-[#F5F9FF]">Instant Payout</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Floating Card 1: Top-Right Proposal Alert */}
      <motion.div
        initial={{ opacity: 0, x: 24, y: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
        }}
        className="absolute -top-4 right-0 sm:right-2 z-20 p-3.5 rounded-2xl bg-white/95 dark:bg-[#101A2C]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-xl backdrop-blur-xl max-w-[230px] hidden sm:flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-[#0A84FF] text-white flex items-center justify-center shadow-md shadow-[#0A84FF]/20 flex-shrink-0">
          <Briefcase size={17} />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            New Proposal Submitted
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
            ₹85,000 • 10 Days
          </span>
          <span className="text-[10px] text-slate-400">Match rating 98%</span>
        </div>
      </motion.div>

      {/* 4. Floating Card 2: Bottom-Left Escrow Protection Pill */}
      <motion.div
        initial={{ opacity: 0, x: -24, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 0.6, delay: 0.4 },
          y: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
        }}
        className="absolute -bottom-4 left-0 sm:left-2 z-20 p-3 rounded-2xl bg-white/95 dark:bg-[#101A2C]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-xl backdrop-blur-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
          <ShieldCheck size={18} />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            100% Escrow Guaranteed
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#A8C0D8] block">
            Zero-risk milestone settlements
          </span>
        </div>
      </motion.div>

      {/* 5. Floating Card 3: Client Testimonial Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          scale: { duration: 0.6, delay: 0.5 },
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }
        }}
        className="absolute bottom-16 right-[-8px] sm:right-[-12px] z-20 p-3 rounded-2xl bg-white/95 dark:bg-[#162235]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-xl backdrop-blur-xl hidden md:block max-w-[210px]"
      >
        <div className="flex items-center gap-1.5 mb-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className="fill-current" />
          ))}
        </div>
        <p className="text-[11px] text-slate-700 dark:text-slate-200 italic leading-snug">
          "Found a top designer within 2 hours. Escrow release was smooth!"
        </p>
        <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
          Rajesh S. • Enterprise Client
        </span>
      </motion.div>
    </div>
  );
}
