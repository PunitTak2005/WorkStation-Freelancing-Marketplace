import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Search,
  Briefcase, IndianRupee, Zap, Star, Lock
} from 'lucide-react';

// Animated Counter Component with smooth exponential easing
function AnimatedCounter({ from = 0, to, duration = 2, suffix = '', prefix = '', decimals = 0 }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    let animationFrame;

    const targetNum = Number(to) || 0;
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = from + (targetNum - from) * ease;
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(targetNum);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ProjectsHeroSection({ jobsCount = 0, onBrowseProjects }) {
  // Live calculated stats from database
  const activeProjectsCount = Number(jobsCount) || 0;

  const statCards = [
    {
      label: 'Live Projects',
      value: activeProjectsCount,
      suffix: '+',
      prefix: '',
      highlight: 'Active Now',
      highlightColor: 'emerald',
      icon: Briefcase,
      iconGradient: 'from-[#002366] to-[#0A84FF]',
    },
    {
      label: 'Verified Clients',
      value: 540,
      suffix: '+',
      prefix: '',
      highlight: 'Payment Verified',
      highlightColor: 'emerald',
      icon: ShieldCheck,
      iconGradient: 'from-[#0A84FF] to-[#2FA8FF]',
    },
    {
      label: 'Avg Project Budget',
      value: 24000,
      suffix: '',
      prefix: '₹',
      highlight: 'Guaranteed Escrow',
      highlightColor: 'blue',
      icon: IndianRupee,
      iconGradient: 'from-[#6366F1] to-[#0A84FF]',
    },
    {
      label: 'Talent Hired Today',
      value: 89,
      suffix: '',
      prefix: '',
      highlight: 'Fast Matching',
      highlightColor: 'emerald',
      icon: Sparkles,
      iconGradient: 'from-[#10B981] to-[#0A84FF]',
    },
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-2 pb-10 sm:pb-14">
      {/* 32px Rounded Master Container with Multi-Layered Gradients & Glassmorphism */}
      <div className="max-w-7xl mx-auto relative rounded-[32px] overflow-hidden border border-[#D6EFFF] dark:border-[#22324A] bg-gradient-to-b from-white/95 via-[#F8FBFF]/90 to-white/95 dark:from-[#10192A]/95 dark:via-[#0D1524]/90 dark:to-[#10192A]/95 shadow-2xl backdrop-blur-2xl p-6 sm:p-10 lg:p-12 transition-colors duration-300">
        
        {/* Background Blueprint Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0A84FF_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-20 pointer-events-none" />

        {/* Ambient Brand Radiant Glow Orbs */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-[#002366]/20 dark:bg-[#002366]/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 -right-28 w-[420px] h-[420px] bg-[#0A84FF]/15 dark:bg-[#0A84FF]/25 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-28 left-1/4 w-80 h-80 bg-[#2FA8FF]/15 dark:bg-[#2FA8FF]/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Floating Geometric Brand Lines & Rings */}
        <div className="absolute top-8 right-12 w-64 h-64 rounded-full border border-dashed border-[#0A84FF]/10 dark:border-[#2FA8FF]/15 pointer-events-none animate-spin-slow" />
        <div className="absolute -bottom-10 right-1/3 w-44 h-44 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/15 pointer-events-none" />

        <div className="relative z-10">
          {/* Main Two-Column Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Copy, Dual CTAs & Trust Row */}
            <div className="lg:col-span-6 xl:col-span-7 text-left flex flex-col justify-center">
              
              {/* Large Premium Headline (56–64px desktop) */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black text-slate-900 dark:text-white font-display tracking-tight leading-[1.08]"
              >
                Browse{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:via-[#2FA8FF] dark:to-[#60A5FA]">
                  Freelance Projects
                </span>
              </motion.h1>

              {/* Supporting Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 sm:mt-5 text-base sm:text-lg text-[#5B6B7A] dark:text-[#A8C0D8] max-w-xl font-normal leading-relaxed"
              >
                Discover high-impact freelance opportunities with real-time client postings, intelligent search, transparent milestone contracts, and guaranteed escrow protection.
              </motion.p>

              {/* Dual Premium CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-3.5 sm:gap-4 mt-7 sm:mt-8"
              >
                {/* Primary CTA: Browse Live Projects (smooth scroll to search & grid) */}
                <button
                  type="button"
                  onClick={onBrowseProjects}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#0051CC] hover:from-[#0A84FF] hover:to-[#002366] shadow-lg shadow-[#0A84FF]/25 hover:shadow-xl hover:shadow-[#0A84FF]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <Search size={18} className="group-hover:rotate-12 transition-transform duration-300 text-white flex-shrink-0" />
                  <span>Browse Live Projects</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </button>

                {/* Secondary CTA: Post a Project (link to post-job) */}
                <Link
                  to="/dashboard/post-job"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-800 dark:text-white bg-white/80 dark:bg-[#162235]/80 hover:bg-white dark:hover:bg-[#1E2D44] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/50 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Briefcase size={18} className="text-[#0A84FF] dark:text-[#2FA8FF] flex-shrink-0" />
                  <span>Post a Project</span>
                </Link>
              </motion.div>

              {/* Trust Row Beneath Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-y-2.5 gap-x-5 sm:gap-x-7 mt-8 pt-6 border-t border-[#E2EEF8] dark:border-[#1E2B3E] text-xs sm:text-sm font-medium text-slate-600 dark:text-[#A8C0D8]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>No Platform Fee Upfront</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={13} />
                  </div>
                  <span>Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <Zap size={13} />
                  </div>
                  <span>Real-Time Matching</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Premium Floating Marketplace Workspace Dashboard Mockup */}
            <div className="lg:col-span-6 xl:col-span-5 relative flex justify-center w-full">
              
              {/* Floating Dashboard Card Container with Smooth Infinite Bob */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-[480px] relative rounded-2xl bg-white/90 dark:bg-[#10192A]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl backdrop-blur-xl p-5 sm:p-6 hover:border-[#0A84FF]/50 transition-all duration-300"
              >
                {/* Mockup Header: Workspace Title & Status */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#002366] to-[#0A84FF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      W
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                        WorkStation Project Hub
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                        Active Bidding Workspace
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Bids
                  </div>
                </div>

                {/* Primary Active Project Card Inside Workspace */}
                <div className="p-4 rounded-xl bg-[#F8FBFF] dark:bg-[#162235]/70 border border-[#D6EFFF] dark:border-[#22324A]/70 mb-4 shadow-sm group hover:border-[#0A84FF]/40 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        FinTech & Mobile
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors leading-snug">
                        FinTrack Mobile Banking App
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        FinTrack Solutions • Bengaluru, India
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Fixed Budget
                      </div>
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono text-emerald-600 dark:text-emerald-400">
                        ₹1,20,000
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 mb-3.5">
                    {['React Native', 'TypeScript', 'Node.js', 'Tailwind'].map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-[#101826] border border-slate-200 dark:border-slate-700/60 text-[10px] font-medium text-slate-700 dark:text-[#A8C0D8]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Milestone Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      <span>Milestone 2 of 3 Active</span>
                      <span className="font-bold text-[#0A84FF] dark:text-[#2FA8FF]">75% Funded</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Assigned Specialist & Real Talent Avatar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#101826] border border-slate-200/80 dark:border-slate-800/90 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src="/freelancers/abhishek-nayak.png"
                        alt="Abhishek Nayak"
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#0A84FF]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://ui-avatars.com/api/?name=Abhishek+Nayak&background=0A84FF&color=fff';
                        }}
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#101826]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>Abhishek Nayak</span>
                        <CheckCircle2 size={12} className="text-[#0A84FF] fill-[#0A84FF]/20" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span>Senior Full-Stack Dev</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-500 font-semibold">
                          <Star size={10} className="fill-amber-400 mr-0.5" /> 5.0
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] text-[10px] font-bold">
                    Top Rated
                  </span>
                </div>

                {/* Escrow Guarantee Seal */}
                <div className="flex items-center justify-between mt-3 px-1 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                    <Lock size={12} className="text-[#0A84FF]" />
                    100% Escrow Protected
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹45,000 Milestone Locked
                  </span>
                </div>

                {/* Floating Micro-Card 1: 5 New Proposals Received (Top Right Overlap) */}
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute -top-5 -right-5 z-20 px-3.5 py-2 rounded-xl bg-white dark:bg-[#162235] border border-[#0A84FF]/40 shadow-xl backdrop-blur-xl items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    <Zap size={14} className="fill-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block leading-none">
                      Active Posting
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      ⚡ 5 New Proposals
                    </span>
                  </div>
                </motion.div>

                {/* Floating Micro-Card 2: Milestone Deliverable Submission (Bottom Left Overlap) */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="hidden sm:flex absolute -bottom-5 -left-5 z-20 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#162235] border border-emerald-500/30 shadow-xl backdrop-blur-xl items-center gap-2.5"
                >
                  <div className="relative">
                    <img
                      src="/freelancers/mayank-joshi.png"
                      alt="Mayank Joshi"
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=Mayank+Joshi&background=10B981&color=fff';
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-[#162235]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">
                      Mayank J. submitted review
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      Milestone 1 Deliverable • Ready
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Statistics Section: 4 Floating Glassmorphic Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {statCards.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  className="p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl hover:border-[#0A84FF]/50 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#5B6B7A] dark:text-[#A8C0D8] block">
                      {stat.label}
                    </span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.iconGradient} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={18} />
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors">
                    <AnimatedCounter
                      to={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      duration={2}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {stat.highlight}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
