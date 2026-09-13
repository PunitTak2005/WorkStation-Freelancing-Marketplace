import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Clock,
  Check,
  FileCheck,
  Send,
  Zap,
  Users,
  Headphones,
  Award
} from 'lucide-react';

export default function ContactHeroIllustration() {
  return (
    <div className="relative w-full max-w-2xl mx-auto select-none flex items-center justify-center min-h-[460px] lg:min-h-[520px]">
      
      {/* 1. Ambient Background Lighting & Concentric Brand Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#002366]/20 via-[#0A84FF]/20 to-transparent blur-3xl opacity-75 animate-pulse-slow" />
        <div className="w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full border border-[#0A84FF]/15 dark:border-[#0A84FF]/25" />
        <div className="w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] rounded-full border border-dashed border-[#2FA8FF]/10 dark:border-[#2FA8FF]/15 animate-spin-slow" />
      </div>

      {/* 2. Main Central Customer Support & Operations Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#10192A]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/10 dark:shadow-black/60 backdrop-blur-2xl p-5 sm:p-6 overflow-hidden"
      >
        {/* Subtle Top Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]" />

        {/* Support Console Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-[#1E2C42]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-[#EAF4FF] tracking-tight flex items-center gap-1.5">
              <Headphones size={13} className="text-[#0A84FF]" />
              WorkStation Support Desk
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Response Center</span>
          </div>
        </div>

        {/* Live Active Ticket Preview Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#F4F9FF] to-white dark:from-[#131F33] dark:to-[#0F1827] border border-[#D6EFFF] dark:border-[#1F2F47] mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A84FF] dark:text-[#2FA8FF]">
                  Priority Support Ticket
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] text-[10px] font-mono font-bold">
                  #WS-8942
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mt-0.5">
                Milestone 2 Escrow Verification & Approval
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 size={12} /> Resolved
            </span>
          </div>

          {/* Quick Ticket Response Metric */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#A8C0D8] text-[11px]">
              <Clock size={12} className="text-[#0A84FF]" />
              <span>Resolved in 14 minutes</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Escrow ₹65,000 Verified
            </span>
          </div>
        </div>

        {/* Support Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131F33]/60 border border-slate-200/60 dark:border-[#1E2C42]">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#A8C0D8] mb-1">
              <span>Average Wait Time</span>
              <Zap size={13} className="text-amber-500" />
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono">
              1.8 min <span className="text-[10px] text-emerald-500 font-sans font-semibold">Fast</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131F33]/60 border border-slate-200/60 dark:border-[#1E2C42]">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#A8C0D8] mb-1">
              <span>Customer Rating</span>
              <Award size={13} className="text-[#0A84FF]" />
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono">
              99.2% <span className="text-[10px] text-[#0A84FF] font-sans font-semibold">Positive</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Floating Notification Card A: Support Team Avatar Stack & Lead Notice */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [-0.5, 0.5, -0.5]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-6 sm:-top-8 -right-3 sm:-right-8 z-20 w-64 sm:w-72 p-3.5 rounded-2xl bg-white/95 dark:bg-[#162235]/95 border border-[#D6EFFF] dark:border-[#2A3F5E] shadow-xl shadow-blue-500/10 dark:shadow-black/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src="/freelancers/abhishek-nayak.png"
              alt="Abhishek Nayak"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#0A84FF] shadow-sm"
              onError={(e) => {
                e.target.src = '/logo.png';
              }}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#162235] flex items-center justify-center">
              <Check size={9} className="text-white stroke-[3]" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Abhishek Nayak
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#0A84FF] dark:text-[#2FA8FF] font-medium truncate">
              Senior Support Architect
            </p>
            <p className="text-[10px] text-slate-500 dark:text-[#A8C0D8] truncate mt-0.5">
              Available for priority inquiries
            </p>
          </div>
        </div>
      </motion.div>

      {/* 4. Floating Card B: Escrow Dispute & Guarantee Protection */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0.5, -0.5, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.6
        }}
        className="absolute -bottom-6 sm:-bottom-8 -left-3 sm:-left-8 z-20 p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-[#162235]/95 border border-[#D6EFFF] dark:border-[#2A3F5E] shadow-xl shadow-blue-500/10 dark:shadow-black/50 backdrop-blur-xl max-w-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Escrow Guarantee Desk
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8] leading-tight mt-0.5">
              24/7 Milestone & Payment Mediation
            </p>
          </div>
        </div>
      </motion.div>

      {/* 5. Floating Card C: Real-Time Live Chat Bubble */}
      <motion.div
        animate={{
          y: [0, -6, 0]
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.2
        }}
        className="absolute -bottom-4 right-2 sm:right-6 z-20 px-3.5 py-2.5 rounded-2xl bg-[#002366] text-white shadow-xl shadow-[#002366]/30 border border-[#0A84FF]/30 flex items-center gap-2.5 max-w-[250px]"
      >
        <div className="w-7 h-7 rounded-full bg-[#0A84FF] flex items-center justify-center flex-shrink-0">
          <MessageSquare size={13} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-white">Support Specialist</p>
          <p className="text-[10px] text-white/80 leading-tight truncate">
            "Hi! How can we assist you today?"
          </p>
        </div>
      </motion.div>

    </div>
  );
}
