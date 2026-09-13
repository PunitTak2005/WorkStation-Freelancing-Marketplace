import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Briefcase,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Clock,
  Download,
  ShieldAlert,
  CheckCircle2,
  Scale,
  MessageSquare,
  FileText,
  X,
  CheckCheck,
  XCircle,
  CalendarClock,
  ShieldCheck
} from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Skeleton from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import toast from 'react-hot-toast';
import { downloadContractPDF } from '@/utils/pdf';

const TAB_DEFS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'disputed', label: 'Disputed' },
  { id: 'under_review', label: 'Under Review' },
];

export default function ContractsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('status') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contracts, setContracts] = useState([]);
  const [disputeStats, setDisputeStats] = useState({
    activeDisputes: 2,
    underReview: 1,
    resolved: 1,
    escrowHeld: 62000
  });
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDownloadContract = async (contract) => {
    try {
      toast.loading('Generating Contract Agreement PDF...', { id: 'ctr-list-pdf' });
      await downloadContractPDF(contract, user);
      toast.success('Contract Agreement downloaded!', { id: 'ctr-list-pdf', icon: '📄' });
    } catch (err) {
      console.error('Contract PDF error:', err);
      toast.error('Failed to generate contract PDF.', { id: 'ctr-list-pdf' });
    }
  };

  const handleAcceptContract = async (contract) => {
    const toastId = toast.loading('Accepting contract...');
    try {
      await api.patch(`/contracts/${contract._id}/accept`);
      toast.success('Contract accepted! Work begins now. 🎉', { id: toastId });
      fetchContracts();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to accept contract.', { id: toastId });
    }
  };

  const handleDeclineContract = async (contract) => {
    if (!window.confirm(`Decline the contract "${contract.title}"? This cannot be undone.`)) return;
    const toastId = toast.loading('Declining contract...');
    try {
      await api.patch(`/contracts/${contract._id}/decline`);
      toast.success('Contract declined. Escrow will be refunded.', { id: toastId });
      fetchContracts();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to decline contract.', { id: toastId });
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [activeTab]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contracts', {
        params: { status: activeTab !== 'all' ? activeTab : undefined }
      });
      const data = res.data?.data || {};
      setContracts(data.contracts || []);
      if (data.disputeStats) {
        setDisputeStats(data.disputeStats);
      }
      if (data.statusCounts) {
        setStatusCounts(data.statusCounts);
      }
    } catch (error) {
      toast.error('Failed to load contracts');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'disputed': return 'error';
      case 'under_review': return 'warning';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8 animate-fadeIn">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Contracts & Disputes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Manage your active agreements, milestone releases, and mediation cases
          </p>
        </div>
      </div>

      {/* 2. Dispute Overview Card (4 Metrics: Active Disputes, Under Review, Resolved, Escrow Held) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Disputes */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Disputes
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {disputeStats.activeDisputes ?? 2}
            </p>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              Requires scope clarification
            </span>
          </div>
        </div>

        {/* Under Review */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Under Review
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {disputeStats.underReview ?? 1}
            </p>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Platform mediator assigned
            </span>
          </div>
        </div>

        {/* Resolved */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Resolved Disputes
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {disputeStats.resolved ?? 1}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Freelancer Won • ₹46k settled
            </span>
          </div>
        </div>

        {/* Escrow Held */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Escrow Held
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {formatCurrency(disputeStats.escrowHeld ?? 62000)}
            </p>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              Protected in secure escrow
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Contracts Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/70 dark:border-slate-800 overflow-hidden">
        {/* Tabs Row */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 dark:border-slate-800 px-6 pt-2">
          {TAB_DEFS.map((tab) => {
            const count = statusCounts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ status: tab.id });
                }}
                className={cn(
                  "px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative flex items-center gap-2",
                  activeTab === tab.id
                    ? "text-[#0A84FF] dark:text-[#2FA8FF]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <span>{tab.label}</span>
                {count !== undefined && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900/50 text-[#0A84FF] dark:text-[#2FA8FF]"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A84FF] dark:bg-[#2FA8FF]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Contracts Content */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
          ) : contracts.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No contracts found"
              description={`You don't have any ${activeTab !== 'all' ? activeTab.replace('_', ' ') : ''} contracts at the moment.`}
            />
          ) : (
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AnimatePresence>
                {contracts.map((contract) => {
                  const otherParty = user.role === 'client' ? contract.freelancer : contract.client;
                  const completedMilestones = contract.milestones?.filter((m) => m.status === 'approved').length || 0;
                  const totalMilestones = contract.milestones?.length || 0;
                  const progress = contract.progress !== undefined ? contract.progress : (totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0);

                  const isPending = contract.status === 'pending';
                  const isDisputed = contract.status === 'disputed' || contract.dispute?.status === 'disputed';
                  const isUnderReview = contract.status === 'under_review' || contract.dispute?.status === 'under_review';
                  const isResolved = contract.dispute?.status === 'resolved';

                  // Card border color accents
                  let borderClass = 'border-slate-200 dark:border-slate-800';
                  if (isPending) {
                    borderClass = 'border-l-4 border-l-amber-400 border-amber-200 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-950/10';
                  } else if (isDisputed) {
                    borderClass = 'border-l-4 border-l-rose-500 border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10';
                  } else if (isUnderReview) {
                    borderClass = 'border-l-4 border-l-amber-500 border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10';
                  } else if (isResolved) {
                    borderClass = 'border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10';
                  }

                  return (
                    <motion.div
                      key={contract._id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className={cn(
                        "rounded-2xl p-5 border transition-all flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between",
                        borderClass,
                        "hover:shadow-md"
                      )}
                    >
                      {/* Left Block: Status, Title, Client, Reason */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Status badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                          {isPending && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs animate-pulse">
                              <CalendarClock size={12} />
                              <span>Awaiting Acceptance</span>
                            </span>
                          )}
                          {isDisputed && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                              <AlertTriangle size={12} />
                              <span>Disputed</span>
                            </span>
                          )}
                          {isUnderReview && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                              <Clock size={12} />
                              <span>Under Review</span>
                            </span>
                          )}
                          {isResolved && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                              <CheckCircle2 size={12} />
                              <span>Resolved ({contract.dispute?.outcome || 'Freelancer Won'})</span>
                            </span>
                          )}
                          {!isPending && !isDisputed && !isUnderReview && !isResolved && (
                            <Badge variant={getStatusColor(contract.status)} className="capitalize font-bold">
                              {contract.status}
                            </Badge>
                          )}

                          {/* Priority Badge */}
                          {(contract.priority || contract.dispute?.priority) && (
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md text-[11px] font-bold uppercase",
                                (contract.priority === 'high' || contract.dispute?.priority === 'high')
                                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                              )}
                            >
                              {(contract.priority || contract.dispute?.priority)} Priority
                            </span>
                          )}

                          {/* Escrow Tag */}
                          {(isDisputed || isUnderReview) && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              Escrow Held: {formatCurrency(contract.dispute?.escrowHeld || contract.totalAmount)}
                            </span>
                          )}

                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {isPending ? 'Pending Start' : `Started ${formatDate(contract.startDate)}`}
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                            {contract.title || contract.job?.title || 'Contract Agreement'}
                          </h3>
                        </div>

                        {/* Pending: Acceptance Deadline Info Box */}
                        {isPending && (
                          <div className="p-3 rounded-xl text-xs font-medium border leading-relaxed bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300">
                            <span className="font-bold block mb-0.5 flex items-center gap-1">
                              <CalendarClock size={11} /> Acceptance Deadline
                            </span>
                            Review and accept by <strong>15 Sep 2026</strong>. Accepting moves the contract to Active and work begins immediately.
                          </div>
                        )}

                        {/* Dispute Reason Box (non-pending only) */}
                        {!isPending && contract.dispute?.reason && (
                          <div
                            className={cn(
                              "p-3 rounded-xl text-xs font-medium border leading-relaxed",
                              isDisputed
                                ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300"
                                : isUnderReview
                                ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300"
                                : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                            )}
                          >
                            <span className="font-bold block mb-0.5">
                              {isResolved ? 'Resolution Outcome:' : 'Dispute Reason:'}
                            </span>
                            {contract.dispute.reason}
                          </div>
                        )}

                        {/* Client Avatar and Name */}
                        <div className="flex items-center gap-2.5 pt-1">
                          <img
                            src={otherParty?.avatar?.url || otherParty?.profileImage || '/freelancers/rajesh-kumar.webp'}
                            alt={otherParty?.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                            onError={(e) => { e.target.src = '/freelancers/rajesh-kumar.webp'; }}
                          />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Client: <strong className="text-slate-900 dark:text-white font-semibold">{otherParty?.name}</strong>
                          </span>
                          {otherParty?.company && (
                            <span className="text-xs text-slate-400">• {otherParty.company}</span>
                          )}
                        </div>
                      </div>

                      {/* Middle Block: Amount & Progress (hidden for pending) */}
                      <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Total Contract</span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                            {formatCurrency(contract.totalAmount)}
                          </span>
                        </div>

                        {isPending ? (
                          /* Pending: show escrow reserved + deadline instead of progress */
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <ShieldCheck size={12} />
                                Escrow Reserved
                              </span>
                              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                                {formatCurrency(contract.dispute?.escrowHeld || Math.round(contract.totalAmount * 0.3))}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200/70 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-amber-400 dark:bg-amber-500"
                                style={{ width: '30%' }}
                              />
                            </div>
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 text-right font-semibold">
                              30% deposited · Awaiting acceptance
                            </p>
                          </div>
                        ) : (
                          /* Active/other: standard progress bar */
                          <>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 dark:text-slate-400">Progress</span>
                              <span className="font-bold text-slate-900 dark:text-white font-mono">{progress}%</span>
                            </div>

                            <div className="w-full bg-slate-200/70 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                              <div
                                className={cn(
                                  "h-2 rounded-full transition-all duration-500",
                                  isDisputed
                                    ? "bg-rose-500"
                                    : isUnderReview
                                    ? "bg-amber-500"
                                    : isResolved
                                    ? "bg-emerald-500"
                                    : "bg-[#0A84FF]"
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>

                            <p className="text-[11px] text-slate-400 text-right">
                              {completedMilestones} of {totalMilestones} Milestones Completed
                            </p>
                          </>
                        )}
                      </div>

                      {/* Right Block: Action Buttons */}
                      <div className="flex flex-wrap lg:flex-col items-stretch lg:items-end gap-2 w-full lg:w-auto">
                        {/* Pending: Accept + Decline buttons (freelancer only) */}
                        {isPending && user.role === 'freelancer' && (
                          <>
                            <button
                              onClick={() => handleAcceptContract(contract)}
                              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                            >
                              <CheckCheck size={13} />
                              <span>Accept Contract</span>
                            </button>
                            <button
                              onClick={() => handleDeclineContract(contract)}
                              className="px-4 py-1.5 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-all shrink-0"
                            >
                              <XCircle size={13} />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {(isDisputed || isUnderReview || isResolved) && (
                          <button
                            onClick={() => setSelectedCase(contract)}
                            className={cn(
                              "px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0",
                              isDisputed
                                ? "bg-rose-600 hover:bg-rose-700"
                                : isUnderReview
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            )}
                          >
                            <Scale size={13} />
                            <span>View Case</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDownloadContract(contract)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                          title="Download Agreement PDF"
                        >
                          <Download size={13} />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => navigate(`/dashboard/contracts/${contract._id}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors shrink-0"
                        >
                          <span>Details</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* 4. Dispute Details Modal Dialog */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0",
                    selectedCase.status === 'disputed'
                      ? "bg-rose-600"
                      : selectedCase.status === 'under_review'
                      ? "bg-amber-600"
                      : "bg-emerald-600"
                  )}
                >
                  <Scale size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {selectedCase.title || selectedCase.job?.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispute Case Reference #{selectedCase._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize text-xs">
                    {selectedCase.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Escrow Held</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                    {formatCurrency(selectedCase.dispute?.escrowHeld || selectedCase.totalAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Priority</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize text-xs">
                    {selectedCase.dispute?.priority || selectedCase.priority || 'Medium'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedCase.progress}%</span>
                </div>
              </div>

              {/* Case Reason */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  Case Details & Stated Reason
                </h4>
                <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 text-xs leading-relaxed">
                  {selectedCase.dispute?.reason || 'No detailed dispute description recorded.'}
                </div>
              </div>

              {/* Milestones Breakdown */}
              {selectedCase.milestones && selectedCase.milestones.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Milestones Breakdown
                  </h4>
                  <div className="space-y-2">
                    {selectedCase.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              m.status === 'approved'
                                ? "bg-emerald-500"
                                : m.status === 'disputed'
                                ? "bg-rose-500"
                                : m.status === 'in_progress'
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            )}
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {m.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {formatCurrency(m.amount)}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold capitalize",
                              m.status === 'approved'
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : m.status === 'disputed'
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                            )}
                          >
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution / Review Timeline */}
              {selectedCase.dispute?.reviewDeadline && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="shrink-0" />
                    <span>Mediator Estimated Resolution Target:</span>
                  </span>
                  <strong className="font-bold">
                    {formatDate(selectedCase.dispute.reviewDeadline)}
                  </strong>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  navigate('/dashboard/messages');
                }}
                className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] font-semibold text-xs flex items-center gap-1.5 hover:bg-blue-100"
              >
                <MessageSquare size={13} />
                <span>Open Case Chat</span>
              </button>
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
