import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, Code2, Palette, ShieldCheck, IndianRupee, ArrowUpRight } from 'lucide-react';

export default function WorkspaceHeroIllustration() {
  return (
    <div className="relative w-full max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto h-[340px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none overflow-hidden sm:overflow-visible">
      {/* Background Concentric Circular Rings inspired by WorkStation Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px] rounded-full border-2 border-dashed border-[#0A84FF]/20 dark:border-[#0A84FF]/30 flex items-center justify-center"
        >
          {/* Orbiting glowing dot */}
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#2FA8FF] shadow-[0_0_12px_#0A84FF] -translate-y-[140px] sm:-translate-y-[210px] lg:-translate-y-[230px]" />
        </motion.div>

        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full border border-[#0A84FF]/30 dark:border-[#2FA8FF]/30"
        >
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#0A84FF] shadow-[0_0_10px_#2FA8FF] translate-x-[110px] sm:translate-x-[160px] lg:translate-x-[180px]" />
        </motion.div>

        {/* Inner Radial Glow Core */}
        <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-tr from-[#002366]/40 via-[#0A84FF]/25 to-transparent blur-2xl dark:from-[#0A84FF]/20 dark:via-[#2FA8FF]/15 pointer-events-none" />
      </div>

      {/* Blueprint Perspective Grid Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-60" viewBox="0 0 600 500" fill="none">
        {/* Isometric / blueprint connector lines */}
        <path d="M50 420 L280 340 L550 420" stroke="#0A84FF" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M280 180 L280 340" stroke="#0A84FF" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M120 220 C200 210, 260 260, 300 290" stroke="#2FA8FF" strokeWidth="1.5" opacity="0.6" />
        <path d="M480 200 C420 220, 350 250, 300 290" stroke="#2FA8FF" strokeWidth="1.5" opacity="0.6" />
      </svg>

      {/* SVG Workstation Scene: Monitor, Laptop, Desk, Chair */}
      <div className="relative z-10 w-[340px] sm:w-[420px] lg:w-[460px] flex flex-col items-center">
        <svg viewBox="0 0 460 380" className="w-full h-auto drop-shadow-2xl" fill="none">
          <defs>
            <linearGradient id="monitorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#002366" />
              <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A162B" />
              <stop offset="100%" stopColor="#080B12" />
            </linearGradient>
            <linearGradient id="deskGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#002366" />
              <stop offset="50%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#002366" />
            </linearGradient>
            <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#002366" />
            </linearGradient>
          </defs>

          {/* Ergonomic Chair Back (behind desk) */}
          <path d="M200 220 C200 160, 260 160, 260 220 Z" fill="url(#chairGrad)" opacity="0.3" />
          <rect x="226" y="220" width="8" height="50" rx="4" fill="#0A84FF" opacity="0.5" />

          {/* Main WorkStation Monitor */}
          <g>
            {/* Monitor Outer Frame */}
            <rect x="110" y="70" width="240" height="150" rx="14" fill="#101826" stroke="url(#monitorGrad)" strokeWidth="3" />
            {/* Monitor Screen Glass */}
            <rect x="118" y="78" width="224" height="134" rx="8" fill="url(#screenGrad)" />
            
            {/* Monitor Stand */}
            <rect x="223" y="220" width="14" height="40" rx="2" fill="#101826" stroke="#0A84FF" strokeWidth="1.5" />
            <ellipse cx="230" cy="262" rx="36" ry="6" fill="#0A84FF" opacity="0.6" />

            {/* Screen UI Elements (Code + Dashboard simulation) */}
            <rect x="128" y="88" width="100" height="8" rx="4" fill="#0A84FF" opacity="0.8" />
            <rect x="128" y="104" width="70" height="5" rx="2.5" fill="#2FA8FF" opacity="0.6" />
            <rect x="128" y="115" width="85" height="5" rx="2.5" fill="#5B6B7A" opacity="0.5" />
            <rect x="128" y="126" width="60" height="5" rx="2.5" fill="#2FA8FF" opacity="0.6" />
            <rect x="128" y="137" width="90" height="5" rx="2.5" fill="#0A84FF" opacity="0.7" />

            {/* Right Screen: Analytics Area Graph */}
            <path d="M245 150 Q265 110, 285 130 T325 95 L325 160 L245 160 Z" fill="#0A84FF" opacity="0.25" />
            <path d="M245 150 Q265 110, 285 130 T325 95" stroke="#2FA8FF" strokeWidth="2" fill="none" />
            <circle cx="325" cy="95" r="3" fill="#2FA8FF" />
            <circle cx="285" cy="130" r="3" fill="#0A84FF" />
          </g>

          {/* Secondary Laptop (Left of desk) */}
          <g transform="translate(60, 185) scale(0.75)">
            <polygon points="10,0 80,0 86,55 4,55" fill="#162235" stroke="#2FA8FF" strokeWidth="1.5" />
            <polygon points="14,4 76,4 82,48 8,48" fill="#080B12" />
            <polygon points="0,55 90,55 96,62 -6,62" fill="#101826" stroke="#0A84FF" strokeWidth="1" />
            {/* Screen glowing lines */}
            <rect x="22" y="15" width="46" height="4" rx="2" fill="#2FA8FF" opacity="0.8" />
            <rect x="22" y="24" width="35" height="3" rx="1.5" fill="#0A84FF" opacity="0.6" />
          </g>

          {/* Tablet / Coffee Mug (Right of desk) */}
          <g transform="translate(340, 205)">
            <ellipse cx="14" cy="20" rx="10" ry="5" fill="#0A84FF" opacity="0.3" />
            <rect x="6" y="8" width="16" height="14" rx="3" fill="#162235" stroke="#2FA8FF" strokeWidth="1" />
            <path d="M22 11 C26 11, 26 19, 22 19" stroke="#2FA8FF" strokeWidth="1" fill="none" />
          </g>

          {/* Clean Desk Surface */}
          <g>
            {/* Desk Top */}
            <path d="M30 260 L430 260 L450 280 L10 280 Z" fill="url(#deskGrad)" opacity="0.9" />
            <path d="M10 280 L450 280 L450 288 L10 288 Z" fill="#002366" />
            {/* Modern Desk Legs */}
            <line x1="50" y1="288" x2="35" y2="370" stroke="#0A84FF" strokeWidth="5" strokeLinecap="round" />
            <line x1="410" y1="288" x2="425" y2="370" stroke="#0A84FF" strokeWidth="5" strokeLinecap="round" />
            <line x1="25" y1="370" x2="65" y2="370" stroke="#002366" strokeWidth="4" strokeLinecap="round" />
            <line x1="405" y1="370" x2="445" y2="370" stroke="#002366" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Floating Card 1: Vetted Specialist (Top Left) */}
      <motion.div
        animate={{ y: [-5, 6, -5], x: [2, -2, 2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute top-4 -left-2 sm:top-8 sm:-left-6 z-20 bg-white/90 dark:bg-[#101826]/90 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] rounded-2xl p-2.5 sm:p-3.5 shadow-workstation-card dark:shadow-workstation-dark items-center gap-2.5"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block">Vetted Specialist</span>
          <span className="text-[10px] font-semibold text-emerald-500">Identity & Skills Verified</span>
        </div>
      </motion.div>

      {/* Floating Card 2: Escrow Funded (Top Right) */}
      <motion.div
        animate={{ y: [6, -6, 6], x: [-3, 3, -3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="hidden sm:flex absolute top-10 -right-2 sm:top-16 sm:-right-8 z-20 bg-white/90 dark:bg-[#101826]/90 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] rounded-2xl p-2.5 sm:p-3.5 shadow-workstation-card dark:shadow-workstation-dark items-center gap-2.5"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0A84FF]/15 border border-[#0A84FF]/40 flex items-center justify-center text-[#0A84FF] dark:text-[#2FA8FF] flex-shrink-0">
          <IndianRupee size={18} />
        </div>
        <div>
          <span className="text-xs font-bold text-[#002366] dark:text-[#2FA8FF] leading-tight block">₹25,000 Project</span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-[#A8C0D8]">Full-Stack App</span>
        </div>
      </motion.div>

      {/* Floating Card 3: React Expert (Bottom Left) */}
      <motion.div
        animate={{ y: [7, -7, 7], x: [-2, 4, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-4 left-2 sm:bottom-12 sm:-left-6 z-20 bg-white/95 dark:bg-[#101826]/95 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] rounded-2xl p-2 sm:p-3.5 shadow-workstation-card dark:shadow-workstation-dark flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 origin-bottom-left"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#002366] to-[#0A84FF] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          <Code2 size={17} />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">React Expert</span>
            <ShieldCheck size={13} className="text-[#0A84FF]" />
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-500">
            <Star size={11} fill="currentColor" />
            <span>4.9 Rating (142)</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 4: AI Designer (Bottom Right) */}
      <motion.div
        animate={{ y: [-6, 7, -6], x: [3, -3, 3] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-4 right-2 sm:bottom-6 sm:-right-4 z-20 bg-white/95 dark:bg-[#101826]/95 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] rounded-2xl p-2 sm:p-3.5 shadow-workstation-card dark:shadow-workstation-dark flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 origin-bottom-right"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#2FA8FF]/15 border border-[#2FA8FF]/40 flex items-center justify-center text-[#0A84FF] dark:text-[#2FA8FF] flex-shrink-0">
          <Palette size={17} />
        </div>
        <div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white block">AI Designer</span>
          <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available Now
          </span>
        </div>
      </motion.div>
    </div>
  );
}
