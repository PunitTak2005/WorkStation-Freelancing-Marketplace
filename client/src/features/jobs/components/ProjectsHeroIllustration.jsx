import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectsHeroIllustration({ className = '', compact = false }) {
  if (compact) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Compact concentric ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full border border-[#0A84FF]/20 animate-pulse-slow" />
          <div className="w-56 h-56 rounded-full border border-dashed border-[#2FA8FF]/15" />
        </div>

        <svg viewBox="0 0 200 140" className="w-full h-auto max-w-[200px] relative z-10" fill="none">
          <defs>
            <linearGradient id="compGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#002366" />
              <stop offset="60%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#2FA8FF" />
            </linearGradient>
            <linearGradient id="compGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Desk surface */}
          <path d="M 20 110 L 180 110 L 160 120 L 40 120 Z" fill="#162235" stroke="#22324A" strokeWidth="1.5" />
          
          {/* Central Monitor */}
          <rect x="55" y="30" width="90" height="58" rx="6" fill="#101826" stroke="#0A84FF" strokeWidth="1.5" />
          <rect x="60" y="35" width="80" height="48" rx="4" fill="#080B12" />
          {/* Code lines on screen */}
          <line x1="66" y1="44" x2="95" y2="44" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round" />
          <line x1="66" y1="52" x2="120" y2="52" stroke="#2FA8FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="72" y1="60" x2="105" y2="60" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="66" y1="68" x2="88" y2="68" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Monitor stand */}
          <rect x="94" y="88" width="12" height="16" fill="#162235" stroke="#22324A" />
          <rect x="80" y="104" width="40" height="4" rx="2" fill="#22324A" />

          {/* Laptop on Left */}
          <rect x="25" y="70" width="30" height="22" rx="3" fill="#101826" stroke="#2FA8FF" strokeWidth="1" />
          <rect x="28" y="73" width="24" height="16" rx="2" fill="#080B12" />
          <path d="M 20 92 L 60 92 L 56 96 L 24 96 Z" fill="#162235" stroke="#22324A" />
          
          {/* Mini Chart on Right */}
          <rect x="145" y="65" width="30" height="24" rx="4" fill="#101826" stroke="#0A84FF" strokeWidth="1" />
          <path d="M 150 82 L 157 76 L 163 79 L 170 70" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none w-full max-w-xs sm:max-w-md lg:max-w-lg overflow-hidden sm:overflow-visible ${className}`}>
      {/* Background Concentric Rings (WorkStation Brand Signature) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[280px] h-[280px] sm:w-[460px] sm:h-[460px] rounded-full border border-[#0A84FF]/15 animate-pulse-slow" />
        <div className="hidden sm:block w-[480px] h-[480px] sm:w-[580px] sm:h-[580px] rounded-full border border-dashed border-[#2FA8FF]/10 animate-spin-slow" />
        <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full bg-gradient-to-tr from-[#002366]/30 via-[#0A84FF]/15 to-transparent blur-2xl" />
      </div>

      {/* Floating Interactive Micro-Cards */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 right-4 sm:right-12 z-20 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl flex items-center gap-2.5"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#002366] to-[#0A84FF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          ₹
        </div>
        <div>
          <span className="text-[10px] text-slate-500 dark:text-[#A8C0D8] font-medium block leading-none">
            Active Milestone
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
            ₹45,000 Locked
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-2 left-2 sm:left-6 z-20 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl flex items-center gap-2.5"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block leading-none">
            100% Escrow Secured
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Verified Client Match
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden sm:flex absolute top-1/2 -right-6 -translate-y-1/2 z-20 px-3 py-1.5 rounded-xl bg-[#0A84FF]/10 dark:bg-[#0A84FF]/20 border border-[#0A84FF]/30 text-[#0A84FF] dark:text-[#2FA8FF] text-[11px] font-bold backdrop-blur-md items-center gap-1.5 shadow-glow"
      >
        <span>🔥 5 New Proposals</span>
      </motion.div>

      {/* Main Vector Workstation Desk Illustration */}
      <svg
        viewBox="0 0 540 380"
        className="w-full h-auto max-w-[500px] relative z-10 drop-shadow-[0_12px_32px_rgba(10,132,255,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mainMonitorGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#002366" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="deskWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#002366" />
            <stop offset="50%" stopColor="#101826" />
            <stop offset="100%" stopColor="#162235" />
          </linearGradient>
          <linearGradient id="brandBar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#002366" />
            <stop offset="50%" stopColor="#0A84FF" />
            <stop offset="100%" stopColor="#2FA8FF" />
          </linearGradient>
        </defs>

        {/* Ambient Desk LED Glow */}
        <ellipse cx="270" cy="275" rx="190" ry="24" fill="url(#mainMonitorGlow)" />

        {/* Ergonomic Desk Surface */}
        <path
          d="M 60 250 L 480 250 L 440 280 L 100 280 Z"
          fill="url(#deskWood)"
          stroke="#22324A"
          strokeWidth="2"
        />
        {/* Desk Front Edge Bevel */}
        <path
          d="M 100 280 L 440 280 L 440 292 L 100 292 Z"
          fill="#080B12"
          stroke="#0A84FF"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* Desk Metallic Legs */}
        <rect x="120" y="292" width="10" height="75" rx="2" fill="#162235" stroke="#22324A" />
        <rect x="410" y="292" width="10" height="75" rx="2" fill="#162235" stroke="#22324A" />

        {/* Ultra-Wide Curved Center Monitor */}
        <rect x="160" y="70" width="220" height="135" rx="12" fill="#101826" stroke="#0A84FF" strokeWidth="2.5" />
        <rect x="168" y="78" width="204" height="119" rx="8" fill="#080B12" />

        {/* Monitor Screen Content: Code Workspace & Live Graph */}
        {/* Code Editor Header */}
        <rect x="168" y="78" width="204" height="18" fill="#162235" />
        <circle cx="178" cy="87" r="3" fill="#EF4444" />
        <circle cx="188" cy="87" r="3" fill="#F59E0B" />
        <circle cx="198" cy="87" r="3" fill="#10B981" />
        <rect x="215" y="83" width="70" height="8" rx="2" fill="#22324A" />

        {/* Code lines */}
        <line x1="180" y1="108" x2="235" y2="108" stroke="#0A84FF" strokeWidth="3" strokeLinecap="round" />
        <line x1="180" y1="118" x2="280" y2="118" stroke="#2FA8FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="192" y1="128" x2="250" y2="128" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <line x1="192" y1="138" x2="310" y2="138" stroke="#A8C0D8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="180" y1="148" x2="225" y2="148" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* Live Milestone Graph Window on Right of Monitor */}
        <rect x="290" y="105" width="74" height="80" rx="6" fill="#101826" stroke="#22324A" />
        <path d="M 296 165 Q 310 140 325 150 T 355 120" stroke="#0A84FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 296 165 Q 310 140 325 150 T 355 120 L 355 175 L 296 175 Z" fill="url(#mainMonitorGlow)" />
        <circle cx="355" cy="120" r="3.5" fill="#2FA8FF" />

        {/* Monitor Heavy Stand */}
        <rect x="260" y="205" width="20" height="36" rx="2" fill="#162235" stroke="#22324A" />
        <rect x="235" y="241" width="70" height="8" rx="4" fill="#22324A" stroke="#0A84FF" strokeWidth="1" />

        {/* Left Secondary Device: Slim Developer Laptop */}
        <rect x="80" y="165" width="75" height="52" rx="6" fill="#101826" stroke="#2FA8FF" strokeWidth="1.5" />
        <rect x="85" y="170" width="65" height="42" rx="4" fill="#080B12" />
        {/* Terminal Text on Laptop */}
        <line x1="92" y1="180" x2="125" y2="180" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="92" y1="188" x2="138" y2="188" stroke="#2FA8FF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="92" y1="196" x2="115" y2="196" stroke="#A8C0D8" strokeWidth="1.5" strokeLinecap="round" />
        {/* Laptop Keyboard Base */}
        <path d="M 68 217 L 167 217 L 157 227 L 78 227 Z" fill="#162235" stroke="#22324A" />

        {/* Right Secondary: Floating Proposal Review Tablet */}
        <rect x="385" y="155" width="65" height="85" rx="8" fill="#101826" stroke="#0A84FF" strokeWidth="1.5" />
        <rect x="391" y="161" width="53" height="73" rx="5" fill="#080B12" />
        <circle cx="403" cy="173" r="5" fill="#0A84FF" />
        <rect x="414" y="170" width="24" height="6" rx="2" fill="#2FA8FF" />
        <rect x="397" y="185" width="41" height="4" rx="1.5" fill="#22324A" />
        <rect x="397" y="193" width="35" height="4" rx="1.5" fill="#22324A" />
        <rect x="397" y="201" width="38" height="4" rx="1.5" fill="#10B981" />
        <rect x="397" y="215" width="41" height="12" rx="4" fill="url(#brandBar)" />

        {/* Minimalist Ergonomic Chair Back Silhouette */}
        <path
          d="M 235 285 C 235 250, 305 250, 305 285 L 295 340 L 245 340 Z"
          fill="#080B12"
          stroke="#0A84FF"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Blueprint Connecting Vector Lines with Electric Glow Nodes */}
        <path d="M 155 190 Q 210 140 260 140" stroke="#0A84FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <path d="M 385 195 Q 340 160 300 160" stroke="#2FA8FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="155" cy="190" r="3" fill="#0A84FF" />
        <circle cx="385" cy="195" r="3" fill="#2FA8FF" />
      </svg>
    </div>
  );
}
