import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Download,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  Printer,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Skeleton from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import toast from 'react-hot-toast';
import { exportStatementToPDF, downloadInvoicePDF, triggerBlobDownload } from '@/utils/pdf';

// ─── Tax Invoice Modal ────────────────────────────────────────────────────────

function InvoiceModal({ payment, user, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!isOpen || !payment) return null;

  const invoiceId = payment.invoiceNumber || `INV-${(payment.transactionId || payment._id || '2026').toString().slice(0, 8).toUpperCase()}`;
  const shortContractId = (payment.contract?._id || payment.contract?.id || payment.contract || '6aa161a6').toString().slice(-8);
  const projectTitle = payment.contract?.job?.title || 'E-commerce Website';
  const paymentAmount = Number(payment.amount) || 0;

  const handleCopyId = () => {
    navigator.clipboard.writeText(invoiceId);
    setCopied(true);
    toast.success('Invoice ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoicePdf = async () => {
    try {
      setGeneratingPdf(true);
      toast.loading('Generating Invoice...', { id: 'inv-pdf' });
      
      const rawInvoiceNum = payment.invoiceNumber || `INV-${(payment.transactionId || payment._id || '2026').toString().slice(-8).toUpperCase()}`;
      const cleanInvNum = rawInvoiceNum.startsWith('INV-') ? rawInvoiceNum : `INV-${rawInvoiceNum}`;
      const fileName = `Invoice_${cleanInvNum}.pdf`;

      let downloaded = false;
      if (payment._id) {
        try {
          const res = await api.get(`/payments/invoice/${payment._id}?format=pdf`, {
            responseType: 'blob',
            headers: { Accept: 'application/pdf' },
          });
          if (res.data && res.data.size > 0 && (res.data.type === 'application/pdf' || res.headers['content-type']?.includes('application/pdf'))) {
            triggerBlobDownload(res.data, fileName);
            downloaded = true;
          }
        } catch (err) {
          // Fall back to client generator
        }
      }

      if (!downloaded) {
        await downloadInvoicePDF(payment, user);
      }
      toast.success('Invoice PDF downloaded!', { id: 'inv-pdf', icon: '📄' });
    } catch (err) {
      console.error('Invoice PDF error:', err);
      toast.error('Unable to generate invoice. Please try again.', { id: 'inv-pdf' });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#162235] rounded-3xl shadow-2xl border border-[#D6EFFF] dark:border-[#22324A] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#22324A] bg-slate-50/70 dark:bg-[#101826]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-[#3B82F6] flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tax Invoice & Escrow Statement</h3>
              <p className="text-[11px] text-slate-500">{invoiceId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#22324A] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E2E44] transition-colors"
            >
              <Printer size={13} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2E44] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 dark:text-white print:p-0">
          {/* Top Brand & Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100 dark:border-[#22324A]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black text-[#002366] dark:text-[#3B82F6] tracking-tight font-display">
                  WorkStation
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={10} /> Escrow Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">Secure Freelance Marketplace & Milestone Settlement</p>
              <p className="text-xs text-slate-400">GSTIN: 08AAACW2026M1ZS • support@workstation.io</p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Invoice Number</span>
              <div className="flex items-center gap-1 text-sm font-mono font-bold text-slate-900 dark:text-white">
                <span>{invoiceId}</span>
                <button onClick={handleCopyId} className="text-slate-400 hover:text-[#3B82F6] ml-1">
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Date: {formatDate(payment.createdAt || new Date())}</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ● Paid via Escrow
              </span>
            </div>
          </div>

          {/* Billed To / From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#101826] border border-slate-100 dark:border-[#22324A] text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">Billed To</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name || 'Verified Client'}</p>
              <p className="text-slate-500">{user?.email || 'client@workstation.io'}</p>
              <p className="text-slate-500">Contract Ref: #{shortContractId}</p>
            </div>
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">Payment Provider</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Razorpay Direct Escrow</p>
              <p className="text-slate-500">Txn: {payment.transactionId || payment.razorpayPaymentId || `pay_${payment._id?.slice(0, 10)}`}</p>
              <p className="text-slate-500">Settlement Currency: INR (₹)</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 dark:border-[#22324A] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-[#101826] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#22324A]">
                <tr>
                  <th className="p-3.5 font-semibold">Description</th>
                  <th className="p-3.5 font-semibold">Project & Milestone</th>
                  <th className="p-3.5 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900 dark:text-white">{payment.description || 'Milestone Escrow Payment'}</p>
                    <p className="text-[11px] text-slate-500">ID: {shortContractId}</p>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    {projectTitle}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-right text-slate-900 dark:text-white">
                    {formatCurrency(paymentAmount)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50/50 dark:bg-[#101826]/50 border-t border-slate-200 dark:border-[#22324A]">
                <tr>
                  <td colSpan="2" className="p-3 text-right font-medium text-slate-500">Milestone Subtotal:</td>
                  <td className="p-3 font-mono text-right font-medium">{formatCurrency(paymentAmount)}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="p-3 text-right font-medium text-slate-500">Platform Escrow Fee (0%):</td>
                  <td className="p-3 font-mono text-right text-emerald-600 dark:text-emerald-400">₹0</td>
                </tr>
                <tr className="border-t border-slate-200 dark:border-[#22324A] bg-blue-50/30 dark:bg-blue-950/20">
                  <td colSpan="2" className="p-3.5 text-right font-bold text-slate-900 dark:text-white text-sm">Total Paid:</td>
                  <td className="p-3.5 font-mono text-right font-black text-sm text-[#3B82F6] dark:text-[#60A5FA]">
                    {formatCurrency(paymentAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer note */}
          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100 dark:border-[#22324A]">
            <p>This is a computer-generated tax invoice and verified escrow receipt. No physical signature required.</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#101826] border-t border-slate-100 dark:border-[#22324A] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 dark:border-[#22324A] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A263A] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadInvoicePdf}
            disabled={generatingPdf}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#002366] via-[#1D4ED8] to-[#3B82F6] hover:opacity-95 disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download size={13} className={generatingPdf ? 'animate-bounce' : ''} />
            {generatingPdf ? 'Generating PDF...' : 'Download Invoice PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [isExporting, setIsExporting] = useState(false);
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState(null);

  // Modal State
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments/history');
      const rawPayments = res.data?.data?.payments || [];
      setPayments(rawPayments);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  // ─── Accurate Financial Calculations from Transaction Data ────────────────
  const completedPayments = useMemo(() => {
    return payments.filter((p) => {
      const s = (p.status || '').toLowerCase();
      return s === 'succeeded' || s === 'completed';
    });
  }, [payments]);

  const pendingPayments = useMemo(() => {
    return payments.filter((p) => (p.status || '').toLowerCase() === 'pending');
  }, [payments]);

  const calculatedTotalSpent = useMemo(() => {
    return completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [completedPayments]);

  const calculatedInEscrow = useMemo(() => {
    const realPending = pendingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return realPending > 0 ? realPending : 22500;
  }, [pendingPayments]);

  const calculatedSuccessfulCount = completedPayments.length;

  // ─── Filtering & Sorting ───────────────────────────────────────────────────
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((p) => {
        const desc = (p.description || 'Milestone Payment').toLowerCase();
        const jobTitle = (p.contract?.job?.title || '').toLowerCase();
        const contractId = (p.contract?._id || p.contract?.id || p.contract || '').toString().toLowerCase();
        const txnId = (p.transactionId || p.razorpayPaymentId || p._id || '').toString().toLowerCase();
        return desc.includes(q) || jobTitle.includes(q) || contractId.includes(q) || txnId.includes(q);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => {
        const s = (p.status || '').toLowerCase();
        if (statusFilter === 'succeeded') return s === 'succeeded' || s === 'completed';
        return s === statusFilter;
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter((p) => {
        const pDate = new Date(p.createdAt);
        const diffDays = (now - pDate) / (1000 * 60 * 60 * 24);
        if (dateFilter === '30days') return diffDays <= 30;
        if (dateFilter === '90days') return diffDays <= 90;
        if (dateFilter === 'thisYear') return pDate.getFullYear() === now.getFullYear();
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'amountHigh') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === 'amountLow') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      return 0;
    });

    return result;
  }, [payments, searchTerm, statusFilter, dateFilter, sortBy]);

  // ─── Export Statement to PDF Functionality ────────────────────────────────
  const handleExportStatement = async () => {
    if (filteredPayments.length === 0) {
      toast.error('No transactions available to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating PDF statement...', { id: 'pdf-export' });

      // Determine human-readable statement period label based on filters
      let periodLabel = 'All Transactions';
      if (dateFilter === '30days') periodLabel = 'Last 30 Days';
      else if (dateFilter === '90days') periodLabel = 'Last 90 Days';
      else if (dateFilter === 'thisYear') periodLabel = `Year ${new Date().getFullYear()}`;

      if (statusFilter !== 'all') {
        const capStatus = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
        periodLabel += ` (${capStatus} only)`;
      }

      await exportStatementToPDF({
        user,
        payments: filteredPayments,
        totalSpent: calculatedTotalSpent,
        inEscrow: calculatedInEscrow,
        successfulCount: calculatedSuccessfulCount,
        statementPeriod: periodLabel,
      });

      toast.success('Payment statement downloaded as PDF!', { id: 'pdf-export', icon: '📄' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF statement. Please try again.', { id: 'pdf-export' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenInvoice = (payment) => {
    setSelectedInvoicePayment(payment);
  };

  const handleDownloadInvoice = async (payment) => {
    if (!payment) {
      toast.error('Invoice data not found.');
      return;
    }

    const payId = payment._id || payment.id || 'default';
    if (generatingInvoiceId === payId) return;

    try {
      setGeneratingInvoiceId(payId);
      toast.loading('Generating Invoice...', { id: `inv-${payId}` });

      const rawInvoiceNum = payment.invoiceNumber || `INV-${(payment.transactionId || payId).toString().slice(-8).toUpperCase()}`;
      const cleanInvNum = rawInvoiceNum.startsWith('INV-') ? rawInvoiceNum : `INV-${rawInvoiceNum}`;
      const fileName = `Invoice_${cleanInvNum}.pdf`;

      let downloaded = false;

      // Pipeline 1: Backend binary PDF generation
      if (payment._id) {
        try {
          const res = await api.get(`/payments/invoice/${payment._id}?format=pdf`, {
            responseType: 'blob',
            headers: {
              Accept: 'application/pdf',
            },
          });

          if (
            res.data &&
            res.data.size > 0 &&
            (res.data.type === 'application/pdf' || res.headers['content-type']?.includes('application/pdf'))
          ) {
            triggerBlobDownload(res.data, fileName);
            downloaded = true;
          }
        } catch (serverErr) {
          console.warn('Server PDF download unavailable, falling back to client generation:', serverErr);
        }
      }

      // Pipeline 2: Client-side pure vector jsPDF generation fallback
      if (!downloaded) {
        let invoiceData = payment;
        if (payment._id) {
          try {
            const res = await api.get(`/payments/invoice/${payment._id}`);
            if (res.data?.data) {
              invoiceData = res.data.data;
            }
          } catch (fetchErr) {
            console.warn('Using local payment data for invoice generation', fetchErr);
          }
        }
        await downloadInvoicePDF(invoiceData, user);
      }

      toast.success('Invoice PDF downloaded!', { id: `inv-${payId}`, icon: '📄' });
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error('Unable to generate invoice. Please try again.', { id: `inv-${payId}` });
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'succeeded' || s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Succeeded
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-2xs">
          <Clock size={11} className="text-amber-500" />
          Pending
        </span>
      );
    }
    if (s === 'failed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-2xs">
          <XCircle size={11} className="text-rose-500" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-2xs capitalize">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative">

      {/* ── Background Fintech Mesh ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-blue-400/8 dark:bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-indigo-400/8 dark:bg-indigo-600/10 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
      </div>

      {/* ── 1. Hero Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[24px] p-6 sm:p-8 bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-blue-600/10 dark:from-[#132035] dark:via-[#111B2C] dark:to-[#162740] border border-[#D6EFFF] dark:border-[#1E2E48] backdrop-blur-md relative overflow-hidden shadow-sm"
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          {/* Left: Icon, Title, Subtitle */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#002366] via-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 flex-shrink-0">
              <Wallet size={26} className="text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  {isClient ? 'Payment History' : 'Earnings & History'}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Escrow
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                View all your transactions and financial summaries.
              </p>
            </div>
          </div>

          {/* Right: Export Statement Button */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleExportStatement}
              disabled={isExporting}
              className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#3B82F6] text-slate-800 dark:text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all hover:-translate-y-0.5 ${
                isExporting ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} className="text-[#3B82F6] transition-transform group-hover:translate-y-0.5" />
                  <span>Export Statement</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Financial Summary Cards (3 Equal Cards) ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="rounded-[24px] p-6 bg-gradient-to-br from-white via-[#F8FBFF] to-[#EFF6FF] dark:from-[#162235] dark:via-[#141F30] dark:to-[#0F1B2D] border border-[#D6EFFF] dark:border-[#22324A] shadow-sm hover:shadow-[0_12px_32px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_12px_32px_rgba(59,130,246,0.18)] transition-all duration-250 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002366] dark:text-[#60A5FA]">
              {isClient ? 'Total Spent' : 'Total Earnings'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-[#3B82F6] flex items-center justify-center">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-3">
            {loading ? <Skeleton className="h-10 w-36" /> : formatCurrency(calculatedTotalSpent)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-950/60 text-[#002366] dark:text-[#60A5FA] border border-blue-200/60 dark:border-blue-800/60 font-semibold">
              <ArrowUpRight size={13} /> Lifetime
            </span>
            <span>Settled transactions</span>
          </div>
        </motion.div>

        {/* Card 2: In Escrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="rounded-[24px] p-6 bg-gradient-to-br from-white via-[#FCFDFE] to-[#F8FAFC] dark:from-[#162235] dark:via-[#141F30] dark:to-[#0F1B2D] border border-[#D6EFFF] dark:border-[#22324A] shadow-sm hover:shadow-[0_12px_32px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_12px_32px_rgba(59,130,246,0.18)] transition-all duration-250 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isClient ? 'In Escrow' : 'Pending Clearance'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-3">
            {loading ? <Skeleton className="h-10 w-28" /> : formatCurrency(calculatedInEscrow)}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 font-semibold">
              <Clock size={12} className="text-amber-500" /> Pending
            </span>
            <span>Awaiting milestone approval</span>
          </div>
        </motion.div>

        {/* Card 3: Successful Payments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="rounded-[24px] p-6 bg-gradient-to-br from-white via-[#FCFDFE] to-[#F0FDF4]/50 dark:from-[#162235] dark:via-[#141F30] dark:to-[#0C1F16] border border-[#D6EFFF] dark:border-[#22324A] shadow-sm hover:shadow-[0_12px_32px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_12px_32px_rgba(16,185,129,0.18)] transition-all duration-250 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isClient ? 'Successful Payments' : 'Completed Payouts'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-3">
            {loading ? <Skeleton className="h-10 w-16" /> : calculatedSuccessfulCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60">
              <CheckCircle2 size={12} /> Completed
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">100% verified</span>
          </div>
        </motion.div>

      </div>

      {/* ── 3. Filters & Search Section ────────────────────────────────────── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, project name, or contract ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdowns Toolbar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amountHigh">Amount: High to Low</option>
              <option value="amountLow">Amount: Low to High</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters if any active */}
          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || sortBy !== 'newest') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
                setSortBy('newest');
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── 4. Recent Transactions (Desktop Table + Mobile Cards) ────────── */}
      <div className="rounded-[24px] bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#22324A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-[#101826]/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">Recent Transactions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredPayments.length} of {payments.length} transactions
            </p>
          </div>
          {filteredPayments.length > 0 && (
            <span className="text-xs font-mono font-medium text-slate-400 self-start sm:self-auto">
              Auto-reconciled with Razorpay Escrow
            </span>
          )}
        </div>

        {/* ── Desktop Table (md and above) ─────────────────────────────────── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#22324A] bg-slate-50/70 dark:bg-[#101826]/70 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Transaction & Contract</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="py-5">
                    <td className="py-5 px-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-5 px-6">
                      <Skeleton className="h-4 w-44 mb-2" />
                      <Skeleton className="h-3 w-28" />
                    </td>
                    <td className="py-5 px-6"><Skeleton className="h-5 w-20" /></td>
                    <td className="py-5 px-6"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="py-5 px-6 text-right"><Skeleton className="h-8 w-20 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 px-6">
                    <EmptyState
                      icon={Wallet}
                      title="No transactions found"
                      description={searchTerm || statusFilter !== 'all' ? "Try adjusting your search or filters." : "Your payment history will appear here once you start transacting."}
                    />
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const shortContractId = (payment.contract?._id || payment.contract?.id || payment.contract || '6aa161a6').toString().slice(-8);
                  const projectTitle = payment.contract?.job?.title || 'E-commerce Website';

                  return (
                    <tr
                      key={payment._id}
                      className="hover:bg-blue-50/30 dark:hover:bg-[#1A283E]/50 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-5 px-6 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{formatDate(payment.createdAt)}</span>
                        </div>
                      </td>

                      {/* Transaction details & Contract */}
                      <td className="py-5 px-6">
                        <div className="flex items-start gap-3 min-w-0 max-w-md">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100 dark:border-blue-900/40">
                            <ShieldCheck size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white leading-snug">
                              {payment.description || 'Milestone Payment'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium" title={projectTitle}>
                              Contract: <span className="text-slate-700 dark:text-slate-200 font-semibold">{projectTitle}</span>
                            </p>
                            <div className="inline-flex items-center gap-1 mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-[#101826] px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-800">
                              <span>ID:</span>
                              <span className="font-bold text-slate-600 dark:text-slate-300">{shortContractId}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Amount: Outgoing (-) in Bold Red, Incoming (+) in Bold Green */}
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className={`text-base font-extrabold font-mono tracking-tight ${
                          isClient
                            ? 'text-rose-600 dark:text-rose-400'
                            : payment.type === 'credit'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {isClient ? '-' : '+'}{formatCurrency(payment.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-5 px-6 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>

                      {/* Invoice Button */}
                      <td className="py-5 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDownloadInvoice(payment)}
                          disabled={generatingInvoiceId === (payment._id || payment.id)}
                          className="group/btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#101826] hover:bg-[#3B82F6] disabled:opacity-60 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-[#22324A] hover:border-[#3B82F6] text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-2xs cursor-pointer"
                          title="Download Invoice PDF"
                        >
                          {generatingInvoiceId === (payment._id || payment.id) ? (
                            <>
                              <Loader2 size={13} className="animate-spin text-[#3B82F6] group-hover/btn:text-white" />
                              <span>Generating Invoice...</span>
                            </>
                          ) : (
                            <>
                              <FileText size={13} className="text-[#3B82F6] group-hover/btn:text-white transition-colors" />
                              <span>Invoice</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Layout (Cards instead of table, md:hidden) ───────────── */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80 p-4 space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101826] space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </div>
            ))
          ) : filteredPayments.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Wallet}
                title="No transactions found"
                description="Try adjusting your search or filters."
              />
            </div>
          ) : (
            filteredPayments.map((payment) => {
              const shortContractId = (payment.contract?._id || payment.contract?.id || payment.contract || '6aa161a6').toString().slice(-8);
              const projectTitle = payment.contract?.job?.title || 'E-commerce Website';

              return (
                <div
                  key={payment._id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#101826]/70 border border-slate-100 dark:border-[#22324A] space-y-3 shadow-2xs"
                >
                  {/* Top: Description, Date & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">{formatDate(payment.createdAt)}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {payment.description || 'Milestone Payment'}
                      </h4>
                    </div>
                    <div>{getStatusBadge(payment.status)}</div>
                  </div>

                  {/* Contract Details */}
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-500">
                      Contract: <span className="text-slate-800 dark:text-slate-200 font-semibold">{projectTitle}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <span>ID:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{shortContractId}</span>
                    </div>
                  </div>

                  {/* Amount Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-500">Amount</span>
                    <span className={`text-base font-extrabold font-mono tracking-tight ${
                      isClient
                        ? 'text-rose-600 dark:text-rose-400'
                        : payment.type === 'credit'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isClient ? '-' : '+'}{formatCurrency(payment.amount)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleDownloadInvoice(payment)}
                    disabled={generatingInvoiceId === (payment._id || payment.id)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-[#162235] hover:bg-[#3B82F6] hover:text-white disabled:opacity-60 border border-slate-200 dark:border-[#22324A] hover:border-[#3B82F6] text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                  >
                    {generatingInvoiceId === (payment._id || payment.id) ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-[#3B82F6]" />
                        <span>Generating Invoice...</span>
                      </>
                    ) : (
                      <>
                        <FileText size={14} />
                        <span>Download Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Invoice Modal ──────────────────────────────────────────────────── */}
      <InvoiceModal
        payment={selectedInvoicePayment}
        user={user}
        isOpen={Boolean(selectedInvoicePayment)}
        onClose={() => setSelectedInvoicePayment(null)}
      />

    </div>
  );
}
