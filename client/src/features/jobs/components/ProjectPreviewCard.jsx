import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Calendar,
  Users,
  BadgeCheck,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  FileCheck2,
  TrendingUp,
  Clock,
  Star,
  IndianRupee,
  Target,
  Zap,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getCategoryBadge } from './ProjectKanbanCard';

// ─── Animated Count-Up Hook ────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

// ─── Single Stat Chip ──────────────────────────────────────────────────────
function StatChip({ icon: Icon, value, suffix = '', label, color, delay = 0 }) {
  const num = useCountUp(value, 1000 + delay * 200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.12, duration: 0.4 }}
      className="flex-1 min-w-0 flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-[#121B2B] border border-slate-200/80 dark:border-[#22324A] shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1.5 ${color}`}>
        <Icon size={14} className="text-white" />
      </div>
      <span className="text-sm font-black text-slate-900 dark:text-white font-mono leading-none">
        {num}{suffix}
      </span>
      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

export default function ProjectPreviewCard({
  formData,
  skills = [],
  deliverables = [],
  clientUser,
}) {
  const catBadge = getCategoryBadge(formData.category || 'Web Development');
  const minB = Number(formData.minBudget) || 0;
  const maxB = Number(formData.maxBudget) || 0;
  const isHourly = formData.budgetType === 'hourly';

  return (
    <div className="space-y-5">

      {/* ── Success Metrics Panel ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-4 bg-gradient-to-br from-[#3B82F6]/10 via-indigo-500/5 to-purple-500/5 dark:from-[#101826] dark:via-[#141F32] dark:to-[#101826] border border-blue-100/80 dark:border-[#22324A] shadow-sm overflow-hidden relative"
      >
        {/* Ambient glow */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#4F46E5] text-white flex items-center justify-center">
            <TrendingUp size={12} />
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">WorkStation Stats</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <div className="flex gap-2">
          <StatChip icon={Users}       value={15}   suffix="k+"  label="Freelancers"   color="bg-blue-500"    delay={0} />
          <StatChip icon={Clock}       value={24}   suffix="h"   label="Avg Response"  color="bg-indigo-500"  delay={1} />
          <StatChip icon={Star}        value={95}   suffix="%"   label="Success Rate"  color="bg-emerald-500" delay={2} />
          <StatChip icon={IndianRupee} value={50}   suffix="L+"  label="Paid Out"      color="bg-amber-500"   delay={3} />
        </div>
      </motion.div>

      {/* ── Live Job Board Preview ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="rounded-3xl p-5 bg-white dark:bg-[#101826] border border-slate-200/90 dark:border-[#22324A] shadow-sm relative overflow-hidden"
      >
        {/* Subtle gradient top sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#4F46E5] rounded-t-3xl" />

        {/* Top Preview Banner with Live Indicator */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-[#1E2C42] mt-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Live Preview
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#3B82F6] dark:text-[#60A5FA] border border-blue-100 dark:border-blue-900/40">
            Talent View
          </span>
        </div>

        {/* Card Mockup */}
        <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#121B2B] border border-slate-200/80 dark:border-[#1E2C42]">
          {/* Top Meta Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border truncate max-w-[65%] ${catBadge.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${catBadge.dot}`} />
              <span className="truncate">{catBadge.label}</span>
            </span>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#1A263A] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
              {formData.experienceLevel || 'Intermediate'}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
            {formData.title || (
              <span className="text-slate-400 dark:text-slate-500 italic font-normal">
                Your project title will appear here…
              </span>
            )}
          </h4>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {formData.description || 'Provide a detailed description of your project scope, requirements, and deliverables…'}
          </p>

          {/* Skills Pills */}
          <div className="flex items-center flex-wrap gap-1">
            {skills.length > 0 ? (
              skills.slice(0, 4).map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-[#182438] text-slate-600 dark:text-[#A8C0D8] border border-slate-200/80 dark:border-slate-700/50"
                >
                  {sk}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400 italic">No skills selected yet</span>
            )}
            {skills.length > 4 && (
              <span className="text-[10px] text-slate-400">+{skills.length - 4} more</span>
            )}
          </div>

          {/* Deliverables summary badge */}
          {deliverables.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-0.5">
              <FileCheck2 size={12} />
              <span>{deliverables.length} Deliverables defined</span>
            </div>
          )}

          {/* Budget & Timeline Row */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-[#1E2C42] flex items-center justify-between text-xs">
            <div className="font-mono">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                {isHourly ? 'Hourly Rate' : 'Budget Range'}
              </span>
              <span className="font-black text-slate-900 dark:text-white">
                {minB > 0 || maxB > 0
                  ? `${formatCurrency(minB)} – ${formatCurrency(maxB)}${isHourly ? '/hr' : ''}`
                  : '₹ Budget not set'}
              </span>
            </div>

            {formData.deadline && (
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                  Deadline
                </span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {formatDate(formData.deadline)}
                </span>
              </div>
            )}
          </div>

          {/* Client Footer */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-[#1E2C42] flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-[10px] font-bold overflow-hidden flex-shrink-0">
                {clientUser?.avatar?.url ? (
                  <img src={clientUser.avatar.url} alt="You" className="w-full h-full object-cover" />
                ) : (
                  <span>{clientUser?.name?.charAt(0) || 'C'}</span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#A8C0D8] truncate">
                {clientUser?.name || 'Verified Client'}
              </span>
              <BadgeCheck size={12} className="text-[#3B82F6] flex-shrink-0" />
            </div>
            <span className="text-[10px] font-bold text-slate-400">0 Proposals</span>
          </div>
        </div>
      </motion.div>

      {/* ── Client Tips Panel ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="rounded-3xl p-5 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-[#101826] dark:via-[#141F32] dark:to-[#101826] border border-amber-100/80 dark:border-[#22324A] shadow-sm space-y-3.5"
      >
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center">
            <Lightbulb size={14} />
          </div>
          <span>Posting Tips</span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200/80 dark:border-amber-900/40">
            Pro Guide
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            {
              num: '01',
              color: 'border-l-blue-400',
              bg: 'bg-blue-50/60 dark:bg-blue-950/20',
              icon: <Target size={12} className="text-blue-500" />,
              title: 'Write a specific title',
              desc: 'Mention frameworks like "MERN stack" or "React Native" to attract expert proposals instantly.',
            },
            {
              num: '02',
              color: 'border-l-emerald-400',
              bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
              icon: <CheckCircle2 size={12} className="text-emerald-500" />,
              title: 'Define clear deliverables',
              desc: 'Break outcomes into milestones. Speeds up escrow sign-offs and reduces revision cycles.',
            },
            {
              num: '03',
              color: 'border-l-purple-400',
              bg: 'bg-purple-50/60 dark:bg-purple-950/20',
              icon: <Sparkles size={12} className="text-purple-500" />,
              title: 'Set competitive budgets',
              desc: 'Competitive pricing ensures top-rated talent with 98%+ completion rates respond first.',
            },
          ].map((tip) => (
            <div
              key={tip.num}
              className={`flex gap-2.5 p-2.5 rounded-xl ${tip.bg} border-l-2 ${tip.color} border border-transparent`}
            >
              <div className="mt-0.5 flex-shrink-0">{tip.icon}</div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-[11px] mb-0.5">
                  {tip.title}
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip Callout */}
        <div className="flex items-start gap-2 p-3 rounded-2xl bg-gradient-to-r from-[#3B82F6]/10 to-indigo-500/10 dark:from-[#3B82F6]/10 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30">
          <Zap size={14} className="text-[#3B82F6] flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-600 dark:text-[#A8C0D8] leading-snug">
            <strong className="text-[#3B82F6]">Pro tip:</strong> Projects with 3+ skills and a clear budget get <strong>2.4× more</strong> proposals within the first hour.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
