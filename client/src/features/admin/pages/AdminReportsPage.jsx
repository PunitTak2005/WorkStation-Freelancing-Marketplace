import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle2, Clock, FileText, Flame, TrendingUp,
  ShieldAlert, Calendar, User, Tag, Layers, MoreVertical,
  ExternalLink, UserCheck, MessageSquare, Check, X,
  Smartphone, Globe, ShoppingBag, Palette, LayoutDashboard,
  Building, Bot, Eye, UserPlus, Grid, List, Sparkles, SlidersHorizontal
} from 'lucide-react';
import api from '@/services/api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Skeleton from '@/components/common/Skeleton';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

// ── Reviewer Roles Mapping ───────────────────────────────────────────────────
const REVIEWER_ROLES = {
  'Ananya Sharma': 'Lead Security Reviewer',
  'Rahul Mehta': 'Compliance & Contract Lead',
  'Vikram Singh': 'Senior Dispute Specialist',
  'Neha Patel': 'UI & Accessibility Lead',
  'Arjun Joshi': 'Principal Systems Architect',
  'Sneha Gupta': 'DevOps & Reliability Lead',
  'Priya Sharma': 'Product Quality Lead',
  'Rohan Patel': 'Engineering Reviewer',
  'Deepa Iyer': 'Client Success Lead',
};

// ── Project Badges Meta ──────────────────────────────────────────────────────
const PROJECT_META = {
  'Mobile Banking App': {
    icon: Smartphone,
    emoji: '📱',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
  },
  'WorkStation Marketplace': {
    icon: Globe,
    emoji: '🌐',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40',
  },
  'E-commerce Platform': {
    icon: ShoppingBag,
    emoji: '🛒',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
  },
  'Portfolio CMS': {
    icon: Palette,
    emoji: '🎨',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
  },
  'CRM Dashboard': {
    icon: LayoutDashboard,
    emoji: '📊',
    badgeClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40',
  },
  'Society Management System': {
    icon: Building,
    emoji: '🏢',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
  },
  'AI Chat Assistant': {
    icon: Bot,
    emoji: '🤖',
    badgeClass: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/40',
  },
};

// ── Priority Meta ─────────────────────────────────────────────────────────────
const PRIORITY_META = {
  critical: {
    label: 'Critical',
    cardBorder: 'border-l-rose-500 shadow-rose-500/10',
    badge: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm shadow-rose-500/30',
    dot: 'bg-rose-200 animate-pulse',
    accentColor: 'text-rose-600 dark:text-rose-400',
    softBg: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40',
  },
  high: {
    label: 'High',
    cardBorder: 'border-l-orange-500 shadow-orange-500/10',
    badge: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm shadow-orange-500/30',
    dot: 'bg-orange-200',
    accentColor: 'text-orange-600 dark:text-orange-400',
    softBg: 'bg-orange-50/70 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/40',
  },
  medium: {
    label: 'Medium',
    cardBorder: 'border-l-blue-500 shadow-blue-500/10',
    badge: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/30',
    dot: 'bg-blue-200',
    accentColor: 'text-blue-600 dark:text-blue-400',
    softBg: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40',
  },
  low: {
    label: 'Low',
    cardBorder: 'border-l-emerald-500 shadow-emerald-500/10',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30',
    dot: 'bg-emerald-200',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    softBg: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40',
  },
};

