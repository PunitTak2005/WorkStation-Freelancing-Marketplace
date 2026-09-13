import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Calendar, Briefcase, Paperclip, ChevronRight,
  ShieldCheck, Star, Bookmark, ArrowRight, CheckCircle2,
  Users, AlertCircle, Share2, Layers, IndianRupee, Sparkles, Building
} from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Card from '@/components/common/Card';
import Skeleton from '@/components/common/Skeleton';
import StatusBadge from '@/components/common/StatusBadge';
import JobCard from '../components/JobCard';
import SimilarOpportunitiesSection from '../components/SimilarOpportunitiesSection';
import ProposalModal from '../../proposals/components/ProposalModal';
import { formatCurrency, timeAgo, formatDate } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import jobService from '@/services/jobService';
import chatService from '@/services/chatService';
import toast from 'react-hot-toast';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        if (isMounted && res.data?.data) {
          const jobData = res.data.data.job || res.data.data;
          setJob(jobData);
          setSimilarJobs(res.data.data.similarJobs || []);
          setHasApplied(res.data.data.hasApplied || false);
        }
      } catch (error) {
        if (isMounted) {
          setJob(null);
          setSimilarJobs([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved jobs' : 'Job saved to your bookmarks');
  };

  const handleApplyClick = () => {
    if (!user) {
      toast.error('Please sign in to submit a proposal');
      navigate('/login');
      return;
    }
    if (user.role === 'client') {
      toast.error('Clients cannot apply for jobs. Please use a Freelancer account.');
      return;
    }
    setIsModalOpen(true);
  };

  // Calculate days remaining
  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return 14;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-48 mb-6 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-80 rounded-3xl" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-72 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20">
        <div className="text-center p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The requested project listing does not exist or has expired.</p>
          <Link to="/jobs">
            <Button variant="primary">Browse Open Opportunities</Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(job.deadline);
  const clientName = typeof job.client === 'object' ? (job.client?.name || 'Verified Client') : (job.client || 'Verified Client');
  const clientRating = typeof job.client === 'object' ? (job.client?.ratingsAverage || job.client?.rating || 4.9) : 4.9;
  const proposalCount = job.proposalCount ?? job.proposalsCount ?? 14;
  const categoryName = typeof job.category === 'object' ? (job.category?.name || 'General') : (job.category || 'General');

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#080B12] text-slate-900 dark:text-slate-100 pt-24 pb-28 sm:pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-[#5B6B7A] dark:text-[#A8C0D8] mb-6 space-x-2 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/jobs" className="hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors">Projects</Link>
          <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
          <Link to={`/jobs?category=${encodeURIComponent(categoryName)}`} className="hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors">
            {categoryName}
          </Link>
          <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-xs sm:max-w-md">{job.title}</span>
        </nav>

        {/* 1. Hero Section Card */}
        <div className="p-5 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-2xl shadow-workstation-card dark:shadow-workstation-dark mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF6FF] dark:bg-[#0A84FF]/20 text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#0A84FF]/30">
                  {categoryName}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                  Live MongoDB Project
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FBFF] dark:bg-[#162235] text-slate-700 dark:text-[#A8C0D8] border border-[#D6EFFF] dark:border-[#22324A] capitalize">
                  {job.experienceLevel || 'Intermediate'} Level
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FBFF] dark:bg-[#162235] text-slate-700 dark:text-[#A8C0D8] border border-[#D6EFFF] dark:border-[#22324A] capitalize">
                  {job.locationType || 'Remote'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#5B6B7A] dark:text-[#A8C0D8] pt-1">
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" />
                  Posted {timeAgo(job.createdAt || new Date())}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  Deadline: {formatDate(job.deadline || new Date(Date.now() + 14 * 86400000))}
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <ShieldCheck size={14} />
                  Escrow Verified
                </span>
              </div>
            </div>

            {/* Bookmark & Share Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={toggleSave}
                className="p-3 rounded-2xl bg-[#EAF6FF] dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] text-slate-700 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
                title={isSaved ? 'Remove bookmark' : 'Bookmark project'}
              >
                <Bookmark size={18} className={isSaved ? 'fill-[#0A84FF] text-[#0A84FF]' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Full Project Information */}
          <div className="lg:col-span-8 space-y-8">
            {/* Project Banner / Thumbnail Image */}
            {job.image && (
              <div className="relative rounded-3xl overflow-hidden border border-[#D6EFFF] dark:border-[#22324A] shadow-md group">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-64 sm:h-80 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-4 left-5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-white backdrop-blur-md border border-white/20">
                  {categoryName} • Official Workspace Preview
                </span>
              </div>
            )}

            {/* Full Project Description */}
            <Card glass className="p-5 sm:p-8 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-display">Project Overview & Scope</h2>
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-[#A8C0D8] text-sm leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Structured Deliverables Breakdown */}
              <div className="pt-6 border-t border-[#D6EFFF] dark:border-[#22324A]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 font-display">Key Deliverables & Responsibilities</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-[#A8C0D8]">
                  {job.deliverables && job.deliverables.length > 0 ? (
                    job.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Deliver fully tested, clean modular code adhering to production coding standards.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Collaborate transparently through Socket.io chat and provide weekly milestone updates.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Conduct integration testing and provide clear setup documentation for deployment.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Skills Required Chips */}
              <div className="pt-6 border-t border-[#D6EFFF] dark:border-[#22324A]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 font-display">Required Technical Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {(job.skillsRequired || job.skills || ['Full Stack', 'Web Development']).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#EAF6FF] dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] text-xs font-semibold text-[#002366] dark:text-[#A8C0D8] hover:border-[#0A84FF]/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attachments if present */}
              {job.attachments?.length > 0 && (
                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-base font-bold text-white mb-3">Project Attachments & Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 transition-colors"
                      >
                        <Paperclip size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                        <span className="truncate">{file.fileName || file.name || `Attachment ${idx + 1}`}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Pricing & Milestone Structure Card */}
            <Card glass className="p-5 sm:p-8 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-display">Budget & Payment Structure</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Budget Allocation</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono flex items-center">
                    <IndianRupee size={18} className="text-emerald-500 mr-0.5" />
                    <span>{formatCurrency(job.budget?.min || 20000)} – {formatCurrency(job.budget?.max || 50000)}</span>
                  </div>
                  <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] capitalize">{job.budget?.type || 'fixed'} Price</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Payment Method</span>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Escrow Milestones</div>
                  <span className="text-[11px] text-emerald-500 font-medium">Funds Released Upon Approval</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Expected Timeline</span>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{daysRemaining} Days Delivery</div>
                  <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8]">Subject to Proposal</span>
                </div>
              </div>
            </Card>

            {/* Similar Opportunities — premium redesigned section */}
            <SimilarOpportunitiesSection similarJobs={similarJobs} loading={loading} currentJobId={job?._id || job?.id} />
          </div>

          {/* Right Column: Sticky Proposal & Client Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sticky Application Card */}
            <Card glass className="p-5 sm:p-7 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/95 dark:bg-[#101826]/95 sticky top-24 shadow-workstation-card dark:shadow-workstation-dark">
              <div className="pb-5 border-b border-[#D6EFFF] dark:border-[#22324A] space-y-1">
                <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">Estimated Project Value</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono flex items-center">
                  <IndianRupee size={22} className="text-emerald-500 mr-1" />
                  <span>{formatCurrency(job.budget?.min || 20000)} – {formatCurrency(job.budget?.max || 50000)}</span>
                </div>
              </div>

              {/* Deadline & Proposal Telemetry */}
              <div className="py-5 space-y-3.5 text-xs border-b border-[#D6EFFF] dark:border-[#22324A]">
                <div className="flex justify-between items-center">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8] flex items-center gap-1.5">
                    <Clock size={14} className="text-[#0A84FF]" /> Time Remaining
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{daysRemaining} Days Left</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8] flex items-center gap-1.5">
                    <Users size={14} className="text-[#2FA8FF]" /> Proposals Received
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{proposalCount} Submitted</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8] flex items-center gap-1.5">
                    <Briefcase size={14} className="text-amber-500" /> Experience Tier
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{job.experienceLevel || 'Intermediate'}</span>
                </div>
              </div>

              {/* Application CTA */}
              <div className="pt-6">
                {hasApplied ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center text-xs font-semibold">
                    <CheckCircle2 size={18} className="mx-auto mb-1 text-emerald-500" />
                    <span>Proposal Successfully Submitted</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleApplyClick}
                    className="w-full justify-center shadow-xl shadow-[#0A84FF]/25 text-sm font-bold"
                  >
                    <span>Submit a Proposal</span>
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                )}
                <p className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] text-center mt-2.5">
                  Milestone funds guaranteed in escrow upon client contract acceptance.
                </p>
              </div>
            </Card>

            {/* Client Profile Card */}
            <Card glass className="p-5 sm:p-7 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/95 dark:bg-[#101826]/95 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                About the Client
              </h3>

              <div className="flex items-center gap-3.5">
                <Avatar
                  size="lg"
                  name={clientName}
                  src={typeof job.client === 'object' ? job.client?.avatar?.url || job.client?.avatar : null}
                  className="rounded-2xl ring-2 ring-[#0A84FF]/30 shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{clientName}</h4>
                    <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" title="Verified Enterprise Client" />
                  </div>
                  {(job.company || (typeof job.client === 'object' && job.client?.company)) && (
                    <p className="text-xs font-semibold text-[#0A84FF] dark:text-[#2FA8FF] truncate flex items-center gap-1 mt-0.5">
                      <Building size={12} className="flex-shrink-0" />
                      <span>{job.company || job.client?.company}</span>
                    </p>
                  )}
                  <div className="flex items-center text-xs text-amber-500 mt-0.5">
                    <Star size={13} className="fill-current mr-1 flex-shrink-0" />
                    <span>{typeof clientRating === 'number' ? clientRating.toFixed(1) : '4.9'} Client Rating</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs">
                <div>
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8] block">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#0A84FF]" />
                    {typeof job.client === 'object' ? job.client?.location || 'Bengaluru, IN' : 'Bengaluru, IN'}
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8] block">Hiring History</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">50+ Jobs Posted</span>
                </div>
              </div>

              <Link to="/freelancers" className="block w-full">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs border-[#D6EFFF] dark:border-[#22324A]">
                  View Client Profile
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Apply Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#080B12]/95 border-t border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-xl z-30 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] block">Project Budget</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            ₹{job.budget?.min ? formatCurrency(job.budget.min) : '20,000'} - ₹{job.budget?.max ? formatCurrency(job.budget.max) : '50,000'}
          </span>
        </div>

        {hasApplied ? (
          <Button variant="secondary" size="sm" disabled>
            Applied
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={handleApplyClick} className="shadow-lg shadow-[#0A84FF]/25">
            Apply Now
          </Button>
        )}
      </div>

      {/* Proposal Submission Modal */}
      {isModalOpen && (
        <ProposalModal
          jobId={job._id || job.id}
          jobBudget={job.budget}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setHasApplied(true);
            toast.success('Your proposal has been registered in the system!');
          }}
        />
      )}
    </div>
  );
}
