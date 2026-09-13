import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare, Sparkles, CheckCircle2, HelpCircle, Zap, Headphones } from 'lucide-react';

export default function FAQIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Background Radial Glow & Concentric Blueprint Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Animated Circular Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-[#0A84FF]/25 dark:border-[#0A84FF]/30 flex items-center justify-center"
        >
          {/* Orbiting Electric Blue Glow Dot */}
          <div className="w-3 h-3 rounded-full bg-[#2FA8FF] shadow-[0_0_14px_#0A84FF] -translate-y-[160px] sm:-translate-y-[190px]" />
        </motion.div>

        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-[#0A84FF]/20 dark:border-[#2FA8FF]/20"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] shadow-[0_0_10px_#2FA8FF] translate-x-[120px] sm:translate-x-[140px]" />
        </motion.div>

        {/* Center Soft Blue Ambient Blur */}
        <div className="absolute w-[220px] h-[220px] rounded-full bg-gradient-to-tr from-[#002366]/30 via-[#0A84FF]/20 to-transparent blur-2xl pointer-events-none" />
      </div>

      {/* Main Illustration Card Surface */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-2xl overflow-hidden">
        
        {/* Blueprint Corner Accents */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full border border-[#0A84FF]/15 dark:border-[#0A84FF]/25 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border border-dashed border-[#2FA8FF]/15 pointer-events-none" />

        {/* Top Header Row of Help Desk */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[2px] shadow-md shadow-blue-500/20 flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-[#101826] flex items-center justify-center">
                <HelpCircle size={20} className="text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                WorkStation Help Desk
              </h4>
              <p className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8]">
                Instant verified answers
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            24/7 Support
          </span>
        </div>

        {/* Central Workstation Graphic: Laptop, Desk & Message Nodes */}
        <div className="relative my-6 py-4 flex flex-col items-center justify-center">
          
          {/* Laptop & Workspace Visual */}
          <div className="relative w-full max-w-[260px] h-[130px] flex flex-col items-center justify-center">
            {/* Monitor Screen Frame */}
            <div className="w-48 h-28 rounded-xl bg-gradient-to-b from-[#162235] to-[#080B12] border-2 border-[#0A84FF]/40 shadow-xl p-2.5 flex flex-col justify-between relative overflow-hidden">
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between border-b border-[#22324A] pb-1.5 mb-1.5">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[8px] font-mono text-[#2FA8FF]">workstation.help</span>
              </div>
              
              {/* Screen Content Wireframe with Code & Chat Waves */}
              <div className="space-y-1.5">
                <div className="h-2 w-3/4 rounded bg-[#0A84FF]/30 animate-pulse" />
                <div className="h-1.5 w-1/2 rounded bg-[#2FA8FF]/20" />
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="h-3.5 w-3.5 rounded bg-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 size={8} className="text-emerald-400" />
                  </div>
                  <div className="h-2 w-24 rounded bg-emerald-500/20" />
                </div>
              </div>

              {/* Bottom Subtle Gradient Flare */}
              <div className="absolute -bottom-4 inset-x-0 h-6 bg-gradient-to-t from-[#0A84FF]/20 to-transparent pointer-events-none" />
            </div>

            {/* Laptop Base Stand */}
            <div className="w-56 h-2 rounded-b-lg bg-[#22324A] border-t border-[#0A84FF]/50 shadow-md" />
            <div className="w-16 h-1 rounded-b bg-[#002366] opacity-80" />
          </div>

          {/* Floating Bubble 1: Escrow Protection */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -left-2 sm:-left-4 p-2.5 rounded-2xl bg-white/95 dark:bg-[#162235]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-blue-500/10 backdrop-blur-md flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={14} />
            </div>
            <div className="pr-1">
              <span className="text-[10px] font-bold text-slate-900 dark:text-white block leading-tight">
                Escrow Protected
              </span>
              <span className="text-[9px] text-[#5B6B7A] dark:text-[#A8C0D8]">
                100% Guaranteed
              </span>
            </div>
          </motion.div>

          {/* Floating Bubble 2: Live Support Assistance */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-2 -right-2 sm:-right-4 p-2.5 rounded-2xl bg-white/95 dark:bg-[#162235]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-blue-500/10 backdrop-blur-md flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF]">
              <MessageSquare size={14} />
            </div>
            <div className="pr-1">
              <span className="text-[10px] font-bold text-slate-900 dark:text-white block leading-tight">
                Quick Mediation
              </span>
              <span className="text-[9px] text-[#5B6B7A] dark:text-[#A8C0D8]">
                Resolution Center
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Feature List of Help Center */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#D6EFFF]/80 dark:border-[#22324A]">
          <div className="p-2.5 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF]/60 dark:border-[#22324A]/60 flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#0A84FF] flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              Zero Platform Lock-in
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF]/60 dark:border-[#22324A]/60 flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#0A84FF] flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              Clear 10% Flat Fee
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
