import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, CheckCircle2, Clock, AlertTriangle, Search, Filter,
  RefreshCw, ChevronLeft, ChevronRight, MoreVertical, Eye, Download,
  Plus, Check, X, ExternalLink, Calendar, DollarSign, Layers,
  FileText, LayoutGrid, LayoutList, Lock, Unlock, Star, ShieldCheck,
  Building, ArrowUpRight, Trash2, Archive, Sparkles, Send,
  UserCheck, AlertCircle, MapPin, Tag, Smartphone, Globe, Code, Cpu
} from 'lucide-react';
import api from '@/services/api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Skeleton from '@/components/common/Skeleton';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { buildAndExportPDF, PDF_COLORS, renderLogoSvg } from '@/utils/pdf/pdfEngine';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

// ── Category and Status Badges Configuration ──────────────────────────────────
const STATUS_CONFIG = {
  open: {
    label: 'Active',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
    dot: 'bg-emerald-500',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] border-blue-200 dark:border-blue-800/40',
    dot: 'bg-[#0A84FF]',
  },
  completed: {
    label: 'Completed',
    color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
    dot: 'bg-indigo-500',
  },
  pending_review: {
    label: 'Pending',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
    dot: 'bg-amber-500',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40',
    dot: 'bg-rose-500',
  },
  cancelled: {
    label: 'Closed',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  archived: {
    label: 'Archived',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  draft: {
    label: 'Draft',
    color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    dot: 'bg-zinc-400',
  }
};

const CATEGORY_META = {
  'Web Development': { icon: Globe, color: 'text-[#0A84FF] bg-blue-50 dark:bg-blue-950/40' },
  'Mobile Development': { icon: Smartphone, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
  'UI/UX Design': { icon: Layers, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  'AI/ML': { icon: Cpu, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  'DevOps': { icon: Code, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
  'Content Writing': { icon: FileText, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  'Digital Marketing': { icon: Sparkles, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
};

export default function AdminJobsPage() {
  // State
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalJobs: 0, limit: 10 });
  const [counts, setCounts] = useState({ byCategory: {}, byStatus: {} });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all'); // 'all', 'under50k', '50k-100k', 'above100k'
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('admin_jobs_view') || 'table');

  // Drawer
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'status' | 'feature' | 'delete' | 'demo'
  const [targetJob, setTargetJob] = useState(null);
  const [newStatus, setNewStatus] = useState('open');
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(p => ({ ...p, currentPage: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Persist View Mode
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('admin_jobs_view', mode);
  };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/admin/jobs/stats');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin job stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Jobs
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        order: sortOrder,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentTypeFilter !== 'all') params.paymentType = paymentTypeFilter;

      if (budgetFilter === 'under50k') {
        params.maxBudget = 50000;
      } else if (budgetFilter === '50k-100k') {
        params.minBudget = 50000;
        params.maxBudget = 100000;
      } else if (budgetFilter === 'above100k') {
        params.minBudget = 100000;
      }

      const res = await api.get('/admin/jobs', { params });
      if (res.data?.data) {
        setJobs(res.data.data.jobs || []);
        setPagination(res.data.data.pagination || { currentPage: 1, totalPages: 1, totalJobs: 0, limit: 10 });
        setCounts({
          byCategory: res.data.data.countsByCategory || {},
          byStatus: res.data.data.countsByStatus || {},
        });
      }
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs from database');
      toast.error('Could not load jobs');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, debouncedSearch, categoryFilter, statusFilter, budgetFilter, paymentTypeFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Open Drawer & Load Details
  const handleOpenDrawer = async (job) => {
    setSelectedJob(job);
    setDrawerLoading(true);
    setDrawerData(null);
    try {
      const res = await api.get(`/admin/jobs/${job._id}/details`);
      if (res.data?.data) {
        setDrawerData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load job timeline');
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedJob(null);
    setDrawerData(null);
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setBudgetFilter('all');
    setPaymentTypeFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination(p => ({ ...p, currentPage: 1 }));
  };

  const hasActiveFilters = search || categoryFilter !== 'all' || statusFilter !== 'all' || budgetFilter !== 'all' || paymentTypeFilter !== 'all' || sortBy !== 'createdAt';

  // Moderation Handlers
  const handleStatusChange = async () => {
    if (!targetJob) return;
    try {
      setActionLoading(true);
      await api.patch(`/admin/jobs/${targetJob._id}/status`, {
        status: newStatus,
        reason: actionReason || `Admin transition to ${newStatus}`,
      });
      toast.success(`Job status changed to ${newStatus}`);
      setActiveModal(null);
      setTargetJob(null);
      setActionReason('');
      fetchJobs();
      fetchStats();
      if (selectedJob?._id === targetJob._id) {
        setSelectedJob(j => ({ ...j, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (job) => {
    try {
      const targetState = !job.isFeatured;
      await api.patch(`/admin/jobs/${job._id}/feature`, { isFeatured: targetState });
      toast.success(`Job marked as ${targetState ? 'Featured' : 'Standard'}`);
      fetchJobs();
      fetchStats();
      if (selectedJob?._id === job._id) {
        setSelectedJob(j => ({ ...j, isFeatured: targetState }));
      }
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const handleDeleteJob = async () => {
    if (!targetJob) return;
    try {
      setActionLoading(true);
      await api.delete(`/admin/jobs/${targetJob._id}`);
      toast.success('Job removed successfully');
      setActiveModal(null);
      setTargetJob(null);
      fetchJobs();
      fetchStats();
      if (selectedJob?._id === targetJob._id) {
        handleCloseDrawer();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateDemoJob = async () => {
    try {
      setActionLoading(true);
      await api.post('/admin/jobs/demo', {});
      toast.success('Realistic demo job created successfully');
      setActiveModal(null);
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create demo job');
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!jobs.length) {
      toast.error('No jobs to export');
      return;
    }
    const headers = ['Title', 'Client', 'Category', 'Budget (Min)', 'Budget (Max)', 'Proposals', 'Status', 'Featured', 'Created Date', 'Deadline'];
    const rows = jobs.map(j => [
      `"${(j.title || '').replace(/"/g, '""')}"`,
      `"${(j.client?.name || j.company || 'Client').replace(/"/g, '""')}"`,
      `"${j.category || 'General'}"`,
      j.budget?.min || 0,
      j.budget?.max || 0,
      j.proposalsCount || 0,
      j.status || 'open',
      j.isFeatured ? 'Yes' : 'No',
      `"${formatDate(j.createdAt)}"`,
      `"${formatDate(j.deadline)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workstation_jobs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!jobs.length) {
      toast.error('No jobs to export');
      return;
    }

    const toastId = toast.loading('Generating Job Registry PDF report...');
    try {
      const pageRows = jobs.slice(0, 15).map(j => `
        <tr style="border-bottom: 1px solid ${PDF_COLORS.slate200};">
          <td style="padding: 10px 8px; font-weight: 700; color: ${PDF_COLORS.slate900}; max-width: 180px;">${j.title}</td>
          <td style="padding: 10px 8px; color: ${PDF_COLORS.slate600};">${j.client?.name || j.company || 'Client'}</td>
          <td style="padding: 10px 8px; font-weight: 600; color: #2563EB;">${j.category}</td>
          <td style="padding: 10px 8px; text-transform: capitalize; font-weight: 600; color: ${j.status === 'open' ? '#16A34A' : j.status === 'suspended' ? '#DC2626' : '#2563EB'};">${j.status.replace('_', ' ')}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 700;">₹${(j.budget?.max || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px 8px; text-align: center; font-weight: 600;">${j.proposalsCount || 0}</td>
          <td style="padding: 10px 8px; text-align: right; color: ${PDF_COLORS.slate500};">${formatDate(j.createdAt)}</td>
        </tr>
      `).join('');

      const pageHtml = `
        <div>
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid ${PDF_COLORS.primary}; margin-bottom: 20px;">
            <div>
              ${renderLogoSvg(36)}
              <div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 6px;">
                <strong>WorkStation Marketplace</strong> • Enterprise Job Governance & Listing Report
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 22px; font-weight: 900; color: ${PDF_COLORS.primary};">JOB DIRECTORY</div>
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; margin-top: 4px;">Total Postings: ${pagination.totalJobs} • Generated: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <!-- Summary Strip -->
          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Total Postings</div>
              <div style="font-size: 18px; font-weight: 900; color: ${PDF_COLORS.primary};">${stats?.totalJobs || pagination.totalJobs}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Active Jobs</div>
              <div style="font-size: 18px; font-weight: 900; color: #16A34A;">${stats?.activeJobs || 0}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Proposals</div>
              <div style="font-size: 18px; font-weight: 900; color: #7C3AED;">${stats?.totalProposals || 0}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Marketplace Value</div>
              <div style="font-size: 18px; font-weight: 900; color: #2563EB;">₹${((stats?.totalMarketplaceValue || 0) / 100000).toFixed(1)}L</div>
            </div>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <thead>
              <tr style="background: ${PDF_COLORS.slate100}; border-bottom: 2px solid ${PDF_COLORS.slate300 || '#CBD5E1'};">
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">JOB TITLE</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">CLIENT</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">CATEGORY</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">STATUS</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">BUDGET</th>
                <th style="padding: 8px; text-align: center; font-weight: 800; color: ${PDF_COLORS.slate700};">BIDS</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">POSTED</th>
              </tr>
            </thead>
            <tbody>
              ${pageRows}
            </tbody>
          </table>
        </div>
      `;

      await buildAndExportPDF({
        pagesHtml: [pageHtml],
        fileName: `WorkStation-Job-Registry-${Date.now()}`
      });

      toast.success('Job report generated successfully', { id: toastId });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF report', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111C38] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#0A84FF] to-[#2FA8FF] flex items-center justify-center text-white shadow-md shadow-[#0A84FF]/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Job Management
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Monitor every job posted across the marketplace and moderate listings efficiently.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title="Export filtered records to CSV"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title="Export print-ready PDF directory"
            >
              <FileText className="h-4 w-4 text-[#0A84FF]" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => { fetchJobs(); fetchStats(); toast.success('Data refreshed'); }}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title="Refresh database records"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin text-[#0A84FF]')} />
            </button>

            <button
              onClick={() => setActiveModal('demo')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0A84FF] to-[#0066CC] hover:from-[#0070E0] hover:to-[#0052A3] rounded-xl shadow-sm shadow-[#0A84FF]/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Demo Job</span>
            </button>
          </div>
        </div>

        {/* ── 6 Analytics KPI Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Jobs */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Jobs</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.totalJobs || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{stats?.newThisMonth || 0}</span> this month
              </div>
            </div>
          </div>

          {/* Card 2: Active Jobs */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Jobs</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.activeJobs || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Accepting proposals
              </div>
            </div>
          </div>

          {/* Card 3: Completed Jobs */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.completedJobs || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Delivered & settled
              </div>
            </div>
          </div>

          {/* Card 4: Pending / Suspended */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Review Queue</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.pendingReview || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                Needs moderation
              </div>
            </div>
          </div>

          {/* Card 5: Total Proposals */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Proposals</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <Send className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.totalProposals || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Freelancer bids submitted
              </div>
            </div>
          </div>

          {/* Card 6: Total Marketplace Value */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Market Value</span>
              <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-[#0A84FF] flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  ₹{((stats?.totalMarketplaceValue || 0) / 100000).toFixed(1)}L
                </div>
              )}
              <div className="text-xs text-[#0A84FF] mt-1 font-semibold">
                Avg ₹{Math.round((stats?.avgBudget || 0) / 1000)}k / project
              </div>
            </div>
          </div>
        </div>

        {/* ── Search & Multi-Filter Control Bar ─────────────────────────────── */}
        <div className="bg-white dark:bg-[#111C38] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title, skills, category, or client enterprise..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40 focus:border-[#0A84FF] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleViewChange('table')}
                  className={cn(
                    'p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                    viewMode === 'table'
                      ? 'bg-white dark:bg-[#111C38] text-[#0A84FF] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  title="Table View"
                >
                  <LayoutList className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => handleViewChange('grid')}
                  className={cn(
                    'p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#111C38] text-[#0A84FF] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  title="Card Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="all">All Categories ({counts.byCategory.all || 0})</option>
                <option value="Web Development">Web Development ({counts.byCategory['Web Development'] || 0})</option>
                <option value="Mobile Development">Mobile Development ({counts.byCategory['Mobile Development'] || 0})</option>
                <option value="UI/UX Design">UI/UX Design ({counts.byCategory['UI/UX Design'] || 0})</option>
                <option value="AI/ML">AI / ML ({counts.byCategory['AI/ML'] || counts.byCategory['AI & ML'] || 0})</option>
                <option value="DevOps">DevOps ({counts.byCategory['DevOps'] || 0})</option>
                <option value="Content Writing">Content Writing ({counts.byCategory['Content Writing'] || 0})</option>
                <option value="Digital Marketing">Digital Marketing ({counts.byCategory['Digital Marketing'] || 0})</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="all">All Statuses ({counts.byStatus.all || 0})</option>
                <option value="open">Active / Open ({counts.byStatus.open || 0})</option>
                <option value="in_progress">In Progress ({counts.byStatus.in_progress || 0})</option>
                <option value="completed">Completed ({counts.byStatus.completed || 0})</option>
                <option value="pending_review">Pending Review ({counts.byStatus.pending_review || 0})</option>
                <option value="suspended">Suspended ({counts.byStatus.suspended || 0})</option>
                <option value="cancelled">Closed / Cancelled ({counts.byStatus.cancelled || 0})</option>
              </select>
            </div>

            {/* Budget Range Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Budget:</span>
              <select
                value={budgetFilter}
                onChange={(e) => { setBudgetFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="all">Any Budget</option>
                <option value="under50k">Under ₹50,000</option>
                <option value="50k-100k">₹50,000 – ₹1,00,000</option>
                <option value="above100k">Above ₹1,00,000</option>
              </select>
            </div>

            {/* Payment Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Type:</span>
              <select
                value={paymentTypeFilter}
                onChange={(e) => { setPaymentTypeFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="all">All Types</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="createdAt">Date Posted</option>
                <option value="budget">Budget Size</option>
                <option value="proposalsCount">Proposals Count</option>
                <option value="title">Job Title</option>
                <option value="deadline">Deadline</option>
              </select>
              <button
                onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                title={`Sort: ${sortOrder.toUpperCase()}`}
              >
                <ArrowUpRight className={cn('h-3.5 w-3.5 transition-transform', sortOrder === 'desc' ? 'rotate-90' : '-rotate-45')} />
              </button>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#0A84FF] hover:underline px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── Table / Grid View Content ────────────────────────────────────── */}
        {loading ? (
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-64 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to fetch jobs</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => fetchJobs()}
              className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs match your filters</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {hasActiveFilters ? 'Try adjusting or clearing your active search keyword and filters.' : 'No jobs have been posted to the marketplace yet.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#0A84FF] bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-xl transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : viewMode === 'table' ? (
          /* Desktop Table View */
          <div className="bg-white dark:bg-[#111C38] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Job Title</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Budget</th>
                    <th className="py-3.5 px-4">Proposals</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Posted</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {jobs.map((job) => {
                    const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.open;
                    const catMeta = CATEGORY_META[job.category] || { icon: Briefcase, color: 'text-slate-600 bg-slate-100' };
                    const CategoryIcon = catMeta.icon;

                    return (
                      <tr
                        key={job._id}
                        onClick={() => handleOpenDrawer(job)}
                        className="group hover:bg-[#F8FBFF] dark:hover:bg-[#152347]/60 cursor-pointer transition-colors"
                      >
                        {/* Title & Preview Column */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-3">
                            <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', catMeta.color)}>
                              <CategoryIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors">
                                <span className="truncate">{job.title}</span>
                                {job.isFeatured && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 flex-shrink-0">
                                    ★ Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {job.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                <span>{job.experienceLevel}</span>
                                <span>•</span>
                                <span>{job.locationType}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Client Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              src={job.client?.avatar}
                              name={job.client?.name || job.company || 'Client'}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                                <span className="truncate">{job.client?.name || job.company || 'Enterprise Client'}</span>
                                {job.client?.verified && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0A84FF] flex-shrink-0" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {job.client?.location ? job.client.location.split(',')[0] : 'Remote Client'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category Column */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {job.category}
                          </span>
                        </td>

                        {/* Budget Column */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(job.budget?.max || job.budget?.min || 0)}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {job.budget?.type || 'fixed'}
                          </div>
                        </td>

                        {/* Proposals Column */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">
                            <Send className="h-3 w-3" />
                            <span>{job.proposalsCount || 0} bids</span>
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 px-4">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusCfg.color)}>
                            <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Date Posted */}
                        <td className="py-3.5 px-4">
                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            {formatDate(job.createdAt)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Due {formatDate(job.deadline)}
                          </div>
                        </td>

                        {/* Row Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenDrawer(job)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Inspect Job Drawer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleToggleFeatured(job)}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                job.isFeatured ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:text-amber-500'
                              )}
                              title={job.isFeatured ? 'Remove Featured' : 'Mark Featured'}
                            >
                              <Star className="h-4 w-4 fill-current" />
                            </button>

                            <button
                              onClick={() => { setTargetJob(job); setNewStatus(job.status); setActiveModal('status'); }}
                              className="p-1.5 text-slate-400 hover:text-[#0A84FF] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Moderate Status"
                            >
                              <Lock className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => { setTargetJob(job); setActiveModal('delete'); }}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Delete Job"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.open;
              const catMeta = CATEGORY_META[job.category] || { icon: Briefcase, color: 'text-slate-600 bg-slate-100' };
              const CategoryIcon = catMeta.icon;

              return (
                <div
                  key={job._id}
                  onClick={() => handleOpenDrawer(job)}
                  className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0', catMeta.color)}>
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
                            {job.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{job.locationType}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusCfg.color)}>
                          {statusCfg.label}
                        </span>
                        {job.isFeatured && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors line-clamp-2 leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Financials & Bids strip */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatCurrency(job.budget?.max || job.budget?.min || 0)}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">
                          {job.budget?.type || 'fixed'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          {job.proposalsCount || 0}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Bids Submitted</div>
                      </div>
                    </div>

                    {/* Footer Client Attribution & Actions */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2 truncate">
                        <Avatar
                          src={job.client?.avatar}
                          name={job.client?.name || job.company || 'Client'}
                          size="xs"
                        />
                        <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                          {job.client?.name || job.company || 'Enterprise'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFeatured(job)}
                          className={cn('p-1 rounded', job.isFeatured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500')}
                          title="Toggle Featured"
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => { setTargetJob(job); setNewStatus(job.status); setActiveModal('status'); }}
                          className="p-1 text-slate-400 hover:text-[#0A84FF] rounded"
                          title="Change Status"
                        >
                          <Lock className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDrawer(job)}
                          className="p-1 text-slate-400 hover:text-[#0A84FF] rounded"
                          title="View Details"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Server-Side Pagination Controls ─────────────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111C38] px-5 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-sm">
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Showing page <strong className="text-slate-900 dark:text-white">{pagination.currentPage}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{pagination.totalPages}</strong> ({pagination.totalJobs} total jobs)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1 px-2">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === pagination.currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(p => ({ ...p, currentPage: pageNum }))}
                      className={cn(
                        'h-8 w-8 rounded-lg text-xs font-bold transition-all',
                        isActive
                          ? 'bg-[#0A84FF] text-white shadow-sm shadow-[#0A84FF]/25'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Slide-Out Job Detail Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedJob && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-[#111C38] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col"
            >
              {/* Drawer Sticky Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#111C38]/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Intelligence Dossier</span>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 text-xs">
                {/* Job Title & Badges */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border', (STATUS_CONFIG[selectedJob.status] || STATUS_CONFIG.open).color)}>
                      {selectedJob.status.replace('_', ' ')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] border border-blue-200 dark:border-blue-800/50">
                      {selectedJob.category}
                    </span>
                    {selectedJob.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200">
                        ★ Featured Listing
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedJob.title}
                  </h2>
                </div>

                {/* Financial Summary Strip */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <div>
                    <div className="text-slate-400 font-medium">Maximum Budget</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatCurrency(selectedJob.budget?.max || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Payment Type</div>
                    <div className="text-base font-bold text-[#0A84FF] mt-0.5 capitalize">
                      {selectedJob.budget?.type || 'fixed'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Bids Received</div>
                    <div className="text-base font-bold text-purple-600 mt-0.5">
                      {selectedJob.proposalsCount || 0}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="font-bold uppercase tracking-wider text-slate-400 mb-2">Description</div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedJob.description}
                  </div>
                </div>

                {/* Skills & Deliverables */}
                {Array.isArray(selectedJob.skillsRequired) && selectedJob.skillsRequired.length > 0 && (
                  <div>
                    <div className="font-bold uppercase tracking-wider text-slate-400 mb-2">Required Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skillsRequired.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Dossier Card */}
                <div>
                  <div className="font-bold uppercase tracking-wider text-slate-400 mb-2">Posting Client</div>
                  <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <Avatar
                      src={selectedJob.client?.avatar}
                      name={selectedJob.client?.name || selectedJob.company || 'Client'}
                      size="dashboard"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                        <span>{selectedJob.client?.name || selectedJob.company || 'Enterprise Client'}</span>
                        {selectedJob.client?.verified && (
                          <CheckCircle2 className="h-4 w-4 text-[#0A84FF]" />
                        )}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5">{selectedJob.client?.email}</div>
                      <div className="text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedJob.client?.location || 'India'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Async Data: Top 5 Proposals Preview */}
                {drawerLoading ? (
                  <div className="space-y-3 py-3">
                    <Skeleton className="h-5 w-40 rounded" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                        <span>Top Proposals Preview ({drawerData?.proposals?.length || 0})</span>
                      </div>
                      {drawerData?.proposals?.length > 0 ? (
                        <div className="space-y-2.5">
                          {drawerData.proposals.map((p) => (
                            <div key={p._id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Avatar
                                    src={p.freelancer?.avatar}
                                    name={p.freelancer?.name || 'Freelancer'}
                                    size="xs"
                                  />
                                  <div className="font-bold text-slate-900 dark:text-white truncate">
                                    {p.freelancer?.name || 'Proposer'}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.bidAmount)}</span>
                                  <span className="text-[10px] text-slate-400 block font-medium">in {p.deliveryTime} days</span>
                                </div>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                                "{p.coverLetter}"
                              </p>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <span className="capitalize font-semibold text-purple-600">{p.status}</span>
                                <span>{formatDate(p.createdAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No freelancer proposals submitted for this job yet.</p>
                      )}
                    </div>

                    {/* Linked Contract if Hired */}
                    {drawerData?.contract && (
                      <div>
                        <div className="font-bold uppercase tracking-wider text-slate-400 mb-2">Active Contract</div>
                        <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">Contract In Progress</span>
                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(drawerData.contract.totalAmount)}</span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-300">
                            Freelancer: <strong>{drawerData.contract.freelancer?.name}</strong> • Escrow: <strong>{drawerData.contract.escrowStatus}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Moderation Audit Logs */}
                    {drawerData?.auditLogs?.length > 0 && (
                      <div>
                        <div className="font-bold uppercase tracking-wider text-slate-400 mb-2">Moderation Audit Logs</div>
                        <div className="space-y-2">
                          {drawerData.auditLogs.map((log) => (
                            <div key={log._id} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                              <div className="flex items-center justify-between font-semibold">
                                <span className="capitalize text-slate-800 dark:text-slate-200">{log.action.replace('_', ' ')}</span>
                                <span className="text-[11px] text-slate-400">{formatDate(log.createdAt)}</span>
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                By {log.adminName} • {log.notes || 'Admin action'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Drawer Footer Moderation Bar */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => { setTargetJob(selectedJob); setNewStatus(selectedJob.status === 'open' ? 'suspended' : 'open'); setActiveModal('status'); }}
                  className={cn(
                    'flex-1 py-2.5 px-3 rounded-xl font-bold transition-all text-white',
                    selectedJob.status === 'open' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  )}
                >
                  {selectedJob.status === 'open' ? 'Suspend Job' : 'Approve & Open'}
                </button>

                <button
                  onClick={() => handleToggleFeatured(selectedJob)}
                  className="py-2.5 px-3 rounded-xl font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                >
                  {selectedJob.isFeatured ? 'Unfeature' : 'Mark Featured'}
                </button>

                <button
                  onClick={() => { setTargetJob(selectedJob); setActiveModal('delete'); }}
                  className="py-2.5 px-3 rounded-xl font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                >
                  Soft Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Status Moderation Confirmation Modal ──────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'status' && targetJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0A84FF] flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Moderate Job Status</h3>
                  <p className="text-slate-500 truncate max-w-xs">{targetJob.title}</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                >
                  <option value="open">Active / Open (Publicly visible, accepting bids)</option>
                  <option value="suspended">Suspended (Hidden from search, bids blocked)</option>
                  <option value="cancelled">Closed / Cancelled</option>
                  <option value="archived">Archived</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason / Moderation Notes</label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Verified compliance with project terms"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => { setActiveModal(null); setTargetJob(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleStatusChange}
                  className="px-4 py-2 font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all"
                >
                  {actionLoading ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Soft Delete Confirmation Modal ────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'delete' && targetJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Delete Job Listing</h3>
                  <p className="text-slate-500 truncate max-w-xs">{targetJob.title}</p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                Soft-deleting this job will immediately remove it from public search and category indexes while preserving historical bids, proposals, and audit records.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => { setActiveModal(null); setTargetJob(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleDeleteJob}
                  className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
                >
                  {actionLoading ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Demo Job Creation Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'demo' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0A84FF] flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Generate Demo Job</h3>
                  <p className="text-slate-500">Adds an active enterprise project with realistic requirements</p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                This will automatically create an active, featured "Full-Stack Next.js & Node Platform Development" project attributed to an existing demo client in the database.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleCreateDemoJob}
                  className="px-4 py-2 font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all"
                >
                  {actionLoading ? 'Generating...' : 'Create Listing'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
