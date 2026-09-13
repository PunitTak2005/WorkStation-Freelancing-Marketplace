import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, UserX, Shield, ShieldAlert, ShieldCheck,
  Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  MoreVertical, Eye, Download, Plus, Check, X,
  ExternalLink, Mail, Phone, MapPin, Calendar, Clock,
  DollarSign, Briefcase, Star, AlertTriangle, ArrowUpDown,
  FileText, LayoutGrid, LayoutList, Lock, Unlock, UserPlus,
  BadgeCheck, Sparkles, Building, ArrowUpRight
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

// ── Role and Status Configurations ───────────────────────────────────────────
const ROLE_BADGES = {
  client: {
    label: 'Client',
    color: 'bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] border-blue-200 dark:border-blue-800/40',
    dot: 'bg-[#0A84FF]',
  },
  freelancer: {
    label: 'Freelancer',
    color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
    dot: 'bg-purple-500',
  },
  admin: {
    label: 'Admin',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
    dot: 'bg-amber-500',
  },
};

const STATUS_BADGES = {
  active: {
    label: 'Active',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
    dot: 'bg-emerald-500',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40',
    dot: 'bg-rose-500',
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
    dot: 'bg-amber-500',
  },
  deleted: {
    label: 'Deleted',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  }
};

export default function AdminUsersPage() {
  // State
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0, limit: 10 });
  const [counts, setCounts] = useState({ byRole: {}, byStatus: {}, byVerification: {} });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Controls
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('admin_users_view') || 'table');
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  // Action Modals
  const [activeModal, setActiveModal] = useState(null); // 'status' | 'verify' | 'role' | 'delete' | 'create'
  const [targetUser, setTargetUser] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [newRole, setNewRole] = useState('freelancer');
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
    location: 'Bengaluru, Karnataka, India',
    phone: '',
    bio: '',
    hourlyRate: '',
    verified: false,
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(p => ({ ...p, currentPage: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Persist view mode
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('admin_users_view', mode);
  };

  // Fetch KPI Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/admin/users/stats');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
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
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (verifiedFilter !== 'all') params.verified = verifiedFilter;

      const res = await api.get('/admin/users', { params });
      if (res.data?.data) {
        setUsers(res.data.data.users || []);
        setPagination(res.data.data.pagination || { currentPage: 1, totalPages: 1, totalUsers: 0, limit: 10 });
        setCounts({
          byRole: res.data.data.countsByRole || {},
          byStatus: res.data.data.countsByStatus || {},
          byVerification: res.data.data.countsByVerification || {},
        });
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.message || 'Failed to load users from database');
      toast.error('Could not load user records');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, debouncedSearch, roleFilter, statusFilter, verifiedFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open User Drawer & Fetch Details
  const handleOpenDrawer = async (user) => {
    setSelectedUser(user);
    setDrawerLoading(true);
    setDrawerData(null);
    try {
      const res = await api.get(`/admin/users/${user._id}/details`);
      if (res.data?.data) {
        setDrawerData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load detailed user timeline');
    } finally {
      setDrawerLoading(false);
    }
  };

  // Close User Drawer
  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setDrawerData(null);
  };

  // Clear Filters
  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
    setVerifiedFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination(p => ({ ...p, currentPage: 1 }));
  };

  const hasActiveFilters = search || roleFilter !== 'all' || statusFilter !== 'all' || verifiedFilter !== 'all' || sortBy !== 'createdAt';

  // Quick Action Handlers
  const handleStatusToggle = async () => {
    if (!targetUser) return;
    const newStatus = targetUser.status === 'suspended' ? 'active' : 'suspended';
    try {
      setActionLoading(true);
      await api.patch(`/admin/users/${targetUser._id}/status`, {
        status: newStatus,
        reason: actionReason || `Admin account transition to ${newStatus}`,
      });
      toast.success(`User successfully ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
      setActiveModal(null);
      setTargetUser(null);
      setActionReason('');
      fetchUsers();
      fetchStats();
      if (selectedUser?._id === targetUser._id) {
        setSelectedUser(u => ({ ...u, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    if (!targetUser) return;
    const targetVerified = !targetUser.verified;
    try {
      setActionLoading(true);
      await api.patch(`/admin/users/${targetUser._id}/verify`, { verified: targetVerified });
      toast.success(`User ${targetVerified ? 'verified' : 'unverified'} successfully`);
      setActiveModal(null);
      setTargetUser(null);
      fetchUsers();
      fetchStats();
      if (selectedUser?._id === targetUser._id) {
        setSelectedUser(u => ({ ...u, verified: targetVerified }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update verification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!targetUser) return;
    try {
      setActionLoading(true);
      await api.patch(`/admin/users/${targetUser._id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setActiveModal(null);
      setTargetUser(null);
      fetchUsers();
      fetchStats();
      if (selectedUser?._id === targetUser._id) {
        setSelectedUser(u => ({ ...u, role: newRole }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRestore = async () => {
    if (!targetUser) return;
    try {
      setActionLoading(true);
      if (targetUser.isDeleted) {
        await api.patch(`/admin/users/${targetUser._id}/restore`);
        toast.success('User account restored successfully');
      } else {
        await api.delete(`/admin/users/${targetUser._id}`);
        toast.success('User account soft deleted');
      }
      setActiveModal(null);
      setTargetUser(null);
      fetchUsers();
      fetchStats();
      if (selectedUser?._id === targetUser._id) {
        handleCloseDrawer();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to modify deletion state');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.post('/admin/users', newUserForm);
      toast.success('New user account created successfully');
      setActiveModal(null);
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        role: 'freelancer',
        location: 'Bengaluru, Karnataka, India',
        phone: '',
        bio: '',
        hourlyRate: '',
        verified: false,
      });
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user account');
    } finally {
      setActionLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!users.length) {
      toast.error('No users available to export');
      return;
    }
    const headers = ['Name', 'Email', 'Role', 'Status', 'Verified', 'Location', 'Earnings (INR)', 'Total Spent (INR)', 'Completed Projects', 'Joined Date', 'Last Active'];
    const rows = users.map(u => [
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      u.role || 'freelancer',
      u.status || 'active',
      u.verified ? 'Yes' : 'No',
      `"${u.location || ''}"`,
      u.earnings || 0,
      u.totalSpent || 0,
      u.completedProjectsCount || 0,
      `"${formatDate(u.createdAt)}"`,
      `"${formatDate(u.lastActive)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workstation_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (!users.length) {
      toast.error('No users available to export');
      return;
    }

    const toastId = toast.loading('Generating user registry PDF report...');
    try {
      const pageRows = users.slice(0, 15).map(u => `
        <tr style="border-bottom: 1px solid ${PDF_COLORS.slate200};">
          <td style="padding: 10px 8px; font-weight: 700; color: ${PDF_COLORS.slate900};">${u.name}</td>
          <td style="padding: 10px 8px; color: ${PDF_COLORS.slate600};">${u.email}</td>
          <td style="padding: 10px 8px; text-transform: capitalize; font-weight: 600; color: ${u.role === 'admin' ? '#D97706' : u.role === 'client' ? '#2563EB' : '#7C3AED'};">${u.role}</td>
          <td style="padding: 10px 8px; text-transform: capitalize; font-weight: 600; color: ${u.status === 'suspended' ? '#DC2626' : '#16A34A'};">${u.status}</td>
          <td style="padding: 10px 8px; font-weight: 600;">${u.verified ? '<span style="color: #0284C7;">Verified</span>' : '<span style="color: #94A3B8;">Pending</span>'}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 700;">₹${((u.role === 'client' ? u.totalSpent : u.earnings) || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px 8px; text-align: right; color: ${PDF_COLORS.slate500};">${formatDate(u.createdAt)}</td>
        </tr>
      `).join('');

      const pageHtml = `
        <div>
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid ${PDF_COLORS.primary}; margin-bottom: 20px;">
            <div>
              ${renderLogoSvg(36)}
              <div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 6px;">
                <strong>WorkStation Technologies</strong> • Enterprise User Registry & Governance Report
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 22px; font-weight: 900; color: ${PDF_COLORS.primary};">USER DIRECTORY</div>
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; margin-top: 4px;">Total Records: ${pagination.totalUsers} • Generated: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <!-- Summary Strip -->
          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Total Users</div>
              <div style="font-size: 18px; font-weight: 900; color: ${PDF_COLORS.primary};">${stats?.totalUsers || pagination.totalUsers}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Freelancers</div>
              <div style="font-size: 18px; font-weight: 900; color: #7C3AED;">${stats?.freelancers || 0}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Clients</div>
              <div style="font-size: 18px; font-weight: 900; color: #2563EB;">${stats?.clients || 0}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Verified</div>
              <div style="font-size: 18px; font-weight: 900; color: #0284C7;">${stats?.verifiedUsers || 0}</div>
            </div>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <thead>
              <tr style="background: ${PDF_COLORS.slate100}; border-bottom: 2px solid ${PDF_COLORS.slate300 || '#CBD5E1'};">
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">USER NAME</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">EMAIL</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">ROLE</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">STATUS</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">VERIFIED</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">FINANCIALS</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">JOIN DATE</th>
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
        fileName: `WorkStation-User-Registry-${Date.now()}`
      });

      toast.success('PDF report generated successfully', { id: toastId });
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
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  User Management
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage platform members, monitor account activity, and control access permissions.
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
              onClick={() => { fetchUsers(); fetchStats(); toast.success('Data refreshed'); }}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title="Refresh database records"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin text-[#0A84FF]')} />
            </button>

            <button
              onClick={() => setActiveModal('create')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0A84FF] to-[#0066CC] hover:from-[#0070E0] hover:to-[#0052A3] rounded-xl shadow-sm shadow-[#0A84FF]/25 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* ── 6 Analytics KPI Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Users */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Users</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.totalUsers || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{stats?.newLast7Days || 0}</span> this week
              </div>
            </div>
          </div>

          {/* Card 2: Freelancers */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Freelancers</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.freelancers || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {stats?.totalUsers ? Math.round(((stats.freelancers || 0) / stats.totalUsers) * 100) : 0}% of network
              </div>
            </div>
          </div>

          {/* Card 3: Clients */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Clients</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <Building className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.clients || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {stats?.totalUsers ? Math.round(((stats.clients || 0) / stats.totalUsers) * 100) : 0}% of network
              </div>
            </div>
          </div>

          {/* Card 4: Verified Users */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verified</span>
              <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
                <BadgeCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.verifiedUsers || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-sky-600 dark:text-sky-400 mt-1 font-semibold flex items-center gap-1">
                <span>Identity verified</span>
              </div>
            </div>
          </div>

          {/* Card 5: Suspended Accounts */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Suspended</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.suspendedUsers || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                Restricted access
              </div>
            </div>
          </div>

          {/* Card 6: New This Month */}
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">New Month</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <Skeleton className="h-7 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {(stats?.newThisMonth || 0).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                Growing cohort
              </div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Row ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#111C38] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name, email, skills, or city..."
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
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="all">All Roles ({counts.byRole.all || 0})</option>
                <option value="freelancer">Freelancer ({counts.byRole.freelancer || 0})</option>
                <option value="client">Client ({counts.byRole.client || 0})</option>
                <option value="admin">Admin ({counts.byRole.admin || 0})</option>
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
                <option value="active">Active ({counts.byStatus.active || 0})</option>
                <option value="suspended">Suspended ({counts.byStatus.suspended || 0})</option>
                <option value="pending">Pending ({counts.byStatus.pending || 0})</option>
                <option value="deleted">Deleted ({counts.byStatus.deleted || 0})</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verification:</span>
              <select
                value={verifiedFilter}
                onChange={(e) => { setVerifiedFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
              >
                <option value="all">All</option>
                <option value="true">Verified ({counts.byVerification.verified || 0})</option>
                <option value="false">Unverified ({counts.byVerification.unverified || 0})</option>
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
                <option value="createdAt">Joined Date</option>
                <option value="name">Name</option>
                <option value="earnings">Earnings</option>
                <option value="totalSpent">Spending</option>
                <option value="lastActive">Last Active</option>
              </select>
              <button
                onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                title={`Sort Order: ${sortOrder.toUpperCase()}`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
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

        {/* ── Table / Grid Content ─────────────────────────────────────────── */}
        {loading ? (
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to fetch users</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white dark:bg-[#111C38] rounded-2xl p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No users found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {hasActiveFilters ? 'No accounts matched your active filters or search keyword.' : 'No users exist in the platform database yet.'}
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
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Verified</th>
                    <th className="py-3.5 px-4">Financials</th>
                    <th className="py-3.5 px-4">Projects</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {users.map((user) => {
                    const roleBadge = ROLE_BADGES[user.role] || ROLE_BADGES.freelancer;
                    const statusBadge = user.isDeleted ? STATUS_BADGES.deleted : (STATUS_BADGES[user.status] || STATUS_BADGES.active);

                    return (
                      <tr
                        key={user._id}
                        onClick={() => handleOpenDrawer(user)}
                        className="group hover:bg-[#F8FBFF] dark:hover:bg-[#152347]/60 cursor-pointer transition-colors"
                      >
                        {/* User Identity Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar
                                src={user.avatar}
                                name={user.name}
                                size="sm"
                              />
                              {user.isOnline && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111C38]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors">
                                <span className="truncate">{user.name}</span>
                                {user.verified && (
                                  <BadgeCheck className="h-4 w-4 text-[#0A84FF] flex-shrink-0" />
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user.email}
                              </div>
                              {user.location && (
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{user.location.split(',')[0]}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="py-3.5 px-4">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', roleBadge.color)}>
                            <span className={cn('h-1.5 w-1.5 rounded-full', roleBadge.dot)} />
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 px-4">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusBadge.color)}>
                            <span className={cn('h-1.5 w-1.5 rounded-full', statusBadge.dot)} />
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Verification Checkmark */}
                        <td className="py-3.5 px-4">
                          {user.verified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A84FF]">
                              <ShieldCheck className="h-4 w-4" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                              <span>Unverified</span>
                            </span>
                          )}
                        </td>

                        {/* Financials Column */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {user.role === 'client'
                              ? formatCurrency(user.totalSpent || 0)
                              : formatCurrency(user.earnings || 0)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {user.role === 'client' ? 'Total spent' : 'Net earnings'}
                          </div>
                        </td>

                        {/* Projects Column */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-700 dark:text-slate-200">
                            {user.completedProjectsCount || 0} completed
                          </div>
                          {user.activeContractsCount > 0 && (
                            <div className="text-[11px] text-[#0A84FF] font-semibold">
                              {user.activeContractsCount} active contract{user.activeContractsCount > 1 ? 's' : ''}
                            </div>
                          )}
                        </td>

                        {/* Last Active Column */}
                        <td className="py-3.5 px-4">
                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            {formatDate(user.lastActive)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Joined {formatDate(user.createdAt)}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenDrawer(user)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Inspect user profile drawer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => { setTargetUser(user); setActiveModal('status'); }}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                user.status === 'suspended'
                                  ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                  : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              )}
                              title={user.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                            >
                              {user.status === 'suspended' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </button>

                            <button
                              onClick={() => { setTargetUser(user); setActiveModal('verify'); }}
                              className="p-1.5 text-slate-400 hover:text-[#0A84FF] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Toggle ID Verification"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => { setTargetUser(user); setNewRole(user.role); setActiveModal('role'); }}
                              className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Change Role"
                            >
                              <Building className="h-4 w-4" />
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
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const roleBadge = ROLE_BADGES[user.role] || ROLE_BADGES.freelancer;
              const statusBadge = user.isDeleted ? STATUS_BADGES.deleted : (STATUS_BADGES[user.status] || STATUS_BADGES.active);

              return (
                <div
                  key={user._id}
                  onClick={() => handleOpenDrawer(user)}
                  className="bg-white dark:bg-[#111C38] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size="dashboard"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors truncate">
                          <span className="truncate">{user.name}</span>
                          {user.verified && <BadgeCheck className="h-4 w-4 text-[#0A84FF] flex-shrink-0" />}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                        {user.location && (
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', roleBadge.color)}>
                        {roleBadge.label}
                      </span>
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', statusBadge.color)}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Financial and Projects row */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {user.role === 'client' ? formatCurrency(user.totalSpent || 0) : formatCurrency(user.earnings || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">
                        {user.role === 'client' ? 'Total Spent' : 'Earnings'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {user.completedProjectsCount || 0}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Projects Done</div>
                    </div>
                  </div>

                  {/* Footer Timestamps and Quick Actions */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                    <span>Active: {formatDate(user.lastActive)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setTargetUser(user); setActiveModal('status'); }}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Status Action"
                      >
                        <Lock className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDrawer(user)}
                        className="p-1 text-slate-400 hover:text-[#0A84FF] rounded"
                        title="View Details"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination Controls ─────────────────────────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111C38] px-5 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-sm">
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Showing page <strong className="text-slate-900 dark:text-white">{pagination.currentPage}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{pagination.totalPages}</strong> ({pagination.totalUsers} total users)
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

      {/* ── Slide-Out User Detail Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedUser && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#111C38] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#111C38]/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">User Dossier</span>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1">
                {/* Profile Snapshot */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FBFF] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <Avatar
                    src={selectedUser.avatar}
                    name={selectedUser.name}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                        {selectedUser.name}
                      </h2>
                      {selectedUser.verified && (
                        <BadgeCheck className="h-5 w-5 text-[#0A84FF] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{selectedUser.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border', ROLE_BADGES[selectedUser.role]?.color)}>
                        {selectedUser.role}
                      </span>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border', STATUS_BADGES[selectedUser.status]?.color)}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <div className="text-slate-400 font-medium">Location</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedUser.location || 'India'}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <div className="text-slate-400 font-medium">Phone</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedUser.phone || 'Not provided'}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <div className="text-slate-400 font-medium">Joined Platform</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <div className="text-slate-400 font-medium">Last Active</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(selectedUser.lastActive)}</div>
                  </div>
                </div>

                {/* Bio / Summary */}
                {selectedUser.bio && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <div className="text-xs font-bold uppercase text-slate-400 mb-1">About</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedUser.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {Array.isArray(selectedUser.skills) && selectedUser.skills.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-2">Skills & Expertise</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drawer Data Sections */}
                {drawerLoading ? (
                  <div className="space-y-3 py-4">
                    <Skeleton className="h-6 w-32 rounded" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ) : (
                  <>
                    {/* Recent Contracts */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                        <span>Contracts ({drawerData?.recentContracts?.length || 0})</span>
                      </div>
                      {drawerData?.recentContracts?.length > 0 ? (
                        <div className="space-y-2">
                          {drawerData.recentContracts.map((c) => (
                            <div key={c._id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs">
                              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                                <span>{c.title || c.job?.title || 'Contract Project'}</span>
                                <span className="text-[#0A84FF]">{formatCurrency(c.totalAmount || 0)}</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-400 mt-1">
                                <span className="capitalize">{c.status} • Escrow: {c.escrowStatus}</span>
                                <span>{formatDate(c.createdAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No contract records linked to this account.</p>
                      )}
                    </div>

                    {/* Recent Payments */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                        <span>Recent Transactions ({drawerData?.recentPayments?.length || 0})</span>
                      </div>
                      {drawerData?.recentPayments?.length > 0 ? (
                        <div className="space-y-2">
                          {drawerData.recentPayments.map((p) => (
                            <div key={p._id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                  {p.projectName || p.invoiceNumber || 'Platform Payment'}
                                </div>
                                <div className="text-slate-400 text-[11px]">
                                  {p.paymentMethod} • {formatDate(p.createdAt)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.amount)}</div>
                                <span className={cn('text-[10px] font-bold uppercase', p.status === 'completed' || p.status === 'succeeded' ? 'text-emerald-500' : 'text-amber-500')}>
                                  {p.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No transaction history found.</p>
                      )}
                    </div>

                    {/* Recent Audit Logs */}
                    {drawerData?.auditLogs?.length > 0 && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Administrative Audit History
                        </div>
                        <div className="space-y-2">
                          {drawerData.auditLogs.map((log) => (
                            <div key={log._id} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs">
                              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                                <span className="capitalize">{log.action.replace('_', ' ')}</span>
                                <span className="text-[11px] text-slate-400">{formatDate(log.createdAt)}</span>
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                By {log.adminName} • {log.notes || 'Executed in admin portal'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Drawer Bottom Governance Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap gap-2">
                <button
                  onClick={() => { setTargetUser(selectedUser); setActiveModal('status'); }}
                  className={cn(
                    'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all',
                    selectedUser.status === 'suspended'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  )}
                >
                  {selectedUser.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                </button>

                <button
                  onClick={() => { setTargetUser(selectedUser); setActiveModal('verify'); }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100"
                >
                  {selectedUser.verified ? 'Remove Verified' : 'Verify ID'}
                </button>

                <button
                  onClick={() => { setTargetUser(selectedUser); setNewRole(selectedUser.role); setActiveModal('role'); }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                >
                  Change Role
                </button>

                <button
                  onClick={() => { setTargetUser(selectedUser); setActiveModal('delete'); }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 transition-colors"
                >
                  {selectedUser.isDeleted ? 'Restore User' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Status Change Modal (Suspend / Activate) ──────────────────────── */}
      <AnimatePresence>
        {activeModal === 'status' && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center',
                  targetUser.status === 'suspended' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                )}>
                  {targetUser.status === 'suspended' ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {targetUser.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                  </h3>
                  <p className="text-xs text-slate-500">Target: {targetUser.name} ({targetUser.email})</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {targetUser.status === 'suspended'
                  ? 'Reactivating will restore login privileges and marketplace visibility for this user immediately.'
                  : 'Suspending will restrict login, pause active proposals, and prevent public marketplace interactions.'}
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Action (Recorded in Audit Log)
                </label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Terms compliance review completed"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => { setActiveModal(null); setTargetUser(null); setActionReason(''); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleStatusToggle}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all',
                    targetUser.status === 'suspended' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  )}
                >
                  {actionLoading ? 'Processing...' : targetUser.status === 'suspended' ? 'Confirm Reactivate' : 'Confirm Suspend'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Verify Toggle Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'verify' && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {targetUser.verified ? 'Revoke Verification' : 'Verify User Identity'}
                  </h3>
                  <p className="text-xs text-slate-500">{targetUser.name} ({targetUser.email})</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {targetUser.verified
                  ? 'Removing the verification checkmark will revoke verified badges on client proposals and search cards.'
                  : 'Granting verification displays the official WorkStation blue verified credential across marketplace listings.'}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => { setActiveModal(null); setTargetUser(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleVerifyToggle}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all"
                >
                  {actionLoading ? 'Updating...' : targetUser.verified ? 'Revoke Verification' : 'Confirm Verification'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Change Role Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'role' && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Change Account Role</h3>
                  <p className="text-xs text-slate-500">{targetUser.name} ({targetUser.email})</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                >
                  <option value="freelancer">Freelancer (Can bid, submit milestones, earn)</option>
                  <option value="client">Client (Can post jobs, hire, fund escrow)</option>
                  <option value="admin">Administrator (Full platform governance access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => { setActiveModal(null); setTargetUser(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleRoleChange}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all"
                >
                  {actionLoading ? 'Updating Role...' : 'Save Role'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Soft Delete / Restore Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'delete' && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <UserX className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {targetUser.isDeleted ? 'Restore Account' : 'Soft Delete Account'}
                  </h3>
                  <p className="text-xs text-slate-500">{targetUser.name} ({targetUser.email})</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {targetUser.isDeleted
                  ? 'Restoring will clear the soft-deleted state, re-enabling active platform membership.'
                  : 'Soft deletion hides the user from search and general listings while safeguarding historical audit trails, contracts, and financial records.'}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => { setActiveModal(null); setTargetUser(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleDeleteRestore}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
                >
                  {actionLoading ? 'Processing...' : targetUser.isDeleted ? 'Confirm Restore' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Add New User Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'create' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111C38] rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Create New Platform User</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="ramesh@example.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="client">Client</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City / Region</label>
                    <input
                      type="text"
                      value={newUserForm.location}
                      onChange={(e) => setNewUserForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="Bengaluru, Karnataka, India"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / Role Headline</label>
                  <textarea
                    rows={2}
                    value={newUserForm.bio}
                    onChange={(e) => setNewUserForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Short summary of background or enterprise details..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="new-user-verify"
                    checked={newUserForm.verified}
                    onChange={(e) => setNewUserForm(f => ({ ...f, verified: e.target.checked }))}
                    className="rounded text-[#0A84FF] focus:ring-[#0A84FF]"
                  />
                  <label htmlFor="new-user-verify" className="font-semibold text-slate-700 dark:text-slate-300">
                    Mark user identity verified immediately
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-xl transition-all shadow-sm"
                  >
                    {actionLoading ? 'Creating User...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
