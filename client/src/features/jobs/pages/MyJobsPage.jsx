import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Eye,
  LayoutGrid,
  ListFilter,
  Calendar,
  Users,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Briefcase,
  Zap,
  ShieldCheck,
  Search,
  ChevronRight,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Layers,
  FolderPlus,
  BarChart3,
  X,
  FileText
} from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import StatusBadge from '@/components/common/StatusBadge';
import Skeleton from '@/components/common/Skeleton';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'react-hot-toast';
import api from '@/services/api';
import KanbanColumn from '../components/KanbanColumn';
import ProjectKanbanCard, { getCategoryBadge, getProgressConfig } from '../components/ProjectKanbanCard';

// Smooth Animated Number Counter for KPI Metric Cards
function AnimatedCounter({ to, duration = 1.2, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const target = Number(to) || 0;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(target * ease));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return (
    <span className="font-mono tracking-tight font-black">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// 5 Kanban Columns configuration with distinct styling and empty states
const KANBAN_COLUMNS = [
  {
    id: 'draft',
    label: 'Draft',
    description: 'Staged projects pending publishing',
    theme: {
      pip: 'bg-slate-400 dark:bg-slate-500',
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      strip: 'bg-slate-400',
      columnBg: 'bg-[#F8FAFC]/90 dark:bg-[#0B101B]/80 border-slate-200/90 dark:border-[#1C283F]',
      columnGlow: 'hover:border-slate-300 dark:hover:border-slate-700',
    },
    emptyTitle: 'No drafts pending',
    emptyDesc: 'New projects you save as drafts will appear in this column.',
  },
  {
    id: 'open',
    label: 'Active',
    description: 'Open for proposals & bids',
    theme: {
      pip: 'bg-[#0A84FF] animate-pulse',
      badge: 'bg-blue-100/90 text-blue-700 dark:bg-blue-950/80 dark:text-[#2FA8FF] border-blue-200 dark:border-blue-900/60',
      strip: 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]',
      columnBg: 'bg-blue-50/40 dark:bg-[#091529]/75 border-blue-100/90 dark:border-[#1E3255]',
      columnGlow: 'hover:border-[#0A84FF]/50 dark:hover:border-[#0A84FF]/40',
    },
    emptyTitle: 'No active projects',
    emptyDesc: 'Publish a project to begin receiving proposals from top specialists.',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    description: 'Contracts actively being developed',
    theme: {
      pip: 'bg-amber-500',
      badge: 'bg-amber-100/90 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
      strip: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      columnBg: 'bg-amber-50/35 dark:bg-[#1A1409]/65 border-amber-100/90 dark:border-[#382B14]',
      columnGlow: 'hover:border-amber-400/50 dark:hover:border-amber-500/40',
    },
    emptyTitle: 'No projects in progress',
    emptyDesc: 'Once you hire a freelancer and fund escrow, active jobs move here.',
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'Delivered, approved & released',
    theme: {
      pip: 'bg-emerald-500',
      badge: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
      strip: 'bg-gradient-to-r from-emerald-600 to-teal-500',
      columnBg: 'bg-emerald-50/35 dark:bg-[#0A1A14]/65 border-emerald-100/90 dark:border-[#143628]',
      columnGlow: 'hover:border-emerald-400/50 dark:hover:border-emerald-500/40',
    },
    emptyTitle: 'No completed projects yet',
    emptyDesc: 'Finalized contracts with released escrow funds will appear here.',
  },
  {
    id: 'cancelled',
    label: 'Closed',
    description: 'Cancelled or archived postings',
    theme: {
      pip: 'bg-rose-500',
      badge: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
      strip: 'bg-rose-500',
      columnBg: 'bg-rose-50/30 dark:bg-[#1C0D13]/65 border-rose-100/80 dark:border-[#3A1822]',
      columnGlow: 'hover:border-rose-400/40 dark:hover:border-rose-500/30',
    },
    emptyTitle: 'No closed projects',
    emptyDesc: 'Archived and closed job postings will be stored here for review.',
  },
];

export default function MyJobsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' (default) | 'cards'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, totalPages: 1, total: 0 });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, jobId: null });

  const tabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'open', label: 'Active' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Closed' },
  ];

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      // In Kanban view, fetch all projects (limit: 100) so all 5 columns are populated
      // In Cards view, allow pagination and tab filtering
      const params = {
        page: viewMode === 'kanban' ? 1 : page,
        limit: viewMode === 'kanban' ? 100 : 12,
      };

      if (viewMode === 'cards' && activeTab !== 'all') {
        params.status = activeTab;
      }

      const res = await api.get('/jobs/my-jobs', { params });
      const jobsList =
        res.data?.jobs ||
        (Array.isArray(res.data?.data) ? res.data.data : res.data?.data?.jobs) ||
        [];
      const paginationData =
        res.data?.pagination ||
        res.data?.data?.pagination ||
        { page: Number(page), limit: params.limit, totalPages: 1, total: jobsList.length };

      setJobs(jobsList);
      setPagination({
        page: Number(paginationData.page || paginationData.currentPage || page),
        limit: Number(paginationData.limit || params.limit),
        totalPages: Number(paginationData.totalPages || paginationData.pages || 1),
        total: Number(paginationData.total || paginationData.totalResults || jobsList.length),
      });
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      toast.error('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [activeTab, viewMode]);

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${deleteDialog.jobId}`);
      toast.success('Project closed successfully');
      window.dispatchEvent(new CustomEvent('project:count_changed'));
      setDeleteDialog({ isOpen: false, jobId: null });
      fetchJobs(pagination.page);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  // Filtered jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase().trim();
    return jobs.filter((j) => {
      const titleMatch = j.title?.toLowerCase().includes(q);
      const categoryMatch = (j.category?.name || j.category || '').toLowerCase().includes(q);
      const skillsMatch = (j.skillsRequired || []).some((s) => s?.toLowerCase().includes(q));
      return titleMatch || categoryMatch || skillsMatch;
    });
  }, [jobs, searchQuery]);

  // Group jobs for Kanban view across the 5 standard statuses
  const kanbanJobs = useMemo(() => {
    return KANBAN_COLUMNS.reduce((acc, col) => {
      acc[col.id] = filteredJobs.filter((j) => {
        if (col.id === 'open') return j.status === 'open' || j.status === 'active';
        if (col.id === 'cancelled') return j.status === 'cancelled' || j.status === 'closed';
        return j.status === col.id;
      });
      return acc;
    }, {});
  }, [filteredJobs]);

  // Aggregate live metrics dynamically from the actual database records
  const metrics = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) => j.status === 'open' || j.status === 'active').length;
    const inProgress = jobs.filter((j) => j.status === 'in_progress').length;
    const completed = jobs.filter((j) => j.status === 'completed').length;
    const totalBids = jobs.reduce((sum, j) => sum + (j.proposalCount || j.proposalsCount || 0), 0);

    return { total, active, inProgress, completed, totalBids };
  }, [jobs]);

  return (
    <div className="py-2 sm:py-4 space-y-6">

      {/* =========================================================================
          1. PREMIUM HEADER: Soft blue gradient banner with Glassmorphism panel
         ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#002366]/10 via-[#0A84FF]/10 to-transparent dark:from-[#002366]/35 dark:via-[#0A84FF]/15 dark:to-transparent border border-[#D6EFFF] dark:border-[#22324A] p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        
        {/* Ambient Decorative Floating Rings */}
        <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full bg-[#0A84FF]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-72 h-72 rounded-full bg-[#2FA8FF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-[#162235]/80 text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-ping" />
              <span className="uppercase tracking-wider text-[11px]">Client Project Management</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Project Kanban Workspace
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
              Track contract lifecycles, monitor incoming proposals, and coordinate deliverables across your talent pipeline.
            </p>
          </div>

          {/* Right Action Toolbar: Search, View Mode Toggle, Post Job CTA */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Real-time Project Search Box */}
            <div className="relative flex-1 sm:w-60 min-w-[180px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-xs rounded-xl bg-white/90 dark:bg-[#162235]/90 border border-slate-200 dark:border-[#22324A] focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Mode Switcher (Kanban vs Cards) */}
            <div className="flex items-center p-1 rounded-xl bg-white/90 dark:bg-[#162235]/90 border border-slate-200 dark:border-[#22324A] shadow-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  viewMode === 'kanban'
                    ? 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#A8C0D8] hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Interactive Kanban View"
              >
                <ListFilter size={14} />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#A8C0D8] hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Traditional Cards View"
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
            </div>

            {/* Post New Project Primary CTA */}
            <button
              onClick={() => navigate('/dashboard/post-job')}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Post New Project</span>
            </button>

          </div>
        </div>
      </div>

      {/* =========================================================================
          2. LIVE METRIC CARDS STRIP (5 Cards with Lucide Icons & Animated Counters)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: Total Projects */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-xs hover:shadow-md hover:border-[#0A84FF]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8]">
              Total Projects
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#162235] text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Briefcase size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            <AnimatedCounter to={metrics.total} />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Full project portfolio</p>
        </div>

        {/* Card 2: Active Projects */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-xs hover:shadow-md hover:border-[#0A84FF]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF] dark:text-[#2FA8FF]">
              Active Postings
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center">
              <Zap size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A84FF] dark:text-[#2FA8FF] font-mono">
            <AnimatedCounter to={metrics.active} />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Receiving talent bids</p>
        </div>

        {/* Card 3: In Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-xs hover:shadow-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              In Progress
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            <AnimatedCounter to={metrics.inProgress} />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Active escrow contracts</p>
        </div>

        {/* Card 4: Completed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            <AnimatedCounter to={metrics.completed} />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Deliverables approved</p>
        </div>

        {/* Card 5: Total Bids */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-xs hover:shadow-md hover:border-[#0A84FF]/40 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8]">
              Total Proposals
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            <AnimatedCounter to={metrics.totalBids} />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Proposals submitted</p>
        </div>

      </div>

      {/* Filter Tabs in Cards Mode */}
      {viewMode === 'cards' && (
        <div className="flex space-x-2 border-b border-slate-200 dark:border-[#22324A] overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white shadow-xs'
                  : 'text-slate-600 dark:text-[#A8C0D8] hover:bg-slate-100 dark:hover:bg-[#162235]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* =========================================================================
          3. MAIN CONTENT: Modern 5-Column Kanban Board OR Grid Cards View
         ========================================================================= */}
      {loading ? (
        /* Loading Skeletons */
        <div className="flex gap-6 items-start overflow-x-auto pb-6 scrollbar-thin">
          {[1, 2, 3, 4, 5].map((colIdx) => (
            <div
              key={colIdx}
              className="p-4 rounded-3xl bg-[#F8FAFC]/80 dark:bg-[#0F172A]/70 border border-slate-200/80 dark:border-slate-800/80 space-y-4 min-w-[310px] sm:min-w-[320px] max-w-[340px] flex-shrink-0"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
              <div className="space-y-3.5 pt-1">
                <Skeleton className="h-[450px] w-full rounded-2xl" />
                <Skeleton className="h-[450px] w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'kanban' ? (
        
        /* -----------------------------------------------------------------------
           KANBAN BOARD VIEW: Standardized SaaS Kanban Workspace (24px gap, smooth scroll)
           ----------------------------------------------------------------------- */
        <div className="flex gap-6 items-start overflow-x-auto pb-6 scroll-smooth snap-x scrollbar-thin">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              jobs={kanbanJobs[column.id] || []}
              onDeleteJob={(jobId) => setDeleteDialog({ isOpen: true, jobId })}
              onPostJob={() => navigate('/dashboard/post-job')}
            />
          ))}
        </div>

      ) : (

        /* -----------------------------------------------------------------------
           CARDS GRID VIEW: Traditional 3-Column Responsive Grid
           ----------------------------------------------------------------------- */
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0A84FF]/10 text-[#0A84FF] mx-auto flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching projects found
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A8C0D8] max-w-md mx-auto">
                {searchQuery
                  ? `No projects matched your search query "${searchQuery}". Try different keywords.`
                  : "You haven't posted any projects under this category yet."}
              </p>
              <button
                onClick={() => navigate('/dashboard/post-job')}
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus size={16} />
                <span>Post a New Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job) => {
                const proposalsCount = job.proposalCount || job.proposalsCount || 0;
                const isDeletable = job.status === 'open' || job.status === 'draft';
                const catBadge = getCategoryBadge(job.category);
                const progress = getProgressConfig(job.status);

                return (
                  <div
                    key={job._id}
                    className="bg-white dark:bg-[#101826] rounded-2xl border border-slate-200 dark:border-[#22324A] p-5 shadow-xs hover:shadow-xl hover:border-[#0A84FF]/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <StatusBadge status={job.status} />
                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(job.createdAt)}
                        </span>
                      </div>

                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] line-clamp-2 transition-colors block leading-snug"
                      >
                        {job.title}
                      </Link>

                      {job.description && (
                        <p className="text-xs text-slate-500 dark:text-[#8FA5BE] line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catBadge.badge}`}>
                          {catBadge.label}
                        </span>
                        {job.experienceLevel && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#162235] text-slate-600 dark:text-[#A8C0D8] capitalize">
                            {job.experienceLevel}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-100 dark:border-[#22324A]">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Budget
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                            {formatCurrency(job.budget?.min || 0)} - {formatCurrency(job.budget?.max || 0)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Proposals
                          </span>
                          <span className="text-sm font-black text-[#0A84FF] dark:text-[#2FA8FF] font-mono">
                            {proposalsCount} Received
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#1E2C42]">
                      <Link
                        to={`/dashboard/projects/${job._id}/proposals`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-bold hover:bg-[#0A84FF] hover:text-white transition-all"
                      >
                        <Eye size={14} />
                        <span>View Proposals ({proposalsCount})</span>
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-2 text-slate-400 hover:text-[#0A84FF] rounded-xl hover:bg-slate-100 dark:hover:bg-[#162235] transition-colors"
                          title="View Public Post"
                        >
                          <ArrowRight size={16} />
                        </Link>
                        {isDeletable && (
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, jobId: job._id })}
                            className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Close Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination in Cards Mode */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={fetchJobs}
              />
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          4. CONFIRM DELETE / CLOSE DIALOG
         ========================================================================= */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Close Project"
        message="Are you sure you want to close this project? This will archive the posting and halt active reviews."
        confirmText="Close Project"
        cancelText="Keep Open"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, jobId: null })}
        variant="danger"
      />
    </div>
  );
}
