import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle2, Clock, FileText, Flame, TrendingUp,
  ShieldAlert, Calendar, User, Tag, Layers, MoreVertical,
  ExternalLink, UserCheck, MessageSquare, Check, X,
  Smartphone, Globe, ShoppingBag, Palette, LayoutDashboard,
  Building, Bot, Eye, UserPlus, LayoutGrid, LayoutList, Sparkles, SlidersHorizontal,
  CreditCard, DollarSign, Download, Copy, ArrowUpRight, ArrowDownLeft,
  RotateCcw, ShieldCheck, Lock, Unlock, AlertTriangle, ChevronDown, CheckSquare,
  HelpCircle, Shield, Sliders
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '@/services/api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Skeleton from '@/components/common/Skeleton';
import { formatDate, formatCurrency, formatCompactCurrency, formatCompactINR } from '@/utils/formatters';
import { buildAndExportPDF, PDF_COLORS, renderLogoSvg } from '@/utils/pdf/pdfEngine';
import { downloadInvoicePDF } from '@/utils/pdf';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

// ── Project Meta Badges ──────────────────────────────────────────────────────
const PROJECT_META = {
  'Mobile Banking App': { emoji: '📱', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' },
  'WorkStation Marketplace': { emoji: '🌐', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40' },
  'E-commerce Platform': { emoji: '🛒', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40' },
  'Portfolio CMS': { emoji: '🎨', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40' },
  'CRM Dashboard': { emoji: '📊', color: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40' },
  'Society Management System': { emoji: '🏢', color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40' },
  'AI Chat Assistant': { emoji: '🤖', color: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/40' },
  'DigitalDine': { emoji: '🍽️', color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/40' },
  'Event Booking Platform': { emoji: '🎫', color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/40' },
  'Healthcare Telemedicine App': { emoji: '🏥', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40' },
};

// ── Status Styling Config ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    dot: 'bg-emerald-500',
    cardBorder: 'border-l-emerald-500',
  },
  succeeded: {
    label: 'Completed',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    dot: 'bg-emerald-500',
    cardBorder: 'border-l-emerald-500',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] border-blue-200 dark:border-blue-800/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]',
    dot: 'bg-[#0A84FF] animate-pulse',
    cardBorder: 'border-l-blue-500',
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    dot: 'bg-amber-500 animate-pulse',
    cardBorder: 'border-l-amber-500',
  },
  failed: {
    label: 'Failed',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700',
    dot: 'bg-slate-500',
    cardBorder: 'border-l-slate-500',
  },
  disputed: {
    label: 'Disputed',
    color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    dot: 'bg-rose-500 animate-pulse',
    cardBorder: 'border-l-rose-500',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
    dot: 'bg-purple-500',
    cardBorder: 'border-l-purple-500',
  },
};

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
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [escrowMetrics, setEscrowMetrics] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalResults: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [refundFilter, setRefundFilter] = useState('');
  const [disputeFilter, setDisputeFilter] = useState('');
  const [amountRange, setAmountRange] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [page, setPage] = useState(1);
  const [chartRange, setChartRange] = useState('6M');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Interactive Drawer & Modals
  const [activeDrawerPayment, setActiveDrawerPayment] = useState(null);
  const [releaseModalPayment, setReleaseModalPayment] = useState(null);
  const [refundModalPayment, setRefundModalPayment] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [disputeModalPayment, setDisputeModalPayment] = useState(null);
  const [disputeOutcome, setDisputeOutcome] = useState('release');
  const [disputeResolutionNote, setDisputeResolutionNote] = useState('');
  const [statusActionPayment, setStatusActionPayment] = useState(null);
  const [statusActionType, setStatusActionType] = useState('completed');
  const [statusActionNote, setStatusActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Payments Data
  const fetchPayments = useCallback(async (opts = {}) => {
    const isRefresh = opts.refresh;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        page: opts.page ?? page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const activeSearch = opts.search !== undefined ? opts.search : debouncedSearch;
      const activeStatus = opts.status !== undefined ? opts.status : statusFilter;
      const activeMethod = opts.method !== undefined ? opts.method : methodFilter;
      const activeRefund = opts.refund !== undefined ? opts.refund : refundFilter;
      const activeDispute = opts.dispute !== undefined ? opts.dispute : disputeFilter;
      const activeAmount = opts.amount !== undefined ? opts.amount : amountRange;
      const activeDate = opts.date !== undefined ? opts.date : dateRange;

      if (activeSearch) params.set('search', activeSearch);
      if (activeStatus && activeStatus !== 'all') params.set('status', activeStatus);
      if (activeMethod && activeMethod !== 'all') params.set('paymentMethod', activeMethod);
      if (activeRefund && activeRefund !== 'all') params.set('refundStatus', activeRefund);
      if (activeDispute && activeDispute !== 'all') params.set('disputeStatus', activeDispute);

      if (activeAmount === 'under10k') {
        params.set('maxAmount', '10000');
      } else if (activeAmount === '10k-50k') {
        params.set('minAmount', '10000');
        params.set('maxAmount', '50000');
      } else if (activeAmount === 'above50k') {
        params.set('minAmount', '50000');
      }

      if (activeDate === '7d') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        params.set('startDate', d.toISOString());
      } else if (activeDate === '30d') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        params.set('startDate', d.toISOString());
      } else if (activeDate === '90d') {
        const d = new Date();
        d.setDate(d.getDate() - 90);
        params.set('startDate', d.toISOString());
      }

      const res = await api.get(`/admin/payments?${params.toString()}`);
      const data = res.data.data;
      setPayments(data.payments || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalResults: 0 });
      setKpi(data.kpi);
      setStatusDistribution(data.statusDistribution || []);
      setMonthlyRevenue(data.monthlyRevenue || []);
      setEscrowMetrics(data.escrowMetrics);
    } catch (err) {
      toast.error('Failed to load payments ledger');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch, statusFilter, methodFilter, refundFilter, disputeFilter, amountRange, dateRange, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('');
    setMethodFilter('');
    setRefundFilter('');
    setDisputeFilter('');
    setAmountRange('');
    setDateRange('all');
    setPage(1);
    fetchPayments({ search: '', status: '', method: '', refund: '', dispute: '', amount: '', date: 'all', page: 1 });
  };

  // Close 3-dot popovers when clicking outside
  useEffect(() => {
    const handleWindowClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  // Quick Action: Download Invoice PDF
  const handleDownloadInvoice = async (payment) => {
    try {
      toast.loading('Generating Tax Invoice...', { id: 'admin-pdf' });
      await downloadInvoicePDF(
        {
          ...payment,
          invoiceNumber: payment.invoiceId || payment.invoiceNumber,
          client: { name: payment.clientName },
          freelancer: { name: payment.freelancerName },
          description: `Deliverables for ${payment.projectName || 'Milestone Contract'}`,
        },
        { name: 'WorkStation Admin Finance' }
      );
      toast.success('Invoice PDF downloaded successfully!', { id: 'admin-pdf', icon: '📄' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: 'admin-pdf' });
    }
  };

  // Quick Action: Export CSV
  const handleExportCSV = () => {
    if (!payments.length) {
      toast.error('No payments to export');
      return;
    }
    const headers = ['Transaction ID', 'Invoice No', 'Project', 'Client', 'Freelancer', 'Gross Amount (INR)', 'Platform Fee (10%)', 'Net Payout (90%)', 'Method', 'Status', 'Escrow Status', 'Date'];
    const rows = payments.map(p => [
      `"${p.transactionId || ''}"`,
      `"${p.invoiceId || p.invoiceNumber || ''}"`,
      `"${p.projectName || 'General Platform'}"`,
      `"${p.clientName || 'Client'}"`,
      `"${p.freelancerName || 'Freelancer'}"`,
      p.amount || 0,
      p.platformFee || Math.round((p.amount || 0) * 0.1),
      p.netPayout || Math.round((p.amount || 0) * 0.9),
      `"${p.paymentMethod || 'UPI'}"`,
      p.status || 'pending',
      p.escrowStatus || 'held',
      `"${formatDate(p.createdAt)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workstation_payments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Payments CSV report downloaded successfully');
  };

  // Quick Action: Export Corporate PDF Financial Report
  const handleExportPDF = async () => {
    if (!payments.length) {
      toast.error('No payments to export');
      return;
    }

    const toastId = toast.loading('Compiling print-ready Financial Statement PDF...');
    try {
      const pageRows = payments.slice(0, 14).map(p => `
        <tr style="border-bottom: 1px solid ${PDF_COLORS.slate200};">
          <td style="padding: 9px 8px; font-family: monospace; font-weight: 700; color: ${PDF_COLORS.secondary};">${p.transactionId}</td>
          <td style="padding: 9px 8px; font-weight: 600; color: ${PDF_COLORS.slate900};">${p.projectName || 'General Platform'}</td>
          <td style="padding: 9px 8px; color: ${PDF_COLORS.slate600};">${p.clientName}</td>
          <td style="padding: 9px 8px; color: ${PDF_COLORS.slate600};">${p.freelancerName}</td>
          <td style="padding: 9px 8px; text-transform: uppercase; font-weight: 700; font-size: 9px; color: ${p.status === 'completed' ? '#047857' : p.status === 'disputed' ? '#B91C1C' : '#B45309'};">${p.status}</td>
          <td style="padding: 9px 8px; text-align: right; font-weight: 700; color: ${PDF_COLORS.slate900};">₹${(p.amount || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 9px 8px; text-align: right; font-weight: 600; color: #1D4ED8;">₹${(p.platformFee || (p.amount * 0.1)).toLocaleString('en-IN')}</td>
          <td style="padding: 9px 8px; text-align: right; color: ${PDF_COLORS.slate500};">${formatDate(p.createdAt)}</td>
        </tr>
      `).join('');

      const pageHtml = `
        <div>
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid ${PDF_COLORS.primary}; margin-bottom: 20px;">
            <div>
              ${renderLogoSvg(36)}
              <div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 6px;">
                <strong>WorkStation Technologies</strong> • Official Platform Financial Statement & Escrow Audit
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 20px; font-weight: 900; color: ${PDF_COLORS.primary};">FINANCIAL AUDIT REPORT</div>
              <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; margin-top: 4px;">Total Volume: ₹${(kpi?.grossRevenue || 0).toLocaleString('en-IN')} • Generated: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <!-- Summary Strip -->
          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Gross Volume</div>
              <div style="font-size: 16px; font-weight: 900; color: ${PDF_COLORS.primary};">₹${(kpi?.grossRevenue || 0).toLocaleString('en-IN')}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Platform Net (10%)</div>
              <div style="font-size: 16px; font-weight: 900; color: #1D4ED8;">₹${(kpi?.platformFees || 0).toLocaleString('en-IN')}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Freelancer Payouts</div>
              <div style="font-size: 16px; font-weight: 900; color: #047857;">₹${(kpi?.totalPayouts || 0).toLocaleString('en-IN')}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: ${PDF_COLORS.slate50}; border-radius: 8px; border: 1px solid ${PDF_COLORS.slate200};">
              <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Escrow Secured</div>
              <div style="font-size: 16px; font-weight: 900; color: #0284C7;">₹${(kpi?.escrowBalance || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: ${PDF_COLORS.slate100}; border-bottom: 2px solid #CBD5E1;">
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">TRANSACTION</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">PROJECT</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">CLIENT</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">FREELANCER</th>
                <th style="padding: 8px; text-align: left; font-weight: 800; color: ${PDF_COLORS.slate700};">STATUS</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">GROSS</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">FEE (10%)</th>
                <th style="padding: 8px; text-align: right; font-weight: 800; color: ${PDF_COLORS.slate700};">DATE</th>
              </tr>
            </thead>
            <tbody>
              ${pageRows}
            </tbody>
          </table>

          <div style="margin-top: 24px; padding: 12px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid ${PDF_COLORS.primary}; font-size: 10px; color: ${PDF_COLORS.slate600};">
            <strong>Audit Guarantee:</strong> This report represents verified double-entry transactions from the WorkStation Nodal Escrow ledger. All platform margins are calculated at exactly 10.00% pursuant to marketplace service rules.
          </div>
        </div>
      `;

      await buildAndExportPDF({
        fileName: `WorkStation_Financial_Audit_${Date.now()}.pdf`,
        pagesHtml: [pageHtml]
      });

      toast.success('Financial Report PDF downloaded successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate Financial PDF', { id: toastId });
    }
  };

  const handleCopy = (text, label = 'ID') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied: ${text}`);
  };

  // Actions
  const handleConfirmRelease = async () => {
    if (!releaseModalPayment) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/payments/${releaseModalPayment._id}/release`);
      toast.success(`Escrow funds for ${releaseModalPayment.transactionId} released!`);
      setReleaseModalPayment(null);
      if (activeDrawerPayment?._id === releaseModalPayment._id) {
        setActiveDrawerPayment(null);
      }
      fetchPayments({ refresh: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release escrow');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRefund = async () => {
    if (!refundModalPayment) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/payments/${refundModalPayment._id}/refund`, {
        reason: refundReason || 'Refund authorized by platform administrator.',
        amount: refundAmount ? Number(refundAmount) : undefined,
      });
      toast.success(`Payment ${refundModalPayment.transactionId} refunded successfully!`);
      setRefundModalPayment(null);
      setRefundReason('');
      setRefundAmount('');
      if (activeDrawerPayment?._id === refundModalPayment._id) {
        setActiveDrawerPayment(null);
      }
      fetchPayments({ refresh: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to refund payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmResolveDispute = async () => {
    if (!disputeModalPayment) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/payments/${disputeModalPayment._id}/resolve-dispute`, {
        outcome: disputeOutcome,
        resolution: disputeResolutionNote || 'Dispute arbitration finalized and settled.',
      });
      toast.success(`Dispute on ${disputeModalPayment.transactionId} resolved (${disputeOutcome})!`);
      setDisputeModalPayment(null);
      setDisputeResolutionNote('');
      if (activeDrawerPayment?._id === disputeModalPayment._id) {
        setActiveDrawerPayment(null);
      }
      fetchPayments({ refresh: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusActionPayment) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/payments/${statusActionPayment._id}/status`, {
        status: statusActionType,
        notes: statusActionNote || `Admin marked as ${statusActionType}`,
      });
      toast.success(`Payment ${statusActionPayment.transactionId} marked as ${statusActionType}!`);
      setStatusActionPayment(null);
      setStatusActionNote('');
      if (activeDrawerPayment?._id === statusActionPayment._id) {
        setActiveDrawerPayment(null);
      }
      fetchPayments({ refresh: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── 1. Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Payments & Escrow Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Live Fintech Hub
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Nodal escrow monitoring, platform fee earnings, dispute arbitration, and tax invoices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Dispute Quick Trigger */}
          <button
            onClick={() => {
              if (disputeFilter === 'open' || statusFilter === 'disputed') {
                resetFilters();
              } else {
                setStatusFilter('disputed');
                setPage(1);
                fetchPayments({ status: 'disputed', page: 1 });
              }
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm',
              statusFilter === 'disputed'
                ? 'bg-rose-600 text-white border-rose-600 shadow-rose-500/20'
                : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            )}
          >
            <ShieldAlert size={14} />
            <span>Dispute Center ({kpi?.disputesCount ?? 0})</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Download size={13} />
            Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all shadow-sm"
          >
            <FileText size={13} />
            Audit PDF
          </button>

          <button
            onClick={() => fetchPayments({ refresh: true })}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-emerald-600' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── 2. 6 Financial KPI Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Gross Volume */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 hover:-translate-y-1 transition-all shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 truncate">Gross Volume</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0">
                <TrendingUp size={15} />
              </div>
            </div>
            <div className="min-w-0 mt-2" title={formatCurrency(kpi?.grossRevenue ?? 0)}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words truncate">
                {formatCompactINR(kpi?.grossRevenue ?? 0)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1 truncate">
            {statusDistribution.find(s => s.name === 'Completed')?.value ?? 0} Completed Deals
          </p>
        </div>

        {/* Platform Revenue */}
        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 hover:-translate-y-1 transition-all shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 truncate">Platform Revenue</span>
              <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-600 shrink-0">
                <DollarSign size={15} />
              </div>
            </div>
            <div className="min-w-0 mt-2" title={formatCurrency(kpi?.platformFees ?? 0)}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words truncate">
                {formatCompactINR(kpi?.platformFees ?? 0)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1 truncate">Exactly 10% Platform Fee</p>
        </div>

        {/* Freelancer Payouts */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:-translate-y-1 transition-all shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate">Freelancer Payouts</span>
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 shrink-0">
                <CreditCard size={15} />
              </div>
            </div>
            <div className="min-w-0 mt-2" title={formatCurrency(kpi?.totalPayouts ?? (kpi?.grossRevenue ? kpi.grossRevenue * 0.9 : 0))}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words truncate">
                {formatCompactINR(kpi?.totalPayouts ?? (kpi?.grossRevenue ? kpi.grossRevenue * 0.9 : 0))}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">90% Net Disbursed</p>
        </div>

        {/* Escrow Balance */}
        <div className="p-4 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 hover:-translate-y-1 transition-all shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 truncate">Escrow Balance</span>
              <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-600 shrink-0">
                <ShieldCheck size={15} />
              </div>
            </div>
            <div className="min-w-0 mt-2" title={formatCurrency(kpi?.escrowBalance ?? 0)}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words truncate">
                {formatCompactINR(kpi?.escrowBalance ?? 0)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-sky-600 font-semibold mt-1 truncate">Secured in nodal account</p>
        </div>

        {/* Pending Payouts */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:-translate-y-1 transition-all shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 truncate">Pending</span>
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 shrink-0">
                <Clock size={15} />
              </div>
            </div>
            <div className="min-w-0 mt-2">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {kpi?.pendingPayoutsCount ?? 0}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-amber-600 font-semibold mt-1 truncate" title={formatCurrency(kpi?.pendingPayoutsAmount ?? 0)}>
            {formatCompactCurrency(kpi?.pendingPayoutsAmount ?? 0)} in pipeline
          </p>
        </div>

        {/* Active Disputes */}
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 hover:-translate-y-1 transition-all shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 truncate">Active Disputes</span>
              <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-600 shrink-0">
                <AlertTriangle size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-600">
                {kpi?.disputesCount ?? 0}
              </span>
              <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-600 px-1.5 py-0.5 rounded animate-pulse">
                Open
              </span>
            </div>
          </div>
          <p className="text-[10px] text-rose-500 font-medium mt-1 truncate" title={formatCurrency(kpi?.disputedFunds ?? 0)}>
            {formatCompactCurrency(kpi?.disputedFunds ?? 0)} locked
          </p>
        </div>
      </div>

      {/* ── 3. Charts: Trends & Methods ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Revenue Trajectory & Volume Trends
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gross transaction volume vs 10% WorkStation platform fee revenue
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                {['7D', '30D', '90D', '6M'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setChartRange(range)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg transition-all',
                      chartRange === range
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: 12, border: 'none', color: '#fff', fontSize: 12 }}
                />
                <Area type="monotone" name="Gross Revenue" dataKey="grossRevenue" stroke="#10B981" strokeWidth={2.5} fill="url(#grossGrad)" />
                <Area type="monotone" name="Platform Fees" dataKey="platformEarnings" stroke="#6366F1" strokeWidth={2.5} fill="url(#feeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Status / Method Donut Chart */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart size={18} className="text-indigo-500" />
              Status Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across verified transactions</p>
          </div>

          <div className="h-52 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v} Payments`, n]}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: 10, border: 'none', color: '#fff', fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{kpi?.totalPayments ?? pagination.totalResults ?? 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Records</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusDistribution.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 4. Dedicated Escrow Safeguard Strip ───────────────────────────── */}
      <Card className="p-6 border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50/50 via-white to-white dark:from-sky-950/20 dark:via-slate-900 dark:to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-sky-600 dark:text-sky-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                RBI-Compliant Nodal Escrow Safeguard
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                Active Trustee Tier-1
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Client capital is ring-fenced in automated trustee escrow and released only upon verified milestone completion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Lock size={12} />
              100% Capital Insured
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden h-full flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium truncate block">Locked in Escrow</span>
              <div className="min-w-0 mt-1" title={formatCurrency(escrowMetrics?.lockedInEscrow ?? 0)}>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight break-words truncate">
                  {formatCompactINR(escrowMetrics?.lockedInEscrow ?? 0)}
                </h4>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-sky-500 h-full w-[70%]" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden h-full flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium truncate block">Pending Release</span>
              <div className="min-w-0 mt-1" title={formatCurrency(escrowMetrics?.pendingRelease ?? 0)}>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight break-words truncate">
                  {formatCompactINR(escrowMetrics?.pendingRelease ?? 0)}
                </h4>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full w-[45%]" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden h-full flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium truncate block">Released Recently</span>
              <div className="min-w-0 mt-1" title={formatCurrency(escrowMetrics?.releasedToday ?? 42500)}>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight break-words truncate">
                  {formatCompactINR(escrowMetrics?.releasedToday ?? 42500)}
                </h4>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[35%]" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden h-full flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium truncate block">Disputed Funds</span>
              <div className="min-w-0 mt-1" title={formatCurrency(escrowMetrics?.disputedFunds ?? 0)}>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight break-words truncate">
                  {formatCompactINR(escrowMetrics?.disputedFunds ?? 0)}
                </h4>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-rose-500 h-full w-[15%]" />
            </div>
          </div>
        </div>
      </Card>

      {/* ── 5. Advanced Search & Filter Bar ───────────────────────────────── */}
      <div className="space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: '', label: 'All Records', count: kpi?.totalPayments ?? 0 },
              { id: 'completed', label: 'Completed', count: statusDistribution.find(s => s.name === 'Completed')?.value ?? 0, emoji: '🟢' },
              { id: 'pending', label: 'Pending', count: statusDistribution.find(s => s.name === 'Pending')?.value ?? 0, emoji: '🟡' },
              { id: 'processing', label: 'Processing', count: statusDistribution.find(s => s.name === 'Processing')?.value ?? 0, emoji: '🔵' },
              { id: 'failed', label: 'Failed', count: statusDistribution.find(s => s.name === 'Failed')?.value ?? 0, emoji: '⚪' },
              { id: 'disputed', label: 'Disputed', count: statusDistribution.find(s => s.name === 'Disputed')?.value ?? 0, emoji: '🔴' },
              { id: 'refunded', label: 'Refunded', count: statusDistribution.find(s => s.name === 'Refunded')?.value ?? 0, emoji: '🟣' },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setStatusFilter(tab.id); setPage(1); fetchPayments({ status: tab.id, page: 1 }); }}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                    active
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  {tab.emoji && <span>{tab.emoji}</span>}
                  <span>{tab.label}</span>
                  <span className={cn('px-1.5 py-0.2 rounded-full text-[10px]', active ? 'bg-white/20 dark:bg-slate-800 text-white dark:text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300')}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={cn('p-1.5 rounded-lg transition-all', viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400')}
                title="Table View"
              >
                <LayoutList size={14} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={cn('p-1.5 rounded-lg transition-all', viewMode === 'cards' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400')}
                title="Cards View"
              >
                <LayoutGrid size={14} />
              </button>
            </div>

            {(statusFilter || methodFilter || refundFilter || disputeFilter || amountRange || dateRange !== 'all' || search) && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline"
              >
                <X size={12} />
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filters Strip */}
        <Card className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-[240px] relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search TXN ID, Invoice, Project, Client, or Freelancer..."
                className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Payment Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1); fetchPayments({ method: e.target.value, page: 1 }); }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Wallet">Wallet</option>
            </select>

            {/* Refund Status Filter */}
            <select
              value={refundFilter}
              onChange={(e) => { setRefundFilter(e.target.value); setPage(1); fetchPayments({ refund: e.target.value, page: 1 }); }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">Refund: All</option>
              <option value="requested">Refund Requested</option>
              <option value="under_review">Refund Review</option>
              <option value="approved">Refund Approved</option>
              <option value="completed">Refund Completed</option>
            </select>

            {/* Dispute Status Filter */}
            <select
              value={disputeFilter}
              onChange={(e) => { setDisputeFilter(e.target.value); setPage(1); fetchPayments({ dispute: e.target.value, page: 1 }); }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">Disputes: All</option>
              <option value="open">Dispute Open</option>
              <option value="investigating">Dispute Investigating</option>
              <option value="resolved">Dispute Resolved</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => { setDateRange(e.target.value); setPage(1); fetchPayments({ date: e.target.value, page: 1 }); }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            {/* Amount Filter */}
            <select
              value={amountRange}
              onChange={(e) => { setAmountRange(e.target.value); setPage(1); fetchPayments({ amount: e.target.value, page: 1 }); }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Amounts</option>
              <option value="under10k">&lt; ₹10,000</option>
              <option value="10k-50k">₹10,000 – ₹50,000</option>
              <option value="above50k">&gt; ₹50,000</option>
            </select>
          </div>
        </Card>
      </div>

      {/* ── 6. Transactions List: Table or Cards View ─────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3">
              <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-md mx-auto space-y-3">
          <CreditCard size={32} className="mx-auto text-slate-400" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No payment transactions match filters</h4>
          <p className="text-xs text-slate-500">Try clearing active search queries or loosening filter constraints.</p>
          <button onClick={resetFilters} className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ── Modern Table View ── */
        <Card className="overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Transaction / Invoice</th>
                  <th className="py-3.5 px-4">Project & Parties</th>
                  <th className="py-3.5 px-4 text-right">Gross Amount</th>
                  <th className="py-3.5 px-4 text-right">Fee (10%)</th>
                  <th className="py-3.5 px-4 text-right">Payout (90%)</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {payments.map((p) => {
                  const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                  const projectCfg = PROJECT_META[p.projectName] || { emoji: '📁', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200' };

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      {/* TXN / Invoice */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleCopy(p.transactionId, 'Transaction ID')}
                            className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>{p.transactionId}</span>
                            <Copy size={10} className="text-slate-400" />
                          </button>
                          <span className="font-mono text-[11px] text-slate-400">
                            {p.invoiceId || p.invoiceNumber}
                          </span>
                        </div>
                      </td>

                      {/* Project & Parties */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 max-w-[220px]">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {projectCfg.emoji} {p.projectName || 'General Platform'}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span>Client: <strong className="text-slate-700 dark:text-slate-300">{p.clientName}</strong></span>
                            <span>&bull;</span>
                            <span>Freelancer: <strong className="text-slate-700 dark:text-slate-300">{p.freelancerName}</strong></span>
                          </div>
                        </div>
                      </td>

                      {/* Gross */}
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white">
                        {formatCurrency(p.amount)}
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                        ₹{(p.platformFee || Math.round(p.amount * 0.1)).toLocaleString('en-IN')}
                      </td>

                      {/* Payout */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{(p.netPayout || Math.round(p.amount * 0.9)).toLocaleString('en-IN')}
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md whitespace-nowrap">
                          💳 {p.paymentMethod || 'UPI'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap', statusCfg.color)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveDrawerPayment(p)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(p)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                            title="Download Invoice PDF"
                          >
                            <Download size={14} />
                          </button>

                          {/* 3-Dot Context Menu */}
                          <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveDropdownId(activeDropdownId === p._id ? null : p._id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            >
                              <MoreVertical size={14} />
                            </button>

                            {activeDropdownId === p._id && (
                              <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 text-left text-xs font-semibold animate-in fade-in">
                                {(p.status === 'pending' || p.status === 'processing') && (
                                  <button
                                    onClick={() => { setReleaseModalPayment(p); setActiveDropdownId(null); }}
                                    className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2"
                                  >
                                    <Unlock size={13} />
                                    Release Escrow
                                  </button>
                                )}

                                {p.status === 'disputed' && (
                                  <button
                                    onClick={() => { setDisputeModalPayment(p); setDisputeOutcome('release'); setActiveDropdownId(null); }}
                                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                                  >
                                    <ShieldAlert size={13} />
                                    Arbitrate Dispute
                                  </button>
                                )}

                                {p.status !== 'refunded' && (
                                  <button
                                    onClick={() => { setRefundModalPayment(p); setActiveDropdownId(null); }}
                                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                                  >
                                    <RotateCcw size={13} />
                                    Process Refund
                                  </button>
                                )}

                                {p.status !== 'completed' && p.status !== 'succeeded' && (
                                  <button
                                    onClick={() => { setStatusActionPayment(p); setStatusActionType('completed'); setActiveDropdownId(null); }}
                                    className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <CheckSquare size={13} />
                                    Mark as Paid
                                  </button>
                                )}

                                {p.status === 'failed' && (
                                  <button
                                    onClick={() => { setStatusActionPayment(p); setStatusActionType('pending'); setActiveDropdownId(null); }}
                                    className="w-full px-3 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2"
                                  >
                                    <RefreshCw size={13} />
                                    Retry Payment
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* ── Cards View ── */
        <div className="space-y-3.5">
          <AnimatePresence>
            {payments.map((p, idx) => {
              const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
              const projectCfg = PROJECT_META[p.projectName] || {
                emoji: '📁',
                color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              };

              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={cn(
                    'group relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-4 md:p-5 transition-all duration-200 border-l-[6px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-950/40',
                    statusCfg.cardBorder
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Transaction Info & Project */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-tr flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0', getAvatarColor(p.clientName || 'Client'))}>
                        {getInitials(p.clientName || 'Client')}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleCopy(p.transactionId, 'Transaction ID')}
                            className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md hover:bg-indigo-100 flex items-center gap-1"
                          >
                            <span>{p.transactionId}</span>
                            <Copy size={10} />
                          </button>

                          <button
                            onClick={() => handleCopy(p.invoiceId || p.invoiceNumber, 'Invoice ID')}
                            className="font-mono text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1"
                          >
                            <span>{p.invoiceId || p.invoiceNumber}</span>
                            <Copy size={10} />
                          </button>

                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border', projectCfg.color)}>
                            <span>{projectCfg.emoji}</span>
                            <span className="truncate max-w-[150px]">{p.projectName || 'General Platform'}</span>
                          </span>

                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            💳 {p.paymentMethod || 'UPI'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                          <span>
                            Client: <span className="font-bold text-slate-900 dark:text-white">{p.clientName}</span>
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                          <span>
                            Freelancer: <span className="font-bold text-slate-900 dark:text-white">{p.freelancerName}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Breakdown */}
                    <div className="flex items-center gap-6 lg:justify-center">
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Total Escrow</span>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">
                          {formatCurrency(p.amount)}
                        </h4>
                      </div>

                      <div className="text-right text-xs text-slate-500 space-y-0.5">
                        <p>Fee (10%): <span className="font-semibold text-slate-700 dark:text-slate-300">₹{(p.platformFee || Math.round(p.amount * 0.1)).toLocaleString('en-IN')}</span></p>
                        <p>Payout: <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{(p.netPayout || Math.round(p.amount * 0.9)).toLocaleString('en-IN')}</span></p>
                      </div>

                      <div>
                        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border', statusCfg.color)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Right: Date & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveDrawerPayment(p)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                          title="View Payment Details"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleDownloadInvoice(p)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                          title="Download Tax Invoice PDF"
                        >
                          <Download size={15} />
                        </button>

                        {(p.status === 'pending' || p.status === 'processing') && (
                          <button
                            onClick={() => setReleaseModalPayment(p)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1"
                          >
                            <Unlock size={12} />
                            Release
                          </button>
                        )}

                        {p.status === 'disputed' && (
                          <button
                            onClick={() => { setDisputeModalPayment(p); setDisputeOutcome('release'); }}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800 flex items-center gap-1 animate-pulse"
                          >
                            <ShieldAlert size={12} />
                            Arbitrate
                          </button>
                        )}

                        {p.status !== 'refunded' && (
                          <button
                            onClick={() => setRefundModalPayment(p)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors"
                            title="Issue Escrow Refund"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── 7. Pagination ─────────────────────────────────────────────────── */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500">
            Page <span className="font-bold text-slate-900 dark:text-white">{pagination.currentPage}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{pagination.totalPages}</span> &middot;{' '}
            {pagination.totalResults} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { const p = page - 1; setPage(p); fetchPayments({ page: p }); }}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => { const p = page + 1; setPage(p); fetchPayments({ page: p }); }}
              disabled={page >= pagination.totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── 8. Slide-Out Payment Detail Drawer ────────────────────────────── */}
      {activeDrawerPayment && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setActiveDrawerPayment(null)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {activeDrawerPayment.transactionId}
                    </span>
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border', (STATUS_CONFIG[activeDrawerPayment.status] || STATUS_CONFIG.pending).color)}>
                      {(STATUS_CONFIG[activeDrawerPayment.status] || STATUS_CONFIG.pending).label}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {activeDrawerPayment.projectName || 'Escrow Milestone'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Invoice: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{activeDrawerPayment.invoiceId || activeDrawerPayment.invoiceNumber}</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveDrawerPayment(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Financial Breakdown Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:to-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3 overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Financial Breakdown</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Total Escrow Deposited</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight break-words truncate" title={formatCurrency(activeDrawerPayment.amount)}>
                    {formatCurrency(activeDrawerPayment.amount)}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>WorkStation Platform Fee (10%)</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ₹{(activeDrawerPayment.platformFee || activeDrawerPayment.amount * 0.1).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Statutory GST (18% on platform fee)</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ₹{(activeDrawerPayment.gst || Math.round((activeDrawerPayment.amount * 0.1) * 0.18)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Net Freelancer Payout</span>
                    <span>
                      ₹{(activeDrawerPayment.netPayout || activeDrawerPayment.amount * 0.9).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parties Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client (Payer)</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{activeDrawerPayment.clientName}</p>
                  <p className="text-xs text-slate-500">{activeDrawerPayment.paymentMethod || 'UPI'}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freelancer (Payee)</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{activeDrawerPayment.freelancerName}</p>
                  <p className="text-xs text-emerald-600 font-medium">KYC Verified</p>
                </div>
              </div>

              {/* Dispute Details Banner */}
              {activeDrawerPayment.disputeDetails && activeDrawerPayment.disputeDetails.status !== 'none' && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                    <AlertTriangle size={15} />
                    Arbitration Case: {activeDrawerPayment.disputeDetails.status?.toUpperCase()}
                  </div>
                  <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                    {activeDrawerPayment.disputeDetails.reason}
                  </p>
                  {activeDrawerPayment.disputeDetails.evidence && (
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-lg">
                      Evidence: {activeDrawerPayment.disputeDetails.evidence}
                    </p>
                  )}
                  {activeDrawerPayment.status === 'disputed' && (
                    <button
                      onClick={() => {
                        setDisputeModalPayment(activeDrawerPayment);
                      }}
                      className="w-full py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                    >
                      Arbitrate & Resolve Dispute
                    </button>
                  )}
                </div>
              )}

              {/* Timeline Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Audit Timeline</span>
                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {(activeDrawerPayment.timeline && activeDrawerPayment.timeline.length > 0 ? activeDrawerPayment.timeline : [
                    { stage: 'Payment Initiated', description: 'Milestone escrow deposit generated', timestamp: activeDrawerPayment.createdAt, user: activeDrawerPayment.clientName },
                    { stage: 'Escrow Secured', description: 'Funds deposited in RBI-compliant nodal account', timestamp: activeDrawerPayment.createdAt, user: 'Platform Bot' }
                  ]).map((t, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative pl-8">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-2.5 top-1.5 -translate-x-1/2 ring-4 ring-white dark:ring-slate-900" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{t.stage}</p>
                        <p className="text-[11px] text-slate-500">{t.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(t.timestamp)} &middot; {t.user || 'System'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Actions Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => handleDownloadInvoice(activeDrawerPayment)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  Download Verified Tax Invoice PDF
                </button>

                {(activeDrawerPayment.status === 'pending' || activeDrawerPayment.status === 'processing') && (
                  <button
                    onClick={() => setReleaseModalPayment(activeDrawerPayment)}
                    className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Unlock size={14} />
                    Release Escrow Funds to Freelancer
                  </button>
                )}

                {activeDrawerPayment.status !== 'refunded' && (
                  <button
                    onClick={() => setRefundModalPayment(activeDrawerPayment)}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} />
                    Process Escrow Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 1: Release Escrow Confirmation ─────────────────────────── */}
      {releaseModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950">
                <Unlock size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Escrow Release</h3>
                <p className="text-xs text-slate-400">{releaseModalPayment.transactionId} &middot; {releaseModalPayment.projectName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to release <span className="font-bold text-slate-900 dark:text-white">₹{(releaseModalPayment.netPayout || releaseModalPayment.amount * 0.9).toLocaleString('en-IN')}</span> from escrow to <span className="font-bold text-slate-900 dark:text-white">{releaseModalPayment.freelancerName}</span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReleaseModalPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmRelease}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                {actionLoading ? 'Releasing...' : 'Confirm Release'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Refund Payment Modal ────────────────────────────────── */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950">
                <RotateCcw size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authorize Escrow Refund</h3>
                <p className="text-xs text-slate-400">{refundModalPayment.transactionId} &middot; ₹{refundModalPayment.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Refund Amount (Leave blank for full ₹{refundModalPayment.amount.toLocaleString('en-IN')})
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={`Max ₹${refundModalPayment.amount}`}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Refund Reason / Audit Note
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for cancellation, mutual settlement, or reimbursement..."
                  rows={3}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setRefundModalPayment(null); setRefundAmount(''); setRefundReason(''); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmRefund}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                {actionLoading ? 'Refunding...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 3: Resolve Dispute Modal ───────────────────────────────── */}
      {disputeModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Arbitrate Dispute Case</h3>
                <p className="text-xs text-slate-400">{disputeModalPayment.transactionId} &middot; ₹{disputeModalPayment.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-200">Dispute Claim:</span>
              <p className="text-slate-500">{disputeModalPayment.disputeDetails?.reason || disputeModalPayment.notes}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Arbitration Outcome</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeOutcome('release')}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs font-bold text-center transition-all',
                    disputeOutcome === 'release'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  )}
                >
                  Disburse to Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setDisputeOutcome('refund')}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs font-bold text-center transition-all',
                    disputeOutcome === 'refund'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  )}
                >
                  Refund to Client
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Arbitration Findings & Settlement Note</label>
              <textarea
                value={disputeResolutionNote}
                onChange={(e) => setDisputeResolutionNote(e.target.value)}
                placeholder="Findings based on evidence submitted, milestone acceptance, or refund settlement..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmResolveDispute}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                {actionLoading ? 'Arbitrating...' : 'Finalize Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 4: Status Transition (Mark Paid / Retry) ────────────────── */}
      {statusActionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950">
                <CheckSquare size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Payment Status</h3>
                <p className="text-xs text-slate-400">{statusActionPayment.transactionId} &middot; ₹{statusActionPayment.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Transition status to <strong className="uppercase text-indigo-600">{statusActionType}</strong> for this transaction record.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Administrative Note</label>
              <textarea
                value={statusActionNote}
                onChange={(e) => setStatusActionNote(e.target.value)}
                placeholder="Reason for manual transition or override..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusActionPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmStatusChange}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                {actionLoading ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
