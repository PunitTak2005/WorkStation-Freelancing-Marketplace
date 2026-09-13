import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, ShieldCheck, CheckCircle2,
  CreditCard, FileCheck, Users, Lock, Star, ChevronRight,
  TrendingUp, Award, Zap
} from 'lucide-react';
import Button from '@/components/common/Button';

// Animated Counter Component with smooth easing
function AnimatedCounter({ from = 0, to, duration = 2, suffix = '', prefix = '', decimals = 0 }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = from + (to - from) * ease;
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(to);
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

export default function CTASection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Free to register',
      desc: 'Create your client or specialist profile in seconds with zero upfront membership fees.'
    },
    {
      icon: CreditCard,
      title: 'No credit card required upfront',
      desc: 'Explore verified talent, receive custom proposals, and negotiate terms before depositing funds.'
    },
    {
      icon: FileCheck,
      title: 'Automated milestone contracts',
      desc: 'Built-in escrow protection holds milestone deposits safely until you approve deliverable quality.'
    }
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-[#F8FBFF] dark:bg-[#080B12] transition-colors duration-300">
      {/* 1. Background Ambience: Blueprint Grid, Glow Orbs & Geometric Rings */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.06] dark:opacity-[0.04] pointer-events-none" />

      {/* Layered Radial Glows */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#002366]/20 via-[#0A84FF]/15 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-[#2FA8FF]/20 via-[#0A84FF]/12 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Concentric Brand Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-dashed border-[#2FA8FF]/5 dark:border-[#2FA8FF]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2. Main SaaS Container (32px rounded glassmorphic card) */}
        <div className="relative rounded-[32px] bg-gradient-to-b from-white/95 via-[#F9FBFE]/90 to-white/95 dark:from-[#10192A]/95 dark:via-[#0D1524]/90 dark:to-[#10192A]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/10 dark:shadow-black/40 backdrop-blur-2xl p-8 sm:p-12 lg:p-16 overflow-hidden">
          
          {/* Subtle Inner Accent Gradient Rim */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0A84FF] to-transparent opacity-60" />
          
          {/* Corner Watermark Circle */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/20 pointer-events-none" />

          {/* Grid: 2 Columns on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

            {/* Left Column: Heading, Value Props & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#002366] dark:text-[#2FA8FF] text-xs font-bold uppercase tracking-wider mb-5 self-start shadow-sm shadow-blue-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A84FF]" />
                </span>
                <span>Join 40,000+ Modern Teams & Specialists</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-[1.12] mb-5">
                Ready to Build in the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:via-[#2FA8FF] dark:to-white">
                  WorkStation?
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-[#A8C0D8] text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Whether you need to scale engineering capacity with pre-vetted specialists or want to work with innovative global companies, WorkStation powers modern collaboration with secure milestone escrow.
              </p>

              {/* 3 Premium Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-9">
                {features.map((feat, index) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="group p-4 rounded-2xl bg-white/70 dark:bg-[#162235]/70 border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[1.5px] mb-3 flex items-center justify-center shadow-md shadow-blue-500/20">
                        <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#101826] flex items-center justify-center">
                          <Icon size={16} className="text-[#0A84FF] group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 font-display leading-tight">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8] leading-normal line-clamp-2">
                        {feat.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Premium Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold shadow-xl shadow-[#0A84FF]/25 hover:shadow-[#0A84FF]/40 transition-all flex items-center justify-center gap-2 rounded-xl"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </Link>

                <Link to="/freelancers" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] text-slate-800 dark:text-white transition-all flex items-center justify-center gap-2 rounded-xl"
                    >
                      <Users size={18} className="text-[#0A84FF]" />
                      <span>Explore Talent</span>
                    </Button>
                  </motion.div>
                </Link>
              </div>

            </motion.div>

            {/* Right Column: Floating SaaS Hiring Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              {/* Floating Animation Wrapper */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                {/* Radiant Glow Behind Card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#002366]/30 via-[#0A84FF]/30 to-[#2FA8FF]/30 rounded-3xl blur-2xl -z-10 opacity-70" />

                {/* Primary Dashboard Glass Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-[#131F33]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/15 backdrop-blur-xl">
                  
                  {/* Mock Window Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EAF2F9] dark:border-[#22324A]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-mono text-[#5B6B7A] dark:text-[#A8C0D8]">
                      workstation.io / contracts
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  {/* Active Project Header */}
                  <div className="mb-5">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#0A84FF]">
                        Milestone Escrow Contract
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        ₹1,20,000 INR
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                      Next-Gen SaaS Cloud Platform
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-0.5">
                      Client: Nexus Global Labs • 4 Milestones
                    </p>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div className="p-3.5 rounded-2xl bg-[#F0F7FF] dark:bg-[#0D1624] border border-[#D6EFFF] dark:border-[#22324A] mb-5">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Milestone 3 of 4 Funded
                      </span>
                      <span className="font-bold text-[#0A84FF]">75% Complete</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] w-[75%]" />
                    </div>
                  </div>

                  {/* Assigned Specialist Row */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[2px]">
                          <img
                            src="/freelancers/abhishek-nayak.png"
                            alt="Abhishek Nayak"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://ui-avatars.com/api/?name=Abhishek+Nayak&background=002366&color=fff';
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#162235]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            Abhishek Nayak
                          </h4>
                          <ShieldCheck size={13} className="text-[#0A84FF]" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8]">
                          Full Stack Node.js Engineer
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold justify-end">
                        <Star size={12} className="fill-amber-400" />
                        <span>5.0</span>
                      </div>
                      <span className="text-[10px] text-[#5B6B7A] dark:text-[#A8C0D8]">48 reviews</span>
                    </div>
                  </div>

                </div>

                {/* Floating Micro-Card: Incoming Bid Alert (Top Right Overlay) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                  className="hidden sm:flex absolute -top-6 -right-6 items-center gap-3 p-3 px-4 rounded-2xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-xl shadow-blue-500/20 backdrop-blur-xl"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[2px] flex-shrink-0">
                    <img
                      src="/freelancers/mayank-joshi.png"
                      alt="Mayank Joshi"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=Mayank+Joshi&background=002366&color=fff';
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Mayank Joshi</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EAF6FF] dark:bg-[#0A84FF]/20 text-[#0A84FF] font-semibold">New Bid</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8] font-mono">
                      ₹85,000 • 14 days
                    </p>
                  </div>
                </motion.div>

                {/* Floating Micro-Card: 100% Escrow Guarantee (Bottom Left Overlay) */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1 }}
                  className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-2.5 p-3 px-4 rounded-2xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-xl shadow-blue-500/20 backdrop-blur-xl"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Lock size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                      100% Escrow Protection
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-[#A8C0D8]">
                      Funds held safely until release
                    </p>
                  </div>
                </motion.div>

              </motion.div>
            </motion.div>

          </div>

          {/* 3. Social Proof Metric Cards (Bottom Grid) */}
          <div className="mt-12 sm:mt-14 pt-8 border-t border-[#EAF2F9] dark:border-[#22324A]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#162235]/60 border border-[#D6EFFF] dark:border-[#22324A] text-center sm:text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] dark:bg-[#0A84FF]/15 text-[#0A84FF] flex items-center justify-center flex-shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                    <AnimatedCounter to={40000} suffix="+" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#A8C0D8] font-medium">
                    Modern Teams Hiring
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#162235]/60 border border-[#D6EFFF] dark:border-[#22324A] text-center sm:text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] dark:bg-[#2FA8FF]/15 text-[#2FA8FF] flex items-center justify-center flex-shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                    <AnimatedCounter to={120000} suffix="+" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#A8C0D8] font-medium">
                    Verified Specialists
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#162235]/60 border border-[#D6EFFF] dark:border-[#22324A] text-center sm:text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                    <AnimatedCounter to={98.6} decimals={1} suffix="%" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#A8C0D8] font-medium">
                    Milestone Success Rate
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
