import React from 'react';
import Card from '@/components/common/Card';
import {
  FileText,
  Sparkles,
  Send,
  BookmarkCheck,
  CheckCircle2,
  Trophy,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function ProposalConversionCard({
  proposalsSent = 12,
  accepted = 5,
  shortlisted = 2,
  pending = 2,
  rejected = 3,
  completed = 5,
  successRate = 42,
  shortlistRate = 17
}) {
  const bidRatio = (proposalsSent / (accepted || 1)).toFixed(1);

  const metricBoxes = [
    {
      id: 'submitted',
      label: 'Submitted',
      value: proposalsSent,
      sublabel: 'Total Proposals',
      icon: Send,
      color: 'blue',
      cardBg: 'bg-blue-50/60 dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/40',
      textColor: 'text-blue-600 dark:text-[#2FA8FF]',
      iconBg: 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted',
      value: shortlisted,
      sublabel: `${shortlistRate}% rate`,
      icon: BookmarkCheck,
      color: 'amber',
      cardBg: 'bg-amber-50/60 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/40',
      textColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100/80 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300'
    },
    {
      id: 'accepted',
      label: 'Accepted',
      value: accepted,
      sublabel: `${successRate}% win rate`,
      icon: CheckCircle2,
      color: 'green',
      cardBg: 'bg-emerald-50/60 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      value: completed,
      sublabel: '100% 5★ Rating',
      icon: Trophy,
      color: 'emerald',
      cardBg: 'bg-teal-50/60 dark:bg-teal-950/30',
      border: 'border-teal-100 dark:border-teal-900/40',
      textColor: 'text-teal-600 dark:text-teal-400',
      iconBg: 'bg-teal-100/80 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300'
    }
  ];

  const miniPills = [
    {
      label: 'Hired',
      count: accepted,
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40',
      dot: 'bg-emerald-500'
    },
    {
      label: 'Shortlisted',
      count: shortlisted,
      color: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40',
      dot: 'bg-amber-500'
    },
    {
      label: 'Pending',
      count: pending,
      color: 'text-blue-700 dark:text-blue-300',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40',
      dot: 'bg-blue-500'
    },
    {
      label: 'Rejected',
      count: rejected,
      color: 'text-rose-700 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/40',
      dot: 'bg-rose-500'
    }
  ];

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      <div className="space-y-5">
        {/* 1. Header: 44x44 Icon, Title, Subtitle, and Success Badge in Top-Right */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display truncate leading-tight">
                Proposal Conversion Funnel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Live funnel from proposal submission to completed projects.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1 shrink-0 whitespace-nowrap shadow-xs">
            <Sparkles size={11} className="shrink-0" />
            <span>{successRate}% Success</span>
          </span>
        </div>

        {/* 2. Portrait 2x2 Metric Matrix */}
        <div className="grid grid-cols-2 gap-3.5">
          {metricBoxes.map((box) => {
            const Icon = box.icon;
            return (
              <div
                key={box.id}
                className={`p-4 rounded-2xl ${box.cardBg} border ${box.border} flex flex-col items-center justify-center text-center hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 min-w-0`}
              >
                <div className={`w-8 h-8 rounded-xl ${box.iconBg} flex items-center justify-center mb-2 shrink-0`}>
                  <Icon size={16} />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display leading-tight truncate">
                  {box.value}
                </p>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                  {box.label}
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {box.sublabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* 3. Bottom Analytics: Large Bid-to-Hire Ratio & Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Bid-to-Hire Ratio
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
                1 in {bidRatio} bids
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                <TrendingUp size={12} />
                {successRate}% Win Rate
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                {accepted} won of {proposalsSent} total
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0A84FF] via-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, successRate))}%` }}
            />
          </div>

          {/* 4 Evenly Spaced Mini-Stat Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {miniPills.map((pill) => (
              <div
                key={pill.label}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border ${pill.bg} min-w-0`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pill.dot}`} />
                  <span className={`text-[11px] font-medium truncate ${pill.color}`}>
                    {pill.label}
                  </span>
                </div>
                <span className={`text-xs font-bold font-mono ml-1.5 shrink-0 ${pill.color}`}>
                  {pill.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium truncate min-w-0">
          <CheckCircle2 size={13} className="shrink-0" />
          <span className="truncate">High client response score (94%)</span>
        </span>
        <span className="text-slate-400 shrink-0 ml-2">{proposalsSent} bids tracked</span>
      </div>
    </Card>
  );
}
