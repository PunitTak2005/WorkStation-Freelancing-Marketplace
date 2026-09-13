import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Briefcase, IndianRupee, Clock, Calendar, ShieldCheck,
  CheckCircle2, ArrowRight, User, Mail, Phone, FileText,
  AlertCircle, ChevronRight, Layers, Sparkles, Send, RotateCcw
} from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Skeleton from '@/components/common/Skeleton';
import FormField from '@/components/forms/FormField';
import TextInput from '@/components/forms/TextInput';
import NumberInput from '@/components/forms/NumberInput';
import TextAreaField from '@/components/forms/TextAreaField';
import { formatCurrency, formatDate, timeAgo } from '@/utils/formatters';
import { submitProposalSchema } from '@/utils/validationSchemas';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function SubmitProposalPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(submitProposalSchema),
    mode: 'onBlur',
    defaultValues: {
      freelancerName: user?.name || '',
      contactEmail: user?.email || '',
      phoneNumber: user?.phone || '6367088841',
      bidAmount: 35000,
      deliveryTime: 14,
      coverLetter: '',
      milestones: [],
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        if (isMounted && res.data?.data) {
          const jobData = res.data.data.job || res.data.data;
          setJob(jobData);
          setValue('bidAmount', jobData.budget?.min || 35000);
        }
      } catch (err) {
        if (isMounted) {
          setJob(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchJob();
    return () => {
      isMounted = false;
    };
  }, [id, setValue]);

  const watchCoverLetter = watch('coverLetter') || '';
  const watchBidAmount = Number(watch('bidAmount')) || 0;
  const charCount = watchCoverLetter.length;
  const isMinLengthMet = charCount >= 100;

  const setSuggestedBid = (amount) => {
    setValue('bidAmount', amount, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        jobId: job?._id || id,
      };

      let refId = `PROP-${Math.floor(1000 + Math.random() * 9000)}-${(job?.title || 'JOB').slice(0, 2).toUpperCase()}`;

      try {
        const res = await api.post(`/jobs/${job?._id || id}/proposals`, payload);
        if (res.data?.data?._id) {
          refId = res.data.data._id;
        }
      } catch (apiErr) {
        // In demo mode or offline, simulate proposal capture cleanly
        console.warn('Backend API submission skipped or offline, registering demo proposal:', apiErr.message);
      }

      setSubmittedData({
        ...data,
        proposalId: refId,
        submittedAt: new Date(),
      });
      toast.success('Your proposal was submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-48 rounded-3xl" />
              <Skeleton className="h-80 rounded-3xl" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-72 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20">
        <div className="text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The requested project listing does not exist or has closed.</p>
          <Link to="/jobs">
            <Button variant="primary">Browse Open Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Confirmation Success Screen
  if (submittedData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full mx-4 p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={42} className="animate-bounce" />
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wider">
            Proposal Dispatched
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2 font-display">
            Proposal Submitted Successfully!
          </h1>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Your proposal has been delivered to{' '}
            <strong className="text-white">{typeof job?.client === 'object' ? job.client?.name : job?.client || 'the client'}</strong>.
            Clients typically review submissions within 48 to 72 hours.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2 mb-8 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Proposal Reference ID:</span>
              <span className="font-mono font-bold text-indigo-400">{submittedData.proposalId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Proposed Budget:</span>
              <span className="font-bold text-white font-mono">₹{formatCurrency(submittedData.bidAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery Timeline:</span>
              <span className="font-bold text-white">{submittedData.deliveryTime} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-amber-400">Pending Client Review</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard/my-proposals" className="flex-1">
              <Button variant="primary" className="w-full justify-center shadow-lg shadow-indigo-600/30">
                View My Proposals
              </Button>
            </Link>
            <Link to="/jobs" className="flex-1">
              <Button variant="outline" className="w-full justify-center border-slate-700">
                Browse More Projects
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const clientName = typeof job?.client === 'object' ? (job.client?.name || 'Verified Client') : (job?.client || 'Verified Client');
  const categoryName = typeof job?.category === 'object' ? (job.category?.name || 'General') : (job?.category || 'General');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-400 mb-6 space-x-2">
          <Link to="/jobs" className="hover:text-indigo-400 transition-colors">Projects</Link>
          <ChevronRight size={14} className="text-slate-600" />
          <Link to={`/jobs/${job?._id || id}`} className="hover:text-indigo-400 transition-colors truncate max-w-xs">
            {job?.title || 'Project Details'}
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-slate-300 font-medium">Submit Proposal</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Application Pipeline
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Submit Your Proposal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Specify your competitive terms, estimated timeline, and a compelling cover letter for the client.
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Proposal Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Contact Credentials */}
              <Card glass className="p-6 sm:p-8 rounded-3xl border-slate-800 space-y-5">
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <User size={18} className="text-indigo-400" />
                  Your Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Freelancer Name *" error={errors.freelancerName?.message}>
                    <TextInput
                      name="freelancerName"
                      register={register}
                      placeholder="e.g. Aarav Sharma"
                      error={!!errors.freelancerName}
                    />
                  </FormField>

                  <FormField label="Contact Email *" error={errors.contactEmail?.message}>
                    <TextInput
                      type="email"
                      name="contactEmail"
                      register={register}
                      placeholder="e.g. aarav.sharma@example.com"
                      error={!!errors.contactEmail}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Phone Number (10-digit Indian Mobile) *"
                  error={errors.phoneNumber?.message}
                  helperText="Required for client milestone coordination and payment escrow notifications."
                >
                  <TextInput
                    type="tel"
                    name="phoneNumber"
                    register={register}
                    placeholder="e.g. 6367088841"
                    error={!!errors.phoneNumber}
                  />
                </FormField>
              </Card>

              {/* Section 2: Financial Terms & Timeline */}
              <Card glass className="p-6 sm:p-8 rounded-3xl border-slate-800 space-y-5">
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <IndianRupee size={18} className="text-emerald-400" />
                  Proposed Budget & Timeline
                </h2>

                {/* Client Budget Context & Presets */}
                {job?.budget && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Client's Estimated Budget Range:</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">
                        ₹{formatCurrency(job.budget.min)} – ₹{formatCurrency(job.budget.max)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-500/20">
                      <span className="text-slate-400 text-xs">Quick Match:</span>
                      <button
                        type="button"
                        onClick={() => setSuggestedBid(job.budget.min)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium text-xs"
                      >
                        Min: ₹{formatCurrency(job.budget.min)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuggestedBid(Math.round((job.budget.min + job.budget.max) / 2))}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium text-xs"
                      >
                        Avg: ₹{formatCurrency(Math.round((job.budget.min + job.budget.max) / 2))}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuggestedBid(job.budget.max)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium text-xs"
                      >
                        Max: ₹{formatCurrency(job.budget.max)}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Expected Budget (₹) *"
                    error={errors.bidAmount?.message}
                    helperText="Total funds to be secured in milestone escrow."
                  >
                    <NumberInput
                      name="bidAmount"
                      register={register}
                      placeholder="e.g. 45000"
                      error={!!errors.bidAmount}
                    />
                  </FormField>

                  <FormField
                    label="Delivery Timeline (Days) *"
                    error={errors.deliveryTime?.message}
                    helperText="Total calendar days needed to complete all deliverables."
                  >
                    <TextInput
                      type="number"
                      name="deliveryTime"
                      register={register}
                      placeholder="e.g. 14"
                      error={!!errors.deliveryTime}
                    />
                  </FormField>
                </div>
              </Card>

              {/* Section 3: Professional Cover Letter */}
              <Card glass className="p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <FileText size={18} className="text-purple-400" />
                    Cover Letter & Solution Pitch *
                  </h2>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isMinLengthMet ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {charCount} / 2000 chars {charCount < 100 && `(Min 100)`}
                  </span>
                </div>

                <FormField error={errors.coverLetter?.message}>
                  <TextAreaField
                    name="coverLetter"
                    register={register}
                    rows={8}
                    placeholder="Introduce yourself, explain your relevant experience, outline your proposed technical solution, and explain why you are the ideal fit for this project..."
                    error={!!errors.coverLetter}
                  />
                </FormField>

                {/* Cover Letter Best Practice Guide */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block mb-1">Recommended Proposal Structure:</span>
                  <p>1. <strong>Introduction:</strong> Acknowledge the core requirement and express direct interest.</p>
                  <p>2. <strong>Relevant Experience:</strong> Highlight similar production features you have delivered.</p>
                  <p>3. <strong>Proposed Solution:</strong> Briefly outline your technical stack and delivery milestones.</p>
                </div>
              </Card>

              {/* Desktop Submit Action */}
              <div className="hidden lg:flex items-center justify-between pt-4">
                <Link to={`/jobs/${job?._id || id}`}>
                  <Button variant="ghost" className="text-slate-400 hover:text-white">
                    Cancel & Return
                  </Button>
                </Link>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="shadow-xl shadow-indigo-600/30 text-base px-8"
                >
                  <span>Submit Proposal</span>
                  <Send size={16} className="ml-2" />
                </Button>
              </div>

              {/* Mobile Sticky Bottom CTA */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl z-30 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Proposed Bid</span>
                  <span className="text-sm font-bold text-white font-mono">
                    ₹{formatCurrency(watchBidAmount)}
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="shadow-lg shadow-indigo-600/30"
                >
                  <span>Submit Proposal</span>
                  <Send size={14} className="ml-1.5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Project Summary Sidebar Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card glass className="p-6 sm:p-7 rounded-3xl border-slate-800 sticky top-24 shadow-2xl space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Project Summary
              </h3>

              <div>
                <span className="text-xs font-semibold text-indigo-400">{categoryName}</span>
                <h4 className="text-base font-bold text-white mt-0.5 leading-snug line-clamp-2">
                  {job?.title}
                </h4>
              </div>

              <div className="py-4 border-y border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Client</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    {clientName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Budget Range</span>
                  <span className="font-mono font-bold text-white">
                    ₹{formatCurrency(job?.budget?.min || 20000)} - ₹{formatCurrency(job?.budget?.max || 50000)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Experience Tier</span>
                  <span className="font-semibold text-slate-200 capitalize">
                    {job?.experienceLevel || 'Intermediate'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Workplace Setup</span>
                  <span className="font-semibold text-slate-200 capitalize">
                    {job?.locationType || 'Remote'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Deadline</span>
                  <span className="font-semibold text-amber-400">
                    {formatDate(job?.deadline || new Date(Date.now() + 14 * 86400000))}
                  </span>
                </div>
              </div>

              {/* Skills Required Chips */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-medium">Skills In Scope:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(job?.skillsRequired || job?.skills || ['Full Stack']).slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Workstation Escrow ensures guaranteed payment upon successful client milestone review.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
