import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Calendar,
  Briefcase,
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  Zap,
  Layers,
  Smartphone,
  Sparkles,
  Palette,
  Database,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function ProjectCard({ project, job, onApply, index = 0 }) {
  const p = project || job;
  if (!p) return null;

  const [saved, setSaved] = useState(p.isSaved || false);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  // 1. Category name & dynamic icon resolution
  const categoryName = typeof p.category === 'object' ? (p.category?.name || 'General') : (p.category || 'General');
  
  const getCategoryIcon = (catName = '') => {
    const cat = catName.toLowerCase();
    if (cat.includes('web') || cat.includes('react') || cat.includes('frontend') || cat.includes('fullstack') || cat.includes('stack')) {
      return Layers;
    }
    if (cat.includes('mobile') || cat.includes('app') || cat.includes('ios') || cat.includes('android')) {
      return Smartphone;
    }
    if (cat.includes('ai') || cat.includes('machine') || cat.includes('ml') || cat.includes('gpt')) {
      return Sparkles;
    }
    if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('figma')) {
      return Palette;
    }
    if (cat.includes('data') || cat.includes('analytics') || cat.includes('sql') || cat.includes('database')) {
      return Database;
    }
    if (cat.includes('marketing') || cat.includes('growth') || cat.includes('seo')) {
      return TrendingUp;
    }
    if (cat.includes('content') || cat.includes('write') || cat.includes('copy')) {
      return FileText;
    }
    return Briefcase;
  };

  const CategoryIcon = getCategoryIcon(categoryName);

  // 2. Banner Image resolution with reliable fallback
  const getProjectImage = () => {
    if (p.image) return p.image;
    const title = (p.title || '').toLowerCase();
    if (title.includes('ecommerce') || title.includes('mern')) return '/projects/mern-ecommerce.webp';
    if (title.includes('fitness') || title.includes('tracker')) return '/projects/fitness-tracker-app.webp';
    if (title.includes('fintech') || title.includes('wealth') || title.includes('fintrack')) return '/projects/fintech-saas-dashboard.webp';
    if (title.includes('llm') || title.includes('agent') || title.includes('support')) return '/projects/llm-support-agent.webp';
    if (title.includes('brand') || title.includes('identity')) return '/projects/brand-identity-guidelines.webp';
    if (title.includes('penetration') || title.includes('security') || title.includes('cloud')) return '/projects/penetration-testing-cloud.webp';
    if (title.includes('learnsphere') || title.includes('mobile') || title.includes('education')) return '/projects/learnsphere-mobile-ui.webp';
    if (title.includes('churn') || title.includes('data') || title.includes('prediction')) return '/projects/churn-prediction-data.webp';
    if (title.includes('video') || title.includes('animation')) return '/projects/saas-video-animation.webp';
    if (title.includes('marketing') || title.includes('growth')) return '/projects/growth-marketing-scale.webp';
    if (title.includes('whitepaper') || title.includes('web3')) return '/projects/web3-security-whitepaper.webp';
    return '/projects/mern-ecommerce.webp';
  };

  const bannerImage = getProjectImage();

  // 3. Status computation: Open | Hiring | Urgent
  const computeStatus = () => {
    const s = (p.status || '').toLowerCase();
    if (s === 'urgent' || p.urgent) return 'urgent';
    if (s === 'hiring') return 'hiring';
    if (p.deadline) {
      const diffDays = Math.ceil((new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 2 && diffDays >= 0) return 'urgent';
    }
    return 'open';
  };

  const statusType = computeStatus();

  // 4. Budget formatting
  const formatBudgetString = () => {
    const minVal = p.budget?.min;
    const maxVal = p.budget?.max;
    if (minVal && maxVal && minVal !== maxVal) {
      const minFormatted = minVal >= 1000 ? `₹${Math.round(minVal / 1000)}k` : `₹${minVal.toLocaleString()}`;
      const maxFormatted = maxVal >= 1000 ? `₹${Math.round(maxVal / 1000)}k` : `₹${maxVal.toLocaleString()}`;
      return `${minFormatted} – ${maxFormatted}`;
    }
    const val = maxVal || minVal || (typeof p.budget === 'number' ? p.budget : 45000);
    return `₹${val.toLocaleString()}`;
  };

  // 5. Timeline calculation
  const getTimelineString = () => {
    if (p.timeline) return p.timeline;
    if (p.duration) return p.duration;
    if (p.deadline) {
      const diffDays = Math.ceil((new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return `${diffDays} Days`;
      if (diffDays === 0) return 'Ends Today';
      return 'Completed';
    }
    return '30 Days';
  };

  // 6. Experience level formatting
  const getExperienceString = () => {
    const lvl = p.experienceLevel || p.experience || 'Intermediate';
    return lvl.charAt(0).toUpperCase() + lvl.slice(1);
  };

  // 7. Proposals count
  const proposalCount = p.proposalsCount ?? p.proposalCount ?? p.proposals ?? 12;

  // 8. Client & Company details
  const clientObj = typeof p.client === 'object' ? p.client : null;
  const companyName = p.company || clientObj?.company || 'TechCorp';
  const clientName = clientObj?.name || (typeof p.client === 'string' ? p.client : 'Verified Client');
  const locationName = p.location || clientObj?.location || (p.locationType ? (p.locationType.charAt(0).toUpperCase() + p.locationType.slice(1)) : 'Remote');

  // 9. Relative time
  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Posted recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Posted just now';
    if (diffHours < 24) return `Posted ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Posted 1d ago';
    if (diffDays < 30) return `Posted ${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `Posted ${diffMonths}mo ago`;
  };

  const postedTimeAgo = getTimeAgo(p.createdAt);

  // 10. Skills
  const skillsList = p.skillsRequired || p.skills || ['React', 'Node.js', 'MongoDB'];
  const projectId = p._id || p.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between h-full rounded-[20px] bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/60 dark:hover:border-[#0A84FF]/60 shadow-workstation-card dark:shadow-workstation-dark hover:shadow-[0_20px_40px_rgba(10,132,255,0.18)] dark:hover:shadow-[0_20px_40px_rgba(10,132,255,0.25)] hover:ring-1 hover:ring-[#0A84FF]/40 transition-all duration-300 overflow-hidden"
    >
      {/* 1. Large Project Banner (~190px) */}
      <div className="relative w-full h-[190px] overflow-hidden bg-slate-100 dark:bg-[#101826]">
        <img
          src={bannerImage}
          alt={p.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/projects/mern-ecommerce.webp';
          }}
        />

        {/* Gradient Overlay for Text/Badge Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15 pointer-events-none" />

        {/* Top-Left: Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-[#101826]/90 backdrop-blur-md text-[#002366] dark:text-[#2FA8FF] border border-white/60 dark:border-[#22324A] shadow-md">
            <CategoryIcon size={13} className="text-[#0A84FF] flex-shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[150px]">{categoryName}</span>
          </div>
        </div>

        {/* Top-Right: Status Badge */}
        <div className="absolute top-3.5 right-3.5 z-10">
          {statusType === 'urgent' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-md border border-amber-400/40">
              <Zap size={12} className="animate-pulse fill-white text-white" />
              Urgent
            </span>
          )}
          {statusType === 'hiring' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0A84FF]/90 text-white backdrop-blur-md shadow-md border border-[#0A84FF]/40">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Hiring
            </span>
          )}
          {statusType === 'open' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md border border-emerald-400/40">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Open
            </span>
          )}
        </div>
      </div>

      {/* 2. Card Content Body: 20-24px padding */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        
        {/* Header Section: Title & Meta Info */}
        <div className="space-y-2">
          <Link to={`/jobs/${projectId}`} className="block group/title">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display leading-snug line-clamp-2 min-h-[52px] group-hover/title:text-[#0A84FF] dark:group-hover/title:text-[#2FA8FF] transition-colors">
              {p.title}
            </h3>
          </Link>

          {/* Meta Line: Company, Client, Location */}
          <div className="flex items-center gap-3 text-xs text-[#5B6B7A] dark:text-[#A8C0D8] flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium truncate max-w-[140px]" title={companyName}>
              <Building2 size={13} className="text-[#0A84FF] flex-shrink-0" />
              <span className="truncate">{companyName}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-medium truncate max-w-[130px]" title={clientName}>
              <ShieldCheck size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="truncate">{clientName}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-medium truncate max-w-[120px]" title={locationName}>
              <MapPin size={13} className="text-[#2FA8FF] flex-shrink-0" />
              <span className="truncate">{locationName}</span>
            </span>
          </div>
        </div>

        {/* 3. Information Grid: 2x2 Clean Layout */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#F8FBFF] dark:bg-[#101826] border border-[#D6EFFF]/80 dark:border-[#22324A]">
          {/* 1: Budget */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 dark:bg-[#162235]/80 border border-[#D6EFFF]/60 dark:border-[#22324A]/60">
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] dark:bg-[#101826] flex items-center justify-center text-[#0A84FF] flex-shrink-0">
              <Wallet size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-[#A8C0D8] block leading-none mb-0.5">
                Budget
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono truncate">
                {formatBudgetString()}
              </div>
            </div>
          </div>

          {/* 2: Duration / Timeline */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 dark:bg-[#162235]/80 border border-[#D6EFFF]/60 dark:border-[#22324A]/60">
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] dark:bg-[#101826] flex items-center justify-center text-[#2FA8FF] flex-shrink-0">
              <Calendar size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-[#A8C0D8] block leading-none mb-0.5">
                Duration
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono truncate">
                {getTimelineString()}
              </div>
            </div>
          </div>

          {/* 3: Experience Level */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 dark:bg-[#162235]/80 border border-[#D6EFFF]/60 dark:border-[#22324A]/60">
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] dark:bg-[#101826] flex items-center justify-center text-[#0A84FF] flex-shrink-0">
              <Briefcase size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-[#A8C0D8] block leading-none mb-0.5">
                Experience
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {getExperienceString()}
              </div>
            </div>
          </div>

          {/* 4: Proposals */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 dark:bg-[#162235]/80 border border-[#D6EFFF]/60 dark:border-[#22324A]/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <Users size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-[#A8C0D8] block leading-none mb-0.5">
                Proposals
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono truncate">
                {proposalCount}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Description Preview: 3 readable lines with clean fallback */}
        <p className="text-sm leading-relaxed text-[#5B6B7A] dark:text-[#A8C0D8] line-clamp-3 min-h-[60px]">
          {p.description}
        </p>

        {/* 5. Skills Section: Wrapped chips up to 4, +N badge */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
          {skillsList.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center h-6 rounded-full px-2.5 text-xs font-medium bg-[#EAF6FF] dark:bg-[#101826] text-[#002366] dark:text-[#A8C0D8] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 4 && (
            <span className="inline-flex items-center h-6 rounded-full px-2 text-xs font-semibold bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A]">
              +{skillsList.length - 4}
            </span>
          )}
        </div>

        {/* 6. Footer: Posted time + Save Button & Full-Width CTA */}
        <div className="pt-3 border-t border-[#D6EFFF]/60 dark:border-[#22324A] space-y-3 mt-auto">
          <div className="flex items-center justify-between text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock size={13} className="text-slate-400" />
              <span>{postedTimeAgo}</span>
            </div>
            <button
              type="button"
              onClick={toggleSave}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark project'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                saved
                  ? 'bg-[#EAF6FF] dark:bg-[#101826] border-[#0A84FF] text-[#0A84FF]'
                  : 'border-[#D6EFFF] dark:border-[#22324A] text-slate-500 hover:text-[#0A84FF] hover:border-[#0A84FF] bg-[#F8FBFF] dark:bg-[#101826]'
              }`}
            >
              <Bookmark size={13} className={saved ? 'fill-[#0A84FF] text-[#0A84FF]' : 'text-slate-400'} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <Link
            to={`/jobs/${projectId}`}
            onClick={onApply}
            className="w-full h-11 px-5 rounded-xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] hover:from-[#001c52] hover:via-[#0977e6] hover:to-[#2896e6] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#0A84FF]/25 hover:shadow-[#0A84FF]/40 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group/btn"
          >
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <span>View Details</span>
            <ArrowRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
