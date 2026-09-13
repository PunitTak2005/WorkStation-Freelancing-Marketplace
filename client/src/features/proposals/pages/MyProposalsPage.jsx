import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, XCircle, Search, Clock, DollarSign, Calendar,
  Building, CheckCircle, ArrowUpRight, AlertCircle, FileText,
  SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import Skeleton from '@/components/common/Skeleton';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'react-hot-toast';
import api from '@/services/api';

/**
 * Normalizes any proposal API response shape into a guaranteed JavaScript Array.
 * Handles:
 * - [ ... ]
 * - { data: { proposals: [ ... ] } }
 * - { proposals: [ ... ] }
 * - { data: [ ... ] }
 */
export const normalizeProposals = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (!responseData || typeof responseData !== 'object') {
    return [];
  }
  // Check nested responseData.data.proposals (standard ApiResponse with object)
  if (responseData.data && Array.isArray(responseData.data.proposals)) {
    return responseData.data.proposals;
  }
  // Check responseData.data if it's already an array
  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }
  // Check top-level responseData.proposals
  if (Array.isArray(responseData.proposals)) {
    return responseData.proposals;
  }
  return [];
};

/**
 * Extracts pagination data safely from response
 */
export const extractPagination = (responseData, fallbackCount = 0) => {
  const pag = responseData?.data?.pagination || responseData?.pagination || {};
  const page = Number(pag.currentPage || pag.page || 1);
  const limit = Number(pag.limit || 10);
  const total = Number(pag.totalResults ?? pag.total ?? fallbackCount ?? 0);
  const totalPages = Number(pag.totalPages || Math.ceil(total / limit) || 1);
  return { page, limit, totalPages, total };
};

const MyProposalsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [statusCounts, setStatusCounts] = useState({
    all: 12,
    accepted: 5,
    shortlisted: 2,
    pending: 2,
    rejected: 3
  });
  const [withdrawDialog, setWithdrawDialog] = useState({ isOpen: false, proposalId: null });

  const tabs = [
    { id: 'all', label: 'All', countKey: 'all' },
    { id: 'accepted', label: 'Accepted', countKey: 'accepted' },
    { id: 'shortlisted', label: 'Shortlisted', countKey: 'shortlisted' },
    { id: 'pending', label: 'Pending', countKey: 'pending' },
    { id: 'rejected', label: 'Rejected', countKey: 'rejected' },
  ];

  const fetchProposals = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (activeTab !== 'all') params.status = activeTab;
      
      const res = await api.get('/proposals/my-proposals', { params });
      
      // Normalize response into guaranteed array
      const normalizedList = normalizeProposals(res.data);
      setProposals(normalizedList);

      // Extract real-time status counts from backend aggregation
      const counts = res.data?.data?.statusCounts || res.data?.statusCounts;
      if (counts) {
        setStatusCounts(counts);
      }

      // Extract pagination details
      const pagDetails = extractPagination(res.data, normalizedList.length);
      setPagination(pagDetails);
    } catch (error) {
      console.error('Failed to fetch proposals', error);
      toast.error('Failed to load your proposals');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals(1);
  }, [activeTab]);

  const handleWithdraw = async () => {
    try {
      await api.delete(`/proposals/${withdrawDialog.proposalId}`);
      toast.success('Proposal withdrawn successfully');
      setWithdrawDialog({ isOpen: false, proposalId: null });
      fetchProposals(pagination.page);
    } catch (error) {
      try {
        await api.put(`/proposals/${withdrawDialog.proposalId}/status`, { status: 'withdrawn' });
        toast.success('Proposal withdrawn successfully');
        setWithdrawDialog({ isOpen: false, proposalId: null });
        fetchProposals(pagination.page);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to withdraw proposal');
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'shortlisted':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'rejected':
        return 'bg-rose-600 text-white font-bold border-transparent shadow-xs';
      case 'withdrawn':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      case 'pending':
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Pending';
    if (status === 'shortlisted') return 'Shortlisted';
    if (status === 'accepted') return 'Accepted';
    if (status === 'rejected') return 'Rejected';
    if (status === 'withdrawn') return 'Withdrawn';
    return status || 'Pending';
  };

  // Safe Rendering: Always validate proposals is an array
  const safeProposals = Array.isArray(proposals) ? proposals : [];

  // Filter and sort proposals
  const filteredAndSortedProposals = useMemo(() => {
    let result = [...safeProposals];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(proposal => {
        const job = proposal.job || {};
        const client = job.client || {};
        const title = (job.title || '').toLowerCase();
        const clientName = (client.name || '').toLowerCase();
        const coverLetter = (proposal.coverLetter || '').toLowerCase();
        const rejectionReason = (proposal.rejectionReason || '').toLowerCase();
        return (
          title.includes(term) ||
          clientName.includes(term) ||
          coverLetter.includes(term) ||
          rejectionReason.includes(term)
        );
      });
    }

    if (sortBy === 'highest-bid') {
      result.sort((a, b) => (b.bidAmount || 0) - (a.bidAmount || 0));
    } else if (sortBy === 'lowest-bid') {
      result.sort((a, b) => (a.bidAmount || 0) - (b.bidAmount || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [safeProposals, searchTerm, sortBy]);

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Freelancer Applications
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {statusCounts.all} total applications • {statusCounts.accepted} accepted • {statusCounts.rejected} rejected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Submitted Proposals
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Track application statuses, client review feedback, and project bidding analytics.
          </p>
        </div>

        <Link to="/jobs">
          <Button icon={Search} className="shadow-xs">
            Explore Projects
          </Button>
        </Link>
      </div>

      {/* Controls Bar: Tabs, Search, and Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Tabs Filter with Accurate Status Counts */}
        <div className="flex space-x-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map(tab => {
            const count = statusCounts[tab.countKey] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : tab.id === 'rejected'
                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      : tab.id === 'accepted'
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search proposals or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest-bid">Highest Bid</option>
              <option value="lowest-bid">Lowest Bid</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-1/4 rounded" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedProposals.length === 0 ? (
        <div className="py-8">
          <EmptyState 
            title={searchTerm ? "No matching proposals found" : `No ${activeTab !== 'all' ? getStatusLabel(activeTab) : ''} proposals`} 
            description={
              searchTerm 
                ? `No applications matched "${searchTerm}". Try adjusting your keywords or clearing the search filter.`
                : activeTab === 'all' 
                  ? "You haven't submitted any proposals yet. Browse available jobs and pitch your expertise to get hired." 
                  : `You currently have 0 proposals under "${getStatusLabel(activeTab)}".`
            }
            action={
              searchTerm ? (
                <Button onClick={() => setSearchTerm('')} variant="outline" size="sm">
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => navigate('/jobs')} icon={Search}>
                  Explore Projects
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {filteredAndSortedProposals.map(proposal => {
              const job = proposal.job || {};
              const client = job.client || {};
              const isPending = proposal.status === 'pending';
              const isRejected = proposal.status === 'rejected';

              return (
                <div
                  key={proposal._id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                    isRejected ? 'border-l-4 border-l-rose-500 dark:border-l-rose-500' : ''
                  }`}
                >
                  <div>
                    {/* Top Row: Status Badge and Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border whitespace-nowrap shrink-0 ${getStatusBadgeVariant(proposal.status)}`}>
                        {getStatusLabel(proposal.status)}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(proposal.createdAt)}
                        </span>
                        {isRejected && (proposal.decidedAt || proposal.updatedAt) && (
                          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            • Decided {formatDate(proposal.decidedAt || proposal.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Project Title */}
                    <Link
                      to={`/jobs/${job._id || ''}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 transition-colors mb-2 block min-w-0"
                    >
                      {job.title || 'Project Proposal'}
                    </Link>

                    {/* Client Info */}
                    <div className="flex items-center gap-2.5 py-2">
                      <Avatar
                        name={client.name || 'Client'}
                        src={client.avatar?.url || client.avatar || client.profileImage}
                        size="sm"
                        className={isRejected ? 'opacity-90 grayscale-[20%]' : ''}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {client.name || 'Hiring Client'}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {client.company || client.industry || 'Client Organization'}
                        </p>
                      </div>
                    </div>

                    {/* Bid & Delivery Grid */}
                    <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider block truncate">
                          Your Bid
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate block">
                          {formatCurrency(proposal.bidAmount)}
                        </span>
                      </div>
                      <div className="text-right min-w-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider block truncate">
                          Estimated Delivery
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate block">
                          {proposal.deliveryTime ? `${proposal.deliveryTime} days` : 'Flexible'}
                        </span>
                      </div>
                    </div>

                    {/* Rejection Feedback / Reason (if rejected) */}
                    {isRejected && proposal.rejectionReason && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 text-xs">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                            <AlertCircle size={13} />
                            Client Feedback
                          </span>
                          {proposal.decidedAt && (
                            <span className="text-[10px] font-medium text-rose-500/80 dark:text-rose-400/80">
                              Decided {formatDate(proposal.decidedAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          "{proposal.rejectionReason}"
                        </p>
                      </div>
                    )}

                    {/* Cover Letter Snippet */}
                    {!isRejected && proposal.coverLetter && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 italic">
                        "{proposal.coverLetter}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                    <Link
                      to={`/jobs/${job._id || ''}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                    >
                      <span>View Project Details</span>
                      <ArrowUpRight size={14} />
                    </Link>

                    {isPending && (
                      <button
                        onClick={() => setWithdrawDialog({ isOpen: true, proposalId: proposal._id })}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                      >
                        <XCircle size={14} />
                        <span>Withdraw Bid</span>
                      </button>
                    )}

                    {isRejected && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
                        <span>Position Filled</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination 
                currentPage={pagination.page} 
                totalPages={pagination.totalPages} 
                onPageChange={fetchProposals} 
              />
            </div>
          )}
        </div>
      )}

      {/* Withdraw Proposal Confirm Dialog */}
      <ConfirmDialog
        isOpen={withdrawDialog.isOpen}
        title="Withdraw Proposal"
        message="Are you sure you want to withdraw this proposal? You will no longer be considered for this project."
        confirmText="Withdraw Proposal"
        cancelText="Keep Proposal"
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawDialog({ isOpen: false, proposalId: null })}
        variant="danger"
      />
    </div>
  );
};

export default MyProposalsPage;
