import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  Users,
  Eye,
  ArrowUpRight,
  Trash2,
  BadgeCheck,
  Briefcase
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

// Category badge colors & styling helper
export const getCategoryBadge = (category) => {
  const cat = (category?.name || category || '').toLowerCase();
  if (cat.includes('web') || cat.includes('full-stack') || cat.includes('frontend') || cat.includes('backend')) {
    return {
      label: category?.name || category || 'Web Development',
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/25',
      dot: 'bg-cyan-500',
    };
  }
  if (cat.includes('mobile') || cat.includes('app') || cat.includes('ios') || cat.includes('android')) {
    return {
      label: category?.name || category || 'Mobile App',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
      dot: 'bg-purple-500',
    };
  }
  if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('figma')) {
    return {
      label: category?.name || category || 'UI/UX Design',
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
      dot: 'bg-rose-500',
    };
  }
  if (cat.includes('ai') || cat.includes('data') || cat.includes('machine') || cat.includes('python')) {
    return {
      label: category?.name || category || 'AI & Data',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
      dot: 'bg-amber-500',
    };
  }
  if (cat.includes('devops') || cat.includes('cloud') || cat.includes('security')) {
    return {
      label: category?.name || category || 'Cloud & DevOps',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
      dot: 'bg-emerald-500',
    };
  }
  return {
    label: category?.name || category || 'General Tech',
    badge: 'bg-blue-500/10 text-[#0A84FF] dark:text-[#2FA8FF] border-blue-500/25',
    dot: 'bg-[#0A84FF]',
  };
};

