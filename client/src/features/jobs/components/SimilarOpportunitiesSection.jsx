import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  SearchX,
  Bookmark,
  Clock,
  Wallet,
  Calendar,
  Users,
  MapPin,
  Building2,
  ShieldCheck,
  Layers,
  Smartphone,
  Database,
  Palette,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveMatchScore(job, index) {
  const seed = ((job._id || job.id || '') + index)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return 70 + (seed % 28); // 70–97
}

function matchGradient(score) {
  if (score >= 90) return 'from-emerald-400 to-teal-500';
  if (score >= 75) return 'from-blue-400 to-indigo-500';
  return 'from-amber-400 to-orange-500';
}

function getCategoryIcon(catName = '') {
  const cat = catName.toLowerCase();
  if (cat.includes('web') || cat.includes('frontend') || cat.includes('fullstack') || cat.includes('stack') || cat.includes('react')) return Layers;
  if (cat.includes('mobile') || cat.includes('ios') || cat.includes('android')) return Smartphone;
  if (cat.includes('ai') || cat.includes('ml') || cat.includes('machine')) return Sparkles;
  if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('figma')) return Palette;
  if (cat.includes('data') || cat.includes('sql') || cat.includes('analytics')) return Database;
  if (cat.includes('marketing') || cat.includes('growth') || cat.includes('seo')) return TrendingUp;
  if (cat.includes('content') || cat.includes('write') || cat.includes('copy')) return FileText;
  return Briefcase;
}

function getBannerImage(p) {
  if (p.image) return p.image;
  const t = (p.title || '').toLowerCase();
  if (t.includes('ecommerce') || t.includes('mern')) return '/projects/mern-ecommerce.webp';
  if (t.includes('fitness') || t.includes('tracker')) return '/projects/fitness-tracker-app.webp';
  if (t.includes('fintech') || t.includes('wealth') || t.includes('fintrack')) return '/projects/fintech-saas-dashboard.webp';
  if (t.includes('llm') || t.includes('agent') || t.includes('support')) return '/projects/llm-support-agent.webp';
  if (t.includes('brand') || t.includes('identity')) return '/projects/brand-identity-guidelines.webp';
  if (t.includes('security') || t.includes('cloud') || t.includes('penetration')) return '/projects/penetration-testing-cloud.webp';
  if (t.includes('learnsphere') || t.includes('mobile') || t.includes('education')) return '/projects/learnsphere-mobile-ui.webp';
  if (t.includes('churn') || t.includes('prediction')) return '/projects/churn-prediction-data.webp';
  if (t.includes('crm') || t.includes('dashboard')) return '/projects/fintech-saas-dashboard.webp';
  return '/projects/mern-ecommerce.webp';
}

