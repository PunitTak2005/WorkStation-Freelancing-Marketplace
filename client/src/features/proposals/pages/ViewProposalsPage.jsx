import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, Star, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import StatusBadge from '@/components/common/StatusBadge';
import Skeleton from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency, timeAgo } from '@/utils/formatters';
import { toast } from 'react-hot-toast';
import api from '@/services/api';

const ViewProposalsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  
  // Dialogs
  const [actionDialog, setActionDialog] = useState({ isOpen: false, proposalId: null, action: null });

  useEffect(() => {
    const fetchJobAndProposals = async () => {
      try {
        setLoading(true);
        // Using Promise.all to fetch both in parallel
        const [jobRes, proposalsRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/jobs/${jobId}/proposals`)
        ]);
        
        setJob(jobRes.data?.data?.job || jobRes.data?.job || null);
        const rawProposals = proposalsRes.data?.data?.proposals || proposalsRes.data?.data || proposalsRes.data?.proposals || [];
        setProposals(Array.isArray(rawProposals) ? rawProposals : []);
      } catch (error) {
        console.error('Failed to fetch data', error);
        toast.error('Failed to load proposals');
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobAndProposals();
  }, [jobId]);

  const handleStatusUpdate = async () => {
    const { proposalId, action } = actionDialog;
    try {
      await api.put(`/proposals/${proposalId}/status`, { status: action });
      toast.success(`Proposal ${action} successfully`);
      
      // Update local state
      setProposals(prev => (Array.isArray(prev) ? prev : []).map(p => 
        p._id === proposalId ? { ...p, status: action } : p
      ));
      
      if (action === 'accepted') {
        // If accepted, update job status as well
        setJob(prev => ({ ...prev, status: 'in_progress' }));
        // Other pending proposals get rejected backend-side ideally, but let's refresh
        const res = await api.get(`/jobs/${jobId}/proposals`);
        const refreshed = res.data?.data?.proposals || res.data?.data || res.data?.proposals || [];
        setProposals(Array.isArray(refreshed) ? refreshed : []);
      }
      
      setActionDialog({ isOpen: false, proposalId: null, action: null });
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} proposal`);
    }
  };

  const proposalItems = Array.isArray(proposals) ? proposals : [];
  const filteredProposals = proposalItems.filter(p => activeTab === 'all' || p.status === activeTab);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-8 space-y-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-8">
        {/* Job Summary */}
        <div className="glass-card p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white line-clamp-1">{job?.title}</h1>
              <StatusBadge status={job?.status} />
            </div>
            <div className="flex flex-wrap text-sm text-slate-500 gap-4">
              <span>Budget: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(job?.budget?.min)} - {formatCurrency(job?.budget?.max)}</strong></span>
              <span>Posted: <strong className="text-slate-700 dark:text-slate-300">{timeAgo(job?.createdAt)}</strong></span>
              <span>Total Proposals: <strong className="text-slate-700 dark:text-slate-300">{proposals.length}</strong></span>
            </div>
          </div>
          <Link to={`/jobs/${jobId}`}>
            <Button variant="outline" icon={FileText}>View Job Post</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-slate-200 dark:border-slate-700">
          {['all', 'pending', 'shortlisted'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab} ({proposals.filter(p => tab === 'all' || p.status === tab).length})
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {filteredProposals.length > 0 ? (
            filteredProposals.map(proposal => (
              <div key={proposal._id} className="glass-card overflow-hidden transition-all duration-300">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Freelancer Info */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 pb-6 lg:pb-0 lg:pr-6">
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={proposal.freelancer?.name === 'Mayank Joshi'
                            ? '/freelancers/mayank-joshi.png'
                            : proposal.freelancer?.name === 'Abhishek Nayak'
                            ? '/freelancers/abhishek-nayak.png'
                            : (proposal.freelancer?.image || proposal.freelancer?.avatar?.url || proposal.freelancer?.avatar || '/freelancers/aarav-desai.webp')}
                          name={proposal.freelancer?.name}
                          size="lg"
                        />
                        <div>
                          <Link to={`/freelancers/${proposal.freelancer?._id}`} className="font-semibold text-lg text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                            {proposal.freelancer?.name}
                          </Link>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {proposal.freelancer?.title && proposal.freelancer?.title.toLowerCase() !== 'specialist'
                              ? proposal.freelancer?.title
                              : (proposal.freelancer?.name === 'Mayank Joshi' ? 'Full Stack Developer' : (proposal.freelancer?.skills?.[0] ? `${proposal.freelancer?.skills[0]} Developer` : 'Full Stack Developer'))}
                          </p>
                          <div className="flex items-center text-sm mt-1 text-amber-500 font-medium">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {proposal.freelancer?.rating || 0} <span className="text-slate-400 ml-1 font-normal">({proposal.freelancer?.reviewsCount || 0})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                        <div>
                          <span className="text-slate-500 block">Location</span>
                          <span className="font-medium text-slate-900 dark:text-white">{proposal.freelancer?.location || 'Remote'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Rate</span>
                          <span className="font-medium text-slate-900 dark:text-white text-emerald-600">₹{proposal.freelancer?.hourlyRate}/hr</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {proposal.freelancer?.skills?.slice(0, 4).map(skill => (
                          <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Proposal Content */}
                    <div className="w-full lg:w-2/3 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-6">
                          <div>
                            <span className="text-slate-500 text-sm block">Bid Amount</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(proposal.bidAmount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-sm block">Delivery Time</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">{proposal.deliveryTime} days</span>
                          </div>
                        </div>
                        <StatusBadge status={proposal.status} />
                      </div>

                      <div className={`prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm mb-4 ${expandedId === proposal._id ? '' : 'line-clamp-3'}`}>
                        {proposal.coverLetter}
                      </div>
                      
                      {proposal.coverLetter.length > 250 && (
                        <button 
                          onClick={() => setExpandedId(expandedId === proposal._id ? null : proposal._id)}
                          className="text-indigo-600 text-sm font-medium self-start flex items-center hover:underline mb-4"
                        >
                          {expandedId === proposal._id ? <><ChevronUp className="w-4 h-4 mr-1" /> Show Less</> : <><ChevronDown className="w-4 h-4 mr-1" /> Read Full Letter</>}
                        </button>
                      )}

                      {proposal.milestones?.length > 0 && expandedId === proposal._id && (
                        <div className="mt-4 mb-6">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Proposed Milestones</h4>
                          <div className="space-y-2">
                            {proposal.milestones.map((m, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{idx + 1}. {m.title}</span>
                                <div className="flex gap-4">
                                  <span className="text-slate-500">{formatDate(m.deadline)}</span>
                                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(m.amount)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        {proposal.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              onClick={() => setActionDialog({ isOpen: true, proposalId: proposal._id, action: 'rejected' })}
                            >
                              Decline
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => setActionDialog({ isOpen: true, proposalId: proposal._id, action: 'shortlisted' })}
                            >
                              Shortlist
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => setActionDialog({ isOpen: true, proposalId: proposal._id, action: 'accepted' })}
                              icon={Check}
                            >
                              Accept & Hire
                            </Button>
                          </>
                        )}
                        {proposal.status === 'shortlisted' && (
                          <>
                            <Button 
                              variant="outline" 
                              onClick={() => setActionDialog({ isOpen: true, proposalId: proposal._id, action: 'rejected' })}
                            >
                              Decline
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={() => setActionDialog({ isOpen: true, proposalId: proposal._id, action: 'accepted' })}
                              icon={Check}
                            >
                              Accept & Hire
                            </Button>
                          </>
                        )}
                        <Link to={`/messages?user=${proposal.freelancer?._id}`}>
                          <Button variant="outline">Message</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              title="No proposals found" 
              description={`There are no ${activeTab === 'all' ? '' : activeTab} proposals for this job yet.`}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={actionDialog.isOpen}
        title={actionDialog.action === 'accepted' ? 'Accept Proposal & Hire' : actionDialog.action === 'shortlisted' ? 'Shortlist Proposal' : 'Decline Proposal'}
        message={
          actionDialog.action === 'accepted' 
            ? "Are you sure you want to hire this freelancer? This will create a contract and automatically decline all other pending proposals for this job." 
            : `Are you sure you want to ${actionDialog.action === 'rejected' ? 'decline' : 'shortlist'} this proposal?`
        }
        confirmText={actionDialog.action === 'accepted' ? 'Yes, Hire Freelancer' : 'Confirm'}
        cancelText="Cancel"
        onConfirm={handleStatusUpdate}
        onCancel={() => setActionDialog({ isOpen: false, proposalId: null, action: null })}
        variant={actionDialog.action === 'rejected' ? 'danger' : 'primary'}
      />
    </DashboardLayout>
  );
};

export default ViewProposalsPage;