// Lifecycle progress helper
export const getProgressConfig = (status) => {
  switch (status) {
    case 'completed':
      return { pct: 100, label: '100% Completed', barClass: 'bg-emerald-500', textClass: 'text-emerald-600 dark:text-emerald-400' };
    case 'in_progress':
      return { pct: 75, label: '75% In Progress', barClass: 'bg-amber-500', textClass: 'text-amber-600 dark:text-amber-400' };
    case 'open':
    case 'active':
      return { pct: 40, label: '40% Active Bidding', barClass: 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]', textClass: 'text-[#0A84FF] dark:text-[#2FA8FF]' };
    case 'draft':
      return { pct: 15, label: '15% Draft Setup', barClass: 'bg-slate-400 dark:bg-slate-500', textClass: 'text-slate-500 dark:text-slate-400' };
    case 'cancelled':
    case 'closed':
      return { pct: 0, label: '0% Closed', barClass: 'bg-rose-500', textClass: 'text-rose-500 dark:text-rose-400' };
    default:
      return { pct: 30, label: 'Active', barClass: 'bg-[#0A84FF]', textClass: 'text-[#0A84FF]' };
  }
};

export default function ProjectKanbanCard({ job, onDelete }) {
  if (!job) return null;

  const catBadge = getCategoryBadge(job.category);
  const progress = getProgressConfig(job.status);
  const proposalsCount = job.proposalCount || job.proposalsCount || 0;
  const isDeletable = job.status === 'open' || job.status === 'draft';
  const budgetAmount = job.budget?.max || job.budget?.min || job.budget || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between h-[450px] p-4 rounded-2xl bg-white dark:bg-[#121B2B] border border-slate-200/90 dark:border-[#22324A] shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-[#0A84FF]/50 transition-all duration-200 overflow-hidden"
    >
      {/* -------------------------------------------------------------
          TOP ROW: Category Pill on Left + Expertise Tier on Right
          Rigid two-sided header with distinct styling (prevents "Web Developmentexpert" bug)
         ------------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-2 w-full flex-shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border truncate max-w-[62%] ${catBadge.badge}`}
          title={catBadge.label}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${catBadge.dot}`} />
          <span className="truncate">{catBadge.label}</span>
        </span>

        {job.experienceLevel && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#1A263A] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shrink-0"
            title={`Experience: ${job.experienceLevel}`}
          >
            {job.experienceLevel}
          </span>
        )}
      </div>

      {/* -------------------------------------------------------------
          TITLE & DESCRIPTION: Consistent line-clamp and vertical spacing
         ------------------------------------------------------------- */}
      <div className="flex-shrink-0 space-y-1.5">
        <Link
          to={`/jobs/${job._id}`}
          className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] line-clamp-2 h-10 leading-snug transition-colors block"
          title={job.title}
        >
          {job.title}
        </Link>
        <p className="text-xs text-slate-500 dark:text-[#8FA5BE] line-clamp-2 h-8 leading-relaxed overflow-hidden">
          {job.description || 'No description provided.'}
        </p>
      </div>

      {/* -------------------------------------------------------------
          SKILLS CHIPS: Wrapped row with first 3 items + overflow counter
         ------------------------------------------------------------- */}
      <div className="flex items-center flex-wrap gap-1 h-6 overflow-hidden flex-shrink-0">
        {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0 ? (
          <>
            {job.skillsRequired.slice(0, 3).map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#182438] text-[10px] font-semibold text-slate-600 dark:text-[#A8C0D8] border border-slate-200/60 dark:border-slate-700/50 truncate max-w-[90px]"
                title={skill}
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span
                className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#182438] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50"
                title={`${job.skillsRequired.length - 3} more skills`}
              >
                +{job.skillsRequired.length - 3}
              </span>
            )}
          </>
        ) : (
          <span className="text-[10px] text-slate-400 italic">No specific skills listed</span>
        )}
      </div>

      {/* -------------------------------------------------------------
          LIFECYCLE PROGRESS BAR: Animated indicator with percentage
         ------------------------------------------------------------- */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#1E2C42] flex-shrink-0">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400 dark:text-[#88A0B8] font-medium">Lifecycle</span>
          <span className={`font-bold font-mono ${progress.textClass}`}>
            {progress.label}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#1E2C42] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress.barClass}`}
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      {/* -------------------------------------------------------------
          BUDGET & PROPOSALS STAT BOX: Uniform structured card
         ------------------------------------------------------------- */}
      <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#162235]/60 border border-slate-100 dark:border-[#22324A] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center flex-shrink-0">
            <Wallet size={14} />
          </div>
          <div className="font-mono leading-tight">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
              Budget
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {formatCurrency(budgetAmount)}
            </span>
          </div>
        </div>

        <Link
          to={`/dashboard/projects/${job._id}/proposals`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] hover:bg-[#0A84FF] hover:text-white border border-blue-100 dark:border-blue-900/40 text-xs font-bold transition-all shadow-2xs group/bids"
          title="View Submitted Proposals"
        >
          <Users size={12} className="group-hover/bids:scale-110 transition-transform" />
          <span>{proposalsCount} {proposalsCount === 1 ? 'Proposal' : 'Proposals'}</span>
        </Link>
      </div>

      {/* -------------------------------------------------------------
          FOOTER (PINNED TO BOTTOM): Client Avatar + Two Equal-Width Buttons
         ------------------------------------------------------------- */}
      <div className="mt-auto pt-2.5 border-t border-slate-100 dark:border-[#1E2C42] space-y-2 flex-shrink-0">
        
        {/* Sub-row: Client Info on Left + Action/Delete Icons on Right */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 flex items-center justify-center text-[10px] font-bold overflow-hidden flex-shrink-0">
              {job.client?.avatar?.url ? (
                <img
                  src={job.client.avatar.url}
                  alt={job.client.name || 'Client'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span>{job.client?.name?.charAt(0) || 'C'}</span>
              )}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#A8C0D8] truncate max-w-[100px]">
                {job.client?.name || 'You'}
              </span>
              <BadgeCheck size={13} className="text-[#0A84FF] flex-shrink-0" />
            </div>
          </div>

          {/* Delete / Close Button for Draft / Open jobs */}
          {isDeletable && onDelete && (
            <button
              onClick={() => onDelete(job._id)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Close or Delete Project"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Action Buttons: TWO EQUAL-WIDTH BUTTONS SIDE BY SIDE */}
        <div className="flex items-center gap-2 w-full pt-0.5">
          <Link
            to={`/dashboard/projects/${job._id}/proposals`}
            className="flex-1 h-8 rounded-xl bg-[#0A84FF] hover:bg-[#0070E0] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all text-center"
          >
            <Eye size={13} />
            <span className="truncate">View Proposals</span>
          </Link>

          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 h-8 rounded-xl bg-white dark:bg-[#162235] hover:bg-slate-50 dark:hover:bg-[#1E2E44] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#22324A] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all text-center"
          >
            <ArrowUpRight size={13} />
            <span className="truncate">View Job</span>
          </Link>
        </div>

      </div>

    </motion.div>
  );
}