function formatBudget(b) {
  if (!b) return '₹Negotiable';
  const fmt = (v) => (v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`);
  if (b.min && b.max && b.min !== b.max) return `${fmt(b.min)}–${fmt(b.max)}`;
  const val = b.max || b.min || (typeof b === 'number' ? b : 45000);
  return fmt(val);
}

function getTimeline(p) {
  if (p.timeline) return p.timeline;
  if (p.duration) return p.duration;
  if (p.deadline) {
    const d = Math.ceil((new Date(p.deadline) - new Date()) / 86400000);
    if (d > 0) return `${d}d left`;
    if (d === 0) return 'Ends today';
    return 'Completed';
  }
  return '30 Days';
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const diffH = Math.floor((Date.now() - new Date(dateStr)) / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return '1d ago';
  if (diffD < 30) return `${diffD}d ago`;
  return `${Math.floor(diffD / 30)}mo ago`;
}

// ─── Self-contained Opportunity Card ──────────────────────────────────────────

function SimilarOpportunityCard({ job: p, matchScore, index }) {
  const [saved, setSaved] = useState(false);
  const projectId   = p._id || p.id;
  const categoryName = typeof p.category === 'object' ? (p.category?.name || 'General') : (p.category || 'General');
  const CategoryIcon = getCategoryIcon(categoryName);
  const clientObj   = typeof p.client === 'object' ? p.client : null;
  const companyName = p.company || clientObj?.company || 'TechCorp';
  const location    = p.location || clientObj?.location || (p.locationType ? p.locationType.charAt(0).toUpperCase() + p.locationType.slice(1) : 'Remote');
  const skills      = (p.skillsRequired || p.skills || ['React', 'Node.js']).slice(0, 5);
  const extraSkills = Math.max(0, (p.skillsRequired || p.skills || []).length - 5);
  const proposals   = p.proposalsCount ?? p.proposalCount ?? p.proposals ?? 12;
  const exp         = (p.experienceLevel || p.experience || 'Intermediate');
  const expLabel    = exp.charAt(0).toUpperCase() + exp.slice(1);
  const grad        = matchGradient(matchScore);

  // Urgent status
  const isUrgent = (() => {
    if (p.urgent) return true;
    if ((p.status || '').toLowerCase() === 'urgent') return true;
    if (p.deadline) {
      const d = Math.ceil((new Date(p.deadline) - new Date()) / 86400000);
      return d <= 2 && d >= 0;
    }
    return false;
  })();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group flex flex-col h-full rounded-[20px] bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] overflow-hidden shadow-sm hover:shadow-[0_16px_40px_rgba(10,132,255,0.16)] dark:hover:shadow-[0_16px_40px_rgba(10,132,255,0.22)] hover:border-[#3B82F6]/50 transition-all duration-250"
      aria-label={`Similar opportunity: ${p.title}`}
    >
      {/* ── 1. Cover Image (16:9 fixed aspect) ────────────────────────── */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-[#101826]">
        <img
          src={getBannerImage(p)}
          alt={p.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/projects/mern-ecommerce.webp'; }}
        />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Urgent badge if applicable */}
        {isUrgent && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-sm border border-amber-400/40 shadow-sm">
              <Zap size={10} className="fill-white" />
              Urgent
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body (24px padding, 16px vertical gap between sections) ─ */}
      <div className="flex flex-col flex-1 p-6 gap-4 min-w-0">

        {/* ── 2. Category + Match Badge Header ───────────────────────── */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          {/* Category badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EFF6FF] dark:bg-[#101F33] text-[#002366] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#1E3A5F] shadow-2xs truncate">
            <CategoryIcon size={12} className="text-[#3B82F6] flex-shrink-0" />
            <span className="truncate">{categoryName}</span>
          </div>

          {/* Match score badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.2 + index * 0.08 }}
            className="flex-shrink-0"
          >
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-white bg-gradient-to-r ${grad} shadow-sm border border-white/20`}>
              <Sparkles size={10} />
              {matchScore}% Match
            </div>
          </motion.div>
        </div>

        {/* ── 3. Project Title (Max 2 lines) ─────────────────────────── */}
        <Link to={`/jobs/${projectId}`} className="block group/t">
          <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white font-display leading-snug line-clamp-2 min-h-[44px] group-hover/t:text-[#3B82F6] dark:group-hover/t:text-[#60A5FA] transition-colors break-words">
            {p.title}
          </h3>
        </Link>

        {/* ── 4. Company Row (8px gap) ───────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-[#5B6B7A] dark:text-[#A8C0D8] min-w-0">
          {/* Company icon & name */}
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200 min-w-0 max-w-[140px]" title={companyName}>
            <Building2 size={13} className="text-[#3B82F6] flex-shrink-0" />
            <span className="truncate font-semibold">{companyName}</span>
          </span>

          {/* Dot separator */}
          <span className="text-slate-300 dark:text-slate-600 font-bold select-none">•</span>

          {/* Remote badge / Location */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#334155] flex-shrink-0" title={location}>
            <MapPin size={10} className="text-[#3B82F6] flex-shrink-0" />
            <span className="truncate max-w-[95px]">{location}</span>
          </span>
        </div>

        {/* ── 5. Metadata Grid (2×2 Stat Cards with Icon Above Label) ── */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Wallet,    label: 'Budget',     value: formatBudget(p.budget), color: 'text-[#3B82F6]',   iconBg: 'bg-blue-50 dark:bg-[#0D1E33]',     cellBg: 'bg-[#F8FAFC] dark:bg-[#0F1928]' },
            { icon: Calendar,  label: 'Duration',   value: getTimeline(p),          color: 'text-indigo-500',  iconBg: 'bg-indigo-50 dark:bg-[#0D1022]',   cellBg: 'bg-[#F8FAFC] dark:bg-[#0F1928]' },
            { icon: Briefcase, label: 'Experience', value: expLabel,                color: 'text-amber-500',   iconBg: 'bg-amber-50 dark:bg-[#1C1300]',    cellBg: 'bg-[#F8FAFC] dark:bg-[#0F1928]' },
            { icon: Users,     label: 'Proposals',  value: String(proposals),       color: 'text-emerald-500', iconBg: 'bg-emerald-50 dark:bg-[#071A10]', cellBg: 'bg-[#F8FAFC] dark:bg-[#0F1928]' },
          ].map(({ icon: Icon, label, value, color, iconBg, cellBg }) => (
            <div
              key={label}
              className={`flex flex-col justify-between p-3 rounded-[14px] border border-[#E2EEFF] dark:border-[#1E2D44] ${cellBg} min-h-[80px] transition-colors hover:border-[#3B82F6]/40 shadow-2xs`}
            >
              {/* Icon above label */}
              <div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1.5 ${color} ${iconBg}`}>
                  <Icon size={12} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8AA0BE] block leading-none">
                  {label}
                </span>
              </div>
              {/* Bold value below — fits nicely, wraps without word-splitting */}
              <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight mt-1.5 block" title={value}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── 6. Description (Limit 3 lines, comfortable line-height) ── */}
        <p className="text-xs leading-relaxed text-[#5B6B7A] dark:text-[#A8C0D8] line-clamp-3 min-h-[3.6rem] overflow-hidden break-words">
          {p.description || 'No description provided for this project.'}
        </p>

        {/* ── 7. Skill Chips (Pill shape, 10px px, max 5 + overflow) ─── */}
        <div className="flex flex-wrap gap-2 items-center min-h-[30px]">
          {skills.map((sk, i) => (
            <span
              key={i}
              className="inline-flex items-center h-6 rounded-full px-2.5 text-[11px] font-semibold bg-[#EFF6FF] dark:bg-[#101F33] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#1E3A5F] hover:border-[#3B82F6] transition-colors whitespace-nowrap"
            >
              {sk}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="inline-flex items-center h-6 rounded-full px-2.5 text-[11px] font-bold bg-slate-100 dark:bg-[#1A263A] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#22324A] whitespace-nowrap">
              +{extraSkills}
            </span>
          )}
        </div>

        {/* ── 8. Footer (Pinned to bottom via mt-auto, pt-5) ─────────── */}
        <div className="mt-auto pt-5 border-t border-[#E2EEFF] dark:border-[#22324A] flex items-center justify-between gap-3">
          {/* Left: Clock icon + Posted time */}
          <span className="inline-flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] font-medium flex-shrink-0">
            <Clock size={13} className="text-slate-400 dark:text-slate-500" />
            {timeAgo(p.createdAt)}
          </span>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Save bookmark */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setSaved((s) => !s); }}
              aria-label={saved ? 'Remove bookmark' : 'Save project'}
              className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center transition-all ${
                saved
                  ? 'bg-[#EFF6FF] dark:bg-[#0E1F35] border-[#3B82F6] text-[#3B82F6]'
                  : 'border-[#D6EFFF] dark:border-[#22324A] text-slate-400 hover:text-[#3B82F6] hover:border-[#3B82F6] bg-white dark:bg-[#101826]'
              }`}
            >
              <Bookmark size={13} className={saved ? 'fill-current' : ''} />
            </button>

            {/* Primary View Project button */}
            <Link
              to={`/jobs/${projectId}`}
              className="group/btn inline-flex items-center gap-2 h-8.5 px-3.5 rounded-xl bg-gradient-to-r from-[#002366] via-[#1D4ED8] to-[#3B82F6] hover:opacity-95 text-white text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-px transition-all duration-200 relative overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              View Project
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </motion.article>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-[20px] bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] overflow-hidden animate-pulse shadow-sm h-full">
      <div className="w-full aspect-video bg-slate-200 dark:bg-[#1A263A] flex-shrink-0" />
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-slate-200 dark:bg-[#22324A] rounded-full" />
          <div className="h-6 w-20 bg-slate-200 dark:bg-[#22324A] rounded-full" />
        </div>
        <div className="h-11 bg-slate-200 dark:bg-[#22324A] rounded-lg w-full" />
        <div className="h-4 bg-slate-100 dark:bg-[#1A263A] rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-[#1A263A] rounded-[14px]" />
          ))}
        </div>
        <div className="h-14 bg-slate-100 dark:bg-[#1A263A] rounded" />
        <div className="flex gap-2 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-14 bg-slate-100 dark:bg-[#1A263A] rounded-full" />
          ))}
        </div>
        <div className="mt-auto pt-5 border-t border-slate-100 dark:border-[#22324A] flex items-center justify-between gap-3">
          <div className="h-4 w-16 bg-slate-100 dark:bg-[#1A263A] rounded" />
          <div className="h-8.5 w-28 bg-slate-200 dark:bg-[#22324A] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/30 flex items-center justify-center border-2 border-dashed border-[#3B82F6]/30">
          <SearchX size={36} className="text-[#3B82F6]/60" />
        </div>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-[#3B82F6]/40 border border-white dark:border-[#080B12]" />
        </motion.div>
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">No Similar Opportunities Yet</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
        We're finding projects that match your skills and interests. Check back soon!
      </p>
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-[#002366] via-[#3B82F6] to-[#60A5FA] text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
      >
        Browse All Projects <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
          <Briefcase size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display leading-none">
            Similar Opportunities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Projects that match your skills and interests.
          </p>
        </div>
      </div>
      <Link
        to="/jobs"
        className="group flex-shrink-0 inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] text-xs font-bold text-[#3B82F6] dark:text-[#60A5FA] hover:border-[#3B82F6] hover:bg-[#EFF6FF] dark:hover:bg-[#1A263A] transition-all shadow-sm"
      >
        View All
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

/**
 * SimilarOpportunitiesSection
 *
 * Props:
 *   similarJobs  – array from the existing API (unchanged)
 *   loading      – boolean, true while the parent is fetching
 *   currentJobId – _id of the current job, to exclude it from recommendations
 */
export default function SimilarOpportunitiesSection({ similarJobs = [], loading = false, currentJobId }) {
  // Exclude the current job and limit to 3
  const jobs = similarJobs
    .filter((j) => (j._id || j.id) !== currentJobId)
    .slice(0, 3);

  const isEmpty = !loading && jobs.length === 0;

  return (
    <section aria-label="Similar Opportunities" className="relative">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden rounded-3xl">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-blue-400/8 dark:bg-blue-600/8 blur-[80px]" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-400/8 dark:bg-indigo-600/8 blur-[60px]" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
      </div>

      <SectionHeader />

      {/* Grid — items-stretch ensures equal-height cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        <AnimatePresence mode="wait">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <motion.div key={`skel-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.07 }}>
                <SkeletonCard />
              </motion.div>
            ))
          ) : isEmpty ? (
            <EmptyState key="empty" />
          ) : (
            jobs.map((sj, i) => (
              <SimilarOpportunityCard
                key={sj._id || sj.id || i}
                job={sj}
                matchScore={deriveMatchScore(sj, i)}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
