import React from 'react';
import { ShieldCheck, Clock, Search, Briefcase, Sparkles, Plus, ArrowUpRight } from 'lucide-react';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';

export default function FreelancerHero({
  user,
  totalEarnings = 1860000,
  thisMonthEarnings = 250000,
  successRate = 58,
  activeContractsCount = 3,
  onOpenLogsModal
}) {
  const displayName = user?.name || 'Aarav Desai';
  const firstName = displayName.split(' ')[0];
  const avatarUrl = user?.profileImage || user?.avatar?.url || '/freelancers/aarav-desai.webp';
  const roleTitle = user?.title || 'Lead Full Stack Engineer & Cloud Architect';

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 border border-blue-200/60 dark:border-slate-800 shadow-sm">
      {/* Abstract decorative background blurs */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0A84FF]/10 dark:bg-[#0A84FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-16 w-64 h-64 rounded-full bg-purple-500/10 dark:bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left: Avatar, Badges & Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 shadow-sm" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0A84FF]/10 dark:bg-[#0A84FF]/20 text-[#0A84FF] dark:text-[#2FA8FF] border border-blue-200 dark:border-blue-800/50 shrink-0">
                <ShieldCheck size={13} />
                WorkStation Verified • Top Rated
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available • {successRate}% Success Rate
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2 truncate">
              <span className="truncate">Welcome back, {firstName}!</span>
              <Sparkles size={22} className="text-amber-400 fill-amber-400 shrink-0" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium truncate">
              {roleTitle} • <span className="text-[#0A84FF] dark:text-[#2FA8FF] font-semibold">This Month: {formatCurrency(thisMonthEarnings)}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={onOpenLogsModal}
            className="flex items-center gap-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 shadow-sm hover:shadow text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0"
          >
            <Clock size={16} className="text-[#0A84FF] shrink-0" />
            <span>Log Hours</span>
          </Button>

          <Link to="/dashboard/contracts" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              className="flex items-center gap-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 shadow-sm hover:shadow text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0"
            >
              <Briefcase size={16} className="text-purple-500 shrink-0" />
              <span>View Contracts ({activeContractsCount})</span>
            </Button>
          </Link>

          <Link to="/jobs" className="shrink-0">
            <Button
              variant="primary"
              size="md"
              className="flex items-center gap-2 rounded-2xl shadow-lg shadow-[#0A84FF]/25 font-semibold whitespace-nowrap shrink-0"
            >
              <Search size={16} className="shrink-0" />
              <span>Discover Projects</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