// ── Status Meta ───────────────────────────────────────────────────────────────
const STATUS_META = {
  under_review: {
    label: 'Under Review',
    emoji: '🟡',
    icon: ShieldAlert,
    pill: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    dot: 'bg-amber-500 animate-pulse',
  },
  resolved: {
    label: 'Resolved',
    emoji: '🟢',
    icon: CheckCircle2,
    pill: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    emoji: '🔴',
    icon: Clock,
    pill: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    dot: 'bg-rose-500',
  },
  rejected: {
    label: 'Rejected',
    emoji: '⚪',
    icon: AlertCircle,
    pill: 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

// ── Avatar Helpers ────────────────────────────────────────────────────────────
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'U';
}

function getAvatarColor(name = '') {
  const colors = [
    'from-indigo-500 to-purple-600 text-white',
    'from-blue-500 to-cyan-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-rose-500 to-pink-600 text-white',
    'from-purple-500 to-indigo-600 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}

// Helper to calculate days in review
function getDaysInReview(dateStr) {
  if (!dateStr) return { text: 'Today', days: 0 };
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { text: 'Today', days: 0 };
  if (days === 1) return { text: '1 day in review', days: 1 };
  return { text: `${days} days in review`, days };
}

// ── Main AdminReportsPage ─────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalResults: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & View State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Interactive Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolveModalReport, setResolveModalReport] = useState(null);
  const [resolutionInput, setResolutionInput] = useState('');
  const [assignModalReport, setAssignModalReport] = useState(null);
  const [reviewerInput, setReviewerInput] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Reports
  const fetchReports = useCallback(async (opts = {}) => {
    const isRefresh = opts.refresh;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        page: opts.page ?? page,
        limit: 10,
        sortBy: opts.sortBy ?? sortBy,
        sortOrder: 'desc',
      });
      const activeStatus = opts.status !== undefined ? opts.status : statusFilter;
      const activePriority = opts.priority !== undefined ? opts.priority : priorityFilter;
      const activeSearch = opts.search !== undefined ? opts.search : search;

      if (activeSearch) params.set('search', activeSearch);
      if (activeStatus) params.set('status', activeStatus);
      if (activePriority) params.set('priority', activePriority);

      const res = await api.get(`/admin/reports?${params}`);
      const { reports: list, pagination: pg, stats: st } = res.data.data;
      setReports(list);
      setPagination(pg);
      setStats(st);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle Filter Changes
  const handleStatusTab = (statusKey) => {
    setStatusFilter(statusKey);
    setPage(1);
    fetchReports({ status: statusKey, page: 1 });
  };

  const handlePrioritySelect = (prio) => {
    setPriorityFilter(prio);
    setPage(1);
    fetchReports({ priority: prio, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports({ page: 1 });
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setPage(1);
    fetchReports({ search: '', status: '', priority: '', page: 1 });
  };

  // Quick Action: Resolve Report
  const handleConfirmResolve = async () => {
    if (!resolveModalReport) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/reports/${resolveModalReport._id}`, {
        status: 'resolved',
        resolutionNotes: resolutionInput || 'Resolved and verified by platform administrator.',
      });
      toast.success(`Report "${resolveModalReport.title}" marked as resolved!`);
      setResolveModalReport(null);
      setResolutionInput('');
      fetchReports({ refresh: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve report');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Action: Assign Reviewer
  const handleConfirmAssign = async () => {
    if (!assignModalReport || !reviewerInput) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/reports/${assignModalReport._id}`, {
        reviewerName: reviewerInput,
        status: assignModalReport.status === 'pending' ? 'under_review' : assignModalReport.status,
      });
      toast.success(`Assigned ${reviewerInput} to report!`);
      setAssignModalReport(null);
      setReviewerInput('');
      fetchReports({ refresh: true });
    } catch (err) {
      toast.error('Failed to assign reviewer');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── 1. Header & Quick Switcher ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Review Workspace
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Enterprise moderation center for critical audits, compliance checks & platform disputes
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Grid size={14} />
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <List size={14} />
              Table
            </button>
          </div>

          <button
            onClick={() => fetchReports({ refresh: true })}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-indigo-600' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── 2. Review Overview Header (4 Glassmorphism Stat Cards) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Under Review */}
        <div
          onClick={() => handleStatusTab('under_review')}
          className={cn(
            'group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md',
            statusFilter === 'under_review'
              ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-white to-blue-50/40 dark:from-indigo-950/50 dark:via-slate-900 dark:to-slate-900'
              : 'border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Under Review
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.underReview ?? 6}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Active Queue
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Cases currently assigned to lead reviewers
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Filter view</span>
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Critical Cases */}
        <div
          onClick={() => { setPriorityFilter('critical'); setPage(1); }}
          className={cn(
            'group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md',
            priorityFilter === 'critical'
              ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-gradient-to-br from-rose-500/10 via-white to-red-50/40 dark:from-rose-950/50 dark:via-slate-900 dark:to-slate-900'
              : 'border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 hover:border-rose-400 dark:hover:border-rose-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/5'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Critical Cases
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {stats?.criticalCases ?? 1}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Urgent
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Immediate attention needed for security & escrow
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <span>Filter critical</span>
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: High Priority */}
        <div
          onClick={() => { setPriorityFilter('high'); setPage(1); }}
          className={cn(
            'group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md',
            priorityFilter === 'high'
              ? 'border-orange-500/80 ring-2 ring-orange-500/20 bg-gradient-to-br from-orange-500/10 via-white to-amber-50/40 dark:from-orange-950/50 dark:via-slate-900 dark:to-slate-900'
              : 'border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 hover:border-orange-400 dark:hover:border-orange-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              High Priority
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <Flame size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.highPriority ?? 3}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Escalated
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Contract compliance & payment disputes
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
            <span>Filter high</span>
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Avg Review Time */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Avg Review Time
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats?.avgReviewTime ?? '1.8 days'}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp size={12} />
              Fast Turnaround
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Standard SLA threshold is &lt; 3.0 days
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>98.4% within SLA</span>
          </div>
        </div>
      </div>

      {/* ── 3. Filter Tabs & Search Bar ───────────────────────────────────── */}
      <div className="space-y-4">
        {/* Status Pills Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: '', label: 'All Reports', count: stats?.totalReports ?? 28 },
              { id: 'under_review', label: 'Under Review', count: stats?.underReview ?? 6, emoji: '🟡' },
              { id: 'pending', label: 'Pending', count: stats?.pending ?? 8, emoji: '🔴' },
              { id: 'resolved', label: 'Resolved', count: stats?.resolved ?? 14, emoji: '🟢' },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleStatusTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {tab.emoji && <span>{tab.emoji}</span>}
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-extrabold',
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {(statusFilter || priorityFilter || search) && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <Card className="p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-[240px] relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports, projects, submitters, reviewers..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); fetchReports({ search: '' }); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => handlePrioritySelect(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
                fetchReports({ sortBy: e.target.value, page: 1 });
              }}
              className="px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="submittedAt">Sort: Date Submitted</option>
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-indigo-600 dark:hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Filter size={13} />
              Apply
            </button>
          </form>
        </Card>
      </div>

      {/* ── 4. Main Reports Display ───────────────────────────────────────── */}
      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        /* ── 10. Beautiful Empty State ─────────────────────────────────────── */
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No reports under review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {search || priorityFilter || statusFilter
                ? 'No reports match your current filter parameters. Try clearing your filters.'
                : 'All submitted cases have been successfully reviewed and resolved.'}
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ── 2. Premium 2-Column Wide Cards Grid ──────────────────────────── */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {reports.map((report, idx) => {
              const prio = PRIORITY_META[report.priority] || PRIORITY_META.medium;
              const stat = STATUS_META[report.status] || STATUS_META.under_review;
              const projectMeta = PROJECT_META[report.project] || {
                icon: Layers,
                emoji: '📁',
                badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              };
              const submitterName = report.submittedBy?.name || report.submittedByName || 'Platform User';
              const reviewerName = report.reviewer?.name || report.reviewerName;
              const reviewerRole = REVIEWER_ROLES[reviewerName] || (reviewerName ? 'Senior Platform Reviewer' : 'Unassigned');
              const timeInReview = getDaysInReview(report.submittedAt);
              const isUrgent = report.priority === 'critical' && timeInReview.days >= 2;

              return (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    'group relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 md:p-6 transition-all duration-300 flex flex-col justify-between border-l-[6px]',
                    prio.cardBorder,
                    'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-indigo-950/30'
                  )}
                >
                  <div>
                    {/* Top Row: Priority Badge & Project Chip on left | Status Pill & Menu on right */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Priority Badge */}
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider', prio.badge)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', prio.dot)} />
                          {prio.label}
                        </span>

                        {/* Project Chip */}
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', projectMeta.badgeClass)}>
                          <span>{projectMeta.emoji}</span>
                          <span className="truncate max-w-[160px]">{report.project || 'General Platform'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Animated Status Pill */}
                        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all', stat.pill)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', stat.dot)} />
                          {stat.label}
                        </span>

                        {/* Quick Action Dropdown Menu Trigger */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === report._id ? null : report._id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === report._id && (
                            <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 text-xs font-medium text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95">
                              <button
                                onClick={() => { setSelectedReport(report); setActiveMenuId(null); }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                              >
                                <Eye size={13} className="text-indigo-500" />
                                View Full Report
                              </button>
                              <button
                                onClick={() => { setAssignModalReport(report); setReviewerInput(reviewerName || ''); setActiveMenuId(null); }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                              >
                                <UserPlus size={13} className="text-blue-500" />
                                Assign Reviewer
                              </button>
                              <button
                                onClick={() => { setResolveModalReport(report); setActiveMenuId(null); }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                              >
                                <CheckCircle2 size={13} />
                                Mark as Resolved
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Report Title */}
                    <h3
                      onClick={() => setSelectedReport(report)}
                      className="text-base md:text-lg font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                    >
                      {report.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {report.description || 'No detailed issue description provided for this report.'}
                    </p>

                    {/* If Resolved: Resolution Note Highlight */}
                    {report.status === 'resolved' && (report.resolutionNotes || report.notes) && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="line-clamp-1 font-medium">
                          <span className="font-bold">Resolution:</span> {report.resolutionNotes || report.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── 5. Reviewer & Submitter Block ───────────────────────── */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      {/* Submitter Info */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                          {getInitials(submitterName)}
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                            Submitted By
                          </p>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                            {submitterName}
                          </p>
                        </div>
                      </div>

                      {/* Reviewer Avatar Block */}
                      <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full bg-gradient-to-tr flex items-center justify-center text-[11px] font-black shadow-sm',
                            getAvatarColor(reviewerName || 'Admin')
                          )}
                        >
                          {getInitials(reviewerName || 'Admin')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {reviewerName || 'Unassigned'}
                            </span>
                            <span className="text-[10px]">🛡️</span>
                          </div>
                          <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-[140px]">
                            {reviewerRole}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Metadata Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{formatDate(report.submittedAt)}</span>
                      </div>

                      {/* Timeline: Time in Review */}
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span
                          className={cn(
                            'font-semibold',
                            isUrgent ? 'text-rose-600 dark:text-rose-400 animate-pulse font-bold' : 'text-slate-600 dark:text-slate-300'
                          )}
                        >
                          ⏱️ {timeInReview.text}
                        </span>
                      </div>
                    </div>

                    {/* ── 8. Quick Actions Hover Bar ────────────────────────── */}
                    <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                      >
                        <Eye size={13} />
                        View Report
                      </button>

                      <button
                        onClick={() => { setAssignModalReport(report); setReviewerInput(reviewerName || ''); }}
                        className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <UserPlus size={13} />
                        Assign
                      </button>

                      {report.status !== 'resolved' && (
                        <button
                          onClick={() => setResolveModalReport(report)}
                          className="py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60"
                        >
                          <CheckCircle2 size={13} />
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* ── Table View (for power users) ─────────────────────────────────── */
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
            <span>Report</span>
            <span>Project</span>
            <span>Reviewer</span>
            <span>Submitter</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((report) => {
              const prio = PRIORITY_META[report.priority] || PRIORITY_META.medium;
              const stat = STATUS_META[report.status] || STATUS_META.under_review;
              const reviewerName = report.reviewer?.name || report.reviewerName;

              return (
                <div
                  key={report._id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {report.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {report.description}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {report.project || 'General'}
                  </div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                    {reviewerName || 'Unassigned'}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {report.submittedByName || 'User'}
                  </div>
                  <div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', prio.badge)}>
                      {prio.label}
                    </span>
                  </div>
                  <div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border', stat.pill)}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye size={14} />
                    </button>
                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => setResolveModalReport(report)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── 9. Pagination ─────────────────────────────────────────────────── */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500">
            Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.currentPage}</span> of{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.totalPages}</span> &middot;{' '}
            {pagination.totalResults} total reports
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { const p = page - 1; setPage(p); fetchReports({ page: p }); }}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => { const p = page + 1; setPage(p); fetchReports({ page: p }); }}
              disabled={page >= pagination.totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Interactive Modal 1: View Full Report Details ─────────────────── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase', PRIORITY_META[selectedReport.priority]?.badge)}>
                    {PRIORITY_META[selectedReport.priority]?.label}
                  </span>
                  <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border', STATUS_META[selectedReport.status]?.pill)}>
                    {STATUS_META[selectedReport.status]?.label}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedReport.title}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  Project: {selectedReport.project || 'General Platform'}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Full Description
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            {/* Submitter & Reviewer Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Submitted By
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedReport.submittedBy?.name || selectedReport.submittedByName || 'User'}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDate(selectedReport.submittedAt)}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Assigned Reviewer
                </span>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedReport.reviewer?.name || selectedReport.reviewerName || 'Unassigned'}
                </p>
                <p className="text-xs text-slate-400">
                  {REVIEWER_ROLES[selectedReport.reviewer?.name || selectedReport.reviewerName] || 'Lead Reviewer'}
                </p>
              </div>
            </div>

            {/* Resolution Note if available */}
            {(selectedReport.resolutionNotes || selectedReport.notes) && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Resolution & Remediation Notes
                </span>
                <p className="text-sm text-emerald-900 dark:text-emerald-200">
                  {selectedReport.resolutionNotes || selectedReport.notes}
                </p>
              </div>
            )}

            {/* Actions in Modal */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              {selectedReport.status !== 'resolved' && (
                <button
                  onClick={() => {
                    const r = selectedReport;
                    setSelectedReport(null);
                    setResolveModalReport(r);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Interactive Modal 2: Mark as Resolved ─────────────────────────── */}
      {resolveModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Resolve Report
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px]">
                  {resolveModalReport.title}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resolution Notes & Fix Summary
              </label>
              <textarea
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="Explain how this issue was remediated, patches deployed, or audit conclusions..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolveModalReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmResolve}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Check size={14} />
                {actionLoading ? 'Saving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Interactive Modal 3: Assign Reviewer ──────────────────────────── */}
      {assignModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Assign Reviewer
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px]">
                  {assignModalReport.title}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Lead Reviewer
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {Object.keys(REVIEWER_ROLES).map((reviewer) => (
                  <button
                    key={reviewer}
                    type="button"
                    onClick={() => setReviewerInput(reviewer)}
                    className={cn(
                      'w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all',
                      reviewerInput === reviewer
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                    )}
                  >
                    <div>
                      <p className="font-bold">{reviewer}</p>
                      <p className="text-[10px] text-slate-400">{REVIEWER_ROLES[reviewer]}</p>
                    </div>
                    {reviewerInput === reviewer && <Check size={14} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !reviewerInput}
                onClick={handleConfirmAssign}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                {actionLoading ? 'Assigning...' : 'Assign Reviewer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
